import { getInquiries } from './actions';
import { AnfragenClient } from './anfragen-client';

export const dynamic = 'force-dynamic';

export default async function AnfragenPage() {
  const inquiries = await getInquiries();
  return <AnfragenClient initialInquiries={inquiries} />;
}
