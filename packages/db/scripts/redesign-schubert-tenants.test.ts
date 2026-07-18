import assert from 'node:assert/strict';
import test from 'node:test';
import { buildItemData, buildPageComposition, canUseLegacySharedStandalone, COLLECTION_DETAIL_COMPOSITION_MAPS, PAGE_COMPOSITION_MAPS, parseArgs, REDESIGN_HELP, REDESIGN_TARGETS } from './redesign-schubert-tenants';

const target = REDESIGN_TARGETS['schubert-design'];
const page = { id: '10000000-0000-4000-8000-000000000001', title: 'Startseite', slug: 'startseite', type: 'free' };
const sections = ['Bad', 'Naturstein', 'Spa'].map((headline, index) => ({
  id: `20000000-0000-4000-8000-00000000000${index}`,
  tenant_id: target.id,
  page_id: page.id,
  type: index === 0 ? 'glowHero' : 'textImage',
  definition_key: null,
  schema_version: null,
  variant: null,
  title_internal: headline,
  visible: true,
  locked: false,
  container: 'default',
  spacing_top: 'm',
  spacing_bottom: 'm',
  anchor_id: null,
  style_overrides: null,
  data: { headline, text: `${headline} Beschreibung`, image: `/media/${index}.jpg`, custom: { keep: index }, ...(index === 0 ? { _localized: { en: { headline: 'Bathroom' } } } : {}) },
  sort_order: index,
}));

const itemSlugs = ['baeder', 'naturstein', 'spas'];
const collectionUnits = ['Bäder', 'Naturstein', 'Spas'].map((title, index) => ({ id: itemSlugs[index], title, text: `${title} Text`, image: `/collection/${index}.jpg`, href: `/projekte/${index}`, meta: [] }));

test('page redesign is deterministic, lossless and maps localized source content', () => {
  const first = buildPageComposition(target, page, sections, collectionUnits);
  const second = buildPageComposition(target, page, first, collectionUnits);
  assert.deepEqual(second, first);
  assert.ok(first.some((section) => section.type === 'materialAtelier'));
  assert.deepEqual((first[0].data._premiumRedesign as { sourceSections: unknown[] }).sourceSections, sections);
  assert.equal(((first[0].data._localized as Record<string, Record<string, unknown>>).en).headline, 'Bathroom');
});

