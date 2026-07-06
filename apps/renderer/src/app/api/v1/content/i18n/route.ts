import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { pages, pageSections, tenants, collections, collectionItems } from '@flamingo/db';
import { eq, and, asc } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';

function normalizeI18nConfig(config?: { locales?: string | null; defaultLocale?: string | null }) {
  const locales = (config?.locales || '')
    .split(',')
    .map(locale => locale.trim())
    .filter(Boolean);
  const defaultLocale = config?.defaultLocale?.trim() || locales[0] || 'de';
  const uniqueLocales = Array.from(new Set([defaultLocale, ...locales]));

  return { locales: uniqueLocales, defaultLocale };
}

/**
 * GET /api/v1/content/i18n
 * 
 * Returns all pages with their sections AND all collections with their items.
 * Sections with localized data show the full locale structure.
 * AI agents use this to know which sections/items need translation.
 * 
 * Response: { i18n: { enabled, locales, defaultLocale }, pages: [...], collections: [...] }
 */
export const GET = withApiHandler(async (_req, auth) => {
  const db = getDb();

  const [tenant] = await db.select({
    i18nEnabled: tenants.i18nEnabled,
    i18nLocales: tenants.i18nLocales,
    i18nDefaultLocale: tenants.i18nDefaultLocale,
  }).from(tenants).where(eq(tenants.id, auth.tenantId)).limit(1);

  const normalizedI18n = normalizeI18nConfig({
    locales: tenant?.i18nLocales,
    defaultLocale: tenant?.i18nDefaultLocale,
  });

  const i18n = {
    enabled: tenant?.i18nEnabled ?? false,
    locales: normalizedI18n.locales,
    defaultLocale: normalizedI18n.defaultLocale,
  };

  // Pages + their sections
  const allPages = await db.select().from(pages).where(eq(pages.tenantId, auth.tenantId));
  const allSections = await db.select().from(pageSections).where(eq(pageSections.tenantId, auth.tenantId)).orderBy(asc(pageSections.sortOrder));

  const pagesResult = allPages.map(page => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    sections: allSections
      .filter(s => s.pageId === page.id)
      .map(s => ({
        id: s.id,
        type: s.type,
        data: s.data,
      })),
  }));

  // Collections + their items (sections are embedded in item.data.sections)
  const allCollections = await db.select().from(collections).where(eq(collections.tenantId, auth.tenantId));
  const allItems = await db.select().from(collectionItems).where(eq(collectionItems.tenantId, auth.tenantId));

  const collectionsResult = allCollections.map(col => ({
    key: col.key,
    label: col.label,
    items: allItems
      .filter(item => item.collectionId === col.id)
      .map(item => {
        const itemData = (item.data || {}) as Record<string, unknown>;
        const sections = (itemData.sections || []) as Array<{ id?: string; type?: string; data?: unknown }>;
        return {
          id: item.id,
          slug: item.slug,
          title: item.title,
          excerpt: itemData.excerpt as string | undefined,
          sections: sections.map(s => ({
            id: s.id,
            type: s.type,
            data: s.data,
          })),
        };
      }),
  }));

  return NextResponse.json({ i18n, pages: pagesResult, collections: collectionsResult });
});

/**
 * PATCH /api/v1/content/i18n
 *
 * Enable/configure the tenant's languages so an AI agent can set up a
 * multilingual site end-to-end via the API (previously only possible in the
 * admin UI). Body: { enabled?: boolean, locales?: string[]|"de,en,es",
 *                    defaultLocale?: string }.
 * Locales must be BCP-47-ish (xx or xx-XX). The default locale is always
 * included and, if given, must be one of the locales.
 */
