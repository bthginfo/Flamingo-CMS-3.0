import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  classifyShopMailDelivery,
  classifyShopSmtpSendError,
  createShopAddonIdempotencyKey,
  createShopOrderMailIdempotencyKey,
  fingerprintShopAddonActor,
  fingerprintShopAddonRequest,
  fingerprintShopOrderMail,
  isOrderStatus,
  isShopAddonClaimStale,
  normalizeShopAddonMessage,
  SHOP_ADDON_CLAIM_STALE_AFTER_MS,
  SHOP_ADDON_MESSAGE_MAX_LENGTH,
  SHOP_MAIL_CLAIM_STALE_AFTER_MS,
  shopAddonRateRules,
  shouldSendShippedNotification,
} from './shop-admin-security';

const actionsSource = readFileSync(
  new URL('../app/admin/shop/actions.ts', import.meta.url),
  'utf8',
);

test('shop-addon messages are normalized and bounded before persistence', () => {
  assert.equal(normalizeShopAddonMessage('  Hallo\r\nWelt  '), 'Hallo\nWelt');
  assert.equal(normalizeShopAddonMessage(undefined), '');
  assert.equal(normalizeShopAddonMessage('x'.repeat(SHOP_ADDON_MESSAGE_MAX_LENGTH)).length, SHOP_ADDON_MESSAGE_MAX_LENGTH);
  assert.throws(
    () => normalizeShopAddonMessage('x'.repeat(SHOP_ADDON_MESSAGE_MAX_LENGTH + 1)),
    /höchstens 2000 Zeichen/,
  );
  assert.throws(() => normalizeShopAddonMessage({}), /Ungültige Nachricht/);
});

