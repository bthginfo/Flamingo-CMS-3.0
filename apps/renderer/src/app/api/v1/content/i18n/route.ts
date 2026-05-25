import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { pages, pageSections, tenants } from '@flamingo/db';
import { eq, and, asc } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';

/**
 * GET /api/v1/content/i18n
 * 
 * Returns all pages with their sections and i18n configuration.
 * Sections with localized data show the full locale structure.
 * AI agents use this to know which sections need translation.
 * 
 * Response: { i18n: { enabled, locales, defaultLocale }, pages: [...] }
 */
export const GET = withApiHandler(async (_req, auth) => {
  const db = getDb();

  const [tenant] = await db.select({
    i18nEnabled: tenants.i18nEnabled,
    i18nLocales: tenants.i18nLocales,
    i18nDefaultLocale: tenants.i18nDefaultLocale,
  }).from(tenants).where(eq(tenants.id, auth.tenantId)).limit(1);

  const i18n = {
    enabled: tenant?.i18nEnabled ?? false,
    locales: (tenant?.i18nLocales || 'de').split(','),
    defaultLocale: tenant?.i18nDefaultLocale || 'de',
  };

  const allPages = await db.select().from(pages).where(eq(pages.tenantId, auth.tenantId));
  const allSections = await db.select().from(pageSections).where(eq(pageSections.tenantId, auth.tenantId)).orderBy(asc(pageSections.sortOrder));

  const result = allPages.map(page => ({
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

  return NextResponse.json({ i18n, pages: result });
});

/**
 * PUT /api/v1/content/i18n
 * 
 * Update locale-specific data for one or more sections.
 * AI agents use this after translating content.
 * 
 * Body: { sections: [{ id: "section-uuid", locale: "en", data: { headline: "...", ... } }] }
 * 
 * This merges the provided locale data into the existing section data structure:
 * - If section.data is flat (not localized yet), it migrates: { _localized: true, [defaultLocale]: oldData, [locale]: newData }
 * - If section.data is already localized, it updates the specific locale key.
 */
export const PUT = withApiHandler(async (req, auth) => {
  const body = await req.json();
  const { sections } = body;

  if (!Array.isArray(sections) || sections.length === 0) {
    return NextResponse.json({ error: 'sections array required' }, { status: 400 });
  }

  const db = getDb();

  // Get tenant's default locale
  const [tenant] = await db.select({ defaultLocale: tenants.i18nDefaultLocale }).from(tenants).where(eq(tenants.id, auth.tenantId)).limit(1);
  const defaultLocale = tenant?.defaultLocale || 'de';

  let updated = 0;
  const errors: string[] = [];

  for (const entry of sections) {
    if (!entry.id || !entry.locale || !entry.data) {
      errors.push(`Invalid entry: id, locale, and data are required`);
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
      // Already localized — update locale key
      newData = { ...currentData, [entry.locale]: entry.data };
    } else {
      // Migrate flat data → localized structure
      newData = {
        _localized: true,
        [defaultLocale]: currentData,
        [entry.locale]: entry.data,
      };
    }

    await db.update(pageSections)
      .set({ data: newData, updatedAt: new Date() })
      .where(and(eq(pageSections.id, entry.id), eq(pageSections.tenantId, auth.tenantId)));
    updated++;
  }

  return NextResponse.json({ success: true, updated, errors: errors.length > 0 ? errors : undefined });
});
