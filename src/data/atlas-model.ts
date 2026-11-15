/** Compile prepared journeys and separately supplied population models for display. */
import type { Dataset, Group, LonLat, Migration, PopulationEstimate, Settlement, Source, Waypoint } from './types';
import type { AtlasCorridor, AtlasJourney, AtlasStage, JourneyAtlas, JourneyNetwork, JourneyNetworkBranch } from './journeys';
import { modelledWaves, type WavePlan } from './demography';
import { haversineKm } from '../util/geo';
import { applyPopulationLedger } from './population-ledger';

export interface NormalizedEstimate {
  recordId: string; low: number; central: number; high: number; method: string; basis: string;
  sourceIds: string[]; cohortId?: string; parentId?: string; includedIn?: string; render?: boolean;
}
export interface AtlasPopulationBinding {
  recordId: string; recordIds: string[]; journeyId: string; groupId: string; regionId: string; estimate: NormalizedEstimate;
}
export interface AtlasPopulationReport {
  estimatedRecords: number; renderedRecords: number; missingEstimateIds: string[]; unlocatedIds: string[]; excludedIds: string[];
  outOfScopeIds: string[]; sharedCohortIds: string[]; suppressedDuplicateIds: string[];
  suppliedEstimateRecords: number; userQuantifiedRecords: number;
}
export interface CompiledAtlasPopulation {
  dataset: Dataset; bindings: Map<string, AtlasPopulationBinding>; report: AtlasPopulationReport;
}

// Prepared projects own their chronology; the renderer must not impose one
// atlas's historical window on another atlas's supplied dates.
const year = (value: number | undefined, fallback: number) => Number.isFinite(value) ? value! : fallback;
const samePoint = (a: LonLat, b: LonLat) => a[0] === b[0] && a[1] === b[1];
const points = (stage: AtlasStage): LonLat[] => stage.sampledArrivalPoints?.length ? stage.sampledArrivalPoints : stage.coord ? [stage.coord] : [];
const located = (stage: AtlasStage) => points(stage).length > 0;
const validEstimate = (e: NormalizedEstimate | undefined): e is NormalizedEstimate => !!e && [e.low, e.central, e.high].every(Number.isFinite)
  && e.low >= 0 && e.central > 0 && e.high >= e.central && e.low <= e.central;

function population(estimate: NormalizedEstimate, share = 1): PopulationEstimate {
  return { value: estimate.central * share, min: estimate.low * share, max: estimate.high * share,
    confidence: 'speculative', note: estimate.basis };
}

/** Partition whole dot units first so separate destinations cannot each round
 * up the same aggregate remainder. At most one branch has a partial dot. */
function destinationEstimate(estimate: NormalizedEstimate, index: number, count: number, peoplePerDot: number): NormalizedEstimate {
  const unit = Math.max(1, peoplePerDot);
  const portion = (total: number) => {
    const whole = Math.floor(total / unit); const extra = whole % count;
    return Math.floor(whole / count) * unit + (index < extra ? unit : index === extra ? total - whole * unit : 0);
  };
  return { ...estimate, low: portion(estimate.low), central: portion(estimate.central), high: portion(estimate.high) };
}

function sources(journey: AtlasJourney, estimate: NormalizedEstimate): Source[] {
  return [...new Set([...journey.source.sourceIds, ...estimate.sourceIds])].map(id => ({ title: id }));
}

/** Only supplied corridor geometry is concatenated; no shortcut is drawn across a missing edge. */
function corridorPath(journey: AtlasJourney, destination: AtlasStage): AtlasCorridor[] | null {
  const queue = [journey.origin.id];
  const visited = new Set(queue);
  const incoming = new Map<string, AtlasCorridor>();
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    if (current === destination.id) break;
    for (const edge of journey.corridors) {
      if (edge.fromStageId !== current || !edge.coordinates.length || visited.has(edge.toStageId)) continue;
      visited.add(edge.toStageId); incoming.set(edge.toStageId, edge); queue.push(edge.toStageId);
    }
  }
  if (!visited.has(destination.id) || journey.origin.id === destination.id) return null;
  const path: AtlasCorridor[] = [];
  let cursor = destination.id;
  while (cursor !== journey.origin.id) {
    const edge = incoming.get(cursor); if (!edge) return null;
    path.push(edge); cursor = edge.fromStageId;
  }
  return path.reverse();
}

