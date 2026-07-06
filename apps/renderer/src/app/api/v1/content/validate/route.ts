import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { pages, pageSections, collections, collectionItems, globalSettings } from '@flamingo/db';
import { eq, and, inArray, asc } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';
import {
  validateBrandPayload,
  validateDesignPayload,
  validateSectionStyleOverrides,
  type ColorIssue,
} from '@/lib/color-validation';

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
export const GET = withApiHandler(async (_req, auth) => {
  const db = getDb();

  const contentIssues: Array<{ severity: 'error' | 'warning'; message: string; location?: string; hint?: string }> = [];
  const colorIssues: ColorIssue[] = [];

  // ── Brand + design audit ──────────────────────────────────────────────
  const [settings] = await db
    .select({ brand: globalSettings.brand, design: globalSettings.design })
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

  const requiredSlugs = ['startseite', 'leistungen', 'ueber-uns', 'kontakt', 'impressum', 'datenschutz'];
  const existingSlugs = new Set(allPages.map((p) => p.slug));
  for (const slug of requiredSlugs) {
    if (!existingSlugs.has(slug)) {
      contentIssues.push({
        severity: 'warning',
        message: `Required page "${slug}" missing.`,
        location: `pages[${slug}]`,
        hint: `POST /api/v1/content/pages with { slug: "${slug}", title: "...", sections: [...] }`,
      });
    }
  }

  const allSections = allPages.length > 0
    ? await db.select({ pageId: pageSections.pageId, type: pageSections.type, data: pageSections.data, styleOverrides: pageSections.styleOverrides })
      .from(pageSections).where(inArray(pageSections.pageId, allPages.map(p => p.id))).orderBy(asc(pageSections.sortOrder))
    : [];
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

  const summary = {
    contentErrors:   contentIssues.filter((i) => i.severity === 'error').length,
    contentWarnings: contentIssues.filter((i) => i.severity === 'warning').length,
    colorErrors:     colorIssues.filter((i) => i.severity === 'error').length,
    colorWarnings:   colorIssues.filter((i) => i.severity === 'warning').length,
    pages:           allPages.length,
    collections:     allCollections.length,
    collectionItems: allItems.length,
  };
  const readyToPublish = summary.contentErrors === 0 && summary.colorErrors === 0;

  return NextResponse.json({ readyToPublish, summary, contentIssues, colorIssues });
});
