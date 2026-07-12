CREATE TABLE IF NOT EXISTS "marketing_rate_limits" (
  "key" varchar(160) PRIMARY KEY NOT NULL,
  "hits" integer DEFAULT 1 NOT NULL,
  "window_started_at" timestamp with time zone DEFAULT now() NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "marketing_rate_limits_expires_idx"
ON "marketing_rate_limits" USING btree ("expires_at");

CREATE TABLE IF NOT EXISTS "crm_email_deliveries" (
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
);

CREATE INDEX IF NOT EXISTS "crm_email_deliveries_entity_idx"
ON "crm_email_deliveries" USING btree ("purpose", "entity_id");

CREATE INDEX IF NOT EXISTS "crm_email_deliveries_status_idx"
ON "crm_email_deliveries" USING btree ("status", "created_at");

ALTER TABLE "form_submissions"
ADD COLUMN IF NOT EXISTS "idempotency_key" uuid,
ADD COLUMN IF NOT EXISTS "request_hash" varchar(64),
ADD COLUMN IF NOT EXISTS "notification_status" varchar(20),
ADD COLUMN IF NOT EXISTS "auto_response_status" varchar(20);

CREATE UNIQUE INDEX IF NOT EXISTS "form_submissions_tenant_idempotency_idx"
ON "form_submissions" USING btree ("tenant_id", "idempotency_key");
