import type { Dataset, LonLat } from '../data/types';
import type { FrameState, View } from '../sim/engine';
import { advancePhasePlayback, phasePlaybackDuration } from '../time/phase-pacing';
import { mercToLonLat, mercUnitsPerKm, mercX, mercY } from '../util/geo';

export interface PopulationCameraViewport {
  width: number;
  height: number;
  padding?: Partial<{ top: number; bottom: number; left: number; right: number }>;
}
export interface PopulationCameraTarget { center: LonLat; zoom: number }
type Populations = Pick<FrameState, 'settlements' | 'migrations'>;
interface CameraBounds { west: number; east: number; north: number; south: number }

/** Preserve render scale while disabling geographic viewport culling. */
export function populationCameraView(view: View): View {
  return { ...view, minX: -2, maxX: 3, minY: -1, maxY: 2 };
}

function viewportMetrics(viewport: PopulationCameraViewport) {
  const dimension = (value: number) => Number.isFinite(value) ? Math.max(1, value) : 1;
  const pad = (value: number | undefined, fallback: number) => value === undefined ? fallback : Number.isFinite(value) ? Math.max(0, value) : fallback;
  return { width: dimension(viewport.width), height: dimension(viewport.height),
    left: pad(viewport.padding?.left, 28), right: pad(viewport.padding?.right, 28),
    top: pad(viewport.padding?.top, 28), bottom: pad(viewport.padding?.bottom, 52) };
}

function occupiedBounds(frame: Populations, contextBounds?: [LonLat, LonLat]): CameraBounds | null {
  const xs: number[] = [];
  let north = Infinity, south = -Infinity;
  for (const item of [...frame.settlements, ...frame.migrations]) {
    const dots = item.dots;
    for (let i = 0; i < dots.count; i++) {
      const x = dots.xs[i], y = dots.ys[i], weight = dots.alphas[i];
      if (!(weight > 0) || !Number.isFinite(weight) || !Number.isFinite(x) || !Number.isFinite(y)) continue;
      xs.push(((x % 1) + 1) % 1);
      north = Math.min(north, y); south = Math.max(south, y);
    }
  }
  if (!xs.length) return null;
  // Context constrains the camera without creating resident populations.
  if (contextBounds) for (const [lon, lat] of contextBounds) {
    xs.push(((mercX(lon) % 1) + 1) % 1);
    north = Math.min(north, mercY(lat)); south = Math.max(south, mercY(lat));
  }
  // A regional footprint under half the world has one unambiguous empty gap.
  // Avoid sorting thousands of dots for every planned camera sample.
  let minimumX = Infinity, maximumX = -Infinity;
  for (const x of xs) { minimumX = Math.min(minimumX, x); maximumX = Math.max(maximumX, x); }
  if (maximumX-minimumX < .5) return { west: minimumX, east: maximumX, north, south };
  // Cut at the largest empty longitude gap, keeping Pacific cohorts local.
  xs.sort((a, b) => a - b);
  let largestGap = -1, west = xs[0];
  for (let i = 0; i < xs.length; i++) {
    const next = xs[(i + 1) % xs.length] + (i === xs.length - 1 ? 1 : 0);
    if (next - xs[i] > largestGap) { largestGap = next - xs[i]; west = next % 1; }
  }
  let east = west;
  for (const x of xs) east = Math.max(east, x < west ? x + 1 : x);
  return { west, east, north, south };
}

function fitOccupiedBounds(bounds: CameraBounds, viewport: PopulationCameraViewport, maximumZoom = 6, margin = 1.18): PopulationCameraTarget {
  const centerX = (bounds.west + bounds.east) / 2, centerY = (bounds.north + bounds.south) / 2;
  const latitude = mercToLonLat(centerX, centerY)[1];
  const minimumSpan = 50 * mercUnitsPerKm(latitude);
  const spanX = Math.max(minimumSpan, (bounds.east - bounds.west) * margin);
  const spanY = Math.max(minimumSpan, (bounds.south - bounds.north) * margin);
  const p = viewportMetrics(viewport);
  const availableWidth = Math.max(1, p.width - p.left - p.right);
  const availableHeight = Math.max(1, p.height - p.top - p.bottom);
  const scale = Math.min(availableWidth / spanX, availableHeight / spanY, 512 * 2 ** maximumZoom);
  const center = mercToLonLat(centerX - (p.left - p.right) / (2 * scale), centerY - (p.top - p.bottom) / (2 * scale));
  center[0] = ((center[0] + 180) % 360 + 360) % 360 - 180;
  return { center, zoom: Math.log2(scale / 512) };
}

