/**
 * Adds PLATFORM_SMTP_* environment variables to all tenant Vercel projects.
 * 
 * Usage: npx tsx scripts/add-platform-smtp-envs.ts
 * 
 * Requires:
 *   VERCEL_TOKEN - Vercel API token
 *   DATABASE_URL - Neon DB connection string
 * 
 * Uses Flamingo Media SMTP: smtp.ionos.de / hello@flamingomedia.online
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { tenants } from '@flamingo/db';
import { isNotNull } from 'drizzle-orm';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const DATABASE_URL = process.env.DATABASE_URL;

if (!VERCEL_TOKEN) { console.error('Missing VERCEL_TOKEN'); process.exit(1); }
if (!DATABASE_URL) { console.error('Missing DATABASE_URL'); process.exit(1); }

const SMTP_ENVS = [
  { key: 'PLATFORM_SMTP_HOST', value: 'smtp.ionos.de' },
  { key: 'PLATFORM_SMTP_PORT', value: '587' },
  { key: 'PLATFORM_SMTP_USER', value: 'hello@flamingomedia.online' },
  { key: 'PLATFORM_SMTP_PASS', value: process.env.PLATFORM_SMTP_PASS || '' },
  { key: 'PLATFORM_SMTP_FROM', value: 'hello@flamingomedia.online' },
];

if (!SMTP_ENVS[3].value) {
  console.error('Missing PLATFORM_SMTP_PASS env var (the IONOS password)');
  process.exit(1);
}

async function addEnvVar(projectId: string, env: { key: string; value: string }) {
  const teamParam = process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : '';
  const res = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env${teamParam}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: env.key,
      value: env.value,
      type: 'encrypted',
      target: ['production', 'preview'],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    // Skip if already exists
    if (body.includes('already exist')) return 'exists';
    throw new Error(`Failed to add ${env.key} to ${projectId}: ${res.status} ${body}`);
  }
  return 'added';
}

async function main() {
  const sql = neon(DATABASE_URL!);
  const db = drizzle(sql);

  const allTenants = await db.select({ id: tenants.id, slug: tenants.slug, vercelProjectId: tenants.vercelProjectId })
    .from(tenants)
    .where(isNotNull(tenants.vercelProjectId));

  console.log(`Found ${allTenants.length} tenants with Vercel projects\n`);

  for (const t of allTenants) {
    console.log(`→ ${t.slug} (${t.vercelProjectId})`);
    for (const env of SMTP_ENVS) {
      try {
        const result = await addEnvVar(t.vercelProjectId!, env);
        console.log(`  ${env.key}: ${result}`);
      } catch (e) {
        console.error(`  ${env.key}: ERROR - ${(e as Error).message}`);
      }
    }
    console.log();
  }

  console.log('Done! Redeploy tenant projects to pick up new env vars.');
}

main().catch(console.error);
