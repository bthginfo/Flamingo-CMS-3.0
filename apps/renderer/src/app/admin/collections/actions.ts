'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { collections, collectionItems, tenants, globalSettings, pages, pageSections, tenantAddons } from '@flamingo/db';
import { eq, and, asc, desc, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

// ─── Collections ───────────────────────────────────────────────────
export async function getCollectionsAction() {
  const session = await requireSession();
  const db = getDb();
  return db.select().from(collections).where(eq(collections.tenantId, session.tenantId)).orderBy(asc(collections.key));
}

export async function createCollectionAction(formData: FormData) {
  const session = await requireSession();
  const db = getDb();
  const label = (formData.get('label') as string)?.trim();
  if (!label) return;
  const key = label.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/(^-|-$)/g, '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  await db.insert(collections).values({ tenantId: session.tenantId, key: key || 'new', label });
  revalidatePath('/admin/collections');
}

export async function updateCollectionAction(id: string, data: { label?: string; key?: string }) {
  const session = await requireSession();
  const db = getDb();
  await db.update(collections).set({ ...data, updatedAt: new Date() }).where(and(eq(collections.id, id), eq(collections.tenantId, session.tenantId)));
  revalidatePath('/admin/collections');
}

export async function deleteCollectionAction(id: string) {
  const session = await requireSession();
  const db = getDb();
  await db.delete(collectionItems).where(and(eq(collectionItems.collectionId, id), eq(collectionItems.tenantId, session.tenantId)));
  await db.delete(collections).where(and(eq(collections.id, id), eq(collections.tenantId, session.tenantId)));
  revalidatePath('/admin/collections');
}

export async function ensureDefaultCollections() {
  const session = await requireSession();
  const db = getDb();
  const existing = await db.select({ key: collections.key }).from(collections).where(eq(collections.tenantId, session.tenantId));
  const existingKeys = new Set(existing.map(c => c.key));
  const defaults = [
    { key: 'news', label: 'News & Blog' },
  ];
  for (const d of defaults) {
    if (!existingKeys.has(d.key)) {
      await db.insert(collections).values({ tenantId: session.tenantId, key: d.key, label: d.label });
    }
  }
}

const DEFAULT_COLLECTIONS: Record<string, string> = { news: 'News & Blog' };

export async function getCollectionByKeyAction(key: string) {
  const session = await requireSession();
  const db = getDb();
  const [collection] = await db.select().from(collections).where(and(eq(collections.tenantId, session.tenantId), eq(collections.key, key)));
  if (collection) return collection;

  // Auto-create known default collections on first access
  if (DEFAULT_COLLECTIONS[key]) {
    const [created] = await db.insert(collections).values({ tenantId: session.tenantId, key, label: DEFAULT_COLLECTIONS[key] }).returning();
    return created ?? null;
  }
  return null;
}

// ─── Collection Items ──────────────────────────────────────────────
export async function getItemsAction(collectionId: string) {
  const session = await requireSession();
  const db = getDb();
  return db.select().from(collectionItems).where(and(eq(collectionItems.collectionId, collectionId), eq(collectionItems.tenantId, session.tenantId))).orderBy(asc(collectionItems.priority), desc(collectionItems.updatedAt));
}

export async function createItemAction(collectionId: string, formData: FormData) {
  const session = await requireSession();
  const db = getDb();
  const title = (formData.get('title') as string)?.trim();
  if (!title) return;
  const slug = title.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/(^-|-$)/g, '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  await db.insert(collectionItems).values({
    tenantId: session.tenantId,
    collectionId,
    title,
    slug: slug || 'neuer-eintrag',
    data: {},
  });
  revalidatePath('/admin/collections');
}

export async function getItemAction(itemId: string) {
  const session = await requireSession();
  const db = getDb();
  const [item] = await db.select().from(collectionItems).where(and(eq(collectionItems.id, itemId), eq(collectionItems.tenantId, session.tenantId)));
  return item ?? null;
}

export async function updateItemAction(itemId: string, data: { title?: string; slug?: string; published?: boolean; priority?: number; data?: Record<string, unknown> }) {
  const session = await requireSession();
  const db = getDb();
  await db.update(collectionItems).set({ ...data, updatedAt: new Date() }).where(and(eq(collectionItems.id, itemId), eq(collectionItems.tenantId, session.tenantId)));
  revalidatePath('/admin/collections');
}

export async function deleteItemAction(itemId: string) {
  const session = await requireSession();
  const db = getDb();
  await db.delete(collectionItems).where(and(eq(collectionItems.id, itemId), eq(collectionItems.tenantId, session.tenantId)));
  revalidatePath('/admin/collections');
}

