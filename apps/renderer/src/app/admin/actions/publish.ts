'use server';

import { getSession } from '@/lib/session';
import { getDb } from '@/lib/db';
import { getDraftSnapshot } from '@/lib/snapshot';
import { pages, publishedSnapshots, publishHistory } from '@flamingo/db';
import { eq, and, desc, lt } from 'drizzle-orm';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

type PublishResult = { success?: true; error?: string; version?: number; unchanged?: true };

function normalizeSnapshotForJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (_key, input) => {
    if (typeof input === 'bigint') return input.toString();
    if (input instanceof Date) return input.toISOString();
    return input;
  })) as T;
}

async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

function revalidateTenant(tenantId: string) {
  revalidateTag(`tenant-${tenantId}`);
  revalidatePath('/', 'layout');
}

/**
 * Publish (Draft/Publish B):
 *  1) Serialize the full draft snapshot from pages/page_sections/collections.
 *  2) Promote draft pages and activate the new published snapshot atomically.
 *  3) Append publish_history in the same transaction.
 *  4) Bust caches after the DB state is consistent.
 */
export async function publishAction(): Promise<PublishResult> {
  try {
    const session = await requireSession();
    const cookieStore = await cookies();
    if (cookieStore.get('flamingo_public_demo')?.value === session.tenantId) {
      return { error: 'Veröffentlichung ist im Demo-Modus deaktiviert.' };
    }

    const db = getDb();
    const tenantId = session.tenantId;

    const rawSnapshot = await getDraftSnapshot(tenantId);
    if (!rawSnapshot) return { error: 'Keine Inhalte zum Veröffentlichen gefunden.' };
    const snapshot = normalizeSnapshotForJson(rawSnapshot);

    const checksum = createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');

    const result = await db.transaction(async (tx) => {
      const [currentActive] = await tx
        .select({ id: publishedSnapshots.id, version: publishedSnapshots.version, checksum: publishedSnapshots.checksum })
        .from(publishedSnapshots)
        .where(and(eq(publishedSnapshots.tenantId, tenantId), eq(publishedSnapshots.isActive, true)))
        .orderBy(desc(publishedSnapshots.version))
        .limit(1);

      await tx.update(pages)
        .set({ status: 'published' })
        .where(and(eq(pages.tenantId, tenantId), eq(pages.status, 'draft')));

      if (currentActive && currentActive.checksum === checksum) {
        return { success: true as const, unchanged: true as const, version: currentActive.version };
      }

      const [latest] = await tx
        .select({ version: publishedSnapshots.version })
        .from(publishedSnapshots)
        .where(eq(publishedSnapshots.tenantId, tenantId))
        .orderBy(desc(publishedSnapshots.version))
        .limit(1);

      await tx.update(publishedSnapshots)
        .set({ isActive: false })
        .where(and(eq(publishedSnapshots.tenantId, tenantId), eq(publishedSnapshots.isActive, true)));

      const nextVersion = (latest?.version ?? 0) + 1;
      const [created] = await tx.insert(publishedSnapshots).values({
        tenantId,
        version: nextVersion,
        snapshot: snapshot as unknown as Record<string, unknown>,
        checksum,
        createdBy: 'admin',
        isActive: true,
      }).returning({ id: publishedSnapshots.id });

      if (!created?.id) throw new Error('Published Snapshot konnte nicht erstellt werden.');

      await tx.insert(publishHistory).values({
        tenantId,
        snapshotId: created.id,
        previousSnapshotId: currentActive?.id ?? null,
        action: 'publish',
        note: `v${nextVersion}`,
      });

      return { success: true as const, version: nextVersion };
    });

    revalidateTenant(tenantId);

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

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Publish-Fehler';
    console.error('[publishAction] failed:', message);
    return { error: `Veröffentlichen fehlgeschlagen: ${message}` };
  }
}

/**
 * Roll back to the most recent prior snapshot.
 */
export async function rollbackPublishAction(): Promise<PublishResult> {
  const session = await requireSession();
  const cookieStore = await cookies();
  if (cookieStore.get('flamingo_public_demo')?.value === session.tenantId) {
    return { error: 'Rollback ist im Demo-Modus deaktiviert.' };
  }

  const db = getDb();
  const tenantId = session.tenantId;

  const result = await db.transaction(async (tx) => {
    const [current] = await tx
      .select({ id: publishedSnapshots.id, version: publishedSnapshots.version })
      .from(publishedSnapshots)
      .where(and(eq(publishedSnapshots.tenantId, tenantId), eq(publishedSnapshots.isActive, true)))
      .orderBy(desc(publishedSnapshots.version))
      .limit(1);

    if (!current) return { error: 'Kein aktiver Snapshot vorhanden.' };

    const [previous] = await tx
      .select({ id: publishedSnapshots.id, version: publishedSnapshots.version })
      .from(publishedSnapshots)
      .where(and(eq(publishedSnapshots.tenantId, tenantId), lt(publishedSnapshots.version, current.version)))
      .orderBy(desc(publishedSnapshots.version))
      .limit(1);

    if (!previous) return { error: 'Kein vorheriger Snapshot vorhanden.' };

    await tx.update(publishedSnapshots)
      .set({ isActive: false })
      .where(and(eq(publishedSnapshots.tenantId, tenantId), eq(publishedSnapshots.isActive, true)));
    await tx.update(publishedSnapshots)
      .set({ isActive: true })
      .where(eq(publishedSnapshots.id, previous.id));

    await tx.insert(publishHistory).values({
      tenantId,
      snapshotId: previous.id,
      previousSnapshotId: current.id,
      action: 'rollback',
      note: `v${current.version} -> v${previous.version}`,
    });

    return { success: true as const, version: previous.version };
  });

  revalidateTenant(tenantId);
  return result;
}
