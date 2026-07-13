'use server';

import { globalSettings, tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/db';
import { getSession, getWritableSession } from '@/lib/session';
import {
  createSeededBusinessProfile,
  getBusinessProfileCompleteness,
  parseBusinessProfile,
  readPersistedBusinessProfile,
} from '@/lib/business-profile';

export async function getBusinessProfileState() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  const db = getDb();
  const [[tenant], [settings]] = await Promise.all([
    db.select({ name: tenants.name }).from(tenants).where(eq(tenants.id, session.tenantId)).limit(1),
    db.select({
      businessProfile: globalSettings.businessProfile,
      brand: globalSettings.brand,
      contact: globalSettings.contact,
    }).from(globalSettings).where(eq(globalSettings.tenantId, session.tenantId)).limit(1),
  ]);
  if (!tenant) throw new Error('Tenant nicht gefunden.');

  const persisted = readPersistedBusinessProfile(settings?.businessProfile);
  const profile = persisted || createSeededBusinessProfile({
    tenantName: tenant.name,
    brand: settings?.brand as Record<string, unknown> | null | undefined,
    contact: settings?.contact as Record<string, unknown> | null | undefined,
  });
  return {
    profile,
    completeness: getBusinessProfileCompleteness(profile),
    isPersisted: Boolean(persisted),
    persistedProfileInvalid: settings?.businessProfile != null && !persisted,
  };
}

export async function saveBusinessProfileAction(input: unknown) {
  const session = await getWritableSession();
  if (!session) return { success: false as const, error: 'Diese Demo-Sitzung ist schreibgeschützt.' };
  const parsed = parseBusinessProfile(input);
  if (!parsed.success) return { success: false as const, error: parsed.error };

  const db = getDb();
  const [existing] = await db.select({ id: globalSettings.id })
    .from(globalSettings)
    .where(eq(globalSettings.tenantId, session.tenantId))
    .limit(1);
  if (existing) {
    await db.update(globalSettings)
      .set({ businessProfile: parsed.data, updatedAt: new Date() })
      .where(eq(globalSettings.tenantId, session.tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId: session.tenantId, businessProfile: parsed.data });
  }
  revalidatePath('/admin/business-profile');
  revalidatePath('/admin/content-health');
  return {
    success: true as const,
    profile: parsed.data,
    completeness: getBusinessProfileCompleteness(parsed.data),
  };
}
