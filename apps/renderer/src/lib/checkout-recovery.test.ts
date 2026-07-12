import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readFileSync } from 'node:fs';

import { externalProvisioningUncertain, runExternalCheckoutLifecycle } from './checkout-recovery';

const checkoutRouteSource = readFileSync(
  new URL('../app/api/shop/checkout/route.ts', import.meta.url),
  'utf8',
);

describe('checkout recovery boundaries', () => {
  it('rolls back only when provider provisioning itself failed', async () => {
    let rolledBack = 0;
    let markedUncertain = 0;

    const result = await runExternalCheckoutLifecycle({
      provision: async () => { throw new Error('provider unavailable'); },
      finalizeProvisioned: async () => 'completed',
      onProvisionFailure: async () => { rolledBack += 1; return 'rolled-back'; },
      onProvisioningUncertain: async () => { markedUncertain += 1; return 'uncertain'; },
      onPostProvisionFailure: async () => { markedUncertain += 1; return 'uncertain'; },
    });

    assert.equal(result, 'rolled-back');
    assert.equal(rolledBack, 1);
    assert.equal(markedUncertain, 0);
  });

  it('never rolls back after a provider session exists, including finalization failures', async () => {
    let rolledBack = 0;
    let markedUncertain = 0;

    const result = await runExternalCheckoutLifecycle({
      provision: async () => ({ id: 'provider-session', url: 'https://pay.example/session' }),
      finalizeProvisioned: async () => { throw new Error('local audit unavailable'); },
      onProvisionFailure: async () => { rolledBack += 1; return 'rolled-back'; },
      onProvisioningUncertain: async () => { markedUncertain += 1; return 'uncertain'; },
      onPostProvisionFailure: async (_error, session) => {
        assert.equal(session.id, 'provider-session');
        markedUncertain += 1;
        return 'uncertain';
      },
    });

    assert.equal(result, 'uncertain');
    assert.equal(rolledBack, 0);
    assert.equal(markedUncertain, 1);
  });

  it('treats a transport break during provider creation as uncertain, never as rollback-safe', async () => {
    let rolledBack = 0;
    let markedUncertain = 0;

    const result = await runExternalCheckoutLifecycle({
      provision: async () => externalProvisioningUncertain(new Error('socket closed after request write')),
      finalizeProvisioned: async () => 'completed',
      onProvisionFailure: async () => { rolledBack += 1; return 'rolled-back'; },
      onProvisioningUncertain: async () => { markedUncertain += 1; return 'uncertain'; },
      onPostProvisionFailure: async () => { markedUncertain += 1; return 'uncertain'; },
    });

    assert.equal(result, 'uncertain');
    assert.equal(rolledBack, 0);
    assert.equal(markedUncertain, 1);
  });

  it('uses one persistent, row-locked SQL statement for compensation', () => {
    assert.match(checkoutRouteSource, /WITH locked_checkout AS MATERIALIZED/);
    assert.match(checkoutRouteSource, /FOR UPDATE OF shop_order, flow_request/);
    assert.match(checkoutRouteSource, /UPDATE product_variants/);
    assert.match(checkoutRouteSource, /UPDATE products/);
    assert.match(checkoutRouteSource, /UPDATE coupons/);
    assert.match(checkoutRouteSource, /INSERT INTO order_status_history/);
    assert.doesNotMatch(checkoutRouteSource, /async function releaseReservedStock/);
    assert.doesNotMatch(checkoutRouteSource, /async function releaseCouponUsage/);
  });

  it('persists the historical stock policy in the order snapshot', () => {
    const snapshot = checkoutRouteSource.slice(
      checkoutRouteSource.indexOf('orderItems.push({'),
      checkoutRouteSource.indexOf('subtotalCents +=', checkoutRouteSource.indexOf('orderItems.push({')),
    );
    const insert = checkoutRouteSource.slice(
      checkoutRouteSource.indexOf('const [order] = await db.insert(orders)'),
      checkoutRouteSource.indexOf('}).returning({ id: orders.id })'),
    );

    assert.match(snapshot, /trackStock,/);
    assert.match(insert, /items: orderItems,/);
  });
});
