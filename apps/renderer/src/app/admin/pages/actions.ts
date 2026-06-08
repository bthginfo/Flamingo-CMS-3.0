'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { validateSectionData } from '@/lib/validate-section';
import { pages, pageSections, tenants, globalSettings, tenantAddons, collections, collectionItems, products } from '@flamingo/db';
import { eq, and, asc, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BOOKING_SECTION_TYPES } from '@/lib/booking-core';
import { SECTION_PREVIEW_DATA } from '@/lib/section-preview-data';
import { SECTION_EDITOR_FIELD_DEFAULTS } from '@/lib/section-editor-field-defaults';

async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

export async function getPagesAction() {
  const session = await requireSession();
  const db = getDb();
  return db.select().from(pages).where(eq(pages.tenantId, session.tenantId)).orderBy(asc(pages.sortOrder), desc(pages.updatedAt));
}

export async function ensureDefaultPages() {
  const session = await requireSession();
  const db = getDb();
  const existing = await db.select({ slug: pages.slug }).from(pages).where(eq(pages.tenantId, session.tenantId));
  const slugs = new Set(existing.map(p => p.slug));
  const defaults = [
    { slug: 'impressum', title: 'Impressum' },
    { slug: 'datenschutz', title: 'Datenschutz' },
  ];
  for (const d of defaults) {
    if (!slugs.has(d.slug)) {
      await db.insert(pages).values({ tenantId: session.tenantId, title: d.title, slug: d.slug, type: 'free', status: 'draft', visible: true, sortOrder: 99 });
    }
  }

  // Auto-create shop pages if shop addon is active
  const [shopAddon] = await db.select({ active: tenantAddons.active }).from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, 'shop')))
    .limit(1);
  if (shopAddon?.active) {
    for (const def of SHOP_PAGE_DEFS) {
      if (!slugs.has(def.slug)) {
        const [page] = await db.insert(pages).values({
          tenantId: session.tenantId, title: def.title, slug: def.slug, type: 'system', status: 'published', visible: true, sortOrder: def.sortOrder,
        }).returning({ id: pages.id });
        for (const section of def.sections) {
          await db.insert(pageSections).values({
            tenantId: session.tenantId, pageId: page.id, type: section.type, data: section.data, sortOrder: 0, locked: true, titleInternal: `[Shop] ${def.title}`,
          });
        }
      }
    }
  }
}

export async function createPageAction(formData: FormData) {
  const session = await requireSession();
  const db = getDb();
  const title = (formData.get('title') as string)?.trim();
  if (!title) return;
  const slug = title.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/(^-|-$)/g, '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  const [page] = await db.insert(pages).values({
    tenantId: session.tenantId,
    title,
    slug: slug || 'neue-seite',
    type: 'free',
    status: 'draft',
  }).returning();
  revalidatePath('/admin/pages');
  redirect(`/admin/pages/${page.id}`);
}

export async function deletePageAction(pageId: string) {
  const session = await requireSession();
  const db = getDb();
  await db.delete(pages).where(and(eq(pages.id, pageId), eq(pages.tenantId, session.tenantId)));
  revalidatePath('/admin/pages');
}

export async function updatePageAction(pageId: string, data: { title?: string; slug?: string; visible?: boolean; status?: 'draft' | 'published' | 'archived' }) {
  const session = await requireSession();
  const db = getDb();
  await db.update(pages).set({ ...data, updatedAt: new Date() }).where(and(eq(pages.id, pageId), eq(pages.tenantId, session.tenantId)));
  revalidatePath('/admin/pages');
  revalidatePath(`/admin/pages/${pageId}`);
}

