'use server';

import { getSession } from '@/lib/session';
import { getDb } from '@/lib/db';
import { pages } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

/**
 * Publish = mark all draft pages as published + invalidate all cached pages.
 */
export async function publishAction() {
  const cookieStore = await cookies();
  if (cookieStore.get('flamingo_public_demo')?.value === '1') {
    return { error: 'Veröffentlichung ist im Demo-Modus deaktiviert.' };
  }
  const session = await requireSession();

  // Mark all draft pages as published
  const db = getDb();
  await db.update(pages).set({ status: 'published' }).where(and(eq(pages.tenantId, session.tenantId), eq(pages.status, 'draft')));

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
