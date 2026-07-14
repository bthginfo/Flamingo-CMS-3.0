'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { rsvpResponses } from '@flamingo/db';
import { eq, desc } from 'drizzle-orm';

async function requireTenant() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function getRsvpResponses() {
  const session = await requireTenant();
  if (session.role === 'demo') return [];
  const tenantId = session.tenantId;
  const db = getDb();
  return db.select().from(rsvpResponses).where(eq(rsvpResponses.tenantId, tenantId)).orderBy(desc(rsvpResponses.createdAt)).limit(500);
}
