import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateContentQuality, type ContentQualityInput, type SiteProfile } from './content-quality';

const profile: SiteProfile = {
  schemaVersion: '1.0',
  identity: {
    businessName: 'Werkstatt Nord',
    locations: [{ city: 'Hamburg', address: 'Marktstraße 1, 20357 Hamburg' }],
    serviceAreas: ['Hamburg'],
  },
  audience: {
    primary: 'Eigentümerinnen und Eigentümer von Altbauten in Hamburg',
    needs: ['verlässliche Planung', 'klare Kosten'],
    objections: ['unklare Bauzeit'],
  },
  goals: { primary: 'Qualifizierte Projektanfragen', conversions: ['Kontaktanfrage'] },
  offers: [{
    name: 'Badmodernisierung', outcome: 'Ein bezugsfertiges Bad',
    ctaLabel: 'Badprojekt besprechen', ctaHref: '/kontakt',
  }],
  voice: { attributes: ['präzise', 'ruhig'], avoid: ['Superlative'] },
  facts: { approvedClaims: [], prohibitedClaims: [], unknowns: [] },
};

function validInput(): ContentQualityInput {
  return {
    siteProfile: profile,
    brand: { companyName: 'Werkstatt Nord' },
    contact: { address: 'Marktstraße 1, 20357 Hamburg' },
    seoGlobal: { defaultTitle: 'Werkstatt Nord Hamburg' },
    navigation: { items: [{ label: 'Kontakt', href: '/kontakt' }] },
    footer: { legalLinks: [{ label: 'Kontakt', href: '/kontakt' }] },
    allowedSectionTypes: ['hero', 'contact'],
    sectionSchemas: {
      hero: { fields: { headline: 'string', subline: 'string?', primaryCta: '{ label: string, href: string }?' } },
      contact: { fields: { headline: 'string' } },
    },
    pages: [
      {
        slug: 'startseite', title: 'Startseite', purpose: 'Das Angebot einordnen und zur qualifizierten Anfrage führen.',
        seo: {
          metaTitle: 'Badmodernisierung für Altbauten in Hamburg',
          metaDescription: 'Werkstatt Nord plant und modernisiert Bäder in Hamburger Altbauten mit klaren Kosten, festen Abläufen und persönlicher Projektleitung.',
        },
        sections: [{ type: 'hero', purpose: 'Angebot klären', data: {
          headline: 'Bäder, die zum Altbau und zum Alltag passen',
          subline: 'Planung, Gewerke und Abnahme aus einer Hand – mit klaren Kosten und festen Ansprechpartnern.',
          primaryCta: { label: 'Badprojekt besprechen', href: '/kontakt' },
        } }],
      },
      {
        slug: 'kontakt', title: 'Kontakt', purpose: 'Projektinformationen strukturiert aufnehmen.',
        seo: {
          metaTitle: 'Badprojekt in Hamburg besprechen',
          metaDescription: 'Senden Sie Eckdaten zu Raum, Zeitplan und Budget. Werkstatt Nord antwortet mit Rückfragen und einem klaren nächsten Planungsschritt.',
        },
        sections: [{ type: 'contact', data: { headline: 'Erzählen Sie uns von Raum, Zeitplan und Budget' } }],
      },
    ],
  };
}

