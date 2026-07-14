'use server';

import { getDb } from '@/lib/db';
import { getSession, getWritableSession } from '@/lib/session';
import { reservations } from '@flamingo/db';
import { eq, and, desc } from 'drizzle-orm';

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

export async function getReservations() {
  const session = await requireTenant();
  if (session.role === 'demo') return [];
  const tenantId = session.tenantId;
  const db = getDb();
  return db.select().from(reservations).where(eq(reservations.tenantId, tenantId)).orderBy(desc(reservations.createdAt));
}

export async function updateReservationStatus(id: string, status: string) {
  const tenantId = await requireWritableTenant();
  const db = getDb();
  await db.update(reservations).set({ status, updatedAt: new Date() }).where(and(
    eq(reservations.id, id),
    eq(reservations.tenantId, tenantId),
  ));
}
