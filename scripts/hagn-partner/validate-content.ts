/** Bounded, offline integration gate: actual registry, colour roles and SEO. */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { resolveSectionDefinition } from '../../apps/renderer/src/templates';
import { getFieldsForSection } from '../../apps/renderer/src/lib/section-color-resolver';
import { FIELD_DEFS } from '../../apps/renderer/src/lib/section-color-fields';
import { composeSeoTitle } from '../../apps/renderer/src/lib/seo-title';
import { parseBusinessProfile } from '../../apps/renderer/src/lib/business-profile';

async function main() {
const repository = resolve(__dirname, '../..');
const content = JSON.parse(await readFile(resolve(repository, 'tmp/hagn-partner-2026-10-19/hagn-content.json'), 'utf8'));
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
  if (section.type === 'editorialHero') assert.equal(section.data.layout, 'correspondence');
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
}
assert.equal(content.global.autoResponse.enabled, false);
assert.equal(parseBusinessProfile(content.global.businessProfile).success, true, 'Business profile must open correctly in its actual CMS editor');
assert.equal(content.global.autoResponse.notificationEmail, 'info@hagn-partner.de');
console.log(JSON.stringify({ offline: true, pages: content.pages.length, registrySections: content.sections.length, colourChecks, renderedSeoTitles: content.seoPages.length, internalMedia: content.media.length, allPassed: true }));
// This script intentionally runs as CommonJS through the repo's TSX loader.
}
main().catch(error => { console.error(error); process.exitCode = 1; });
