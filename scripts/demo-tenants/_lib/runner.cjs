/**
 * Declarative tenant runner.
 *
 * A tenant module exports an object with this shape:
 *
 *   {
 *     slug: 'handwerk',
 *     pat:  'flm_pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
 *     wipe: true,                 // delete existing pages/items first (default true)
 *     brand:        { ... },      // PUT /content/brand
 *     contact:      { ... },      // PUT /content/contact
 *     design:       { ... },      // PUT /content/design
 *     socialLinks:  { ... },      // PUT /content/social-links
 *     openingHours: { hours: [] },// optional
 *     formFields:   { fields: [] },// optional
 *     seoGlobal:    { ... },
 *     navigation:   { items: [], ctaLabel, ctaHref },
 *     footer:       { columns: [], legalLinks: [], cta: {...} },
 *     collections:  [{ key, label, items: [{ title, slug, data }] }],
 *     pages: [{
 *       slug: 'leistungen' | '',  // '' = homepage
 *       title: 'Leistungen',
 *       sections: [{ type: 'hero', variant?: '...', data: {...} }],
 *       seo?: { metaTitle, metaDescription, ogImage? },
 *     }],
 *     postRun?: async (api) => void,  // anything that needs IDs to be known
 *     publish: true,
 *   }
 *
 * The runner:
 *   1. Logs in (PAT is per call header)
 *   2. Optionally wipes all existing pages + collection items
 *   3. Applies brand / contact / design / nav / footer / social / SEO global
 *   4. Creates collections (idempotent: PUT if exists else POST)
 *   5. Creates pages in order; first non-empty-slug page acts as homepage anchor
 *      via the renderer's own homepage detection (the '' slug page is the home).
 *   6. Optionally creates collection items
 *   7. Optionally writes per-page SEO
 *   8. Calls publish + validate and prints warnings.
 */

const Api = require('./api.cjs');

async function run(tenant) {
  if (!tenant.slug) throw new Error('tenant.slug required');
  if (!tenant.pat)  throw new Error('tenant.pat required');

  const api = new Api({ pat: tenant.pat });
  const t0 = Date.now();
  const log = (...a) => console.log(`[${tenant.slug}]`, ...a);

  log('starting');

  if (tenant.wipe !== false) {
    log('wiping existing content');
    const dbg = await api.debug();
    for (const p of dbg.pages || []) {
      try { await api.deletePage(p.id); } catch (e) { log('  warn: delete page', p.id, e.message); }
    }
    for (const c of dbg.collections || []) {
      for (const it of c.items || []) {
        try { await api.deleteItem(c.key, it.id); } catch (e) { log('  warn: delete item', c.key, it.id, e.message); }
      }
    }
    log('  wiped', (dbg.pages||[]).length, 'pages and items from', (dbg.collections||[]).length, 'collections');
  }

  if (tenant.brand)        { log('PUT brand');         await api.brand(tenant.brand); }
  if (tenant.contact)      { log('PUT contact');       await api.contact(tenant.contact); }
  if (tenant.design)       { log('PUT design');        await api.design(tenant.design); }
  if (tenant.style)        { log('PUT style');         await api.style(tenant.style); }
  if (tenant.socialLinks)  { log('PUT social-links'); await api.socialLinks(tenant.socialLinks); }
  if (tenant.openingHours) { log('PUT opening-hours');await api.openingHours(tenant.openingHours); }
  if (tenant.formFields)   { log('PUT form-fields');  await api.formFields(tenant.formFields); }
  if (tenant.seoGlobal)    { log('PUT seo global');   await api.seoGlobal(tenant.seoGlobal); }

  // Collections must exist before items are created.
  if (Array.isArray(tenant.collections)) {
    const existing = await api.listCollections();
    const existingKeys = new Set((existing.collections || existing || []).map((c) => c.key));
    for (const col of tenant.collections) {
      if (!existingKeys.has(col.key)) {
        log('POST collection', col.key);
        try { await api.createCollection({ key: col.key, label: col.label }); }
        catch (e) { log('  warn: createCollection failed', col.key, e.message); }
      }
    }
  }

  // Pages: order matters (nav links by slug, footer links by slug).
  const pagesByIndex = [];
  for (const page of tenant.pages || []) {
    log('POST page', page.slug || '(home)', '—', page.title);
    const body = { slug: page.slug, title: page.title, sections: page.sections || [] };
    const res = await api.createPage(body);
    pagesByIndex.push({ slug: page.slug, id: res.id || res.pageId || (res.page && res.page.id), seo: page.seo });
  }

  // Per-page SEO (needs page IDs from above).
  for (const p of pagesByIndex) {
    if (p.seo && p.id) {
      log('PUT seo page', p.slug || '(home)');
      try { await api.seoPage(p.id, p.seo); } catch (e) { log('  warn: seo page failed', e.message); }
    }
  }

  // Navigation + footer come AFTER pages so the slugs they reference exist.
  if (tenant.navigation) { log('PUT navigation'); await api.navigation(tenant.navigation); }
  if (tenant.footer)     { log('PUT footer');     await api.footer(tenant.footer); }

  // Collection items.
  if (Array.isArray(tenant.collections)) {
    for (const col of tenant.collections) {
      for (const item of col.items || []) {
        log('POST item', col.key, '/', item.slug);
        try { await api.createItem(col.key, item); }
        catch (e) { log('  warn: createItem failed', col.key, item.slug, e.message); }
      }
    }
  }

  if (typeof tenant.postRun === 'function') {
    log('postRun()');
    await tenant.postRun(api, { pagesByIndex });
  }

  if (tenant.publish !== false) {
    log('POST publish');
    const result = await api.publish();
    log('  publish result:', JSON.stringify(result).slice(0, 220));
  }

  log('validate');
  try {
    const v = await api.validate();
    log('  readyToPublish:', v.readyToPublish);
    if (v.contentIssues && v.contentIssues.length) {
      log('  content issues:', v.contentIssues.length);
      v.contentIssues.slice(0, 6).forEach((i) => log('   -', i.severity || '', i.message || JSON.stringify(i).slice(0, 200)));
    }
    if (v.colorIssues && v.colorIssues.length) {
      log('  color issues:', v.colorIssues.length);
      v.colorIssues.slice(0, 6).forEach((i) => log('   -', i.severity || '', i.message || JSON.stringify(i).slice(0, 200)));
    }
  } catch (e) { log('  warn: validate failed', e.message); }

  log('done in', Math.round((Date.now() - t0) / 1000), 's');
}

module.exports = { run };
