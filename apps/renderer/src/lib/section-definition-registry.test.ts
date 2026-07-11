import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createSectionDefinitionKey,
  createSectionDefinitionRegistry,
  isSectionDefinitionKey,
  parseSectionDefinitionKey,
} from './section-definition-registry';

const registry = createSectionDefinitionRegistry({
  industryTemplates: {
    alpha: { hero: 'alpha-hero', alphaOnly: 'alpha-only' },
    beta: { hero: 'beta-hero', borrowed: 'beta-borrowed' },
  },
  sharedTemplates: { hero: 'shared-hero', sharedOnly: 'shared-only' },
  legacyFallbackIndustryOrder: ['alpha', 'beta'],
  defaultIndustry: 'alpha',
  industryAliases: { legacybeta: 'beta' },
});

test('definition keys have a stable, parseable format', () => {
  const key = createSectionDefinitionKey('hero', 'hotel', 1);
  assert.equal(key, 'hero.hotel.v1');
  assert.deepEqual(parseSectionDefinitionKey(key), { type: 'hero', owner: 'hotel', version: 1 });
  assert.equal(isSectionDefinitionKey(key), true);
  assert.equal(isSectionDefinitionKey('hotel.hero'), false);
  assert.throws(() => createSectionDefinitionKey('hero.bad', 'hotel'));
});

test('explicit definition keys decouple rendering from tenant industry', () => {
  const resolved = registry.resolve({
    type: 'hero',
    industry: 'alpha',
    definitionKey: 'hero.beta.v1',
    schemaVersion: 1,
  });
  assert.equal(resolved?.component, 'beta-hero');
  assert.equal(resolved?.resolution, 'explicit');
  assert.equal(resolved?.schemaCompatible, true);
});

test('legacy resolution preserves specific, shared, then cross-industry precedence', () => {
  assert.equal(registry.resolve({ type: 'hero', industry: 'alpha' })?.component, 'alpha-hero');
  assert.equal(registry.resolve({ type: 'sharedOnly', industry: 'alpha' })?.resolution, 'legacy-shared');
  assert.equal(registry.resolve({ type: 'borrowed', industry: 'alpha' })?.resolution, 'legacy-cross-industry');
  assert.equal(registry.resolveLegacyKey('alpha', 'borrowed'), 'borrowed.beta.v1');
});

test('invalid and type-mismatched explicit keys safely use the legacy fallback', () => {
  assert.equal(registry.resolve({ type: 'hero', industry: 'alpha', definitionKey: 'missing.alpha.v1' })?.component, 'alpha-hero');
  assert.equal(registry.resolve({ type: 'hero', industry: 'alpha', definitionKey: 'borrowed.beta.v1' })?.component, 'alpha-hero');
  assert.equal(registry.resolve({ type: 'invalid.type', industry: 'alpha' }), null);
});

test('industry aliases and unknown industries resolve deterministically', () => {
  assert.equal(registry.resolve({ type: 'hero', industry: 'legacybeta' })?.component, 'beta-hero');
  assert.equal(registry.resolve({ type: 'hero', industry: 'unknown' })?.component, 'alpha-hero');
  assert.equal(registry.resolve({ type: 'hero', industry: 'alpha', schemaVersion: 2 })?.schemaCompatible, false);
});

test('registry listing is stable and keys are unique', () => {
  const keys = registry.list().map((definition) => definition.key);
  assert.deepEqual(keys, [...keys].sort((left, right) => left.localeCompare(right)));
  assert.equal(new Set(keys).size, keys.length);
});
