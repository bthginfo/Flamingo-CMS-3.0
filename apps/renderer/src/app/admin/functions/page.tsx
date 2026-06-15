import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { tenantAddons, tenants } from '@flamingo/db';
import { and, eq } from 'drizzle-orm';
import { FunctionsClient } from './functions-client';

export default async function FunctionsPage() {
  const session = await getSession();
  let i18nEnabled = false;
  let bookingEnabled = false;
  if (session?.tenantId) {
    const db = getDb();
    const [tenant, bookingAddon] = await Promise.all([
      db.select({ i18nEnabled: tenants.i18nEnabled }).from(tenants).where(eq(tenants.id, session.tenantId)).limit(1),
      db.select({ active: tenantAddons.active }).from(tenantAddons).where(and(eq(tenantAddons.tenantId, session.tenantId), eq(tenantAddons.addonKey, 'booking'))).limit(1),
    ]);
    i18nEnabled = tenant[0]?.i18nEnabled ?? false;
    bookingEnabled = bookingAddon[0]?.active ?? false;
  }
  return <FunctionsClient i18nEnabled={i18nEnabled} bookingEnabled={bookingEnabled} />;
}
