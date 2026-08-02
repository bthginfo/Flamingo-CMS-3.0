'use server';

import { getDb } from '@/lib/db';
import { getSession, getWritableSession } from '@/lib/session';
import { collections, collectionItems, tenants, globalSettings, pages, pageSections, tenantAddons, products } from '@flamingo/db';
import { eq, and, asc, desc, or, not } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BOOKING_SECTION_TYPES } from '@/lib/booking-core';
import { validateSectionData } from '@/lib/validate-section';
import { resolveSectionWriteIdentity } from '@/lib/section-write-identity';
import { normalizeStyleOverridesForSection } from '@/lib/section-style-overrides';

async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

async function requireWriteSession() {
  const session = await getWritableSession();
  if (!session) redirect('/admin/login');
  return session;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function uniqueSlug(base: string, usedSlugs: Set<string>) {
  const cleanBase = slugify(base) || 'kopie';
  let candidate = cleanBase;
  let index = 2;
  while (usedSlugs.has(candidate)) {
    candidate = `${cleanBase}-${index}`;
    index += 1;
  }
  return candidate;
}

function cloneItemData(data: Record<string, unknown>) {
  const copy = JSON.parse(JSON.stringify(data ?? {})) as Record<string, unknown>;
  if (Array.isArray(copy.sections)) {
    copy.sections = copy.sections.map((section) => {
      if (!section || typeof section !== 'object') return section;
      return { ...(section as Record<string, unknown>), id: randomUUID() };
    });
  }
  return copy;
}

async function normalizeCollectionItemData(
  db: ReturnType<typeof getDb>,
  tenantId: string,
  value: Record<string, unknown>,
): Promise<{ data?: Record<string, unknown>; error?: string }> {
  let cleanItemData: Record<string, unknown>;
  try {
    cleanItemData = validateSectionData(value);
  } catch {
    return { error: 'Ungültige Eintragsdaten' };
  }

  if (cleanItemData.sections === undefined) return { data: cleanItemData };
  if (!Array.isArray(cleanItemData.sections)) return { error: 'Sektionen müssen als Liste gespeichert werden' };

  const [[tenant], addonRows] = await Promise.all([
    db.select({ industry: tenants.industry }).from(tenants)
      .where(and(eq(tenants.id, tenantId), eq(tenants.status, 'active'))).limit(1),
    db.select({ key: tenantAddons.addonKey }).from(tenantAddons)
      .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.active, true))),
  ]);
  if (!tenant) return { error: 'Mandant nicht gefunden oder inaktiv' };
  const addons = new Set(addonRows.map(row => row.key));

  const sections: Record<string, unknown>[] = [];
  for (let index = 0; index < cleanItemData.sections.length; index += 1) {
    const raw = cleanItemData.sections[index];
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { error: `Sektion ${index + 1} ist ungültig` };
    const section = raw as Record<string, unknown>;
    const type = typeof section.type === 'string' ? section.type : '';
    if (!type) return { error: `Sektion ${index + 1} hat keinen gültigen Typ` };

    const requiredAddon = BOOKING_SECTION_TYPES.has(type) ? 'booking' : type.startsWith('shop') ? 'shop' : null;
    if (requiredAddon && !addons.has(requiredAddon)) {
      return { error: `Die Section „${type}“ benötigt das aktive ${requiredAddon}-Add-on` };
    }

    const identity = resolveSectionWriteIdentity({
      type,
      industry: tenant.industry,
      definitionKey: typeof section.definitionKey === 'string' ? section.definitionKey : null,
      schemaVersion: typeof section.schemaVersion === 'number' ? section.schemaVersion : null,
    });
    if (!identity.ok) return { error: identity.error };

    let sectionData: Record<string, unknown>;
    try {
      sectionData = validateSectionData(section.data ?? {});
    } catch {
      return { error: `Sektion ${index + 1} enthält ungültige Daten` };
    }

    sections.push({
      ...section,
      type,
      definitionKey: identity.identity.definitionKey,
      schemaVersion: identity.identity.schemaVersion,
      data: sectionData,
      styleOverrides: normalizeStyleOverridesForSection(
        type,
        section.styleOverrides,
        tenant.industry,
        identity.identity.definitionKey,
      ),
    });
  }

  return { data: { ...cleanItemData, sections } };
}

// ─── Collections ───────────────────────────────────────────────────
export async function getCollectionsAction() {
  const session = await requireSession();
  const db = getDb();
  return db.select().from(collections).where(eq(collections.tenantId, session.tenantId)).orderBy(asc(collections.key));
}

export async function createCollectionAction(formData: FormData) {
  const session = await requireWriteSession();
  const db = getDb();
  const label = (formData.get('label') as string)?.trim();
  if (!label) return;
  const key = label.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/(^-|-$)/g, '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  await db.insert(collections).values({ tenantId: session.tenantId, key: key || 'new', label });
  revalidatePath('/admin/collections');
}

export async function updateCollectionAction(id: string, data: { label?: string; key?: string }) {
  const session = await requireWriteSession();
  const db = getDb();
  await db.update(collections).set({ ...data, updatedAt: new Date() }).where(and(eq(collections.id, id), eq(collections.tenantId, session.tenantId)));
  revalidatePath('/admin/collections');
}

export async function deleteCollectionAction(id: string) {
  const session = await requireWriteSession();
  const db = getDb();
  await db.delete(collectionItems).where(and(eq(collectionItems.collectionId, id), eq(collectionItems.tenantId, session.tenantId)));
  await db.delete(collections).where(and(eq(collections.id, id), eq(collections.tenantId, session.tenantId)));
  revalidatePath('/admin/collections');
}

