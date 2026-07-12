import { crmEmailDeliveries } from '@flamingo/db';
import { and, eq, lte, sql } from 'drizzle-orm';
import { getDb } from './db';
import type {
  CrmEmailDeliveryErrorCode,
  CrmEmailFailedErrorCode,
  CrmEmailPurpose,
  CrmEmailUncertainErrorCode,
} from './crm-email';

export type CrmEmailDeliveryClaim =
  | 'acquired'
  | 'already_sent'
  | 'in_progress'
  | 'delivery_uncertain'
  | 'previously_failed'
  | 'conflict';

export const CRM_EMAIL_DELIVERY_STALE_AFTER_MS = 15 * 60 * 1000;
export const CRM_EMAIL_DELIVERY_RETENTION_MS = 90 * 24 * 60 * 60 * 1000;
export const CRM_EMAIL_DELIVERY_CLEANUP_BATCH_SIZE = 100;

const CRM_EMAIL_DELIVERY_ERROR_CODES = new Set<CrmEmailDeliveryErrorCode>([
  'crm_smtp_rejected',
  'crm_smtp_uncertain',
  'stale_sending_claim',
]);

export function normalizeCrmEmailDeliveryErrorCode(
  errorCode: unknown,
): CrmEmailDeliveryErrorCode | 'unknown' {
  if (typeof errorCode !== 'string') return 'unknown';
  const normalized = errorCode.trim().toLowerCase();
  return CRM_EMAIL_DELIVERY_ERROR_CODES.has(normalized as CrmEmailDeliveryErrorCode)
    ? normalized as CrmEmailDeliveryErrorCode
    : 'unknown';
}

type ExistingDelivery = {
  purpose: string;
  entityId: string;
  requestHash: string;
  status: string;
  updatedAt: Date;
};

type DeliveryIdentity = {
  purpose: CrmEmailPurpose;
  entityId: string;
  requestHash: string;
};

export function classifyCrmEmailDelivery(
  existing: ExistingDelivery,
  requested: DeliveryIdentity,
  now = new Date(),
): Exclude<CrmEmailDeliveryClaim, 'acquired'> | 'stale_sending' {
  if (
    existing.purpose !== requested.purpose
    || existing.entityId !== requested.entityId
    || existing.requestHash !== requested.requestHash
  ) {
    return 'conflict';
  }
  if (existing.status === 'sent') return 'already_sent';
  if (existing.status === 'failed') return 'previously_failed';
  if (existing.status === 'uncertain') return 'delivery_uncertain';
  if (
    existing.status === 'sending'
    && existing.updatedAt.getTime() <= now.getTime() - CRM_EMAIL_DELIVERY_STALE_AFTER_MS
  ) {
    return 'stale_sending';
  }
  return 'in_progress';
}

export function isCrmEmailDeliveryRetentionEligible(
  status: string,
  updatedAt: Date,
  now = new Date(),
) {
  return (status === 'sent' || status === 'failed')
    && updatedAt.getTime() <= now.getTime() - CRM_EMAIL_DELIVERY_RETENTION_MS;
}

async function cleanupExpiredCrmEmailDeliveries(now = new Date()) {
  const cutoff = new Date(now.getTime() - CRM_EMAIL_DELIVERY_RETENTION_MS);
  await getDb().execute(sql`
    DELETE FROM crm_email_deliveries
    WHERE idempotency_key IN (
      SELECT idempotency_key
      FROM crm_email_deliveries
      WHERE status IN ('sent', 'failed')
        AND updated_at <= ${cutoff}
      ORDER BY updated_at ASC
      LIMIT ${CRM_EMAIL_DELIVERY_CLEANUP_BATCH_SIZE}
    )
  `);
}

type DeliveryInspection = Exclude<CrmEmailDeliveryClaim, 'acquired'> | 'available';

