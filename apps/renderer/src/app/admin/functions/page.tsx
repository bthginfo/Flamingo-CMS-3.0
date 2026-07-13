import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { tenantAddons, tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { FunctionsClient } from './functions-client';

export default async function FunctionsPage() {
  const session = await getSession();
  let i18nEnabled = false;
  let bookingEnabled = false;
  let bookingRequested = false;
  let shopEnabled = false;
  if (session?.tenantId) {
    const db = getDb();
    const [tenant, addonRows] = await Promise.all([
      db.select({ i18nEnabled: tenants.i18nEnabled }).from(tenants).where(eq(tenants.id, session.tenantId)).limit(1),
      db.select({ key: tenantAddons.addonKey, active: tenantAddons.active }).from(tenantAddons)
        .where(eq(tenantAddons.tenantId, session.tenantId)),
    ]);
    i18nEnabled = tenant[0]?.i18nEnabled ?? false;
    const bookingAddon = addonRows.find(addon => addon.key === 'booking');
    bookingEnabled = bookingAddon?.active ?? false;
    bookingRequested = Boolean(bookingAddon && !bookingAddon.active);
    shopEnabled = addonRows.some(addon => addon.key === 'shop' && addon.active);
  }
  return <FunctionsClient i18nEnabled={i18nEnabled} bookingEnabled={bookingEnabled} bookingRequested={bookingRequested} shopEnabled={shopEnabled} />;
}
