import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { I18nClient } from './i18n-client';

export default async function I18nPage() {
  const session = await getSession();
  if (!session?.tenantId) redirect('/admin');

  const db = getDb();
  const [tenant] = await db.select({
    i18nEnabled: tenants.i18nEnabled,
    i18nLocales: tenants.i18nLocales,
    i18nDefaultLocale: tenants.i18nDefaultLocale,
    i18nMaxLanguages: tenants.i18nMaxLanguages,
    i18nSwitcherStyle: tenants.i18nSwitcherStyle,
    i18nSwitcherPosition: tenants.i18nSwitcherPosition,
  }).from(tenants).where(eq(tenants.id, session.tenantId)).limit(1);

  if (!tenant?.i18nEnabled) redirect('/admin/functions');

  return (
    <I18nClient
      locales={tenant.i18nLocales.split(',')}
      defaultLocale={tenant.i18nDefaultLocale}
      maxLanguages={tenant.i18nMaxLanguages}
      switcherStyle={tenant.i18nSwitcherStyle}
      switcherPosition={tenant.i18nSwitcherPosition}
    />
  );
}