export async function inspectCrmEmailDelivery(input: {
  idempotencyKey: string;
  purpose: CrmEmailPurpose;
  entityId: string;
  requestHash: string;
}): Promise<DeliveryInspection> {
  const db = getDb();
  const [existing] = await db
    .select({
      purpose: crmEmailDeliveries.purpose,
      entityId: crmEmailDeliveries.entityId,
      requestHash: crmEmailDeliveries.requestHash,
      status: crmEmailDeliveries.status,
      updatedAt: crmEmailDeliveries.updatedAt,
    })
    .from(crmEmailDeliveries)
    .where(eq(crmEmailDeliveries.idempotencyKey, input.idempotencyKey))
    .limit(1);

  if (!existing) return 'available';
  const classification = classifyCrmEmailDelivery(existing, input);
  if (classification !== 'stale_sending') return classification;

  const staleBefore = new Date(Date.now() - CRM_EMAIL_DELIVERY_STALE_AFTER_MS);
  const [markedUncertain] = await db
    .update(crmEmailDeliveries)
    .set({
      status: 'uncertain',
      lastErrorCode: normalizeCrmEmailDeliveryErrorCode('stale_sending_claim'),
      updatedAt: new Date(),
    })
    .where(and(
      eq(crmEmailDeliveries.idempotencyKey, input.idempotencyKey),
      eq(crmEmailDeliveries.status, 'sending'),
      lte(crmEmailDeliveries.updatedAt, staleBefore),
    ))
    .returning({ idempotencyKey: crmEmailDeliveries.idempotencyKey });
  if (markedUncertain) return 'delivery_uncertain';

  const [fresh] = await db
    .select({
      purpose: crmEmailDeliveries.purpose,
      entityId: crmEmailDeliveries.entityId,
      requestHash: crmEmailDeliveries.requestHash,
      status: crmEmailDeliveries.status,
      updatedAt: crmEmailDeliveries.updatedAt,
    })
    .from(crmEmailDeliveries)
    .where(eq(crmEmailDeliveries.idempotencyKey, input.idempotencyKey))
    .limit(1);
  if (!fresh) throw new Error('Idempotency record disappeared during stale-claim recovery.');
  const freshClassification = classifyCrmEmailDelivery(fresh, input);
  return freshClassification === 'stale_sending' ? 'in_progress' : freshClassification;
}

export async function claimCrmEmailDelivery(input: {
  idempotencyKey: string;
  purpose: CrmEmailPurpose;
  entityId: string;
  requestHash: string;
}): Promise<CrmEmailDeliveryClaim> {
  const db = getDb();
  const [inserted] = await db
    .insert(crmEmailDeliveries)
    .values({
      idempotencyKey: input.idempotencyKey,
      purpose: input.purpose,
      entityId: input.entityId,
      requestHash: input.requestHash,
      status: 'sending',
    })
    .onConflictDoNothing({ target: crmEmailDeliveries.idempotencyKey })
    .returning({ idempotencyKey: crmEmailDeliveries.idempotencyKey });

  if (inserted) {
    await cleanupExpiredCrmEmailDeliveries().catch((error) => {
      console.error('[crm-email] bounded delivery retention cleanup failed', error);
    });
    return 'acquired';
  }

  const inspection = await inspectCrmEmailDelivery(input);
  if (inspection === 'available') throw new Error('Idempotency record disappeared after a conflict.');
  return inspection;
}

export async function markCrmEmailDeliverySent(idempotencyKey: string) {
  const now = new Date();
  await getDb()
    .update(crmEmailDeliveries)
    .set({ status: 'sent', sentAt: now, updatedAt: now, lastErrorCode: null })
    .where(and(
      eq(crmEmailDeliveries.idempotencyKey, idempotencyKey),
      eq(crmEmailDeliveries.status, 'sending'),
    ));
}

export async function markCrmEmailDeliveryFailed(
  idempotencyKey: string,
  errorCode: CrmEmailFailedErrorCode,
) {
  await getDb()
    .update(crmEmailDeliveries)
    .set({
      status: 'failed',
      lastErrorCode: normalizeCrmEmailDeliveryErrorCode(errorCode),
      updatedAt: new Date(),
    })
    .where(and(
      eq(crmEmailDeliveries.idempotencyKey, idempotencyKey),
      eq(crmEmailDeliveries.status, 'sending'),
    ));
}

export async function markCrmEmailDeliveryUncertain(
  idempotencyKey: string,
  errorCode: CrmEmailUncertainErrorCode,
) {
  await getDb()
    .update(crmEmailDeliveries)
    .set({
      status: 'uncertain',
      lastErrorCode: normalizeCrmEmailDeliveryErrorCode(errorCode),
      updatedAt: new Date(),
    })
    .where(and(
      eq(crmEmailDeliveries.idempotencyKey, idempotencyKey),
      eq(crmEmailDeliveries.status, 'sending'),
    ));
}