export async function getPageWithSectionsAction(pageId: string) {
  const session = await requireSession();
  const db = getDb();
  const [pageResult, sectionsResult, tenantResult, brandResult, shopAddonResult, bookingAddonResult, collectionsResult] = await Promise.all([
    db.select().from(pages).where(and(eq(pages.id, pageId), eq(pages.tenantId, session.tenantId))),
    db.select().from(pageSections).where(and(eq(pageSections.pageId, pageId), eq(pageSections.tenantId, session.tenantId))).orderBy(asc(pageSections.sortOrder)),
    db.select({ industry: tenants.industry, activeStyle: tenants.activeStyle, i18nEnabled: tenants.i18nEnabled, i18nLocales: tenants.i18nLocales, i18nDefaultLocale: tenants.i18nDefaultLocale }).from(tenants).where(eq(tenants.id, session.tenantId)).limit(1),
    db.select({ brand: globalSettings.brand }).from(globalSettings).where(eq(globalSettings.tenantId, session.tenantId)).limit(1),
    db.select({ active: tenantAddons.active }).from(tenantAddons).where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, 'shop'))).limit(1),
    db.select({ active: tenantAddons.active }).from(tenantAddons).where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, 'booking'))).limit(1),
    db.select().from(collections).where(eq(collections.tenantId, session.tenantId)),
  ]);
  const page = pageResult[0];
  if (!page) return null;
  const tenant = tenantResult[0];
  const i18n = tenant?.i18nEnabled ? { enabled: true, locales: (tenant.i18nLocales || 'de').split(','), defaultLocale: tenant.i18nDefaultLocale || 'de' } : undefined;
  // Build collections with items for live preview
  const colIds = collectionsResult.map(c => c.id);
  const allItems = colIds.length > 0
    ? await db.select().from(collectionItems).where(and(eq(collectionItems.tenantId, session.tenantId), eq(collectionItems.published, true))).orderBy(asc(collectionItems.priority))
    : [];
  const previewCollections = collectionsResult.map(c => ({
    key: c.key, label: c.label,
    items: allItems.filter(i => i.collectionId === c.id).map(i => ({ id: i.id, title: i.title, slug: i.slug, data: i.data })),
  }));
  // Load shop products for live preview (avoid client-side fetch in admin iframe)
  const previewProducts = shopAddonResult[0]?.active
    ? await db.select().from(products).where(and(eq(products.tenantId, session.tenantId), eq(products.status, 'active'))).limit(20)
    : [];
  return { page, sections: sectionsResult, industry: tenant?.industry ?? 'tradesman', styleVariant: 'classic', brand: (brandResult[0]?.brand as Record<string, string>) || {}, hasShop: !!shopAddonResult[0]?.active, hasBooking: !!bookingAddonResult[0]?.active, i18n, collections: previewCollections, tenantId: session.tenantId, previewProducts };
}

export async function addSectionAction(pageId: string, type: string) {
  const session = await requireSession();
  const db = getDb();
  if (BOOKING_SECTION_TYPES.has(type)) {
    const [bookingAddon] = await db.select({ active: tenantAddons.active }).from(tenantAddons)
      .where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, 'booking')))
      .limit(1);
    if (!bookingAddon?.active) return null;
  }
  // Get max sort order
  const existing = await db.select({ sortOrder: pageSections.sortOrder }).from(pageSections).where(and(eq(pageSections.pageId, pageId), eq(pageSections.tenantId, session.tenantId))).orderBy(desc(pageSections.sortOrder)).limit(1);
  const nextOrder = (existing[0]?.sortOrder ?? -1) + 1;
  // Seed new sections with realistic preview data so the live preview shows
  // visible content the moment a section is added (some templates short-
  // circuit on empty arrays / missing fields and would otherwise render
  // nothing). Defaults are merged from both sources; SECTION_PREVIEW_DATA
  // wins when both are present so the user sees richer demo content.
  const seedData: Record<string, unknown> = {
    ...(SECTION_EDITOR_FIELD_DEFAULTS[type] || {}),
    ...(SECTION_PREVIEW_DATA[type] || {}),
  };
  const [section] = await db.insert(pageSections).values({
    tenantId: session.tenantId,
    pageId,
    type,
    data: seedData,
    sortOrder: nextOrder,
  }).returning();
  revalidatePath(`/admin/pages/${pageId}`);
  return section;
}

export async function updateSectionAction(sectionId: string, data: Record<string, unknown>, pageId: string) {
  const session = await requireSession();
  const db = getDb();
  // Validate & sanitize section data
  let cleanData: Record<string, unknown>;
  try {
    cleanData = validateSectionData(data);
  } catch (e) {
    return { error: 'Ungültige Section-Daten' };
  }
  const result = await db.update(pageSections).set({ data: cleanData, updatedAt: new Date() }).where(and(eq(pageSections.id, sectionId), eq(pageSections.tenantId, session.tenantId))).returning({ id: pageSections.id });
  if (result.length === 0) {
    return { error: 'Section nicht gefunden oder keine Berechtigung' };
  }
  return { success: true };
}

export async function updateSectionMetaAction(sectionId: string, meta: { visible?: boolean; titleInternal?: string; variant?: string; container?: string; spacingTop?: string; spacingBottom?: string; anchorId?: string; styleOverrides?: Record<string, unknown> | null }, pageId?: string) {
  const session = await requireSession();
  const db = getDb();
  const result = await db.update(pageSections).set({ ...meta, updatedAt: new Date() }).where(and(eq(pageSections.id, sectionId), eq(pageSections.tenantId, session.tenantId))).returning({ id: pageSections.id });
  if (result.length === 0) {
    return { error: 'Section nicht gefunden oder keine Berechtigung' };
  }
  return { success: true };
}

