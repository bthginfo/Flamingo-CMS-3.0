'use server';

import { getDb } from '@/lib/db';
import { leads } from '@flamingo/db';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export type Lead = typeof leads.$inferSelect;
type LeadInsert = typeof leads.$inferInsert;

export async function getLeads(): Promise<Lead[]> {
  const db = getDb();
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function createLead(data: Omit<LeadInsert, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
  const db = getDb();
  const [lead] = await db.insert(leads).values(data).returning();
  revalidatePath('/crm/leads');
  return lead;
}

export async function updateLead(id: string, data: Partial<Omit<LeadInsert, 'id' | 'createdAt'>>): Promise<Lead> {
  const db = getDb();
  const [lead] = await db.update(leads).set({ ...data, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
  revalidatePath('/crm/leads');
  return lead;
}

export async function deleteLead(id: string): Promise<void> {
  const db = getDb();
  await db.delete(leads).where(eq(leads.id, id));
  revalidatePath('/crm/leads');
}
