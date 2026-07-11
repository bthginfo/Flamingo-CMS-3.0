import assert from 'node:assert/strict';
import test from 'node:test';
import { validateSectionIdentity, validateSections } from './api-utils';

test('API accepts a matching optional section identity', () => {
  assert.equal(validateSectionIdentity({
    type: 'hero',
    definitionKey: 'hero.hotel.v1',
    schemaVersion: 1,
  }), null);
  assert.equal(validateSections([{
    type: 'hero',
    definitionKey: 'hero.hotel.v1',
    schemaVersion: 1,
    data: {},
  }], 'tradesman'), null);
});

test('API rejects malformed, mismatched and invalid-version identities', () => {
  assert.match(validateSectionIdentity({ type: 'hero', definitionKey: 'hotel.hero' }) || '', /format/);
  assert.match(validateSectionIdentity({ type: 'hero', definitionKey: 'faq.hotel.v1' }) || '', /does not match/);
  assert.match(validateSectionIdentity({ type: 'hero', schemaVersion: 0 }) || '', /positive integer/);
  assert.match(validateSectionIdentity({ type: 'hero', schemaVersion: 1.5 }) || '', /positive integer/);
});

test('API rejects phantom section types and unregistered definition keys', () => {
  assert.match(validateSections([{ type: 'servciesGrid', data: {} }], 'tradesman') || '', /unknown and would not render/);
  assert.match(validateSections([{
    type: 'hero',
    definitionKey: 'hero.imaginary.v1',
    data: {},
  }], 'tradesman') || '', /not registered/);
});

test('API fails closed for addon sections and accepts them with capability context', () => {
  assert.match(validateSections([{ type: 'shopCart', data: {} }], 'ecommerce') || '', /requires the active shop addon/);
  assert.equal(validateSections([{ type: 'shopCart', data: {} }], 'ecommerce', { hasShop: true }), null);
  assert.match(validateSections([{ type: 'bookingWidget', data: {} }], 'hotel') || '', /requires the active booking addon/);
  assert.equal(validateSections([{ type: 'bookingWidget', data: {} }], 'hotel', { hasBooking: true }), null);
});