export const PATCH = withApiHandler(async (req, auth) => {
  const body = await req.json();
  const db = getDb();

  const [tenant] = await db.select({
    i18nEnabled: tenants.i18nEnabled,
    i18nLocales: tenants.i18nLocales,
    i18nDefaultLocale: tenants.i18nDefaultLocale,
    i18nMaxLanguages: tenants.i18nMaxLanguages,
  }).from(tenants).where(eq(tenants.id, auth.tenantId)).limit(1);
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  const LOCALE_RE = /^[a-z]{2}(-[A-Z]{2})?$/;
  const rawLocales = Array.isArray(body.locales)
    ? body.locales
    : typeof body.locales === 'string'
      ? body.locales.split(',')
      : undefined;

  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (rawLocales) {
    const cleaned = rawLocales.map((l: unknown) => String(l).trim()).filter(Boolean);
    const invalid = cleaned.filter((l: string) => !LOCALE_RE.test(l));
    if (invalid.length) {
      return NextResponse.json({ error: `Invalid locale code(s): ${invalid.join(', ')}. Use "de", "en", "es", "en-US" …` }, { status: 400 });
    }
    const defaultLocale = typeof body.defaultLocale === 'string' && body.defaultLocale.trim()
      ? body.defaultLocale.trim()
      : (cleaned[0] || tenant.i18nDefaultLocale);
    if (!LOCALE_RE.test(defaultLocale)) {
      return NextResponse.json({ error: `Invalid defaultLocale "${defaultLocale}"` }, { status: 400 });
    }
    const unique = Array.from(new Set([defaultLocale, ...cleaned]));
    // Hard ceiling to keep the switcher usable and prevent abuse; the per-tenant
    // plan limit (i18nMaxLanguages) is raised to fit the request within that
    // ceiling — the PAT is an admin-equivalent credential in this product.
    const HARD_MAX = 8;
    if (unique.length > HARD_MAX) {
      return NextResponse.json({ error: `At most ${HARD_MAX} languages are supported; got ${unique.length}` }, { status: 400 });
    }
    updates.i18nLocales = unique.join(',');
    updates.i18nDefaultLocale = defaultLocale;
    if (unique.length > tenant.i18nMaxLanguages) updates.i18nMaxLanguages = unique.length;
  } else if (typeof body.defaultLocale === 'string' && body.defaultLocale.trim()) {
    const current = tenant.i18nLocales.split(',').map(l => l.trim()).filter(Boolean);
    if (!current.includes(body.defaultLocale.trim())) {
      return NextResponse.json({ error: `defaultLocale "${body.defaultLocale}" is not in the enabled locales (${current.join(', ')})` }, { status: 400 });
    }
    updates.i18nDefaultLocale = body.defaultLocale.trim();
  }

  if (typeof body.enabled === 'boolean') updates.i18nEnabled = body.enabled;

  await db.update(tenants).set(updates).where(eq(tenants.id, auth.tenantId));

  const [fresh] = await db.select({
    enabled: tenants.i18nEnabled,
    locales: tenants.i18nLocales,
    defaultLocale: tenants.i18nDefaultLocale,
  }).from(tenants).where(eq(tenants.id, auth.tenantId)).limit(1);

  return NextResponse.json({
    success: true,
    i18n: { enabled: fresh.enabled, locales: fresh.locales.split(','), defaultLocale: fresh.defaultLocale },
  });
});

/**
 * PUT /api/v1/content/i18n
 *
 * Update locale-specific data for sections (page sections) and/or collection items.
 * 
 * Body: {
 *   sections?: [{ id: "section-uuid", locale: "en", data: { headline: "...", ... } }],
 *   items?: [{ id: "collection-item-uuid", locale: "en", title?: "English Title", excerpt?: "...", sections?: [{ id: "section-id-within-item", data: { ... } }] }]
 * }
 * 
 * For page sections: merges locale data into existing section data structure.
 * For collection items: localizes title, excerpt, and individual sections within item.data.
 */