test('shop-addon retries derive one stable UUIDv8 without leaking request content', () => {
  const tenantId = '123e4567-e89b-42d3-a456-426614174000';
  const message = 'Bitte Shop freischalten';
  const first = createShopAddonIdempotencyKey(tenantId, message);
  const second = createShopAddonIdempotencyKey(tenantId, message);

  assert.equal(first, second);
  assert.match(first, /^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.notEqual(first, createShopAddonIdempotencyKey(tenantId, `${message}!`));
  assert.notEqual(first, createShopAddonIdempotencyKey('223e4567-e89b-42d3-a456-426614174000', message));
  assert.equal(fingerprintShopAddonRequest(tenantId, message).length, 64);
  assert.doesNotMatch(first, /Bitte|Shop/);
});

test('authenticated actor and persistent tenant/IP rate limits use pseudonymous subjects', () => {
  const actor = fingerprintShopAddonActor('signed-session-cookie');
  assert.equal(actor.length, 64);
  assert.doesNotMatch(actor, /signed-session-cookie/);

  const rules = shopAddonRateRules('tenant-a', actor, '203.0.113.5');
  assert.deepEqual(rules.map(rule => rule.scope), [
    'shop_addon_actor',
    'shop_addon_ip',
    'shop_addon_tenant',
    'shop_addon_global',
  ]);
  assert.equal(rules[0]?.subject, `tenant-a:${actor}`);
  assert.equal(rules[1]?.subject, 'tenant-a:203.0.113.5');
  assert.throws(() => fingerprintShopAddonActor(''), /Missing authenticated shop actor/);
});

test('only stale delivery claims can be recovered', () => {
  const now = Date.parse('2026-07-12T12:00:00.000Z');
  assert.equal(isShopAddonClaimStale(new Date(now - SHOP_ADDON_CLAIM_STALE_AFTER_MS), now), true);
  assert.equal(isShopAddonClaimStale(new Date(now - SHOP_ADDON_CLAIM_STALE_AFTER_MS + 1), now), false);
});

test('shipped notification is limited to a real transition into shipped', () => {
  assert.equal(isOrderStatus('shipped'), true);
  assert.equal(isOrderStatus('anything'), false);
  assert.equal(shouldSendShippedNotification('processing', 'shipped'), true);
  assert.equal(shouldSendShippedNotification('shipped', 'shipped'), false);
  assert.equal(shouldSendShippedNotification('shipped', 'delivered'), false);
});

test('shipped outbox identity is stable, failed attempts retry, and stale sends stay uncertain', () => {
  const orderId = '123e4567-e89b-42d3-a456-426614174000';
  const key = createShopOrderMailIdempotencyKey(orderId, 'shipped');
  const now = Date.parse('2026-07-12T12:00:00.000Z');

  assert.equal(key, createShopOrderMailIdempotencyKey(orderId, 'shipped'));
  assert.match(key, /^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(fingerprintShopOrderMail(orderId, 'shipped').length, 64);
  assert.equal(classifyShopMailDelivery('sent', new Date(now), now), 'sent');
  assert.equal(classifyShopMailDelivery('failed', new Date(now), now), 'retry');
  assert.equal(classifyShopMailDelivery('sending', new Date(now - SHOP_MAIL_CLAIM_STALE_AFTER_MS), now), 'uncertain');
  assert.equal(classifyShopMailDelivery('sending', new Date(now), now), 'in_progress');
  assert.equal(classifyShopMailDelivery('uncertain', new Date(now), now), 'uncertain');
});

test('only explicit SMTP rejection is retryable after sendMail throws', () => {
  assert.equal(classifyShopSmtpSendError({ responseCode: 550, code: 'EENVELOPE' }), 'rejected');
  assert.equal(classifyShopSmtpSendError({ responseCode: 421, command: 'DATA' }), 'rejected');
  assert.equal(classifyShopSmtpSendError({ code: 'ETIMEDOUT', command: 'DATA' }), 'uncertain');
  assert.equal(classifyShopSmtpSendError({ code: 'ECONNECTION' }), 'uncertain');
  assert.equal(classifyShopSmtpSendError(new Error('socket closed')), 'uncertain');
});

test('shop admin actions persist claims before CRM/mail work and atomically claim status transitions', () => {
  const rateLimit = actionsSource.indexOf('consumeRendererContactRateRules(shopAddonRateRules(');
  const deliveryClaim = actionsSource.indexOf('db.insert(crmEmailDeliveries)');
  const submission = actionsSource.indexOf('db.insert(formSubmissions)');
  const accepted = actionsSource.indexOf("status: 'sent'", submission);
  const mail = actionsSource.indexOf('transport.sendMail', accepted);

  assert.ok(rateLimit >= 0 && deliveryClaim > rateLimit && submission > deliveryClaim && accepted > submission && mail > accepted);
  assert.match(actionsSource, /target:\s*\[formSubmissions\.tenantId, formSubmissions\.idempotencyKey\]/);
  const statusAction = actionsSource.slice(
    actionsSource.indexOf('export async function updateOrderStatus'),
    actionsSource.indexOf('export async function updateOrderTracking'),
  );
  assert.match(statusAction, /WITH transitioned_order AS/);
  assert.match(statusAction, /INSERT INTO order_status_history/);
  assert.match(statusAction, /INSERT INTO crm_email_deliveries/);
  assert.match(statusAction, /deliverShippedNotification/);
  assert.match(statusAction, /status: retryable \? 'failed' : 'uncertain'/);
  assert.match(statusAction, /classifyShopSmtpSendError/);
  assert.match(statusAction, /status: 'sent'/);
  assert.doesNotMatch(statusAction, /sendShippedEmail\([^)]*\)\.catch/);
  assert.match(actionsSource, /messageId: `<shop-shipped-/);
});

test('cancellation SMTP is awaited before the server action returns', () => {
  const cancellationAction = actionsSource.slice(
    actionsSource.indexOf('export async function cancelOrder'),
    actionsSource.indexOf('async function sendCancellationEmail'),
  );
  assert.match(cancellationAction, /WITH locked_order AS MATERIALIZED/);
  assert.match(cancellationAction, /created_credit AS/);
  assert.match(cancellationAction, /counter_decision AS/);
  assert.match(cancellationAction, /cancelled_order AS/);
  assert.match(cancellationAction, /restored_variants AS/);
  assert.match(cancellationAction, /restored_products AS/);
  assert.match(cancellationAction, /tracked: typeof item\.trackStock === 'boolean' \? item\.trackStock : null/);
  assert.match(cancellationAction, /COALESCE\(adjustment\.tracked, product\.track_stock\)/);
  assert.match(cancellationAction, /recorded_history AS/);
  assert.doesNotMatch(cancellationAction, /if \(existingCreditNote\)/);
  assert.match(actionsSource, /await sendCancellationEmail\(tenantId, order, creditNoteNumber\)/);
  assert.doesNotMatch(actionsSource, /sendCancellationEmail\(tenantId, order, creditNoteNumber\)\.catch/);
});
