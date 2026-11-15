/**
 * Simulation engine: given a dataset and a point in time, produces the
 * positions, colours and opacities of every dot, settlement area and region
 * for rendering.  All positions are in Web-Mercator world units (0..1), so the
 * renderer only needs an affine transform per frame.
 *
 * Dot layouts are deterministic (seeded per record), so scrubbing backwards
 * and forwards through time always yields the same picture for the same date.
 */
import type { Dataset, Geometry, LonLat, Migration, Region, Settlement, Year } from '../data/types';
import { populationAt } from '../data/loader';
import { haversineKm, mercUnitsPerKm, mercX, mercY, slerp, ringCentroid, ringRadiusKm, unwrapRing } from '../util/geo';
import { rngFor } from '../util/prng';
import { stationaryLanguageColors } from '../data/language-shifts';
import { mixColors } from '../util/color';
import { growPopulation, ledgerEvents, transferEvents, transferProgress, rescheduleParentTransfers, type LedgerEvent } from '../data/population-ledger';
import { allowedPoint } from '../data/geography-policy';
import { mercToLonLat } from '../util/geo';
import { settlementSlotPosition } from './settlement-dispersal';
import {buildStandingSlots,standingSlotsAt,standingSlotStateAt,standingSlotOriginsAt,transferKey,type StandingSlots} from './standing-slots';

export const MAX_DOTS_MIGRATION = 4000;
export const MAX_DOTS_SETTLEMENT = 6000;
export const MAX_DOTS_FRAME = 60_000;

const parentIds = (migration: Migration): string[] => migration.parentPool?.length
  ? [...new Set(migration.parentPool)] : migration.parent ? [migration.parent] : [];

/** Draw departed members from the inclusive pool using whole dot units first.
 * This retains exact dot counts when its display branches have whole units. */
function reservedShares(total: number, capacities: number[], unit: number): number[] {
  const capacity = capacities.reduce((sum, value) => sum + value, 0);
  if (!capacity || !total) return capacities.map(() => 0);
  total = Math.min(total, capacity);
  const exact = capacities.map(value => total * value / capacity);
  const result = exact.map(value => Math.floor(value / unit) * unit);
  let remaining = total - result.reduce((sum, value) => sum + value, 0);
  const order = exact.map((value, i) => ({ i, remainder: value - result[i] })).sort((a, b) => b.remainder - a.remainder || a.i - b.i);
  for (const { i } of order) {
    const amount = Math.min(remaining, Math.floor((capacities[i] - result[i]) / unit) * unit, unit);
    if (amount > 0) { result[i] += amount; remaining -= amount; }
  }
  // Non-integral source estimates can require a partial unit. Preserve every
  // person while never taking more members than a parent branch contains.
  for (const { i } of order) {
    const amount = Math.min(remaining, capacities[i] - result[i]);
    if (amount > 0) { result[i] += amount; remaining -= amount; }
  }
  return result;
}

export interface View {
  /** Pixels per Mercator world unit (world width in px). */
  worldPx: number;
  /** Visible Mercator bbox, expanded with a margin. */
  minX: number; minY: number; maxX: number; maxY: number;
  zoom: number;
}

export interface RouteGeom {
  travelLegs: { start:number; end:number; from:number; to:number; stopAfter?:number }[];
  /** Densified route: Mercator x,y pairs (lon unwrapped for continuity). */
  merc: Float64Array;
  /** Latitude per densified point (for km->merc scaling). */
  lat: Float32Array;
  /** Cumulative distance (km). */
  cum: Float64Array;
  totalKm: number;
  n: number;
  /** Time-fraction knots -> distance-fraction knots (both 0..1, monotonic). */
  tKnots: number[];
  dKnots: number[];
  /** Index into merc of each original waypoint. */
  wpIndex: number[];
  bbox: [number, number, number, number];
}

interface MigDots {
  n: number;
  lag: Float32Array;
  amp: Float32Array;
  phase: Float32Array;
  freq: Float32Array;
  /** scatter offsets (unit disk) for origin and arrival */
  ox: Float32Array; oy: Float32Array;
  ax: Float32Array; ay: Float32Array;
  /** people represented by one dot for this record (>= base ppd when capped) */
  peoplePerDot: number;
  originPolygon?: Float32Array;
  arrivalPolygon?: Float32Array;
}

interface SettDots {
  n: number;
  /** unit-disk positions (circle geometry) */
  ux: Float32Array; uy: Float32Array;
  /** cached polygon sample positions in merc (polygon geometry), per keyframe index */
  polyMerc: Map<number, Float32Array>;
  peoplePerDot: number;
}

export interface DotBuffer {
  xs: Float32Array;
  ys: Float32Array;
  alphas: Float32Array;
  count: number;
  /** 0 = waiting at origin, 1 = travelling, 2 = arrived. */
  states?: Uint8Array;
  /** Temporal opacity only; alphas retain demographic weights. */
  opacities?: Float32Array;
  stopIndices?: Int16Array;
  slots?:Int32Array;
  fromSlots?:Int32Array;
  toSlots?:Int32Array;
  progress?:Float32Array;
  stopWeights?:Float32Array;
}

export interface MercCircle { kind: 'circle'; cx: number; cy: number; r: number; lat: number; center: LonLat; radiusKm: number }
export interface MercPolygon { kind: 'polygon'; rings: Float64Array[]; cx: number; cy: number; r: number; center: LonLat; radiusKm: number }
export type MercGeometry = MercCircle | MercPolygon;

export interface SettlementFrame {
  s: Settlement;
  color: string;
  alpha: number;
  areaAlpha?: number;
  dotColors?: string[];
  growth?: number;
  geom: MercGeometry;
  /** second geometry while crossfading polygons */
  geomPrev?: MercGeometry;
  crossfade: number;
  population?: number;
  dotsWanted: number;
  dots: DotBuffer;
  aggregated: boolean;
  screenRadius: number;
  peoplePerDot: number;
}

export type MigPhase = 'upcoming' | 'active' | 'arrived' | 'gone';

export interface MigrationFrame {
  m: Migration;
  color: string;
  phase: MigPhase;
  /** progress of leading edge along route in distance fraction (0..1) */
  frontFrac: number;
  /** overall alpha of trail */
  trailAlpha: number;
  dots: DotBuffer;
  /** merc position of the leading edge */
  frontX: number; frontY: number;
  hasPopulation: boolean;
  peoplePerDot: number;
  route: RouteGeom;
  /** years since the migration finished (negative while active) */
  sinceEnd: number;
}

export interface RegionFrame {
  r: Region;
  color: string;
  alpha: number;
  geom: MercGeometry;
  geomPrev?: MercGeometry;
  crossfade: number;
}

export interface FrameState {
  t: Year;
  settlements: SettlementFrame[];
  migrations: MigrationFrame[];
  regions: RegionFrame[];
  totalDots: number;
}

export interface FrameFilter {
  ledgerGroup?: string;
  group: (groupId: string) => boolean;
  migration?: (m: Migration) => boolean;
  settlement?: (s: Settlement) => boolean;
  region?: (r: Region) => boolean;
}

export interface EngineOptions {
  /** multiplier on dataset peoplePerDot */
  ppdMultiplier: number;
  /** 'mid' | 'low' | 'high' : which end of population ranges to use */
  estimateMode: 'mid' | 'low' | 'high';
  /** screen-density LOD on/off */
  lod: boolean;
  /** years a completed route stays visible (Infinity = forever) */
  keepTrails: boolean;
  /** Keep an independent quantified cohort visible at its origin before departure. */
  showWholeCohort?: boolean;
  /** Schematic origin scatter for whole-cohort displays, without widening the travel path. */
  pendingRadiusKm?: number;
  colorMode?: 'destination' | 'group';
  temporalTransitions?: boolean;
  persistPeople?: boolean;
}

