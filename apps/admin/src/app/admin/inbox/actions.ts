'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { formSubmissions } from '@flamingo/db';
import { eq, and, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

async function requireTenant() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session.tenantId;
}

export async function getSubmissions() {
  const tenantId = await requireTenant();
  const db = getDb();
  return db.select().from(formSubmissions).where(eq(formSubmissions.tenantId, tenantId)).orderBy(desc(formSubmissions.createdAt)).limit(100);
}

export async function updateSubmissionStatus(id: string, status: 'new' | 'read' | 'archived') {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.update(formSubmissions).set({ status }).where(and(eq(formSubmissions.id, id), eq(formSubmissions.tenantId, tenantId)));
  revalidatePath('/admin/inbox');
}
