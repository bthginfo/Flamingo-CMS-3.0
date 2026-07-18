import { createHmac } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { getDb } from './db';

export type RateLimitDecision = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

function getRateLimitSecret() {
  const secret = [
    process.env.CRM_RATE_LIMIT_SECRET,
    process.env.CRM_JWT_SECRET,
    process.env.ADMIN_JWT_SECRET,
    process.env.CRM_CONFIG_ENCRYPTION_KEY,
    process.env.CONFIG_ENCRYPTION_KEY,
  ].map(value => value?.trim()).find(value => value && value.length >= 32);
  if (!secret) {
    throw new Error('A rate-limit secret with at least 32 characters is required.');
  }
  return secret;
}

export function isMissingMarketingRateLimitStore(error: unknown) {
  const visited = new Set<unknown>();
  let current = error;
  for (let depth = 0; depth < 6 && current && typeof current === 'object' && !visited.has(current); depth += 1) {
    visited.add(current);
    const record = current as { code?: unknown; cause?: unknown };
    if (record.code === '42P01') return true;
    current = record.cause;
  }
  return false;
}

let marketingRateLimitStoreBootstrap: Promise<void> | null = null;

async function ensureMarketingRateLimitStore() {
  if (!marketingRateLimitStoreBootstrap) {
    marketingRateLimitStoreBootstrap = (async () => {
      const db = getDb();
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS marketing_rate_limits (
          key varchar(160) PRIMARY KEY NOT NULL,
          hits integer DEFAULT 1 NOT NULL,
          window_started_at timestamp with time zone DEFAULT now() NOT NULL,
          expires_at timestamp with time zone NOT NULL,
          updated_at timestamp with time zone DEFAULT now() NOT NULL
        )
      `);
      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS marketing_rate_limits_expires_idx
        ON marketing_rate_limits USING btree (expires_at)
      `);
    })();
  }
  try {
    await marketingRateLimitStoreBootstrap;
  } catch (error) {
    marketingRateLimitStoreBootstrap = null;
    throw error;
  }
}

function buildRateLimitKey(scope: string, subject: string) {
  if (!/^[a-z0-9:_-]{1,80}$/i.test(scope)) throw new Error('Invalid rate-limit scope.');
  const digest = createHmac('sha256', getRateLimitSecret())
    .update(scope)
    .update('\0')
    .update(subject.slice(0, 500))
    .digest('hex');
  return `${scope}:${digest}`;
}

export async function consumeMarketingRateLimit(input: {
  scope: string;
  subject: string;
  limit: number;
  windowSeconds: number;
  now?: Date;
}): Promise<RateLimitDecision> {
  const { scope, subject, limit, windowSeconds } = input;
  if (!Number.isSafeInteger(limit) || limit < 1) throw new Error('Invalid rate-limit limit.');
  if (!Number.isSafeInteger(windowSeconds) || windowSeconds < 1) throw new Error('Invalid rate-limit window.');

  const key = buildRateLimitKey(scope, subject);
  const now = input.now || new Date();
  const expiresAt = new Date(now.getTime() + windowSeconds * 1000);
  const db = getDb();
  const consume = () => db.execute(sql`
      INSERT INTO marketing_rate_limits (key, hits, window_started_at, expires_at, updated_at)
      VALUES (${key}, 1, ${now}, ${expiresAt}, ${now})
      ON CONFLICT (key) DO UPDATE SET
        hits = CASE
          WHEN marketing_rate_limits.expires_at <= ${now} THEN 1
          ELSE marketing_rate_limits.hits + 1
        END,
        window_started_at = CASE
          WHEN marketing_rate_limits.expires_at <= ${now} THEN ${now}
          ELSE marketing_rate_limits.window_started_at
        END,
        expires_at = CASE
          WHEN marketing_rate_limits.expires_at <= ${now} THEN ${expiresAt}
          ELSE marketing_rate_limits.expires_at
        END,
        updated_at = ${now}
      RETURNING hits, expires_at
    `);
  let result;
  try {
    result = await consume();
  } catch (error) {
    if (!isMissingMarketingRateLimitStore(error)) throw error;
    await ensureMarketingRateLimitStore();
    result = await consume();
  }
  const row = result.rows?.[0] as { hits?: number | string; expires_at?: string | Date } | undefined;
  if (!row) throw new Error('Rate-limit store returned no result.');

  const hits = Number(row.hits);
  const storedExpiry = row.expires_at instanceof Date ? row.expires_at : new Date(String(row.expires_at));
  if (!Number.isFinite(hits) || Number.isNaN(storedExpiry.getTime())) {
    throw new Error('Rate-limit store returned an invalid result.');
  }

  // Each new subject opportunistically removes a bounded batch of expired
  // subjects. The indexed subquery keeps cleanup predictable under serverless
  // concurrency while preventing unbounded IP/e-mail key growth.
  if (hits === 1) {
    await db.execute(sql`
      DELETE FROM marketing_rate_limits
      WHERE key IN (
        SELECT key
        FROM marketing_rate_limits
        WHERE expires_at < ${now}
        ORDER BY expires_at ASC
        LIMIT 100
      )
    `).catch((error) => {
      console.error('[rate-limit] bounded cleanup failed', error);
    });
  }

  return {
    allowed: hits <= limit,
    limit,
    remaining: Math.max(0, limit - hits),
    retryAfterSeconds: Math.max(1, Math.ceil((storedExpiry.getTime() - now.getTime()) / 1000)),
  };
}

export async function clearMarketingRateLimit(scope: string, subject: string) {
  const key = buildRateLimitKey(scope, subject);
  await getDb().execute(sql`DELETE FROM marketing_rate_limits WHERE key = ${key}`);
}

export async function consumeFirstDeniedRateLimit(
  rules: ReadonlyArray<{ scope: string; subject: string; limit: number; windowSeconds: number }>,
) {
  for (const rule of rules) {
    const decision = await consumeMarketingRateLimit(rule);
    if (!decision.allowed) return decision;
  }
  return null;
}
