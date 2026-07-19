import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildItemData,
  buildPageComposition,
  canUseLegacySharedRecordFallback,
  canUseLegacySharedStandalone,
  COLLECTION_DETAIL_COMPOSITION_MAPS,
  findUnavailableSelectedMedia,
  isCssColorLiteral,
  PAGE_COMPOSITION_MAPS,
  parseArgs,
  REDESIGN_HELP,
  REDESIGN_TARGETS,
  sanitizeVisibleContent,
} from './redesign-schubert-tenants';

const design = REDESIGN_TARGETS['schubert-design'];
const grab = REDESIGN_TARGETS['schubert-grabdenkmal'];
const page = { id: '10000000-0000-4000-8000-000000000001', title: 'Startseite', slug: 'startseite', type: 'free' };

function section(type: string, index: number, data: Record<string, unknown> = {}) {
  return {
    id: `20000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
    tenant_id: design.id,
    page_id: page.id,
    type,
    definition_key: null,
    schema_version: null,
    variant: null,
    title_internal: type,
    visible: true,
    locked: false,
    container: 'default',
    spacing_top: 'm',
    spacing_bottom: 'm',
    anchor_id: null,
    style_overrides: null,
    data: { headline: `${type} Inhalt`, text: `${type} Beschreibung`, image: `/media/${type}.jpg`, ...data },
    sort_order: index,
  };
}

const designHomeSections = PAGE_COMPOSITION_MAPS['schubert-design'].startseite.map((type, index) => section(type, index, index === 0 ? { _localized: { en: { headline: 'Welcome to Schubert' } } } : {}));
const collectionUnits = ['baeder', 'naturstein', 'spas'].map((slug, index) => ({ id: slug, title: slug, text: `${slug} Text`, image: `/collection/${index}.jpg`, href: `/projekte/${slug}`, meta: [] }));

test('page redesign is deterministic, source-lossless and deliberately restrained', () => {
  const first = buildPageComposition(design, page, designHomeSections, collectionUnits);
  const second = buildPageComposition(design, page, first, collectionUnits);
  assert.deepEqual(second, first);
  assert.deepEqual(first.map((entry) => entry.type), PAGE_COMPOSITION_MAPS['schubert-design'].startseite);
  assert.ok(first.every((entry) => !['kineticIdentity', 'materialAtelier', 'editorialCardMorph', 'signaturePath'].includes(entry.type)));
  assert.deepEqual((first[0].data._premiumRedesign as { sourceSections: unknown[] }).sourceSections, designHomeSections);
  assert.equal(((first[0].data._localized as Record<string, Record<string, unknown>>).en).headline, 'Welcome to Schubert');
});

test('raw colors, unavailable media and incomplete CTAs never become visible copy', () => {
  const dead = 'https://cdn.example/manufaktur_001-ZXDYKNe2vW5CYHgWJAJixnkLPob8lV.webp';
  const source = designHomeSections.map((entry) => ({ ...entry, data: { ...entry.data } }));
  const story = source.find((entry) => entry.type === 'textImage')!;
  story.data = { headline: 'Material und Haltung', text: '#D8D0C4', image: dead, primaryCta: { label: '', href: '/kontakt' } };
  const next = buildPageComposition(design, page, source, collectionUnits);
  const visibleStory = next.find((entry) => entry.type === 'textImage')!;
  assert.equal(visibleStory.data.text, undefined);
  assert.equal(visibleStory.data.image, undefined);
  assert.equal(visibleStory.data.primaryCta, undefined);
  assert.deepEqual((next[0].data._premiumRedesign as { sourceSections: unknown[] }).sourceSections, source);
  assert.equal(isCssColorLiteral('rgba(1, 2, 3, .5)'), true);
  assert.deepEqual(sanitizeVisibleContent({ meta: ['Naturstein', '#fff'] }), { meta: ['Naturstein'] });
});

test('real process content is unique and capped at four steps', () => {
  const source = PAGE_COMPOSITION_MAPS['schubert-grabdenkmal'].startseite.map((type, index) => section(type, index, type === 'processSteps' ? {
    steps: Array.from({ length: 5 }, (_, stepIndex) => ({ title: `Schritt ${stepIndex + 1}`, text: `Echte Aufgabe ${stepIndex + 1}` })),
  } : {}));
  const next = buildPageComposition(grab, page, source, collectionUnits);
  const process = next.find((entry) => entry.type === 'processSteps')!;
  assert.equal((process.data.steps as unknown[]).length, 4);
  assert.deepEqual(next.map((entry) => entry.type), PAGE_COMPOSITION_MAPS['schubert-grabdenkmal'].startseite);
});

test('collection details preserve their coherent source model and isolate item media', () => {
  const collection = { id: '30000000-0000-4000-8000-000000000001', key: 'projekte', label: 'Projekte' };
  const sourceSections = [
    { type: 'cinematicHero', data: { headline: 'Einblicke in Bäder', image: '/items/baeder-hero.jpg' } },
    { type: 'portfolioGallery', data: { headline: 'Bad-Projekte', images: [{ src: '/items/baeder-1.jpg', alt: 'Bad 1' }] } },
    { type: 'ctaBand', data: { headline: 'Projekt besprechen', cta: { label: 'Kontakt', href: '#' } } },
  ];
  const item = { id: '40000000-0000-4000-8000-000000000001', collection_id: collection.id, slug: 'baeder', title: 'Bäder', data: { immutableCustomField: { keep: true }, sections: sourceSections }, published: true, priority: 1 };
  const sibling = { ...item, id: '40000000-0000-4000-8000-000000000002', slug: 'naturstein', data: { sections: [{ type: 'cinematicHero', data: { image: '/items/sibling.jpg' } }] } };
  const next = buildItemData(design, collection, item, [item, sibling]);
  assert.deepEqual(next.immutableCustomField, item.data.immutableCustomField);
  assert.deepEqual((next.sections as Array<{ type: string }>).map((entry) => entry.type), ['cinematicHero', 'portfolioGallery', 'ctaBand']);
  assert.doesNotMatch(JSON.stringify(next), /sibling\.jpg/);
  assert.match(JSON.stringify(next), /"href":"\/kontakt"/);
  assert.deepEqual(((next.sections as Array<{ data: Record<string, unknown> }>)[0].data._premiumRedesign as { sourceSections: unknown[] }).sourceSections, sourceSections);
  assert.deepEqual(buildItemData(design, collection, { ...item, data: next }, [item, sibling]), next);
});

test('Grab detail keeps its four-part model while removing visible boilerplate only', () => {
  const collection = { id: '30000000-0000-4000-8000-000000000002', key: 'leistungen', label: 'Leistungen' };
  const repeated = '<p>Eigene, fachliche Beschreibung.</p><p>Im persönlichen Gespräch werden Umfang, technische oder gestalterische Anforderungen und der passende Ablauf geklärt. So entsteht eine Lösung, die fachlich trägt und für Kunden nachvollziehbar bleibt.</p>';
  const sourceSections = [
    { type: 'collectionHero', data: { headline: 'Grabdenkmale', bgImage: '/grab/hero.jpg' } },
    { type: 'textImage', data: { headline: 'Worum es geht', text: repeated, image: '/grab/detail.jpg' } },
    { type: 'processSteps', data: { headline: 'Ablauf', steps: [1, 2, 3].map((value) => ({ title: `Schritt ${value}`, text: `Aufgabe ${value}` })) } },
    { type: 'ctaBand', data: { headline: 'Persönlich besprechen', cta: { label: 'Kontakt', href: '/kontakt' } } },
  ];
  const item = { id: '40000000-0000-4000-8000-000000000003', collection_id: collection.id, slug: 'grabdenkmale', title: 'Grabdenkmale', data: { sections: sourceSections }, published: true, priority: 1 };
  const next = buildItemData(grab, collection, item, [item]);
  const visibleText = ((next.sections as Array<{ type: string; data: Record<string, unknown> }>).find((entry) => entry.type === 'textImage')!.data.text as string);
  assert.equal(visibleText, '<p>Eigene, fachliche Beschreibung.</p>');
  assert.match(JSON.stringify(((next.sections as Array<{ data: Record<string, unknown> }>)[0].data._premiumRedesign)), /Im persönlichen Gespräch/);
});

test('production maps enforce restrained page counts and forbid arbitrary generated paths', () => {
  for (const target of Object.values(REDESIGN_TARGETS)) {
    assert.deepEqual(Object.keys(PAGE_COMPOSITION_MAPS[target.slug]).sort(), [...target.pages].sort());
    assert.deepEqual(Object.keys(COLLECTION_DETAIL_COMPOSITION_MAPS[target.slug]).sort(), [...target.itemSlugs].sort());
    for (const [slug, modules] of Object.entries(PAGE_COMPOSITION_MAPS[target.slug])) {
      if (!['impressum', 'datenschutz'].includes(slug)) assert.ok(modules.length <= 7);
      assert.ok(!modules.some((module) => String(module) === 'kineticIdentity'));
      assert.ok(!modules.some((module) => String(module) === 'editorialCardMorph'));
    }
    for (const modules of Object.values(COLLECTION_DETAIL_COMPOSITION_MAPS[target.slug])) {
      assert.ok(!modules.some((module) => String(module) === 'signaturePath'));
    }
  }
});

test('known failed media is rejected without a network dependency', async () => {
  const url = 'https://cdn.example/manufaktur_001-ZXDYKNe2vW5CYHgWJAJixnkLPob8lV.webp';
  assert.deepEqual([...await findUnavailableSelectedMedia([url])], [url]);
});

test('tenant guards and legacy database fallback remain exact and fail-closed', () => {
  assert.equal(design.id, 'e7b96166-8c3d-4e9b-901a-3c4eadee4673');
  assert.equal(grab.id, 'ff2102e2-f07e-4d44-9046-12c55d78a60d');
  assert.equal(parseArgs([]).legacySharedStandalone, false);
  assert.equal(canUseLegacySharedStandalone({ enabled: true, deploymentMode: 'standalone', error: { code: '42P01' } }), true);
  assert.equal(canUseLegacySharedStandalone({ enabled: true, deploymentMode: 'shared', error: { code: '42P01' } }), false);
  assert.equal(canUseLegacySharedStandalone({ enabled: true, deploymentMode: 'standalone', error: { code: '42501' } }), false);
  assert.equal(canUseLegacySharedRecordFallback({ enabled: true, deploymentMode: 'standalone', recordCount: 0 }), true);
  assert.equal(canUseLegacySharedRecordFallback({ enabled: false, deploymentMode: 'standalone', recordCount: 0 }), false);
  assert.equal(canUseLegacySharedRecordFallback({ enabled: true, deploymentMode: 'standalone', recordCount: 1 }), false);
  assert.equal(canUseLegacySharedRecordFallback({ enabled: true, deploymentMode: 'shared', recordCount: 0 }), false);
  assert.match(REDESIGN_HELP, /PostgreSQL 42P01[\s\S]*no\s+record/i);
});