/** Returns all collections with their items for the internal link selector. */
export async function getCollectionLinksAction() {
  const session = await requireSession();
  const db = getDb();
  const cols = await db.select().from(collections).where(eq(collections.tenantId, session.tenantId)).orderBy(asc(collections.key));
  const items = await db.select({ id: collectionItems.id, collectionId: collectionItems.collectionId, title: collectionItems.title, slug: collectionItems.slug })
    .from(collectionItems).where(eq(collectionItems.tenantId, session.tenantId)).orderBy(asc(collectionItems.priority));
  return cols.map(c => ({
    key: c.key,
    label: c.label,
    items: items.filter(i => i.collectionId === c.id).map(i => ({ title: i.title, slug: i.slug })),
  }));
}

export async function getItemWithIndustryAction(itemId: string) {
  const session = await requireSession();
  const db = getDb();
  const [item] = await db.select().from(collectionItems).where(and(eq(collectionItems.id, itemId), eq(collectionItems.tenantId, session.tenantId)));
  if (!item) return null;
  const [tenant] = await db.select({
    industry: tenants.industry,
    activeStyle: tenants.activeStyle,
    i18nEnabled: tenants.i18nEnabled,
    i18nLocales: tenants.i18nLocales,
    i18nDefaultLocale: tenants.i18nDefaultLocale,
  }).from(tenants).where(eq(tenants.id, session.tenantId)).limit(1);
  const [brandResult, shopAddonResult, bookingAddonResult] = await Promise.all([
    db.select({ brand: globalSettings.brand }).from(globalSettings).where(eq(globalSettings.tenantId, session.tenantId)).limit(1),
    db.select({ active: tenantAddons.active }).from(tenantAddons).where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, 'shop'))).limit(1),
    db.select({ active: tenantAddons.active }).from(tenantAddons).where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, 'booking'))).limit(1),
  ]);
  const i18n = tenant?.i18nEnabled
    ? { enabled: true, locales: (tenant.i18nLocales || 'de').split(','), defaultLocale: tenant.i18nDefaultLocale || 'de' }
    : undefined;
  return {
    item,
    industry: tenant?.industry ?? 'tradesman',
    styleVariant: tenant?.activeStyle ?? 'classic',
    brand: (brandResult[0]?.brand as Record<string, string>) || {},
    hasShop: !!shopAddonResult[0]?.active,
    hasBooking: !!bookingAddonResult[0]?.active,
    i18n,
  };
}

// ─── Collection Overview Page ──────────────────────────────────────
export async function getOrCreateOverviewPageAction(collectionKey: string): Promise<string> {
  const session = await requireSession();
  const db = getDb();

  // Check if an overview page already exists for this collection (by type + slug or by type + matching collectionKey in section data)
  const overviewSlug = `${collectionKey}-uebersicht`;
  const existing = await db.select({ id: pages.id }).from(pages)
    .where(and(
      eq(pages.tenantId, session.tenantId),
      or(eq(pages.slug, collectionKey), eq(pages.slug, overviewSlug))
    ))
    .limit(1);

  if (existing[0]) return existing[0].id;

  // Also check if slug is already taken by a free page — if so, use a suffixed slug
  const slugTaken = await db.select({ id: pages.id }).from(pages)
    .where(and(eq(pages.tenantId, session.tenantId), eq(pages.slug, collectionKey)))
    .limit(1);

  const slug = slugTaken[0] ? overviewSlug : collectionKey;

  // Get collection label for the page title
  const [col] = await db.select({ label: collections.label }).from(collections)
    .where(and(eq(collections.tenantId, session.tenantId), eq(collections.key, collectionKey)));
  const title = col?.label || collectionKey;

  // Create the overview page
  const [page] = await db.insert(pages).values({
    tenantId: session.tenantId,
    title: `${title} – Übersicht`,
    slug,
    type: 'collection_overview',
    status: 'draft',
    visible: true,
  }).returning();

  // Add a default collectionList section
  await db.insert(pageSections).values({
    tenantId: session.tenantId,
    pageId: page.id,
    type: 'collectionList',
    data: { headline: title, collectionKey, sortBy: 'date-desc', showImage: true, showDate: true, showExcerpt: true, showSortControls: true, columns: 3 },
    sortOrder: 0,
  });

  revalidatePath('/admin/pages');
  return page.id;
}

// Lightweight action returning just keys+labels for dropdowns
export async function getCollectionKeysAction(): Promise<{ key: string; label: string }[]> {
  const session = await requireSession();
  const db = getDb();
  const cols = await db.select({ key: collections.key, label: collections.label }).from(collections).where(eq(collections.tenantId, session.tenantId)).orderBy(asc(collections.key));
  return cols;
}
