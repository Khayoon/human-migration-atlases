import type { Dataset, Geometry, LonLat, Migration, PopulationAddition, PopulationLoss, Settlement, SettlementDispersion, Source } from './types';
import type { DatedExclusion } from './geography-policy';
import { coastalPresenceExclusions } from './coastal-presence';
import type { AtlasJourney, JourneyAtlas } from './journeys';
import type { AtlasPopulationBinding, NormalizedEstimate } from './atlas-model';
import { haversineKm } from '../util/geo';
import { rngFor } from '../util/prng';
import { HOMELAND_FOOTPRINT, HOMELAND_LANDSCAPE_BASIS, HOMELAND_LANDSCAPE_SOURCES, sampleHomelandLandscape } from './homeland-landscape';
import { regionalLandscape } from './regional-landscape';
import { settlementLandscape } from './settlement-landscapes';
const sameCoord=(a:LonLat,b:LonLat)=>a[0]===b[0]&&a[1]===b[1];

export interface LandscapePlacement { points: LonLat[]; footprint?: Geometry; basis: string; sources: Source[]; dispersion?: SettlementDispersion }
const regionalPlacements = new Map<string, LandscapePlacement>();
function regionalPlacement(id: string): LandscapePlacement | null {
  const cached = regionalPlacements.get(id);
  if (cached) return cached;
  const result = id === 'RES-NW' ? { points: sampleHomelandLandscape(4096), footprint: HOMELAND_FOOTPRINT,
    basis: HOMELAND_LANDSCAPE_BASIS, sources: HOMELAND_LANDSCAPE_SOURCES } : regionalLandscape(id, 4096);
  if (result) regionalPlacements.set(id, result);
  return result;
}

/** Resource/landscape placement is separate from the conserved demographic ledger. */
function applyLandscapePlacements(dataset: Dataset, prepared?: Record<string, LandscapePlacement>): void {
  for (const stock of dataset.settlements) {
    const placement: LandscapePlacement | null = prepared?.[stock.id] ?? (stock.journeyId ? prepared?.[stock.journeyId] : undefined)
      ?? regionalPlacement(stock.id) ?? settlementLandscape(stock.id);
    if (!placement) continue;
    // A stock can predate a geographic restriction's end. Retain its full land
    // pool; engine projection and screen packing apply the policy at frame.t.
    const points = [...placement.points];
    if (!points.length) throw new Error(`${stock.id}: resource footprint has no allowed land positions`);
    stock.displayPoints = points;
    stock.dispersion = placement.dispersion;
    const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
    const west = Math.min(...xs), east = Math.max(...xs), south = Math.min(...ys), north = Math.max(...ys);
    // An envelope is used only for indexing/culling. Resident-density shading
    // follows the points, never fills the envelope or the water between islands.
    stock.extent = [{ year: stock.start, geometry: placement.footprint ?? { kind: 'polygon', rings: [
      [[west, south], [east, south], [east, north], [west, north], [west, south]],
    ] } }];
    stock.description += `\nPlacement: ${placement.basis}`;
    stock.sources = [...stock.sources, ...placement.sources.filter(source => !stock.sources.some(old => old.url === source.url))];
    stock.tags.push('resource-shaped-placement');
  }
  for (const migration of dataset.migrations) for (const [index, hold] of (migration.ledgerHolds ?? []).entries()) {
    const placement = settlementLandscape(`hold:${migration.id}:${index}`);
    if (placement) hold.points = placement.points;
  }
}