/** Stateless default: revisiting a date produces the same occupied-dot target. */
export function populationCameraFrame(frame: Populations, viewport: PopulationCameraViewport, contextBounds?: [LonLat, LonLat]): PopulationCameraTarget | null {
  const bounds = occupiedBounds(frame, contextBounds);
  return bounds ? fitOccupiedBounds(bounds, viewport) : null;
}

/** Fit a declared overview rectangle without treating it as resident population. */
export function geographicCameraFrame(bounds: [number, number, number, number], viewport: PopulationCameraViewport): PopulationCameraTarget {
  const [west, south, east, north] = bounds;
  return fitOccupiedBounds({west:mercX(west),east:mercX(east),north:mercY(north),south:mercY(south)},viewport,6,1.06);
}

function visibleBounds(camera: PopulationCameraTarget, viewport: PopulationCameraViewport): CameraBounds {
  const p = viewportMetrics(viewport), scale = 512 * 2 ** camera.zoom;
  const x = mercX(camera.center[0]), y = mercY(camera.center[1]);
  return { west: x + (p.left - p.width / 2) / scale, east: x + (p.width / 2 - p.right) / scale,
    north: y + (p.top - p.height / 2) / scale, south: y + (p.height / 2 - p.bottom) / scale };
}

function alignBounds(bounds: CameraBounds, reference: CameraBounds): CameraBounds {
  const shift = Math.round((reference.west + reference.east - bounds.west - bounds.east) / 2);
  return { ...bounds, west: bounds.west + shift, east: bounds.east + shift };
}
function unionBounds(a: CameraBounds, b: CameraBounds): CameraBounds {
  b = alignBounds(b, a);
  return { west: Math.min(a.west, b.west), east: Math.max(a.east, b.east), north: Math.min(a.north, b.north), south: Math.max(a.south, b.south) };
}

/** Test the current usable viewport, including wrapped longitudes. */
export function populationCameraContains(frame: Populations, camera: PopulationCameraTarget, viewport: PopulationCameraViewport, contextBounds?: [LonLat, LonLat]): boolean {
  const occupied = occupiedBounds(frame, contextBounds);
  if (!occupied) return true;
  const visible = visibleBounds(camera, viewport), bounds = alignBounds(occupied, visible), epsilon = 1e-10;
  return bounds.west >= visible.west - epsilon && bounds.east <= visible.east + epsilon
    && bounds.north >= visible.north - epsilon && bounds.south <= visible.south + epsilon;
}

/** Opt-in camera memory: keep the prior usable overview until new occupied
 * ground needs more room. The 18% fitting margin is a geographic deadband,
 * so every moving dot does not trigger another pan or zoom operation. */
export class ExpandingPopulationCamera {
  private target: PopulationCameraTarget | null = null;
  private bounds: CameraBounds | null = null;
  private viewportKey = '';

  reset(): void { this.target = null; this.bounds = null; this.viewportKey = ''; }

  /** A manual outward view can constrain a later explicit follow action.
   * Manual gestures themselves remain outside automatic camera control. */
  retain(camera: PopulationCameraTarget, viewport: PopulationCameraViewport): void {
    const actual = visibleBounds(camera, viewport);
    const bounds = this.bounds ? unionBounds(this.bounds, actual) : actual;
    const maximumZoom = Math.min(this.target?.zoom ?? camera.zoom, camera.zoom);
    this.target = fitOccupiedBounds(bounds, viewport, maximumZoom, 1);
    this.bounds = visibleBounds(this.target, viewport);
    this.viewportKey = JSON.stringify(viewportMetrics(viewport));
  }

  frame(frame: Populations, viewport: PopulationCameraViewport, contextBounds?: [LonLat, LonLat]): PopulationCameraTarget | null {
    let occupied = occupiedBounds(frame, contextBounds);
    if (!occupied) return this.target;
    const key = JSON.stringify(viewportMetrics(viewport));
    let margin = 1.18;
    if (this.bounds && this.target) {
      occupied = alignBounds(occupied, this.bounds);
      const epsilon = 1e-10, inset = 12 / (512 * 2 ** this.target.zoom);
      const visible = alignBounds(visibleBounds(this.target, viewport), this.bounds);
      const sameViewport = key === this.viewportKey;
      if (sameViewport && occupied.west >= visible.west + inset - epsilon && occupied.east <= visible.east - inset + epsilon
        && occupied.north >= visible.north + inset - epsilon && occupied.south <= visible.south - inset + epsilon) {
        // A wider layout can expose blank ground. Retain new occupied ground,
        // without treating all incidental blank space as another enlargement.
        this.bounds = unionBounds(this.bounds, occupied);
        return this.target;
      }
      const newGround = occupied.west < this.bounds.west - epsilon || occupied.east > this.bounds.east + epsilon
        || occupied.north < this.bounds.north - epsilon || occupied.south > this.bounds.south + epsilon;
      if (!sameViewport && !newGround) margin = 1;
      occupied = unionBounds(this.bounds, occupied);
    }
    this.target = fitOccupiedBounds(occupied, viewport, this.target?.zoom ?? 6, margin);
    // Layout-only fits preserve the geographic constraint itself. Expanding
    // it to each resized viewport would cause repeated panel toggles to ratchet
    // the camera outward even when no person moved.
    this.bounds = margin === 1 ? occupied : visibleBounds(this.target, viewport);
    this.viewportKey = key;
    return this.target;
  }
}