function smoothstep(x: number): number {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

export class Engine {
  ds: Dataset;
  opts: EngineOptions = { ppdMultiplier: 1, estimateMode: 'mid', lod: true, keepTrails: true };
  private routes = new Map<string, RouteGeom>();
  private migDots = new Map<string, MigDots>();
  private settDots = new Map<string, SettDots>();
  private settGeomCache = new Map<string, MercGeometry[]>();
  private regionGeomCache = new Map<string, MercGeometry[]>();
  private buffers = new Map<string, DotBuffer>();
  private groupColor = new Map<string, string>();
  private settById = new Map<string, Settlement>();
  private branches = new Map<string, Migration[]>();
  private ledgerUnit = -1;
  private ledgerMode = '';
  private stockEvents = new Map<string, (LedgerEvent & {balance:number})[]>();
  private transfers = new Map<string,ReturnType<typeof transferEvents>>();
  private stableSlots?:StandingSlots;
  private departurePositions = new Map<string, LonLat>();

  constructor(ds: Dataset) {
    this.ds = ds;
    this.setDataset(ds);
  }

  setDataset(ds: Dataset): void {
    this.ds = ds;
    this.routes.clear(); this.migDots.clear(); this.settDots.clear(); this.settGeomCache.clear();
    this.regionGeomCache.clear(); this.buffers.clear(); this.groupColor.clear();
    this.branches.clear();
    this.ledgerUnit=-1;this.stockEvents.clear();this.transfers.clear();this.departurePositions.clear();
    for (const g of ds.groups) this.groupColor.set(g.id, g.color);
    this.settById = new Map(ds.settlements.map((s) => [s.id, s]));
    for (const m of ds.migrations) {
      this.routes.set(m.id, buildRoute(m));
      for (const parent of parentIds(m)) {
        const children = this.branches.get(parent) ?? [];
        children.push(m); this.branches.set(parent, children);
      }
    }
  }

  colorOf(groupId: string): string {
    return this.groupColor.get(groupId) ?? '#888888';
  }

  get basePpd(): number {
    return Math.max(1e-6, this.ds.meta.peoplePerDot * this.opts.ppdMultiplier);
  }

  route(id: string): RouteGeom | undefined {
    return this.routes.get(id);
  }

  settlementGeometryAt(s: Settlement, t: Year): { geom: MercGeometry; prev?: MercGeometry; crossfade: number } {
    const geoms = this.cachedGeoms(s.id, s.extent.map((k) => k.geometry), this.settGeomCache);
    return interpolateGeometry(s.extent.map((k) => k.year), geoms, t);
  }

  regionGeometryAt(r: Region, t: Year): { geom: MercGeometry; prev?: MercGeometry; crossfade: number } {
    const geoms = this.cachedGeoms(r.id, r.extent.map((k) => k.geometry), this.regionGeomCache);
    return interpolateGeometry(r.extent.map((k) => k.year), geoms, t);
  }

  private cachedGeoms(id: string, gs: Geometry[], cache: Map<string, MercGeometry[]>): MercGeometry[] {
    let c = cache.get(id);
    if (!c) { c = gs.map(toMerc); cache.set(id, c); }
    return c;
  }

  private estimate(value: number, min?: number, max?: number): number {
    if (this.opts.estimateMode === 'low' && min !== undefined) return min;
    if (this.opts.estimateMode === 'high' && max !== undefined) return max;
    return value;
  }

  private buffer(key: string, n: number): DotBuffer {
    let b = this.buffers.get(key);
    if (!b || b.xs.length < n) {
      b = { xs: new Float32Array(n), ys: new Float32Array(n), alphas: new Float32Array(n), states: new Uint8Array(n), opacities: new Float32Array(n), stopIndices: new Int16Array(n),slots:new Int32Array(n),fromSlots:new Int32Array(n),toSlots:new Int32Array(n),progress:new Float32Array(n),stopWeights:new Float32Array(n), count: 0 };
      this.buffers.set(key, b);
    }
    b.count = 0;
    return b;
  }

  // ---------------------------------------------------------------- frame

  frame(t: Year, view: View, filter: FrameFilter): FrameState {
    this.prepareLedger();
    const out: FrameState = { t, settlements: [], migrations: [], regions: [], totalDots: 0 };
    const visible = filter.group;
    const ppd = this.basePpd;
    const inView = (bx: [number, number, number, number]) => intersectsWrappedBBox(bx, view);
    const migrations = this.ds.migrations.filter((m) => t >= m.start && visible(m.group) && (!filter.migration || filter.migration(m)) && inView(this.routes.get(m.id)!.bbox));
    const settlements = this.ds.settlements.filter((s) => {
      if (t < s.start || (!this.opts.persistPeople && s.end !== undefined && t > s.end + s.transitionYears) || !visible(s.group) || (filter.settlement && !filter.settlement(s))) return false;
      const { geom, prev } = this.settlementGeometryAt(s, t);
      return inView(geomBBox(geom)) || !!prev && inView(geomBBox(prev));
    });
    const recordBudget = this.opts.lod ? Math.floor(MAX_DOTS_FRAME / Math.max(1, migrations.length + settlements.length)) : Infinity;
    // Parent migration estimates include their branches. Allocate a shared
    // cohort before visibility filters so hiding a branch never duplicates it.
    const allocations = this.cohortAllocations();
    const departed = new Map<string, number>();
    for (const m of this.ds.migrations) {
      const pop = allocations.get(m.id) ?? 0;
      if(this.ds.meta.ledger){departed.set(m.id,(this.transfers.get(m.id)??[]).filter(e=>e.departure<=t).reduce((n,e)=>n+e.people,0));continue;}
      if (t <= m.start) { departed.set(m.id, 0); continue; }
      const md = this.migrationDots(m, ppd, pop);
      const p = (t - m.start) / (m.end - m.start);
      let lo = 0, hi = md.n;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (md.lag[mid] < p) lo = mid + 1; else hi = mid;
      }
      departed.set(m.id, Math.min(pop, lo * md.peoplePerDot));
    }

    const reservedByParent = new Map<string, number>();
    const pools = new Map<string, { parents: string[]; children: Migration[] }>();
    for (const migration of this.ds.migrations) {
      const parents = parentIds(migration).sort(); if (!parents.length) continue;
      const key = parents.join('\u0000'); const pool = pools.get(key) ?? { parents, children: [] };
      pool.children.push(migration); pools.set(key, pool);
    }
    for (const pool of pools.values()) {
      const total = pool.children.reduce((sum, child) => sum + (departed.get(child.id) ?? 0), 0);
      const shares = reservedShares(total, pool.parents.map(id => allocations.get(id) ?? 0), ppd);
      pool.parents.forEach((id, i) => reservedByParent.set(id, (reservedByParent.get(id) ?? 0) + shares[i]));
    }

    for (const r of this.ds.regions) {
      if (!visible(r.group) || (filter.region && !filter.region(r))) continue;
      if (t < r.start || (r.end !== undefined && t > r.end)) continue;
      const { geom, prev, crossfade } = this.regionGeometryAt(r, t);
      if (!inView(geomBBox(geom)) && (!prev || !inView(geomBBox(prev)))) continue;
      const fadeIn = smoothstep((t - r.start) / Math.max(1, (r.end ?? r.start + 100) - r.start) * 10);
      const fadeOut = r.end === undefined ? 1 : smoothstep((r.end - t) / Math.max(1, (r.end - r.start) * 0.1));
      out.regions.push({ r, color: this.colorOf(r.group), alpha: Math.min(fadeIn, fadeOut), geom, geomPrev: prev, crossfade });
    }

    for (const s of settlements) {
      const leaving = !s.ledger && s.inclusiveOutgoing ? this.ds.migrations.filter(m => m.fromSettlement === s.id).reduce((sum,m) => sum + (departed.get(m.id) ?? 0),0) : 0;
      let selectedPopulation:number|undefined;
      if(s.ledger&&filter.ledgerGroup&&s.group!==filter.ledgerGroup){
        const selected=(m:Migration)=>visible(m.group)&&(!filter.migration||filter.migration(m));
        const incoming=this.ds.migrations.some(m=>m.toSettlement===s.id&&selected(m));
        const outgoing=this.ds.migrations.filter(m=>m.fromSettlement===s.id&&selected(m));
        if(!incoming)selectedPopulation=Math.min(this.stockAt(s,t),outgoing.reduce((n,m)=>n+(this.transfers.get(m.id)??[]).filter(e=>e.departure>t).reduce((sum,e)=>sum+e.people,0),0));
      }
      const sf = this.settlementFrame(s, t, view, ppd, recordBudget, leaving,selectedPopulation);
      if (!sf) continue;
      if (!inView(geomBBox(sf.geom)) && (!sf.geomPrev || !inView(geomBBox(sf.geomPrev)))) continue;
      out.settlements.push(sf);
      out.totalDots += sf.dots.count;
    }

    for (const m of migrations) {
      const route = this.routes.get(m.id)!;
      if (!inView(route.bbox)) continue;
      const pop = allocations.get(m.id) ?? 0;
      const reserved = reservedByParent.get(m.id) ?? 0;
      const mf = this.migrationFrame(m, route, t, view, ppd, pop, Math.max(0, pop - reserved), departed.get(m.id) ?? 0, recordBudget);
      if (!mf) continue;
      out.migrations.push(mf);
      out.totalDots += mf.dots.count;
    }
    const exclusions=this.ds.meta.geographyExclusions;
    if(exclusions?.length)for(const item of [...out.settlements,...out.migrations]){
      const record='s' in item?item.s:item.m;
      const candidates='s' in item?item.s.displayPoints??[]:[...item.m.path.map(p=>p.coord),...(item.m.arrivalPoints??[]),...(this.settById.get(item.m.fromSettlement??'')?.displayPoints??[])];
      for(let i=0;i<item.dots.count;i++){
        const p=mercToLonLat(item.dots.xs[i],item.dots.ys[i]);
        const safe=allowedPoint(p,t,exclusions,candidates,record.journeyId);
        item.dots.xs[i]=mercX(safe[0]);item.dots.ys[i]=mercY(safe[1]);
      }
    }
    return out;
  }

  private prepareLedger():void {
    if(!this.ds.meta.ledger||(this.ledgerUnit===this.basePpd&&this.ledgerMode===this.opts.estimateMode))return;
    this.ledgerUnit=this.basePpd;this.ledgerMode=this.opts.estimateMode;this.departurePositions.clear();
    const chosen={...this.ds,migrations:this.ds.migrations.map(m=>{const value=m.population?this.estimate(m.population.value,m.population.min,m.population.max):0;return {...m,population:m.population?{...m.population,value}:undefined,departureSchedule:m.departureSchedule?.map(k=>({...k,people:k.people*value/m.population!.value}))};})};
    if(this.opts.estimateMode!=='mid'||this.basePpd!==this.ds.meta.peoplePerDot)rescheduleParentTransfers(chosen,this.basePpd,this.opts.estimateMode);
    const all=ledgerEvents(chosen,this.basePpd,this.opts.estimateMode);
    this.transfers=new Map(chosen.migrations.map(m=>[m.id,transferEvents(m,this.basePpd)]));
    const scale=this.ledgerScale();
    this.stableSlots=buildStandingSlots({...chosen,settlements:chosen.settlements.map(s=>({...s,ledger:s.ledger?{...s.ledger,annualRate:this.ledgerRate(s),initial:this.ledgerInitial(s),capacity:s.ledger.capacity*scale}:undefined}))},this.basePpd,this.opts.estimateMode);
    for(const s of this.ds.settlements)if(s.ledger)s.ledger.maxSlot=Math.max(this.stableSlots.stocks.get(s.id)?.maxSlot??0,Math.ceil(s.ledger.capacity*scale/this.basePpd));
    for(const s of this.ds.settlements){if(!s.ledger)continue;
      let v=this.ledgerInitial(s),t=s.start;
      this.stockEvents.set(s.id,(all.get(s.id)??[]).map(e=>{
        v=growPopulation(v,e.year-t,this.ledgerRate(s),s.ledger!.capacity*scale)+e.delta;t=e.year;
        return {...e,balance:v};
      }));
    }
  }

  private stockAt(s:Settlement,t:number):number {
    const events=this.stockEvents.get(s.id)??[];let lo=0,hi=events.length;
    while(lo<hi){const mid=(lo+hi)>>>1;if(events[mid].year<=t)lo=mid+1;else hi=mid;}
    const previous=events[lo-1],scale=this.ledgerScale();
    return Math.max(0,growPopulation(previous?.balance??this.ledgerInitial(s),t-(previous?.year??s.start),this.ledgerRate(s),s.ledger!.capacity*scale));
  }
  private ledgerRate(s:Settlement):number{return s.ledger!.closedCohort?0:this.opts.estimateMode==='mid'?s.ledger!.annualRate:this.ds.meta.ledger?.scenarioRates?.[this.opts.estimateMode]??s.ledger!.annualRate;}
  private ledgerInitial(s:Settlement):number{return this.opts.estimateMode==='low'?s.ledger!.initialLow??s.ledger!.initial*this.ledgerScale():this.opts.estimateMode==='high'?s.ledger!.initialHigh??s.ledger!.initial*this.ledgerScale():s.ledger!.initial;}
  private ledgerScale():number{return this.opts.estimateMode==='mid'?1:this.ds.meta.ledger?.scenarioReservoirScales?.[this.opts.estimateMode]??(this.opts.estimateMode==='low'?.2:4);}

  private cohortAllocations(): Map<string, number> {
    const out = new Map<string, number>();
    const byId = new Map(this.ds.migrations.map((m) => [m.id, m]));
    const requested = (m: Migration) => m.population ? Math.max(0, this.estimate(m.population.value, m.population.min, m.population.max)) : 0;
    const allocating = new Set<string>();
    const allocate = (m: Migration): number => {
      if (out.has(m.id)) return out.get(m.id)!;
      if (allocating.has(m.id)) return 0;
      allocating.add(m.id);
      let pop = requested(m);
      const parents = parentIds(m).map(id => byId.get(id)).filter((parent): parent is Migration => !!parent?.population);
      if (parents.length) {
        const children = new Set(parents.flatMap(parent => this.branches.get(parent.id) ?? []));
        const total = [...children].reduce((sum, child) => sum + requested(child), 0);
        const capacity = parents.reduce((sum, parent) => sum + allocate(parent), 0);
        pop *= Math.min(1, total > 0 ? capacity / total : 1);
      }
      allocating.delete(m.id);
      out.set(m.id, pop);
      return pop;
    };
    for (const m of this.ds.migrations) allocate(m);
    return out;
  }

  // ---------------------------------------------------------------- settlements

  private settlementFrame(s: Settlement, t: Year, view: View, ppd: number, recordBudget: number, leaving = 0,selectedPopulation?:number): SettlementFrame | null {
    const dur = (s.end ?? s.start + 200) - s.start;
    const tr = Math.min(s.transitionYears, dur * 0.5);
    // visibility window
    const fadeInYears = this.opts.temporalTransitions ? s.growthYears ?? Math.max(8, Math.min(25, dur * .1)) : Math.max(1e-6, Math.min(tr, dur * 0.1));
    if (t < s.start) return null;
    const alreadyPresent = !!s.ledger || s.start <= this.ds.meta.timeRange[0];
    let alpha = alreadyPresent ? 1 : smoothstep((t - s.start) / fadeInYears);
    const neutral=this.ds.meta.destinationColourFrom!==undefined && (s.tags.includes('standing-reservoir')?s.destinationColor===this.ds.meta.neutralColour:s.start<this.ds.meta.destinationColourFrom);
    let color = neutral ? this.ds.meta.neutralColour??'#9a7848' : this.opts.colorMode === 'destination' && s.destinationColor ? s.destinationColor : this.colorOf(s.group);
    if (s.end !== undefined && !this.opts.persistPeople) {
      const sinceEnd = t - s.end;
      if (s.fate === 'assimilated') {
        if (s.into) {
          // colour transitions over [end - tr, end]
          const k = smoothstep((t - (s.end - tr)) / Math.max(1e-6, tr));
          color = mixColors(color, this.colorOf(s.into), k);
        }
        // then fades out after end
        alpha *= 1 - smoothstep(sinceEnd / Math.max(1e-6, tr * 0.6));
      } else if (s.fate === 'continues') {
        alpha *= 1 - smoothstep(sinceEnd / Math.max(1e-6, tr * 0.3));
      } else {
        // dispersed / extinct / unknown: fade around the end date
        alpha *= 1 - smoothstep((t - (s.end - tr * 0.5)) / Math.max(1e-6, tr));
      }
    }
    if (alpha <= 0.005) return null;

    const { geom, prev, crossfade } = this.settlementGeometryAt(s, t);
    let population: number | undefined;
    if (s.population.length) {
      // use the chosen estimate mode
      const pts = s.population;
      const mid = populationAt(pts, t);
      if (mid !== undefined && this.opts.estimateMode !== 'mid') {
        const lo = populationAt(pts.map((p) => ({ ...p, value: p.min ?? p.value })), t)!;
        const hi = populationAt(pts.map((p) => ({ ...p, value: p.max ?? p.value })), t)!;
        population = this.opts.estimateMode === 'low' ? lo : hi;
      } else population = mid;
      // ramp population from zero across fade-in so the settlement grows into existence
      if (!alreadyPresent && population !== undefined && t < s.start + fadeInYears) population *= smoothstep((t - s.start) / fadeInYears);
      if (population !== undefined && s.end !== undefined && t > s.end && !this.opts.persistPeople) population *= alpha;
      if (population !== undefined) population = Math.max(0, population - leaving);
    }
    if(s.ledger)population=this.stockAt(s,t);
    if(selectedPopulation!==undefined)population=selectedPopulation;

    const screenRadius = geom.r * view.worldPx;
    const sd = this.settlementDots(s, ppd);
    let dotsWanted = population !== undefined ? Math.ceil(population / sd.peoplePerDot) : 0;
    dotsWanted = Math.min(dotsWanted, sd.n);
    const fullDotsWanted = dotsWanted;
    let aggregated = false;
    if (this.opts.lod) {
      if (screenRadius < 4) aggregated = dotsWanted > 0;
      else {
        const maxDots = Math.max(8, Math.floor((Math.PI * screenRadius * screenRadius) / 9));
        dotsWanted = Math.min(dotsWanted, maxDots, recordBudget);
      }
    }
    let displayPpd = population !== undefined && dotsWanted > 0 && dotsWanted < fullDotsWanted ? population / dotsWanted : sd.peoplePerDot;
    const buf = this.buffer('s:' + s.id, s.ledger ? Math.max(sd.n, s.ledger.maxSlot ?? 0) : sd.n);
    if (!aggregated && dotsWanted > 0) {
      const kfIndex = keyframeIndex(s.extent.map((k) => k.year), t);
      this.fillSettlementDots(s, sd, geom, kfIndex, dotsWanted, buf, prev, crossfade);
      // A partial last dot preserves small/zero populations without inventing
      // an entire people-per-dot unit.
      if (population !== undefined && buf.count) buf.alphas[buf.count - 1] *= Math.min(1, population / displayPpd - (buf.count - 1));
      if (buf.opacities) buf.opacities.fill(1,0,buf.count);
      if (buf.stopIndices) buf.stopIndices.fill(-1,0,buf.count);
    }
    if(s.ledger&&this.stableSlots){
      const scaled=this.opts.estimateMode==='mid'?s:{...s,ledger:{...s.ledger,annualRate:this.ledgerRate(s),initial:this.ledgerInitial(s),capacity:s.ledger.capacity*this.ledgerScale()}};
      const state=s.dispersion?standingSlotStateAt(this.stableSlots,scaled,t):undefined;
      const slots=state?.slots??standingSlotsAt(this.stableSlots,scaled,t),origins=state?.origins;let k=0,left=selectedPopulation??Infinity;
      for(const [slot,people]of slots){if(left<=1e-6)break;const point=s.dispersion?settlementSlotPosition(s,slot,t,origins?.get(slot)):s.displayPoints![slot%s.displayPoints!.length],weight=Math.min(people,left);left-=weight;
        buf.xs[k]=mercX(point[0]);buf.ys[k]=mercY(point[1]);buf.alphas[k]=weight/ppd;buf.opacities![k]=1;buf.states![k]=2;buf.slots![k]=slot;k++;
      }
      buf.count=k;dotsWanted=k;displayPpd=ppd;aggregated=false;
    }
    const residentGrowth=s.ledger?Math.max(0,Math.min(1,(population??0)/Math.max(1,s.ledger.capacity))):undefined;
    return {
      s, color, alpha, dotColors: stationaryLanguageColors(this.ds.meta.languageShifts, s.id, t, color, buf.xs, buf.ys, buf.count, s.displayPoints ?? []), areaAlpha: residentGrowth??alpha * (this.opts.temporalTransitions && s.end !== undefined ? 1-smoothstep((t-s.end)/Math.max(8,s.transitionYears)) : 1),
      growth: residentGrowth??(alreadyPresent ? 1 : smoothstep((t-s.start)/fadeInYears)), geom, geomPrev: prev, crossfade, population, dotsWanted, dots: buf, aggregated, screenRadius,
      peoplePerDot: displayPpd,
    };
  }

  private settlementDots(s: Settlement, ppd: number): SettDots {
    const key = s.id;
    let sd = this.settDots.get(key);
    const maxPop = s.ledger ? s.ledger.capacity*(this.ds.meta.ledger?.scenarioReservoirScales?.high??4) : s.population.reduce((m, p) => Math.max(m, p.max ?? p.value), 0);
    const wanted = Math.ceil(maxPop / ppd);
    const n = this.opts.lod ? Math.min(MAX_DOTS_SETTLEMENT, Math.max(0, wanted)) : Math.max(0, wanted);
    const effectivePpd = this.opts.lod && wanted > MAX_DOTS_SETTLEMENT ? maxPop / MAX_DOTS_SETTLEMENT : ppd;
    if (sd && sd.n === n && sd.peoplePerDot === effectivePpd) return sd;
    const rnd = rngFor(s.id, 'settlement');
    const ux = new Float32Array(n), uy = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      // uniform in unit disk, with a slight bias towards the centre so clusters read as settlements
      const r = Math.pow(rnd(), 0.6);
      const a = rnd() * Math.PI * 2;
      ux[i] = Math.cos(a) * r; uy[i] = Math.sin(a) * r;
    }
    sd = { n, ux, uy, polyMerc: new Map(), peoplePerDot: effectivePpd };
    this.settDots.set(key, sd);
    return sd;
  }

  private fillSettlementDots(s: Settlement, sd: SettDots, geom: MercGeometry, kfIndex: number, count: number, buf: DotBuffer, prev?: MercGeometry, crossfade = 1): void {
    if (s.displayPoints?.length) {
      for (let i = 0; i < count; i++) {
        const point = s.displayPoints[(i + (s.pointOffset ?? 0)) % s.displayPoints.length];
        buf.xs[i] = mercX(point[0]); buf.ys[i] = mercY(point[1]); buf.alphas[i] = 1;
        if (buf.states) buf.states[i] = 2;
      }
      buf.count = count;
      return;
    }
    const polygonPositions = (g: MercPolygon) => {
      const geometryIndex = this.settGeomCache.get(s.id)!.indexOf(g);
      const sampleKey = geometryIndex >= 0 ? geometryIndex : kfIndex;
      let points = sd.polyMerc.get(sampleKey);
      if (!points) { points = samplePolygon(s.id + ':' + sampleKey, g, sd.n); sd.polyMerc.set(sampleKey, points); }
      return points;
    };
    if (geom.kind === 'circle') {
      const r = geom.r;
      for (let i = 0; i < count; i++) {
        buf.xs[i] = geom.cx + sd.ux[i] * r;
        buf.ys[i] = geom.cy + sd.uy[i] * r;
        buf.alphas[i] = 1;
      }
    } else {
      const pm = polygonPositions(geom);
      for (let i = 0; i < count; i++) {
        buf.xs[i] = pm[i * 2];
        buf.ys[i] = pm[i * 2 + 1];
        buf.alphas[i] = 1;
      }
    }
    if (prev) {
      const points = prev.kind === 'polygon' ? polygonPositions(prev) : undefined;
      for (let i = 0; i < count; i++) {
        const x = points ? points[i * 2] : prev.cx + sd.ux[i] * prev.r;
        const y = points ? points[i * 2 + 1] : prev.cy + sd.uy[i] * prev.r;
        // A continuous move between the corresponding seeded positions keeps
        // dots from jumping at a polygon or mixed-geometry keyframe.
        const dx = buf.xs[i] - x;
        buf.xs[i] = x + (dx - Math.round(dx)) * crossfade;
        buf.ys[i] = y + (buf.ys[i] - y) * crossfade;
      }
    }
    buf.count = count;
  }

  // ---------------------------------------------------------------- migrations

  private migrationDots(m: Migration, ppd: number, pop: number): MigDots {
    let md = this.migDots.get(m.id);
    const wanted = Math.ceil(pop / ppd);
    const n = this.opts.lod ? Math.min(MAX_DOTS_MIGRATION, Math.max(0, wanted)) : Math.max(0, wanted);
    const effectivePpd = this.opts.lod && wanted > MAX_DOTS_MIGRATION ? pop / MAX_DOTS_MIGRATION : ppd;
    if (md && md.n === n && md.peoplePerDot === effectivePpd) return md;
    const rnd = rngFor(m.id, 'migration');
    const lag = new Float32Array(n), amp = new Float32Array(n), phase = new Float32Array(n), freq = new Float32Array(n);
    const ox = new Float32Array(n), oy = new Float32Array(n), ax = new Float32Array(n), ay = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      // Stratified, sorted departures make cohort transfer counts cheap and
      // prevent random early clumps at low dot counts.
      const first=this.routes.get(m.id)?.travelLegs[0];
      const fraction=(i+rnd())/n;
      lag[i] = first ? first.start + fraction*m.spread*(first.end-first.start) : fraction*m.spread;
      // amplitude: gaussian-ish across the corridor
      amp[i] = (rnd() + rnd() + rnd()) / 3 * 2 - 1;
      phase[i] = rnd() * Math.PI * 2;
      freq[i] = 1 + rnd() * 3;
      let r = Math.sqrt(rnd()), a = rnd() * Math.PI * 2;
      ox[i] = Math.cos(a) * r; oy[i] = Math.sin(a) * r;
      r = Math.sqrt(rnd()); a = rnd() * Math.PI * 2;
      ax[i] = Math.cos(a) * r; ay[i] = Math.sin(a) * r;
    }
    md = { n, lag, amp, phase, freq, ox, oy, ax, ay, peoplePerDot: effectivePpd };
    this.migDots.set(m.id, md);
    return md;
  }

  private migrationFrame(m: Migration, route: RouteGeom, t: Year, view: View, ppd: number, cohort: number, remaining: number, departedPeople: number, recordBudget: number): MigrationFrame | null {
    if(this.ds.meta.ledger)return this.ledgerMigrationFrame(m,route,t,ppd);
    const dur = m.end - m.start;
    const p = (t - m.start) / dur; // overall progress
    const sinceEnd = t - m.end;
    const md = this.migrationDots(m, ppd, cohort);
    const hasPopulation = !!m.population;

    // overall visibility
    let phase: MigPhase;
    if (t < m.start) return null;
    if (p < 1) phase = 'active';
    else phase = 'arrived';
    const fromS = m.fromSettlement ? this.settById.get(m.fromSettlement) : undefined;
    const toS = m.toSettlement ? this.settById.get(m.toSettlement) : undefined;
    const destinationOwnsPopulation = !!toS?.population.length && t >= toS.start;
    const persistEnd = this.opts.persistPeople ? Infinity : toS ? (destinationOwnsPopulation ? Math.max(m.end, toS.start) : toS.end ?? m.persistUntil ?? Infinity)
      : !m.persist ? m.end + dur * 0.12 : (m.persistUntil ?? Infinity);
    const fadeYears = Math.max(1, dur * 0.05);
    if (p >= 1 && t > persistEnd + fadeYears) phase = 'gone';
    let trailAlpha = 1;
    if (phase === 'arrived') {
      // trail dims after arrival
      trailAlpha = this.opts.keepTrails ? 1-.65*smoothstep(sinceEnd/fadeYears) : 1-smoothstep(sinceEnd/fadeYears);
      if (!this.opts.keepTrails && trailAlpha <= 0 && phase === 'arrived' && t > persistEnd + fadeYears) phase = 'gone';
    }
    if (phase === 'gone' && (!this.opts.keepTrails || !m.persist)) {
      if (!this.opts.keepTrails) return null;
    }

    // Waypoint dates describe the leading edge on the full event interval.
    const uFront = Math.min(1, p);
    const frontFrac = distFrac(route, uFront);
    const front = routePoint(route, frontFrac);

    const buf = this.buffer('m:' + m.id, md.n);
    // Pending child members remain in the inclusive root population until they
    // depart. Showing the root's remainder therefore preserves origin dots and
    // the total without also drawing a second pending child population.
    const wholeCohort = this.opts.showWholeCohort && !parentIds(m).length && !fromS;
    let fullCount = Math.min(md.n, Math.ceil(remaining / md.peoplePerDot), wholeCohort ? Infinity : Math.ceil(departedPeople / md.peoplePerDot));
    if (phase === 'gone') fullCount = 0;
    let count = fullCount;
    if (this.opts.lod && count > 0) {
      const lenPx = route.totalKm * mercUnitsPerKm(route.lat[Math.floor(route.n / 2)]) * view.worldPx;
      const corridorPx = Math.max(3, m.corridorWidthKm * mercUnitsPerKm(route.lat[0]) * view.worldPx);
      const maxDots = Math.max(24, Math.floor((lenPx * corridorPx) / 10));
      count = Math.min(fullCount, maxDots, recordBudget);
    }
    // Each retained dot represents the same weighted share of the visible
    // cohort. Sampling precedes position calculations to bound frame work.
    const displayPpd = count > 0 && count < fullCount ? md.peoplePerDot * Math.min(fullCount, remaining / md.peoplePerDot) / count : md.peoplePerDot;

    const originGeom = fromS ? this.settlementGeometryAt(fromS, m.start).geom : undefined;
    const destGeom = toS ? this.settlementGeometryAt(toS, m.end).geom : undefined;
    if (originGeom?.kind === 'polygon' && !md.originPolygon) md.originPolygon = samplePolygon(m.id + ':origin', originGeom, md.n);
    if (destGeom?.kind === 'polygon' && !md.arrivalPolygon) md.arrivalPolygon = samplePolygon(m.id + ':arrival', destGeom, md.n);
    const x0 = route.merc[0], y0 = route.merc[1];
    const x1 = route.merc[(route.n - 1) * 2], y1 = route.merc[(route.n - 1) * 2 + 1];
    const originR = originGeom ? originGeom.r : (wholeCohort ? this.opts.pendingRadiusKm ?? m.corridorWidthKm * 0.5 : m.corridorWidthKm * 0.5) * mercUnitsPerKm(route.lat[0]);
    const originCx = originGeom ? originGeom.cx + Math.round(x0 - originGeom.cx) : x0, originCy = originGeom ? originGeom.cy : y0;
    const arrR = destGeom ? destGeom.r : m.arrivalRadiusKm * mercUnitsPerKm(route.lat[route.n - 1]);
    const arrCx = destGeom ? destGeom.cx + Math.round(x1 - destGeom.cx) : x1, arrCy = destGeom ? destGeom.cy : y1;
    const corridorMerc = m.corridorWidthKm * 0.5 * mercUnitsPerKm(route.lat[Math.floor(route.n / 2)]);

    let k = 0;
    const originPoint = (i: number): [number, number] => m.originPoints?.length
      ? [mercX(m.originPoints[(i + (m.pointOffset ?? 0)) % m.originPoints.length][0]), mercY(m.originPoints[(i + (m.pointOffset ?? 0)) % m.originPoints.length][1])]
      : md.originPolygon
      ? [md.originPolygon[i * 2] + Math.round(x0 - originGeom!.cx), md.originPolygon[i * 2 + 1]]
      : [originCx + md.ox[i] * originR, originCy + md.oy[i] * originR];
    const arrivalPoint = (i: number): [number, number] => m.arrivalPoints?.length
      ? [mercX(m.arrivalPoints[(i + (m.pointOffset ?? 0)) % m.arrivalPoints.length][0]), mercY(m.arrivalPoints[(i + (m.pointOffset ?? 0)) % m.arrivalPoints.length][1])]
      : md.arrivalPolygon
      ? [md.arrivalPolygon[i * 2] + Math.round(x1 - destGeom!.cx), md.arrivalPolygon[i * 2 + 1]]
      : [arrCx + md.ax[i] * arrR, arrCy + md.ay[i] * arrR];
    for (let j = 0; j < count; j++) {
      const i = Math.floor(j * fullCount / count);
      const first=route.travelLegs[0];
      const q=first&&m.spread>0?(md.lag[i]-first.start)/(m.spread*(first.end-first.start)):0;
      const progress=scheduledDot(route,p,q,m.spread);
      const u=progress.pending?0:progress.distance>=1?1:.5;
      if (u <= 0 && !wholeCohort) continue; // not yet departed
      let alpha = count < fullCount ? 1 : Math.min(1, remaining / md.peoplePerDot - i);
      let x: number, y: number;
      if (u <= 0) {
        [x, y] = originPoint(i);
      } else if (u >= 1) {
        // arrived
        // A supplied destination population timeline already counts residents.
        // Keeping arrived dots alongside it would count those residents twice.
        if (destinationOwnsPopulation) continue;
        const since = t - m.end;
        if (!toS && !m.persist) alpha *= 1 - smoothstep(since / Math.max(1e-6, dur * 0.12));
        if (Number.isFinite(persistEnd)) alpha *= 1 - smoothstep((t - persistEnd) / fadeYears);
        if (alpha <= 0.01) continue;
        [x, y] = arrivalPoint(i);
      } else {
        const df = progress.distance;
        const pt = routePointWithTangent(route, df);
        // lateral jitter, tapering at both ends
        const env = Math.min(1, df / 0.12, (1 - df) / 0.12);
        const wob = 0.65 + 0.35 * Math.sin(md.freq[i] * df * Math.PI * 2 + md.phase[i]);
        const off = md.amp[i] * corridorMerc * wob * env;
        x = pt[0] + pt[3] * off;
        y = pt[1] + pt[4] * off;
        if(progress.stop!==undefined) {
          const stop=m.stops?.[progress.stop];
          if(stop?.points.length) {const point=stop.points[(i+(m.pointOffset??0))%stop.points.length];x=mercX(point[0]);y=mercY(point[1]);}
        }
        // blend from origin scatter
        if (df < 0.15) {
          const s = smoothstep(df / 0.15);
          const [sx, sy] = originPoint(i);
          x = sx + (x - sx) * s; y = sy + (y - sy) * s;
        }
        // blend into arrival scatter
        if (df > 0.85) {
          const s = smoothstep((df - 0.85) / 0.15);
          const [sx, sy] = arrivalPoint(i);
          x = x + (sx - x) * s; y = y + (sy - y) * s;
        }
      }
      buf.xs[k] = x; buf.ys[k] = y; buf.alphas[k] = alpha;
      if(buf.stopIndices)buf.stopIndices[k]=progress.stop??-1;
      if (buf.opacities) {
        const fade = Math.max(.000001,Math.min(m.fadeInYears ?? 15,dur*.15));
        const born = wholeCohort ? m.start : m.start + md.lag[i] * dur;
        buf.opacities[k] = this.opts.temporalTransitions ? smoothstep((t - born) / fade) : 1;
      }
      if (buf.states) buf.states[k] = u <= 0 ? 0 : u >= 1 ? 2 : 1;
      k++;
    }
    buf.count = k;
    if (phase === 'gone' && k === 0 && !this.opts.keepTrails) return null;

    return {
      m, color: this.ds.meta.destinationColourFrom!==undefined&&m.start<this.ds.meta.destinationColourFrom ? this.ds.meta.neutralColour??'#9a7848' : this.opts.colorMode === 'destination' && m.destinationColor ? m.destinationColor : this.colorOf(m.group), phase, frontFrac, trailAlpha, dots: buf, frontX: front[0], frontY: front[1],
      hasPopulation, peoplePerDot: displayPpd, route, sinceEnd,
    };
  }

  private ledgerMigrationFrame(m:Migration,route:RouteGeom,t:number,ppd:number):MigrationFrame|null {
    const events=this.transfers.get(m.id)??[],buf=this.buffer('m:'+m.id,events.length);
    let k=0,frontFrac=0;
    const source=this.settById.get(m.fromSettlement??'');
    for(const e of events){if(e.departure>t)break;if(e.arrival<=t)continue;
      const progress=transferProgress(m,e.departure,t),fraction=progress.distance;
      const point=routePoint(route,fraction);let x=point[0],y=point[1];
      // Depart from an already visible standing population; no origin dots
      // are instantiated or faded into existence on a migration record.
      const link=this.stableSlots?.transfers.get(transferKey(m.id,e.index));
      const fromSlot=link?.fromSlot??e.index,toSlot=link?.toSlot??e.index;
      let origin=source?.displayPoints?.[fromSlot%source.displayPoints.length];
      if(source?.dispersion&&source.ledger&&this.stableSlots){
        const key=transferKey(m.id,e.index);
        if(!this.departurePositions.has(key)){
          const scaled={...source,ledger:{...source.ledger,initial:this.ledgerInitial(source),annualRate:this.ledgerRate(source),capacity:source.ledger.capacity*this.ledgerScale()}};
          const at=e.departure-1e-7,origins=standingSlotOriginsAt(this.stableSlots,scaled,at);
          this.departurePositions.set(key,settlementSlotPosition(source,fromSlot,at,origins.get(fromSlot)));
        }
        origin=this.departurePositions.get(key);
      }
      const originBlend=source?.dispersion ? .25 : .12;
      if(origin&&fraction<originBlend){const u=smoothstep(fraction/originBlend);x=mercX(origin[0])+(x-mercX(origin[0]))*u;y=mercY(origin[1])+(y-mercY(origin[1]))*u;}
      const dest=this.settById.get(m.toSettlement??'');
      const arrival=dest?.dispersion?.entryPoints[toSlot%dest.dispersion.entryPoints.length]??dest?.displayPoints?.[toSlot%dest.displayPoints.length];
      const arrivalBlend=dest?.dispersion ? .25 : .12;
      if(arrival&&fraction>1-arrivalBlend){const u=smoothstep((fraction-1+arrivalBlend)/arrivalBlend);x+=(mercX(arrival[0])-x)*u;y+=(mercY(arrival[1])-y)*u;}
      let stopIndex=-1,stopWeight=0;
      for(const [index,hold]of (m.ledgerHolds??[]).entries())if(Math.abs(fraction-hold.distance)<.05&&hold.points.length){const weight=1-smoothstep(Math.abs(fraction-hold.distance)/.05),p=hold.points[(e.index+(m.pointOffset??0))%hold.points.length];x+=(mercX(p[0])-x)*weight;y+=(mercY(p[1])-y)*weight;stopIndex=index;stopWeight=weight;}
      buf.xs[k]=x;buf.ys[k]=y;buf.alphas[k]=e.people/ppd;buf.opacities![k]=1;buf.states![k]=1;buf.stopIndices![k]=stopIndex;buf.stopWeights![k]=stopWeight;buf.fromSlots![k]=fromSlot;buf.toSlots![k]=toSlot;buf.slots![k]=e.index;buf.progress![k]=fraction;k++;
      frontFrac=Math.max(frontFrac,fraction);
    }
    buf.count=k;const front=routePoint(route,frontFrac);
    return {m,route,color:this.ds.meta.destinationColourFrom!==undefined&&m.start<this.ds.meta.destinationColourFrom?this.ds.meta.neutralColour??'#9a7848':this.opts.colorMode==='destination'?m.destinationColor??this.colorOf(m.group):this.colorOf(m.group),
      phase:t>=m.end?'arrived':'active',frontFrac,trailAlpha:0,dots:buf,frontX:front[0],frontY:front[1],hasPopulation:true,peoplePerDot:ppd,sinceEnd:t-m.end};
  }
}

