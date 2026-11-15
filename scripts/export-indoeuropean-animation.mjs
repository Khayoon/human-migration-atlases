// Local-only deterministic export; no desktop/input control or research upload.
import { createServer } from 'vite';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
let puppeteer;
try { puppeteer = (await import('puppeteer')).default; }
catch { puppeteer = (await import(pathToFileURL(join(homedir(), 'node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js')).href)).default; }
const checkOnly = process.argv.includes('--check');
const width=1920,height=1080,fps=24;
const ffmpeg=process.env.FFMPEG_PATH||(process.platform==='win32'?'C:/FFmpeg/bin/ffmpeg.exe':'ffmpeg');
const stamp=new Date().toISOString().replaceAll(':','-').replace(/\.\d+Z$/,'Z');
const edition='visible-travel-regional-spread';
const stem='Indo-European-Atlas-4500BCE-1000CE-'+edition+'-'+stamp;
const projectManifest=JSON.parse(await readFile('public/projects/indoeuropeans.json','utf8'));
const projectModel=projectManifest.models?.variants?.find(model=>model.id===projectManifest.models.default);
const preparedProject=JSON.parse(await readFile('public/'+projectManifest.dataset,'utf8'));
const directory=resolve('outputs'),verificationDirectory=join(directory,stem+'-frames');
await mkdir(verificationDirectory,{recursive:true});
const target=join(directory,stem+'.mp4'),metadataPath=join(directory,stem+'.json');
const inputs=['src/main.ts','src/map/basemap.ts','src/map/population-camera.ts','src/render/overlay.ts','src/sim/engine.ts','src/sim/standing-slots.ts','src/sim/settlement-dispersal.ts','src/time/clock.ts','src/time/phase-pacing.ts','src/data/loader.ts','src/data/types.ts','src/data/atlas-model.ts','src/data/population-ledger.ts','src/data/language-shifts.ts','src/ui/evidence-map.ts','public/projects/indoeuropeans.json',...new Set([projectManifest.dataset,projectModel?.journeys??projectManifest.journeys,projectManifest.populationModel,projectModel?.standingLedger??projectManifest.standingLedger].map(path=>'public/'+path))];
const hashes=async()=>Object.fromEntries(await Promise.all(inputs.map(async file=>[file,createHash('sha256').update(await readFile(file)).digest('hex')])));
const sourceHashes=await hashes();
const hook=String.raw`
import { advanceNarrativePlayback as videoAdvance } from './time/clock';
import { phaseRateAt as videoPhaseRate } from './time/phase-pacing';
import { transferEvents as videoTransferEvents, ledgerEvents as videoLedgerEvents, ledgerBalance as videoLedgerBalance } from './data/population-ledger';
import { mercToLonLat as videoLonLat, haversineKm as videoDistance } from './util/geo';
import { standingSlotOriginsAt as videoSlotOrigins } from './sim/standing-slots';
window.__indoVideo={
 ready:()=>!!journeyPackage&&!!atlasProjection&&styleReady&&store.state.dataset.migrations.length>0,
 setup:async(fps)=>{
  clock.stop();map.stop();store.patch({playing:false,panelOpen:false,t:store.state.dataset.meta.timeRange[0]});
  // Closing the app panel schedules a 220ms layout resize. Let it finish
  // before the first deterministic draw, so it cannot clear a captured canvas.
  await new Promise(resolve=>setTimeout(resolve,300));
  evidenceMap.setTimelineEnabled(true);map.resize();overlay.resize();resetView();
  window.videoCanvas=document.createElement('canvas');window.videoCanvas.width=1920;window.videoCanvas.height=1080;
  window.videoCameraChecks=[];window.videoPreviousYear=null;window.videoCameraKey=null;window.videoStatus=null;window.videoCameraRenders=0;
  const dataset=store.state.dataset,range=store.state.range,speed=dataset.meta.playback.defaultSpeed;
  const phases=dataset.meta.playback.phases;
  if(!Array.isArray(phases)||!phases.length||phases.some((phase,index)=>![phase.from,phase.to,phase.yearsPerSecond].every(Number.isFinite)||phase.to<=phase.from||phase.yearsPerSecond<=0||(index&&phases[index-1].to!==phase.from))||phases[0].from!==range[0]||phases.at(-1).to!==range[1])throw Error('Shared phase clock/configuration is not ready');
  engine.opts.lod=false;
  const clockChecks={steps:0,crossingSteps:0,terminalSteps:0,phaseStats:phases.map(phase=>({...phase,steps:0,minimumRate:Infinity,maximumRate:-Infinity}))};
  const years=[range[0]];let year=range[0];
  while(year<range[1]&&years.length<200000){
   const next=videoAdvance(year,1/fps,range,speed,false,dataset);
   if(!(next.t>year))throw Error('Nonadvancing export timeline');
   const clockSeconds=phases.reduce((sum,phase)=>sum+Math.max(0,Math.min(next.t,phase.to)-Math.max(year,phase.from))/phase.yearsPerSecond,0);
   if(next.t<range[1]-1e-8&&Math.abs(clockSeconds-1/fps)>1e-7)throw Error('Phase clock changed configured speeds at '+year);
   const rate=(next.t-year)*fps;clockChecks.steps++;
   const phaseIndex=phases.findIndex(phase=>year>=phase.from-1e-7&&next.t<=phase.to+1e-7);
   if(next.t>=range[1]-1e-8)clockChecks.terminalSteps++;
   else if(phaseIndex<0)clockChecks.crossingSteps++;
   else{const stats=clockChecks.phaseStats[phaseIndex];stats.steps++;stats.minimumRate=Math.min(stats.minimumRate,rate);stats.maximumRate=Math.max(stats.maximumRate,rate);if(Math.abs(rate-stats.yearsPerSecond)>1e-6)throw Error('Declared phase rate changed at '+year);}
   year=next.t;years.push(year);
  }
  if(year!==range[1])throw Error('Export timeline did not reach endpoint');
  const firstDepartureYear=Math.min(...dataset.migrations.flatMap(migration=>videoTransferEvents(migration,engine.basePpd).map(event=>event.departure)));
  const firstMovementSeconds=phases.reduce((sum,phase)=>sum+Math.max(0,Math.min(firstDepartureYear,phase.to)-phase.from)/phase.yearsPerSecond,0);
  return {title:dataset.meta.title,range,speed,playback:dataset.meta.playback,peoplePerDot:engine.basePpd,dotScale:store.state.dotScale,preparedDotScale:raw.meta.defaultDotScale,dotStyle:dataset.meta.dotStyle??null,residentContext:dataset.meta.residentContext??null,migrations:dataset.migrations.length,colorMode:journeyColorMode,model:new URLSearchParams(location.search).get('model'),cameraFollow:raw.meta.cameraFollow??'fit-occupied',phases,clockChecks,firstDepartureYear,firstMovementSeconds,years};
 },
 motionProof:()=>{
  const dataset=store.state.dataset,unit=engine.basePpd,phases=dataset.meta.playback.phases;
  const seconds=year=>.5+phases.reduce((sum,phase)=>sum+Math.max(0,Math.min(year,phase.to)-phase.from)/phase.yearsPerSecond,0);
  const worldView=populationCameraView(overlay.view());
  const at=year=>engine.frame(year,worldView,{group:()=>true});
  const coordinate=(item,index)=>videoLonLat(item.dots.xs[index],item.dots.ys[index]);
  const resident=(frame,id,slot)=>{const item=frame.settlements.find(item=>item.s.id===id);if(!item)return null;const index=Array.from(item.dots.slots.slice(0,item.dots.count)).indexOf(slot);const origin=engine.stableSlots?videoSlotOrigins(engine.stableSlots,item.s,frame.t).get(slot):null;return index<0?null:{slot,coord:coordinate(item,index),people:item.dots.alphas[index]*item.peoplePerDot,originKind:origin?.kind,originYear:origin?.year};};
  const candidates=dataset.migrations.flatMap((migration,order)=>videoTransferEvents(migration,unit).slice(0,16).map(event=>({migration,event,order}))).sort((a,b)=>a.event.departure-b.event.departure||a.order-b.order||a.event.index-b.event.index);
  if(!candidates.length)throw Error('No actual per-dot events for visible-travel proof');
  const first=candidates[0],migration=first.migration,event=first.event;
  const during=[0,.25,.5,.75,.999999].map(fraction=>{
   const year=event.departure+(event.arrival-event.departure)*fraction,frame=at(year),item=frame.migrations.find(item=>item.m.id===migration.id);
   const index=item?Array.from(item.dots.slots.slice(0,item.dots.count)).indexOf(event.index):-1;
   if(index<0)throw Error('First dot is absent from its actual moving Engine frame at '+year);
   return {fraction,year,videoSeconds:seconds(year),coord:coordinate(item,index),state:item.dots.states[index],routeProgress:item.dots.progress[index],fromSlot:item.dots.fromSlots[index],toSlot:item.dots.toSlots[index],people:item.dots.alphas[index]*item.peoplePerDot};
  });
  const epsilon=.0001,fromSlot=during[0].fromSlot,toSlot=during[0].toSlot;
  const beforeYear=event.departure-epsilon,afterYear=event.arrival+epsilon;
  const before=resident(at(beforeYear),migration.fromSettlement,fromSlot),after=resident(at(afterYear),migration.toSettlement,toSlot);
  if(!before||!after)throw Error('First-trip proof cannot locate its real source/arrival slot');
  const durationSeconds=seconds(event.arrival)-seconds(event.departure);
  const firstTrip={migrationId:migration.id,journeyId:migration.journeyId,index:event.index,from:migration.fromSettlement,to:migration.toSettlement,departure:event.departure,arrival:event.arrival,durationSeconds,movingFrames:Math.ceil(seconds(event.arrival)*24-1e-8)-Math.ceil(seconds(event.departure)*24-1e-8),before:{year:beforeYear,videoSeconds:seconds(beforeYear),...before},during,after:{year:afterYear,videoSeconds:seconds(afterYear),...after},departureHandoverKm:videoDistance(before.coord,during[0].coord),arrivalHandoverKm:videoDistance(during.at(-1).coord,after.coord)};
  if(durationSeconds<2-1e-7||firstTrip.movingFrames<48||during.some(sample=>sample.state!==1)||videoDistance(during[1].coord,during[3].coord)<1)throw Error('The first actual trip is not visibly moving for at least2seconds');
  if(firstTrip.departureHandoverKm>1||firstTrip.arrivalHandoverKm>2)throw Error('First-trip source/arrival handover is discontinuous');
  let settlementSpread=null;
  for(const candidate of candidates){
   const m=candidate.migration,e=candidate.event,stock=dataset.settlements.find(stock=>stock.id===m.toSettlement),dispersion=stock?.dispersion;
   if(!dispersion?.paths?.length||!(dispersion.years>0)||e.arrival+dispersion.years>dataset.meta.timeRange[1])continue;
   const active=at((e.departure+e.arrival)/2).migrations.find(item=>item.m.id===m.id),activeIndex=active?Array.from(active.dots.slots.slice(0,active.dots.count)).indexOf(e.index):-1;
   if(activeIndex<0)continue;
   const slot=active.dots.toSlots[activeIndex],samples=[.000001,.25,.5,.75,1].map(fraction=>{const year=e.arrival+dispersion.years*fraction,point=resident(at(year),stock.id,slot);return point?{fraction,year,videoSeconds:seconds(year),...point}:null;});
   if(samples.some(sample=>!sample||sample.originKind!=='arrival'||Math.abs(sample.originYear-e.arrival)>1e-6))continue;
   const displacementKm=videoDistance(samples[0].coord,samples.at(-1).coord);
   if(displacementKm<1)continue;
   if(samples.some(sample=>Math.abs(sample.people-e.people)>.01))continue;
   settlementSpread={migrationId:m.id,journeyId:m.journeyId,index:e.index,stockId:stock.id,slot,arrival:e.arrival,dispersionYears:dispersion.years,dispersionSeconds:seconds(e.arrival+dispersion.years)-seconds(e.arrival),displacementKm,people:e.people,basis:dispersion.basis,samples};break;
  }
  if(!settlementSpread)throw Error('No actual incoming resident slot demonstrates progressive post-arrival spread');
  const eventBudget=dataset.migrations.map(m=>{const events=videoTransferEvents(m,unit);return {migrationId:m.id,declaredPeople:m.population.value,eventPeople:events.reduce((sum,e)=>sum+e.people,0),events:events.length,sourceExists:dataset.settlements.some(s=>s.id===m.fromSettlement),destinationExists:dataset.settlements.some(s=>s.id===m.toSettlement)};});
  if(eventBudget.some(item=>Math.abs(item.declaredPeople-item.eventPeople)>.01||!item.sourceExists||!item.destinationExists))throw Error('Transfer event budget is not conserved');
  const ledgerEvents=videoLedgerEvents(dataset,unit),sampleYears=[...new Set([dataset.meta.timeRange[0],...phases.flatMap(p=>[(p.from+p.to)/2,p.to]),event.departure,event.arrival,settlementSpread.samples.at(-1).year])].sort((a,b)=>a-b);
  const displayMassAudit=sampleYears.map(year=>{const frame=at(year);const paintedPeople=[...frame.settlements,...frame.migrations].reduce((sum,item)=>sum+Array.from(item.dots.alphas.slice(0,item.dots.count)).reduce((n,weight)=>n+weight*item.peoplePerDot,0),0);const standingPeople=dataset.settlements.filter(s=>s.ledger&&s.start<=year).reduce((sum,s)=>sum+videoLedgerBalance(s,ledgerEvents.get(s.id)??[],year,engine.ledgerRate(s)),0);const travellingPeople=dataset.migrations.reduce((sum,m)=>sum+videoTransferEvents(m,unit).filter(e=>e.departure<=year&&e.arrival>year).reduce((n,e)=>n+e.people,0),0);const modelPeople=standingPeople+travellingPeople;return {year,paintedPeople,modelPeople,differencePeople:paintedPeople-modelPeople,tolerancePeople:1+modelPeople*1e-8};});
  if(displayMassAudit.some(item=>Math.abs(item.differencePeople)>item.tolerancePeople))throw Error('Actual Engine dot weights differ from standing plus travelling ledger people');
  return {source:'Actual compiled transferEvents and uncropped Engine.frame coordinates; no synthetic routes or screenshot-only proxy.',firstTrip,settlementSpread,eventBudget,displayMassAudit};
 },
 frame:async(year)=>{
  if(window.videoPreviousYear===year)return window.videoStatus;
  clock.stop();map.stop();store.patch({playing:false});store.setTime(year);
  automaticEarlyOverview=null;automaticPreparedOverview=true;dirty=true;lastNow=0;clock.onTick();
  const target={center:JSON.parse(mapEl.dataset.cameraTargetCenter),zoom:Number(mapEl.dataset.cameraTargetZoom)};
  // Same occupied-population target as app; no wall-clock easing for offline frames.
  map.stop();map.jumpTo({...target,padding:{top:0,bottom:0,left:0,right:0}});
  const key=JSON.stringify([target.center,target.zoom]);
  if(key!==window.videoCameraKey){
   await new Promise(resolve=>{map.once('render',resolve);map.triggerRepaint();});
   if(!map.areTilesLoaded())await new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>{map.off('idle',ready);reject(Error('Basemap tiles not ready at '+year));},60000);
    const ready=()=>{clearTimeout(timeout);resolve();};map.once('idle',ready);map.triggerRepaint();
   });
   await new Promise(resolve=>{map.once('render',resolve);map.triggerRepaint();});
   window.videoCameraKey=key;window.videoCameraRenders++;
  }
  const world=window.__indoLastFrame;if(!world||Math.abs(world.t-year)>1e-8)throw Error('Captured render frame does not match date');
  const inside=populationCameraContains(world,{center:map.getCenter().toArray(),zoom:map.getZoom()},{width:innerWidth,height:innerHeight,padding:fitPadding()});
  if(!inside)throw Error('Occupied population clipped at '+year);
  const canvas=window.videoCanvas,x=canvas.getContext('2d');x.clearRect(0,0,1920,1080);
  x.drawImage(map.getCanvas(),0,0,1920,1080);x.drawImage(overlay.canvas,0,0,1920,1080);
  const legend=evidenceMap.getColorLegendModel(),entries=[...(legend.entries??[])];
  if(legend.preIslamic)entries.unshift({id:'standing',...legend.preIslamic});
  if(entries.length){
   const columns=entries.length>24?3:entries.length>10?2:1,rows=Math.ceil(entries.length/columns),columnWidth=230,rowHeight=19,w=24+columnWidth*columns,h=43+rows*rowHeight,left=20,top=1044-h;
   x.fillStyle='#fbf9f1f2';x.beginPath();x.roundRect(left,top,w,h,6);x.fill();
   x.textBaseline='top';x.font='600 12px system-ui';x.fillStyle='#40392e';x.fillText(legend.heading||'Population colours',left+12,top+10);
   entries.forEach((entry,index)=>{
    const cx=left+12+(index%columns)*columnWidth,cy=top+33+Math.floor(index/columns)*rowHeight;
    x.fillStyle=entry.color;x.fillRect(cx,cy+3,8,8);x.fillStyle='#605542';x.font='11px system-ui';
    let label=entry.label;while(x.measureText(label).width>columnWidth-28&&label.length>4)label=label.slice(0,-2);if(label!==entry.label)label+='…';x.fillText(label,cx+15,cy);
   });
  }
  x.textBaseline='alphabetic';x.fillStyle='#fbf9f1f2';x.beginPath();x.roundRect(1498,922,402,122,6);x.fill();
  x.fillStyle='#40392e';x.font='600 17px system-ui';x.fillText(store.state.dataset.meta.title.split('·')[0].trim(),1514,948);
  x.font='600 30px system-ui';x.fillText(formatYear(year),1514,984);
  x.font='12px system-ui';x.fillStyle='#716650';x.fillText('1 dot = '+engine.basePpd.toLocaleString('en-US')+' people',1514,1007);
  const introduction=store.state.dataset.meta.residentContext?.introductions?.filter(item=>item.start<=year&&year<item.end).at(-1);
  let contextLabel=introduction?.label??'Default model · central population scenario';while(x.measureText(contextLabel).width>345&&contextLabel.length>5)contextLabel=contextLabel.slice(0,-2);if(contextLabel!==(introduction?.label??'Default model · central population scenario'))contextLabel+='…';
  x.fillText(contextLabel,1514,1027);x.font='15px system-ui';x.fillText('?',1874,1027);
  x.fillStyle='#fbf9f1f2';x.fillRect(8,1057,1000,19);x.fillStyle='#40392e';x.font='11px system-ui';
  x.fillText('© OpenMapTiles © OpenStreetMap contributors · Terrain: Mapzen/AWS Terrain Tiles · Rivers: Natural Earth',12,1071);
  window.videoPreviousYear=year;
  window.videoStatus={year,dots:overlay.lastDotCount,center:map.getCenter().toArray(),zoom:map.getZoom(),inside,peoplePerDot:engine.basePpd,dotScale:store.state.dotScale,legendEntries:entries.length,legendLabels:entries.map(entry=>entry.label),residentIntroduction:introduction?.label??null,captionContext:contextLabel,basemapRenders:window.videoCameraRenders,yearsPerSecond:videoPhaseRate(year,store.state.dataset.meta.playback.phases)};
  const {legendLabels,residentIntroduction,captionContext,...cameraStatus}=window.videoStatus;window.videoCameraChecks.push(cameraStatus);
  return window.videoStatus;
 }
};`;
let server,browser,encoder,encoderDone,diagnostics='';
const errors=[],localFailures=[],tileFailures=[];
const report={createdAt:new Date().toISOString(),exportEdition:edition,target,sourceHashes,preparedDisplay:{range:preparedProject.meta.timeRange,peoplePerDot:preparedProject.meta.peoplePerDot,dotScale:preparedProject.meta.defaultDotScale,dotStyle:preparedProject.meta.dotStyle,playback:preparedProject.meta.playback},limitations:['Paths, dates and population values are reconstructions; original unknown source headcounts are preserved separately.','Central population scenario and default comparison model only.','Video rendering and playback checks do not establish historical verification.','Basemap terrain/water are geographic context, not a complete ancient palaeoenvironment reconstruction.','Local post-arrival dispersal paths are display reconstructions, separate from the retained source evidence.'],model:projectModel?.id??projectManifest.models?.default??null,resolution:[width,height],fps,videoSafePadding:{top:85,bottom:260,left:30,right:40},openingHoldSeconds:.5,closingHoldSeconds:1.5,attribution:'© OpenMapTiles © OpenStreetMap contributors · Terrain: Mapzen/AWS Terrain Tiles · Rivers: Natural Earth',checks:[],errors,localFailures,tileFailures};
try{
 server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:5197,strictPort:false,hmr:false,watch:null},plugins:[{name:'private-indo-video-hook',enforce:'pre',transform(code,id){
  const file=id.replaceAll('\\','/');
  if(file.endsWith('/src/main.ts'))return code.replace("bottom: document.getElementById('timeline')!.offsetHeight + 30", "bottom: Math.max(260, document.getElementById('timeline')!.offsetHeight + 30)").replace('overlay.draw(frame, rs);','overlay.draw(frame, rs); window.__indoLastFrame = frame;')+hook;
  if(file.endsWith('/src/map/basemap.ts'))return code.replace('    container,','    container,\n    canvasContextAttributes: { preserveDrawingBuffer: true },');
 }}]});
 await server.listen();const address=server.httpServer.address(),base='http://127.0.0.1:'+address.port;
 browser=await puppeteer.launch({headless:true,timeout:120000,protocolTimeout:300000,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader'],defaultViewport:{width,height,deviceScaleFactor:1}});
 const page=await browser.newPage();
 page.on('pageerror',error=>{errors.push(error.message);console.error('BROWSER ERROR '+error.message);});
 page.on('response',response=>{if(response.status()>=400){const item={url:response.url(),status:response.status()};if(item.url.startsWith(base)&&!item.url.endsWith('favicon.ico'))localFailures.push(item);else if(/tiles|terrarium/.test(item.url))tileFailures.push(item);}});
 await page.goto(base+'/indoeuropeans/'+(report.model?'?model='+encodeURIComponent(report.model):''),{waitUntil:'networkidle2',timeout:120000});
 await page.waitForFunction(()=>window.__indoVideo?.ready(),{timeout:120000});
 await page.addStyleTag({content:'#app > :not(#map):not(#overlay){display:none!important}.maplibregl-control-container{display:none!important}:root{--timeline-h:0px!important}#map,#overlay{inset:0!important}'});
 const meta=await page.evaluate(fps=>window.__indoVideo.setup(fps),fps),years=meta.years;delete meta.years;
 report.app=meta;report.animationFrames=years.length;report.historicalDurationSeconds=(years.length-1)/fps;report.pacing={phases:meta.phases,clock:'advanceNarrativePlayback',animationSeconds:report.historicalDurationSeconds,openingHoldSeconds:report.openingHoldSeconds,closingHoldSeconds:report.closingHoldSeconds,firstMovementByVideoSeconds:report.openingHoldSeconds+meta.firstMovementSeconds,clockChecks:meta.clockChecks,frameClockVerified:true};
 const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 if(!same(meta.range,report.preparedDisplay.range)||meta.peoplePerDot!==report.preparedDisplay.peoplePerDot||meta.dotScale!==report.preparedDisplay.dotScale||!same(meta.dotStyle,report.preparedDisplay.dotStyle??null)||!same(meta.phases,report.preparedDisplay.playback.phases))throw Error('Runtime display differs from its prepared project metadata');
 report.motionProof=await page.evaluate(()=>window.__indoVideo.motionProof());
 const trip=report.motionProof.firstTrip,spread=report.motionProof.settlementSpread;
 report.proofFrames=[{label:'first-trip-before',kind:'before',year:trip.before.year,videoSeconds:trip.before.videoSeconds},...trip.during.map((sample,index)=>({label:'first-trip-'+index,kind:'moving',fraction:sample.fraction,year:sample.year,videoSeconds:sample.videoSeconds})),{label:'first-trip-after',kind:'after',year:trip.after.year,videoSeconds:trip.after.videoSeconds},...spread.samples.map((sample,index)=>({label:'settlement-spread-'+index,kind:'spread',fraction:sample.fraction,year:sample.year,videoSeconds:sample.videoSeconds}))];
 const videoSeconds=year=>report.openingHoldSeconds+meta.phases.reduce((sum,phase)=>sum+Math.max(0,Math.min(year,phase.to)-phase.from)/phase.yearsPerSecond,0);
 report.proofFrames.push(...(meta.residentContext?.introductions??[]).map((intro,index)=>{const year=Math.min(intro.end-.0001,intro.start+2);return {label:'resident-introduction-'+index,kind:'resident-introduction',year,videoSeconds:videoSeconds(year),introductionLabel:intro.label};}));
 console.log(JSON.stringify({phase:'motion-proof',motionProof:report.motionProof}));
 console.log(JSON.stringify({phase:'ready',...meta,animationFrames:years.length,historicalDurationSeconds:report.historicalDurationSeconds,target}));
 if(checkOnly){
  const checkpoints=[...meta.phases.flatMap((phase,index)=>[{label:'phase-'+index+'-start',year:phase.from},{label:'phase-'+index+'-mid',year:(phase.from+phase.to)/2},{label:'phase-'+index+'-end',year:phase.to}]),...report.proofFrames].sort((a,b)=>a.year-b.year);
  for(const {label,year}of checkpoints){
   const status=await page.evaluate(year=>window.__indoVideo.frame(year),year);report.checks.push({label,...status});
   const png=await page.evaluate(()=>window.videoCanvas.toDataURL('image/png').split(',')[1]);await writeFile(join(verificationDirectory,label+'.png'),Buffer.from(png,'base64'));console.log(JSON.stringify({phase:'check',label,...status}));
  }
 }else{
  const allYears=[...Array(Math.round(report.openingHoldSeconds*fps)).fill(years[0]),...years,...Array(Math.round(report.closingHoldSeconds*fps)).fill(years.at(-1))];report.frames=allYears.length;report.durationSeconds=allYears.length/fps;if(!(report.durationSeconds<120))throw Error('Video duration must be strictly under 120 seconds');
  encoder=spawn(ffmpeg,['-n','-hide_banner','-loglevel','warning','-f','h264','-r',String(fps),'-i','pipe:0','-an','-c:v','copy','-movflags','+faststart',target],{stdio:['pipe','ignore','pipe'],windowsHide:true});
  encoder.stderr.on('data',data=>diagnostics+=data);encoder.stdin.on('error',()=>{});encoderDone=once(encoder,'close');
  await page.evaluate(({width,height,fps})=>{
   window.indoEncoded=[];window.indoEncodeError=null;
   window.indoEncoder=new VideoEncoder({output:chunk=>{const bytes=new Uint8Array(chunk.byteLength);chunk.copyTo(bytes);window.indoEncoded.push(bytes);},error:error=>window.indoEncodeError=error.message});
   window.indoEncoder.configure({codec:'avc1.640028',width,height,bitrate:10000000,framerate:fps,avc:{format:'annexb'}});
  },{width,height,fps});
  const started=Date.now();
  for(let offset=0;offset<allYears.length;offset+=24){
   const batchYears=allYears.slice(offset,offset+24);
   const batch=await page.evaluate(async({offset,years,fps})=>{
    let status;
    for(let j=0;j<years.length;j++){
     status=await window.__indoVideo.frame(years[j]);const index=offset+j;
     const frame=new VideoFrame(window.videoCanvas,{timestamp:Math.round(index*1000000/fps),duration:Math.round(1000000/fps)});
     window.indoEncoder.encode(frame,{keyFrame:index%120===0});frame.close();if(window.indoEncoder.encodeQueueSize>6)await window.indoEncoder.flush();
    }
    await window.indoEncoder.flush();if(window.indoEncodeError)throw Error(window.indoEncodeError);
    const size=window.indoEncoded.reduce((n,c)=>n+c.length,0),bytes=new Uint8Array(size);let cursor=0;
    for(const chunk of window.indoEncoded){bytes.set(chunk,cursor);cursor+=chunk.length;}window.indoEncoded=[];
    let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));return {base64:btoa(binary),status};
   },{offset,years:batchYears,fps});
   if(!encoder.stdin.write(Buffer.from(batch.base64,'base64')))await once(encoder.stdin,'drain');
   report.checks.push({frame:offset+batchYears.length-1,...batch.status});
   console.log(JSON.stringify({phase:'render',frame:offset+batchYears.length,total:allYears.length,elapsedSeconds:Math.round((Date.now()-started)/1000),...batch.status}));
   if(offset===0||offset+24>=allYears.length){const png=await page.evaluate(()=>window.videoCanvas.toDataURL('image/png').split(',')[1]);await writeFile(join(verificationDirectory,offset===0?'opening.png':'closing.png'),Buffer.from(png,'base64'));}
  }
  await page.evaluate(()=>window.indoEncoder.close());encoder.stdin.end();const [code]=await encoderDone;if(code!==0)throw Error(diagnostics);
  report.cameraTrack=await page.evaluate(()=>window.videoCameraChecks);
  report.cameraDescription="Chronological retained occupied envelope, 1.5-second smooth expansions; same deterministic path in the app and export, with all current populations checked every frame.";
  report.bytes=(await stat(target)).size;report.renderSeconds=(Date.now()-started)/1000;
 }
 report.sourceHashesAfter=await hashes();report.sourceChanges=Object.keys(sourceHashes).filter(file=>sourceHashes[file]!==report.sourceHashesAfter[file]);
 if(errors.length||localFailures.length)throw Error('Browser/local asset errors: '+JSON.stringify({errors,localFailures}));
 report.completed=true;report.checkOnly=checkOnly;await writeFile(metadataPath,JSON.stringify(report,null,2)+'\n');console.log('COMPLETE '+(checkOnly?metadataPath:target));
}catch(error){report.completed=false;report.failure=String(error.stack??error);await writeFile(metadataPath,JSON.stringify(report,null,2)+'\n');throw error;}
finally{if(encoder&&encoder.exitCode===null)encoder.kill();if(browser)await browser.close();if(server)await server.close();}
