'use server';

import { getDb } from '@/lib/db';
import { getSession, getWritableSession } from '@/lib/session';
import { mediaAssets } from '@flamingo/db';
import { eq, and, desc, inArray, ne } from 'drizzle-orm';
import { del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

const MEDIA_LIBRARY_LIMIT = 500;

async function requireTenant() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

async function requireWritableTenant() {
  const session = await getWritableSession();
  if (!session) throw new Error('Diese Demo-Sitzung ist schreibgeschützt.');
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

function isAbsoluteUrl(value: string | null | undefined) {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim());
}

function normalizeMediaUrl(blobUrl: string, pathname: string, filename: string) {
  const blobCandidate = (blobUrl || '').trim();
  const pathnameCandidate = (pathname || '').trim();

  if (isAbsoluteUrl(blobCandidate)) return blobCandidate;
  if (isAbsoluteUrl(pathnameCandidate)) return pathnameCandidate;

  // Legacy rows can contain only a filename/path fragment in blobUrl. Those
  // assets are not resolvable from the browser and would otherwise trigger a
  // wave of 404 requests inside the media modal.
  return '';
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const session = await requireTenant();
  const tenantId = session.tenantId;
  const canWrite = session.role !== 'demo';
  const db = getDb();
  let rows = await db.select().from(mediaAssets)
    .where(eq(mediaAssets.tenantId, tenantId))
    .orderBy(desc(mediaAssets.createdAt))
    .limit(MEDIA_LIBRARY_LIMIT);

  // Self-heal duplicate rows for the same blob URL (the upload webhook and the
  // client's saveMediaRecord used to race each other into two inserts). Keep
  // the richest row, merge missing metadata from the rest, and delete the
  // redundant DB rows — the blob itself is shared, so only rows are removed.
  const groups = new Map<string, typeof rows>();
  for (const row of rows) {
    const key = normalizeMediaUrl(row.blobUrl, row.pathname, row.filename);
    if (!key) continue;
    const group = groups.get(key);
    if (group) group.push(row); else groups.set(key, [row]);
  }
  const duplicateIds = new Set<string>();
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const score = (r: typeof group[number]) =>
      (r.size > 0 ? 4 : 0) + (r.width ? 2 : 0) + (r.alt?.trim() ? 1 : 0);
    group.sort((a, b) => score(b) - score(a) || a.createdAt.getTime() - b.createdAt.getTime());
    const keeper = group[0];
    const merge: Partial<typeof keeper> = {};
    for (const dupe of group.slice(1)) {
      if (!keeper.alt?.trim() && dupe.alt?.trim()) { merge.alt = dupe.alt; keeper.alt = dupe.alt; }
      if (!keeper.folder && dupe.folder) { merge.folder = dupe.folder; keeper.folder = dupe.folder; }
      if (!keeper.width && dupe.width) { merge.width = dupe.width; merge.height = dupe.height; keeper.width = dupe.width; keeper.height = dupe.height; }
      if (!keeper.size && dupe.size) { merge.size = dupe.size; keeper.size = dupe.size; }
      duplicateIds.add(dupe.id);
    }
    if (canWrite && Object.keys(merge).length) {
      await db.update(mediaAssets).set(merge).where(eq(mediaAssets.id, keeper.id));
    }
  }
  if (canWrite && duplicateIds.size) {
    await db.delete(mediaAssets)
      .where(and(eq(mediaAssets.tenantId, tenantId), inArray(mediaAssets.id, [...duplicateIds])));
    rows = rows.filter(row => !duplicateIds.has(row.id));
  }

  const normalizedAssets = rows
    .map(r => {
      const normalizedUrl = normalizeMediaUrl(r.blobUrl, r.pathname, r.filename);
      if (!normalizedUrl) return null;
      return {
        id: r.id,
        blobUrl: normalizedUrl,
        filename: r.filename,
        mimeType: r.mimeType,
        size: r.size,
        width: r.width,
        height: r.height,
        alt: r.alt,
        folder: r.folder ?? null,
        createdAt: r.createdAt,
      };
    })
    .filter((asset): asset is MediaAsset => Boolean(asset));

  // Do not HEAD-probe every blob when the library opens. On tenants with many
  // assets that creates a burst of Blob traffic and slow admin UX. The picker
  // already removes stale rows lazily via the thumbnail onError handler.
  return normalizedAssets;
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
  const tenantId = await requireWritableTenant();
  const db = getDb();
  const normalizedBlobUrl = normalizeMediaUrl(data.blobUrl, data.pathname, data.filename);
  if (!normalizedBlobUrl) {
    throw new Error('Invalid media URL');
  }
  const [existing] = await db.select({ id: mediaAssets.id }).from(mediaAssets)
    .where(and(eq(mediaAssets.tenantId, tenantId), eq(mediaAssets.blobUrl, normalizedBlobUrl)))
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
      blobUrl: normalizedBlobUrl,
      ...patch,
    }).returning()
      .catch(async () => {
        // The upload-completed webhook may have inserted a bookkeeping row for
        // the same blob between our check and this insert (unique index).
        // Converge on that row instead of surfacing an upload error.
        const [raced] = await db.select({ id: mediaAssets.id }).from(mediaAssets)
          .where(and(eq(mediaAssets.tenantId, tenantId), eq(mediaAssets.blobUrl, normalizedBlobUrl)))
          .limit(1);
        if (!raced) throw new Error('Media record could not be saved');
        return db.update(mediaAssets).set(patch).where(eq(mediaAssets.id, raced.id)).returning();
      });

  revalidatePath('/admin/media');
  return row;
}