export async function ensureDefaultCollections() {
  const session = await getWritableSession();
  if (!session) return;
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
  const session = await requireWriteSession();
  const db = getDb();
  const title = (formData.get('title') as string)?.trim();
  if (!title) return;
  const [collection] = await db.select({ id: collections.id }).from(collections)
    .where(and(eq(collections.id, collectionId), eq(collections.tenantId, session.tenantId)))
    .limit(1);
  if (!collection) return { error: 'Collection nicht gefunden oder keine Berechtigung' };
  const slug = title.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/(^-|-$)/g, '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  await db.insert(collectionItems).values({
    tenantId: session.tenantId,
    collectionId: collection.id,
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
  const session = await requireWriteSession();
  const db = getDb();
  const normalized = data.data
    ? await normalizeCollectionItemData(db, session.tenantId, data.data)
    : { data: undefined };
  if (normalized.error) return { error: normalized.error };
  const update = data.data ? { ...data, data: normalized.data } : data;
  const result = await db.update(collectionItems)
    .set({ ...update, updatedAt: new Date() })
    .where(and(eq(collectionItems.id, itemId), eq(collectionItems.tenantId, session.tenantId)))
    .returning({ id: collectionItems.id });
  if (result.length === 0) return { error: 'Eintrag nicht gefunden oder keine Berechtigung' };
  revalidatePath('/admin/collections');
  return { success: true };
}

export async function deleteItemAction(itemId: string) {
  const session = await requireWriteSession();
  const db = getDb();
  await db.delete(collectionItems).where(and(eq(collectionItems.id, itemId), eq(collectionItems.tenantId, session.tenantId)));
  revalidatePath('/admin/collections');
}

export async function duplicateItemAction(itemId: string) {
  const session = await requireWriteSession();
  const db = getDb();

  const [sourceItem] = await db
    .select()
    .from(collectionItems)
    .where(and(eq(collectionItems.id, itemId), eq(collectionItems.tenantId, session.tenantId)))
    .limit(1);
  if (!sourceItem) return { error: 'Eintrag nicht gefunden' };

  const [sameCollectionItems, lastItem] = await Promise.all([
    db
      .select({ slug: collectionItems.slug })
      .from(collectionItems)
      .where(and(eq(collectionItems.tenantId, session.tenantId), eq(collectionItems.collectionId, sourceItem.collectionId))),
    db
      .select({ priority: collectionItems.priority })
      .from(collectionItems)
      .where(and(eq(collectionItems.tenantId, session.tenantId), eq(collectionItems.collectionId, sourceItem.collectionId)))
      .orderBy(desc(collectionItems.priority))
      .limit(1),
  ]);

  const slug = uniqueSlug(`${sourceItem.slug || sourceItem.title}-kopie`, new Set(sameCollectionItems.map((item) => item.slug)));
  const [copy] = await db
    .insert(collectionItems)
    .values({
      id: randomUUID(),
      tenantId: session.tenantId,
      collectionId: sourceItem.collectionId,
      title: `${sourceItem.title} Kopie`,
      slug,
      data: cloneItemData(sourceItem.data),
      published: false,
      priority: (lastItem[0]?.priority ?? sourceItem.priority ?? 0) + 1,
    })
    .returning({ id: collectionItems.id });

  revalidatePath('/admin/collections');
  return { success: true, id: copy.id };
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
  const [brandResult, shopAddonResult, bookingAddonResult, collectionsResult] = await Promise.all([
    db.select({ brand: globalSettings.brand }).from(globalSettings).where(eq(globalSettings.tenantId, session.tenantId)).limit(1),
    db.select({ active: tenantAddons.active }).from(tenantAddons).where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, 'shop'))).limit(1),
    db.select({ active: tenantAddons.active }).from(tenantAddons).where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, 'booking'))).limit(1),
    db.select().from(collections).where(eq(collections.tenantId, session.tenantId)),
  ]);
  const i18n = tenant?.i18nEnabled
    ? { enabled: true, locales: (tenant.i18nLocales || 'de').split(','), defaultLocale: tenant.i18nDefaultLocale || 'de' }
    : undefined;
  const allItems = collectionsResult.length > 0
    ? await db.select().from(collectionItems).where(and(eq(collectionItems.tenantId, session.tenantId), eq(collectionItems.published, true))).orderBy(asc(collectionItems.priority))
    : [];
  const previewCollections = collectionsResult.map(collection => ({
    key: collection.key,
    label: collection.label,
    items: allItems
      .filter(candidate => candidate.collectionId === collection.id)
      .map(candidate => ({ id: candidate.id, title: candidate.title, slug: candidate.slug, data: candidate.data })),
  }));
  const previewProducts = shopAddonResult[0]?.active
    ? await db.select().from(products).where(and(eq(products.tenantId, session.tenantId), not(eq(products.status, 'archived')))).orderBy(asc(products.sortOrder)).limit(200)
    : [];
  return {
    item,
    industry: tenant?.industry ?? 'tradesman',
    styleVariant: 'classic',
    brand: (brandResult[0]?.brand as Record<string, string>) || {},
    hasShop: !!shopAddonResult[0]?.active,
    hasBooking: !!bookingAddonResult[0]?.active,
    i18n,
    collections: previewCollections,
    tenantId: session.tenantId,
    previewProducts,
  };
}

// ─── Collection Overview Page ──────────────────────────────────────
export async function getOrCreateOverviewPageAction(collectionKey: string): Promise<string> {
  const session = await requireWriteSession();
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
