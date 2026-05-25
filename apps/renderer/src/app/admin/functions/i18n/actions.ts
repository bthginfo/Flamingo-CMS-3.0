'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateI18nSettings(data: {
  locales: string[];
  defaultLocale: string;
  switcherStyle: string;
  switcherPosition: string;
}) {
  const session = await getSession();
  if (!session?.tenantId) throw new Error('Unauthorized');

  const db = getDb();
  await db.update(tenants).set({
    i18nLocales: data.locales.join(','),
    i18nDefaultLocale: data.defaultLocale,
    i18nSwitcherStyle: data.switcherStyle,
    i18nSwitcherPosition: data.switcherPosition,
    updatedAt: new Date(),
  }).where(eq(tenants.id, session.tenantId));

  revalidatePath('/admin/functions/i18n');
  return { success: true };
}