function timedCoordinates(coordinates: LonLat[], start: number, end: number): Waypoint[] {
  if (coordinates.length === 1) return [{ coord: coordinates[0], year: start }, { coord: coordinates[0], year: end }];
  const distances = [0];
  for (let i = 1; i < coordinates.length; i++) distances.push(distances[i - 1] + haversineKm(coordinates[i - 1], coordinates[i]));
  const total = distances.at(-1) || 1;
  return coordinates.map((coord, i) => ({ coord, year: start + (end - start) * distances[i] / total }));
}

function routeWaypoints(journey: AtlasJourney, destination: AtlasStage, corridors: AtlasCorridor[]): Waypoint[] {
  const fallbackStart = year(journey.origin.start, year(journey.dateRange?.[0], 1));
  const fallbackEnd = year(destination.end ?? destination.start, year(journey.dateRange?.[1], fallbackStart + 25));
  const stages = new Map(journey.stages.map(stage => [stage.id, stage])); stages.set(journey.origin.id, journey.origin);
  const path: Waypoint[] = [];
  for (const [index, corridor] of corridors.entries()) {
    const from = stages.get(corridor.fromStageId); const to = stages.get(corridor.toStageId);
    const baseStart = year(corridor.start ?? (index === 0 ? from?.start : from?.end ?? from?.start), fallbackStart + (fallbackEnd - fallbackStart) * index / corridors.length);
    const start = Math.max(path.at(-1)?.year ?? baseStart, baseStart);
    let end = Math.max(start + .001, year(corridor.end ?? to?.start, fallbackStart + (fallbackEnd - fallbackStart) * (index + 1) / corridors.length));
    const next = corridors[index + 1];
    const nextStart = next && year(next.start ?? to?.end ?? to?.start, end);
    // When source windows touch, reserve a visible reconstructed stay at the
    // intermediate locality instead of making it an instantaneous waypoint.
    if (to?.kind === 'intermediate' && next && nextStart! <= end && end > start) end = start + (end - start) * .8;
    if (path.length && start > path.at(-1)!.year!) path.push({ coord: path.at(-1)!.coord, year: start, name: from?.name });
    const leg = timedCoordinates(corridor.coordinates, start, end);
    if (path.length && samePoint(path.at(-1)!.coord, leg[0].coord) && path.at(-1)!.year === leg[0].year) leg.shift();
    path.push(...leg);
  }
  if (path.length > 1 && path.at(-1)!.year! <= path[0].year!) path[0].year = path.at(-1)!.year! - .001;
  return path;
}

function movement(id: string, name: string, journey: AtlasJourney, destination: AtlasStage, estimate: NormalizedEstimate,
  share: number, path: Waypoint[], offset: number): Migration {
  const stops=path.flatMap((point,i)=>{
    const next=path[i+1];if(!next||!samePoint(point.coord,next.coord)||next.year!<=point.year!)return [];
    const stage=[journey.origin,...journey.stages].filter(s=>s.coord).sort((a,b)=>haversineKm(a.coord!,point.coord)-haversineKm(b.coord!,point.coord))[0];
    return [{start:point.year!,end:next.year!,coord:point.coord,points:stage&&haversineKm(stage.coord!,point.coord)<30?points(stage):[point.coord]}];
  });
  return { id, name, group: journey.groupId, type: journey.temporalType, start: path[0].year!, end: path.at(-1)!.year!, path,
    stops,
    population: population(estimate, share), confidence: 'speculative', routeCertainty: 'conjectural', corridorWidthKm: 0,
    spread: .55, persist: true, fadeInYears: Math.max(.000001,Math.min(2,(path.at(-1)!.year!-path[0].year!)*.1)), arrivalRadiusKm: Math.max(10, destination.precisionKm ?? 80),
    originPoints: points(journey.origin), arrivalPoints: points(destination), pointOffset: offset,
    destinationRegion: destination.regionId, destinationColor: destination.color, journeyId: journey.id,
    description: `${journey.dateLabel}\nPath and dates are reconstructed.\n${estimate.basis}`, sources: sources(journey, estimate),
    tags: ['atlas-population-model', journey.temporalType, ...journey.recordIds, ...(journey.tags ?? [])] };
}

