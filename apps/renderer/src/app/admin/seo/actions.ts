'use server';

import { getDb } from '@/lib/db';
import { getSession, getWritableSession } from '@/lib/session';
import { globalSettings, seoGlobal, seoPage, seoItem } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { revalidateTenantPublicData } from '@/lib/tenant-cache-invalidation';

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

export async function getSeoGlobalAction() {
  const session = await requireSession();
  const db = getDb();
  const [row] = await db.select().from(seoGlobal).where(eq(seoGlobal.tenantId, session.tenantId)).limit(1);
  return row ?? null;
}

export async function getLocalSeoAction() {
  const session = await requireSession();
  const db = getDb();
  const [row] = await db.select({ brand: globalSettings.brand }).from(globalSettings).where(eq(globalSettings.tenantId, session.tenantId)).limit(1);
  const brand = (row?.brand as Record<string, unknown>) || {};
  return (brand.localSeo as Record<string, unknown> | undefined) || {};
}

function parseCoordinate(raw: string, min: number, max: number): number | undefined {
  const n = Number(raw.trim().replace(',', '.'));
  return Number.isFinite(n) && n >= min && n <= max ? n : undefined;
}

function parseServices(raw: string): { name: string; description?: string; url?: string }[] {
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [name, description, url] = line.split('|').map(p => p.trim());
      return {
        name,
        ...(description ? { description } : {}),
        ...(url ? { url } : {}),
      };
    })
    .filter(s => s.name)
    .slice(0, 24);
}

export async function saveLocalSeoAction(data: {
  businessType: string;
  priceRange: string;
  serviceArea: string;
  googleBusinessUrl: string;
  sameAsText: string;
  latitude: string;
  longitude: string;
  ratingValue: string;
  ratingCount: string;
  servicesText: string;
}) {
  const session = await requireWriteSession();
  const db = getDb();
  const [row] = await db.select({ id: globalSettings.id, brand: globalSettings.brand }).from(globalSettings).where(eq(globalSettings.tenantId, session.tenantId)).limit(1);
  const brand = (row?.brand as Record<string, unknown>) || {};
  const latitude = parseCoordinate(data.latitude, -90, 90);
  const longitude = parseCoordinate(data.longitude, -180, 180);
  const ratingValue = parseCoordinate(data.ratingValue, 0, 5);
  const ratingCountNum = Number(data.ratingCount.trim());
  const ratingCount = Number.isFinite(ratingCountNum) && ratingCountNum > 0 ? Math.round(ratingCountNum) : undefined;
  const services = parseServices(data.servicesText);
  const localSeo = {
    businessType: data.businessType.trim(),
    priceRange: data.priceRange.trim(),
    serviceArea: data.serviceArea.trim(),
    googleBusinessUrl: data.googleBusinessUrl.trim(),
    sameAs: data.sameAsText.split('\n').map(line => line.trim()).filter(Boolean),
    ...(latitude !== undefined && longitude !== undefined ? { latitude, longitude } : {}),
    ...(ratingValue !== undefined && ratingCount !== undefined ? { ratingValue, ratingCount } : {}),
    ...(services.length ? { services } : {}),
  };

  if (row) {
    await db.update(globalSettings).set({ brand: { ...brand, localSeo }, updatedAt: new Date() }).where(eq(globalSettings.id, row.id));
  } else {
    await db.insert(globalSettings).values({ tenantId: session.tenantId, brand: { localSeo } });
  }

  revalidatePath('/admin/seo');
  revalidateTenantPublicData(session.tenantId);
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
  const session = await requireWriteSession();
  const db = getDb();
  const [existing] = await db.select({ id: seoGlobal.id }).from(seoGlobal).where(eq(seoGlobal.tenantId, session.tenantId)).limit(1);

  if (existing) {
    await db.update(seoGlobal).set({ ...data, updatedAt: new Date() }).where(eq(seoGlobal.id, existing.id));
  } else {
    await db.insert(seoGlobal).values({ tenantId: session.tenantId, ...data });
  }
  revalidatePath('/admin/seo');
  revalidateTenantPublicData(session.tenantId);
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
  const session = await requireWriteSession();
  const db = getDb();
  const [existing] = await db.select({ id: seoPage.id }).from(seoPage).where(and(eq(seoPage.tenantId, session.tenantId), eq(seoPage.pageId, pageId))).limit(1);

  if (existing) {
    await db.update(seoPage).set({ ...data, updatedAt: new Date() }).where(eq(seoPage.id, existing.id));
  } else {
    await db.insert(seoPage).values({ tenantId: session.tenantId, pageId, ...data });
  }
  revalidatePath(`/admin/pages/${pageId}`);
  revalidateTenantPublicData(session.tenantId);
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
  const session = await requireWriteSession();
  const db = getDb();
  const [existing] = await db.select({ id: seoItem.id }).from(seoItem).where(and(eq(seoItem.tenantId, session.tenantId), eq(seoItem.collectionItemId, collectionItemId))).limit(1);

  if (existing) {
    await db.update(seoItem).set({ ...data, updatedAt: new Date() }).where(eq(seoItem.id, existing.id));
  } else {
    await db.insert(seoItem).values({ tenantId: session.tenantId, collectionItemId, ...data });
  }
  revalidatePath('/admin/collections');
  revalidateTenantPublicData(session.tenantId);
}
