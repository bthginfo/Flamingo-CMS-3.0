import { getLeads } from './actions';
import { LeadsClient } from './leads-client';
import { getDb } from '@/lib/db';
import { tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const leads = await getLeads();
  const db = getDb();
  const leadTenants = await db.select({ id: tenants.id, name: tenants.name, slug: tenants.slug }).from(tenants).where(eq(tenants.isLead, true));
  return <LeadsClient initialLeads={leads} leadTenants={leadTenants} />;
}
