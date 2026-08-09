'use server';

import { getDb } from '@/lib/db';
import { getWritableSession } from '@/lib/session';
import { tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { validateI18nSettings } from '@/lib/i18n-admin-settings';
import { revalidateTenantPublicData } from '@/lib/tenant-cache-invalidation';

export async function updateI18nSettings(data: {
  locales: string[];
  defaultLocale: string;
  switcherStyle: string;
  switcherPosition: string;
}) {
  const session = await getWritableSession();
  if (!session?.tenantId) throw new Error('Unauthorized');

  const db = getDb();
  const [tenant] = await db.select({
    enabled: tenants.i18nEnabled,
    maxLanguages: tenants.i18nMaxLanguages,
  }).from(tenants).where(eq(tenants.id, session.tenantId)).limit(1);
  if (!tenant?.enabled) return { error: 'Mehrsprachigkeit ist für diesen Mandanten nicht freigeschaltet.' };

  const validated = validateI18nSettings(data, tenant.maxLanguages);
  if (!validated.value) return { error: validated.error };
  const settings = validated.value;
  await db.update(tenants).set({
    i18nLocales: settings.locales.join(','),
    i18nDefaultLocale: settings.defaultLocale,
    i18nSwitcherStyle: settings.switcherStyle,
    i18nSwitcherPosition: settings.switcherPosition,
    updatedAt: new Date(),
  }).where(eq(tenants.id, session.tenantId));

  revalidatePath('/admin/functions/i18n');
  revalidateTenantPublicData(session.tenantId);
  return { success: true as const };
}
