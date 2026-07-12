import { createHash, timingSafeEqual } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';

import { getDb } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const AUTH_TOKEN_HASH = '2bd750145380744c995d784ed56ee09bf0814523d92f629b76c94bf1aea1bd1d';

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS "public_flow_requests" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "tenant_id" uuid NOT NULL,
    "flow" varchar(20) NOT NULL,
    "idempotency_key" uuid NOT NULL,
    "request_hash" varchar(64) NOT NULL,
    "status" varchar(20) DEFAULT 'processing' NOT NULL,
    "resource_id" uuid,
    "response" jsonb,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "public_flow_requests_tenant_id_tenants_id_fk"
      FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action,
    CONSTRAINT "public_flow_requests_flow_check" CHECK ("flow" IN ('booking', 'checkout')),
    CONSTRAINT "public_flow_requests_status_check" CHECK ("status" IN ('processing', 'completed', 'failed', 'uncertain'))
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "public_flow_requests_tenant_key_idx"
    ON "public_flow_requests" USING btree ("tenant_id", "flow", "idempotency_key")`,
  `CREATE INDEX IF NOT EXISTS "public_flow_requests_status_idx"
    ON "public_flow_requests" USING btree ("status", "created_at")`,
] as const;

function authorized(request: NextRequest) {
  const value = request.headers.get('authorization');
  if (!value?.startsWith('Bearer ')) return false;
  const token = value.slice('Bearer '.length).trim();
  if (token.length < 32) return false;
  const actual = createHash('sha256').update(token, 'utf8').digest();
  const expected = Buffer.from(AUTH_TOKEN_HASH, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ ok: false }, { status: 404 });

  try {
    const db = getDb();
    for (const statement of STATEMENTS) await db.execute(sql.raw(statement));
    await db.execute(sql.raw(
      'SELECT "tenant_id", "flow", "idempotency_key", "request_hash", "status", "response" FROM "public_flow_requests" LIMIT 0',
    ));
    return NextResponse.json({ ok: true, migration: '0018_public_flow_security' });
  } catch (error) {
    console.error('[migration:0018] failed', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json({ ok: false, code: 'migration_failed' }, { status: 500 });
  }
}
