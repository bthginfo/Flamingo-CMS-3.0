'use server';

import { getDb } from '@/lib/db';
import { inquiries } from '@flamingo/db';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireCrmAdmin } from '@/lib/session';

export type Inquiry = typeof inquiries.$inferSelect;

export async function getInquiries(): Promise<Inquiry[]> {
  await requireCrmAdmin();
  const db = getDb();
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export async function updateInquiryStatus(id: string, status: 'neu' | 'gelesen' | 'beantwortet' | 'archiviert'): Promise<Inquiry> {
  await requireCrmAdmin();
  const db = getDb();
  const [inquiry] = await db.update(inquiries).set({ status }).where(eq(inquiries.id, id)).returning();
  revalidatePath('/crm/anfragen');
  return inquiry;
}

export async function deleteInquiry(id: string): Promise<void> {
  await requireCrmAdmin();
  const db = getDb();
  await db.delete(inquiries).where(eq(inquiries.id, id));
  revalidatePath('/crm/anfragen');
}
