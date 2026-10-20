import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeSectionData } from './api-utils';
import { getCatalogSectionSchemas } from './section-data-schemas';

const cta = { label: 'Kontakt aufnehmen', href: '/kontakt#anfrage', iconPrefix: 'Phone', iconSuffix: '' };

test('canonical cta sections round-trip without derived primaryCta or secondaryCta fields', () => {
  const schemas = getCatalogSectionSchemas('__all__') as Record<string, { fields: Record<string, unknown> }>;
  const types = Object.entries(schemas)
    .filter(([, schema]) => Object.hasOwn(schema.fields, 'cta') && !Object.hasOwn(schema.fields, 'primaryCta'))
    .map(([type]) => type);
  for (const type of ['editorialReel', 'imageAtlas', 'photoChapter', 'editorialBriefing', 'teamSpotlight', 'signaturePath', 'portfolioGallery']) {
    assert.ok(types.includes(type), `${type} must be covered by the declared canonical cta fields`);
  }
  for (const type of types) {
    const original = {
      headline: 'Eine klare Perspektive.',
      cta,
      ...(['editorialReel', 'imageAtlas'].includes(type) ? {
        items: [{ id: 'eins', title: 'Erster Schritt', link: { label: 'Unterlagen', href: '/media/hinweise.pdf', iconSuffix: 'Download' } }],
      } : {}),
    };
    const untouched = structuredClone(original);
    for (const options of [{}, { sanitize: false }]) {
      const normalized = normalizeSectionData(type, original, options);
      assert.deepEqual(normalized, original, `${type} must preserve its exact canonical data`);
      assert.deepEqual(normalizeSectionData(type, normalized, options), original, `${type} must remain idempotent`);
    }
    assert.deepEqual(original, untouched, `${type} must not mutate the caller's data`);
  }
});

test('CTA alias scoping preserves explicit extra input without creating unsupported targets', () => {
  for (const type of ['editorialReel', 'imageAtlas', 'photoChapter', 'editorialBriefing', 'teamSpotlight']) {
    const aliases = { cta, button: { label: 'Extra', href: '/extra' }, primaryButton: cta, secondaryButton: cta, ctaLabel: 'Separat', ctaHref: '/separat' };
    assert.deepEqual(normalizeSectionData(type, aliases), aliases, `${type} must not derive unused CTA targets`);

    const explicit = { ...aliases, primaryCta: { label: 'Legacy', href: '/legacy' }, secondaryCta: null, customMetadata: { source: 'authored' } };
    assert.deepEqual(normalizeSectionData(type, explicit), explicit, `${type} must retain explicitly supplied unknown fields`);
  }
  const contactBand = { layout: 'plain', headline: 'Direkter Kontakt', ctaPrimary: cta, ctaSecondary: { label: 'E-Mail', href: 'mailto:kanzlei@example.de', iconSuffix: 'Mail' } };
  assert.deepEqual(normalizeSectionData('ctaBand', contactBand), contactBand);
  assert.deepEqual(normalizeSectionData('unregisteredType', { cta, secondaryButton: cta }), { cta, secondaryButton: cta });
});

test('declared primary and secondary CTA contracts retain legacy hero and non-hero aliases', () => {
  for (const type of ['hero', 'collectionHero', 'cinematicHero', 'perspectiveHero', 'editorialHero', 'ctaSplit', 'textImage', 'noticeBanner']) {
    for (const alias of ['cta', 'button', 'primaryButton']) {
      const input = { [alias]: cta, secondaryButton: { label: 'Mehr erfahren', href: '/mehr', iconSuffix: 'ArrowUpRight' } };
      const normalized = normalizeSectionData(type, input);
      assert.deepEqual(normalized, { ...input, primaryCta: cta, secondaryCta: input.secondaryButton }, `${type}.${alias} must keep its legacy mapping`);
      assert.deepEqual(normalizeSectionData(type, normalized), normalized);
    }
    const explicit = { primaryCta: { label: 'Vorrang', href: '/vorrang' }, secondaryCta: { label: 'Vorhanden', href: '/vorhanden' }, cta, secondaryButton: cta };
    assert.deepEqual(normalizeSectionData(type, explicit), explicit, `${type} canonical values must win over aliases`);
  }
});

test('flat CTA aliases are synthesized only for sections that declare primaryCta', () => {
  assert.deepEqual(normalizeSectionData('hero', { ctaLabel: 'Anrufen', ctaHref: 'tel:+498411234' }), {
    ctaLabel: 'Anrufen', ctaHref: 'tel:+498411234', primaryCta: { label: 'Anrufen', href: 'tel:+498411234' },
  });
  assert.deepEqual(normalizeSectionData('hero', { ctaLabel: 'Anfragen' }).primaryCta, { label: 'Anfragen', href: '/kontakt' });
  assert.deepEqual(normalizeSectionData('collectionHero', { ctaHref: '/kontakt' }).primaryCta, { label: 'Kontakt aufnehmen', href: '/kontakt' });
  for (const type of ['servicesGrid', 'bookingWidget', 'featureShowcase', 'ctaBand']) {
    const input = { ctaLabel: 'Termin abstimmen', ctaHref: '/kontakt' };
    const expected = type === 'servicesGrid' ? { ...input, source: 'manual' } : input;
    assert.deepEqual(normalizeSectionData(type, input), expected, `${type} must retain its declared CTA representation`);
  }
});
