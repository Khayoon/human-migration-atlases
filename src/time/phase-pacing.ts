import type { Dataset, PhasePlaybackInterval } from '../data/types';

interface ClockSegment extends PhasePlaybackInterval { startSeconds: number; endSeconds: number }
interface PhaseSchedule { segments: ClockSegment[]; duration: number; defaultSpeed: number }

function orderedPhases(value: unknown): value is PhasePlaybackInterval[] {
  if (!Array.isArray(value) || !value.length) return false;
  let previous: number | undefined, elapsed = 0;
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
    const { from, to, yearsPerSecond } = item;
    if (![from, to, yearsPerSecond].every(value => typeof value === 'number' && Number.isFinite(value))
      || to <= from || yearsPerSecond <= 0 || previous !== undefined && from !== previous) return false;
    const duration = (to - from) / yearsPerSecond;
    elapsed += duration;
    if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(elapsed)) return false;
    previous = to;
  }
  return true;
}

/** Reject the complete schedule on any invalid interval; do not repair chronology. */
export function readPlaybackPhases(value: unknown, range: [number, number]): PhasePlaybackInterval[] | null {
  if (!range.every(Number.isFinite) || range[1] <= range[0] || !orderedPhases(value)
    || value[0].from > range[0] || value[value.length - 1].to < range[1]) return null;
  return value.map(({ from, to, yearsPerSecond }) => ({ from, to, yearsPerSecond }));
}

/** Exact boundaries select the following phase; out-of-range dates use the edge rate. */
export function phaseRateAt(t: number, phases: readonly PhasePlaybackInterval[]): number {
  if (!Number.isFinite(t) || !orderedPhases(phases)) return 0;
  for (const phase of phases) if (t < phase.to) return phase.yearsPerSecond;
  return phases[phases.length - 1].yearsPerSecond;
}

function schedule(dataset: Dataset, range: [number, number]): PhaseSchedule | null {
  const playback = dataset.meta.playback;
  if (!playback || !Number.isFinite(playback.defaultSpeed) || playback.defaultSpeed <= 0
    || !range.every(Number.isFinite) || range[1] <= range[0]) return null;
  const phases = readPlaybackPhases(playback.phases, dataset.meta.timeRange);
  if (!phases) return null;
  const [a, b] = range;
  const segments: ClockSegment[] = [];
  let position = 0;
  const append = (from: number, to: number, yearsPerSecond: number) => {
    from = Math.max(a, from); to = Math.min(b, to);
    if (to <= from) return;
    const endSeconds = position + (to - from) / yearsPerSecond;
    segments.push({ from, to, yearsPerSecond, startSeconds: position, endSeconds });
    position = endSeconds;
  };
  const first = phases[0], last = phases[phases.length - 1];
  if (a < first.from) append(a, first.from, first.yearsPerSecond);
  for (const phase of phases) append(phase.from, phase.to, phase.yearsPerSecond);
  if (b > last.to) append(last.to, b, last.yearsPerSecond);
  return Number.isFinite(position) && position > 0 ? { segments, duration: position, defaultSpeed: playback.defaultSpeed } : null;
}

function clockPosition(year: number, clock: PhaseSchedule): number {
  for (const segment of clock.segments) {
    if (year <= segment.from) return segment.startSeconds;
    if (year <= segment.to) return segment.startSeconds + (year - segment.from) / segment.yearsPerSecond;
  }
  return clock.duration;
}

function historicalYear(position: number, clock: PhaseSchedule): number {
  for (const segment of clock.segments) {
    if (position <= segment.endSeconds) return segment.from + (position - segment.startSeconds) * segment.yearsPerSecond;
  }
  return clock.segments[clock.segments.length - 1]?.to ?? 0;
}

/** Default rate uses the declared exact schedule; explicit rate changes scale it proportionally. */
export function phasePlaybackDuration(dataset: Dataset, range: [number, number], baselineRate = dataset.meta.playback?.defaultSpeed ?? 1): number {
  if (!Number.isFinite(baselineRate) || !baselineRate) return 0;
  const clock = schedule(dataset, range);
  const duration = clock ? clock.duration / (Math.abs(baselineRate) / clock.defaultSpeed) : 0;
  return Number.isFinite(duration) ? duration : 0;
}

/** Advance through the schedule without adaptive, idle-gap or travel-time modifiers. */
export function advancePhasePlayback(t: number, seconds: number, range: [number, number], rate: number, loop: boolean, dataset: Dataset): { t: number; playing: boolean } {
  const [a, b] = range;
  if (![t, seconds, a, b, rate].every(Number.isFinite) || b <= a || seconds < 0) return { t: Number.isFinite(a) ? a : 0, playing: false };
  t = Math.max(a, Math.min(b, t));
  const clock = schedule(dataset, range);
  if (!clock || !clock.duration) return { t, playing: false };
  if (!seconds || !rate) return { t, playing: true };
  const next = clockPosition(t, clock) + seconds * (rate / clock.defaultSpeed);
  if (!Number.isFinite(next)) return { t: rate < 0 ? a : b, playing: false };
  if (rate > 0 && next >= clock.duration) {
    if (!loop) return { t: b, playing: false };
    return { t: historicalYear(next % clock.duration, clock), playing: true };
  }
  if (rate < 0 && next <= 0) {
    if (!loop) return { t: a, playing: false };
    const wrapped = ((next % clock.duration) + clock.duration) % clock.duration;
    return { t: historicalYear(wrapped || clock.duration, clock), playing: true };
  }
  return { t: historicalYear(next, clock), playing: true };
}
