'use server';

import { getSession } from '@/lib/session';
import { getDb } from '@/lib/db';
import { getDraftSnapshot } from '@/lib/snapshot';
import { pages, publishedSnapshots, publishHistory } from '@flamingo/db';
import { eq, and, desc } from 'drizzle-orm';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

/**
 * Publish (Draft/Publish B):
 *  1) Promote any draft pages to 'published' so the admin "Status" column
 *     matches what's now live.
 *  2) Serialize the full draft snapshot from pages/page_sections/collections.
 *  3) Checksum it. If equal to the active snapshot's checksum, no-op (still
 *     bust caches in case something downstream diverged).
 *  4) Insert new published_snapshots row (version = max+1, isActive=true),
 *     flip previous active off, append publish_history row.
 *  5) revalidateTag('tenant-<id>') so public reads pick up the new version
 *     without waiting for the 60s SWR window.
 */
export async function publishAction(): Promise<{ success?: true; error?: string; version?: number; unchanged?: true }> {
  const session = await requireSession();
  const cookieStore = await cookies();
  if (cookieStore.get('flamingo_public_demo')?.value === session.tenantId) {
    return { error: 'Veröffentlichung ist im Demo-Modus deaktiviert.' };
  }

  const db = getDb();
  const tenantId = session.tenantId;

  await db.update(pages)
    .set({ status: 'published' })
    .where(and(eq(pages.tenantId, tenantId), eq(pages.status, 'draft')));

  const snapshot = await getDraftSnapshot(tenantId);
  if (!snapshot) return { error: 'Keine Inhalte zum Veröffentlichen gefunden.' };

  const checksum = createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');

  const [currentActive] = await db
    .select({ id: publishedSnapshots.id, version: publishedSnapshots.version, checksum: publishedSnapshots.checksum })
    .from(publishedSnapshots)
    .where(and(eq(publishedSnapshots.tenantId, tenantId), eq(publishedSnapshots.isActive, true)))
    .orderBy(desc(publishedSnapshots.version))
    .limit(1);

  if (currentActive && currentActive.checksum === checksum) {
    revalidateTag(`tenant-${tenantId}`);
    revalidatePath('/', 'layout');
    return { success: true, unchanged: true, version: currentActive.version };
  }

  const [latest] = await db
    .select({ version: publishedSnapshots.version })
    .from(publishedSnapshots)
    .where(eq(publishedSnapshots.tenantId, tenantId))
    .orderBy(desc(publishedSnapshots.version))
    .limit(1);

  await db.update(publishedSnapshots)
    .set({ isActive: false })
    .where(and(eq(publishedSnapshots.tenantId, tenantId), eq(publishedSnapshots.isActive, true)));

  const nextVersion = (latest?.version ?? 0) + 1;
  const [created] = await db.insert(publishedSnapshots).values({
    tenantId,
    version: nextVersion,
    snapshot: snapshot as unknown as Record<string, unknown>,
    checksum,
    createdBy: 'admin',
    isActive: true,
  }).returning({ id: publishedSnapshots.id });

  if (created?.id) {
    await db.insert(publishHistory).values({
      tenantId,
      snapshotId: created.id,
      previousSnapshotId: currentActive?.id ?? null,
      action: 'publish',
      note: `v${nextVersion}`,
    });
  }

  revalidateTag(`tenant-${tenantId}`);
  revalidatePath('/', 'layout');

  const revalidateSecret = process.env.REVALIDATE_SECRET;
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3002';
  if (revalidateSecret) {
    try {
      await fetch(`${baseUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': revalidateSecret },
      });
    } catch {
      // Best-effort
    }
  }

  return { success: true, version: nextVersion };
}

/**
 * Rollback to the most recent prior snapshot. Returns null if there's
 * nothing to roll back to.
 */
export async function rollbackPublishAction(): Promise<{ success?: true; error?: string; version?: number }> {
  const session = await requireSession();
  const cookieStore = await cookies();
  if (cookieStore.get('flamingo_public_demo')?.value === session.tenantId) {
    return { error: 'Rollback ist im Demo-Modus deaktiviert.' };
  }

  const db = getDb();
  const tenantId = session.tenantId;

  const rows = await db
    .select({ id: publishedSnapshots.id, version: publishedSnapshots.version, isActive: publishedSnapshots.isActive })
    .from(publishedSnapshots)
    .where(eq(publishedSnapshots.tenantId, tenantId))
    .orderBy(desc(publishedSnapshots.version))
    .limit(2);

  if (rows.length < 2) return { error: 'Kein vorheriger Snapshot vorhanden.' };

  const [current, previous] = rows;

  await db.update(publishedSnapshots).set({ isActive: false }).where(eq(publishedSnapshots.id, current.id));
  await db.update(publishedSnapshots).set({ isActive: true }).where(eq(publishedSnapshots.id, previous.id));

  await db.insert(publishHistory).values({
    tenantId,
    snapshotId: previous.id,
    previousSnapshotId: current.id,
    action: 'rollback',
    note: `v${current.version} → v${previous.version}`,
  });

  revalidateTag(`tenant-${tenantId}`);
  revalidatePath('/', 'layout');
  return { success: true, version: previous.version };
}

