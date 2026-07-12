export const ADMIN_SUPPORT_STALE_AFTER_MS = 15 * 60 * 1000;

export type AdminSupportDeliveryIdentity = {
  purpose: 'admin_support';
  entityId: string;
  requestHash: string;
};

export type AdminSupportDeliveryRecord = {
  purpose: string;
  entityId: string;
  requestHash: string;
  status: string;
  updatedAt: Date;
};

export type AdminSupportDeliveryState =
  | 'sent'
  | 'failed'
  | 'uncertain'
  | 'in_progress'
  | 'stale'
  | 'conflict';

export function classifyAdminSupportDelivery(
  existing: AdminSupportDeliveryRecord,
  expected: AdminSupportDeliveryIdentity,
  now = Date.now(),
): AdminSupportDeliveryState {
  if (
    existing.purpose !== expected.purpose
    || existing.entityId !== expected.entityId
    || existing.requestHash !== expected.requestHash
  ) return 'conflict';

  // `completed` is accepted as a legacy synonym even though the current DB
  // constraint stores the durable-acceptance state as `sent`.
  if (existing.status === 'sent' || existing.status === 'completed') return 'sent';
  if (existing.status === 'failed') return 'failed';
  if (existing.status === 'uncertain') return 'uncertain';
  if (existing.status === 'sending') {
    return existing.updatedAt.getTime() <= now - ADMIN_SUPPORT_STALE_AFTER_MS
      ? 'stale'
      : 'in_progress';
  }

  // Unknown states must never reopen the SMTP/persistence path automatically.
  return 'uncertain';
}

/**
 * Existing idempotency records are inspected before any rate-limit bucket is
 * consumed. Only a genuinely new action reaches `consumeRateLimits`.
 */
export async function runAdminSupportPreflight<TDecision>(input: {
  inspectExisting: () => Promise<AdminSupportDeliveryRecord | null>;
  consumeRateLimits: () => Promise<TDecision>;
}) {
  const existing = await input.inspectExisting();
  if (existing) return { existing, rateDecision: null } as const;
  return {
    existing: null,
    rateDecision: await input.consumeRateLimits(),
  } as const;
}
