import assert from 'node:assert/strict';
import test from 'node:test';
import { validateProductInput, categoryUpdates, validateCouponInput, validateShopSettingsInput } from './shop-api-input';

test('product prices and stock reject malformed or negative values before persistence', () => {
  for (const body of [{}, { unknown: true }, { description: {} }, { categoryId: '-'.repeat(36) }, { priceCents: -1 }, { priceCents: '100' }, { stock: 0.5 }, { stock: null }, { comparePriceCents: 2147483648 }, { status: 'pending' }, { images: {} }, { slug: '../other' }]) assert.throws(() => validateProductInput(body));
  assert.doesNotThrow(() => validateProductInput({ title: 'Keramikbecher', slug: 'keramikbecher', priceCents: 0, stock: 0, comparePriceCents: null }, true));
  assert.throws(() => validateProductInput({ title: 'Produkt' }, true));
});

test('renaming categories preserves omitted descriptions and images', () => {
  assert.deepEqual(categoryUpdates({ name: ' Neu ' }), { name: 'Neu' });
  assert.deepEqual(categoryUpdates({ image: null }), { image: null });
  for (const input of [{}, { name: {} }, { slug: '../other' }, { description: false }]) assert.throws(() => categoryUpdates(input));
});

test('coupon percentages, usage limits, dates and scopes reject unintended discounts', () => {
  const coupon = { code: 'SAVE', type: 'percent', value: 10 };
  for (const patch of [{ value: 101 }, { value: -1 }, { value: '10' }, { maxUses: 0 }, { type: ['percent'] }, { validUntil: 'invalid' }, { validFrom: '2026-10-04', validUntil: '2026-10-01' }, { appliesTo: 'specific_products', appliesToIds: [] }]) assert.throws(() => validateCouponInput({ ...coupon, ...patch }));
  assert.doesNotThrow(() => validateCouponInput({ ...coupon, minOrderCents: 0, maxUses: null }));
  assert.doesNotThrow(() => validateCouponInput({ code: 'SHIP', type: 'free_shipping', value: 0 }));
});

test('shop settings accept supported methods and resets but reject malformed billing fields', () => {
  assert.doesNotThrow(() => validateShopSettingsInput({ paymentMethods: ['stripe', 'prepayment', 'pickup'], companyInfo: null, notificationEmail: null, lowStockThreshold: 0 }));
  for (const input of [{}, { paymentMethods: 'stripe' }, { paymentMethods: ['unknown'] }, { currency: {} }, { orderPrefix: 'x'.repeat(11) }, { pickupEnabled: 'false' }, { lowStockThreshold: -1 }]) assert.throws(() => validateShopSettingsInput(input));
});