export interface LedgerReservoir {
  id:string; name:string; coord:LonLat; points:LonLat[]; initial:number; capacity:number; regionId:string;
  /** Optional exact initial scenario priors; omitted values retain common legacy scales. */
  low?:number;
  high?:number;
  /** Date this separately declared standing-population prior enters the model. */
  start?:number;
  /** Optional cohort identity and destination colour for shared named pools. */
  group?:string;
  color?:string;
  /** Fixed cohort: transfers are funded normally, without inferred natural growth. */
  closedCohort?:boolean;
}
export interface LedgerPreparation {
  schemaVersion:1; journeys:AtlasJourney[]; estimates:NormalizedEstimate[];
  reservoirs:LedgerReservoir[]; exclusions:DatedExclusion[]; destinationColourFrom:number; neutralColour:string;
  maxUnmatchedAnnualShare:number; basis:string;
  /** Explicit sensitivity bounds for standing reservoirs; legacy defaults are .2 and 4. */
  scenarioReservoirScales?:{low:number;high:number};
  /** Use a declared rate (including zero) instead of fitting demographic growth. */
  fixedAnnualRate?:number;
  /** Prepared resource/terrain placement by reservoir ID or journey ID. */
  landscapes?:Record<string,LandscapePlacement>;
  /** Reserve traversal time inside each reconstructed movement period. */
  arrivalsWithinWindow?:boolean;
  /** Opt-in display traversal share within the original movement period. */
  maximumTravelShare?:number;
  /** Residents removed by dated mortality; never a migration or living arrival. */
  losses?:PopulationLoss[];
  /** Explicit dated descendant support; never attributed to a source migration. */
  additions?:PopulationAddition[];
  sources:{id:string;title:string;url:string;basis:string}[];
}
export function attachLedger(atlas:JourneyAtlas, estimates:Map<string,NormalizedEstimate>, preparation:LedgerPreparation) {
  if(preparation.schemaVersion!==1||!preparation.reservoirs?.length)throw new Error('Invalid standing-population preparation.');
  if(preparation.maximumTravelShare!==undefined&&(!Number.isFinite(preparation.maximumTravelShare)||preparation.maximumTravelShare<=0||preparation.maximumTravelShare>=1))throw new Error('maximumTravelShare must be between zero and one');
  const overrides=new Map(preparation.journeys.map(j=>[j.id,j]));
  return {atlas:{...atlas,ledger:preparation,journeys:[...atlas.journeys.map(j=>overrides.get(j.id)??j),...preparation.journeys.filter(j=>!atlas.journeys.some(old=>old.id===j.id))]},
    estimates:new Map([...estimates,...preparation.estimates.map(e=>[e.recordId,e] as const)])};
}

/** Per-dot events are shared by the engine and compile audit. Population is
 * transferred, never born on a route. Last partial dot keeps its exact weight. */
export function transferEvents(m:Migration, unit:number): {departure:number;arrival:number;people:number;index:number}[] {
  const total=m.population?.value??0,n=Math.ceil(total/unit),end=m.departureEnd??m.end;
  const when=(i:number)=>{
    const p=i*unit+Math.min(unit,total-i*unit)/2,schedule=m.departureSchedule;
    if(!schedule?.length)return m.start+(end-m.start)*(n>1?i/(n-1):0);
    const next=schedule.findIndex(k=>k.people>=p);
    if(next===0)return schedule[0].year;if(next<0)return schedule.at(-1)!.year;
    const a=schedule[next-1],b=schedule[next];return a.year+(b.year-a.year)*(p-a.people)/(b.people-a.people);
  };
  const arrival=(departure:number)=>{let time=departure,distance=0;for(const hold of m.ledgerHolds??[]){time=Math.max(hold.until,time+(hold.distance-distance)*(m.travelYears??0));distance=hold.distance;}return time+(1-distance)*(m.travelYears??0);};
  return Array.from({length:n},(_,i)=>({departure:when(i),arrival:arrival(when(i)),people:Math.min(unit,total-i*unit),index:i}));
}
export function transferProgress(m:Migration,departure:number,t:number):{distance:number;stop?:number}{
  const travel=m.travelYears??1;let time=departure,distance=0;
  for(const [index,hold]of (m.ledgerHolds??[]).entries()){
    const reached=time+(hold.distance-distance)*travel;
    if(t<reached)return {distance:Math.max(0,distance+(t-time)/travel)};
    if(t<hold.until)return {distance:hold.distance,stop:index};
    time=Math.max(reached,hold.until);distance=hold.distance;
  }
  return {distance:Math.max(0,Math.min(1,distance+(t-time)/travel))};
}
export function growPopulation(value:number, years:number, rate:number, capacity:number):number {
  if(value<=0||years<=0)return value;
  // One common intrinsic natural-growth rate; declared regional carrying
  // capacities avoid an unbounded exponential extrapolation over 2,353 years.
  if(value>=capacity)return value;
  return capacity/(1+(capacity/value-1)*Math.exp(-rate*years));
}
export interface LedgerEvent { year:number; delta:number; migrationId:string; index:number; kind?:'loss'|'addition'; descendantSupport?:true }
function adjustmentEvents(adjustment:PopulationLoss,unit:number,mode:'mid'|'low'|'high',kind:'loss'|'addition'):LedgerEvent[]{
  const total=mode==='mid'?adjustment.central:adjustment[mode],n=Math.ceil(total/unit),sign=kind==='loss'?-1:1;
  return Array.from({length:n},(_,i)=>({year:adjustment.start+(adjustment.end-adjustment.start)*(i+.5)/n,
    delta:sign*Math.min(unit,total-i*unit),migrationId:`${kind}:${adjustment.id}`,index:i,kind,
    ...(kind==='addition'&&'descendantSupport' in adjustment&&adjustment.descendantSupport===true?{descendantSupport:true as const}:{})}));
}
export function ledgerEvents(dataset:Dataset,unit:number,mode:'mid'|'low'|'high'='mid',losses=dataset.meta.ledger?.losses??[],additions=dataset.meta.ledger?.additions??[]):Map<string,LedgerEvent[]> {
  const out=new Map(dataset.settlements.filter(s=>s.ledger).map(s=>[s.id,[] as LedgerEvent[]]));
  for(const m of dataset.migrations)for(const event of transferEvents(m,unit)) {
    out.get(m.fromSettlement??'')?.push({year:event.departure,delta:-event.people,migrationId:m.id,index:event.index});
    out.get(m.toSettlement??'')?.push({year:event.arrival,delta:event.people,migrationId:m.id,index:event.index});
  }
  for(const [adjustments,kind] of [[losses,'loss'],[additions,'addition']] as const)for(const adjustment of adjustments)
    out.get(adjustment.settlementId)?.push(...adjustmentEvents(adjustment,unit,mode,kind));
  for(const list of out.values())list.sort((a,b)=>a.year-b.year
    // A same-year incoming survivor can seed descendants, even when its credit
    // is smaller. Keep all legacy event ties unchanged without this opt-in.
    ||((a.descendantSupport||b.descendantSupport)?(a.delta<0?2:a.descendantSupport?1:0)-(b.delta<0?2:b.descendantSupport?1:0):0)
    ||b.delta-a.delta||a.migrationId.localeCompare(b.migrationId));
  return out;
}
export function ledgerBalance(s:Settlement,events:LedgerEvent[],year:number,rate=s.ledger!.annualRate):number {
  if(year<s.start)return 0;
  let value=s.ledger!.initial,t=s.start;
  for(const event of events){if(event.year>year)break;value=growPopulation(value,event.year-t,rate,s.ledger!.capacity)+event.delta;t=event.year;}
  return growPopulation(value,Math.max(0,year-t),rate,s.ledger!.capacity);
}

