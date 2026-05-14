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

async function collectSnapshot(tenantId: string) {
  const db = getDb();
  const allPages = await db.select().from(pages).where(eq(pages.tenantId, tenantId)).orderBy(asc(pages.sortOrder));
  const allSections = await db.select().from(pageSections).where(eq(pageSections.tenantId, tenantId)).orderBy(asc(pageSections.sortOrder));
  const allCollections = await db.select().from(collections).where(eq(collections.tenantId, tenantId));
  const allItems = await db.select().from(collectionItems).where(and(eq(collectionItems.tenantId, tenantId), eq(collectionItems.published, true))).orderBy(asc(collectionItems.priority));

  return {
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
}

export async function publishAction() {
  const cookieStore = await cookies();
  if (cookieStore.get('flamingo_demo')?.value === '1') {
    return { error: 'Veröffentlichung ist im Demo-Modus deaktiviert.' };
  }
  const session = await requireSession();
  const db = getDb();
  const tenantId = session.tenantId;

  const [latest] = await db.select({ version: publishedSnapshots.version })
    .from(publishedSnapshots)
    .where(eq(publishedSnapshots.tenantId, tenantId))
    .orderBy(desc(publishedSnapshots.version))
    .limit(1);
  const nextVersion = (latest?.version ?? 0) + 1;

  const snapshot = await collectSnapshot(tenantId);
  const snapshotJson = JSON.stringify(snapshot);
  const checksum = crypto.createHash('sha256').update(snapshotJson).digest('hex');

  await db.update(publishedSnapshots)
    .set({ isActive: false })
    .where(and(eq(publishedSnapshots.tenantId, tenantId), eq(publishedSnapshots.isActive, true)));

  const [snap] = await db.insert(publishedSnapshots).values({
    tenantId,
    version: nextVersion,
    snapshot: snapshot as unknown as Record<string, unknown>,
    checksum,
    isActive: true,
    createdBy: 'admin',
  }).returning();

  await db.insert(publishHistory).values({
    tenantId,
    snapshotId: snap.id,
    action: 'publish',
  });

  await db.update(pages)
    .set({ status: 'published', updatedAt: new Date() })
    .where(eq(pages.tenantId, tenantId));

  await db.delete(draftStates)
    .where(eq(draftStates.tenantId, tenantId));

  revalidatePath('/admin');
  revalidatePath('/admin/pages');

  const revalidateSecret = process.env.REVALIDATE_SECRET;
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3002';
  if (revalidateSecret) {
    try {
      await fetch(`${baseUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': revalidateSecret },
      });
    } catch {
      // Renderer revalidation failed, not critical
    }
  }

  return { version: nextVersion, checksum };
}
