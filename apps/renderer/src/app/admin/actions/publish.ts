'use server';

import { getSession } from '@/lib/session';
import { getDb } from '@/lib/db';
import { getDraftSnapshot } from '@/lib/snapshot';
import { pages, publishedSnapshots, publishHistory } from '@flamingo/db';
import { eq, and, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

/**
 * Publish = mark all draft pages as published + invalidate all cached pages.
 */
export async function publishAction() {
  const session = await requireSession();
  const cookieStore = await cookies();
  if (cookieStore.get('flamingo_public_demo')?.value === session.tenantId) {
    return { error: 'Veröffentlichung ist im Demo-Modus deaktiviert.' };
  }

  // Mark all draft pages as published
  const db = getDb();
  await db.update(pages).set({ status: 'published' }).where(and(eq(pages.tenantId, session.tenantId), eq(pages.status, 'draft')));

  const snapshot = await getDraftSnapshot(session.tenantId);
  if (!snapshot) return { error: 'Keine Inhalte zum Veröffentlichen gefunden.' };
  const checksum = createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
  const [latest] = await db
    .select({ id: publishedSnapshots.id, version: publishedSnapshots.version })
    .from(publishedSnapshots)
    .where(eq(publishedSnapshots.tenantId, session.tenantId))
    .orderBy(desc(publishedSnapshots.version))
    .limit(1);

  await db.update(publishedSnapshots)
    .set({ isActive: false })
    .where(and(eq(publishedSnapshots.tenantId, session.tenantId), eq(publishedSnapshots.isActive, true)));

  const [created] = await db.insert(publishedSnapshots).values({
    tenantId: session.tenantId,
    version: (latest?.version ?? 0) + 1,
    snapshot: snapshot as unknown as Record<string, unknown>,
    checksum,
    createdBy: 'admin',
    isActive: true,
  }).returning({ id: publishedSnapshots.id });

  if (created?.id) {
    await db.insert(publishHistory).values({
      tenantId: session.tenantId,
      snapshotId: created.id,
      previousSnapshotId: latest?.id ?? null,
      action: 'publish',
      note: 'Published from admin',
    });
  }

  // Invalidate all frontend caches
  revalidatePath('/', 'layout');

  // Also trigger renderer revalidation endpoint if configured
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3002';
  if (revalidateSecret) {
    try {
      await fetch(`${baseUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': revalidateSecret },
      });
    } catch {
      // Not critical
    }
  }

  return { success: true };
}
