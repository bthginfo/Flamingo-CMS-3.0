import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import {
  pages,
  pageSections,
  collections,
  collectionItems,
  globalSettings,
  navigation as navigationTable,
  footer as footerTable,
  seoGlobal as seoGlobalTable,
  seoPage as seoPageTable,
  tenantAddons,
  tenants,
} from '@flamingo/db';
import { eq, and, inArray, asc } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';
import {
  validateBrandPayload,
  validateDesignPayload,
  validateSectionStyleOverrides,
  type ColorIssue,
} from '@/lib/color-validation';
import { validateContentQuality, type ContentQualityIssue, type ContentQualityInput } from '@/lib/content-quality';
import { getSectionTypesForIndustry } from '@/app/admin/pages/[id]/section-types';
import { getSectionSchemas } from '@/lib/section-data-schemas';
import { evaluateSitePagePolicy } from '@/lib/site-page-policy';
import type { PatAuthResult } from '@/lib/pat-auth';
import { getWritableSession } from '@/lib/session';

/**
 * GET /api/v1/content/validate
 *
 * Returns a structured pre-publish audit:
 *   - content issues   (missing required fields, empty arrays, …)
 *   - colorIssues      (malformed colors, low WCAG contrast, dark-bg-no-onDark)
 *   - summary          (counts per severity)
 *
 * The AI is told to call this BEFORE /publish and react to every error /
 * critical warning. This is the feedback loop that prevents shipping
 * unreadable / broken pages.
 */
