import { requireDatabaseUrl } from './_database-url';
import { neon } from '@neondatabase/serverless';
const sql = neon(requireDatabaseUrl());

async function main() {
  await sql`ALTER TYPE industry ADD VALUE IF NOT EXISTS 'wedding'`;
  console.log('✅ Added wedding to industry enum');
  
  // Also create RSVP responses table
  await sql`
    CREATE TABLE IF NOT EXISTS rsvp_responses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      attending BOOLEAN NOT NULL DEFAULT true,
      guest_count INTEGER NOT NULL DEFAULT 1,
      guest_names TEXT,
      dietary VARCHAR(100),
      allergies TEXT,
      song_wish VARCHAR(255),
      comment TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS rsvp_responses_tenant_idx ON rsvp_responses(tenant_id)`;
  console.log('✅ Created rsvp_responses table');
}

main().catch(console.error);
