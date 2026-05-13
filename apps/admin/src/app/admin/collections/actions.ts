'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { collections, collectionItems } from '@flamingo/db';
import { eq, and, asc, desc } from 'drizzle-orm';
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

export async function ensureDefaultCollections() {
  const session = await requireSession();
  const db = getDb();
  const defaults = [
    { key: 'services', label: 'Leistungen' },
    { key: 'projects', label: 'Projekte' },
    { key: 'team', label: 'Team' },
    { key: 'news', label: 'News & Blog' },
  ];
  for (const d of defaults) {
    const existing = await db.select().from(collections).where(and(eq(collections.tenantId, session.tenantId), eq(collections.key, d.key)));
    if (existing.length === 0) {
      await db.insert(collections).values({ tenantId: session.tenantId, key: d.key, label: d.label });
    }
  }
}

export async function getCollectionByKeyAction(key: string) {
  const session = await requireSession();
  const db = getDb();
  const [collection] = await db.select().from(collections).where(and(eq(collections.tenantId, session.tenantId), eq(collections.key, key)));
  return collection ?? null;
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
