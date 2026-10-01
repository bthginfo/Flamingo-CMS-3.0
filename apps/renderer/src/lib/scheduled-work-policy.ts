/** A cached index contains timestamps, not time-relative "due" booleans. */
export function shouldRunScheduledWork(nextRunAt: number | null, now: Date): boolean {
  return nextRunAt !== null && (!Number.isFinite(nextRunAt) || nextRunAt <= now.getTime());
}