// ------------------------------------------------------------------ geometry helpers

export function buildRoute(m: Migration): RouteGeom {
  const wps = m.path;
  const pts: number[] = [];
  const lats: number[] = [];
  const cum: number[] = [];
  const wpIndex: number[] = [];
  let total = 0;
  let prevLon = wps[0].coord[0];
  let lonOffset = 0;
  const push = (c: LonLat) => {
    // unwrap longitude for continuity across the antimeridian
    let lon = c[0] + lonOffset;
    if (lon - prevLon > 180) { lonOffset -= 360; lon -= 360; }
    else if (lon - prevLon < -180) { lonOffset += 360; lon += 360; }
    prevLon = lon;
    pts.push(mercX(lon), mercY(c[1]));
    lats.push(c[1]);
  };
  push(wps[0].coord);
  cum.push(0);
  wpIndex.push(0);
  for (let i = 1; i < wps.length; i++) {
    const a = wps[i - 1].coord, b = wps[i].coord;
    const segKm = haversineKm(a, b);
    const steps = Math.max(1, Math.min(200, Math.ceil(segKm / 25)));
    let prev = a;
    for (let s = 1; s <= steps; s++) {
      const q = s === steps ? b : slerp(a, b, s / steps);
      total += haversineKm(prev, q);
      push(q);
      cum.push(total);
      prev = q;
    }
    wpIndex.push(cum.length - 1);
  }
  const n = cum.length;
  // time knots
  const dur = m.end - m.start;
  const tKnots = [0], dKnots = [0];
  for (let i = 1; i < wps.length - 1; i++) {
    const y = wps[i].year;
    if (y === undefined) continue;
    const tf = (y - m.start) / dur;
    const df = total > 0 ? cum[wpIndex[i]] / total : 0;
    if (tf > tKnots[tKnots.length - 1] && df >= dKnots[dKnots.length - 1]) { tKnots.push(tf); dKnots.push(df); }
  }
  tKnots.push(1); dKnots.push(1);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < n; i++) {
    const x = pts[i * 2], y = pts[i * 2 + 1];
    if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  const pad = (m.corridorWidthKm + m.arrivalRadiusKm) * mercUnitsPerKm(lats[Math.floor(n / 2)]) + 0.002;
  const travelLegs:RouteGeom['travelLegs']=[];
  let legStart=0,legFrom=0;
  for(let i=0;i<wps.length-1;i++) {
    const a=wps[i],b=wps[i+1];
    if(a.year===undefined||b.year===undefined||b.year<=a.year||haversineKm(a.coord,b.coord)>.001)continue;
    const begin=(a.year-m.start)/dur,end=(b.year-m.start)/dur,at=total>0?cum[wpIndex[i]]/total:0;
    const stop=m.stops?.findIndex(s=>Math.abs(s.start-a.year!)<.00001&&Math.abs(s.end-b.year!)<.00001);
    if(begin>legStart+1e-10&&at>legFrom)travelLegs.push({start:legStart,end:begin,from:legFrom,to:at,stopAfter:stop!==undefined&&stop>=0?stop:undefined});
    legStart=end;legFrom=at;
  }
  if(legStart<1&&legFrom<1)travelLegs.push({start:legStart,end:1,from:legFrom,to:1});
  return {
    travelLegs,
    merc: Float64Array.from(pts), lat: Float32Array.from(lats), cum: Float64Array.from(cum), totalKm: total, n,
    tKnots, dKnots, wpIndex, bbox: [minX - pad, minY - pad, maxX + pad, maxY + pad],
  };
}