interface CameraExpansion { seconds: number; start: number; delta: CameraBounds }
export interface SteadyPopulationCameraPlan {
  /** Fit the deterministic geographic track to the current layout. */
  at(year: number, viewport: PopulationCameraViewport, current?: Populations): PopulationCameraTarget | null;
  readonly sampleCount: number;
}

/** Retain occupied ground and ease each outward edge before the next expansion.
 * Only nearby chronological expansions contribute; the opening is unchanged.
 * Scalar bounds are copied immediately because Engine reuses its dot buffers. */
export function createSteadyPopulationCameraPlan(
  dataset: Dataset, frameAtYear: (year: number) => Populations,
  contextBounds?: [LonLat, LonLat],
): SteadyPopulationCameraPlan | null {
  const range = dataset.meta.timeRange, speed = dataset.meta.playback?.defaultSpeed ?? 20;
  if (!dataset.meta.playback?.phases?.length) return null;
  const duration = phasePlaybackDuration(dataset, range);
  if (!(duration > 0) || !Number.isFinite(duration)) return null;
  const secondsAt = (year: number) => year <= range[0] ? 0 : phasePlaybackDuration(dataset, [range[0], Math.min(range[1], year)]);
  const times = new Set<number>([0, duration]);
  // Four samples per playback second plus exact activation/arrival boundaries.
  const count = Math.ceil(duration * 4);
  for (let i = 1; i < count; i++) times.add(i / 4);
  const add = (year: number | undefined) => { if (year !== undefined && year > range[0] && year < range[1]) times.add(secondsAt(year)); };
  for (const settlement of dataset.settlements) { add(settlement.start); add(settlement.end); }
  for (const migration of dataset.migrations) {
    add(migration.start); add(migration.end);
    for (const stop of migration.stops ?? []) { add(stop.start); add(stop.end); }
  }
  let initial: CameraBounds | null = null, retained: CameraBounds | null = null, firstSeconds = 0;
  const expansions: CameraExpansion[] = [];
  for (const seconds of [...times].sort((a,b) => a-b)) {
    const year = advancePhasePlayback(range[0], seconds, range, speed, false, dataset).t;
    const occupied = occupiedBounds(frameAtYear(year), contextBounds);
    if (!occupied) continue;
    if (!initial || !retained) { initial = { ...occupied }; retained = { ...occupied }; firstSeconds = seconds; continue; }
    const next = unionBounds(retained, occupied);
    const delta = { west: next.west-retained.west, east: next.east-retained.east,
      north: next.north-retained.north, south: next.south-retained.south };
    if (Object.values(delta).some(value => Math.abs(value) > 1e-12)) {
      expansions.push({ seconds, start: Math.max(firstSeconds, seconds-1.5), delta });
      retained = next;
    }
  }
  if (!initial) return { at: () => null, sampleCount: times.size };
  const opening = initial;
  return {
    sampleCount: times.size,
    at(year, viewport, current) {
      const seconds = secondsAt(year);
      if (seconds < firstSeconds-1e-9) return null;
      let bounds = { ...opening };
      for (const expansion of expansions) {
        if (seconds <= expansion.start) continue;
        const u = Math.max(0, Math.min(1, (seconds-expansion.start)/(expansion.seconds-expansion.start)));
        const weight = u*u*(3-2*u);
        bounds.west += expansion.delta.west*weight; bounds.east += expansion.delta.east*weight;
        bounds.north += expansion.delta.north*weight; bounds.south += expansion.delta.south*weight;
      }
      let camera = fitOccupiedBounds(bounds, viewport);
      // Irregular manual times/short transits must still include every person.
      // The ordinary 18% margin keeps this safety correction inactive in playback.
      if (current && !populationCameraContains(current, camera, viewport, contextBounds)) {
        const occupied = occupiedBounds(current, contextBounds);
        if (occupied) { bounds = unionBounds(bounds, occupied); camera = fitOccupiedBounds(bounds, viewport); }
      }
      return camera;
    },
  };
}