export const PUT = withApiHandler(async (req, auth) => {
  const body = await req.json();
  const { sections, items } = body;

  if ((!Array.isArray(sections) || sections.length === 0) && (!Array.isArray(items) || items.length === 0)) {
    return NextResponse.json({ error: 'sections and/or items array required' }, { status: 400 });
  }

  const db = getDb();

  // Get tenant's i18n config to validate incoming locale claims against the
  // configured allow-list. Without this an authenticated agent could pollute
  // JSONB with arbitrary keys (e.g. "<script>") that later end up in section
  // data and confuse the locale resolver.
  const [tenant] = await db.select({
    defaultLocale: tenants.i18nDefaultLocale,
    locales: tenants.i18nLocales,
  }).from(tenants).where(eq(tenants.id, auth.tenantId)).limit(1);
  const normalizedI18n = normalizeI18nConfig({
    locales: tenant?.locales,
    defaultLocale: tenant?.defaultLocale,
  });
  const defaultLocale = normalizedI18n.defaultLocale;
  const allowedLocales = new Set(normalizedI18n.locales);

  function isValidLocale(loc: unknown): loc is string {
    return typeof loc === 'string' && /^[a-z]{2}(-[A-Z]{2})?$/.test(loc) && allowedLocales.has(loc);
  }

  let updated = 0;
  const errors: string[] = [];

  // Handle page sections
  if (Array.isArray(sections)) {
    for (const entry of sections) {
      if (!entry.id || !entry.locale || !entry.data) {
        errors.push(`Invalid section entry: id, locale, and data are required`);
        continue;
      }
      if (!isValidLocale(entry.locale)) {
        errors.push(`Section ${entry.id}: locale "${entry.locale}" is not enabled for this tenant`);
        continue;
      }

      const [existing] = await db.select({ data: pageSections.data }).from(pageSections)
        .where(and(eq(pageSections.id, entry.id), eq(pageSections.tenantId, auth.tenantId)))
        .limit(1);

      if (!existing) {
        errors.push(`Section ${entry.id} not found`);
        continue;
      }

      const currentData = (existing.data as Record<string, unknown>) || {};
      let newData: Record<string, unknown>;

      if (currentData._localized) {
        newData = { ...currentData, [entry.locale]: entry.data };
      } else {
        newData = { _localized: true, [defaultLocale]: currentData, [entry.locale]: entry.data };
      }

      await db.update(pageSections)
        .set({ data: newData, updatedAt: new Date() })
        .where(and(eq(pageSections.id, entry.id), eq(pageSections.tenantId, auth.tenantId)));
      updated++;
    }
  }

  // Handle collection items
  if (Array.isArray(items)) {
    for (const entry of items) {
      if (!entry.id || !entry.locale) {
        errors.push(`Invalid item entry: id and locale are required`);
        continue;
      }
      if (!isValidLocale(entry.locale)) {
        errors.push(`Item ${entry.id}: locale "${entry.locale}" is not enabled for this tenant`);
        continue;
      }

      const [existing] = await db.select({ data: collectionItems.data, title: collectionItems.title }).from(collectionItems)
        .where(and(eq(collectionItems.id, entry.id), eq(collectionItems.tenantId, auth.tenantId)))
        .limit(1);

      if (!existing) {
        errors.push(`Collection item ${entry.id} not found`);
        continue;
      }

      const currentData = (existing.data || {}) as Record<string, unknown>;
      const newData = { ...currentData };

      // Localize title
      if (entry.title) {
        const currentTitles = (currentData._titles as Record<string, string>) || {};
        if (!currentTitles[defaultLocale]) currentTitles[defaultLocale] = existing.title;
        currentTitles[entry.locale] = entry.title;
        newData._titles = currentTitles;
      }

      // Localize excerpt
      if (entry.excerpt !== undefined) {
        const currentExcerpts = (currentData._excerpts as Record<string, string>) || {};
        if (!currentExcerpts[defaultLocale] && currentData.excerpt) currentExcerpts[defaultLocale] = currentData.excerpt as string;
        currentExcerpts[entry.locale] = entry.excerpt;
        newData._excerpts = currentExcerpts;
      }

      // Localize sections within the item
      if (Array.isArray(entry.sections)) {
        const currentSections = (currentData.sections || []) as Array<Record<string, unknown>>;
        for (const secEntry of entry.sections) {
          if (!secEntry.id || !secEntry.data) continue;
          const secIdx = currentSections.findIndex((s: Record<string, unknown>) => s.id === secEntry.id);
          if (secIdx === -1) {
            errors.push(`Section ${secEntry.id} not found in collection item ${entry.id}`);
            continue;
          }
          const sec = currentSections[secIdx];
          const secData = (sec.data || {}) as Record<string, unknown>;
          if (secData._localized) {
            currentSections[secIdx] = { ...sec, data: { ...secData, [entry.locale]: secEntry.data } };
          } else {
            currentSections[secIdx] = { ...sec, data: { _localized: true, [defaultLocale]: secData, [entry.locale]: secEntry.data } };
          }
        }
        newData.sections = currentSections;
      }

      await db.update(collectionItems)
        .set({ data: newData, updatedAt: new Date() })
        .where(and(eq(collectionItems.id, entry.id), eq(collectionItems.tenantId, auth.tenantId)));
      updated++;
    }
  }

  return NextResponse.json({ success: true, updated, errors: errors.length > 0 ? errors : undefined });
});
