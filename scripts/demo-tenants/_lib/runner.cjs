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

function normalizeOpeningHours(value) {
  if (!value) return null;
  if (Array.isArray(value)) return { hours: value };
  if (Array.isArray(value.hours)) return value;
  if (typeof value !== 'object') return { hours: [] };

  const labels = [
    ['monday', 'Montag'],
    ['tuesday', 'Dienstag'],
    ['wednesday', 'Mittwoch'],
    ['thursday', 'Donnerstag'],
    ['friday', 'Freitag'],
    ['saturday', 'Samstag'],
    ['sunday', 'Sonntag'],
  ];

  const hours = labels
    .map(([key, label]) => {
      const row = value[key];
      if (row == null) return null;
      if (typeof row === 'string') return { type: 'regular', day: label, hours: row };
      if (typeof row === 'object') {
        const open = row.open || row.from || row.start || '';
        const close = row.close || row.to || row.end || '';
        const closed = Boolean(row.closed);
        return {
          type: 'regular',
          day: label,
          hours: closed ? '' : [open, close].filter(Boolean).join('-'),
          closed,
          note: row.note || '',
        };
      }
      return null;
    })
    .filter(Boolean);

  return { hours };
}

function normalizeFormFields(value) {
  if (!value) return null;
  if (Array.isArray(value)) return { fields: value };
  if (Array.isArray(value.fields)) return value;
  return { fields: [] };
}

async function run(tenant) {
  if (!tenant.slug) throw new Error('tenant.slug required');
  if (!tenant.pat)  throw new Error('tenant.pat required');

  const api = new Api({ pat: tenant.pat, host: tenant.host });
  const t0 = Date.now();
  const log = (...a) => console.log(`[${tenant.slug}]`, ...a);

  log('starting');

  // The API enforces a strict per-section-type allow-list of colour fields
  // (sectionStyleContracts). Any --token-* a section does not render is a hard
  // 400. Our darkTokens() helper deliberately spreads a full light-on-dark set
  // into every dark section for convenience; here we trim each section's
  // styleOverrides down to exactly the vars its type accepts, so the populate
  // never sends a misrouted/extra field. Same guarantee the CMS contract gives.
  let allowedByType = null;
  try {
    const ins = await api.instructions();
    allowedByType = new Map();
    for (const c of ins.sectionStyleContracts || []) {
      allowedByType.set(c.type, new Set((c.colorFields || []).map((f) => f.cssVar)));
    }
    log(`loaded style contracts for ${allowedByType.size} section types`);
  } catch (e) {
    log('  warn: could not load sectionStyleContracts — sending styleOverrides unfiltered:', e.message);
  }

  const filterOverrides = (section) => {
    const so = section.styleOverrides;
    if (!so || !allowedByType) return section;
    const allow = allowedByType.get(section.type);
    if (!allow) return section; // unknown type: leave as-is, let the API decide
    const kept = {};
    let dropped = 0;
    for (const [k, v] of Object.entries(so)) {
      if (allow.has(k)) kept[k] = v; else dropped++;
    }
    return dropped ? { ...section, styleOverrides: kept, __dropped: dropped } : section;
  };

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
  if (tenant.openingHours) { log('PUT opening-hours');await api.openingHours(normalizeOpeningHours(tenant.openingHours)); }
  if (tenant.formFields)   { log('PUT form-fields');  await api.formFields(normalizeFormFields(tenant.formFields)); }
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
    const sections = (page.sections || []).map(filterOverrides);
    const droppedTotal = sections.reduce((n, s) => n + (s.__dropped || 0), 0);
    for (const s of sections) delete s.__dropped;
    log('POST page', page.slug || '(home)', '—', page.title,
        droppedTotal ? `(trimmed ${droppedTotal} non-contract token(s))` : '');
    const body = { slug: page.slug, title: page.title, sections };
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
        // Collection items can carry their own detail-page sections under
        // data.sections — those need the same per-section contract trim.
        let outItem = item;
        if (item.data && Array.isArray(item.data.sections)) {
          const sections = item.data.sections.map(filterOverrides);
          for (const s of sections) delete s.__dropped;
          outItem = { ...item, data: { ...item.data, sections } };
        }
        log('POST item', col.key, '/', item.slug);
        try {
          // Items default to published=false on create. Force-publish unless
          // the caller explicitly set it.
          const body = outItem.published === undefined ? { ...outItem, published: true } : outItem;
          await api.createItem(col.key, body);
        } catch (e) { log('  warn: createItem failed', col.key, item.slug, e.message); }
      }
    }
  }

  if (typeof tenant.postRun === 'function') {
    log('postRun()');
    await tenant.postRun(api, { pagesByIndex });
  }

  if (tenant.publish !== false) {
    log('POST publish');
    // The publish snapshot step currently fails with a backend driver
    // limitation ("No transactions support in neon-http driver") that the demo
    // script cannot influence. Pages are created already-published and items
    // with published:true, so content is live regardless — treat a publish
    // failure as a warning, not a fatal abort.
    try {
      const result = await api.publish();
      log('  publish result:', JSON.stringify(result).slice(0, 220));
    } catch (e) {
      log('  warn: publish failed (content already written):', e.body && e.body.error ? e.body.error : e.message);
    }
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
