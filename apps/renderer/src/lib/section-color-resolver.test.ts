import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getFieldsForSection, resolveColorContractForSection } from './section-color-resolver';
import { getCssVarsForColorField } from './section-color-fields';

test('section text controls do not recolor inverse text on image cards', () => {
  assert.ok(!getCssVarsForColorField('headingColor').includes('--token-on-dark-heading'));
  assert.ok(!getCssVarsForColorField('bodyColor').includes('--token-on-dark-body'));
  assert.ok(!getCssVarsForColorField('mutedColor').includes('--token-on-dark-muted'));
});

// The resolver decides which colour fields the CMS editor exposes and which
// --token-* the API accepts per (sectionType, industry). The exact field lists
// are codegen output (they change), so these assert the invariants instead.

test('every section always exposes sectionBg', () => {
  for (const [type, ind] of [['hero', 'hotel'], ['faq', 'salon'], ['__unknown__', 'cafe'], ['story', 'tourismus']] as const) {
    assert.ok(getFieldsForSection(type, ind).includes('sectionBg'), `${type}@${ind} must include sectionBg`);
  }
});

test('unknown section type collapses to sectionBg-only', () => {
  const fields = getFieldsForSection('__definitely_not_a_type__', 'cafe');
  assert.deepEqual(fields, ['sectionBg']);
  assert.equal(resolveColorContractForSection('__definitely_not_a_type__', 'cafe').source, 'none');
});

test('handwerk resolves through the tradesman alias', () => {
  // handwerk tenants are served tradesman templates; the contract must match.
  assert.deepEqual(
    getFieldsForSection('hero', 'handwerk'),
    getFieldsForSection('hero', 'tradesman'),
  );
});

test('vertical aliases use the same color contracts as their renderer family', () => {
  assert.deepEqual(getFieldsForSection('hero', 'bar'), getFieldsForSection('hero', 'restaurant'));
  assert.deepEqual(getFieldsForSection('hero', 'shop'), getFieldsForSection('hero', 'ecommerce'));
  assert.deepEqual(getFieldsForSection('nextMatchHero', 'eishockey'), getFieldsForSection('nextMatchHero', 'verein'));
});

test('a real industry section resolves a rich contract, not just background', () => {
  const fields = getFieldsForSection('hero', 'hotel');
  assert.ok(fields.length > 1, 'hero@hotel should expose more than sectionBg');
  assert.equal(resolveColorContractForSection('hero', 'hotel').source, 'industry');
});

test('an explicit renderer definition wins over the tenant industry', () => {
  const explicit = getFieldsForSection('hero', 'salon', 'hero.consulting.v1');
  assert.deepEqual(explicit, getFieldsForSection('hero', 'consulting'));
  assert.equal(resolveColorContractForSection('hero', 'salon', 'hero.consulting.v1').source, 'definition');
});

test('a stale or mismatched definition key safely falls back to the tenant industry', () => {
  assert.deepEqual(
    getFieldsForSection('hero', 'salon', 'faq.consulting.v1'),
    getFieldsForSection('hero', 'salon'),
  );
});

test('no industry falls back to generic/any/none (never throws)', () => {
  const fields = getFieldsForSection('hero');
  assert.ok(Array.isArray(fields) && fields.includes('sectionBg'));
});

test('returned fields are unique and stable across calls', () => {
  const a = getFieldsForSection('testimonials', 'salon');
  const b = getFieldsForSection('testimonials', 'salon');
  assert.deepEqual(a, b);
  assert.equal(new Set(a).size, a.length, 'no duplicate fields');
});


test('unknown and omitted industries use the same tradesman default as rendering', () => {
  for (const industry of [undefined, '', 'unknown-industry', 'realstate']) {
    assert.deepEqual(getFieldsForSection('hero', industry), getFieldsForSection('hero', 'tradesman'));
  }
});

test('unsupported definition versions and owner aliases fall back like the renderer', () => {
  for (const key of ['hero.hotel.v2', 'hero.handwerk.v1']) {
    assert.deepEqual(getFieldsForSection('hero', 'salon', key), getFieldsForSection('hero', 'salon'));
  }
});
