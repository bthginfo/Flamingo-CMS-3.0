import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { SECTION_PREVIEW_DATA } from './section-preview-data';
import { getDemoSiteData } from '../app/demo/demo-data';
import { eishockeySite } from '../app/demo/pages/eishockey';

function collectHrefs(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) {
    value.forEach(entry => collectHrefs(entry, out));
    return out;
  }
  if (!value || typeof value !== 'object') return out;
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (key.toLowerCase().endsWith('href') && typeof entry === 'string') out.push(entry);
    else collectHrefs(entry, out);
  }
  return out;
}

function collectCtaLabels(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) {
    value.forEach(entry => collectCtaLabels(entry, out));
    return out;
  }
  if (!value || typeof value !== 'object') return out;
  const record = value as Record<string, unknown>;
  if (typeof record.label === 'string' && typeof record.href === 'string') out.push(record.label);
  Object.values(record).forEach(entry => collectCtaLabels(entry, out));
  return out;
}

describe('demo content integrity', () => {
  it('keeps venueInfo preview contact renderable', () => {
    assert.equal(typeof SECTION_PREVIEW_DATA.venueInfo.contact, 'string');
    assert.notEqual(SECTION_PREVIEW_DATA.venueInfo.contact, '');
  });

  it('has no placeholder links in the eishockey showcase', () => {
    const hrefs = [
      ...collectHrefs(eishockeySite),
      ...collectHrefs(getDemoSiteData('eishockey')),
    ];
    assert.ok(hrefs.length > 0);
    assert.deepEqual(hrefs.filter(href => href === '#'), []);
    assert.ok(eishockeySite.pages.some(page => page.slug === 'impressum'));
    assert.ok(eishockeySite.pages.some(page => page.slug === 'datenschutz'));
  });

  it('varies live eishockey page closers and action labels', () => {
    const sourcePath = fileURLToPath(new URL('../../../../scripts/demo-tenants/eishockey.cjs', import.meta.url));
    const config = createRequire(import.meta.url)(sourcePath) as {
      pages: Array<{ slug: string; sections: Array<{ type: string; data: Record<string, unknown> }> }>;
    };
    const showcaseSlugs = new Set(['startseite', 'spielplan', 'kader', 'verein', 'sponsoren']);
    const showcasePages = config.pages.filter(page => showcaseSlugs.has(page.slug));
    const closers = showcasePages.map(page => page.sections.at(-1)?.type);
    assert.equal(showcasePages.length, 5);
    assert.ok(new Set(closers).size >= 3);

    const labels = collectCtaLabels(showcasePages);
    const counts = labels.reduce((result, label) => result.set(label, (result.get(label) || 0) + 1), new Map<string, number>());
    assert.ok(Math.max(...counts.values()) < 5);
    assert.equal(counts.get('Tickets & Termine') || 0, 0);
  });

  it('uses one identity and city in the repaired demo manifests', () => {
    const florist = getDemoSiteData('florist');
    assert.equal(florist.brand.companyName, 'Blütenwerk Atelier');
    assert.match(florist.contact.address || '', /München/);

    const fitness = getDemoSiteData('fitness');
    assert.equal(fitness.brand.companyName, 'Pulse Studio');
    assert.match(fitness.contact.address || '', /München/);

    const location = getDemoSiteData('location');
    assert.match(location.contact.address || '', /Ingolstadt/);
    assert.match(location.contact.phone || '', /^\+49 841/);
  });

  it('keeps visible tourism copy in German while route slugs stay ASCII', () => {
    const sourcePath = fileURLToPath(new URL('../../../../scripts/demo-tenants/tourismus.cjs', import.meta.url));
    const source = readFileSync(sourcePath, 'utf8');
    const withoutRouteLiterals = source.replace(/\b(?:slug|href):\s*'[^']*'/g, '');
    const bannedVisibleWords = /\b(?:fuer|Fuer|Gaeste|Koennen|koennen|pruefen|Rueckweg|OePNV|Fruehjahr|Ueber|schoen|moeglich|Datenschutzerklaerung)\b/;
    assert.doesNotMatch(withoutRouteLiterals, bannedVisibleWords);

    const slugs = [...source.matchAll(/\bslug:\s*'([^']+)'/g)].map(match => match[1]);
    assert.ok(slugs.length > 0);
    assert.ok(slugs.every(slug => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)));
  });
});