function presence(id: string, journey: AtlasJourney, destination: AtlasStage, estimate: NormalizedEstimate, share: number, offset: number): Settlement {
  const start = year(destination.start, year(journey.dateRange?.[0], 1));
  const center = destination.coord ?? points(destination)[0];
  return { id, name: `${journey.name} · ${destination.name}`, group: journey.groupId, start,
    extent: [{ year: start, geometry: { kind: 'circle', center, radiusKm: Math.max(10, destination.precisionKm ?? 80) } }],
    population: [{ year: start, ...population(estimate, share) }], boundary: 'fuzzy', confidence: 'speculative', fate: 'continues', transitionYears: 20,
    growthYears: 20, inclusiveOutgoing: journey.inclusiveOutgoing,
    displayPoints: points(destination), pointOffset: offset, destinationRegion: destination.regionId, destinationColor: destination.color, journeyId: journey.id,
    description: `${journey.dateLabel}\nPath and dates are reconstructed.\n${estimate.basis}`, sources: sources(journey, estimate),
    tags: ['atlas-population-model', 'dated-presence', ...journey.recordIds] };
}

function wavePath(network: JourneyNetwork, branch: JourneyNetworkBranch, departure: number, arrival: number, shift: number): Waypoint[] {
  const full = branch.fullAncestralPath;
  const temporary = network.temporaryStages[0];
  const start = year(network.originStage.start, year(temporary?.start, departure - 75)) + shift;
  if (!temporary?.coord) return timedCoordinates(full, Math.min(departure, start), arrival);
  let split = 0; let nearest = Infinity;
  for (let i = 0; i < full.length; i++) {
    const distance = haversineKm(full[i], temporary.coord); if (distance < nearest) { nearest = distance; split = i; }
  }
  const sourceArrival = year(temporary.start, departure - 25) + shift;
  const toTemporary = sourceArrival > start && sourceArrival < departure ? sourceArrival : start + (departure - start) * .8;
  const path = timedCoordinates(full.slice(0, split + 1), Math.min(start, toTemporary - .001), toTemporary);
  path.push({ coord: full[split], year: departure, name: temporary.name });
  const westward = timedCoordinates(full.slice(split), departure, arrival); westward.shift();
  path.push(...westward);
  return path;
}

