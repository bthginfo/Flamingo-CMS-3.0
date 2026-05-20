import { getLeads } from './actions';
import { LeadsClient } from './leads-client';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const leads = await getLeads();
  return <LeadsClient initialLeads={leads} />;
}
