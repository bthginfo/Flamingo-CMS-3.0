import { getLeads } from '../leads/actions';
import { LeadAnalyticsClient } from './lead-analytics-client';

export const dynamic = 'force-dynamic';

export default async function LeadAnalyticsPage() {
  const leads = await getLeads();
  return <LeadAnalyticsClient initialLeads={leads} />;
}