test('galleryGrid image arrays become page-owned units with exact URLs and stable labels', () => {
  const quietTarget = REDESIGN_TARGETS['schubert-grabdenkmal'];
  const galleryPage = { id: '70000000-0000-4000-8000-000000000001', title: 'Galerie', slug: 'galerie', type: 'free' };
  const galleryImages = Array.from({ length: 6 }, (_, index) => ({
    src: `/grab/galerie-${index + 1}.jpg`,
    ...(index < 2 ? { alt: `Grabmal ${index + 1}` } : {}),
  }));
  const gallerySection = {
    ...sections[0],
    id: '70000000-0000-4000-8000-000000000002',
    tenant_id: quietTarget.id,
    page_id: galleryPage.id,
    type: 'galleryGrid',
    title_internal: 'Galerie',
    data: { headline: 'Ausgewählte Arbeiten', images: galleryImages },
  };
  const composition = buildPageComposition(quietTarget, galleryPage, [gallerySection], collectionUnits);
  const atelier = composition.find((section) => section.type === 'materialAtelier');
  assert.ok(atelier);
  const items = atelier.data.items as Array<{ title: string; image: string }>;
  assert.deepEqual(items.map((item) => item.image), galleryImages.map((item) => item.src));
  assert.deepEqual(items.map((item) => item.title), ['Grabmal 1', 'Grabmal 2', 'Galerie 03', 'Galerie 04', 'Galerie 05', 'Galerie 06']);
  assert.doesNotMatch(JSON.stringify(items), /\/collection\//);
});

test('collection redesign preserves unrelated item data and the exact source sections', () => {
  const collection = { id: '30000000-0000-4000-8000-000000000001', key: 'projekte', label: 'Projekte' };
  const sourceSections = sections.map((section) => ({ type: section.type, data: section.data }));
  const items = collectionUnits.map((unit, index) => ({
    id: `40000000-0000-4000-8000-00000000000${index}`,
    collection_id: collection.id,
    slug: unit.id,
    title: unit.title,
    data: { image: unit.image, text: unit.text, immutableCustomField: { value: index }, sections: sourceSections },
    published: true,
    priority: index,
  }));
  const next = buildItemData(target, collection, items[0], items);
  assert.deepEqual(next.immutableCustomField, items[0].data.immutableCustomField);
  const nextSections = next.sections as Array<{ type: string; data: Record<string, unknown> }>;
  assert.equal(nextSections[1].type, 'materialAtelier');
  assert.deepEqual((nextSections[0].data._premiumRedesign as { sourceSections: unknown[] }).sourceSections, sourceSections);
  assert.doesNotMatch(JSON.stringify(nextSections), /\/collection\/1\.jpg|\/collection\/2\.jpg/);
  assert.deepEqual(buildItemData(target, collection, { ...items[0], data: next }, items), next);
});

test('page narratives are tenant-specific and semantic source sections remain visible', () => {
  const semanticSections = [
    ...sections,
    ...[
      ['testimonialMarquee', { headline: 'Stimmen', quotes: [{ quote: 'Sehr gute Arbeit', name: 'Kunde' }] }],
      ['logoMarquee', { headline: 'Partner', logos: [{ name: 'Partner A', image: '/partner.svg' }] }],
      ['ctaBand', { headline: 'Projekt besprechen', text: 'Wir beraten persönlich.', primaryCta: { label: 'Kontakt', href: '/kontakt' } }],
      ['faq', { headline: 'Fragen', items: [{ question: 'Wie starten wir?', answer: 'Mit einem Gespräch.' }] }],
    ].map(([type, data], index) => ({ ...sections[0], id: `50000000-0000-4000-8000-00000000000${index}`, type: type as string, title_internal: type as string, data: data as Record<string, unknown>, sort_order: sections.length + index })),
  ];
  const designTypes = buildPageComposition(target, page, semanticSections, collectionUnits).map((section) => section.type);
  const quietTarget = REDESIGN_TARGETS['schubert-grabdenkmal'];
  const quietTypes = buildPageComposition(quietTarget, { ...page, id: '60000000-0000-4000-8000-000000000001' }, semanticSections, collectionUnits).map((section) => section.type);
  assert.ok(designTypes.includes('kineticIdentity'));
  assert.ok(designTypes.includes('editorialCardMorph'));
  assert.ok(!quietTypes.includes('kineticIdentity'));
  assert.ok(quietTypes.includes('signaturePath'));
  for (const type of ['testimonialMarquee', 'logoMarquee', 'ctaBand', 'faq']) assert.ok(designTypes.includes(type), `${type} was not retained`);
});

test('every production page and detail has a distinct explicit map', () => {
  for (const productionTarget of Object.values(REDESIGN_TARGETS)) {
    assert.deepEqual(Object.keys(PAGE_COMPOSITION_MAPS[productionTarget.slug]).sort(), [...productionTarget.pages].sort());
    assert.deepEqual(Object.keys(COLLECTION_DETAIL_COMPOSITION_MAPS[productionTarget.slug]).sort(), [...productionTarget.itemSlugs].sort());
    const signatures = Object.values(COLLECTION_DETAIL_COMPOSITION_MAPS[productionTarget.slug]).map((modules) => JSON.stringify(modules));
    assert.equal(new Set(signatures).size, productionTarget.itemSlugs.length);
  }
});

test('tenant guard constants retain exact production identities', () => {
  assert.equal(REDESIGN_TARGETS['schubert-design'].id, 'e7b96166-8c3d-4e9b-901a-3c4eadee4673');
  assert.equal(REDESIGN_TARGETS['schubert-grabdenkmal'].id, 'ff2102e2-f07e-4d44-9046-12c55d78a60d');
});

test('legacy shared-standalone mode is explicit and limited to a missing registry table', () => {
  assert.equal(parseArgs([]).legacySharedStandalone, false);
  assert.equal(parseArgs(['--legacy-shared-standalone']).legacySharedStandalone, true);
  assert.equal(canUseLegacySharedStandalone({ enabled: true, deploymentMode: 'standalone', error: { code: '42P01' } }), true);
  assert.equal(canUseLegacySharedStandalone({ enabled: false, deploymentMode: 'standalone', error: { code: '42P01' } }), false);
  assert.equal(canUseLegacySharedStandalone({ enabled: true, deploymentMode: 'shared', error: { code: '42P01' } }), false);
  assert.equal(canUseLegacySharedStandalone({ enabled: true, deploymentMode: 'standalone', error: { code: '42501' } }), false);
  assert.equal(canUseLegacySharedStandalone({ enabled: true, deploymentMode: 'standalone', error: { cause: { code: '42P01' } } }), true);
  assert.match(REDESIGN_HELP, /only for a standalone tenant/);
  assert.match(REDESIGN_HELP, /PostgreSQL 42P01/);
});
