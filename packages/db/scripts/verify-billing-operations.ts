import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required.');

const sql = neon(databaseUrl);
const rows = await sql.query(
  `select
    to_regclass('public.billing_payments') is not null as payments,
    to_regclass('public.billing_recurring_schedules') is not null as recurring,
    to_regclass('public.billing_portal_links') is not null as portal`,
  [],
);
const result = rows[0] as { payments: boolean; recurring: boolean; portal: boolean };
if (!result.payments || !result.recurring || !result.portal) throw new Error('Billing operations migration is incomplete.');
console.log(JSON.stringify(result));