/** Rebuild funded parent splits whenever dot units or estimate bounds change. */
export function rescheduleParentTransfers(dataset:Dataset,unit:number,mode:'mid'|'low'|'high'='mid'):void {
 for(const stock of dataset.settlements.filter(s=>!s.tags.includes('regional-reservoir'))){
  const incoming=dataset.migrations.filter(m=>m.toSettlement===stock.id).flatMap(m=>transferEvents(m,unit)).sort((a,b)=>a.arrival-b.arrival);
  const children=dataset.migrations.filter(m=>m.fromSettlement===stock.id);
  for(const m of children)m.departureSchedule=undefined;
  const requests=children.flatMap(m=>transferEvents(m,unit).map(e=>({...e,m}))).sort((a,b)=>a.departure-b.departure||a.m.id.localeCompare(b.m.id)||a.index-b.index);
  if(requests.reduce((n,e)=>n+e.people,0)>incoming.reduce((n,e)=>n+e.people,0)+.01)throw new Error(`${stock.id}: child allocations exceed the inclusive parent`);
  let cursor=0,available=incoming[0]?.people??0;const assigned=new Map<string,{people:number;year:number}[]>();
  for(const e of requests){let needed=e.people,release=e.departure;
   while(needed>1e-6){const credit=incoming[cursor];if(!credit)throw new Error(`${stock.id}: unmatched child debit`);release=Math.max(release,credit.arrival+.0001);const take=Math.min(needed,available);needed-=take;available-=take;if(available<1e-6){cursor++;available=incoming[cursor]?.people??0;}}
   const schedule=assigned.get(e.m.id)??[];schedule.push({people:e.index*unit+e.people/2,year:release});assigned.set(e.m.id,schedule);
  }
  for(const m of children){const schedule=assigned.get(m.id);if(!schedule?.length)continue;m.departureSchedule=schedule.sort((a,b)=>a.people-b.people);m.start=Math.min(m.start,schedule[0].year);m.departureEnd=Math.max(m.departureEnd!,schedule.at(-1)!.year);m.end=m.departureEnd+m.travelYears!;}
 }
 rescheduleSupportedTransfers(dataset,unit,mode);
}

/** Dated support must fund whole display units before they depart. Reserve
 * dated deaths first, so changing the unit cannot spend the same residents
 * once on a route and again as a mortality debit. Ordinary ledgers are intact. */