function memberWavePath(network: JourneyNetwork, branch: JourneyNetworkBranch, journey: AtlasJourney,
  destination: AtlasStage, departure: number, arrival: number, early: boolean): Waypoint[] {
  const corridors = corridorPath(journey, destination);
  const prepared = corridors && routeWaypoints(journey, destination, corridors);
  if (!prepared?.length) return [];
  const retime = (path: Waypoint[], start: number, end: number): Waypoint[] => {
    const first = path[0].year!, span = path.at(-1)!.year! - first;
    return path.map((point, i) => ({ ...point, year: start + (end - start) * (span > 0 ? (point.year! - first) / span : i / Math.max(1, path.length - 1)) }));
  };
  if (early || !network.temporaryStages[0]?.coord) return retime(prepared, departure, arrival);
  const egypt = network.temporaryStages[0], full = branch.fullAncestralPath;
  let egyptIndex = 0, nearest = Infinity;
  full.forEach((coord, i) => { const distance = haversineKm(coord, egypt.coord!); if (distance < nearest) { nearest = distance; egyptIndex = i; } });
  // Join two already prepared land corridors at their closest shared westward
  // locality. The child's own onward route and arrival footprint are retained.
  let joinNetwork = egyptIndex, joinMember = 0; nearest = Infinity;
  for (let i = egyptIndex; i < full.length; i++) for (let j = 0; j < prepared.length; j++) {
    if (prepared[j].coord[0] > 33 || prepared[j].coord[1] < 20) continue;
    const distance = haversineKm(full[i], prepared[j].coord);
    if (distance < nearest) { nearest = distance; joinNetwork = i; joinMember = j; }
  }
  const start = Math.min(departure - 2, year(network.originStage.start, departure - 150));
  const stayStart = year(egypt.start, start), stayEnd = year(egypt.end, departure);
  const egyptArrival = Math.max(start + .001, Math.min(departure - .001, stayStart + (stayEnd - stayStart) * .6));
  const path = timedCoordinates(full.slice(0, egyptIndex + 1), start, egyptArrival);
  path.push({ coord: full[egyptIndex], year: departure, name: egypt.name });
  const onward = [...full.slice(egyptIndex, joinNetwork + 1).map(coord => ({ coord } as Waypoint)), ...prepared.slice(joinMember)];
  // An actual prepared child route may include a later intermediate stop.
  // Retime the combined geography over its stated/reconstructed departure span.
  const tail = timedCoordinates(onward.map(point => point.coord), departure, arrival); tail.shift(); path.push(...tail);
  return path;
}

