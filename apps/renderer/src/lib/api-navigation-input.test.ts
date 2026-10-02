import assert from 'node:assert/strict';
import test from 'node:test';
import { mergeNavigationInput } from './api-navigation-input';

test('a CTA-only navigation update preserves links and other locale translations', () => {
  const items = [{ label: 'Leistungen', href: '/leistungen' }];
  const existing = { items, cta: { label: 'Kontakt', href: '/kontakt' } };
  assert.deepEqual(mergeNavigationInput(existing, { cta: null }, { enabled: false, locales: [] }), { items, cta: {} });
  const localized = { items: { _localized: true, de: items, _default: items }, cta: existing.cta };
  const result = mergeNavigationInput(localized, { locale: 'en', cta: { label: 'Contact', href: '/contact' } }, { enabled: true, locales: ['de', 'en'] });
  assert.deepEqual(result.items, localized.items);
  assert.deepEqual(result.cta, { _localized: true, _default: existing.cta, en: { label: 'Contact', href: '/contact' } });
});

test('navigation rejects no-ops, malformed links, executable URLs and unconfigured locales', () => {
  for (const body of [{}, { items: false }, { items: [null] }, { items: [{ label: 'Oops', href: 'javascript:alert(1)' }] }, { cta: [] }, { locale: 'en', items: [] }]) {
    assert.throws(() => mergeNavigationInput(undefined, body, { enabled: false, locales: ['de'] }));
  }
});
