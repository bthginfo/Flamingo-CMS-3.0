'use server';

import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

/**
 * Publish = invalidate all cached pages so the frontend re-reads from DB.
 * No more snapshot blob — frontend reads directly from pages/page_sections.
 */
export async function publishAction() {
  const cookieStore = await cookies();
  if (cookieStore.get('flamingo_demo')?.value === '1') {
    return { error: 'Veröffentlichung ist im Demo-Modus deaktiviert.' };
  }
  await requireSession();

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