describe('content quality validator', () => {
  it('supports a profile-only gate before page planning', () => {
    const result = validateContentQuality({
      mode: 'profile',
      siteProfile: profile,
      contact: { address: 'Marktstraße 1, 20357 Hamburg' },
      pages: [],
    });
    assert.equal(result.valid, true, JSON.stringify(result.issues, null, 2));
  });

  it('accepts a complete deterministic plan without errors', () => {
    const result = validateContentQuality(validInput());
    assert.equal(result.summary.errors, 0, JSON.stringify(result.issues, null, 2));
  });

  it('returns repairable issues for weak-model failure modes', () => {
    const input = validInput();
    input.pages[0].sections[0].data = {
      headline: 'Willkommen bei Ihrem zuverlässigen Partner',
      primaryCta: { label: 'Hier klicken', href: '#' },
      image: 'https://images.example.test/shared.jpg',
    };
    input.pages[0].seo = { metaTitle: 'Startseite', metaDescription: 'Kurz.' };
    input.navigation = { items: [{ label: 'Fehlt', href: '/nicht-geplant' }] };
    input.seoGlobal = { defaultTitle: 'Werkstatt Nord Köln' };

    const result = validateContentQuality(input);
    const codes = new Set(result.issues.map(entry => entry.code));
    assert.ok(codes.has('copy.generic'));
    assert.ok(codes.has('link.placeholder'));
    assert.ok(codes.has('link.unknown_internal_route'));
    assert.ok(codes.has('seo.title_generic'));
    assert.ok(codes.has('identity.unapproved_location'));
    assert.ok(result.issues.every(entry => entry.repair.instruction && entry.repair.acceptance));
  });

  it('returns repair issues instead of throwing on malformed profile arrays', () => {
    const input = validInput();
    input.siteProfile = {
      ...profile,
      identity: {
        ...profile.identity,
        locations: 'Berlin' as unknown as SiteProfile['identity']['locations'],
        serviceAreas: { city: 'München' } as unknown as string[],
      },
    };

    const result = validateContentQuality(input);
    assert.equal(result.valid, false);
    assert.ok(result.issues.some(entry => entry.location === 'siteProfile.identity.locations'));
  });

  it('is total for malformed page and section entries', () => {
    const malformedPages = validInput();
    malformedPages.pages = [null as unknown as ContentQualityInput['pages'][number]];
    const pageResult = validateContentQuality(malformedPages);
    assert.ok(pageResult.issues.some(entry => entry.code === 'plan.page_invalid'));

    const malformedSections = validInput();
    malformedSections.pages[0].sections = [null as unknown as ContentQualityInput['pages'][number]['sections'][number]];
    const sectionResult = validateContentQuality(malformedSections);
    assert.ok(sectionResult.issues.some(entry => entry.code === 'plan.section_invalid'));
  });

  it('preflights nested Advanced media contracts for weak models', () => {
    const input = validInput();
    input.allowedSectionTypes = [...(input.allowedSectionTypes || []), 'xrayReveal'];
    input.sectionSchemas = {
      ...input.sectionSchemas,
      xrayReveal: { fields: { headline: 'string', imageBase: 'url', imageReveal: 'url' } },
    };
    input.pages[0].sections = [{
      type: 'xrayReveal',
      purpose: 'Den Aufbau eines Projektergebnisses erklären.',
      data: { headline: 'Was unter der Oberfläche den Unterschied macht', imageBase: '/result.jpg' },
    }];

    const result = validateContentQuality(input);
    const issue = result.issues.find(entry => entry.location === 'pages[0].sections[0].data.imageReveal');
    assert.equal(issue?.code, 'plan.advanced_section_invalid');
    assert.match(issue?.repair.instruction || '', /exact same crop/);
  });

  it('detects duplicate image and cross-tenant phrase drift', () => {
    const input = validInput();
    const phrase = 'Wir planen jeden Schritt mit klaren Kosten, fester Verantwortung und einer dokumentierten Abnahme vor Ort.';
    input.pages[0].sections[0].data = {
      ...input.pages[0].sections[0].data,
      text: phrase,
      image: 'https://images.example.test/shared.jpg?w=1000',
      imageAlt: 'Projektansicht eines modernisierten Badezimmers',
      cards: [
        { image: 'https://images.example.test/shared.jpg?w=800', imageAlt: 'Detailansicht des Badezimmers' },
        { image: 'https://images.example.test/shared.jpg?w=600', imageAlt: 'Waschtisch im modernisierten Badezimmer' },
        { title: 'Ablauf' },
      ],
    };
    input.referenceCorpus = [{
      tenantKey: 'andere-demo',
      phrases: [phrase],
      images: ['https://images.example.test/shared.jpg'],
    }];

    const result = validateContentQuality(input);
    const codes = new Set(result.issues.map(entry => entry.code));
    assert.ok(codes.has('image.reused'));
    assert.ok(codes.has('drift.cross_tenant_phrase'));
    assert.ok(codes.has('drift.cross_tenant_image'));
  });
});
