import { createHash } from 'node:crypto';
import { and, eq, lte, sql } from 'drizzle-orm';
import { publicFlowRequests } from '@flamingo/db';
import { getDb } from '@/lib/db';
import {
  consumeRendererContactRateRules,
  getRendererContactClientAddress,
  parseRendererContactIdempotencyKey,
  type RendererContactRateRule,
} from '@/lib/renderer-contact-security';

export type PublicFlow = 'booking' | 'checkout';
export const PUBLIC_FLOW_STALE_AFTER_MS = 15 * 60 * 1000;
export const PUBLIC_FLOW_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

type StoredResponse = Record<string, unknown>;

type PublicFlowClaim =
  | { state: 'acquired' }
  | { state: 'completed'; response: StoredResponse }
  | { state: 'conflict' }
  | { state: 'processing' }
  | { state: 'uncertain' }
  | { state: 'failed' };

export function resolvePublicFlowIdempotencyKey(request: Request, bodyValue: unknown) {
  const headerValue = request.headers.get('idempotency-key');
  const headerKey = headerValue === null ? null : parseRendererContactIdempotencyKey(headerValue);
  const bodyKey = typeof bodyValue === 'string' ? parseRendererContactIdempotencyKey(bodyValue) : null;

  // A malformed supplied value or two different keys is always rejected. This
  // prevents a proxy/client disagreement from silently creating two actions.
  if ((headerValue !== null && !headerKey) || (bodyValue != null && !bodyKey)) return null;
  if (headerKey && bodyKey && headerKey !== bodyKey) return null;
  return headerKey || bodyKey;
}

export function publicFlowClientAddress(request: Request) {
  return getRendererContactClientAddress(request.headers);
}

export function publicFlowRateRules(
  flow: PublicFlow,
  tenantId: string,
  clientAddress: string,
  email: string,
): RendererContactRateRule[] {
  const normalizedEmail = email.trim().toLowerCase() || `no-email:${clientAddress}`;
  const policy = flow === 'booking'
    ? { ip: 5, email: 3, tenant: 50, global: 600 }
    : { ip: 8, email: 5, tenant: 80, global: 800 };

  // Narrow subjects are consumed first. An abusive address is rejected before
  // it can spend the tenant-wide or platform-wide allowance.
  return [
    { scope: `renderer_${flow}_ip`, subject: `${tenantId}:${clientAddress}`, limit: policy.ip, windowSeconds: 10 * 60 },
    { scope: `renderer_${flow}_email`, subject: `${tenantId}:${normalizedEmail}`, limit: policy.email, windowSeconds: 60 * 60 },
    { scope: `renderer_${flow}_tenant`, subject: tenantId, limit: policy.tenant, windowSeconds: 10 * 60 },
    { scope: `renderer_${flow}_global`, subject: 'all', limit: policy.global, windowSeconds: 10 * 60 },
  ];
}

export function consumePublicFlowRateLimit(
  flow: PublicFlow,
  tenantId: string,
  clientAddress: string,
  email: string,
) {
  return consumeRendererContactRateRules(publicFlowRateRules(flow, tenantId, clientAddress, email));
}

export function fingerprintPublicFlowRequest(flow: PublicFlow, tenantId: string, value: unknown) {
  return createHash('sha256')
    .update(stableJson({ flow, tenantId, value }))
    .digest('hex');
}

export async function inspectPublicFlowRequest(input: {
  flow: PublicFlow;
  tenantId: string;
  idempotencyKey: string;
  requestHash: string;
}): Promise<Exclude<PublicFlowClaim, { state: 'acquired' }> | null> {
  const db = getDb();
  const [existing] = await db.select({
    requestHash: publicFlowRequests.requestHash,
    status: publicFlowRequests.status,
    response: publicFlowRequests.response,
    updatedAt: publicFlowRequests.updatedAt,
  }).from(publicFlowRequests).where(and(
    eq(publicFlowRequests.tenantId, input.tenantId),
    eq(publicFlowRequests.flow, input.flow),
    eq(publicFlowRequests.idempotencyKey, input.idempotencyKey),
  )).limit(1);
  if (!existing) return null;
  const classification = classifyPublicFlowRequest(existing, input.requestHash);
  if (classification.state !== 'uncertain' || existing.status !== 'processing') return classification;

  const staleBefore = new Date(Date.now() - PUBLIC_FLOW_STALE_AFTER_MS);
  await db.update(publicFlowRequests).set({
    status: 'uncertain',
    updatedAt: new Date(),
  }).where(and(
    eq(publicFlowRequests.tenantId, input.tenantId),
    eq(publicFlowRequests.flow, input.flow),
    eq(publicFlowRequests.idempotencyKey, input.idempotencyKey),
    eq(publicFlowRequests.status, 'processing'),
    lte(publicFlowRequests.updatedAt, staleBefore),
  ));
  return { state: 'uncertain' };
}

