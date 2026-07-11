import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getIndustryTemplates,
  listSectionDefinitions,
  resolveSectionDefinition,
} from '../templates';
import { getSectionTypesForIndustry } from '../app/admin/pages/[id]/section-types';
import { getStyleConfig } from './styles';

const INDUSTRIES = [
  'tradesman',
  'restaurant',
  'bar',
  'hotel',
  'tourism',
  'salon',
  'medical',
  'wedding',
  'consulting',
  'photography',
  'realestate',
  'cafe',
  'tattoo',
  'ecommerce',
  'retail',
  'florist',
  'fitness',
  'location',
  'verein',
  'unknown-industry',
] as const;

test('definition registry preserves every legacy industry/type component', () => {
  let checked = 0;
  for (const industry of INDUSTRIES) {
    for (const [type, component] of Object.entries(getIndustryTemplates(industry))) {
      const resolved = resolveSectionDefinition({ type, industry });
      assert.ok(resolved, `Missing legacy resolution for ${industry}:${type}`);
      assert.equal(resolved.component, component, `Component drift for ${industry}:${type}`);
      checked += 1;
    }
  }
  assert.ok(checked > 4_000, `Expected broad parity coverage, checked only ${checked}`);
});

test('explicit hotel hero remains stable when rendered by another industry', () => {
  const hotel = resolveSectionDefinition({ type: 'hero', industry: 'hotel' });
  const borrowed = resolveSectionDefinition({
    type: 'hero',
    industry: 'tradesman',
    definitionKey: 'hero.hotel.v1',
    schemaVersion: 1,
  });
  assert.equal(borrowed?.component, hotel?.component);
  assert.equal(borrowed?.resolution, 'explicit');
});

test('registered definition keys are unique', () => {
  const keys = listSectionDefinitions().map((definition) => definition.key);
  assert.equal(new Set(keys).size, keys.length);
});

test('bar and verein are first-class registry/style contexts', () => {
  assert.equal(
    resolveSectionDefinition({ type: 'hero', industry: 'bar' })?.component,
    resolveSectionDefinition({ type: 'hero', industry: 'restaurant' })?.component,
  );
  assert.deepEqual(getStyleConfig('bar', 'classic'), getStyleConfig('restaurant', 'classic'));
  assert.ok(getStyleConfig('verein', 'classic'));
  assert.deepEqual(
    getSectionTypesForIndustry('bar').map((section) => section.type),
    getSectionTypesForIndustry('restaurant').map((section) => section.type),
  );
  assert.ok(getSectionTypesForIndustry('verein').some((section) => section.type === 'nextMatchHero'));
});

test('addon sections are locked consistently in specific and borrowed catalogs', () => {
  const withoutShop = getSectionTypesForIndustry('ecommerce', { hasShop: false });
  assert.equal(withoutShop.find(section => section.type === 'shopCart')?.locked, true);
  const withShop = getSectionTypesForIndustry('ecommerce', { hasShop: true });
  assert.notEqual(withShop.find(section => section.type === 'shopCart')?.locked, true);
  const withoutBooking = getSectionTypesForIndustry('hotel', { hasBooking: false });
  assert.equal(withoutBooking.find(section => section.type === 'bookingWidget')?.locked, true);
});
