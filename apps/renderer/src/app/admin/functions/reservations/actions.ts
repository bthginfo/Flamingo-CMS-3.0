'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { reservations } from '@flamingo/db';
import { eq, desc } from 'drizzle-orm';

async function requireTenant() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session.tenantId;
}

export async function getReservations() {
  const tenantId = await requireTenant();
  const db = getDb();
  return db.select().from(reservations).where(eq(reservations.tenantId, tenantId)).orderBy(desc(reservations.createdAt));
}

export async function updateReservationStatus(id: string, status: string) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.update(reservations).set({ status, updatedAt: new Date() }).where(eq(reservations.id, id));
}