/** Each leg keeps its calendar boundaries and stop; arrivals are staggered
 * within that leg instead of every dot landing together at the final year. */
export function scheduledDot(route:RouteGeom,p:number,q:number,spread:number):{distance:number;pending:boolean;stop?:number} {
  const first=route.travelLegs[0];
  if(!first)return {distance:p>=1?1:0,pending:p<1};
  let distance=0,stop:number|undefined;
  for(const leg of route.travelLegs) {
    if(p<leg.start)return {distance,pending:distance===0,stop};
    const local=(p-leg.start)/Math.max(1e-12,leg.end-leg.start);
    const depart=q*spread,arrive=1-spread+q*spread;
    if(local<=depart)return {distance:leg.from,pending:leg.from===0,stop};
    if(local<arrive) return {distance:leg.from+(leg.to-leg.from)*(local-depart)/Math.max(.001,arrive-depart),pending:false};
    distance=leg.to;stop=leg.stopAfter;
    if(p<leg.end)return {distance,pending:false,stop};
  }
  return {distance:1,pending:false};
}

/** Map time fraction (0..1) to distance fraction using the waypoint schedule. */
export function distFrac(route: RouteGeom, u: number): number {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  const tk = route.tKnots, dk = route.dKnots;
  for (let i = 1; i < tk.length; i++) {
    if (u <= tk[i]) {
      const f = (u - tk[i - 1]) / (tk[i] - tk[i - 1] || 1);
      return dk[i - 1] + (dk[i] - dk[i - 1]) * f;
    }
  }
  return 1;
}