async function runStoredContentAudit(_req: NextRequest, auth: PatAuthResult) {
  const db = getDb();

  const contentIssues: Array<{
    severity: 'error' | 'warning';
    message: string;
    location?: string;
    hint?: string;
    code?: string;
    repair?: ContentQualityIssue['repair'];
  }> = [];
  const colorIssues: ColorIssue[] = [];

  // ── Brand + design audit ──────────────────────────────────────────────
  const [settings] = await db
    .select({ brand: globalSettings.brand, contact: globalSettings.contact, design: globalSettings.design })
    .from(globalSettings)
    .where(eq(globalSettings.tenantId, auth.tenantId));

  if (!settings?.brand || typeof settings.brand !== 'object' || Object.keys(settings.brand).length === 0) {
    contentIssues.push({
      severity: 'error',
      message: 'No brand settings found. Call PUT /api/v1/content/brand first with companyName + primaryColor + logoUrl.',
      location: 'brand',
    });
  } else {
    colorIssues.push(...validateBrandPayload(settings.brand as Record<string, unknown>));
  }
  if (settings?.design && typeof settings.design === 'object') {
    colorIssues.push(...validateDesignPayload(settings.design as Record<string, unknown>));
  }

  // ── Page + section audit ──────────────────────────────────────────────
  const allPages = await db.select({ id: pages.id, slug: pages.slug, title: pages.title })
    .from(pages).where(eq(pages.tenantId, auth.tenantId));

  if (allPages.length === 0) {
    contentIssues.push({ severity: 'error', message: 'No pages created yet.', location: 'pages' });
  }

  const pagePolicy = evaluateSitePagePolicy(allPages.map(page => page.slug), {
    industry: auth.tenant.industry,
    capabilities: auth.addons,
  });
  for (const entry of pagePolicy.missingRequired) {
    contentIssues.push({
      code: 'site.required_page_missing',
      severity: 'warning',
      message: `Required core page "${entry.slug}" missing.`,
      location: `pages[${entry.slug}]`,
      hint: `Create "${entry.label}" with slug "${entry.slug}". ${entry.reason}`,
    });
  }
  for (const entry of pagePolicy.missingRecommended) {
    contentIssues.push({
      code: 'site.recommended_page_missing',
      severity: 'warning',
      message: `Recommended ${auth.tenant.industry} page "${entry.slug}" missing.`,
      location: `pages[${entry.slug}]`,
      hint: `Consider "${entry.label}" using one of: ${entry.acceptedSlugs.join(', ')}. ${entry.reason}`,
    });
  }

  const allSections = allPages.length > 0
    ? await db.select({ pageId: pageSections.pageId, type: pageSections.type, data: pageSections.data, styleOverrides: pageSections.styleOverrides })
      .from(pageSections).where(inArray(pageSections.pageId, allPages.map(p => p.id))).orderBy(asc(pageSections.sortOrder))
    : [];
  const [seoGlobalRows, seoPageRows, navigationRows, footerRows] = await Promise.all([
    db.select().from(seoGlobalTable).where(eq(seoGlobalTable.tenantId, auth.tenantId)).limit(1),
    db.select({ pageId: seoPageTable.pageId, metaTitle: seoPageTable.metaTitle, metaDescription: seoPageTable.metaDescription, ogImage: seoPageTable.ogImage })
      .from(seoPageTable).where(eq(seoPageTable.tenantId, auth.tenantId)),
    db.select({ items: navigationTable.items, cta: navigationTable.cta })
      .from(navigationTable).where(eq(navigationTable.tenantId, auth.tenantId)).limit(1),
    db.select({ columns: footerTable.columns, legalLinks: footerTable.legalLinks, cta: footerTable.cta })
      .from(footerTable).where(eq(footerTable.tenantId, auth.tenantId)).limit(1),
  ]);
  const seoByPage = new Map(seoPageRows.map(row => [row.pageId, row]));
  const sectionsByPage = new Map<string, typeof allSections>();
  for (const s of allSections) { const arr = sectionsByPage.get(s.pageId) || []; arr.push(s); sectionsByPage.set(s.pageId, arr); }

  for (const p of allPages) {
    const sections = sectionsByPage.get(p.id) || [];
    if (sections.length === 0) {
      contentIssues.push({
        severity: 'error',
        message: `Page "${p.title || p.slug}" has no sections.`,
        location: `pages[${p.slug}]`,
        hint: 'Use PUT /api/v1/content/pages/:id to add sections.',
      });
    }
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const data = (s.data || {}) as Record<string, unknown>;
      const loc = `pages[${p.slug}].sections[${i}] (${s.type})`;

      const requireArray = (key: string, min = 1, hint?: string) => {
        const v = data[key];
        if (!Array.isArray(v) || v.length < min) {
          contentIssues.push({
            severity: 'error', message: `${loc}: data.${key} must be an array with ≥${min} items.`, location: loc, hint,
          });
        }
      };
      const requireString = (key: string) => {
        if (typeof data[key] !== 'string' || !(data[key] as string).trim()) {
          contentIssues.push({ severity: 'error', message: `${loc}: data.${key} is required and must be non-empty.`, location: loc });
        }
      };

      switch (s.type) {
        case 'hero':         requireString('headline'); break;
        case 'servicesGrid': requireArray('manualCards', 3, 'Each card needs { title, text, icon?, href? }. Field name is manualCards NOT services.'); requireString('headline'); break;
        case 'faq':          requireArray('items', 3, 'Each item needs { question, answer }.'); requireString('headline'); break;
        case 'testimonials': requireArray('items', 3, 'Each item needs { quote, name }.'); requireString('headline'); break;
        case 'processSteps': requireArray('steps', 3, 'Each step needs { icon, title, text }.'); break;
        case 'uspStrip':     requireArray('items', 3, 'Each item needs { icon, title, text }.'); break;
        case 'team':
        case 'teamShowcase':
        case 'doctorTeam':   {
          const m = data.members || data.doctors;
          if (!Array.isArray(m) || m.length < 2) {
            contentIssues.push({ severity: 'error', message: `${loc}: members/doctors must have ≥2 entries.`, location: loc });
          }
          break;
        }
        case 'galleryGrid':
        case 'gallery':      requireArray('images', 4, 'Each image needs { src, alt }.'); break;
        case 'contact':      requireString('headline'); break;
        case 'ctaBand':      requireString('headline'); break;
      }

      if (s.styleOverrides && typeof s.styleOverrides === 'object') {
        const issues = validateSectionStyleOverrides(i, s.type, s.styleOverrides as Record<string, unknown>);
        for (const issue of issues) {
          colorIssues.push({ ...issue, location: `${p.slug} → ${issue.location ?? `sections[${i}]`}` });
        }
      }
    }
  }

  // ── Variety / anti-repetition audit ───────────────────────────────────
  // The most common failure of AI-built sites is mechanical repetition: every
  // page opens with the same hero type and closes with the same CTA band, and
  // CTA labels/headlines repeat verbatim. These are warnings (they don't block
  // publish) but the AI is told to react to warnings, so they drive real
  // variety instead of a template stamped N times.
  const LEGAL_SLUGS = new Set(['impressum', 'datenschutz', 'agb', 'widerrufsbelehrung']);
  const contentPages = allPages.filter((p) => !LEGAL_SLUGS.has(p.slug));
  const localizedFirst = (data: Record<string, unknown>): Record<string, unknown> => {
    if (data && data._localized) {
      const first = Object.entries(data).find(([k]) => k !== '_localized' && /^[a-z]{2}(-[A-Z]{2})?$/.test(k));
      if (first && first[1] && typeof first[1] === 'object') return first[1] as Record<string, unknown>;
    }
    return data;
  };

  if (contentPages.length >= 4) {
    const openers: Record<string, number> = {};
    const closers: Record<string, number> = {};
    for (const p of contentPages) {
      const secs = sectionsByPage.get(p.id) || [];
      if (!secs.length) continue;
      openers[secs[0].type] = (openers[secs[0].type] || 0) + 1;
      closers[secs[secs.length - 1].type] = (closers[secs[secs.length - 1].type] || 0) + 1;
    }
    const total = contentPages.length;
    const topOpener = Object.entries(openers).sort((a, b) => b[1] - a[1])[0];
    const topCloser = Object.entries(closers).sort((a, b) => b[1] - a[1])[0];
    // More than ~65% of pages sharing one opener/closer type reads as a stamped template.
    if (topOpener && topOpener[1] > Math.max(3, Math.ceil(total * 0.65))) {
      contentIssues.push({
        severity: 'warning',
        message: `${topOpener[1]} of ${total} content pages open with the same section type "${topOpener[0]}". Vary the opening section across pages.`,
        location: 'variety.openers',
        hint: 'Mix hero styles per page — e.g. editorialHero, cinematicHero, collectionHero, glowHero. No opener type should cover more than ~half the pages.',
      });
    }
    if (topCloser && topCloser[1] > Math.max(3, Math.ceil(total * 0.65))) {
      contentIssues.push({
        severity: 'warning',
        message: `${topCloser[1]} of ${total} content pages end with the same section type "${topCloser[0]}". Vary the closing section.`,
        location: 'variety.closers',
        hint: 'Alternate closers — e.g. ctaBand, immersiveCtaBanner, faq, contact — so the ending does not feel copy-pasted.',
      });
    }
  }

  // Repeated CTA labels / headlines verbatim across many sections.
  const ctaLabelCounts: Record<string, number> = {};
  const headlineCounts: Record<string, number> = {};
  for (const s of allSections) {
    const data = localizedFirst((s.data || {}) as Record<string, unknown>);
    const cta = (data.ctaPrimary || data.primaryCta || data.cta) as { label?: string } | undefined;
    const label = cta?.label?.trim();
    if (label) ctaLabelCounts[label] = (ctaLabelCounts[label] || 0) + 1;
    const headline = typeof data.headline === 'string' ? data.headline.trim() : '';
    if (headline) headlineCounts[headline] = (headlineCounts[headline] || 0) + 1;
  }
  for (const [label, n] of Object.entries(ctaLabelCounts)) {
    if (n >= 5) {
      contentIssues.push({
        severity: 'warning',
        message: `The CTA label "${label}" is used ${n} times. Make CTAs specific to each section's action.`,
        location: 'variety.ctaLabels',
        hint: 'Replace generic repeated CTAs with action-specific labels (e.g. "Zimmer ansehen", "Termin anfragen", "Menü öffnen").',
      });
    }
  }
  for (const [headline, n] of Object.entries(headlineCounts)) {
    if (n >= 3) {
      contentIssues.push({
        severity: 'warning',
        message: `The headline "${headline}" appears ${n} times verbatim. Write a distinct headline per section.`,
        location: 'variety.headlines',
      });
    }
  }

  // ── Collections / collection items audit ──────────────────────────────
  const allCollections = await db.select().from(collections).where(eq(collections.tenantId, auth.tenantId));
  const collectionIds = allCollections.map(c => c.id);
  const allItems = collectionIds.length > 0
    ? await db.select().from(collectionItems).where(and(inArray(collectionItems.collectionId, collectionIds), eq(collectionItems.tenantId, auth.tenantId)))
    : [];
  const itemsByCollection = new Map<string, typeof allItems>();
  for (const it of allItems) { const arr = itemsByCollection.get(it.collectionId) || []; arr.push(it); itemsByCollection.set(it.collectionId, arr); }

  for (const col of allCollections) {
    const items = itemsByCollection.get(col.id) || [];
    for (const it of items) {
      const data = (it.data || {}) as Record<string, unknown>;
      const sections = (data.sections as Array<{ id?: string; type: string; data: Record<string, unknown> }> | undefined) || [];
      const hero = sections.find((s) => s.type === 'hero' || s.type === 'collectionHero');
      const hasImage = data.image || hero?.data?.bgImage || hero?.data?.backgroundImage || hero?.data?.image;
      if (!hasImage) {
        contentIssues.push({
          severity: 'warning',
          message: `Collection "${col.key}" → item "${it.slug}": no preview image.`,
          location: `collections[${col.key}].items[${it.slug}]`,
          hint: 'Set bgImage on the first hero/collectionHero section, or set data.image directly.',
        });
      }
      for (let i = 0; i < sections.length; i++) {
        if (!sections[i].id) {
          contentIssues.push({
            severity: 'warning',
            message: `Collection "${col.key}" → item "${it.slug}" → sections[${i}] missing id (UUIDv4).`,
            location: `collections[${col.key}].items[${it.slug}].sections[${i}]`,
            hint: 'Add { id: "<uuid-v4>" } to every section so the editor Drag&Drop works.',
          });
        }
      }
    }
  }

  // ── Deterministic content quality audit ─────────────────────────────
  // This is intentionally additive: legacy clients still receive the same
  // contentIssues array, while newer agents can use stable codes + repair
  // instructions to patch one exact location instead of regenerating pages.
  const qualityResult = validateContentQuality({
    mode: 'stored',
    brand: (settings?.brand || {}) as Record<string, unknown>,
    contact: (settings?.contact || {}) as Record<string, unknown>,
    seoGlobal: (seoGlobalRows[0] || {}) as Record<string, unknown>,
    navigation: navigationRows[0] || {},
    footer: footerRows[0] || {},
    pages: allPages.map(page => ({
      id: page.id,
      slug: page.slug,
      title: page.title,
      seo: {
        metaTitle: seoByPage.get(page.id)?.metaTitle || undefined,
        metaDescription: seoByPage.get(page.id)?.metaDescription || undefined,
        ogImage: seoByPage.get(page.id)?.ogImage || undefined,
      },
      sections: (sectionsByPage.get(page.id) || []).map(section => ({
        type: section.type,
        data: (section.data || {}) as Record<string, unknown>,
        styleOverrides: (section.styleOverrides || undefined) as Record<string, unknown> | undefined,
      })),
    })),
    collections: allCollections.map(col => ({
      key: col.key,
      items: (itemsByCollection.get(col.id) || []).map(item => ({
        slug: item.slug,
        title: item.title,
        data: (item.data || {}) as Record<string, unknown>,
      })),
    })),
    sectionSchemas: getSectionSchemas(auth.tenant.industry),
  });
  const existingIssueKeys = new Set(contentIssues.map(entry => `${entry.location || ''}:${entry.message}`));
  for (const qualityIssue of qualityResult.issues) {
    const key = `${qualityIssue.location}:${qualityIssue.message}`;
    if (existingIssueKeys.has(key)) continue;
    existingIssueKeys.add(key);
    contentIssues.push(qualityIssue);
  }

  const summary = {
    contentErrors:   contentIssues.filter((i) => i.severity === 'error').length,
    contentWarnings: contentIssues.filter((i) => i.severity === 'warning').length,
    colorErrors:     colorIssues.filter((i) => i.severity === 'error').length,
    colorWarnings:   colorIssues.filter((i) => i.severity === 'warning').length,
    qualityWarnings: qualityResult.summary.warnings,
    pages:           allPages.length,
    collections:     allCollections.length,
    collectionItems: allItems.length,
  };
  const readyToPublish = summary.contentErrors === 0
    && summary.colorErrors === 0
    && summary.qualityWarnings === 0;

  return NextResponse.json({
    readyToPublish,
    summary,
    contentIssues,
    colorIssues,
    quality: {
      summary: qualityResult.summary,
      issueCodes: Array.from(new Set(qualityResult.issues.map(entry => entry.code))).sort(),
    },
  });
}

