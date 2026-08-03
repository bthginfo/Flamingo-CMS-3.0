CREATE TABLE IF NOT EXISTS "custom_form_deliveries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tenant_id" uuid NOT NULL,
  "form_key" varchar(80) NOT NULL,
  "idempotency_key" uuid NOT NULL,
  "request_hash" varchar(64) NOT NULL,
  "status" varchar(20) DEFAULT 'processing' NOT NULL,
  "practice_status" varchar(20) DEFAULT 'pending' NOT NULL,
  "confirmation_status" varchar(20) DEFAULT 'pending' NOT NULL,
  "last_error_code" varchar(80),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "custom_form_deliveries_tenant_id_tenants_id_fk"
    FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "custom_form_deliveries_status_check"
    CHECK ("status" IN ('processing', 'completed', 'retryable', 'uncertain', 'partial')),
  CONSTRAINT "custom_form_deliveries_practice_status_check"
    CHECK ("practice_status" IN ('pending', 'sending', 'sent', 'uncertain')),
  CONSTRAINT "custom_form_deliveries_confirmation_status_check"
    CHECK ("confirmation_status" IN ('pending', 'sending', 'sent', 'uncertain'))
);

CREATE UNIQUE INDEX IF NOT EXISTS "custom_form_deliveries_tenant_key_idx"
ON "custom_form_deliveries" USING btree ("tenant_id", "idempotency_key");

CREATE INDEX IF NOT EXISTS "custom_form_deliveries_status_idx"
ON "custom_form_deliveries" USING btree ("status", "updated_at");