/** Position (merc x,y) at distance fraction. */
export function routePoint(route: RouteGeom, df: number): [number, number] {
  const p = routePointWithTangent(route, df);
  return [p[0], p[1]];
}

const tmp: [number, number, number, number, number] = [0, 0, 0, 0, 0];
/** Returns [x, y, lat, perpX, perpY] at distance fraction df. */
export function routePointWithTangent(route: RouteGeom, df: number): [number, number, number, number, number] {
  const target = df * route.totalKm;
  const cum = route.cum;
  // binary search
  let lo = 0, hi = route.n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= target) lo = mid; else hi = mid;
  }
  const segLen = cum[hi] - cum[lo] || 1;
  const f = Math.max(0, Math.min(1, (target - cum[lo]) / segLen));
  const x0 = route.merc[lo * 2], y0 = route.merc[lo * 2 + 1];
  const x1 = route.merc[hi * 2], y1 = route.merc[hi * 2 + 1];
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  tmp[0] = x0 + dx * f; tmp[1] = y0 + dy * f;
  tmp[2] = route.lat[lo] + (route.lat[hi] - route.lat[lo]) * f;
  tmp[3] = -dy / len; tmp[4] = dx / len;
  return tmp;
}

export function toMerc(g: Geometry): MercGeometry {
  if (g.kind === 'circle') {
    return {
      kind: 'circle', cx: mercX(g.center[0]), cy: mercY(g.center[1]), r: g.radiusKm * mercUnitsPerKm(g.center[1]),
      lat: g.center[1], center: g.center, radiusKm: g.radiusKm,
    };
  }
  const anchor = g.rings[0][0][0];
  const rings = g.rings.map((ring) => {
    const arr = new Float64Array(ring.length * 2);
    const unwrapped = unwrapRing(ring, anchor);
    for (let i = 0; i < ring.length; i++) {
      arr[i * 2] = mercX(unwrapped[i][0]); arr[i * 2 + 1] = mercY(unwrapped[i][1]);
    }
    return arr;
  });
  const c = ringCentroid(g.rings[0]);
  const rKm = ringRadiusKm(g.rings[0], c);
  const centerLon = c[0] + 360 * Math.round((anchor - c[0]) / 360);
  return { kind: 'polygon', rings, cx: mercX(centerLon), cy: mercY(c[1]), r: rKm * mercUnitsPerKm(c[1]), center: c, radiusKm: rKm };
}

