import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  classifyPublicFlowRequest,
  fingerprintPublicFlowRequest,
  publicFlowClaimResponse,
  publicFlowRateRules,
  PUBLIC_FLOW_STALE_AFTER_MS,
  resolvePublicFlowIdempotencyKey,
} from './public-flow-security';
import { createPublicFlowActionId, publicFlowRequestHeaders } from './public-flow-client-security';

const TENANT_ID = '6d10ab45-8183-4c69-9ee5-5bfb045739e3';
const KEY = '123e4567-e89b-42d3-a456-426614174000';
const bookingRouteSource = readFileSync(new URL('../app/api/booking/request/route.ts', import.meta.url), 'utf8');
const checkoutRouteSource = readFileSync(new URL('../app/api/shop/checkout/route.ts', import.meta.url), 'utf8');
const bookingWidgetSource = readFileSync(new URL('../templates/shared/booking-widget.tsx', import.meta.url), 'utf8');
const checkoutWidgetSource = readFileSync(new URL('../templates/shared/shop-checkout.tsx', import.meta.url), 'utf8');
const dbSchemaSource = readFileSync(new URL('../../../../packages/db/src/schema/index.ts', import.meta.url), 'utf8');

describe('public booking and checkout security', () => {
  it('consumes narrow IP/e-mail limits before tenant and global caps', () => {
    for (const flow of ['booking', 'checkout'] as const) {
      assert.deepEqual(publicFlowRateRules(flow, TENANT_ID, '203.0.113.8', 'Buyer@Example.com').map(rule => rule.scope), [
        `renderer_${flow}_ip`,
        `renderer_${flow}_email`,
        `renderer_${flow}_tenant`,
        `renderer_${flow}_global`,
      ]);
    }
    assert.equal(publicFlowRateRules('booking', TENANT_ID, 'ip', 'mail@example.com')[0]?.limit, 5);
    assert.equal(publicFlowRateRules('checkout', TENANT_ID, 'ip', 'mail@example.com')[1]?.limit, 5);
  });

  it('requires one valid stable idempotency key and rejects disagreement', () => {
    assert.equal(resolvePublicFlowIdempotencyKey(new Request('https://example.test', {
      headers: { 'Idempotency-Key': KEY },
    }), KEY), KEY);
    assert.equal(resolvePublicFlowIdempotencyKey(new Request('https://example.test'), KEY), KEY);
    assert.equal(resolvePublicFlowIdempotencyKey(new Request('https://example.test', {
      headers: { 'Idempotency-Key': KEY },
    }), '223e4567-e89b-42d3-a456-426614174000'), null);
    assert.equal(resolvePublicFlowIdempotencyKey(new Request('https://example.test'), null), null);
  });

  it('keeps browser request headers stable across retries of one action', () => {
    const actionId = createPublicFlowActionId();
    assert.deepEqual(publicFlowRequestHeaders(actionId), publicFlowRequestHeaders(actionId));
    assert.equal(publicFlowRequestHeaders(actionId)['Idempotency-Key'], actionId);
  });

  it('fingerprints canonical request data independent of object key order', () => {
    const first = fingerprintPublicFlowRequest('checkout', TENANT_ID, { email: 'a@example.com', items: [{ quantity: 1, id: 'p1' }] });
    const reordered = fingerprintPublicFlowRequest('checkout', TENANT_ID, { items: [{ id: 'p1', quantity: 1 }], email: 'a@example.com' });
    const changed = fingerprintPublicFlowRequest('checkout', TENANT_ID, { email: 'a@example.com', items: [{ quantity: 2, id: 'p1' }] });
    assert.equal(first, reordered);
    assert.notEqual(first, changed);
  });

  it('replays only the stored response for the same request hash', () => {
    const completed = classifyPublicFlowRequest({ requestHash: 'a', status: 'completed', response: { success: true, orderId: 'o1' } }, 'a');
    assert.deepEqual(publicFlowClaimResponse(completed), {
      status: 200,
      body: { success: true, orderId: 'o1', duplicate: true },
    });
    assert.equal(classifyPublicFlowRequest({ requestHash: 'a', status: 'completed', response: {} }, 'b').state, 'conflict');
    assert.equal(classifyPublicFlowRequest({ requestHash: 'a', status: 'uncertain', response: null }, 'a').state, 'uncertain');
    const now = Date.parse('2026-07-12T12:00:00.000Z');
    assert.equal(classifyPublicFlowRequest({
      requestHash: 'a',
      status: 'processing',
      response: null,
      updatedAt: new Date(now - PUBLIC_FLOW_STALE_AFTER_MS),
    }, 'a', now).state, 'uncertain');
  });

  it('wires persistent limits and idempotency into both mail-generating public routes', () => {
    for (const source of [bookingRouteSource, checkoutRouteSource]) {
      assert.match(source, /readBoundedRendererContactJson/);
      assert.match(source, /isTrustedRendererContactOrigin/);
      assert.match(source, /inspectPublicFlowRequest/);
      assert.match(source, /consumePublicFlowRateLimit/);
      assert.match(source, /claimPublicFlowRequest/);
      assert.match(source, /completePublicFlowRequest/);
      assert.doesNotMatch(source, /from ['"]@\/lib\/rate-limit['"]/);
      assert.ok(
        source.indexOf('await inspectPublicFlowRequest') < source.indexOf('await consumePublicFlowRateLimit'),
      );
    }
    assert.ok(bookingRouteSource.indexOf('await claimPublicFlowRequest') < bookingRouteSource.indexOf('db.insert(bookingCustomers)'));
    assert.match(checkoutRouteSource, /idempotencyKey:\s*resolvedIdempotencyKey/);
    assert.match(checkoutRouteSource, /await sendOrderEmails/);
  });

  it('sends one stable idempotency key from every booking and checkout UI', () => {
    assert.equal((bookingWidgetSource.match(/publicFlowRequestHeaders\(actionIdRef\.current\)/g) || []).length, 3);
    assert.match(checkoutWidgetSource, /publicFlowRequestHeaders\(idempotencyKeyRef\.current\)/);
    assert.match(checkoutWidgetSource, /retryWithNewIdempotencyKey/);
  });

  it('keeps the CRM delivery status constraint mirrored in the Drizzle schema', () => {
    assert.match(
      dbSchemaSource,
      /check\('crm_email_deliveries_status_check',[\s\S]*?'sending'[\s\S]*?'sent'[\s\S]*?'failed'[\s\S]*?'uncertain'/,
    );
  });
});