export async function claimPublicFlowRequest(input: {
  flow: PublicFlow;
  tenantId: string;
  idempotencyKey: string;
  requestHash: string;
}): Promise<PublicFlowClaim> {
  const db = getDb();
  const [claimed] = await db.insert(publicFlowRequests).values({
    tenantId: input.tenantId,
    flow: input.flow,
    idempotencyKey: input.idempotencyKey,
    requestHash: input.requestHash,
    status: 'processing',
  }).onConflictDoNothing({
    target: [publicFlowRequests.tenantId, publicFlowRequests.flow, publicFlowRequests.idempotencyKey],
  }).returning({ id: publicFlowRequests.id });
  if (claimed) {
    const cutoff = new Date(Date.now() - PUBLIC_FLOW_RETENTION_MS);
    await db.execute(sql`
      DELETE FROM public_flow_requests
      WHERE id IN (
        SELECT id FROM public_flow_requests
        WHERE status IN ('completed', 'failed')
          AND created_at <= ${cutoff}
        ORDER BY created_at ASC
        LIMIT 100
      )
    `).catch(error => console.error('[public-flow] bounded retention cleanup failed', error));
    return { state: 'acquired' };
  }
  return (await inspectPublicFlowRequest(input)) || { state: 'processing' };
}

export async function completePublicFlowRequest(input: {
  flow: PublicFlow;
  tenantId: string;
  idempotencyKey: string;
  resourceId: string;
  response: StoredResponse;
}) {
  await getDb().update(publicFlowRequests).set({
    status: 'completed',
    resourceId: input.resourceId,
    response: input.response,
    updatedAt: new Date(),
  }).where(and(
    eq(publicFlowRequests.tenantId, input.tenantId),
    eq(publicFlowRequests.flow, input.flow),
    eq(publicFlowRequests.idempotencyKey, input.idempotencyKey),
    eq(publicFlowRequests.status, 'processing'),
  ));
}

export async function failPublicFlowRequest(input: {
  flow: PublicFlow;
  tenantId: string;
  idempotencyKey: string;
  uncertain?: boolean;
}) {
  await getDb().update(publicFlowRequests).set({
    status: input.uncertain ? 'uncertain' : 'failed',
    updatedAt: new Date(),
  }).where(and(
    eq(publicFlowRequests.tenantId, input.tenantId),
    eq(publicFlowRequests.flow, input.flow),
    eq(publicFlowRequests.idempotencyKey, input.idempotencyKey),
    eq(publicFlowRequests.status, 'processing'),
  ));
}

export function publicFlowClaimResponse(claim: PublicFlowClaim) {
  if (claim.state === 'completed') {
    return { status: 200, body: { ...claim.response, duplicate: true } };
  }
  if (claim.state === 'conflict') {
    return {
      status: 409,
      body: {
        error: 'Der Idempotency-Key wurde bereits für eine andere Anfrage verwendet.',
        retryWithNewIdempotencyKey: true,
      },
    };
  }
  if (claim.state === 'failed') {
    return {
      status: 409,
      body: {
        error: 'Der vorherige Versuch ist fehlgeschlagen. Bitte erneut versuchen.',
        retryWithNewIdempotencyKey: true,
      },
    };
  }
  if (claim.state === 'processing') {
    return {
      status: 409,
      body: {
        error: 'Diese Anfrage wird bereits verarbeitet. Bitte gleich erneut versuchen.',
        retryWithSameIdempotencyKey: true,
      },
    };
  }
  if (claim.state === 'uncertain') {
    return {
      status: 409,
      body: {
        error: 'Der vorherige Vorgang wurde möglicherweise ausgeführt. Bitte den aktuellen Stand prüfen, bevor Sie erneut starten.',
        code: 'PUBLIC_FLOW_UNCERTAIN',
        retryWithSameIdempotencyKey: true,
      },
    };
  }
  return null;
}

export function classifyPublicFlowRequest(
  existing: { requestHash: string; status: string; response: unknown; updatedAt?: Date },
  requestedHash: string,
  now = Date.now(),
): Exclude<PublicFlowClaim, { state: 'acquired' }> {
  if (existing.requestHash !== requestedHash) return { state: 'conflict' };
  if (existing.status === 'completed' && isRecord(existing.response)) {
    return { state: 'completed', response: existing.response };
  }
  if (existing.status === 'failed') return { state: 'failed' };
  if (existing.status === 'uncertain') return { state: 'uncertain' };
  if (existing.status === 'processing'
    && existing.updatedAt
    && existing.updatedAt.getTime() <= now - PUBLIC_FLOW_STALE_AFTER_MS) {
    return { state: 'uncertain' };
  }
  return { state: 'processing' };
}

function stableJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map(key => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(',')}}`;
}

function isRecord(value: unknown): value is StoredResponse {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