/** Test geographic extents in the longitude copy nearest the viewport. */
export function intersectsWrappedBBox(bx: [number, number, number, number], view: Pick<View, 'minX' | 'minY' | 'maxX' | 'maxY'>): boolean {
  if (bx[3] < view.minY || bx[1] > view.maxY) return false;
  const shift = Math.round((view.minX + view.maxX - bx[0] - bx[2]) * 0.5);
  return bx[2] + shift >= view.minX && bx[0] + shift <= view.maxX;
}

export function geomBBox(g: MercGeometry): [number, number, number, number] {
  if (g.kind === 'circle') return [g.cx - g.r, g.cy - g.r, g.cx + g.r, g.cy + g.r];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const ring of g.rings) for (let i = 0; i < ring.length; i += 2) {
    const x = ring[i], y = ring[i + 1];
    if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return [minX, minY, maxX, maxY];
}

export function keyframeIndex(years: number[], t: Year): number {
  let idx = 0;
  for (let i = 0; i < years.length; i++) if (years[i] <= t) idx = i;
  return idx;
}

function interpolateGeometry(years: number[], geoms: MercGeometry[], t: Year): { geom: MercGeometry; prev?: MercGeometry; crossfade: number } {
  if (geoms.length === 1 || t <= years[0]) return { geom: geoms[0], crossfade: 1 };
  const last = geoms.length - 1;
  if (t >= years[last]) return { geom: geoms[last], crossfade: 1 };
  for (let i = 1; i < geoms.length; i++) {
    if (t <= years[i]) {
      const a = geoms[i - 1], b = geoms[i];
      const f = (t - years[i - 1]) / (years[i] - years[i - 1] || 1);
      if (a.kind === 'circle' && b.kind === 'circle') {
        const dx = b.cx - a.cx;
        const cx = a.cx + (dx - Math.round(dx)) * f, cy = a.cy + (b.cy - a.cy) * f, r = a.r + (b.r - a.r) * f;
        const lat = a.lat + (b.lat - a.lat) * f;
        return {
          geom: { kind: 'circle', cx, cy, r, lat, center: [cx * 360 - 180, lat], radiusKm: a.radiusKm + (b.radiusKm - a.radiusKm) * f },
          crossfade: 1,
        };
      }
      // polygons (or mixed): crossfade near the keyframe boundary
      const window = 0.3; // last 30% of the interval
      const cf = f < 1 - window ? 0 : (f - (1 - window)) / window;
      return cf <= 0 ? { geom: a, crossfade: 1 } : { geom: b, prev: a, crossfade: smoothstep(cf) };
    }
  }
  return { geom: geoms[last], crossfade: 1 };
}

