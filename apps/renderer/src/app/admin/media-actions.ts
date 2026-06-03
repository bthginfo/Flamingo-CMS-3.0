'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { mediaAssets } from '@flamingo/db';
import { eq, desc } from 'drizzle-orm';
import { del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

async function requireTenant() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session.tenantId;
}

export type MediaAsset = {
  id: string;
  blobUrl: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  createdAt: Date;
};

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const tenantId = await requireTenant();
  const db = getDb();
  const rows = await db.select().from(mediaAssets)
    .where(eq(mediaAssets.tenantId, tenantId))
    .orderBy(desc(mediaAssets.createdAt));
  return rows.map(r => ({
    id: r.id,
    blobUrl: r.blobUrl,
    filename: r.filename,
    mimeType: r.mimeType,
    size: r.size,
    width: r.width,
    height: r.height,
    alt: r.alt,
    createdAt: r.createdAt,
  }));
}

export async function saveMediaRecord(data: {
  blobUrl: string;
  pathname: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  blurDataUrl?: string;
}) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [row] = await db.insert(mediaAssets).values({
    tenantId,
    blobUrl: data.blobUrl,
    pathname: data.pathname,
    filename: data.filename,
    mimeType: data.mimeType,
    size: data.size,
    width: data.width || null,
    height: data.height || null,
    metadata: data.blurDataUrl ? { blurDataUrl: data.blurDataUrl } : null,
  }).returning();
  revalidatePath('/admin/media');
  return row;
}

export async function deleteMediaAsset(id: string) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [asset] = await db.select().from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);
  if (!asset || asset.tenantId !== tenantId) throw new Error('Not found');

  // Delete from Vercel Blob
  try {
    await del(asset.blobUrl);
  } catch {
    // Blob may already be deleted, continue
  }

  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
  revalidatePath('/admin/media');
  return { success: true };
}

export async function updateMediaAlt(id: string, alt: string) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [asset] = await db.select().from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);
  if (!asset || asset.tenantId !== tenantId) throw new Error('Not found');

  await db.update(mediaAssets).set({ alt, updatedAt: new Date() }).where(eq(mediaAssets.id, id));
  revalidatePath('/admin/media');
  return { success: true };
}

export async function updateMediaDimensions(id: string, dimensions: { width: number; height: number }) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [asset] = await db.select().from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);
  if (!asset || asset.tenantId !== tenantId) throw new Error('Not found');

  await db.update(mediaAssets).set({ width: dimensions.width, height: dimensions.height, updatedAt: new Date() }).where(eq(mediaAssets.id, id));
  revalidatePath('/admin/media');
  return { success: true };
}
