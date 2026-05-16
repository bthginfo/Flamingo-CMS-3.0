'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { seoGlobal, seoPage, seoItem } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

export async function getSeoGlobalAction() {
  const session = await requireSession();
  const db = getDb();
  const [row] = await db.select().from(seoGlobal).where(eq(seoGlobal.tenantId, session.tenantId)).limit(1);
  return row ?? null;
}

export async function saveSeoGlobalAction(data: {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultOgImage: string;
  canonicalBase: string;
  locale: string;
  robots: string;
}) {
  const session = await requireSession();
  const db = getDb();
  const [existing] = await db.select({ id: seoGlobal.id }).from(seoGlobal).where(eq(seoGlobal.tenantId, session.tenantId)).limit(1);

  if (existing) {
    await db.update(seoGlobal).set({ ...data, updatedAt: new Date() }).where(eq(seoGlobal.id, existing.id));
  } else {
    await db.insert(seoGlobal).values({ tenantId: session.tenantId, ...data });
  }
  revalidatePath('/admin/seo');
}

export async function getSeoPageAction(pageId: string) {
  const session = await requireSession();
  const db = getDb();
  const [row] = await db.select().from(seoPage).where(and(eq(seoPage.tenantId, session.tenantId), eq(seoPage.pageId, pageId))).limit(1);
  return row ?? null;
}

export async function saveSeoPageAction(pageId: string, data: {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  canonical: string;
  noindex: boolean;
}) {
  const session = await requireSession();
  const db = getDb();
  const [existing] = await db.select({ id: seoPage.id }).from(seoPage).where(and(eq(seoPage.tenantId, session.tenantId), eq(seoPage.pageId, pageId))).limit(1);

  if (existing) {
    await db.update(seoPage).set({ ...data, updatedAt: new Date() }).where(eq(seoPage.id, existing.id));
  } else {
    await db.insert(seoPage).values({ tenantId: session.tenantId, pageId, ...data });
  }
  revalidatePath(`/admin/pages/${pageId}`);
}

// ─── Collection Item SEO ───────────────────────────────────────────
export async function getSeoItemAction(collectionItemId: string) {
  const session = await requireSession();
  const db = getDb();
  const [row] = await db.select().from(seoItem).where(and(eq(seoItem.tenantId, session.tenantId), eq(seoItem.collectionItemId, collectionItemId))).limit(1);
  return row ?? null;
}

export async function saveSeoItemAction(collectionItemId: string, data: {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  canonical: string;
  noindex: boolean;
}) {
  const session = await requireSession();
  const db = getDb();
  const [existing] = await db.select({ id: seoItem.id }).from(seoItem).where(and(eq(seoItem.tenantId, session.tenantId), eq(seoItem.collectionItemId, collectionItemId))).limit(1);

  if (existing) {
    await db.update(seoItem).set({ ...data, updatedAt: new Date() }).where(eq(seoItem.id, existing.id));
  } else {
    await db.insert(seoItem).values({ tenantId: session.tenantId, collectionItemId, ...data });
  }
  revalidatePath('/admin/collections');
}
