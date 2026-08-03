import { createHash } from 'node:crypto';
import { and, eq, lte } from 'drizzle-orm';
import { customFormDeliveries } from '@flamingo/db';
import { getDb } from '@/lib/db';

export const CUSTOM_FORM_DELIVERY_STALE_AFTER_MS = 15 * 60 * 1000;

export type CustomFormDeliveryKind = 'practice' | 'confirmation';

export type CustomFormDeliveryClaim =
  | { state: 'acquired' }
  | { state: 'duplicate' }
  | { state: 'conflict' }
  | { state: 'processing' }
  | { state: 'uncertain' }
  | { state: 'partial' };

type DeliveryRecord = {
  formKey: string;
  requestHash: string;
  status: string;
  practiceStatus: string;
  confirmationStatus: string;
  updatedAt: Date;
};

function stableJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map(key => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(',')}}`;
}

/**
 * Only this one-way digest is persisted. The canonical request and all health
 * answers remain in memory for the duration of the request and are never
 * written to the idempotency store.
 */
export function fingerprintCustomFormRequest(value: unknown) {
  return createHash('sha256').update(stableJson(value)).digest('hex');
}

export function classifyCustomFormDelivery(
  existing: DeliveryRecord,
  requested: { formKey: string; requestHash: string },
  now = Date.now(),
): Exclude<CustomFormDeliveryClaim, { state: 'acquired' }> | { state: 'retryable' } | { state: 'stale-safe' } {
  if (existing.formKey !== requested.formKey || existing.requestHash !== requested.requestHash) return { state: 'conflict' };
  if (existing.practiceStatus === 'sent' && existing.confirmationStatus === 'sent') return { state: 'duplicate' };
  if (existing.status === 'completed') return { state: 'duplicate' };
  if (existing.status === 'partial' || (existing.practiceStatus === 'sent' && existing.confirmationStatus === 'uncertain')) return { state: 'partial' };
  if (existing.status === 'uncertain' || existing.practiceStatus === 'uncertain' || existing.confirmationStatus === 'uncertain') return { state: 'uncertain' };
  if (existing.status === 'retryable' && existing.practiceStatus === 'pending' && existing.confirmationStatus === 'pending') return { state: 'retryable' };

  const stale = existing.updatedAt.getTime() <= now - CUSTOM_FORM_DELIVERY_STALE_AFTER_MS;
  if (existing.status === 'processing' && stale) {
    if (existing.practiceStatus === 'pending' && existing.confirmationStatus === 'pending') return { state: 'stale-safe' };
    if (existing.practiceStatus === 'sent') return { state: 'partial' };
    return { state: 'uncertain' };
  }
  return { state: 'processing' };
}

async function readCustomFormDelivery(input: { tenantId: string; idempotencyKey: string }) {
  const [existing] = await getDb().select({
    formKey: customFormDeliveries.formKey,
    requestHash: customFormDeliveries.requestHash,
    status: customFormDeliveries.status,
    practiceStatus: customFormDeliveries.practiceStatus,
    confirmationStatus: customFormDeliveries.confirmationStatus,
    updatedAt: customFormDeliveries.updatedAt,
  }).from(customFormDeliveries).where(and(
    eq(customFormDeliveries.tenantId, input.tenantId),
    eq(customFormDeliveries.idempotencyKey, input.idempotencyKey),
  )).limit(1);
  return existing || null;
}

export async function claimCustomFormDelivery(input: {
  tenantId: string;
  formKey: string;
  idempotencyKey: string;
  requestHash: string;
}): Promise<CustomFormDeliveryClaim> {
  const db = getDb();
  const [inserted] = await db.insert(customFormDeliveries).values({
    tenantId: input.tenantId,
    formKey: input.formKey,
    idempotencyKey: input.idempotencyKey,
    requestHash: input.requestHash,
    status: 'processing',
    practiceStatus: 'pending',
    confirmationStatus: 'pending',
  }).onConflictDoNothing({
    target: [customFormDeliveries.tenantId, customFormDeliveries.idempotencyKey],
  }).returning({ id: customFormDeliveries.id });
  if (inserted) return { state: 'acquired' };

  const existing = await readCustomFormDelivery(input);
  if (!existing) return { state: 'processing' };
  const classification = classifyCustomFormDelivery(existing, input);
  if (classification.state !== 'retryable' && classification.state !== 'stale-safe') return classification;

  const staleBefore = new Date(Date.now() - CUSTOM_FORM_DELIVERY_STALE_AFTER_MS);
  const statusGuard = classification.state === 'retryable'
    ? eq(customFormDeliveries.status, 'retryable')
    : and(eq(customFormDeliveries.status, 'processing'), lte(customFormDeliveries.updatedAt, staleBefore));
  const [reclaimed] = await db.update(customFormDeliveries).set({
    status: 'processing',
    lastErrorCode: null,
    updatedAt: new Date(),
  }).where(and(
    eq(customFormDeliveries.tenantId, input.tenantId),
    eq(customFormDeliveries.idempotencyKey, input.idempotencyKey),
    eq(customFormDeliveries.formKey, input.formKey),
    eq(customFormDeliveries.requestHash, input.requestHash),
    eq(customFormDeliveries.practiceStatus, 'pending'),
    eq(customFormDeliveries.confirmationStatus, 'pending'),
    statusGuard,
  )).returning({ id: customFormDeliveries.id });
  if (reclaimed) return { state: 'acquired' };

  const raced = await readCustomFormDelivery(input);
  if (!raced) return { state: 'processing' };
  const racedClassification = classifyCustomFormDelivery(raced, input);
  return racedClassification.state === 'retryable' || racedClassification.state === 'stale-safe'
    ? { state: 'processing' }
    : racedClassification;
}

export async function runCustomFormClaimedAction<T>(input: {
  claim: () => Promise<CustomFormDeliveryClaim>;
  execute: () => Promise<T>;
}): Promise<
  | { state: 'executed'; value: T }
  | Exclude<CustomFormDeliveryClaim, { state: 'acquired' }>
> {
  const claim = await input.claim();
  if (claim.state !== 'acquired') return claim;
  return { state: 'executed', value: await input.execute() };
}

function deliveryIdentity(input: { tenantId: string; formKey: string; idempotencyKey: string; requestHash: string }) {
  return and(
    eq(customFormDeliveries.tenantId, input.tenantId),
    eq(customFormDeliveries.formKey, input.formKey),
    eq(customFormDeliveries.idempotencyKey, input.idempotencyKey),
    eq(customFormDeliveries.requestHash, input.requestHash),
  );
}

async function requireDeliveryUpdate(result: Array<{ id: string }>) {
  if (!result[0]) throw new Error('CUSTOM_FORM_DELIVERY_CLAIM_LOST');
}

export async function markCustomFormDeliverySending(input: {
  tenantId: string;
  formKey: string;
  idempotencyKey: string;
  requestHash: string;
  kind: CustomFormDeliveryKind;
}) {
  const channel = input.kind === 'practice' ? customFormDeliveries.practiceStatus : customFormDeliveries.confirmationStatus;
  const prerequisite = input.kind === 'confirmation' ? eq(customFormDeliveries.practiceStatus, 'sent') : undefined;
  const updated = await getDb().update(customFormDeliveries).set({
    [input.kind === 'practice' ? 'practiceStatus' : 'confirmationStatus']: 'sending',
    updatedAt: new Date(),
  }).where(and(
    deliveryIdentity(input),
    eq(customFormDeliveries.status, 'processing'),
    eq(channel, 'pending'),
    prerequisite,
  )).returning({ id: customFormDeliveries.id });
  await requireDeliveryUpdate(updated);
}

export async function markCustomFormDeliverySent(input: {
  tenantId: string;
  formKey: string;
  idempotencyKey: string;
  requestHash: string;
  kind: CustomFormDeliveryKind;
}) {
  const channel = input.kind === 'practice' ? customFormDeliveries.practiceStatus : customFormDeliveries.confirmationStatus;
  const updated = await getDb().update(customFormDeliveries).set({
    [input.kind === 'practice' ? 'practiceStatus' : 'confirmationStatus']: 'sent',
    updatedAt: new Date(),
  }).where(and(
    deliveryIdentity(input),
    eq(customFormDeliveries.status, 'processing'),
    eq(channel, 'sending'),
  )).returning({ id: customFormDeliveries.id });
  await requireDeliveryUpdate(updated);
}

export async function markCustomFormDeliveryUncertain(input: {
  tenantId: string;
  formKey: string;
  idempotencyKey: string;
  requestHash: string;
  kind: CustomFormDeliveryKind;
}) {
  const channel = input.kind === 'practice' ? customFormDeliveries.practiceStatus : customFormDeliveries.confirmationStatus;
  await getDb().update(customFormDeliveries).set({
    status: input.kind === 'confirmation' ? 'partial' : 'uncertain',
    [input.kind === 'practice' ? 'practiceStatus' : 'confirmationStatus']: 'uncertain',
    lastErrorCode: input.kind === 'practice' ? 'PRACTICE_DELIVERY_UNCERTAIN' : 'CONFIRMATION_DELIVERY_UNCERTAIN',
    updatedAt: new Date(),
  }).where(and(
    deliveryIdentity(input),
    eq(customFormDeliveries.status, 'processing'),
    eq(channel, 'sending'),
  ));
}

export async function completeCustomFormDelivery(input: {
  tenantId: string;
  formKey: string;
  idempotencyKey: string;
  requestHash: string;
}) {
  const updated = await getDb().update(customFormDeliveries).set({
    status: 'completed',
    lastErrorCode: null,
    updatedAt: new Date(),
  }).where(and(
    deliveryIdentity(input),
    eq(customFormDeliveries.status, 'processing'),
    eq(customFormDeliveries.practiceStatus, 'sent'),
    eq(customFormDeliveries.confirmationStatus, 'sent'),
  )).returning({ id: customFormDeliveries.id });
  await requireDeliveryUpdate(updated);
}

export async function markCustomFormDeliveryRetryable(input: {
  tenantId: string;
  formKey: string;
  idempotencyKey: string;
  requestHash: string;
  errorCode: 'RATE_LIMITED' | 'RATE_LIMIT_UNAVAILABLE' | 'SMTP_NOT_CONFIGURED' | 'PREPARATION_FAILED';
}) {
  await getDb().update(customFormDeliveries).set({
    status: 'retryable',
    lastErrorCode: input.errorCode,
    updatedAt: new Date(),
  }).where(and(
    deliveryIdentity(input),
    eq(customFormDeliveries.status, 'processing'),
    eq(customFormDeliveries.practiceStatus, 'pending'),
    eq(customFormDeliveries.confirmationStatus, 'pending'),
  ));
}