/** Legacy content-addressed uploads (media/<sha256>.<ext>) are SHARED across
 * tenants: identical files map to the same blob. The physical blob may only be
 * deleted when no other media record — of ANY tenant — still points at it. */
async function blobHasOtherReferences(db: ReturnType<typeof getDb>, blobUrl: string, excludeId: string) {
  const [other] = await db.select({ id: mediaAssets.id }).from(mediaAssets)
    .where(and(eq(mediaAssets.blobUrl, blobUrl), ne(mediaAssets.id, excludeId)))
    .limit(1);
  return Boolean(other);
}

export async function deleteMediaAsset(id: string) {
  const tenantId = await requireWritableTenant();
  const db = getDb();
  const [asset] = await db.select().from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);
  if (!asset || asset.tenantId !== tenantId) throw new Error('Not found');

  // Delete from Vercel Blob — unless another record (any tenant) shares it
  try {
    if (!(await blobHasOtherReferences(db, asset.blobUrl, id))) {
      await del(asset.blobUrl);
    }
  } catch {
    // Blob may already be deleted, continue
  }

  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
  revalidatePath('/admin/media');
  return { success: true };
}

export async function updateMediaAlt(id: string, alt: string) {
  const tenantId = await requireWritableTenant();
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
  const tenantId = await requireWritableTenant();
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
  const tenantId = await requireWritableTenant();
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

export async function deleteMediaFolder(folder: string) {
  const tenantId = await requireWritableTenant();
  const db = getDb();
  const cleaned = folder.trim();
  if (!cleaned) throw new Error('Folder name is required');

  const assets = await db.select({ id: mediaAssets.id, blobUrl: mediaAssets.blobUrl })
    .from(mediaAssets)
    .where(and(eq(mediaAssets.tenantId, tenantId), eq(mediaAssets.folder, cleaned)));

  const blobUrls = assets
    .map(asset => asset.blobUrl)
    .filter(isAbsoluteUrl);

  await Promise.allSettled(
    blobUrls.map(async (blobUrl) => {
      // Skip blobs still referenced by records outside this folder (any tenant)
      const folderIds = new Set(assets.map(a => a.id));
      const refs = await db.select({ id: mediaAssets.id }).from(mediaAssets)
        .where(eq(mediaAssets.blobUrl, blobUrl));
      if (refs.some(r => !folderIds.has(r.id))) return;
      await del(blobUrl);
    }),
  );

  await db.delete(mediaAssets)
    .where(and(eq(mediaAssets.tenantId, tenantId), eq(mediaAssets.folder, cleaned)));

  revalidatePath('/admin/media');
  return { success: true, deleted: assets.length };
}
