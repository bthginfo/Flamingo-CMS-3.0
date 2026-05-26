import { getLeads } from '../leads/actions';
import { getCustomers } from './actions';
import { CustomersClient } from './customers-client';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const [customers, leads] = await Promise.all([getCustomers(), getLeads()]);
  return <CustomersClient initialCustomers={customers} leads={leads} />;
}