export async function deleteSectionAction(sectionId: string, pageId: string) {
  const session = await requireSession();
  const db = getDb();
  // Prevent deletion of locked sections (shop system sections)
  const [section] = await db.select({ locked: pageSections.locked }).from(pageSections).where(and(eq(pageSections.id, sectionId), eq(pageSections.tenantId, session.tenantId))).limit(1);
  if (section?.locked) return;
  await db.delete(pageSections).where(and(eq(pageSections.id, sectionId), eq(pageSections.tenantId, session.tenantId)));
  revalidatePath(`/admin/pages/${pageId}`);
}

export async function reorderSectionsAction(pageId: string, sectionIds: string[]) {
  const session = await requireSession();
  const db = getDb();
  await Promise.all(
    sectionIds.map((id, i) =>
      db.update(pageSections).set({ sortOrder: i }).where(and(eq(pageSections.id, id), eq(pageSections.tenantId, session.tenantId)))
    )
  );
  revalidatePath(`/admin/pages/${pageId}`);
}

// ─── Shop Page Management ─────────────────────────────────────────────

const SHOP_PAGE_DEFS = [
  { slug: 'shop', title: 'Shop', sortOrder: 50, sections: [{ type: 'shopProductGrid', data: { headline: 'Unsere Produkte', showCategories: true, showSearch: true, showSort: true, columns: 3 } }] },
  { slug: 'warenkorb', title: 'Warenkorb', sortOrder: 51, sections: [{ type: 'shopCart', data: { headline: 'Dein Warenkorb', emptyText: 'Dein Warenkorb ist leer.', continueShoppingLabel: 'Weiter einkaufen', checkoutLabel: 'Zur Kasse' } }] },
  { slug: 'checkout', title: 'Checkout', sortOrder: 52, sections: [{ type: 'shopCheckout', data: { headline: 'Kasse' } }] },
  { slug: 'bestellung-abgeschlossen', title: 'Bestellung abgeschlossen', sortOrder: 53, sections: [{ type: 'shopThankYou', data: { headline: 'Vielen Dank für deine Bestellung!', subline: 'Du erhältst in Kürze eine Bestätigung per E-Mail.', continueShoppingLabel: 'Zurück zum Shop' } }] },
  { slug: 'agb', title: 'AGB', sortOrder: 54, sections: [{ type: 'legalContent', data: { headline: 'Allgemeine Geschäftsbedingungen', blocks: [] } }] },
  { slug: 'widerrufsbelehrung', title: 'Widerrufsbelehrung', sortOrder: 55, sections: [{ type: 'legalContent', data: { headline: 'Widerrufsbelehrung', blocks: [] } }] },
];

export async function getShopPageStatus() {
  const session = await requireSession();
  const db = getDb();
  const existing = await db.select({ slug: pages.slug }).from(pages).where(eq(pages.tenantId, session.tenantId));
  const slugs = new Set(existing.map(p => p.slug));
  return SHOP_PAGE_DEFS.map(def => ({ slug: def.slug, title: def.title, exists: slugs.has(def.slug) }));
}

export async function addShopPageAction(slug: string) {
  const session = await requireSession();
  const db = getDb();
  const def = SHOP_PAGE_DEFS.find(d => d.slug === slug);
  if (!def) return { error: 'Unbekannte Shop-Seite' };

  // Check not already existing
  const [existing] = await db.select({ id: pages.id }).from(pages)
    .where(and(eq(pages.tenantId, session.tenantId), eq(pages.slug, def.slug)))
    .limit(1);
  if (existing) return { error: 'Seite existiert bereits' };

  const [page] = await db.insert(pages).values({
    tenantId: session.tenantId,
    title: def.title,
    slug: def.slug,
    type: 'system',
    status: 'published',
    visible: true,
    sortOrder: def.sortOrder,
  }).returning({ id: pages.id });

  for (const section of def.sections) {
    await db.insert(pageSections).values({
      tenantId: session.tenantId,
      pageId: page.id,
      type: section.type,
      data: section.data,
      sortOrder: 0,
      locked: true,
      titleInternal: `[Shop] ${def.title}`,
    });
  }

  revalidatePath('/admin/pages');
  return { success: true };
}

export async function isShopPageSlug(slug: string): Promise<boolean> {
  return SHOP_PAGE_DEFS.some(d => d.slug === slug);
}
