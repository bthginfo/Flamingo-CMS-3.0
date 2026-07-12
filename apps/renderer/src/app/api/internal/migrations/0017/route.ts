import { createHash, timingSafeEqual } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';

import { getDb } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const AUTH_TOKEN_HASH = '3871bef47f270fbfc469f7d955e04da6ef30f1137092933ac60835628e393415';

const MIGRATION_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS "marketing_rate_limits" (
    "key" varchar(160) PRIMARY KEY NOT NULL,
    "hits" integer DEFAULT 1 NOT NULL,
    "window_started_at" timestamp with time zone DEFAULT now() NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS "marketing_rate_limits_expires_idx"
    ON "marketing_rate_limits" USING btree ("expires_at")`,
  `CREATE TABLE IF NOT EXISTS "crm_email_deliveries" (
    "idempotency_key" uuid PRIMARY KEY NOT NULL,
    "purpose" varchar(40) NOT NULL,
    "entity_id" uuid NOT NULL,
    "request_hash" varchar(64) NOT NULL,
    "status" varchar(20) DEFAULT 'sending' NOT NULL,
    "attempt_count" integer DEFAULT 1 NOT NULL,
    "last_error_code" varchar(80),
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "sent_at" timestamp with time zone,
    CONSTRAINT "crm_email_deliveries_status_check"
      CHECK ("status" IN ('sending', 'sent', 'failed', 'uncertain'))
  )`,
  `CREATE INDEX IF NOT EXISTS "crm_email_deliveries_entity_idx"
    ON "crm_email_deliveries" USING btree ("purpose", "entity_id")`,
  `CREATE INDEX IF NOT EXISTS "crm_email_deliveries_status_idx"
    ON "crm_email_deliveries" USING btree ("status", "created_at")`,
  `ALTER TABLE "form_submissions"
    ADD COLUMN IF NOT EXISTS "idempotency_key" uuid,
    ADD COLUMN IF NOT EXISTS "request_hash" varchar(64),
    ADD COLUMN IF NOT EXISTS "notification_status" varchar(20),
    ADD COLUMN IF NOT EXISTS "auto_response_status" varchar(20)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "form_submissions_tenant_idempotency_idx"
    ON "form_submissions" USING btree ("tenant_id", "idempotency_key")`,
] as const;

function isAuthorized(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return false;

  const token = authorization.slice('Bearer '.length).trim();
  if (token.length < 32) return false;

  const actual = createHash('sha256').update(token, 'utf8').digest();
  const expected = Buffer.from(AUTH_TOKEN_HASH, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    const db = getDb();
    for (const statement of MIGRATION_STATEMENTS) {
      await db.execute(sql.raw(statement));
    }

    // These zero-row reads fail if a table or column is still missing.
    await db.execute(sql.raw('SELECT "idempotency_key", "request_hash", "notification_status", "auto_response_status" FROM "form_submissions" LIMIT 0'));
    await db.execute(sql.raw('SELECT "key" FROM "marketing_rate_limits" LIMIT 0'));
    await db.execute(sql.raw('SELECT "idempotency_key" FROM "crm_email_deliveries" LIMIT 0'));

    return NextResponse.json({ ok: true, migration: '0017_marketing_security' });
  } catch (error) {
    console.error('[migration:0017] failed', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json({ ok: false, code: 'migration_failed' }, { status: 500 });
  }
}
