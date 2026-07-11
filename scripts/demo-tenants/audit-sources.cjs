#!/usr/bin/env node
'use strict';

/**
 * Read-only integrity audit for the 18 authoritative population sources and
 * their public renderer URL-key mapping. Legacy TypeScript fallback pages are
 * intentionally outside this audit and must be generated/reconciled separately.
 *
 * The four legacy MJS files are evaluated in an isolated VM after replacing
 * their final main() call with a data export. fetch() is disabled, so this
 * script cannot write to the content API or database.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..', '..');

const SOURCES = [
  { key: 'handwerk', urlKey: 'handwerk', kind: 'cjs', file: 'scripts/demo-tenants/handwerk.cjs', brand: 'Brüggemann Bäder & Wärme', city: 'Düsseldorf' },
  { key: 'hotel', urlKey: 'hotel', kind: 'cjs', file: 'scripts/demo-tenants/hotel.cjs', brand: 'Alpenglow Resort & Spa', city: 'Seefeld' },
  { key: 'restaurant', urlKey: 'restaurant', kind: 'cjs', file: 'scripts/demo-tenants/restaurant.cjs', brand: 'Salzkorn', city: 'Hamburg' },
  { key: 'medical', urlKey: 'medical', kind: 'cjs', file: 'scripts/demo-tenants/medical.cjs', brand: 'Praxis am Stadtgarten', city: 'Stuttgart' },
  { key: 'salon', urlKey: 'salon', kind: 'cjs', file: 'scripts/demo-tenants/salon.cjs', brand: 'Atelier Isabelle', city: 'München' },
  { key: 'tourism', urlKey: 'tourism', kind: 'cjs', file: 'scripts/demo-tenants/tourismus.cjs', brand: 'Karwendel Kompass', city: 'Mittenwald' },
  { key: 'wedding', urlKey: 'wedding', kind: 'cjs', file: 'scripts/demo-tenants/wedding.cjs', brand: 'Mara & Elias', city: 'Starnberg' },
  { key: 'photography', urlKey: 'photography', kind: 'cjs', file: 'scripts/demo-tenants/photography.cjs', brand: 'Lisa Morgenthaler Fotografie', city: 'Frankfurt' },
  { key: 'consulting', urlKey: 'consulting', kind: 'legacy', file: 'scripts/populate-consulting-bergmann.mjs', tokenEnv: 'FLM_CONSULTING_TOKEN', brand: 'Bergmann & Partner Beratung', city: 'München', collections: { leistungen: 'services', referenzen: 'cases', news: 'newsItems' } },
  { key: 'realestate', urlKey: 'realestate', kind: 'cjs', file: 'scripts/demo-tenants/realestate.cjs', brand: 'Stadtkante Immobilien', city: 'Nürnberg' },
  { key: 'cafe', urlKey: 'cafe', kind: 'cjs', file: 'scripts/demo-tenants/cafe.cjs', brand: 'SPIRAL Coffee & Plants', city: 'Innsbruck' },
  { key: 'tattoo', urlKey: 'tattoo', kind: 'cjs', file: 'scripts/demo-tenants/tattoo.cjs', brand: 'INK DISTRICT', city: 'Berlin' },
  { key: 'ecommerce', urlKey: 'shop', kind: 'cjs', file: 'scripts/demo-tenants/ecommerce.cjs', brand: 'Vinothek Goldberg', city: 'München' },
  { key: 'retail', urlKey: 'retail', kind: 'cjs', file: 'scripts/demo-tenants/retail.cjs', brand: 'Möbelhaus Lichtblick', city: 'Regensburg' },
  { key: 'florist', urlKey: 'florist', kind: 'legacy', file: 'scripts/populate-florist-bluetenwerk.mjs', tokenEnv: 'FLM_FLORIST_TOKEN', brand: 'Blütenwerk Atelier', city: 'München', collections: { straeusse: 'bouquets', workshops: 'workshops', news: 'newsItems' } },
  { key: 'fitness', urlKey: 'fitness', kind: 'legacy', file: 'scripts/populate-fitness-pulse.mjs', tokenEnv: 'FLM_FITNESS_TOKEN', brand: 'Pulse Studio', city: 'München', collections: { programme: 'programs', news: 'newsItems' } },
  { key: 'location', urlKey: 'location', kind: 'legacy', file: 'scripts/populate-location-lichtwerk.mjs', tokenEnv: 'FLM_LOCATION_TOKEN', brand: 'Lichtwerk Loft', city: 'Ingolstadt', collections: { raeume: 'spaces', news: 'newsItems' } },
  { key: 'eishockey', urlKey: 'eishockey', kind: 'cjs', file: 'scripts/demo-tenants/eishockey.cjs', brand: 'EHC Donau Panther', city: 'Ingolstadt' },
];

function loadLegacy(source) {
  const filePath = path.join(ROOT, source.file);
  const collectionEntries = Object.entries(source.collections)
    .map(([key, variable]) => `{ key: ${JSON.stringify(key)}, items: ${variable} }`)
    .join(', ');
  const exportCode = `globalThis.__demoAudit = { pages, navItems, phone, email, address, collections: [${collectionEntries}] };`;
  const original = fs.readFileSync(filePath, 'utf8');
  const executable = original.replace(/main\(\)\.catch\([\s\S]*?\);\s*$/, exportCode);
  if (executable === original) throw new Error(`${source.file}: final main() call was not isolated.`);

  const sandbox = {
    process: { env: { [source.tokenEnv]: 'read-only-audit' } },
    crypto: crypto.webcrypto,
    console: { log() {}, error() {} },
    fetch() { throw new Error('Network access is disabled during source audit.'); },
  };
  vm.createContext(sandbox);
  new vm.Script(executable, { filename: filePath }).runInContext(sandbox, { timeout: 5_000 });
  return sandbox.__demoAudit;
}

function loadSource(source) {
  if (source.kind === 'legacy') return loadLegacy(source);
  return require(path.join(ROOT, source.file));
}

function collectHrefs(value, at = '', out = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectHrefs(entry, `${at}[${index}]`, out));
    return out;
  }
  if (!value || typeof value !== 'object') return out;
  for (const [key, entry] of Object.entries(value)) {
    const childPath = at ? `${at}.${key}` : key;
    if (key.toLowerCase().endsWith('href') && typeof entry === 'string') out.push({ path: childPath, href: entry });
    else collectHrefs(entry, childPath, out);
  }
  return out;
}

function collectVisibleStrings(value, key = '', out = []) {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectVisibleStrings(entry, key, out));
    return out;
  }
  if (!value || typeof value !== 'object') return out;
  for (const [childKey, entry] of Object.entries(value)) {
    if (typeof entry === 'string') {
      if (!/(?:href|url|slug|image|embed|ogImage|email|phone|token|pat|secret|key)$/i.test(childKey)) out.push(entry);
    } else collectVisibleStrings(entry, childKey, out);
  }
  return out;
}

function collectPersonImages(value, out = []) {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectPersonImages(entry, out));
    return out;
  }
  if (!value || typeof value !== 'object') return out;
  if (
    typeof value.name === 'string'
    && (value.role || value.position || value.bio)
    && typeof value.image === 'string'
  ) {
    const photoId = value.image.match(/images\.unsplash\.com\/photo-([^?]+)/)?.[1];
    if (photoId) out.push({ name: value.name, photoId });
  }
  Object.values(value).forEach((entry) => collectPersonImages(entry, out));
  return out;
}

function normalized(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('de');
}

function basePath(href) {
  const [withoutHash] = href.split('#');
  return (withoutHash.split('?')[0] || '/').replace(/\/$/, '') || '/';
}

function auditSource(source, data) {
  const issues = [];
  const sourceText = fs.readFileSync(path.join(ROOT, source.file), 'utf8');
  const pages = data.pages || [];
  const collections = data.collections || [];
  const pagePaths = new Map([['/', pages.find((page) => ['', 'home', 'startseite'].includes(page.slug))]]);
  for (const page of pages) pagePaths.set(`/${page.slug}`.replace(/\/$/, '') || '/', page);
  const collectionPaths = new Set();
  for (const collection of collections) {
    for (const item of collection.items || []) collectionPaths.add(`/c/${collection.key}/${item.slug}`);
  }

  if (pages.length === 0) issues.push('has no pages');
  const seenSlugs = new Set();
  const seenTitles = new Set();
  const seenDescriptions = new Set();
  for (const page of pages) {
    const label = page.slug || '(home)';
    if (seenSlugs.has(page.slug)) issues.push(`${label}: duplicate slug`);
    seenSlugs.add(page.slug);
    if (!page.title?.trim()) issues.push(`${label}: missing page title`);
    if (!Array.isArray(page.sections) || page.sections.length === 0) issues.push(`${label}: missing sections`);

    const title = normalized(page.seo?.metaTitle);
    const description = normalized(page.seo?.metaDescription);
    if (!title) issues.push(`${label}: missing meta title`);
    else if (seenTitles.has(title)) issues.push(`${label}: duplicate meta title`);
    else seenTitles.add(title);
    if (!description) issues.push(`${label}: missing meta description`);
    else if (seenDescriptions.has(description)) issues.push(`${label}: duplicate meta description`);
    else seenDescriptions.add(description);
    if (['startseite', 'home', 'willkommen'].includes(title)) issues.push(`${label}: generic meta title`);

    const pageAnchors = new Set((page.sections || []).map((section) => section.anchorId).filter(Boolean));
    for (const link of collectHrefs(page)) {
      if (link.href === '#') issues.push(`${label}: placeholder href at ${link.path}`);
      if (link.href.startsWith('/demo/')) issues.push(`${label}: source contains demo-prefixed href ${link.href}`);
      if (!link.href.startsWith('/') && !link.href.startsWith('#')) continue;

      const [routePart, fragment] = link.href.split('#');
      const targetPath = routePart ? basePath(routePart) : `/${page.slug}`.replace(/\/$/, '') || '/';
      const targetPage = pagePaths.get(targetPath);
      const dynamicShopPath = source.key === 'ecommerce' && targetPath.startsWith('/shop/');
      if (!targetPage && !collectionPaths.has(targetPath) && !dynamicShopPath) {
        issues.push(`${label}: unreachable internal href ${link.href}`);
        continue;
      }
      if (fragment) {
        const anchors = targetPage
          ? new Set((targetPage.sections || []).map((section) => section.anchorId).filter(Boolean))
          : pageAnchors;
        if (!anchors.has(fragment)) issues.push(`${label}: href ${link.href} has no matching anchor`);
      }
    }
  }

  for (const legal of ['impressum', 'datenschutz']) {
    if (!seenSlugs.has(legal)) issues.push(`missing legal page ${legal}`);
  }

  const expectedBrand = data.brand?.companyName || source.brand;
  const expectedAddress = data.contact?.address || data.address || '';
  if (data.brand?.companyName && data.brand.companyName !== source.brand) issues.push(`brand mismatch: expected ${source.brand}`);
  if (!String(expectedBrand).includes(source.brand)) issues.push(`brand identity not found: ${source.brand}`);
  if (!sourceText.includes(source.brand)) issues.push(`source text does not contain brand identity: ${source.brand}`);
  if (!sourceText.includes(source.city)) issues.push(`source text does not contain city identity: ${source.city}`);
  if (!String(expectedAddress).includes(source.city)) issues.push(`contact address does not contain ${source.city}`);
  if (source.kind === 'cjs') {
    if (!data.seoGlobal?.defaultTitle) issues.push('global SEO is missing defaultTitle');
    if (!data.seoGlobal?.defaultDescription) issues.push('global SEO is missing defaultDescription');
  } else {
    if (!/\bdefaultTitle\s*:/.test(sourceText)) issues.push('global SEO is missing defaultTitle');
    if (!/\bdefaultDescription\s*:/.test(sourceText)) issues.push('global SEO is missing defaultDescription');
  }

  const visibleText = collectVisibleStrings(data).join('\n');
  const genericCopy = /lorem ipsum|placeholder|beispieltext|dieser demo-tenant ist technisch vorbereitet|willkommen bei ihrem zuverlässigen partner/i;
  if (genericCopy.test(visibleText)) issues.push('contains generic or placeholder copy');
  const transliteration = /\b(?:fuer|gaeste|koennen|pruefen|rueckweg|oeffnungszeiten|moeglich|raeume|wuensche|persoenlich|ueber|schoen|grosse[nr]?|strasse)\b/i;
  if (transliteration.test(visibleText)) issues.push('contains ASCII transliteration in visible German copy');

  const globalLinks = [data.navigation, data.footer, data.navItems].filter(Boolean);
  for (const link of globalLinks.flatMap((entry) => collectHrefs(entry))) {
    if (link.href === '#') issues.push(`global placeholder href at ${link.path}`);
    if (link.href.startsWith('/demo/')) issues.push(`global source contains demo-prefixed href ${link.href}`);
    if (link.href.startsWith('/') && !pagePaths.has(basePath(link.href)) && !collectionPaths.has(basePath(link.href))) {
      issues.push(`global unreachable internal href ${link.href}`);
    }
  }

  return { issues, pages: pages.length, collections: collections.length };
}

let totalIssues = 0;
const peopleByPhoto = new Map();
const rendererSwitcherPath = path.join(ROOT, 'apps/renderer/src/app/demo/demo-fab.tsx');
const rendererSwitcher = fs.readFileSync(rendererSwitcherPath, 'utf8');
const industriesBlock = rendererSwitcher.match(/const INDUSTRIES = \[([\s\S]*?)\] as const;/)?.[1] || '';
const rendererKeys = new Set(
  [...industriesBlock.matchAll(/\{\s*key:\s*'([^']+)'/g)]
    .map((match) => match[1])
    .filter((key) => key !== 'showcase'),
);
const sourceUrlKeys = new Set(SOURCES.map((source) => source.urlKey));
for (const key of sourceUrlKeys) {
  if (!rendererKeys.has(key)) {
    totalIssues += 1;
    console.log(`✗ renderer switcher is missing demo key: ${key}`);
  }
}
for (const key of rendererKeys) {
  if (!sourceUrlKeys.has(key)) {
    totalIssues += 1;
    console.log(`✗ renderer demo key has no population source: ${key}`);
  }
}

console.log('Demo source matrix (read-only)');
for (const source of SOURCES) {
  try {
    const data = loadSource(source);
    const result = auditSource(source, data);
    for (const person of collectPersonImages(data)) {
      if (!peopleByPhoto.has(person.photoId)) peopleByPhoto.set(person.photoId, new Map());
      const byTenant = peopleByPhoto.get(person.photoId);
      if (!byTenant.has(source.key)) byTenant.set(source.key, new Set());
      byTenant.get(source.key).add(person.name);
    }
    totalIssues += result.issues.length;
    const mapping = source.key === source.urlKey ? source.key : `${source.urlKey} <- ${source.key}`;
    console.log(`${result.issues.length ? '✗' : '✓'} ${mapping.padEnd(24)} ${String(result.pages).padStart(2)} pages  ${String(result.collections).padStart(2)} collections  ${source.file}`);
    for (const issue of result.issues) console.log(`    - ${issue}`);
  } catch (error) {
    totalIssues += 1;
    console.log(`✗ ${source.key.padEnd(24)} load failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

for (const [photoId, byTenant] of peopleByPhoto) {
  const tenantNames = [...byTenant.entries()];
  if (tenantNames.length > 1) {
    totalIssues += 1;
    console.log(`✗ person image ${photoId} is reused across tenants: ${tenantNames.map(([tenant]) => tenant).join(', ')}`);
  }
  for (const [tenant, names] of tenantNames) {
    if (names.size > 1) {
      totalIssues += 1;
      console.log(`✗ ${tenant}: person image ${photoId} represents multiple people: ${[...names].join(', ')}`);
    }
  }
}

console.log(`\n${SOURCES.length} sources checked; ${totalIssues} issue(s).`);
if (totalIssues) process.exitCode = 1;
