'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { mediaAssets } from '@flamingo/db';
import { eq, and, desc } from 'drizzle-orm';
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
  folder: string | null;
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
    folder: r.folder ?? null,
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
  folder?: string | null;
}) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [existing] = await db.select({ id: mediaAssets.id }).from(mediaAssets)
    .where(and(eq(mediaAssets.tenantId, tenantId), eq(mediaAssets.blobUrl, data.blobUrl)))
    .limit(1);

  const patch = {
    pathname: data.pathname,
    filename: data.filename,
    mimeType: data.mimeType,
    size: data.size,
    width: data.width || null,
    height: data.height || null,
    folder: data.folder ?? null,
    metadata: data.blurDataUrl ? { blurDataUrl: data.blurDataUrl } : null,
    updatedAt: new Date(),
  };

  const [row] = existing
    ? await db.update(mediaAssets).set(patch).where(eq(mediaAssets.id, existing.id)).returning()
    : await db.insert(mediaAssets).values({
      tenantId,
      blobUrl: data.blobUrl,
      ...patch,
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

export async function updateMediaFolder(id: string, folder: string | null) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [asset] = await db.select().from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);
  if (!asset || asset.tenantId !== tenantId) throw new Error('Not found');

  const cleaned = folder?.trim() || null;
  await db.update(mediaAssets).set({ folder: cleaned, updatedAt: new Date() }).where(eq(mediaAssets.id, id));
  revalidatePath('/admin/media');
  return { success: true };
}
