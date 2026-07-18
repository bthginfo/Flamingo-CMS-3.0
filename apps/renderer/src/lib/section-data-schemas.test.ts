import assert from 'node:assert/strict';
import test from 'node:test';
import { validateContentQuality } from './content-quality';
import { getCatalogSectionSchemas, getSectionSchemas } from './section-data-schemas';

test('catalog schemas add uniquely owned foreign section types', () => {
  const schemas = getCatalogSectionSchemas('tradesman');

  assert.ok(schemas.coupleStory, 'wedding schema missing');
  assert.ok(schemas.doctorTeam, 'medical schema missing');
  assert.ok(schemas.propertyShowcase, 'real-estate schema missing');
  assert.ok(schemas.destinationHighlights, 'tourism schema missing');
});

test('catalog schemas preserve current-industry semantics for ambiguous names', () => {
  const medicalCatalog = getCatalogSectionSchemas('medical');
  const medicalSchemas = getSectionSchemas('medical');
  const weddingCatalog = getCatalogSectionSchemas('wedding');
  const weddingSchemas = getSectionSchemas('wedding');

  assert.deepEqual(medicalCatalog.hero, medicalSchemas.hero);
  assert.deepEqual(medicalCatalog.faq, medicalSchemas.faq);
  assert.deepEqual(weddingCatalog.hero, weddingSchemas.hero);
  assert.notDeepEqual(medicalCatalog.hero, weddingCatalog.hero);
});

test('bar keeps the restaurant alias schema while restaurant-only types remain available', () => {
  const barCatalog = getCatalogSectionSchemas('bar');
  const barSchemas = getSectionSchemas('bar');

  assert.deepEqual(barCatalog.hero, barSchemas.hero);
  assert.deepEqual(barCatalog.menu, barSchemas.menu);
  assert.ok(barCatalog.menu);
});

test('quality validation does not silently skip required fields for foreign unique sections', () => {
  const schemas = getCatalogSectionSchemas('tradesman');
  const result = validateContentQuality({
    mode: 'plan',
    allowedSectionTypes: ['propertyShowcase'],
    sectionSchemas: schemas,
    pages: [{
      slug: 'objekte',
      title: 'Objekte',
      purpose: 'Verfügbare Immobilien zeigen.',
      sections: [{ type: 'propertyShowcase', data: {} }],
    }],
  });

  assert.ok(result.issues.some(issue => issue.code === 'plan.required_field' && issue.location === 'pages[0].sections[0].data.headline'));
});
