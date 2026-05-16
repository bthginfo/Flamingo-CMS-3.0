/**
 * Create the tenant_api_tokens table.
 * Usage: npx tsx scripts/setup-api-tokens.ts
 */
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS tenant_api_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      token_hash VARCHAR(128) NOT NULL,
      label VARCHAR(100) NOT NULL DEFAULT 'AI Content Token',
      last_used_at TIMESTAMPTZ,
      expires_at TIMESTAMPTZ,
      revoked BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS tenant_api_tokens_tenant_idx ON tenant_api_tokens(tenant_id)`;
  await sql`CREATE INDEX IF NOT EXISTS tenant_api_tokens_hash_idx ON tenant_api_tokens(token_hash)`;
  console.log('✅ Created tenant_api_tokens table');
}

main().catch(console.error);
