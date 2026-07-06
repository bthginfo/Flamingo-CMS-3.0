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

  // The API enforces a strict per-section-type allow-list of colour fields. Any
  // --token-* a section does not render is a hard 400 — and because the backend
  // driver has NO transactions, that 400 lands AFTER the page row is inserted,
  // so a retry collides on the unique slug with a 500. The only safe path is a
  // correct first POST. We therefore resolve the full (sectionType, industry)
  // contract ourselves — mirroring the renderer's getFieldsForSection — instead
  // of trusting /api/v1/instructions, whose list omits borrowed section types
  // the API still validates. darkTokens() deliberately spreads a full light-on-
  // dark set into every dark section; this trims each one down to exactly the
  // vars its type accepts (same no-extra/no-misrouted guarantee the CMS gives).
  let resolveAllowed = null;
  let industry;
  try {
    const ins = await api.instructions();
    industry = ins.tenant && ins.tenant.industry;
    const { makeResolver } = require('./contracts.cjs');
    resolveAllowed = makeResolver();
    log(`resolved colour contracts (industry=${industry || 'unknown'})`);
  } catch (e) {
    log('  warn: could not resolve colour contracts — styleOverrides unfiltered:', e.message);
  }

  const filterOverrides = (section) => {
    const so = section.styleOverrides;
    if (!so || !resolveAllowed) return section;
    const allow = resolveAllowed(section.type, industry);
    const kept = {};
    let dropped = 0;
    for (const [k, v] of Object.entries(so)) {
      if (allow.has(k)) kept[k] = v; else dropped++;
    }
    return dropped ? { ...section, styleOverrides: kept, __dropped: dropped } : section;
  };

  // The instructions contract list is INCOMPLETE: it only lists section types
  // that have a real colour contract for this tenant's industry, omitting types
  // the API still validates (utility sections collapse to sectionBg-only; some
  // borrowed types resolve to a 12-field set the list never surfaces). For any
  // key that slips past filterOverrides, the API returns a precise 400 naming
  // exactly which sections[i].styleOverrides.<key> is not allowed — so we strip
  // that one key and retry. The API itself is the source of truth; no contract
  // logic has to be mirrored here. Returns { result, stripped }.
  const STRIP_RE = /sections\[(\d+)\]\.styleOverrides\.(--[a-z0-9-]+) is not used by section type/i;
  const postSectionsAdaptive = async (doPost, sections, label, beforeRetry) => {
    const work = sections.map((s) =>
      s && s.styleOverrides ? { ...s, styleOverrides: { ...s.styleOverrides } } : s);
    let stripped = 0;
    for (let attempt = 0; attempt < 200; attempt++) {
      try {
        return { result: await doPost(work), stripped };
      } catch (e) {
        const msg = e && e.body && e.body.error ? String(e.body.error) : '';
        const m = e && e.status === 400 ? msg.match(STRIP_RE) : null;
        if (m && work[+m[1]] && work[+m[1]].styleOverrides && m[2] in work[+m[1]].styleOverrides) {
          delete work[+m[1]].styleOverrides[m[2]];
          stripped++;
          // The driver has no transactions: the failed insert may have left a
          // partial row that would make the retry collide on the unique slug.
          // Let the caller clean it up first.
          if (beforeRetry) { try { await beforeRetry(); } catch { /* best-effort */ } }
          continue;
        }
        throw e;
      }
    }
    throw new Error(`${label}: exceeded adaptive styleOverride strip limit`);
  };

  // Delete every page that currently carries `slug` (clears partial-insert rows
  // left behind by a failed createPage, since there are no transactions).
  const deletePagesBySlug = async (slug) => {
    const dbg = await api.debug();
    for (const p of dbg.pages || []) {
      if (p.slug === slug) { try { await api.deletePage(p.id); } catch { /* ignore */ } }
    }
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

  // NOTE: enabling languages is a paid, admin-only setting and CANNOT be set
  // via the API. A tenant that carries localized (_localized) content must
  // already have its locales enabled in the admin UI. tenant.i18n is only a
  // hint for humans; the runner does not (and must not) toggle it.

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
    const { result: res, stripped } = await postSectionsAdaptive(
      (secs) => api.createPage({ slug: page.slug, title: page.title, sections: secs }),
      sections, `page ${page.slug || '(home)'}`,
      () => deletePagesBySlug(page.slug),
    );
    log('POST page', page.slug || '(home)', '—', page.title,
        (droppedTotal || stripped) ? `(trimmed ${droppedTotal + stripped} non-contract token(s))` : '');
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
  // The API expects { items, cta:{label,href} } — map the tenant's convenience
  // ctaLabel/ctaHref shape. Localized variants (navigationI18n / footerI18n =
  // { en:{…}, es:{…} }) are PUT per locale so the switcher swaps nav + footer.
  const navBody = (nav) => ({
    items: nav.items || [],
    cta: nav.cta || (nav.ctaLabel ? { label: nav.ctaLabel, href: nav.ctaHref || '/kontakt' } : undefined),
  });
  if (tenant.navigation) {
    log('PUT navigation');
    await api.navigation(navBody(tenant.navigation));
    for (const [loc, nav] of Object.entries(tenant.navigationI18n || {})) {
      log('PUT navigation', loc);
      await api.navigation({ ...navBody(nav), locale: loc });
    }
  }
  if (tenant.footer) {
    log('PUT footer');
    await api.footer(tenant.footer);
    for (const [loc, foot] of Object.entries(tenant.footerI18n || {})) {
      log('PUT footer', loc);
      await api.footer({ ...foot, locale: loc });
    }
  }

  // Collection items.
  if (Array.isArray(tenant.collections)) {
    for (const col of tenant.collections) {
      for (const item of col.items || []) {
        // Collection items can carry their own detail-page sections under
        // data.sections — those need the same per-section contract trim.
        const hasSections = item.data && Array.isArray(item.data.sections);
        const baseItem = hasSections
          ? { ...item, data: { ...item.data, sections: item.data.sections.map((s) => { const c = filterOverrides(s); delete c.__dropped; return c; }) } }
          : item;
        log('POST item', col.key, '/', item.slug);
        try {
          // Items default to published=false on create. Force-publish unless
          // the caller explicitly set it.
          const publishFlag = item.published === undefined ? { published: true } : {};
          if (hasSections) {
            await postSectionsAdaptive(
              (secs) => api.createItem(col.key, { ...baseItem, ...publishFlag, data: { ...baseItem.data, sections: secs } }),
              baseItem.data.sections, `item ${col.key}/${item.slug}`,
            );
          } else {
            await api.createItem(col.key, { ...baseItem, ...publishFlag });
          }
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