function rescheduleSupportedTransfers(dataset:Dataset,unit:number,mode:'mid'|'low'|'high'='mid',additions=dataset.meta.ledger?.additions??[],losses=dataset.meta.ledger?.losses??[],scales=dataset.meta.ledger?.scenarioReservoirScales??{low:.2,high:4}):void{
 for(const stock of dataset.settlements.filter(s=>s.ledger&&[...additions,...losses].some(a=>a.settlementId===s.id))){
  const children=dataset.migrations.filter(m=>m.fromSettlement===stock.id);
  for(const m of children)m.departureSchedule=undefined;
  const initial=mode==='mid'?stock.ledger!.initial:mode==='low'?stock.ledger!.initialLow??stock.ledger!.initial*scales.low:stock.ledger!.initialHigh??stock.ledger!.initial*scales.high;
  const credits=[{year:stock.start,people:initial},
   ...dataset.migrations.filter(m=>m.toSettlement===stock.id).flatMap(m=>transferEvents(m,unit).map(e=>({year:e.arrival,people:e.people}))),
   ...additions.filter(a=>a.settlementId===stock.id).flatMap(a=>adjustmentEvents(a,unit,mode,'addition').map(e=>({year:e.year,people:e.delta}))),
  ].sort((a,b)=>a.year-b.year);
  for(const death of losses.filter(a=>a.settlementId===stock.id).flatMap(a=>adjustmentEvents(a,unit,mode,'loss')).sort((a,b)=>a.year-b.year)){
   let needed=-death.delta;
   // Later-generation support funds later deaths before ancestral credits.
   // Reserving oldest first would hold medieval departures until modern priors.
   for(let i=credits.length-1;i>=0&&needed>1e-6;i--){const credit=credits[i];if(credit.year>death.year)continue;const take=Math.min(needed,credit.people);credit.people-=take;needed-=take;}
   if(needed>.01)throw new Error(`${stock.id}: cannot fund dated population loss at ${death.year}`);
  }
  const requests=children.flatMap(m=>transferEvents(m,unit).map(e=>({...e,m}))).sort((a,b)=>a.departure-b.departure||a.m.id.localeCompare(b.m.id)||a.index-b.index);
  const assigned=new Map<string,{people:number;year:number}[]>();let cursor=0;
  for(const request of requests){let needed=request.people,release=request.departure;
   while(needed>1e-6){while(credits[cursor]?.people<1e-6)cursor++;const credit=credits[cursor];if(!credit)throw new Error(`${stock.id}: dated support cannot fund ${request.m.id} (${mode}, missing ${needed} people)`);
    release=Math.max(release,credit.year);const take=Math.min(needed,credit.people);credit.people-=take;needed-=take;
   }
   const schedule=assigned.get(request.m.id)??[];schedule.push({people:request.index*unit+request.people/2,year:release});assigned.set(request.m.id,schedule);
  }
  for(const m of children){const schedule=assigned.get(m.id);if(!schedule?.length)continue;m.departureSchedule=schedule;m.departureEnd=Math.max(m.departureEnd!,schedule.at(-1)!.year);m.end=m.departureEnd+m.travelYears!;}
 }
}

