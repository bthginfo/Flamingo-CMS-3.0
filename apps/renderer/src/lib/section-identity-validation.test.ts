import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeSectionData, validateSectionIdentity, validateSections } from './api-utils';

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

test('API normalizes common weak-model section data aliases before validation', () => {
  const serviceData = normalizeSectionData('servicesGrid', {
    title: 'Leistungen',
    subtitle: 'Was wir konkret anbieten',
    cards: [{ title: 'Beratung', text: 'Klärt Ziele, Ablauf und nächste Schritte.' }],
  });
  assert.equal(serviceData.headline, 'Leistungen');
  assert.equal(serviceData.subline, 'Was wir konkret anbieten');
  assert.deepEqual(serviceData.manualCards, [{ title: 'Beratung', text: 'Klärt Ziele, Ablauf und nächste Schritte.' }]);
  assert.equal(validateSections([{ type: 'servicesGrid', data: serviceData }], 'tradesman'), null);

  const faqData = normalizeSectionData('faq', {
    title: 'Häufige Fragen',
    faqs: [{ title: 'Wie startet ein Projekt?', text: 'Mit einem kurzen Erstgespräch und klarer Bedarfsaufnahme.' }],
  });
  assert.equal(faqData.headline, 'Häufige Fragen');
  assert.deepEqual(faqData.items, [{ title: 'Wie startet ein Projekt?', text: 'Mit einem kurzen Erstgespräch und klarer Bedarfsaufnahme.', question: 'Wie startet ein Projekt?', answer: 'Mit einem kurzen Erstgespräch und klarer Bedarfsaufnahme.' }]);
  assert.equal(validateSections([{ type: 'faq', data: faqData }], 'tradesman'), null);
});