/** No evidence-review, temporal-type or uncertainty flag suppresses an in-scope model. */
export function compileAtlasPopulation(base: Dataset, atlas: JourneyAtlas, estimates: Map<string, NormalizedEstimate>, wavePlan?: WavePlan): CompiledAtlasPopulation {
  const dataset: Dataset = { ...base, meta: { ...base.meta, timeRange: [...atlas.sourceWindow], playback: { adaptive: true, defaultSpeed: 20, ...base.meta.playback } }, groups: [...base.groups], migrations: [], settlements: [] };
  const bindings = new Map<string, AtlasPopulationBinding>();
  const report: AtlasPopulationReport = { estimatedRecords: 0, renderedRecords: 0, missingEstimateIds: [], unlocatedIds: [], excludedIds: [],
    outOfScopeIds: [], sharedCohortIds: [], suppressedDuplicateIds: [], suppliedEstimateRecords: 0, userQuantifiedRecords: 0 };
  const inScope = atlas.journeys.filter(journey => {
    if (journey.excluded || journey.animationAdmission === 'excluded') { report.outOfScopeIds.push(...journey.recordIds); return false; }
    return true;
  });
  const byRecord = new Map<string, AtlasJourney>();
  for (const journey of inScope) for (const id of journey.recordIds) if (!byRecord.has(id)) byRecord.set(id, journey);
  const goodEstimates = new Map([...estimates].filter(([, estimate]) => validEstimate(estimate)));
  const suppliedEstimateIds = new Set([...byRecord.keys()].filter(id => goodEstimates.has(id)));
  report.suppliedEstimateRecords = suppliedEstimateIds.size;
  report.estimatedRecords = suppliedEstimateIds.size;
  const owner = new Map<string, string>();
  const cohortOwners = new Map<string, string>();
  for (const [id, estimate] of goodEstimates) {
    if (!byRecord.has(id) || !estimate.cohortId || estimate.parentId || estimate.includedIn || estimate.render === false) continue;
    const previous = cohortOwners.get(estimate.cohortId);
    if (!previous || id === estimate.cohortId || goodEstimates.get(previous)!.central < estimate.central) cohortOwners.set(estimate.cohortId, id);
  }
  const waveRecords = new Set(wavePlan?.recordIds ?? []);
  const waveCohorts = new Set([...waveRecords].map(id => goodEstimates.get(id)?.cohortId).filter((id): id is string => !!id));
  for (const [id, estimate] of goodEstimates) {
    if (!byRecord.has(id)) continue;
    if (estimate.cohortId && cohortOwners.has(estimate.cohortId) && !estimate.parentId && !estimate.includedIn) {
      owner.set(id, cohortOwners.get(estimate.cohortId)!);
      if (cohortOwners.get(estimate.cohortId) !== id) report.sharedCohortIds.push(estimate.cohortId);
    }
    if (estimate.render === false) {
      const aggregate = estimate.includedIn ?? estimate.parentId ?? (estimate.cohortId && cohortOwners.get(estimate.cohortId));
      if (aggregate && aggregate !== id) owner.set(id, aggregate);
    }
  }
  const representative = (id: string): string => {
    const seen = new Set<string>(); let current = id;
    while (owner.has(current) && owner.get(current) !== current && !seen.has(current)) { seen.add(current); current = owner.get(current)!; }
    return current;
  };
  let waveChanged = true;
  while (waveChanged) {
    waveChanged = false;
    for (const [id, estimate] of goodEstimates) {
      if (!byRecord.has(id) || waveRecords.has(id)) continue;
      const included = estimate.includedIn ?? estimate.parentId;
      const parent = included && (cohortOwners.get(included) ?? representative(included));
      if (waveCohorts.has(estimate.cohortId ?? '') || !!parent && waveRecords.has(parent)) {
        waveRecords.add(id); if (estimate.cohortId) waveCohorts.add(estimate.cohortId); waveChanged = true;
      }
    }
  }
  const aliases = (id: string) => [...byRecord.keys()].filter(candidate => representative(candidate) === id);
  const nativeByRecord = new Map<string, Migration[]>();
  const presenceParents = new Map<string, string>();
  const offsets = new Map<string, number>();
  const takeOffset = (region: string, people: number) => {
    const offset = offsets.get(region) ?? 0;
    offsets.set(region, offset + Math.ceil(people / Math.max(1, dataset.meta.peoplePerDot))); return offset;
  };
  const addGroup = (journey: AtlasJourney) => {
    if (dataset.groups.some(group => group.id === journey.groupId)) return;
    const group: Group = { id: journey.groupId, name: journey.groupName || journey.name, color: journey.groupColor, tags: ['atlas-journey'], sources: [] };
    dataset.groups.push(group);
  };
  for (const journey of inScope) {
    addGroup(journey);
    const recordId = journey.recordIds.find(id => goodEstimates.has(id));
    if (!recordId) { report.missingEstimateIds.push(...journey.recordIds); continue; }
    const estimate = goodEstimates.get(recordId)!;
    if (wavePlan && waveRecords.has(recordId)) continue;
    if (representative(recordId) !== recordId || estimate.render === false) { report.suppressedDuplicateIds.push(recordId); continue; }
    const destinations = [...new Map(journey.stages.filter(stage => stage.kind === 'destination' && located(stage)).map(stage => [stage.id, stage])).values()];
    if (!destinations.length) { report.unlocatedIds.push(recordId); continue; }
    const parentId = estimate.includedIn ?? estimate.parentId;
    const parent = parentId && byRecord.get(representative(parentId));
    const isPresence = !journey.corridors.length;
    if (parent && isPresence) presenceParents.set(recordId, parentId!);
    const rendered: Migration[] = [];
    for (const [index, destination] of destinations.entries()) {
      const partition = destinationEstimate(estimate, index, destinations.length, dataset.meta.peoplePerDot);
      const offset = takeOffset(destination.regionId, partition.central);
      const corridors = !isPresence && corridorPath(journey, destination);
      const path = corridors && routeWaypoints(journey, destination, corridors);
      const moving = path && path.length > 1 && path.some(point => !samePoint(point.coord, path[0].coord));
      const id = `journey-${journey.id}-${moving ? 'flow' : 'presence'}-${index + 1}`;
      if (moving) {
        const migration = movement(id, `${journey.name} · ${destination.name}`, journey, destination, partition, 1, path, offset);
        dataset.migrations.push(migration); rendered.push(migration);
      } else dataset.settlements.push(presence(id, journey, destination, partition, 1, offset));
      bindings.set(id, { recordId, recordIds: aliases(recordId), journeyId: journey.id, groupId: journey.groupId, regionId: destination.regionId, estimate });
    }
    nativeByRecord.set(recordId, rendered);
  }
  for (const m of dataset.migrations) {
    const journey = inScope.find(j => j.id === m.journeyId);
    if (journey?.fromSettlementRecordId) m.fromSettlement = dataset.settlements.find(s => bindings.get(s.id)?.recordId === journey.fromSettlementRecordId)?.id;
  }
  // Explicit child flows draw from their parent cohort instead of adding a second total.
  for (const [recordId, migrations] of nativeByRecord) {
    const estimate = goodEstimates.get(recordId)!; const parentId = estimate.parentId ?? estimate.includedIn;
    if (!parentId) continue;
    const journey = inScope.find(j => j.id === migrations[0]?.journeyId);
    // A funded ledger branch can depart as residents arrive. The independent
    // whole-cohort continuation rule below would wait for the parent's final
    // arrival and erase the prepared overlap between successive waves.
    if (atlas.ledger && journey?.fromSettlementRecordId && journey.releaseWhileParentArrives) continue;
    const candidates = nativeByRecord.get(representative(parentId)) ?? [];
    for (const migration of migrations) {
      migration.parent = (candidates.find(parent => parent.destinationRegion === migration.destinationRegion) ?? candidates[0])?.id;
      // Destination splitting is a display partition of one inclusive source
      // cohort, not a separate ceiling on each child's population.
      if (candidates.length > 1) migration.parentPool = candidates.map(parent => parent.id);
      let continuation: { parent: Migration; index: number; distance: number } | undefined;
      for (const parent of candidates) for (let index = 0; index < migration.path.length - 1; index++) {
        const point = migration.path[index], parentArrival = parent.path.at(-1)!.coord;
        const distance = haversineKm(point.coord, parentArrival);
        const start = Math.max(parent.end, point.year!);
        const regionalStop = byRecord.get(recordId)?.stages.find(stage => stage.kind === 'intermediate' && stage.regionId === parent.destinationRegion);
        const precision = Math.max(25, regionalStop?.precisionKm ?? 0);
        if (distance > precision || migration.end - start < 1 || haversineKm(point.coord, migration.path.at(-1)!.coord) < 25) continue;
        if (!continuation || distance < continuation.distance) continuation = { parent, index, distance };
      }
      if (continuation) {
        const tail = migration.path.slice(continuation.index), first = tail[0].year!, span = migration.end - first;
        const start = Math.max(continuation.parent.end, first);
        migration.path = tail.map(point => ({ ...point, year: start + (migration.end - start) * (point.year! - first) / span }));
        migration.start = start;
        migration.originPoints = continuation.parent.arrivalPoints;
      } else if (candidates.length && migration.start < Math.min(...candidates.map(parent => parent.start))) {
        const first = migration.start, start = Math.min(migration.end - .001, Math.min(...candidates.map(parent => parent.start)));
        migration.path = migration.path.map(point => ({ ...point,
          year: start + (migration.end - start) * (point.year! - first) / (migration.end - first) }));
        migration.start = start;
      }
    }
  }
  if (wavePlan && atlas.networks[0]?.branches.length) {
    const network = atlas.networks[0];
    const journey = inScope.find(j => j.recordIds.some(id => wavePlan.recordIds.includes(id)));
    if (journey) {
      addGroup(journey);
      const recordId = wavePlan.recordIds[0];
      const aggregate = goodEstimates.get(recordId);
      const sameAggregate = aggregate?.central === wavePlan.totalPeople;
      const estimate: NormalizedEstimate = { recordId, low: sameAggregate ? aggregate.low : wavePlan.totalPeople,
        central: wavePlan.totalPeople, high: sameAggregate ? aggregate.high : wavePlan.totalPeople,
        method: 'User population model in capped departure waves',
        basis: `${wavePlan.basis}${sameAggregate ? `\n${aggregate.basis}` : '\nThe cumulative central total is user supplied; no separate lower or upper cumulative total was supplied.'}`,
        sourceIds: sameAggregate ? aggregate.sourceIds : [] };
      const branches = network.branches.filter(branch => branch.fullAncestralPath.length >= 2 && branch.sampledArrivalPoints.length);
      const branchStart = (branch: JourneyNetworkBranch) => {
        const starts = branch.sourceDateRanges.map(range => range[0]).filter(Number.isFinite);
        return starts.length ? Math.min(...starts) : -Infinity;
      };
      const members = inScope.filter(member => member.parentJourneyId && wavePlan.recordIds.includes(member.parentJourneyId)
        && member.source.collection === 'records' && member.recordIds.some(id => goodEstimates.get(id)?.parentId && waveRecords.has(id)));
      const memberIds = new Set(members.flatMap(member => member.recordIds));
      const memberAncestor = (id: string): string | undefined => {
        const seen = new Set<string>(); let current: string | undefined = id;
        while (current && !seen.has(current)) {
          if (memberIds.has(current)) return current;
          seen.add(current); const row = goodEstimates.get(current); current = row?.includedIn ?? row?.parentId;
        }
        return undefined;
      };
      const memberTotal = members.reduce((sum, member) => sum + (goodEstimates.get(member.recordIds[0])?.central ?? 0), 0);
      if (members.length && Math.abs(memberTotal - wavePlan.totalPeople) < .5) {
        const temporaryStages=network.temporaryStages.map(stage=>{
          const pool=inScope.flatMap(j=>j.stages).filter(s=>s.coord&&stage.coord&&haversineKm(s.coord,stage.coord)<40).flatMap(points);
          const stride=Math.max(1,Math.ceil(pool.length/2048));
          return {...stage,sampledArrivalPoints:pool.length?pool.filter((_,i)=>i%stride===0):stage.sampledArrivalPoints};
        });
        const umbrellaIds = [...waveRecords].filter(id => !memberAncestor(id));
        for (const member of members) {
          const id = member.recordIds[0], model = goodEstimates.get(id)!;
          const groupId = `cohort-member-${id}`;
          dataset.groups.push({ id: groupId, name: member.name, color: member.groupColor,
            sources: [], tags: ['atlas-journey', 'cohort-member'] });
          const destinations = member.stages.filter(stage => stage.kind === 'destination' && located(stage));
          const memberAliases = [...waveRecords].filter(candidate => memberAncestor(candidate) === id);
          for (const [destinationIndex, destination] of destinations.entries()) {
            const partition = destinationEstimate(model, destinationIndex, destinations.length, dataset.meta.peoplePerDot);
            const count = Math.max(1, Math.ceil(partition.central / wavePlan.maxWavePeople));
            const branch = branches.find(candidate => candidate.regionId === destination.regionId);
            if (!branch) continue;
            const early = (member.dateRange?.[1] ?? atlas.sourceWindow[1]) < wavePlan.start;
            const corridorStarts = member.corridors.map(corridor => corridor.start).filter((value): value is number => Number.isFinite(value));
            const start = early ? year(member.dateRange?.[0], 1) : Math.max(wavePlan.start, Math.min(...corridorStarts));
            const end = Math.max(start + .001, year(destination.end, year(member.dateRange?.[1], wavePlan.end)));
            for (let index = 0; index < count; index++) {
              const part = destinationEstimate(partition, index, count, dataset.meta.peoplePerDot);
              const departure = start + (end - start) * index / count;
              const arrival = start + (end - start) * (index + 1) / count;
              const path = memberWavePath(network, branch, member, destination, departure, arrival, early);
              if (path.length < 2) continue;
              const waveJourney = { ...member, groupId, origin: early ? member.origin : network.originStage, stages:[...temporaryStages,...member.stages] };
              const migration = movement(`${wavePlan.id}-${id}-${destinationIndex + 1}-${index + 1}`,
                `${member.name} · ${destination.name}`, waveJourney, destination, part, 1, path, takeOffset(destination.regionId, part.central));
              migration.tags.push('modelled-wave', wavePlan.id); dataset.migrations.push(migration);
              bindings.set(migration.id, { recordId: id, recordIds: [...new Set([...umbrellaIds, ...memberAliases])],
                journeyId: member.id, groupId, regionId: destination.regionId, estimate: model });
            }
          }
        }
      } else for (const [index, wave] of modelledWaves(wavePlan).entries()) {
        const eligible = branches.filter(branch => branchStart(branch) <= wave.end);
        // A branch cannot receive an early wave merely because its array index
        // came next. If the entire model predates the branch evidence, retain
        // the cohort and defer its displayed arrival to the earliest branch.
        const branch = eligible[index % eligible.length] ?? [...branches].sort((a, b) => branchStart(a) - branchStart(b))[0];
        if (!branch) break;
        const destination = branch.destinationStages[0]; if (!destination) continue;
        const arrival = Math.max(wave.end, branchStart(branch));
        const departure = Math.min(arrival - .001, Math.max(wave.start, arrival - (wave.end - wave.start)));
        const path = wavePath(network, branch, departure, arrival, departure - wavePlan.start);
        if (path.length < 2) continue;
        const waveJourney = { ...journey, origin: network.originStage };
        const migration = movement(wave.id, wave.label, waveJourney, destination, estimate, wave.people / wavePlan.totalPeople, path, takeOffset(branch.regionId, wave.people));
        migration.arrivalPoints = branch.sampledArrivalPoints; migration.destinationRegion = branch.regionId; migration.destinationColor = branch.color;
        migration.tags.push('modelled-wave', wavePlan.id); dataset.migrations.push(migration);
        bindings.set(migration.id, { recordId, recordIds: [...waveRecords], journeyId: journey.id, groupId: journey.groupId, regionId: branch.regionId, estimate });
      }
    }
  }
  // A presence estimate included in an existing aggregate is a selectable alias,
  // rather than a second resident population. Resolve after every feature exists.
  for (const [recordId, parentId] of presenceParents) {
    const parent = representative(parentId);
    const parentBinding = [...bindings.values()].find(binding => binding.recordIds.includes(parent));
    if (!parentBinding || parent === recordId) continue;
    owner.set(recordId, parentBinding.recordId); report.suppressedDuplicateIds.push(recordId);
    for (const [id, binding] of bindings) if (binding.recordId === recordId) bindings.delete(id);
    dataset.settlements = dataset.settlements.filter(settlement => bindings.has(settlement.id));
  }
  // Resolve aliases after all parent/presence decisions, independent of catalogue ordering.
  for (const binding of bindings.values()) {
    binding.recordIds = [...new Set([...binding.recordIds, ...aliases(binding.recordId)])];
  }
  const represented = new Set([...bindings.values()].flatMap(binding => binding.recordIds));
  report.renderedRecords = represented.size;
  const userQuantified = new Set(dataset.migrations.filter(migration => migration.tags.includes('modelled-wave'))
    .flatMap(migration => bindings.get(migration.id)?.recordIds ?? []));
  report.userQuantifiedRecords = userQuantified.size;
  report.estimatedRecords = new Set([...suppliedEstimateIds, ...userQuantified]).size;
  report.missingEstimateIds = report.missingEstimateIds.filter(id => !userQuantified.has(id));
  for (const key of ['missingEstimateIds', 'unlocatedIds', 'outOfScopeIds', 'sharedCohortIds', 'suppressedDuplicateIds'] as const) report[key] = [...new Set(report[key])];
  report.excludedIds = [...report.outOfScopeIds];
  applyPopulationLedger(dataset, bindings, atlas);
  return { dataset, bindings, report };
}