export function applyPopulationLedger(dataset:Dataset,bindings:Map<string,AtlasPopulationBinding>,atlas:JourneyAtlas):void {
  const prep=atlas.ledger;if(!prep)return;
  const scales=prep.scenarioReservoirScales??{low:.2,high:4};
  const fixedRate=prep.fixedAnnualRate;
  const losses=prep.losses??[],additions=prep.additions??[],adjustmentIds=new Set<string>();
  for(const addition of additions)if(addition.descendantSupport!==undefined&&addition.descendantSupport!==true)
    throw new Error(`${addition.id}: descendantSupport must be true when provided.`);
  for(const adjustment of [...losses,...additions]){
    if(!adjustment.id||adjustmentIds.has(adjustment.id))throw new Error('Population adjustments require unique nonempty IDs.');
    adjustmentIds.add(adjustment.id);
    if(![adjustment.start,adjustment.end,adjustment.low,adjustment.central,adjustment.high].every(Number.isFinite)||adjustment.start>adjustment.end||adjustment.low<0||adjustment.central<0||adjustment.high<=0||adjustment.low>adjustment.central||adjustment.high<adjustment.central)
      throw new Error(`${adjustment.id}: invalid dated population adjustment.`);
    if(adjustment.start<dataset.meta.timeRange[0]||adjustment.end>dataset.meta.timeRange[1]||!adjustment.basis?.trim())throw new Error(`${adjustment.id}: population adjustment needs an in-scope interval and basis.`);
  }
  if(!Number.isFinite(scales.low)||!Number.isFinite(scales.high)||scales.low<=0||scales.low>1||scales.high<1)throw new Error('Standing reservoir scales must satisfy 0 < low <= 1 <= high.');
  if(fixedRate!==undefined&&(!Number.isFinite(fixedRate)||fixedRate<0))throw new Error('A fixed standing-population growth rate must be finite and nonnegative.');
  const start=dataset.meta.timeRange[0],neutral=prep.neutralColour;
  dataset.meta.destinationColourFrom=prep.destinationColourFrom;dataset.meta.neutralColour=neutral;dataset.meta.geographyExclusions=coastalPresenceExclusions(prep.exclusions);
  const oldHome=dataset.settlements.find(s=>s.journeyId==='EARLY-HOMELAND');
  dataset.settlements=[];
  const rootStocks=new Map<string,Settlement>();
  const makeStock=(id:string,name:string,coord:LonLat,points:LonLat[],group:string,initial:number,capacity:number,region:string,color:string,journeyId?:string,stockStart=start):Settlement=>({
    id,name,group,start:stockStart,extent:[{year:stockStart,geometry:{kind:'circle',center:coord,radiusKm:Math.max(10,...points.map(p=>haversineKm(p,coord)))}}],
    population:[{year:stockStart,value:initial,min:initial*scales.low,max:initial*scales.high,confidence:'speculative'}],boundary:'fuzzy',confidence:'speculative',fate:'continues',transitionYears:0,
    growthYears:0,inclusiveOutgoing:true,displayPoints:points,destinationRegion:region,destinationColor:color,journeyId,
    ledger:{initial,annualRate:0,capacity},tags:['standing-reservoir','atlas-population-model'],description:`Path and dates are reconstructed.\n${prep.basis}`,sources:prep.sources.map(s=>({title:s.title,url:s.url}))});
  for(const r of prep.reservoirs){
    if(r.start!==undefined&&(!Number.isFinite(r.start)||r.start<start||r.start>dataset.meta.timeRange[1]))throw new Error(`${r.id}: reservoir start must lie within the project timeline`);
    if(r.closedCohort!==undefined&&typeof r.closedCohort!=='boolean')throw new Error(`${r.id}: closedCohort must be boolean`);
    if(r.low!==undefined&&(!Number.isFinite(r.low)||r.low<0||r.low>r.initial))throw new Error(`${r.id}: invalid low reservoir prior`);
    if(r.high!==undefined&&(!Number.isFinite(r.high)||r.high<r.initial))throw new Error(`${r.id}: invalid high reservoir prior`);
    const group=r.group??(r.id==='RES-NW'?(oldHome?.group??'EARLY-HOMELAND'):r.id);
    const color=r.color??neutral;
    if(!dataset.groups.some(g=>g.id===group))dataset.groups.push({id:group,name:r.name,color,sources:[],tags:['standing-reservoir']});
    const stock=makeStock(r.id,r.name,r.coord,r.points,group,r.initial,r.capacity,r.regionId,color,r.id==='RES-NW'?'EARLY-HOMELAND':undefined,r.start??start);
    if(r.closedCohort)stock.ledger!.closedCohort=true;
    if(r.low!==undefined){stock.population[0].min=r.low;stock.ledger!.initialLow=r.low;}
    if(r.high!==undefined){stock.population[0].max=r.high;stock.ledger!.initialHigh=r.high;}
    stock.tags.push('regional-reservoir');dataset.settlements.push(stock);rootStocks.set(r.id,stock);
    if(oldHome&&r.id==='RES-NW'){const b=bindings.get(oldHome.id);if(b)bindings.set(stock.id,b);bindings.delete(oldHome.id);}
  }
  const destByJourney=new Map<string,Settlement[]>();
  for(const m of dataset.migrations){
    const j=atlas.journeys.find(j=>j.id===m.journeyId)!;
    const stage=j.stages.filter(s=>s.kind==='destination').sort((a,b)=>haversineKm(a.coord!,m.path.at(-1)!.coord)-haversineKm(b.coord!,m.path.at(-1)!.coord))[0];
    const earlyTarget=j.tags?.find(t=>t.startsWith('reservoir-target:'))?.slice(17);
    const regional=earlyTarget&&rootStocks.get(earlyTarget);
    const nearby=!j.tags?.includes('frontier')&&(destByJourney.get(j.id)??[]).find(s=>s.destinationRegion===m.destinationRegion&&s.extent[0].geometry.kind==='circle'&&haversineKm(s.extent[0].geometry.center,m.path.at(-1)!.coord)<350);
    const stock=regional||nearby||makeStock(`stock-${m.id}`,m.name,m.path.at(-1)!.coord,m.arrivalPoints??[m.path.at(-1)!.coord],m.group,0,Math.max(5000,(m.population?.value??0)*1.5),m.destinationRegion??'',m.start<prep.destinationColourFrom?neutral:m.destinationColor??neutral,m.journeyId);
    if(nearby){stock.displayPoints=[...stock.displayPoints!,...(m.arrivalPoints??[])];stock.ledger!.capacity+=Math.max(5000,(m.population?.value??0)*1.5);const g=stock.extent[0].geometry;if(g.kind==='circle')g.radiusKm=Math.max(g.radiusKm,...stock.displayPoints.map(p=>haversineKm(p,g.center)));}
    if(!regional&&!nearby)dataset.settlements.push(stock);
    // Named destination pools still need the source binding used by map filters.
    // A terminal pool may never become another route's origin and must remain
    // visible and selectable after its last travelling dot arrives.
    const arrivalBinding=bindings.get(m.id),existingBinding=bindings.get(stock.id);
    if(arrivalBinding)bindings.set(stock.id,existingBinding
      ?{...existingBinding,recordIds:[...new Set([...existingBinding.recordIds,...arrivalBinding.recordIds])]}
      :{...arrivalBinding,regionId:stock.destinationRegion??arrivalBinding.regionId});
    if(j.tags?.includes('closed-cohort')){stock.ledger!.closedCohort=true;stock.ledger!.capacity=m.population?.value??1000;}
    m.toSettlement=stock.id;
    destByJourney.set(j.id,[...new Set([...(destByJourney.get(j.id)??[]),stock])]);
    // The whole release interval is used, leaving a short, visible traversal
    // time at its end rather than releasing everything in the first leg.
    const distance=m.path.slice(1).reduce((n,p,i)=>n+haversineKm(m.path[i].coord,p.coord),0);
    if(j.travelYears!==undefined&&(!Number.isFinite(j.travelYears)||j.travelYears<=0))throw new Error(`${j.id}: travelYears must be finite and positive`);
    const traversal=j.travelYears??Math.min(90,Math.max(8,distance/125));
    m.travelYears=prep.arrivalsWithinWindow?Math.min(traversal,Math.max(.000001,(m.end-m.start)*(prep.maximumTravelShare??.35))):traversal;
    m.departureEnd=prep.arrivalsWithinWindow?m.end-m.travelYears:m.end;
    m.end=m.departureEnd+m.travelYears;m.fadeInYears=0;
    let covered=0;
    m.ledgerHolds=m.path.flatMap((point,index)=>{
      if(index)covered+=haversineKm(m.path[index-1].coord,point.coord);
      const next=m.path[index+1];if(!next||!sameCoord(point.coord,next.coord)||next.year!<=point.year!)return [];
      const stop=m.stops?.find(s=>Math.abs(s.end-next.year!)<.01);
      return [{distance:distance?covered/distance:0,until:next.year!,points:stop?.points??[point.coord]}];
    });
    m.originPoints=undefined;delete m.parent;delete m.parentPool;
    void stage;
  }
  for(const m of dataset.migrations){
    const j=atlas.journeys.find(j=>j.id===m.journeyId)!;
    const requested=j.fromSettlementRecordId;
    let origin=requested&&rootStocks.get(requested);
    if(m.tags.includes('modelled-wave'))origin=[...rootStocks.values()].sort((a,b)=>{
      const ac=a.extent[0].geometry,bc=b.extent[0].geometry;
      return haversineKm(ac.kind==='circle'?ac.center:[0,0],m.path[0].coord)-haversineKm(bc.kind==='circle'?bc.center:[0,0],m.path[0].coord);
    })[0];
    if(!origin&&requested){const [parent,index]=requested.split('#');const candidates=destByJourney.get(parent)??[];origin=index!==undefined?candidates[Number(index)]:[...candidates].sort((a,b)=>haversineKm(a.extent[0].geometry.kind==='circle'?a.extent[0].geometry.center:[0,0],m.path[0].coord)-haversineKm(b.extent[0].geometry.kind==='circle'?b.extent[0].geometry.center:[0,0],m.path[0].coord))[0];}
    if(!origin)throw new Error(`${m.id}: no standing source ${requested}`);
    m.fromSettlement=origin.id;
    if(j.tags?.includes('frontier-return')){
      const arrivals=dataset.migrations.filter(p=>p.toSettlement===origin.id);
      m.population={...m.population!,value:arrivals.reduce((n,p)=>n+(p.population?.value??0),0),min:arrivals.reduce((n,p)=>n+(p.population?.min??p.population?.value??0),0),max:arrivals.reduce((n,p)=>n+(p.population?.max??p.population?.value??0),0)};
    }
    // Reservoir aliases make their pending members visible when selecting a
    // source group. All-groups accounting still draws each stock only once.
    const b=bindings.get(m.id),ob=bindings.get(origin.id);
    if(b)bindings.set(origin.id,ob?{...ob,recordIds:[...new Set([...ob.recordIds,...b.recordIds])]}:{...b,regionId:origin.destinationRegion??b.regionId});
  }
  // Stationary local priors can have no incoming or outgoing route. They still
  // need a source binding: map filters must not hide them even in All groups.
  for(const r of prep.reservoirs){
    if(r.initial<=0||bindings.has(r.id))continue;
    const stock=rootStocks.get(r.id)!;
    const journey=atlas.journeys.find(j=>!j.excluded&&j.groupId===stock.group);
    const recordIds=[...new Set([r.id,...(journey?.recordIds??[])])];
    bindings.set(r.id,{recordId:r.id,recordIds,journeyId:journey?.id??'',groupId:stock.group,regionId:r.regionId,
      estimate:{recordId:r.id,low:r.low??r.initial*scales.low,central:r.initial,high:r.high??r.initial*scales.high,
        method:'Explicit stationary population prior',basis:'Stationary local or ancestral display prior, separate from migration totals. '+prep.basis,
        sourceIds:journey?.source.sourceIds??prep.sources.map(source=>source.id)}});
  }
  // An onward branch can begin only once its inclusive parent has supplied
  // residents. Synthetic preceding-stage dates do not conjure that stock.
  for(let pass=0;pass<dataset.migrations.length;pass++){
    let changed=false;
    for(const m of dataset.migrations){
      const stock=dataset.settlements.find(s=>s.id===m.fromSettlement)!;
      if(stock.ledger!.initial>0)continue;
      const incoming=dataset.migrations.filter(p=>p.toSettlement===stock.id&&p.id!==m.id);
      const support=additions.filter(a=>a.settlementId===stock.id);
      if(!incoming.length&&!support.length)throw new Error(`${m.id}: empty source reservoir has no inflow`);
      const available=Math.min(...incoming.map(p=>transferEvents(p,dataset.meta.peoplePerDot)[0]?.arrival??Infinity),...support.map(a=>a.start));
      if(m.start<available){
        const oldStart=m.start,span=m.end-m.start;m.start=available+.001;
        if(m.departureEnd!<=m.start){m.departureEnd=m.start+Math.max(30,span-m.travelYears!);m.end=m.departureEnd+m.travelYears!;}
        m.path=m.path.map(p=>({...p,year:m.start+(m.end-m.start)*((p.year??oldStart)-oldStart)/span}));changed=true;
      }
    }
    if(!changed)break;
    if(pass===dataset.migrations.length-1)throw new Error('Cyclic standing-population sourcing.');
  }
  // A stock can combine multiple regional footprints. Interleave the entire
  // pool before assigning slots, so a small population does not occupy only
  // the first appended locality (for example, Marib while Mahra stays empty).
  for(const s of dataset.settlements){
    const pool=[...(s.displayPoints??[])],random=rngFor(s.id,'standing-land-slots');
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
    s.displayPoints=pool;
  }
  rescheduleParentTransfers(dataset,dataset.meta.peoplePerDot);
  rescheduleSupportedTransfers(dataset,dataset.meta.peoplePerDot,'mid',additions,losses,scales);
  for(const m of dataset.migrations)m.end=Math.max(m.end,...transferEvents(m,dataset.meta.peoplePerDot).map(e=>e.arrival));
  for(const adjustment of [...losses,...additions]){
    const stock=dataset.settlements.find(s=>s.id===adjustment.settlementId);
    if(!stock)throw new Error(`${adjustment.id}: no standing source for population adjustment ${adjustment.settlementId}.`);
    if(adjustment.start<stock.start)throw new Error(`${adjustment.id}: population adjustment predates its standing source.`);
  }
  function fit(mode:'mid'|'low'|'high'){
  const scale=mode==='mid'?1:scales[mode];
  const variant={...dataset,migrations:dataset.migrations.map(m=>{
    const value=mode==='low'?m.population?.min??m.population!.value:mode==='high'?m.population?.max??m.population!.value:m.population!.value;
    return {...m,population:{...m.population!,value},departureSchedule:m.departureSchedule?.map(k=>({...k,people:k.people*value/m.population!.value}))};
  })};
  if(mode!=='mid')rescheduleParentTransfers(variant,dataset.meta.peoplePerDot,mode);
  rescheduleSupportedTransfers(variant,dataset.meta.peoplePerDot,mode,additions,losses,scales);
  const events=ledgerEvents(variant,dataset.meta.peoplePerDot,mode,losses,additions);
  let failure='';
  const viable=(rate:number)=>dataset.settlements.every(s=>{
    let v=mode==='low'?s.ledger!.initialLow??s.ledger!.initial*scale:mode==='high'?s.ledger!.initialHigh??s.ledger!.initial*scale:s.ledger!.initial,t=s.start;
    for(const e of events.get(s.id)??[]){if(e.year<s.start){failure=`${mode}: ${s.id} transfer predates reservoir start`;return false;}v=growPopulation(v,e.year-t,s.ledger!.closedCohort?0:rate,s.ledger!.capacity*scale);if(e.descendantSupport&&v<=1e-6){failure=`${mode}: ${s.id} descendant support ${e.migrationId} requires a surviving resident lineage at ${e.year}`;return false;}v+=e.delta;t=e.year;if(v<-.01){failure=`${mode}: ${s.id} at ${t}: ${Math.round(v)} people after ${e.migrationId}`;return false;}}
    return true;
  });
  if(fixedRate!==undefined){if(!viable(fixedRate))throw new Error(`Standing-population ledger cannot fund its departures at the declared annual rate: ${failure}`);return fixedRate;}
  let lo=0,hi=.02;
  if(!viable(hi))throw new Error(`Standing-population ledger cannot fund its departures even at 2% annual intrinsic growth: ${failure}`);
  for(let i=0;i<35;i++){const mid=(lo+hi)/2;if(viable(mid))hi=mid;else lo=mid;}
  return Math.ceil((hi+.0002)*1e6)/1e6;
  }
  const rate=fit('mid'),scenarioRates={low:fit('low'),high:fit('high')};
  const basis=`${prep.basis} Common central logistic intrinsic natural-growth rate: ${(rate*100).toFixed(4)}% per year, ${prep.fixedAnnualRate===undefined?'fitted to cumulative departures':'explicitly declared in the visualization model'}; declared regional capacities bound extrapolation. Sensitivity scenarios use common rates of ${(scenarioRates.low*100).toFixed(4)}% (low) and ${(scenarioRates.high*100).toFixed(4)}% (high) across reservoirs. These are visualization calibrations, not observed historical fertility or census rates.`;
  for(const s of dataset.settlements){s.ledger!.annualRate=s.ledger!.closedCohort?0:rate;s.description+=`\n${basis}${s.ledger!.closedCohort?' This is a closed display cohort; natural growth is not inferred.':''}`;}
  dataset.meta.ledger={annualRate:rate,scenarioRates,scenarioReservoirScales:scales,basis,maxUnmatchedAnnualShare:prep.maxUnmatchedAnnualShare,...(losses.length?{losses}: {}),...(additions.length?{additions}: {})};
  const datedEvents=ledgerEvents(dataset,dataset.meta.peoplePerDot);
  for(const s of dataset.settlements)if(s.ledger!.initial===0){
    const first=(datedEvents.get(s.id)??[]).find(e=>e.delta>0)?.year;
    // Credit midpoints depend on scenario totals and dot units. Preserve the
    // broad prepared start so an earlier high/smaller-unit credit stays visible.
    if(first!==undefined){const visibleFrom=Math.min(s.start,first);s.start=visibleFrom;s.extent[0].year=visibleFrom;s.population[0].year=visibleFrom;}
  }
  applyLandscapePlacements(dataset,prep.landscapes);
  auditPopulationLedger(dataset);
}

