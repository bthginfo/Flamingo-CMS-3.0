import { createHash } from 'node:crypto';

import type { RendererContactRateRule } from './renderer-contact-security';

export const SHOP_ADDON_MESSAGE_MAX_LENGTH = 2_000;
export const SHOP_ADDON_CLAIM_STALE_AFTER_MS = 15 * 60 * 1_000;
export const SHOP_MAIL_CLAIM_STALE_AFTER_MS = 2 * 60 * 1_000;

export const ORDER_STATUSES = [
  'awaiting_payment',
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function normalizeShopAddonMessage(value: unknown) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') throw new Error('Ungültige Nachricht.');

  const normalized = value.replace(/\r\n?/g, '\n').trim();
  if (normalized.length > SHOP_ADDON_MESSAGE_MAX_LENGTH) {
    throw new Error(`Die Nachricht darf höchstens ${SHOP_ADDON_MESSAGE_MAX_LENGTH} Zeichen enthalten.`);
  }
  return normalized;
}

export function fingerprintShopAddonRequest(tenantId: string, message: string) {
  return createHash('sha256')
    .update('shop-addon-request-v1')
    .update('\0')
    .update(tenantId)
    .update('\0')
    .update(message)
    .digest('hex');
}

export function fingerprintShopAddonActor(sessionToken: string) {
  if (!sessionToken) throw new Error('Missing authenticated shop actor.');
  return createHash('sha256')
    .update('shop-addon-actor-v1')
    .update('\0')
    .update(sessionToken)
    .digest('hex');
}

/**
 * Builds a deterministic RFC 9562 UUIDv8 from the request fingerprint.
 * crm_email_deliveries uses a UUID primary key, while the stable value keeps
 * retries of the same tenant/message pair idempotent across deployments.
 */
export function createShopAddonIdempotencyKey(tenantId: string, message: string) {
  const bytes = Buffer.from(fingerprintShopAddonRequest(tenantId, message), 'hex').subarray(0, 16);
  bytes[6] = (bytes[6]! & 0x0f) | 0x80;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function createShopOrderMailIdempotencyKey(orderId: string, purpose: 'shipped') {
  const bytes = createHash('sha256')
    .update('shop-order-mail-v1')
    .update('\0')
    .update(orderId)
    .update('\0')
    .update(purpose)
    .digest()
    .subarray(0, 16);
  bytes[6] = (bytes[6]! & 0x0f) | 0x80;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function fingerprintShopOrderMail(orderId: string, purpose: 'shipped') {
  return createHash('sha256')
    .update('shop-order-mail-request-v1')
    .update('\0')
    .update(orderId)
    .update('\0')
    .update(purpose)
    .digest('hex');
}

export function classifyShopMailDelivery(
  status: string,
  updatedAt: Date,
  now = Date.now(),
) {
  if (status === 'sent') return 'sent' as const;
  if (status === 'uncertain') return 'uncertain' as const;
  if (status === 'failed') return 'retry' as const;
  if (status === 'sending' && updatedAt.getTime() <= now - SHOP_MAIL_CLAIM_STALE_AFTER_MS) {
    // SMTP may already have accepted the message before the process died. A
    // blind retry could duplicate customer mail, so stale sends require manual
    // reconciliation instead of automatic redelivery.
    return 'uncertain' as const;
  }
  return 'in_progress' as const;
}

/**
 * A thrown SMTP send is not proof that the server rejected the message: the
 * connection can disappear after the final DATA response was accepted. Only
 * an explicit negative SMTP reply is safe to retry automatically. Everything
 * else stays uncertain and must be reconciled against the provider log.
 */
export function classifyShopSmtpSendError(error: unknown) {
  if (!error || typeof error !== 'object') return 'uncertain' as const;
  const responseCode = Reflect.get(error, 'responseCode');
  if (typeof responseCode === 'number'
    && Number.isInteger(responseCode)
    && responseCode >= 400
    && responseCode <= 599) {
    return 'rejected' as const;
  }
  return 'uncertain' as const;
}

export function shopAddonRateRules(
  tenantId: string,
  actor: string,
  clientAddress: string,
): RendererContactRateRule[] {
  return [
    { scope: 'shop_addon_actor', subject: `${tenantId}:${actor}`, limit: 3, windowSeconds: 60 * 60 },
    { scope: 'shop_addon_ip', subject: `${tenantId}:${clientAddress}`, limit: 8, windowSeconds: 60 * 60 },
    { scope: 'shop_addon_tenant', subject: tenantId, limit: 3, windowSeconds: 60 * 60 },
    { scope: 'shop_addon_global', subject: 'all', limit: 100, windowSeconds: 60 * 60 },
  ];
}

export function isShopAddonClaimStale(updatedAt: Date, now = Date.now()) {
  return updatedAt.getTime() <= now - SHOP_ADDON_CLAIM_STALE_AFTER_MS;
}

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export function shouldSendShippedNotification(oldStatus: OrderStatus, newStatus: OrderStatus) {
  return oldStatus !== 'shipped' && newStatus === 'shipped';
}