const runPatStoredContentAudit = withApiHandler(runStoredContentAudit);

/**
 * The stored-content audit is shared by PAT clients and the authenticated
 * admin publish action. An Authorization header always wins, preventing a
 * browser session from shadowing a PAT that belongs to another tenant.
 */
export async function GET(req: NextRequest) {
  if (req.headers.has('authorization')) return runPatStoredContentAudit(req);

  const session = await getWritableSession();
  if (!session) return runPatStoredContentAudit(req);

  const db = getDb();
  const [tenantRows, addonRows] = await Promise.all([
    db.select({
      name: tenants.name,
      industry: tenants.industry,
      slug: tenants.slug,
      activeStyle: tenants.activeStyle,
      i18nEnabled: tenants.i18nEnabled,
      i18nLocales: tenants.i18nLocales,
      i18nDefaultLocale: tenants.i18nDefaultLocale,
    }).from(tenants).where(and(eq(tenants.id, session.tenantId), eq(tenants.status, 'active'))).limit(1),
    db.select({ key: tenantAddons.addonKey })
      .from(tenantAddons)
      .where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.active, true))),
  ]);
  const tenant = tenantRows[0];
  if (!tenant) {
    return NextResponse.json({
      success: false,
      code: 'TENANT_NOT_FOUND',
      error: 'The active tenant could not be found.',
      retryable: false,
    }, { status: 404 });
  }

  return runStoredContentAudit(req, {
    tenantId: session.tenantId,
    tokenId: 'admin-session',
    addons: addonRows.map(addon => addon.key),
    tenant,
  });
}