/** Build gate: no unfunded transfer and no unaccounted regional creation. */
export function auditPopulationLedger(dataset:Dataset):void {
  if(!dataset.meta.ledger)return;
  const events=ledgerEvents(dataset,dataset.meta.peoplePerDot),max=dataset.meta.ledger.maxUnmatchedAnnualShare;
  const ids=new Set(dataset.settlements.map(s=>s.id));
  for(const m of dataset.migrations){if(!m.fromSettlement||!m.toSettlement||!ids.has(m.fromSettlement)||!ids.has(m.toSettlement)||m.originPoints?.length)throw new Error(`${m.id}: origin spawn bypasses ledger`);}
  for(const s of dataset.settlements){
    if(!s.ledger)throw new Error(`${s.id}: settlement bypasses ledger`);
    let v=s.ledger.initial,t=s.start;
    for(const e of events.get(s.id)??[]){if(e.year<s.start)throw new Error(`${s.id}: transfer predates reservoir start`);v=growPopulation(v,e.year-t,s.ledger.annualRate,s.ledger.capacity);if(e.descendantSupport&&v<=1e-6)throw new Error(`${s.id}: descendant support ${e.migrationId} requires a surviving resident lineage at ${e.year}`);v+=e.delta;t=e.year;if(v<-.01)throw new Error(`${s.id}: negative standing population at ${t}`);}
    if(Math.expm1(s.ledger.annualRate)>max)throw new Error(`${s.id}: unmatched annual natural growth exceeds ${max*100}%`);
  }
}
