/** Offline source, composition, registry, colour, link and media gate. Never opens a database. */
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { resolveSectionDefinition } from '../../apps/renderer/src/templates';
import { getFieldsForSection } from '../../apps/renderer/src/lib/section-color-resolver';
import { FIELD_DEFS } from '../../apps/renderer/src/lib/section-color-fields';
import { composeSeoTitle } from '../../apps/renderer/src/lib/seo-title';
import { parseBusinessProfile } from '../../apps/renderer/src/lib/business-profile';
import { validateAdvancedSectionData } from '../../apps/renderer/src/lib/advanced-section-validation';
import { contrastRatio } from '../../apps/renderer/src/lib/color-validation';

type Row = Record<string, any>;
const newTypes = ['editorialReel', 'imageAtlas', 'perspectiveHero', 'photoChapter', 'topicExplorer', 'editorialBriefing', 'resourceList'];
const publicationTypes = new Set([...newTypes, 'richText', 'ctaBand', 'teamSpotlight', 'timeline', 'contact', 'legalContent']);
const sourceLegalHashes = {
  impressum: 'ac6f041e596a8f5f0660a083822440ba8e2f96a8e0e4948bd9ee44bb2b460cb3',
  datenschutz: '64831de1251d179a92f6bea8d8ceefad1939db77a4885973c8a31fd05affd15a',
};
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const words = (value: string) => value.replace(/<[^>]+>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').trim().split(/\s+/).filter(Boolean);
const normalize = (value: string) => words(value).join(' ').toLocaleLowerCase('de-DE');

async function main() {
  const repository = resolve(__dirname, '../..');
  const { buildHagnContent } = await import('./prepare-content.mjs');
  const { lawyers, practices, staff } = await import('./content.mjs');
  const { pageMetadata } = await import('./page-metadata.mjs');
  const outputDirectory = process.env.HAGN_CONTENT_DIR ? resolve(process.env.HAGN_CONTENT_DIR) : null;
  const content = outputDirectory
    ? JSON.parse(await readFile(resolve(outputDirectory, 'hagn-content.json'), 'utf8'))
    : buildHagnContent();
  const provenance = JSON.parse(await readFile(resolve(repository, 'docs/sites/hagn-partner/MEDIA-PROVENANCE.json'), 'utf8'));
  const sectionsFor = (slug: string): Row[] => {
    const page = content.pages.find((value: Row) => value.slug === slug);
    assert.ok(page, `Missing native page ${slug || '/'}`);
    return content.sections.filter((value: Row) => value.page_id === page.id).sort((a: Row, b: Row) => a.sort_order - b.sort_order);
  };
  let provenanceRasterSidecars = 0;
  for (const item of content.media) {
    const source = provenance.assets.find((asset: Row) => asset.sourceUrl === item.source_url);
    assert.ok(source, `Missing provenance ${item.source_url}`);
    item.size = source.bytes;
    item.metadata = { ...item.metadata, sourceUrl: source.sourceUrl, sha256: source.sha256, credit: source.credit };
  }
  const mediaUrls = new Set(content.media.map((item: Row) => item.url));
  const paths = new Set(content.pages.map((page: Row) => page.slug));
  assert.deepEqual([...paths].sort(), [...pageMetadata.map((page: Row) => page.slug), 'impressum', 'datenschutz'].sort());
  assert.equal(content.pages.length, 24);
  assert.equal(content.seoPages.length, 24);

  let colourChecks = 0;
  for (const section of content.sections) {
    assert.ok(publicationTypes.has(section.type), `Unexpected legacy composition ${section.type}`);
    const definition = resolveSectionDefinition({ type: section.type, industry: 'consulting', definitionKey: section.definition_key, schemaVersion: section.schema_version });
    assert.equal(definition?.key, section.definition_key, `Incorrect section identity ${section.type}`);
    assert.ok(definition?.schemaCompatible, `Incompatible schema ${section.definition_key}`);
    const allowed = new Set(getFieldsForSection(section.type, 'consulting', section.definition_key).map(field => FIELD_DEFS[field].cssVar));
    for (const key of Object.keys(section.style_overrides || {})) {
      assert.ok(allowed.has(key), `Unavailable CMS color role ${section.type}: ${key}`);
      colourChecks += 1;
    }
    if (newTypes.includes(section.type) || section.type === 'teamSpotlight') {
      for (const token of ['--token-section-bg', '--token-heading', '--token-body']) assert.ok(section.style_overrides[token], `Missing seeded role ${section.type}: ${token}`);
      assert.equal(section.spacing_top, 'none', `Double section padding ${section.type}`);
      assert.equal(section.spacing_bottom, 'none', `Double section padding ${section.type}`);
    }
    if (section.type === 'perspectiveHero' && section.data.layout === 'panorama') {
      for (const token of ['--token-image-overlay', '--token-on-dark-heading', '--token-on-dark-body']) assert.ok(section.style_overrides[token], `Missing photographic contrast role ${token}`);
      assert.ok((contrastRatio(section.style_overrides['--token-on-dark-heading'], section.style_overrides['--token-image-overlay']) || 0) >= 7);
    }
    assert.deepEqual(validateAdvancedSectionData(section.type, section.data), [], `Invalid section data: ${section.type}`);
    assert.ok(!section.data.eyebrow && !section.data.badge && !section.data.badgeText, `Redundant above-title label: ${section.type}`);
  }
  for (const seo of content.seoPages) {
    const title = composeSeoTitle({ contentTitle: seo.meta_title, titleTemplate: content.seo.title_template, brandName: content.global.brand.companyName });
    assert.ok(title.length <= 70, `Rendered title too long: ${title.length}, ${title}`);
    assert.ok(seo.meta_description.length >= 70 && seo.meta_description.length <= 170);
    assert.equal(seo.noindex, true);
    assert.equal(new URL(seo.canonical).origin, 'https://flamingo-hagn-partner.vercel.app');
  }
  const walkMedia = (value: unknown): void => {
    if (Array.isArray(value)) value.forEach(walkMedia);
    else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) {
      if (['image', 'secondaryImage', 'imagePrimary', 'logoUrl'].includes(key) && typeof child === 'string' && child) assert.ok(mediaUrls.has(child), `Unregistered image: ${child}`);
      if (['image', 'secondaryImage'].includes(key) && typeof child === 'string' && child) {
        const parent = value as Row;
        assert.ok(parent[key === 'image' ? 'imageAlt' : 'secondaryImageAlt'], `Missing image description ${child}`);
      }
      walkMedia(child);
    }
  };
  walkMedia(content.sections); walkMedia(content.global.brand);
  for (const item of content.media) {
    assert.ok(item.size > 0 && item.metadata.sha256, 'Missing source import facts');
    const actual = await readFile(resolve(repository, 'apps/renderer/public', item.pathname));
    assert.equal(actual.length, item.size);
    assert.equal(createHash('sha256').update(actual).digest('hex'), item.metadata.sha256);
    if (item.mime_type.startsWith('image/')) {
      const sidecar = JSON.parse(await readFile(resolve(repository, 'apps/renderer/public', `${item.pathname}.json`), 'utf8'));
      assert.ok((sidecar.prompt || sidecar.origin || '').includes(item.source_url), `Missing readable source origin ${item.pathname}`);
      provenanceRasterSidecars += 1;
    }
  }

  const anchors = new Map<string, Set<string>>();
  for (const page of content.pages) {
    const pageAnchors = new Set<string>();
    const addAnchor = (id: string) => { if (id) { assert.ok(!pageAnchors.has(id), `Duplicate anchor ${page.slug}#${id}`); pageAnchors.add(id); } };
    for (const section of sectionsFor(page.slug)) {
      addAnchor(section.anchor_id);
      if (section.type === 'resourceList') section.data.groups.forEach((group: Row) => addAnchor(group.id));
    }
    anchors.set(page.slug, pageAnchors);
  }
  let internalLinkChecks = 0;
  const checkHref = (href: string, currentSlug: string): void => {
    assert.ok(/^(?:https?:\/\/|mailto:|tel:|\/|#)/.test(href), `Unsafe or unsupported href ${href}`);
    if (href.startsWith('/hagn-partner/')) assert.ok(mediaUrls.has(href), `Unregistered document ${href}`);
    else if (href.startsWith('#') || href.startsWith('/')) {
      const [path, anchor] = href.split('#');
      const slug = path ? path.slice(1) : currentSlug;
      assert.ok(paths.has(slug), `Missing route ${href}`);
      if (anchor) assert.ok(anchors.get(slug)?.has(anchor), `Missing anchor ${href} on ${currentSlug}`);
      internalLinkChecks += 1;
    }
  };
  const checkLinks = (value: unknown, currentSlug: string): void => {
    if (Array.isArray(value)) value.forEach(child => checkLinks(child, currentSlug));
    else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) {
      if (['href', 'privacyHref'].includes(key) && typeof child === 'string' && child) checkHref(child, currentSlug);
      if (typeof child === 'string' && child.includes('<a ')) for (const match of child.matchAll(/<a\s[^>]*href\s*=\s*(["'])(.*?)\1/gi)) checkHref(match[2], currentSlug);
      checkLinks(child, currentSlug);
    }
  };
  for (const page of content.pages) checkLinks(sectionsFor(page.slug), page.slug);
  checkLinks(content.navigation, ''); checkLinks(content.footer, '');
  for (const practice of practices) assert.ok(anchors.get(practice.slug)?.has('vorbereitung'));
  for (const anchor of ['mandatsbeginn', 'vollmachten', 'erklaerungen', 'hilfen']) assert.ok(anchors.get('service-anwaelte-ingolstadt')?.has(anchor));
  assert.ok(anchors.get('anwalt-ingolstadt')?.has('kosten'));
  assert.ok(anchors.get('kontakt')?.has('anfahrt'));

  const home = sectionsFor('');
  assert.ok(home.length >= 5 && home.length <= 7, 'Home requires an edited photographic chapter structure');
  assert.equal(home[0].type, 'editorialReel');
  assert.equal(home[0].data.layout, 'opening');
  assert.equal(home[0].data.titleAs, 'h1');
  assert.equal(home[0].data.items.length, 3, 'Home requires three distinct visitor chapters');
  assert.ok(home[0].data.items[0].image.endsWith('/kontext/courtyard.webp'), 'Home requires the approved courtyard photograph');
  assert.equal(home[0].data.items[0].imageMobilePosition, '61% center');
  assert.equal(new Set(home[0].data.items.map((item: Row) => item.image)).size, 3, 'Home photography must vary');
  assert.ok(home[0].data.items.every((item: Row) => item.id && item.link?.label && item.link?.href));
  assert.equal(home.filter(section => ['topicExplorer', 'imageAtlas', 'resourceList', 'editorialBriefing'].includes(section.type)).length, 0, 'Home must not repeat the full practice index or marketing lists');
  assert.equal(home.find(section => section.type === 'teamSpotlight')?.data.members.length, 3);
  const practiceIndex = sectionsFor('rechtsgebiete-anwalt-ingolstadt');
  assert.equal(practiceIndex[0].type, 'imageAtlas', 'The practice directory must have its own photographic mosaic opening');
  assert.equal(practiceIndex[0].data.titleAs, 'h1');
  assert.deepEqual(practiceIndex[0].data.items.map((item: Row) => [item.id, item.title, item.link.href]), practices.map(practice => [practice.key, practice.title, `/${practice.slug}`]));
  assert.equal(new Set(practiceIndex[0].data.items.map((item: Row) => item.image)).size, 5);
  assert.equal(practiceIndex.filter(section => ['imageAtlas', 'topicExplorer', 'resourceList'].includes(section.type)).length, 1, 'The directory must present the practice selection only once');
  assert.notEqual(home.map(section => section.type).join('>'), practiceIndex.map(section => section.type).join('>'));
  const signatures = practices.map(practice => sectionsFor(practice.slug).map(section => `${section.type}:${section.data.layout || ''}`).join('>'));
  assert.equal(new Set(signatures).size, 5, 'Practice pages must have distinct compositions');
  const families = new Set(content.pages.map((page: Row) => { const first = sectionsFor(page.slug)[0]; return first.data.layout || first.type; }));
  assert.ok(families.size >= 6, 'Native pages need distinct opening families');
  const directory = sectionsFor('anwaelte-ingolstadt')[0];
  assert.equal(directory.type, 'teamSpotlight');
  assert.equal(directory.data.titleAs, 'h1');
  assert.equal(directory.data.layout, 'contactSheet');
  assert.deepEqual(directory.data.members.map((person: Row) => person.name), lawyers.map(person => person.name));
  const staffDirectory = sectionsFor('ingolstadt-anwaltskanzlei')[0];
  assert.deepEqual(staffDirectory.data.members.map((person: Row) => [person.name, person.phone, person.email]), staff.map(person => [person.name, person.phone, person.email]));
  for (const lawyer of lawyers) {
    const profile = sectionsFor(lawyer.slug);
    const portrait = profile[0].data;
    assert.equal(portrait.layout, 'portrait');
    assert.equal(portrait.headline, lawyer.name);
    assert.ok(portrait.image.endsWith(`/anwaelte/${lawyer.imageKey}.jpg`));
    const sourceContact = profile.find(section => section.anchor_id === 'kontakt')?.data;
    assert.equal(profile.find(section => section.anchor_id === 'kontakt')?.type, 'ctaBand');
    assert.equal(sourceContact.layout, 'plain');
    assert.ok(sourceContact.subline.includes(lawyer.office));
    assert.ok(JSON.stringify(sourceContact).includes(lawyer.phone));
    assert.ok(JSON.stringify(sourceContact).includes(`mailto:${lawyer.email}`));
    assert.equal(sourceContact.ctaPrimary.href, `tel:${lawyer.phone.replace(/[^+\d]/g, '')}`);
    assert.equal(sourceContact.ctaPrimary.iconSuffix, 'Phone');
    assert.equal(sourceContact.ctaSecondary.href, `mailto:${lawyer.email}`);
    assert.equal(sourceContact.ctaSecondary.iconSuffix, 'Mail');
    assert.ok(profile.some(section => section.type === 'richText' && section.data.content.includes('<h3>')), 'Personal biography requires readable substantive prose');
    assert.ok(!profile.some(section => ['resourceList', 'editorialBriefing'].includes(section.type)), 'Profiles must not end in cloned marketing lists');
    assert.ok(JSON.stringify(portrait).includes(lawyer.licensed));
    assert.ok(portrait.meta.includes(lawyer.role), `Professional designation lost: ${lawyer.name}`);
    assert.ok(!JSON.stringify(profile).includes('/kontext/'), `Symbol photograph on personal profile ${lawyer.name}`);
  }
  const service = sectionsFor('service-anwaelte-ingolstadt');
  const resources = service.filter(section => section.type === 'resourceList');
  assert.equal(resources.length, 1, 'All documents must form one coherent grouped list');
  const downloads = resources[0].data.groups.flatMap((group: Row) => group.items.map((item: Row) => item.href));
  const originalDownloads = content.media.filter((item: Row) => item.mime_type === 'application/pdf').map((item: Row) => item.url);
  assert.equal(downloads.length, 9);
  assert.deepEqual([...downloads].sort(), [...originalDownloads].sort());
  assert.ok(!JSON.stringify(content.sections).includes('/kanzlei/telefon.jpg'), 'Repeated stock telephone sections must not return');
  assert.equal(service[0].data.layout, 'compact');
  assert.equal(service[1].data.headline, '', 'The grouped PDF directory must not repeat the opening title');
  assert.equal(service[1].data.intro, '', 'The grouped PDF directory must not repeat the opening introduction');
  assert.ok(sectionsFor('familienrecht-rechtsanwalt-ingolstadt').some(section => section.type === 'photoChapter' && section.data.layout === 'spread'));
  assert.ok(sectionsFor('verkehrsrecht-rechtsanwalt-ingolstadt').some(section => section.type === 'photoChapter' && section.data.layout === 'spread'));
  assert.ok(!sectionsFor('arbeitsrecht-rechtsanwalt-ingolstadt').some(section => section.data.layout === 'sequence'));
  const contactOpening = sectionsFor('kontakt')[0];
  assert.equal(contactOpening.type, 'contact');
  assert.equal(contactOpening.definition_key, 'contact.shared.v1');
  assert.equal(contactOpening.data.titleAs, 'h1');
  assert.equal(contactOpening.data.layout, 'editorial');
  assert.deepEqual(contactOpening.data.infoCards.map((item: Row) => item.icon), ['Phone', 'Mail', 'Clock', 'MapPin']);
  const courtyard = content.media.find((item: Row) => item.pathname.endsWith('/courtyard.webp'));
  assert.equal(courtyard.width, 2400); assert.equal(courtyard.height, 1350);
  assert.equal(courtyard.metadata.creator, 'Miguel Picq');
  const courtyardBytes = await readFile(resolve(repository, 'apps/renderer/public', courtyard.pathname));
  assert.ok(courtyardBytes.includes(Buffer.from('Miguel Picq')), 'Native WebP provenance missing');
  assert.ok(courtyardBytes.includes(Buffer.from('poEga0PVyPs')), 'Native WebP source URL missing');
  for (const [slug, expected] of Object.entries(sourceLegalHashes)) assert.equal(hash(sectionsFor(slug)[0].data), expected, `Legal source changed: ${slug}`);

  // Captions and alternative text describe the subject; production provenance stays in media metadata and legal credits.
  const publicStageDirections = /Originalaufnahme|Originalporträt|Originaldokument|Kanzleibestand|Bildbestand|Symbolbild|bisherigen (?:Kanzlei)?website|keine historischen Dokumente|aktuelle Aufnahmen zeigen|belegten Eckdaten|belegten Stationen/i;
  for (const page of content.pages) {
    if (['impressum', 'datenschutz'].includes(page.slug)) continue;
    for (const section of sectionsFor(page.slug)) assert.ok(!publicStageDirections.test(JSON.stringify(section.data)), `Public stage direction on /${page.slug}: ${section.type}`);
  }
  const listTypes = new Set(['editorialBriefing', 'resourceList', 'topicExplorer']);
  const listSections = content.sections.filter((section: Row) => listTypes.has(section.type));
  assert.ok(listSections.length / content.sections.length < (45 / 82) / 2, 'Marketing list density must be less than half the previous 45/82 proportion');
  assert.ok(listSections.every((section: Row) => section.type === 'resourceList' && section.page_id === content.pages.find((page: Row) => page.slug === 'service-anwaelte-ingolstadt').id || section.type === 'editorialBriefing' && section.anchor_id === 'vorbereitung'), 'Only functional preparation and document lists belong in this composition');

  // Narrative prose must be authored for its page. Short labels, identities and link facts may repeat.
  const paragraphs = new Map<string, Set<string>>();
  const inventory = [];
  for (const page of content.pages) {
    const pageSections = sectionsFor(page.slug);
    const narrative: string[] = [];
    const collect = (value: unknown): void => {
      if (Array.isArray(value)) value.forEach(collect);
      else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) {
        if (typeof child === 'string' && ['text', 'content', 'detail', 'intro', 'subline', 'description'].includes(key)) {
          narrative.push(child);
          const parts = child.includes('<p>') ? [...child.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(match => match[1]) : [child];
          if (!['impressum', 'datenschutz'].includes(page.slug)) for (const part of parts) if (words(part).length >= 28) {
            const key = normalize(part);
            const locations = paragraphs.get(key) || new Set<string>();
            locations.add(page.slug || '/'); paragraphs.set(key, locations);
          }
        } else if (child && typeof child === 'object') collect(child);
      }
    };
    collect(pageSections.map(section => section.data));
    inventory.push({ path: `/${page.slug}`, sections: pageSections.map(section => ({ type: section.type, layout: section.data.layout || null })), narrativeWords: words(narrative.join(' ')).length });
  }
  const duplicates = [...paragraphs].filter(([, locations]) => locations.size > 1).map(([paragraph, locations]) => ({ paragraph, paths: [...locations] }));
  assert.deepEqual(duplicates, [], 'Repeated narrative paragraphs across editorial pages');
  assert.equal(content.global.autoResponse.enabled, false);
  assert.equal(content.global.autoResponse.notificationEmail, 'info@hagn-partner.de');
  assert.equal(content.global.brand.headingFont, 'Manrope');
  assert.equal(content.global.brand.bodyFont, 'Manrope');
  assert.equal(content.global.brand.navMode, 'solid');
  assert.equal(content.global.brand.pageBg, '#FFFFFF');
  assert.ok((contrastRatio(content.global.brand.navLinkColor, content.global.brand.navBgColor) || 0) >= 7);
  assert.equal(parseBusinessProfile(content.global.businessProfile).success, true, 'Business profile must open in its CMS editor');

  const report = { offline: true, pages: content.pages.length, editorialPages: 22, registrySections: content.sections.length, openingFamilies: families.size, distinctPracticeCompositions: 5, colourChecks, internalLinkChecks, renderedSeoTitles: content.seoPages.length, internalMedia: content.media.length, provenanceRasterSidecars, originalLawyers: lawyers.length, originalStaff: staff.length, originalPdfs: downloads.length, unchangedLegalHashes: sourceLegalHashes, repeatedNarrativeParagraphs: duplicates.length, listComposition: { before: { sections: 45, total: 82 }, after: { sections: listSections.length, total: content.sections.length }, ratio: listSections.length / content.sections.length }, inventory, allPassed: true };
  if (outputDirectory) await writeFile(resolve(outputDirectory, 'source-gate.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ ...report, inventory: undefined }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
