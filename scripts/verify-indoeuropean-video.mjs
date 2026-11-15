#!/usr/bin/env node
/** Read-only MP4 verification, with new evidence files beside the input. */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { homedir } from 'node:os';
import { basename, extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const input = process.argv[2];
if (!input || process.argv.length !== 3) {
  console.error('Usage: node scripts/verify-indoeuropean-video.mjs PATH.mp4');
  process.exit(2);
}
const target = resolve(input);
assert.equal(extname(target).toLowerCase(), '.mp4', 'The input must be an MP4 file.');
const stem = target.slice(0, -extname(target).length);
const metadataPath = `${stem}.json`;
const framesDirectory = `${stem}-verified-frames`;
const verificationPath = `${stem}-verification.json`;
const ffmpeg = process.env.FFMPEG_PATH || (process.platform === 'win32' ? 'C:/FFmpeg/bin/ffmpeg.exe' : 'ffmpeg');
const ffprobe = process.env.FFPROBE_PATH || (process.platform === 'win32' ? 'C:/FFmpeg/bin/ffprobe.exe' : 'ffprobe');
const expected = { codec: 'h264', pixelFormat: 'yuv420p', width: 1920, height: 1080, fps: 24,
  frames: null, frameCountSource: 'Completed export metadata', durationStrictlyBelowSeconds: 120 };
const report = {
  schemaVersion: 1, startedAt: new Date().toISOString(), target, metadataPath, verificationPath,
  framesDirectory, expected, passed: false, checks: [], extractedFrames: [], failures: [],
  scope: 'Container/codec validation, full decode, representative frame extraction and actual browser playback. This does not independently verify historical routes, populations, source interpretation or human visual acceptance.',
};

async function exists(path) {
  try { await access(path); return true; }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}
// Existing videos, verification reports and previously extracted frames are
// never replaced. Every ffmpeg extraction also uses its native -n safeguard.
if (await exists(verificationPath) || await exists(framesDirectory)) {
  console.error(`Refusing to overwrite existing verification artifacts: ${verificationPath} or ${framesDirectory}`);
  process.exit(2);
}

function requireCheck(name, condition, actual, expectation) {
  const check = { name, passed: Boolean(condition), actual, expected: expectation };
  report.checks.push(check);
  if (!condition) report.failures.push(`${name}: expected ${JSON.stringify(expectation)}, observed ${JSON.stringify(actual)}`);
  return check.passed;
}
function verifyPacing(metadata) {
  const playback = metadata.app?.playback, pacing = metadata.pacing, phases = playback?.phases;
  requireCheck('Adaptive timing disabled', playback?.adaptive === false && playback?.schedule === 'continuous',
    { adaptive: playback?.adaptive, schedule: playback?.schedule }, { adaptive: false, schedule: 'continuous' });
  const valid = Array.isArray(phases) && phases.length > 0 && phases.every(phase =>
    Number.isFinite(phase.from) && Number.isFinite(phase.to) && phase.to > phase.from
    && Number.isFinite(phase.yearsPerSecond) && phase.yearsPerSecond > 0);
  requireCheck('Chronological phase clock', valid, phases, 'Positive, finite phase intervals and rates');
  if (!valid) return;
  const normalized = value => Array.isArray(value) ? value.map(phase => phase && typeof phase === 'object'
    ? [phase.from, phase.to, phase.yearsPerSecond] : null) : null;
  const range=metadata.app?.range;
  requireCheck('Phase clock covers the app range without gaps', Array.isArray(range) && range.length===2
    && phases[0].from===range[0] && phases.at(-1).to===range[1]
    && phases.every((phase,index)=>!index||phase.from===phases[index-1].to), normalized(phases), range);
  if(metadata.preparedDisplay?.playback)requireCheck('Prepared and runtime phase clocks agree',
    JSON.stringify(normalized(metadata.preparedDisplay.playback.phases))===JSON.stringify(normalized(phases)),
    normalized(phases),normalized(metadata.preparedDisplay.playback.phases));
  requireCheck('Export phase declarations agree', JSON.stringify(normalized(pacing?.phases)) === JSON.stringify(normalized(phases)),
    normalized(pacing?.phases), normalized(phases));
  requireCheck('Shared narrative phase clock', pacing?.clock === 'advanceNarrativePlayback', pacing?.clock, 'advanceNarrativePlayback');
  const animationSeconds = phases.reduce((sum, phase) => sum + (phase.to - phase.from) / phase.yearsPerSecond, 0);
  const frameTolerance = 1 / expected.fps + .000001;
  requireCheck('Phase animation duration', Number.isFinite(pacing?.animationSeconds)
    && Math.abs(pacing.animationSeconds - animationSeconds) <= frameTolerance,
    pacing?.animationSeconds, `${animationSeconds} seconds, within one frame for terminal clamping`);
  requireCheck('Historical duration uses the same clock', Number.isFinite(metadata.historicalDurationSeconds)
    && Math.abs(metadata.historicalDurationSeconds - animationSeconds) <= frameTolerance,
    metadata.historicalDurationSeconds, animationSeconds);
  const opening = pacing?.openingHoldSeconds, closing = pacing?.closingHoldSeconds;
  const validHolds = Number.isFinite(opening) && opening >= 0 && Number.isFinite(closing) && closing >= 0;
  requireCheck('Opening and closing holds declared consistently', validHolds
    && opening === metadata.openingHoldSeconds && closing === metadata.closingHoldSeconds,
    { opening, closing, topLevelOpening: metadata.openingHoldSeconds, topLevelClosing: metadata.closingHoldSeconds }, 'Matching nonnegative pacing and top-level holds');
  const animationFrames = metadata.animationFrames;
  requireCheck('Animation frame duration arithmetic', Number.isSafeInteger(animationFrames) && animationFrames > 1
    && Math.abs((animationFrames - 1) / expected.fps - animationSeconds) <= frameTolerance,
    animationFrames, 'Initial frame plus the two-phase timeline at 24 fps');
  const openingFrames = Math.round(opening * expected.fps), closingFrames = Math.round(closing * expected.fps);
  requireCheck('Full frame count includes every hold', validHolds
    && Math.abs(opening * expected.fps - openingFrames) < .000001
    && Math.abs(closing * expected.fps - closingFrames) < .000001
    && metadata.frames === animationFrames + openingFrames + closingFrames,
    { totalFrames: metadata.frames, animationFrames, openingFrames, closingFrames }, 'Integer holds + animation frames = total frames');
  const clock = pacing?.clockChecks;
  if(Array.isArray(clock?.phaseStats)){
    const counters=clock.phaseStats;
    const validCounters=counters.length===phases.length&&counters.every((counter,index)=>
      counter.from===phases[index].from&&counter.to===phases[index].to&&counter.yearsPerSecond===phases[index].yearsPerSecond
      &&Number.isSafeInteger(counter.steps)&&counter.steps>=0
      &&(!counter.steps||Number.isFinite(counter.minimumRate)&&Number.isFinite(counter.maximumRate)
        &&Math.abs(counter.minimumRate-phases[index].yearsPerSecond)<.000001
        &&Math.abs(counter.maximumRate-phases[index].yearsPerSecond)<.000001));
    requireCheck('Each measured phase uses its declared rate',validCounters,counters,phases);
    requireCheck('Every animation advance checked by exporter',validCounters&&Number.isSafeInteger(clock.steps)
      &&clock.steps===animationFrames-1&&Number.isSafeInteger(clock.crossingSteps)&&clock.crossingSteps>=0
      &&Number.isSafeInteger(clock.terminalSteps)&&clock.terminalSteps>=0&&clock.terminalSteps<=1
      &&counters.reduce((sum,counter)=>sum+counter.steps,0)+clock.crossingSteps+clock.terminalSteps===clock.steps,
      clock,'Every advance accounted for by a declared phase, boundary crossing or terminal clamp');
  }else{
    requireCheck('Every animation advance checked by legacy exporter',Number.isSafeInteger(clock?.steps)
      &&clock.steps===animationFrames-1&&clock.firstPhaseSteps>0&&clock.secondPhaseSteps>0
      &&clock.steps-clock.firstPhaseSteps-clock.secondPhaseSteps>=0&&clock.steps-clock.firstPhaseSteps-clock.secondPhaseSteps<=2,
      clock,'Legacy two-phase counters account for all advances');
    requireCheck('Measured legacy second-phase rate matches its declaration',phases.length===2
      &&Number.isFinite(clock?.secondPhaseMin)&&Number.isFinite(clock?.secondPhaseMax)
      &&Math.abs(clock.secondPhaseMin-phases[1].yearsPerSecond)<.000001&&Math.abs(clock.secondPhaseMax-phases[1].yearsPerSecond)<.000001,
      {minimum:clock?.secondPhaseMin,maximum:clock?.secondPhaseMax},phases[1]?.yearsPerSecond);
  }
  if (metadata.app?.clockChecks !== undefined) requireCheck('App and export clock proof agree',
    JSON.stringify(metadata.app.clockChecks) === JSON.stringify(clock), metadata.app.clockChecks, clock);
  requireCheck('First movement occurs within the video', Number.isFinite(pacing?.firstMovementByVideoSeconds)
    && pacing.firstMovementByVideoSeconds >= opening && pacing.firstMovementByVideoSeconds < metadata.durationSeconds,
    pacing?.firstMovementByVideoSeconds, 'After the opening hold and before the video ends');

  // Independently check the actual encoded-batch timestamps, including batches
  // that cross the phase boundary and both endpoint holds.
  const discrepancies = [], checkpoints = metadata.checks ?? [];
  let previousFrame = -1;
  for (const checkpoint of checkpoints) {
    if (!Number.isSafeInteger(checkpoint.frame) || checkpoint.frame <= previousFrame || checkpoint.frame >= metadata.frames
      || !Number.isFinite(checkpoint.year)) { discrepancies.push({ frame: checkpoint.frame, year: checkpoint.year, reason: 'Invalid or nonmonotonic encoded checkpoint' }); continue; }
    previousFrame = checkpoint.frame;
    let remaining = Math.max(0, Math.min(animationFrames - 1, checkpoint.frame - openingFrames)) / expected.fps;
    let year = phases[0].from;
    for (const phase of phases) {
      const duration = (phase.to - phase.from) / phase.yearsPerSecond;
      if (remaining >= duration) { year = phase.to; remaining -= duration; }
      else { year = phase.from + remaining * phase.yearsPerSecond; break; }
    }
    const toleranceYears = Math.max(...phases.map(phase => phase.yearsPerSecond)) / expected.fps + .000001;
    if (Math.abs(checkpoint.year - year) > toleranceYears) discrepancies.push({ frame: checkpoint.frame, actualYear: checkpoint.year, expectedYear: year });
  }
  requireCheck('Encoded checkpoints follow the declared phases', checkpoints.length > 0 && discrepancies.length === 0
    && checkpoints.at(-1).frame === metadata.frames - 1, discrepancies, 'All encoded-batch years match the phase clock and final frame');
  report.pacing = { ...pacing, analyticAnimationSeconds: animationSeconds, encodedCheckpoints: checkpoints.length, discrepancies };
}
function verifySteadyCamera(metadata) {
  if (metadata.app?.cameraFollow !== 'steady') {
    report.cameraAudit = { mode: metadata.app?.cameraFollow ?? null, status: 'Steady mode not declared; steady-only invariants do not apply.' };
    return;
  }
  const track = metadata.cameraTrack;
  const complete = Array.isArray(track) && track.length === metadata.animationFrames;
  requireCheck('Steady camera covers every unique animation frame', complete,
    Array.isArray(track) ? track.length : null, metadata.animationFrames);
  if (!Array.isArray(track) || !track.length) return;
  const invalid = track.flatMap((frame, index) => {
    const valid = frame && Number.isFinite(frame.year) && Number.isFinite(frame.zoom)
      && Array.isArray(frame.center) && frame.center.length === 2 && frame.center.every(Number.isFinite)
      && Math.abs(frame.center[1]) <= 85.05112878;
    return valid ? [] : [{ index, frame }];
  });
  requireCheck('Steady camera vectors are finite Mercator coordinates', invalid.length === 0,
    invalid.slice(0, 20), 'Finite year, zoom and two-element center with valid Mercator latitude');
  const outside = track.flatMap((frame, index) => frame?.inside === true ? [] : [{ index, year: frame?.year, inside: frame?.inside }]);
  requireCheck('Steady camera contains all occupied populations', outside.length === 0, outside.slice(0, 20), []);
  if (invalid.length) return;
  const nonchronological = [], zoomIncreases = [], movements = [];
  const opening = metadata.pacing?.openingHoldSeconds ?? metadata.openingHoldSeconds;
  const mercatorY = latitude => (1 - Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360)) / Math.PI) / 2;
  for (let index = 1; index < track.length; index++) {
    const before = track[index - 1], frame = track[index];
    if (!(frame.year > before.year)) nonchronological.push({ index, before: before.year, after: frame.year });
    const zoomDelta = frame.zoom - before.zoom;
    const numericEpsilon = 1e-10; // Same floating-point tolerance as the real-camera regression.
    if (zoomDelta > numericEpsilon) zoomIncreases.push({ index, year: frame.year, before: before.zoom, after: frame.zoom, delta: zoomDelta });
    const worldPixels = 512 * 2 ** Math.min(before.zoom, frame.zoom);
    const dy = mercatorY(frame.center[1]) - mercatorY(before.center[1]);
    const dx = (frame.center[0] - before.center[0]) / 360;
    movements.push({ index, videoSeconds: opening + index / expected.fps, year: frame.year,
      dyMercator: dy, dyPixels: dy * worldPixels, dxPixels: dx * worldPixels,
      panPixels: Math.hypot(dx, dy) * worldPixels, zoomDelta });
  }
  requireCheck('Steady camera chronology is strictly increasing', nonchronological.length === 0, nonchronological.slice(0, 20), []);
  requireCheck('Steady camera never zooms inward', zoomIncreases.length === 0, zoomIncreases.slice(0, 20), 'No zoom increase beyond floating-point rounding');
  requireCheck('Steady camera covers the full historical range', Math.abs(track[0].year + 4500) < .000001
    && Math.abs(track.at(-1).year - 1000) < .000001, [track[0].year, track.at(-1).year], [-4500, 1000]);
  const windowStart = 0, windowEnd = metadata.durationSeconds;
  const selectedSteps = (from, to) => movements.filter(move => move.videoSeconds - 1 / expected.fps >= from - 1e-9 && move.videoSeconds <= to + 1e-9);
  const measureMotion = (from, to) => {
    const steps = selectedSteps(from, to), pans = steps.map(move => -move.dyPixels);
    const significant = pans.filter(pan => Math.abs(pan) > .2);
    return { fromSeconds: from, toSeconds: to, frameSteps: steps.length,
      maxStepPixels: Math.max(0, ...pans.map(Math.abs)), totalTravelPixels: pans.reduce((sum, pan) => sum + Math.abs(pan), 0),
      significantStepThresholdPixels: .2,
      significantReversals: significant.slice(1).filter((pan, index) => pan * significant[index] < 0).length };
  };
  const phaseMotion = (metadata.pacing?.phases??[]).map(phase=>{
    const start=opening+(metadata.pacing.phases??[]).filter(p=>p.to<=phase.from).reduce((sum,p)=>sum+(p.to-p.from)/p.yearsPerSecond,0);
    return {...measureMotion(start,start+(phase.to-phase.from)/phase.yearsPerSecond),historicalRange:[phase.from,phase.to]};
  });
  const fullMotion=measureMotion(windowStart,windowEnd);
  const inWindow = selectedSteps(windowStart, windowEnd);
  const reversals = [], numericalReturns = [];
  for (let index = 0; index < movements.length - 1; index++) {
    const a = movements[index], b = movements[index + 1];
    if (a.videoSeconds < windowStart || a.videoSeconds > windowEnd || !(a.dyMercator * b.dyMercator < 0)) continue;
    const middle = track[a.index], before = track[a.index - 1], after = track[b.index];
    const scale = 512 * 2 ** Math.min(before.zoom, middle.zoom, after.zoom);
    const residual = Math.abs(a.dyMercator + b.dyMercator);
    const amplitude = Math.min(Math.abs(a.dyMercator), Math.abs(b.dyMercator));
    const item = { peakFrame: a.index, videoSeconds: a.videoSeconds, year: middle.year,
      beforeLatitude: before.center[1], peakLatitude: middle.center[1], afterLatitude: after.center[1],
      firstLegPixels: a.dyMercator * scale, secondLegPixels: b.dyMercator * scale,
      pairedAmplitudePixels: amplitude * scale, twoFrameResidualPixels: residual * scale,
      recoveryFraction: 1 - residual / Math.max(Math.abs(a.dyMercator), Math.abs(b.dyMercator)) };
    reversals.push(item);
    const numericEpsilon = Number.EPSILON * 64;
    if (residual <= numericEpsilon && amplitude > numericEpsilon) numericalReturns.push(item);
  }
  const visibleOneFrameReturns = numericalReturns.filter(item => item.pairedAmplitudePixels > 1);
  requireCheck('Steady camera has no visible paired one-frame vertical returns', visibleOneFrameReturns.length === 0,
    visibleOneFrameReturns, 'No numerical out-and-back pair with amplitude >1px anywhere in the video');
  const largest = (items, field) => [...items].sort((a, b) => Math.abs(b[field]) - Math.abs(a[field])).slice(0, 20);
  report.cameraAudit = { mode: 'steady', trackFrames: track.length, expectedAnimationFrames: metadata.animationFrames,
    windowSeconds: [windowStart, windowEnd], windowFrameSteps: inWindow.length,
    source: 'Independent metrics from the recorded unique-frame camera track; Mercator latitude difference×512×2^min(pair zoom), matching the steady-camera regression test.',
    motionWindows: [...phaseMotion, fullMotion],
    zoomIncreaseCount: zoomIncreases.length,
    maximumZoomIncrease: Math.max(0, ...movements.map(move => move.zoomDelta)),
    maximumAbsoluteVerticalFrameMotionPixels: Math.max(0, ...inWindow.map(move => Math.abs(move.dyPixels))),
    maximumPanFrameMotionPixels: Math.max(0, ...inWindow.map(move => move.panPixels)),
    largestFrameMotions: largest(inWindow, 'panPixels'), verticalReversalCount: reversals.length,
    largestVerticalReversals: largest(reversals, 'pairedAmplitudePixels'),
    numericalOneFrameReturnCount: numericalReturns.length, numericalOneFrameReturns: numericalReturns,
    visibleOneFrameReturnCount: visibleOneFrameReturns.length,
    bounceAssessment: 'All unique frames cover the full encoded timeline; camera vectors remain finite, populations contained and zoom nonincreasing. Paired one-frame vertical returns above 1px are rejected everywhere. Smooth intended expansions are reported by phase.' };
}
function verifyMotionProof(metadata) {
  if (metadata.exportEdition !== 'visible-travel-regional-spread') return;
  const proof=metadata.motionProof,trip=proof?.firstTrip,spread=proof?.settlementSpread;
  const phases=metadata.pacing?.phases??[],opening=metadata.openingHoldSeconds;
  const seconds=year=>opening+phases.reduce((sum,phase)=>sum+Math.max(0,Math.min(year,phase.to)-phase.from)/phase.yearsPerSecond,0);
  const coordinate=point=>Array.isArray(point)&&point.length===2&&point.every(Number.isFinite);
  const distance=(a,b)=>{
    if(!coordinate(a)||!coordinate(b))return NaN;
    const radians=Math.PI/180,dLat=(b[1]-a[1])*radians,dLon=(b[0]-a[0])*radians;
    const h=Math.sin(dLat/2)**2+Math.cos(a[1]*radians)*Math.cos(b[1]*radians)*Math.sin(dLon/2)**2;
    return 6371*2*Math.atan2(Math.sqrt(Math.max(0,h)),Math.sqrt(Math.max(0,1-h)));
  };
  requireCheck('Actual Engine movement proof retained',typeof proof?.source==='string'&&proof.source.includes('Engine.frame')&&Boolean(trip&&spread),proof?.source??null,'Compiled transferEvents and actual uncropped Engine.frame coordinates');
  const validTrip=trip&&[trip.departure,trip.arrival,trip.durationSeconds,trip.movingFrames].every(Number.isFinite)&&trip.arrival>trip.departure;
  requireCheck('First actual trip lasts at least two seconds',validTrip&&trip.durationSeconds>=2-1e-7&&trip.movingFrames>=2*expected.fps
    &&Math.abs(trip.durationSeconds-(seconds(trip.arrival)-seconds(trip.departure)))<1e-6,
    trip?{departure:trip.departure,arrival:trip.arrival,seconds:trip.durationSeconds,movingFrames:trip.movingFrames}:null,'At least two seconds and 48 encoded moving frames under the declared clock');
  const moving=trip?.during;
  const validMoving=Array.isArray(moving)&&moving.length>=5&&moving.every((sample,index)=>sample.state===1&&coordinate(sample.coord)
    &&Number.isFinite(sample.year)&&Number.isFinite(sample.people)&&sample.people>0
    &&Math.abs(sample.videoSeconds-seconds(sample.year))<1e-6&&sample.fromSlot===trip.before?.slot&&sample.toSlot===trip.after?.slot
    &&(!index||sample.year>moving[index-1].year));
  const travelKm=validMoving?distance(moving[1].coord,moving.at(-2).coord):null;
  requireCheck('First-trip proof follows one real moving dot',validMoving&&travelKm>=1,{samples:moving,quarterToThreeQuarterKm:travelKm},'Chronological state=1 samples with the same source/destination slots and visible geographic movement');
  const sourceHandover=validMoving?distance(trip.before?.coord,moving[0].coord):NaN;
  const destinationHandover=validMoving?distance(moving.at(-1).coord,trip.after?.coord):NaN;
  requireCheck('First trip hands over from and to its real resident slots',validMoving&&sourceHandover<=1&&destinationHandover<=2
    &&trip.before.year<trip.departure&&trip.after.year>trip.arrival,
    {sourceHandoverKm:sourceHandover,destinationHandoverKm:destinationHandover},'Source within 1km and arrival within 2km, before/after the event');
  const samples=spread?.samples;
  const validSpread=spread&&Array.isArray(samples)&&samples.length>=5&&samples.every((sample,index)=>coordinate(sample.coord)
    &&sample.slot===spread.slot&&sample.originKind==='arrival'&&Math.abs(sample.originYear-spread.arrival)<1e-6
    &&Math.abs(sample.people-spread.people)<.01&&Math.abs(sample.videoSeconds-seconds(sample.year))<1e-6
    &&(!index||sample.year>samples[index-1].year));
  const spreadKm=validSpread?distance(samples[0].coord,samples.at(-1).coord):null;
  requireCheck('One arriving occupation progressively spreads after arrival',validSpread&&spreadKm>=1
    &&Number.isFinite(spread.dispersionYears)&&spread.dispersionYears>0
    &&Math.abs(spread.dispersionSeconds-(seconds(spread.arrival+spread.dispersionYears)-seconds(spread.arrival)))<1e-6,
    {spread,independentDisplacementKm:spreadKm},'The same arrival occupation and constant people move at least 1km across five post-arrival samples; a reused slot does not qualify');
  const budgets=proof?.eventBudget;
  requireCheck('Every migration event budget is conserved',Array.isArray(budgets)&&budgets.length===metadata.app?.migrations
    &&budgets.every(item=>Number.isFinite(item.declaredPeople)&&item.declaredPeople>0&&Number.isFinite(item.eventPeople)
      &&Math.abs(item.declaredPeople-item.eventPeople)<.01&&Number.isSafeInteger(item.events)&&item.events>0&&item.sourceExists&&item.destinationExists),
    budgets,'Every declared transfer equals the sum of actual per-dot event weights, with real source/destination stocks');
  const mass=proof?.displayMassAudit;
  requireCheck('Displayed people match standing plus travelling ledger balances',Array.isArray(mass)&&mass.length>=5
    &&mass.every(item=>[item.year,item.paintedPeople,item.modelPeople,item.differencePeople,item.tolerancePeople].every(Number.isFinite)
      &&item.paintedPeople>=0&&item.modelPeople>=0&&item.tolerancePeople>0
      &&Math.abs(item.paintedPeople-item.modelPeople)<=item.tolerancePeople
      &&Math.abs(item.differencePeople-(item.paintedPeople-item.modelPeople))<.01),mass,'Independent ledger balances match actual Engine dot weights; older per-year counts are not imposed');
  const hashes=metadata.sourceHashes;
  requireCheck('Standing-slot and settlement-dispersal sources are hashed',['src/sim/standing-slots.ts','src/sim/settlement-dispersal.ts'].every(file=>/^[a-f0-9]{64}$/i.test(hashes?.[file]??'')),
    Object.fromEntries(['src/sim/standing-slots.ts','src/sim/settlement-dispersal.ts'].map(file=>[file,hashes?.[file]??null])),'SHA256 retained for both simulation helpers');
  const prepared=metadata.preparedDisplay,app=metadata.app;
  requireCheck('Prepared outlined-dot display matches runtime',prepared&&prepared.dotScale===app.dotScale&&prepared.dotScale===app.preparedDotScale
    &&JSON.stringify(prepared.dotStyle)===JSON.stringify(app.dotStyle),{preparedScale:prepared?.dotScale,runtimeScale:app.dotScale,style:app.dotStyle},prepared);
  const context=app.residentContext,introductions=context?.introductions,checks=metadata.checks??[];
  requireCheck('Resident context is explicitly labelled',typeof context?.label==='string'&&context.label.length>0&&/^#[a-f0-9]{6}$/i.test(context.color)
    &&Array.isArray(introductions)&&introductions.length>0&&introductions.every(item=>Number.isFinite(item.start)&&Number.isFinite(item.end)&&item.end>item.start&&typeof item.label==='string'&&item.label.length>0),context,'Named grey local communities and dated introductory captions');
  const captionErrors=checks.flatMap(check=>{
    const intro=introductions?.filter(item=>item.start<=check.year&&check.year<item.end).at(-1);
    if(!intro)return check.residentIntroduction? [{year:check.year,unexpected:check.residentIntroduction}]:[];
    const prefix=check.captionContext?.replace(/…$/,'');
    return check.residentIntroduction===intro.label&&prefix&&intro.label.startsWith(prefix)&&check.legendLabels?.includes(context.label)?[]:
      [{year:check.year,expected:intro.label,actual:check.residentIntroduction,caption:check.captionContext,legend:check.legendLabels}];
  });
  const activeCaptionChecks=checks.filter(check=>Boolean(check.residentIntroduction));
  requireCheck('Resident introductions appear as captions with a grey key',activeCaptionChecks.length>0&&captionErrors.length===0,{activeCaptionChecks:activeCaptionChecks.length,errors:captionErrors},'Active introductions replace the compact model line and include the local-community legend key');
  report.motionAudit={source:proof?.source,firstTripSeconds:trip?.durationSeconds,firstTripMovingFrames:trip?.movingFrames,
    quarterToThreeQuarterKm:travelKm,postArrivalDisplacementKm:spreadKm,eventBudgets:budgets?.length,massCheckYears:mass?.map(item=>item.year),
    activeCaptionChecks:activeCaptionChecks.length,interpretation:'Coordinates and budgets are actual Engine outputs. Decoded proof frames still require passive visual inspection; these checks do not establish historical verification.'};
}
async function stage(name, operation) {
  const started = Date.now();
  console.log(JSON.stringify({ phase: name, status: 'running' }));
  try {
    const result = await operation();
    report.checks.push({ name, passed: true, elapsedSeconds: (Date.now() - started) / 1000 });
    console.log(JSON.stringify({ phase: name, status: 'passed' }));
    return result;
  } catch (error) {
    const failure = error.stack || String(error);
    report.checks.push({ name, passed: false, elapsedSeconds: (Date.now() - started) / 1000, failure });
    report.failures.push(`${name}: ${error.message || error}`);
    console.error(JSON.stringify({ phase: name, status: 'failed', failure: error.message || String(error) }));
    return undefined;
  }
}
function run(executable, args, maxOutput = 4 * 1024 * 1024) {
  return new Promise((resolveCommand, rejectCommand) => {
    const child = spawn(executable, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    child.stdout.on('data', data => { stdout = (stdout + data).slice(-maxOutput); });
    child.stderr.on('data', data => { stderr = (stderr + data).slice(-maxOutput); });
    child.once('error', rejectCommand);
    child.once('close', (code, signal) => {
      const result = { executable, args, code, signal, stdout, stderr };
      if (code === 0) resolveCommand(result);
      else {
        const error = new Error(`${basename(executable)} exited ${code ?? signal}: ${stderr.trim()}`);
        error.command = result; rejectCommand(error);
      }
    });
  });
}
function rational(value) {
  const [a, b = '1'] = String(value).split('/');
  return Number(a) / Number(b);
}
async function hashFile(file) {
  const hash = createHash('sha256');
  for await (const data of createReadStream(file)) hash.update(data);
  return hash.digest('hex');
}

/** Only the requested completed MP4 is exposed on an ephemeral loopback port. */
async function verifyBrowser(durationSeconds) {
  let puppeteer;
  try { puppeteer = (await import('puppeteer')).default; }
  catch { puppeteer = (await import(pathToFileURL(join(homedir(), 'node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js')).href)).default; }
  const videoStat = await stat(target);
  const requests = [];
  const sockets = new Set();
  const server = createServer((request, response) => {
    const path = new URL(request.url, 'http://127.0.0.1').pathname;
    if (path === '/') {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end('<!doctype html><meta charset="utf-8"><title>Local MP4 verification</title><video id="video" width="640" height="360" muted playsinline controls preload="auto" src="/video.mp4"></video>');
      return;
    }
    if (path !== '/video.mp4') { response.writeHead(404); response.end(); return; }
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
    let start = 0, end = videoStat.size - 1, status = 200;
    if (request.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if (!match || (!match[1] && !match[2])) {
        response.writeHead(416, { 'Content-Range': `bytes */${videoStat.size}` }); response.end(); return;
      }
      if (!match[1]) start = Math.max(0, videoStat.size - Number(match[2]));
      else start = Number(match[1]);
      end = match[1] && match[2] ? Math.min(Number(match[2]), end) : end;
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= videoStat.size) {
        response.writeHead(416, { 'Content-Range': `bytes */${videoStat.size}` }); response.end(); return;
      }
      status = 206;
    }
    const headers = { 'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Cache-Control': 'no-store' };
    if (status === 206) headers['Content-Range'] = `bytes ${start}-${end}/${videoStat.size}`;
    requests.push({ method: request.method, range: request.headers.range ?? null, status });
    response.writeHead(status, headers);
    if (request.method === 'HEAD') { response.end(); return; }
    const stream = createReadStream(target, { start, end });
    stream.on('error', error => response.destroy(error));
    response.on('close', () => stream.destroy());
    stream.pipe(response);
  });
  server.on('connection', socket => { sockets.add(socket); socket.once('close', () => sockets.delete(socket)); });
  let browser;
  try {
    await new Promise((resolveListen, rejectListen) => {
      server.once('error', rejectListen); server.listen(0, '127.0.0.1', resolveListen);
    });
    browser = await puppeteer.launch({ headless: true, timeout: 120000, protocolTimeout: 60000,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
      defaultViewport: { width: 680, height: 420, deviceScaleFactor: 1 } });
    const page = await browser.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const metadata = await page.evaluate(async () => {
      const video = document.getElementById('video');
      if (video.readyState < 1) await new Promise((resolveEvent, rejectEvent) => {
        const timer = setTimeout(() => rejectEvent(new Error('loadedmetadata timeout')), 30000);
        video.addEventListener('loadedmetadata', () => { clearTimeout(timer); resolveEvent(); }, { once: true });
        video.addEventListener('error', () => { clearTimeout(timer); rejectEvent(new Error(`Video metadata error ${video.error?.code}: ${video.error?.message}`)); }, { once: true });
      });
      return { width: video.videoWidth, height: video.videoHeight, duration: video.duration, codecSupport: video.canPlayType('video/mp4; codecs="avc1.640028"') };
    });
    assert.equal(metadata.width, expected.width); assert.equal(metadata.height, expected.height);
    assert.ok(Math.abs(metadata.duration - durationSeconds) < .15, 'Browser duration must agree with ffprobe.');
    assert.ok(metadata.duration > 0 && metadata.duration < expected.durationStrictlyBelowSeconds,
      'Actual browser duration must be strictly below 120 seconds.');
    assert.ok(metadata.codecSupport, 'Browser must report AVC/MP4 support.');
    const playback = await page.evaluate(async () => {
      const video = document.getElementById('video'), before = video.currentTime;
      await video.play();
      await new Promise((resolveProgress, rejectProgress) => {
        const began = performance.now();
        const check = () => {
          if (video.error) rejectProgress(new Error(`Playback error ${video.error.code}: ${video.error.message}`));
          else if (video.currentTime - before >= .35) resolveProgress();
          else if (performance.now() - began > 15000) rejectProgress(new Error('Playback currentTime did not advance.'));
          else setTimeout(check, 40);
        }; check();
      });
      video.pause();
      return { before, after: video.currentTime, advanced: video.currentTime - before, readyState: video.readyState, decodedFrames: video.getVideoPlaybackQuality?.().totalVideoFrames ?? null };
    });
    assert.ok(playback.advanced >= .35, 'Actual browser playback must advance.');
    const seeks = [];
    for (const [label, time] of [['midpoint', metadata.duration / 2], ['near-end', Math.max(0, metadata.duration - .2)]]) {
      const seek = await page.evaluate(async ({ label, time }) => {
        const video = document.getElementById('video');
        await new Promise((resolveSeek, rejectSeek) => {
          const timer = setTimeout(() => rejectSeek(new Error(`Seek timeout at ${label}`)), 20000);
          video.addEventListener('seeked', () => { clearTimeout(timer); resolveSeek(); }, { once: true });
          video.addEventListener('error', () => { clearTimeout(timer); rejectSeek(new Error(`Seek error at ${label}: ${video.error?.message}`)); }, { once: true });
          video.currentTime = time;
        });
        return { label, requestedTime: time, currentTime: video.currentTime, readyState: video.readyState, seeking: video.seeking };
      }, { label, time });
      assert.ok(Math.abs(seek.currentTime - time) < .15, `${label} seek must reach its target.`);
      assert.ok(seek.readyState >= 2 && !seek.seeking, `${label} seek must leave a decoded current frame.`);
      seeks.push(seek);
    }
    const ended = await page.evaluate(async () => {
      const video = document.getElementById('video');
      await video.play();
      await new Promise((resolveEnd, rejectEnd) => {
        const timer = setTimeout(() => rejectEnd(new Error('Video did not end after the near-end seek.')), 10000);
        if (video.ended) { clearTimeout(timer); resolveEnd(); }
        else video.addEventListener('ended', () => { clearTimeout(timer); resolveEnd(); }, { once: true });
      });
      return { ended: video.ended, currentTime: video.currentTime, duration: video.duration };
    });
    assert.equal(ended.ended, true); assert.deepEqual(errors, []);
    return { passed: true, userAgent: await browser.userAgent(), metadata, playback, seeks, ended, requests, errors,
      mode: 'Isolated headless browser and ephemeral loopback file server; no desktop/input control.' };
  } finally {
    try { if (browser) await browser.close(); }
    finally {
      for (const socket of sockets) socket.destroy();
      await new Promise(resolveClose => server.close(resolveClose));
    }
  }
}

