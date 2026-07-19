import assert from 'node:assert/strict';
import test from 'node:test';
import { formatShopMoney, getShopCurrencySymbol, normalizeShopCurrency } from './shop-currency';

test('shop currency normalization accepts supported ISO codes only', () => {
  assert.equal(normalizeShopCurrency(' chf '), 'CHF');
  assert.equal(normalizeShopCurrency('Euro'), 'EUR');
  assert.equal(normalizeShopCurrency('EU'), 'EUR');
  assert.equal(normalizeShopCurrency(null), 'EUR');
});

test('shop money formatting and symbols use safe fallbacks', () => {
  assert.match(formatShopMoney(12345, 'CHF'), /123[.,]45/);
  assert.match(formatShopMoney(12345, 'not-a-currency'), /123[.,]45/);
  assert.equal(getShopCurrencySymbol('GBP'), '£');
  assert.equal(getShopCurrencySymbol('invalid'), '€');
});