/** Deterministically sample n points inside a polygon (merc coords, interleaved). */
function samplePolygon(seed: string, g: MercPolygon, n: number): Float32Array {
  const out = new Float32Array(n * 2);
  const rnd = rngFor(seed, 'poly');
  const [, minY, , maxY] = geomBBox(g);
  // Sample horizontal interior spans, including holes. Unlike bbox rejection
  // this stays bounded for thin/concave polygons and never falls back to a
  // centroid that may lie outside the supplied settlement.
  for (let k = 0; k < n; k++) {
    const y = minY + (0.000001 + rnd() * 0.999998) * (maxY - minY);
    const cuts: number[] = [];
    for (const ring of g.rings) {
      const len = ring.length / 2;
      for (let i = 0, j = len - 1; i < len; j = i++) {
        const xi = ring[i * 2], yi = ring[i * 2 + 1], xj = ring[j * 2], yj = ring[j * 2 + 1];
        if ((yi > y) !== (yj > y)) cuts.push(xi + (xj - xi) * (y - yi) / (yj - yi));
      }
    }
    cuts.sort((a, b) => a - b);
    let width = 0;
    for (let i = 1; i < cuts.length; i += 2) width += cuts[i] - cuts[i - 1];
    let distance = rnd() * width, x = g.cx;
    for (let i = 1; i < cuts.length; i += 2) {
      const span = cuts[i] - cuts[i - 1];
      if (distance <= span) { x = cuts[i - 1] + distance; break; }
      distance -= span;
    }
    out[k * 2] = x; out[k * 2 + 1] = y;
  }
  return out;
}
