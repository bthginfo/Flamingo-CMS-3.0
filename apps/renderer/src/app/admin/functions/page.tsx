import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { FunctionsClient } from './functions-client';

export default async function FunctionsPage() {
  const session = await getSession();
  let i18nEnabled = false;
  if (session?.tenantId) {
    const db = getDb();
    const [tenant] = await db.select({ i18nEnabled: tenants.i18nEnabled }).from(tenants).where(eq(tenants.id, session.tenantId)).limit(1);
    i18nEnabled = tenant?.i18nEnabled ?? false;
  }
  return <FunctionsClient i18nEnabled={i18nEnabled} />;
}
