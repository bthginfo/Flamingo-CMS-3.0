import { createHash, createHmac } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { getDb } from './db';

export const MAX_RENDERER_CONTACT_REQUEST_BYTES = 100_000;

export class RendererContactBodyTooLargeError extends Error {}
export class RendererContactBodyInvalidError extends Error {}

export type RendererContactRateRule = {
  scope: string;
  subject: string;
  limit: number;
  windowSeconds: number;
};

export type RendererContactRateDecision = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export async function readBoundedRendererContactJson(request: Request, maximumBytes = MAX_RENDERER_CONTACT_REQUEST_BYTES) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) {
    throw new RendererContactBodyTooLargeError();
  }
  if (!request.body) throw new RendererContactBodyInvalidError();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maximumBytes) {
        await reader.cancel('request body too large').catch(() => undefined);
        throw new RendererContactBodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) as unknown;
  } catch (error) {
    if (error instanceof RendererContactBodyTooLargeError) throw error;
    throw new RendererContactBodyInvalidError();
  }
}

function parseOrigin(value: string | undefined) {
  if (!value?.trim()) return null;
  const candidate = value.trim().startsWith('http') ? value.trim() : `https://${value.trim()}`;
  try {
    return new URL(candidate).origin;
  } catch {
    return null;
  }
}

export function isTrustedRendererContactOrigin(
  request: Request,
  configuredOrigins: readonly (string | undefined)[] = [process.env.RENDERER_ALLOWED_ORIGIN],
) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const suppliedOrigin = new URL(origin).origin;
    const allowed = new Set([new URL(request.url).origin]);
    for (const configured of configuredOrigins) {
      const parsed = parseOrigin(configured);
      if (parsed) allowed.add(parsed);
    }
    return allowed.has(suppliedOrigin);
  } catch {
    return false;
  }
}

export function getRendererContactClientAddress(headers: Pick<Headers, 'get'>) {
  const forwarded = headers.get('x-vercel-forwarded-for')
    || headers.get('x-forwarded-for')
    || headers.get('x-real-ip')
    || headers.get('cf-connecting-ip')
    || '';
  return forwarded.split(',')[0]?.trim().slice(0, 128) || 'unknown';
}

export function parseRendererContactIdempotencyKey(value: string | null) {
  return value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value.toLowerCase()
    : null;
}

function rateLimitSecret() {
  const secret = [
    process.env.RENDERER_RATE_LIMIT_SECRET,
    process.env.ADMIN_JWT_SECRET,
    process.env.CONFIG_ENCRYPTION_KEY,
  ]
    .map(value => value?.trim())
    .find(value => value && value.length >= 32);
  if (!secret) throw new Error('Renderer rate-limit secret is missing or too short.');
  return secret;
}

