const USAGE_TOUCH_INTERVAL_MS = 60 * 60 * 1000;

export function parsePatBearer(header: string | null): string | null {
  const match = header?.match(/^Bearer\s+(flm_pat_[a-f0-9]{64})\s*$/i);
  return match?.[1] || null;
}

export function isPatExpired(expiresAt: Date | null, now = new Date()): boolean {
  return expiresAt !== null && expiresAt.getTime() <= now.getTime();
}

export function patUsageCutoff(now = new Date()): Date {
  return new Date(now.getTime() - USAGE_TOUCH_INTERVAL_MS);
}

export function shouldTouchPatUsage(lastUsedAt: Date | null, now = new Date()): boolean {
  return !lastUsedAt || lastUsedAt.getTime() <= patUsageCutoff(now).getTime();
}