let initialStat;
try {
  const metadataBytes = await readFile(metadataPath), metadataContainer = JSON.parse(metadataBytes.toString('utf8'));
  const metadata = metadataContainer.report ?? metadataContainer;
  // A missing/failure metadata file signals an encoder may still be running.
  // Do not compete with it or inspect a partially written video.
  assert.equal(metadata.completed, true, 'Export metadata must say completed=true before video verification.');
  assert.equal(metadata.checkOnly, false, 'A check-only render is not a completed MP4 export.');
  assert.ok(Number.isSafeInteger(metadata.frames) && metadata.frames > 0, 'Completed export metadata must declare a positive integer frame count.');
  assert.ok(Number.isFinite(metadata.durationSeconds) && metadata.durationSeconds > 0, 'Completed export metadata must declare a positive duration.');
  expected.frames = metadata.frames;
  initialStat = await stat(target); assert.ok(initialStat.isFile() && initialStat.size > 0);
  report.metadata = { sha256: createHash('sha256').update(metadataBytes).digest('hex'), completed: metadata.completed,
    model: metadata.model, app: metadata.app, frames: metadata.frames, durationSeconds: metadata.durationSeconds,
    renderChecks: metadata.checks?.length ?? 0, sourceChanges: metadata.sourceChanges ?? [] };
  requireCheck('Metadata frame target derived from export', expected.frames / expected.fps < expected.durationStrictlyBelowSeconds,
    expected.frames, `Positive integer with frames/24 strictly below ${expected.durationStrictlyBelowSeconds} seconds`);
  requireCheck('Metadata FPS', metadata.fps === expected.fps, metadata.fps, expected.fps);
  requireCheck('Metadata resolution', JSON.stringify(metadata.resolution) === '[1920,1080]', metadata.resolution, [1920, 1080]);
  requireCheck('Metadata duration arithmetic', Math.abs(metadata.durationSeconds - expected.frames / expected.fps) < .000001, metadata.durationSeconds, expected.frames / expected.fps);
  requireCheck('Metadata strict runtime limit', metadata.durationSeconds < expected.durationStrictlyBelowSeconds,
    metadata.durationSeconds, `< ${expected.durationStrictlyBelowSeconds} seconds including all holds`);
  requireCheck('Metadata full atlas interval', JSON.stringify(metadata.app?.range) === '[-4500,1000]', metadata.app?.range, [-4500, 1000]);
  requireCheck('Metadata dot unit', metadata.app?.peoplePerDot === 1000, metadata.app?.peoplePerDot, 1000);
  requireCheck('Metadata model agrees with runtime selection', typeof metadata.model === 'string' && metadata.model.length>0 && metadata.model === metadata.app?.model, metadata.model, metadata.app?.model);
  requireCheck('Metadata render errors', !(metadata.errors?.length || metadata.localFailures?.length), { errors: metadata.errors ?? [], localFailures: metadata.localFailures ?? [] }, { errors: [], localFailures: [] });
  requireCheck('Metadata occupied-population checks', Array.isArray(metadata.checks) && metadata.checks.length > 0 && metadata.checks.every(check => check.inside === true), metadata.checks?.filter(check => check.inside !== true) ?? null, []);
  const changes = metadata.sourceChanges;
  const phaseHelperFile = 'src/time/phase-pacing.ts';
  const audit = metadata.sourceAudit;
  const unchanged = Array.isArray(changes) && changes.length === 0;
  const auditedPhaseChange = Array.isArray(changes) && changes.length === 1 && changes[0] === phaseHelperFile
    && audit?.passed === true && Number.isFinite(audit.maxYearDrift) && audit.maxYearDrift >= 0 && audit.maxYearDrift <= .000001
    && Number.isSafeInteger(audit.checkedFrames) && audit.checkedFrames === metadata.frames
    && typeof audit.currentSha256 === 'string' && /^[a-f0-9]{64}$/i.test(audit.currentSha256)
    && audit.currentSha256 === metadata.sourceHashesAfter?.[phaseHelperFile]
    && (audit.file === undefined || audit.file === phaseHelperFile);
  const steadyFiles = ['src/main.ts', 'src/data/loader.ts'];
  const auditedSteadyChange = metadata.app?.cameraFollow === 'steady'
    && Array.isArray(changes) && changes.length === steadyFiles.length && steadyFiles.every(file => changes.includes(file))
    && audit?.passed === true && Number.isSafeInteger(audit.checkedFrames) && audit.checkedFrames === metadata.frames
    && Number.isSafeInteger(audit.checkedAnimationFrames) && audit.checkedAnimationFrames === metadata.animationFrames
    && Number.isFinite(audit.maxYearDrift) && audit.maxYearDrift >= 0 && audit.maxYearDrift <= .000001
    && Number.isFinite(audit.maxCameraPixelDrift) && audit.maxCameraPixelDrift >= 0 && audit.maxCameraPixelDrift <= .000001
    && Number.isFinite(audit.maxZoomDrift) && audit.maxZoomDrift >= 0 && audit.maxZoomDrift <= 1e-9
    && audit.currentSha256ByFile !== null && typeof audit.currentSha256ByFile === 'object' && !Array.isArray(audit.currentSha256ByFile)
    && steadyFiles.every(file => typeof audit.currentSha256ByFile[file] === 'string' && /^[a-f0-9]{64}$/i.test(audit.currentSha256ByFile[file])
      && audit.currentSha256ByFile[file] === metadata.sourceHashesAfter?.[file]);
  requireCheck('Source snapshot stable or narrowly audited shared change', unchanged || auditedPhaseChange || auditedSteadyChange,
    { sourceChanges: changes, sourceAudit: audit ?? null },
    'No changes; or only the phase helper with a complete matching year audit; or exactly main.ts+loader.ts in steady mode with full frame/camera replay, bounded year/pixel/zoom drift and matching post-export hashes. No other changed file is allowed.');
  if (audit !== undefined) report.sourceAudit = audit;
  if (auditedPhaseChange) report.warnings = [
    `The shared phase-pacing helper changed during export. An independent audit checked all ${audit.checkedFrames} encoded-frame years, with maximum drift ${audit.maxYearDrift}, against the matching post-export helper snapshot. Original sourceChanges are retained.`,
  ];
  if (auditedSteadyChange) report.warnings = [
    `Shared src/main.ts and src/data/loader.ts changed during export. An independent current-engine replay checked all ${audit.checkedAnimationFrames} animation frames and ${audit.checkedFrames} encoded frames: maximum year drift ${audit.maxYearDrift}, camera-pixel drift ${audit.maxCameraPixelDrift}, zoom drift ${audit.maxZoomDrift}. Both audited current hashes match the post-export snapshots. Original sourceChanges are retained.`,
  ];
  verifyPacing(metadata);
  verifySteadyCamera(metadata);
  verifyMotionProof(metadata);
  report.tileFailures = metadata.tileFailures ?? [];
  if (report.tileFailures.length) (report.warnings ??= []).push('The export metadata records tile-request failures; inspect whether the final video contains missing imagery.');

  const probe = await stage('ffprobe complete frame count', async () => {
    const result = await run(ffprobe, ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,pix_fmt,width,height,avg_frame_rate,r_frame_rate,nb_frames,nb_read_frames,duration:format=duration,size,format_name', '-of', 'json', target]);
    const value = JSON.parse(result.stdout); assert.ok(value.streams?.[0], 'A video stream is required.');
    assert.equal(result.stderr.trim(), '', 'ffprobe must not report decoding errors.');
    return value;
  });
  report.probe = probe;
  const stream = probe?.streams?.[0];
  if (stream) {
    requireCheck('Video codec', stream.codec_name === expected.codec, stream.codec_name, expected.codec);
    requireCheck('Video pixel format', stream.pix_fmt === expected.pixelFormat, stream.pix_fmt, expected.pixelFormat);
    requireCheck('Video dimensions', stream.width === expected.width && stream.height === expected.height, [stream.width, stream.height], [expected.width, expected.height]);
    requireCheck('Average frame rate', Math.abs(rational(stream.avg_frame_rate) - expected.fps) < .000001, stream.avg_frame_rate, '24/1');
    requireCheck('Nominal frame rate', Math.abs(rational(stream.r_frame_rate) - expected.fps) < .000001, stream.r_frame_rate, '24/1');
    requireCheck('Decoded frame count', Number(stream.nb_read_frames) === expected.frames, stream.nb_read_frames, expected.frames);
    if (stream.nb_frames !== undefined) requireCheck('Container frame count', Number(stream.nb_frames) === expected.frames, stream.nb_frames, expected.frames);
    requireCheck('Container duration agrees with metadata', Math.abs(Number(probe.format?.duration) - metadata.durationSeconds) < .1, Number(probe.format?.duration), metadata.durationSeconds);
    requireCheck('Actual MP4 strict runtime limit', Number(probe.format?.duration) > 0 && Number(probe.format?.duration) < expected.durationStrictlyBelowSeconds,
      Number(probe.format?.duration), `< ${expected.durationStrictlyBelowSeconds} seconds`);
    if (stream.duration !== undefined) requireCheck('Stream duration agrees with metadata', Math.abs(Number(stream.duration) - metadata.durationSeconds) < .1, Number(stream.duration), metadata.durationSeconds);
  }
  report.decode = await stage('Full ffmpeg decode', async () => {
    const started = Date.now();
    const result = await run(ffmpeg, ['-nostdin', '-hide_banner', '-v', 'error', '-xerror', '-err_detect', 'explode', '-i', target, '-map', '0:v:0', '-an', '-f', 'null', '-']);
    assert.equal(result.stderr.trim(), '', 'Full decode must have no error output.');
    return { passed: true, elapsedSeconds: (Date.now() - started) / 1000, exitCode: result.code, stderr: result.stderr, args: result.args };
  });
  await mkdir(framesDirectory);
  const count = Number(stream?.nb_read_frames) || expected.frames;
  const frameRequests = [{ label: 'opening', fraction: 0 }, { label: 'early-1.5-seconds', seconds: 1.5 },
    { label: 'early-5-seconds', seconds: 5 }, { label: '25-percent', fraction: .25 },
    { label: '50-percent', fraction: .5 }, { label: '75-percent', fraction: .75 }, { label: 'final', fraction: 1 }];
  if(metadata.exportEdition==='visible-travel-regional-spread'){
    const proofs=metadata.proofFrames;
    requireCheck('Movement, spread and resident caption proof frames declared',Array.isArray(proofs)
      &&proofs.some(frame=>frame.kind==='before')&&proofs.some(frame=>frame.kind==='after')
      &&proofs.filter(frame=>frame.kind==='moving').length>=5&&proofs.filter(frame=>frame.kind==='spread').length>=5
      &&proofs.some(frame=>frame.kind==='resident-introduction'),proofs?.length??null,'Before, during and after travel; progressive settlement spread; resident introduction captions');
    if(Array.isArray(proofs))for(const proof of proofs){
      if(!/^[a-z0-9-]+$/.test(proof.label)||!Number.isFinite(proof.videoSeconds)){
        requireCheck('Proof frame has safe label and finite timestamp',false,proof,'Safe lowercase label and finite seconds');continue;
      }
      // Choose an encoded frame inside the actual state, rather than rounding
      // the last in-transit instant onto the already-arrived resident frame.
      let frameIndex=Math.round(proof.videoSeconds*expected.fps);
      if(proof.kind==='before'||proof.kind==='moving'&&proof.fraction>.99)frameIndex=Math.floor(proof.videoSeconds*expected.fps-1e-7);
      else if(proof.kind==='after'||proof.kind==='moving'&&proof.fraction===0)frameIndex=Math.ceil(proof.videoSeconds*expected.fps+1e-7);
      frameRequests.push({...proof,frameIndex});
    }
  }
  report.expectedExtractionCount=frameRequests.length;
  for (const request of frameRequests) {
    const { label } = request;
    const frameIndex = request.frameIndex??(Number.isFinite(request.seconds) ? Math.round(request.seconds * expected.fps) : Math.floor((count - 1) * request.fraction));
    const seconds = frameIndex / expected.fps, fraction = frameIndex / (count - 1);
    const file = join(framesDirectory, `${label}.png`);
    const frame = await stage(`Extract ${label} frame`, async () => {
      assert.ok(frameIndex >= 0 && frameIndex < count, `${label}: requested evidence time must be inside the actual video.`);
      await run(ffmpeg, ['-n', '-nostdin', '-hide_banner', '-v', 'error', '-ss', seconds.toFixed(9), '-i', target, '-map', '0:v:0', '-frames:v', '1', '-an', file]);
      const image = await readFile(file);
      assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'Extraction must produce a PNG.');
      assert.equal(image.readUInt32BE(16), expected.width); assert.equal(image.readUInt32BE(20), expected.height);
      return { label, fraction, frameIndex, seconds, ...(request.seconds === undefined ? {} : { requestedSeconds: request.seconds }),
        ...(request.kind===undefined?{}:{kind:request.kind,requestedYear:request.year,requestedSeconds:request.videoSeconds,introductionLabel:request.introductionLabel}),
        file, bytes: image.length, sha256: createHash('sha256').update(image).digest('hex') };
    });
    if (frame) report.extractedFrames.push(frame);
  }
  const durationSeconds = Number(probe?.format?.duration) || metadata.durationSeconds;
  report.encodedDurationSeconds=durationSeconds;
  report.browser = await stage('Actual browser MP4 playback and seeking', () => verifyBrowser(durationSeconds));
  report.videoSha256 = await stage('MP4 identity hash', () => hashFile(target));
  const finalStat = await stat(target);
  requireCheck('MP4 remained unchanged during verification', initialStat.size === finalStat.size && initialStat.mtimeMs === finalStat.mtimeMs,
    { bytesBefore: initialStat.size, bytesAfter: finalStat.size, mtimeBefore: initialStat.mtimeMs, mtimeAfter: finalStat.mtimeMs }, 'Identical size and modification time');
} catch (error) {
  report.failures.push(error.stack || String(error));
} finally {
  report.completedAt = new Date().toISOString();
  report.passed = report.failures.length === 0 && Boolean(report.decode?.passed && report.browser?.passed)
    &&Number.isSafeInteger(report.expectedExtractionCount)&&report.extractedFrames.length===report.expectedExtractionCount;
  await writeFile(verificationPath, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ passed: report.passed, target, verificationPath, framesDirectory, frames: report.extractedFrames.length, failures: report.failures }));
  if (!report.passed) process.exitCode = 1;
}