export function isMissingRendererRateLimitStore(error: unknown) {
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

let rendererRateLimitStoreBootstrap: Promise<void> | null = null;

async function ensureRendererRateLimitStore() {
  if (!rendererRateLimitStoreBootstrap) {
    rendererRateLimitStoreBootstrap = (async () => {
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
    await rendererRateLimitStoreBootstrap;
  } catch (error) {
    rendererRateLimitStoreBootstrap = null;
    throw error;
  }
}

function rateLimitKey(scope: string, subject: string) {
  if (!/^[a-z0-9:_-]{1,80}$/i.test(scope)) throw new Error('Invalid renderer rate-limit scope.');
  // All renderer deployments share the same DB. A non-secret fixed key keeps
  // the platform-wide cap truly global even when tenant JWT secrets differ.
  if (scope.endsWith('_global') && subject === 'all') return `${scope}:global`;
  const digest = createHmac('sha256', rateLimitSecret())
    .update(scope)
    .update('\0')
    .update(subject.slice(0, 500))
    .digest('hex');
  return `${scope}:${digest}`;
}

async function consumeRendererContactRateLimit(rule: RendererContactRateRule, now = new Date()): Promise<RendererContactRateDecision> {
  const key = rateLimitKey(rule.scope, rule.subject);
  const expiresAt = new Date(now.getTime() + rule.windowSeconds * 1000);
  const db = getDb();
  const consume = () => db.execute(sql`
      INSERT INTO marketing_rate_limits (key, hits, window_started_at, expires_at, updated_at)
      VALUES (${key}, 1, ${now}, ${expiresAt}, ${now})
      ON CONFLICT (key) DO UPDATE SET
        hits = CASE WHEN marketing_rate_limits.expires_at <= ${now} THEN 1 ELSE marketing_rate_limits.hits + 1 END,
        window_started_at = CASE WHEN marketing_rate_limits.expires_at <= ${now} THEN ${now} ELSE marketing_rate_limits.window_started_at END,
        expires_at = CASE WHEN marketing_rate_limits.expires_at <= ${now} THEN ${expiresAt} ELSE marketing_rate_limits.expires_at END,
        updated_at = ${now}
      RETURNING hits, expires_at
    `);
  let result;
  try {
    result = await consume();
  } catch (error) {
    if (!isMissingRendererRateLimitStore(error)) throw error;
    await ensureRendererRateLimitStore();
    result = await consume();
  }
  const row = result.rows?.[0] as { hits?: number | string; expires_at?: Date | string } | undefined;
  if (!row) throw new Error('Renderer rate-limit store returned no row.');
  const hits = Number(row.hits);
  const storedExpiry = row.expires_at instanceof Date ? row.expires_at : new Date(String(row.expires_at));
  if (!Number.isFinite(hits) || Number.isNaN(storedExpiry.getTime())) throw new Error('Invalid rate-limit result.');

  if (hits === 1) {
    await db.execute(sql`
      DELETE FROM marketing_rate_limits
      WHERE key IN (
        SELECT key FROM marketing_rate_limits
        WHERE expires_at < ${now}
        ORDER BY expires_at ASC
        LIMIT 100
      )
    `).catch(error => console.error('[renderer-contact] rate-limit cleanup failed', error));
  }

  return {
    allowed: hits <= rule.limit,
    retryAfterSeconds: Math.max(1, Math.ceil((storedExpiry.getTime() - now.getTime()) / 1000)),
  };
}

export async function consumeRendererContactRateRules(rules: readonly RendererContactRateRule[]) {
  for (const rule of rules) {
    const decision = await consumeRendererContactRateLimit(rule);
    if (!decision.allowed) return decision;
  }
  return null;
}

export async function clearRendererRateLimit(scope: string, subject: string) {
  const key = rateLimitKey(scope, subject);
  await getDb().execute(sql`DELETE FROM marketing_rate_limits WHERE key = ${key}`);
}

export function rendererAdminLoginRateRules(clientAddress: string): RendererContactRateRule[] {
  return [
    { scope: 'renderer_admin_login_ip', subject: clientAddress, limit: 8, windowSeconds: 15 * 60 },
    { scope: 'renderer_admin_login_global', subject: 'all', limit: 100, windowSeconds: 15 * 60 },
  ];
}

export function rendererDemoLoginRateRules(clientAddress: string): RendererContactRateRule[] {
  return [
    { scope: 'renderer_demo_login_ip', subject: clientAddress, limit: 10, windowSeconds: 60 * 60 },
    { scope: 'renderer_demo_login_global', subject: 'all', limit: 500, windowSeconds: 60 * 60 },
  ];
}

export function rendererContactRateRules(tenantId: string, clientAddress: string, email: string): RendererContactRateRule[] {
  return [
    { scope: 'renderer_contact_email', subject: `${tenantId}:${email.toLowerCase()}`, limit: 2, windowSeconds: 60 * 60 },
    { scope: 'renderer_contact_ip', subject: `${tenantId}:${clientAddress}`, limit: 5, windowSeconds: 10 * 60 },
    { scope: 'renderer_contact_tenant', subject: tenantId, limit: 30, windowSeconds: 10 * 60 },
    { scope: 'renderer_contact_global', subject: 'all', limit: 500, windowSeconds: 10 * 60 },
  ];
}

export function rendererAutoResponseRateRules(tenantId: string, clientAddress: string, email: string): RendererContactRateRule[] {
  return [
    { scope: 'renderer_autoresponse_email', subject: `${tenantId}:${email.toLowerCase()}`, limit: 1, windowSeconds: 24 * 60 * 60 },
    { scope: 'renderer_autoresponse_ip', subject: `${tenantId}:${clientAddress}`, limit: 3, windowSeconds: 24 * 60 * 60 },
    { scope: 'renderer_autoresponse_tenant', subject: tenantId, limit: 20, windowSeconds: 60 * 60 },
    { scope: 'renderer_autoresponse_global', subject: 'all', limit: 100, windowSeconds: 60 * 60 },
  ];
}

export function rendererCouponRateRules(tenantId: string, clientAddress: string): RendererContactRateRule[] {
  return [
    { scope: 'renderer_coupon_ip', subject: `${tenantId}:${clientAddress}`, limit: 20, windowSeconds: 10 * 60 },
    { scope: 'renderer_coupon_tenant', subject: tenantId, limit: 200, windowSeconds: 10 * 60 },
    { scope: 'renderer_coupon_global', subject: 'all', limit: 2_000, windowSeconds: 10 * 60 },
  ];
}

export function rendererBookingCancellationRateRules(clientAddress: string): RendererContactRateRule[] {
  return [
    { scope: 'renderer_booking_cancel_ip', subject: clientAddress, limit: 30, windowSeconds: 10 * 60 },
    { scope: 'renderer_booking_cancel_global', subject: 'all', limit: 1_000, windowSeconds: 10 * 60 },
  ];
}

export function rendererRsvpRateRules(
  tenantId: string,
  clientAddress: string,
  email: string,
): RendererContactRateRule[] {
  const normalizedEmail = email.trim().toLowerCase() || `no-email:${clientAddress}`;
  return [
    { scope: 'renderer_rsvp_ip', subject: `${tenantId}:${clientAddress}`, limit: 5, windowSeconds: 10 * 60 },
    { scope: 'renderer_rsvp_email', subject: `${tenantId}:${normalizedEmail}`, limit: 3, windowSeconds: 60 * 60 },
    { scope: 'renderer_rsvp_tenant', subject: tenantId, limit: 50, windowSeconds: 10 * 60 },
    { scope: 'renderer_rsvp_global', subject: 'all', limit: 500, windowSeconds: 10 * 60 },
  ];
}

export function fingerprintRendererContactSubmission(value: unknown) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

export function classifyRendererContactIdempotency(existingHash: string | null, requestedHash: string) {
  if (!existingHash) return 'conflict' as const;
  return existingHash === requestedHash ? 'duplicate' as const : 'conflict' as const;
}
