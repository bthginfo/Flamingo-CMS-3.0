/**
 * In-memory token-bucket rate limiter.
 *
 * Designed for Vercel serverless: state is per-instance, so distributed bursts
 * across many cold starts may not be fully throttled. This is still effective
 * against single-IP loop abuse (the dominant attack pattern).
 *
 * For stronger guarantees across instances, replace this module with an
 * Upstash/Redis-backed implementation (the public API can stay the same).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

export type RateLimitResult = { ok: boolean; remaining: number; resetMs: number };

/** Extract a best-effort client IP from a Request. */
export function getClientIp(req: Request): string {
  const xff = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim();
  return xff || req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip') || 'unknown';
}

/**
 * Token-bucket check. Returns ok=false when limit is exceeded.
 *
 * @param key     Unique key (e.g. `${endpoint}:${ip}`)
 * @param limit   Max events per window
 * @param windowMs Window length in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });

    // Opportunistic cleanup so the Map cannot grow unbounded
    if (buckets.size > MAX_KEYS) {
      for (const [k, v] of buckets) {
        if (v.resetAt <= now) buckets.delete(k);
        if (buckets.size <= MAX_KEYS) break;
      }
    }

    return { ok: true, remaining: limit - 1, resetMs: windowMs };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, resetMs: bucket.resetAt - now };
  }

  bucket.count++;
  return { ok: true, remaining: limit - bucket.count, resetMs: bucket.resetAt - now };
}
