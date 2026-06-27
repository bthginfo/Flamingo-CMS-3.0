#!/usr/bin/env node
/**
 * export-content.cjs — snapshot the LIVE content of demo tenants to JSON files.
 *
 * Why: several tenants were filled by another AI directly through the content
 * API, so their pages / sections / styleOverrides / collections live ONLY in
 * the database, NOT in the populate scripts. Before we touch anything (colour
 * patches, repopulate, …) we capture a durable, version-controllable backup.
 *
 * Auth: provide one PAT per tenant via env `PAT_<SLUG>` (slug upper-cased,
 * non-alnum → '_'), exactly like run-all.cjs. The tool exports every PAT_* it
 * finds — no hard-coded tenant list. The slug (lower-cased) is only used for
 * the output filename; the PAT alone identifies the tenant server-side.
 *
 * Output: scripts/demo-tenants/_snapshots/<slug>.json  (full debug() dump +
 * tenant meta + best-effort config endpoints). Re-runnable; overwrites.
 *
 * Usage:
 *   PAT_HANDWERK=flm_pat_xxx PAT_HOTEL=flm_pat_yyy node scripts/demo-tenants/export-content.cjs
 *   node scripts/demo-tenants/export-content.cjs handwerk hotel   # restrict to some slugs
 */
const fs = require('fs');
const path = require('path');
const Api = require('./_lib/api.cjs');

const OUT_DIR = path.join(__dirname, '_snapshots');

// Config endpoints that expose a GET (best-effort; tolerate 404/405).
const CONFIG_GETS = [
  ['brand', '/api/v1/content/brand'],
  ['contact', '/api/v1/content/contact'],
  ['navigation', '/api/v1/content/navigation'],
  ['footer', '/api/v1/content/footer'],
  ['design', '/api/v1/content/design'],
  ['style', '/api/v1/content/style'],
  ['socialLinks', '/api/v1/content/social-links'],
  ['openingHours', '/api/v1/content/opening-hours'],
  ['seoGlobal', '/api/v1/content/seo'],
  ['i18n', '/api/v1/content/i18n'],
  ['formFields', '/api/v1/content/form-fields'],
  ['shopSettings', '/api/v1/shop/settings'],
  ['shopProducts', '/api/v1/shop/products'],
  ['shopCategories', '/api/v1/shop/categories'],
  ['shopCoupons', '/api/v1/shop/coupons'],
  ['shopShipping', '/api/v1/shop/shipping'],
];

function discoverPats(filterSlugs) {
  const out = [];
  for (const [key, val] of Object.entries(process.env)) {
    if (!key.startsWith('PAT_') || !val) continue;
    const slug = key.slice(4).toLowerCase();
    if (filterSlugs.length && !filterSlugs.includes(slug)) continue;
    out.push({ slug, pat: val });
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function tryGet(api, endpoint) {
  try {
    return { ok: true, data: await api.request('GET', endpoint, undefined, { retries: 1 }) };
  } catch (e) {
    return { ok: false, status: e.status, error: e.message };
  }
}

async function exportTenant({ slug, pat }) {
  const api = new Api({ pat, verbose: false });

  let instructions = null;
  try { instructions = await api.instructions(); } catch (e) { /* non-fatal */ }

  const dump = await api.debug(); // full pages+sections+collections (the real content)

  const config = {};
  for (const [name, endpoint] of CONFIG_GETS) {
    const r = await tryGet(api, endpoint);
    if (r.ok && r.data != null) config[name] = r.data;
  }

  const snapshot = {
    slug,
    exportedAt: new Date().toISOString(),
    tenant: instructions && instructions.tenant ? instructions.tenant : { id: dump.tenantId },
    availableSectionTypes: instructions ? instructions.availableSectionTypes : undefined,
    content: dump,        // { tenantId, pages:[{...,sections:[...]}], collections:[{...,items:[...]}] }
    config,               // best-effort brand / nav / footer / shop / …
  };

  const pages = (dump.pages || []).length;
  const sections = (dump.pages || []).reduce((n, p) => n + (p.sections || []).length, 0);
  const collections = (dump.collections || []).length;
  const items = (dump.collections || []).reduce((n, c) => n + (c.items || []).length, 0);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const file = path.join(OUT_DIR, `${slug}.json`);
  fs.writeFileSync(file, JSON.stringify(snapshot, null, 2) + '\n');

  return { slug, file, pages, sections, collections, items, config: Object.keys(config).length };
}

(async () => {
  const filterSlugs = process.argv.slice(2).map((s) => s.toLowerCase());
  const tenants = discoverPats(filterSlugs);
  if (!tenants.length) {
    console.error('No PAT_<SLUG> env vars found' + (filterSlugs.length ? ` matching: ${filterSlugs.join(', ')}` : '') + '.');
    console.error('Provide e.g. PAT_HANDWERK=flm_pat_xxx before running.');
    process.exit(1);
  }

  console.log(`Exporting ${tenants.length} tenant(s) → ${path.relative(process.cwd(), OUT_DIR)}/`);
  const results = [];
  for (const t of tenants) {
    process.stdout.write(`  ${t.slug.padEnd(14)} … `);
    try {
      const r = await exportTenant(t);
      results.push(r);
      console.log(`ok  pages=${r.pages} sections=${r.sections} collections=${r.collections} items=${r.items} config=${r.config}`);
    } catch (e) {
      console.log(`FAILED ${e.status ? `HTTP ${e.status}` : ''} ${e.message}`);
    }
  }

  const okCount = results.length;
  console.log(`\nDone: ${okCount}/${tenants.length} exported.`);
  if (okCount < tenants.length) process.exitCode = 1;
})();
