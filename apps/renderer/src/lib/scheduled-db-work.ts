import { billingRecurringSchedules, instagramConnections } from '@flamingo/db';
import { and, asc, eq } from 'drizzle-orm';
import { revalidateTag, unstable_cache } from 'next/cache';
import { getDb } from './db';

export const BILLING_WORK_TAG = 'billing-recurring-work';
export const INSTAGRAM_WORK_TAG = 'instagram-connections';
const IDLE_WORK_REVALIDATE_SECONDS = 6 * 60 * 60;

// Cache only the work index, never credentials, invoices or execution results.
// An idle hourly cron can return without waking Postgres. Mutations evict the
// index immediately; the TTL also covers changes made outside the application.
export const getNextBillingRunAt = unstable_cache(async (): Promise<number | null> => {
  const fixedTenantId = process.env.FIXED_TENANT_ID?.trim();
  const [next] = await getDb().select({ nextRunAt: billingRecurringSchedules.nextRunAt })
    .from(billingRecurringSchedules)
    .where(and(eq(billingRecurringSchedules.status, 'active'),
      fixedTenantId ? eq(billingRecurringSchedules.tenantId, fixedTenantId) : undefined))
    .orderBy(asc(billingRecurringSchedules.nextRunAt)).limit(1);
  // Standalone databases contain only their own schedules. Execution retains
  // its tenant boundary and rechecks the live schedule before creating a bill.
  return next ? new Date(next.nextRunAt).getTime() : null;
}, ['billing-next-run-v1', process.env.FIXED_TENANT_ID || 'shared'], { revalidate: IDLE_WORK_REVALIDATE_SECONDS, tags: [BILLING_WORK_TAG] });

export const getInstagramConnectionIds = unstable_cache(async () => {
  const fixedTenantId = process.env.FIXED_TENANT_ID?.trim();
  return getDb().select({ id: instagramConnections.id }).from(instagramConnections)
    .where(fixedTenantId ? eq(instagramConnections.tenantId, fixedTenantId) : undefined);
}, ['instagram-work-index-v1', process.env.FIXED_TENANT_ID || 'shared'], { revalidate: IDLE_WORK_REVALIDATE_SECONDS, tags: [INSTAGRAM_WORK_TAG] });

export function invalidateBillingWork() {
  revalidateTag(BILLING_WORK_TAG);
}

export function invalidateInstagramWork() {
  revalidateTag(INSTAGRAM_WORK_TAG);
}