/**
 * POST /api/v1/content/validate
 *
 * Read-only preflight for weak models. It validates siteProfile + the complete
 * page plan before any tenant row is written. Invalid plans still return 200:
 * the response is a repair queue, not a transport failure to retry unchanged.
 */
export const POST = withApiHandler(async (req, auth) => {
  const rawBody = await req.json();
  if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
    return NextResponse.json({
      success: false,
      code: 'INVALID_VALIDATION_BODY',
      error: 'Request body must be a JSON object.',
      hint: 'Send { mode: "profile"|"plan", siteProfile, pages?, collections? }.',
      retryable: false,
    }, { status: 400 });
  }
  const body = rawBody as Partial<ContentQualityInput> & { mode?: string };
  if (body.mode !== 'profile' && body.mode !== 'plan') {
    return NextResponse.json({
      success: false,
      code: 'INVALID_VALIDATION_MODE',
      error: 'POST /content/validate supports mode="profile" or mode="plan".',
      hint: 'Validate verified identity first with mode="profile", then send the complete siteProfile + pages with mode="plan".',
      retryable: false,
    }, { status: 400 });
  }

  const activeAddons = new Set(auth.addons);
  const allowedSectionTypes = getSectionTypesForIndustry(auth.tenant.industry, {
    hasShop: activeAddons.has('shop'),
    hasBooking: activeAddons.has('booking'),
  })
    .filter(entry => !entry.requiresAddon
      || (entry.requiresAddon === 'shop' && activeAddons.has('shop'))
      || (entry.requiresAddon === 'booking' && activeAddons.has('booking')))
    .map(entry => entry.type)
    .filter((type): type is string => Boolean(type) && !['freeHtml', 'htmlBlock', 'html'].includes(type));

  const result = validateContentQuality({
    mode: body.mode,
    siteProfile: body.siteProfile || null,
    brand: body.brand || {},
    contact: body.contact || {},
    seoGlobal: body.seoGlobal || {},
    navigation: body.navigation || {},
    footer: body.footer || {},
    pages: Array.isArray(body.pages) ? body.pages : [],
    collections: Array.isArray(body.collections) ? body.collections : [],
    allowedSectionTypes,
    sectionSchemas: getSectionSchemas(auth.tenant.industry),
  });

  return NextResponse.json({
    success: true,
    mode: body.mode,
    valid: result.valid,
    readyToWrite: result.valid,
    summary: result.summary,
    issues: result.issues,
    repairQueue: result.issues
      .slice()
      .sort((a, b) => Number(b.severity === 'error') - Number(a.severity === 'error'))
      .map(entry => ({ code: entry.code, severity: entry.severity, location: entry.location, repair: entry.repair })),
  });
});
