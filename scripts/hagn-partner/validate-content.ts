/** Bounded, offline integration gate: actual registry, colour roles and SEO. */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { resolveSectionDefinition } from '../../apps/renderer/src/templates';
import { getFieldsForSection } from '../../apps/renderer/src/lib/section-color-resolver';
import { FIELD_DEFS } from '../../apps/renderer/src/lib/section-color-fields';
import { composeSeoTitle } from '../../apps/renderer/src/lib/seo-title';
import { parseBusinessProfile } from '../../apps/renderer/src/lib/business-profile';
import { validateAdvancedSectionData } from '../../apps/renderer/src/lib/advanced-section-validation';
import { createHash } from 'node:crypto';
import { contrastRatio } from '../../apps/renderer/src/lib/color-validation';

async function main() {
const repository = resolve(__dirname, '../..');
const { buildHagnContent } = await import('./prepare-content.mjs');
const content = process.env.HAGN_CONTENT_DIR
  ? JSON.parse(await readFile(resolve(process.env.HAGN_CONTENT_DIR, 'hagn-content.json'), 'utf8'))
  : buildHagnContent();
const provenance = JSON.parse(await readFile(resolve(repository, 'docs/sites/hagn-partner/MEDIA-PROVENANCE.json'), 'utf8'));
for (const item of content.media) {
  const source = provenance.assets.find((asset: { sourceUrl: string }) => asset.sourceUrl === item.source_url);
  if (source) {
    item.size = source.bytes;
    item.metadata = { ...item.metadata, sourceUrl: source.sourceUrl, sha256: source.sha256, credit: source.credit };
  }
}
const mediaUrls = new Set(content.media.map((item: { url: string }) => item.url));
let colourChecks = 0;
for (const section of content.sections) {
  const definition = resolveSectionDefinition({ type: section.type, industry: 'consulting', definitionKey: section.definition_key, schemaVersion: section.schema_version });
  assert.equal(definition?.key, section.definition_key, `Incorrect section identity ${section.type}`);
  assert.ok(definition?.schemaCompatible);
  const allowed = new Set(getFieldsForSection(section.type, 'consulting', section.definition_key).map(field => FIELD_DEFS[field].cssVar));
  for (const key of Object.keys(section.style_overrides || {})) {
    assert.ok(allowed.has(key), `Unavailable CMS color role ${section.type}: ${key}`);
    colourChecks += 1;
  }
  assert.deepEqual(validateAdvancedSectionData(section.type, section.data), [], `Invalid advanced section: ${section.type}`);
  if (section.type === 'editorialHero') assert.notEqual(section.data.layout, 'correspondence');
  if (['scrollStory', 'signaturePath', 'guidedChoice'].includes(section.type)) assert.equal(section.data.showKickers, false);
  if (section.type === 'faqContactSplit') assert.equal(section.data.showNumbers, false);
  if (section.type === 'signaturePath') for (const item of section.data.items) if (item.href) assert.ok(item.ctaLabel, 'Path actions need an authored label');
}
for (const seo of content.seoPages) {
  const title = composeSeoTitle({ contentTitle: seo.meta_title, titleTemplate: content.seo.title_template, brandName: content.global.brand.companyName });
  assert.ok(title.length <= 70, `Rendered title too long: ${title.length}, ${title}`);
  assert.ok(seo.meta_description.length >= 70 && seo.meta_description.length <= 170);
  assert.equal(seo.noindex, true);
  assert.equal(new URL(seo.canonical).origin, 'https://flamingo-hagn-partner.vercel.app');
}
const walk = (value: unknown): void => {
  if (Array.isArray(value)) value.forEach(walk);
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) {
    if (['image', 'imagePrimary', 'logoUrl'].includes(key) && typeof child === 'string' && child) assert.ok(mediaUrls.has(child), `Unregistered image: ${child}`);
    walk(child);
  }
};
walk(content.sections); walk(content.global.brand);
for (const item of content.media) {
  assert.ok(item.size > 0 && item.metadata.sha256, 'Missing source import facts');
  const actual = await readFile(resolve(repository, 'apps/renderer/public', item.pathname));
  assert.equal(actual.length, item.size);
  assert.equal(createHash('sha256').update(actual).digest('hex'), item.metadata.sha256);
}
const types = new Set(content.sections.map((section: { type: string }) => section.type));
assert.ok(types.size >= 12, 'The edition must retain meaningful section variety');
const families = new Set(content.pages.map((page: { id: string }) => {
  const opening = content.sections.find((section: { page_id: string }) => section.page_id === page.id);
  return opening.data.layout || opening.type;
}));
assert.ok(families.size >= 5, 'Main pages need genuinely different openings');
const paths = new Set(content.pages.map((page: { slug: string }) => page.slug));
const checkLinks = (value: unknown, currentSlug: string): void => {
  if (Array.isArray(value)) value.forEach(child => checkLinks(child, currentSlug));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) {
    if (key === 'href' && typeof child === 'string' && (child.startsWith('#') || child.startsWith('/') && !child.startsWith('/hagn-partner/'))) {
      const [path, anchor] = child.split('#');
      const slug = path ? path.slice(1) : currentSlug;
      assert.ok(paths.has(slug), `Missing route ${child}`);
      if (anchor) {
        const page = content.pages.find((item: { slug: string }) => item.slug === slug);
        assert.ok(content.sections.some((section: { page_id: string; anchor_id: string }) => section.page_id === page.id && section.anchor_id === anchor), `Missing anchor ${child} on ${currentSlug}`);
      }
    }
    checkLinks(child, currentSlug);
  }
};
for (const page of content.pages) checkLinks(content.sections.filter((section: { page_id: string }) => section.page_id === page.id), page.slug);
assert.equal(content.global.autoResponse.enabled, false);
assert.equal(content.global.brand.navMode, 'solid');
assert.ok((contrastRatio(content.global.brand.navLinkColor, content.global.brand.navBgColor) || 0) >= 4.5);
assert.equal(parseBusinessProfile(content.global.businessProfile).success, true, 'Business profile must open correctly in its actual CMS editor');
assert.equal(content.global.autoResponse.notificationEmail, 'info@hagn-partner.de');
console.log(JSON.stringify({ offline: true, pages: content.pages.length, registrySections: content.sections.length, colourChecks, renderedSeoTitles: content.seoPages.length, internalMedia: content.media.length, allPassed: true }));
// This script intentionally runs as CommonJS through the repo's TSX loader.
}
main().catch(error => { console.error(error); process.exitCode = 1; });
