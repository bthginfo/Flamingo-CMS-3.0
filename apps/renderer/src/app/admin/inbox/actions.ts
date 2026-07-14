'use server';

import { getDb } from '@/lib/db';
import { getSession, getWritableSession } from '@/lib/session';
import { formSubmissions } from '@flamingo/db';
import { eq, and, desc, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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

export async function getSubmissions() {
  const session = await requireTenant();
  if (session.role === 'demo') return [];
  const tenantId = session.tenantId;
  const db = getDb();
  return db.select().from(formSubmissions).where(and(
    eq(formSubmissions.tenantId, tenantId),
    ne(formSubmissions.status, 'archived'),
  )).orderBy(desc(formSubmissions.createdAt)).limit(100);
}

export async function updateSubmissionStatus(id: string, status: 'new' | 'read' | 'archived') {
  const tenantId = await requireWritableTenant();
  const db = getDb();
  await db.update(formSubmissions).set({ status }).where(and(eq(formSubmissions.id, id), eq(formSubmissions.tenantId, tenantId)));
  revalidatePath('/admin/inbox');
}
