'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { pages, pageSections, publishedSnapshots, publishHistory, draftStates, collections, collectionItems } from '@flamingo/db';
import { eq, and, asc, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

/** Collects all pages + sections into a single JSON snapshot for the tenant. */
async function collectSnapshot(tenantId: string) {
  const db = getDb();
  const allPages = await db.select().from(pages).where(eq(pages.tenantId, tenantId)).orderBy(asc(pages.sortOrder));
  const allSections = await db.select().from(pageSections).where(eq(pageSections.tenantId, tenantId)).orderBy(asc(pageSections.sortOrder));
  const allCollections = await db.select().from(collections).where(eq(collections.tenantId, tenantId));
  const allItems = await db.select().from(collectionItems).where(and(eq(collectionItems.tenantId, tenantId), eq(collectionItems.published, true))).orderBy(asc(collectionItems.priority));

  const snapshot = {
    pages: allPages.map(p => ({
      ...p,
      sections: allSections.filter(s => s.pageId === p.id),
    })),
    collections: allCollections.map(c => ({
      ...c,
      items: allItems.filter(i => i.collectionId === c.id),
    })),
    generatedAt: new Date().toISOString(),
  };
  return snapshot;
}

/** Publish: create a new snapshot version and mark it active. */
export async function publishAction() {
  const cookieStore = await cookies();
  if (cookieStore.get('flamingo_demo')?.value === '1') {
    return { error: 'Veröffentlichung ist im Demo-Modus deaktiviert.' };
  }
  const session = await requireSession();
  const db = getDb();
  const tenantId = session.tenantId;

  // Get current max version
  const [latest] = await db.select({ version: publishedSnapshots.version })
    .from(publishedSnapshots)
    .where(eq(publishedSnapshots.tenantId, tenantId))
    .orderBy(desc(publishedSnapshots.version))
    .limit(1);
  const nextVersion = (latest?.version ?? 0) + 1;

  // Collect snapshot
  const snapshot = await collectSnapshot(tenantId);
  const snapshotJson = JSON.stringify(snapshot);
  const checksum = crypto.createHash('sha256').update(snapshotJson).digest('hex');

  // Deactivate old snapshots
  await db.update(publishedSnapshots)
    .set({ isActive: false })
    .where(and(eq(publishedSnapshots.tenantId, tenantId), eq(publishedSnapshots.isActive, true)));

  // Insert new snapshot
  const [snap] = await db.insert(publishedSnapshots).values({
    tenantId,
    version: nextVersion,
    snapshot: snapshot as unknown as Record<string, unknown>,
    checksum,
    isActive: true,
    createdBy: 'admin',
  }).returning();

  // Record in publish history
  await db.insert(publishHistory).values({
    tenantId,
    snapshotId: snap.id,
    action: 'publish',
  });

  // Mark all pages as published
  await db.update(pages)
    .set({ status: 'published', updatedAt: new Date() })
    .where(eq(pages.tenantId, tenantId));

  // Clear draft states
  await db.delete(draftStates)
    .where(eq(draftStates.tenantId, tenantId));

  revalidatePath('/admin');
  revalidatePath('/admin/pages');

  // Revalidate renderer cache
  const rendererUrl = process.env.NEXT_PUBLIC_RENDERER_URL || 'http://localhost:3002';
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  if (revalidateSecret) {
    try {
      await fetch(`${rendererUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': revalidateSecret },
      });
    } catch {
      // Renderer revalidation failed, not critical
    }
  }

  return { version: nextVersion, checksum };
}

/** Get the active snapshot for preview/rendering. */
export async function getActiveSnapshotAction() {
  const session = await requireSession();
  const db = getDb();
  const [snapshot] = await db.select()
    .from(publishedSnapshots)
    .where(and(eq(publishedSnapshots.tenantId, session.tenantId), eq(publishedSnapshots.isActive, true)))
    .limit(1);
  return snapshot ?? null;
}

/** Get publish history. */
export async function getPublishHistoryAction() {
  const session = await requireSession();
  const db = getDb();
  return db.select()
    .from(publishHistory)
    .where(eq(publishHistory.tenantId, session.tenantId))
    .orderBy(desc(publishHistory.createdAt))
    .limit(20);
}

/** Generate a preview token for draft preview. */
export async function generatePreviewTokenAction() {
  const session = await requireSession();
  const snapshot = await collectSnapshot(session.tenantId);
  // Return snapshot directly for client-side preview (in future: store in KV/blob with short TTL)
  return { snapshot, generatedAt: new Date().toISOString() };
}
