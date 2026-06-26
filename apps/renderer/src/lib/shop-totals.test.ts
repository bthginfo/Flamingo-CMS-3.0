import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeSubtotalCents, computeTaxCents, couponEffect, computeShippingCents, computeOrderTotals,
} from './shop-totals';

test('subtotal sums priceCents * quantity', () => {
  assert.equal(computeSubtotalCents([{ priceCents: 1000, quantity: 2 }, { priceCents: 250, quantity: 3 }]), 2750);
  assert.equal(computeSubtotalCents([]), 0);
});

test('tax is extracted from gross prices, mixed rates', () => {
  // 1190 gross @19% → contained tax = round(1190*19/119) = 190
  assert.equal(computeTaxCents([{ priceCents: 1190, quantity: 1, taxRate: 19 }]), 190);
  // 107 gross @7% → round(107*7/107) = 7
  assert.equal(computeTaxCents([{ priceCents: 107, quantity: 1, taxRate: 7 }]), 7);
  // 0% / missing rate contributes nothing
  assert.equal(computeTaxCents([{ priceCents: 500, quantity: 2, taxRate: 0 }, { priceCents: 100, quantity: 1 }]), 0);
});

test('couponEffect: percent', () => {
  assert.deepEqual(couponEffect({ type: 'percent', value: 10 }, 2000), { discountCents: 200, freeShipping: false });
});

test('couponEffect: fixed amount is capped at the subtotal', () => {
  assert.deepEqual(couponEffect({ type: 'fixed_amount', value: 500 }, 2000), { discountCents: 500, freeShipping: false });
  assert.deepEqual(couponEffect({ type: 'fixed_amount', value: 5000 }, 2000), { discountCents: 2000, freeShipping: false });
});

test('couponEffect: free_shipping gives no discount but flags freeShipping', () => {
  assert.deepEqual(couponEffect({ type: 'free_shipping', value: 0 }, 2000), { discountCents: 0, freeShipping: true });
});

test('couponEffect: no coupon', () => {
  assert.deepEqual(couponEffect(null, 2000), { discountCents: 0, freeShipping: false });
});

test('shipping: charged, free above threshold, or free via coupon', () => {
  const m = { priceCents: 499, freeAboveCents: 5000 };
  assert.equal(computeShippingCents(m, 2000), 499);          // below threshold
  assert.equal(computeShippingCents(m, 5000), 0);            // at threshold → free
  assert.equal(computeShippingCents(m, 2000, true), 0);      // free_shipping coupon
  assert.equal(computeShippingCents(null, 2000), 0);         // pickup / no method
});

test('computeOrderTotals: free_shipping coupon zeroes shipping (the server bug this fixes)', () => {
  const t = computeOrderTotals({
    items: [{ priceCents: 2000, quantity: 1, taxRate: 19 }],
    shipping: { priceCents: 499, freeAboveCents: 5000 },
    coupon: { type: 'free_shipping', value: 0 },
  });
  assert.equal(t.shippingCents, 0);
  assert.equal(t.discountCents, 0);
  assert.equal(t.totalCents, 2000);
});

test('computeOrderTotals: total never negative', () => {
  const t = computeOrderTotals({
    items: [{ priceCents: 1000, quantity: 1 }],
    shipping: { priceCents: 0 },
    coupon: { type: 'fixed_amount', value: 100000 },
  });
  assert.equal(t.totalCents, 0);
});

test('computeOrderTotals: realistic order with percent coupon + shipping', () => {
  const t = computeOrderTotals({
    items: [{ priceCents: 1500, quantity: 2, taxRate: 19 }],   // subtotal 3000
    shipping: { priceCents: 499, freeAboveCents: 10000 },      // not free
    coupon: { type: 'percent', value: 10 },                    // -300
  });
  assert.equal(t.subtotalCents, 3000);
  assert.equal(t.shippingCents, 499);
  assert.equal(t.discountCents, 300);
  assert.equal(t.totalCents, 3199); // 3000 + 499 - 300
});
