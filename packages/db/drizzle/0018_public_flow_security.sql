CREATE TABLE IF NOT EXISTS "public_flow_requests" (
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
  CONSTRAINT "public_flow_requests_flow_check"
    CHECK ("flow" IN ('booking', 'checkout')),
  CONSTRAINT "public_flow_requests_status_check"
    CHECK ("status" IN ('processing', 'completed', 'failed', 'uncertain'))
);

CREATE UNIQUE INDEX IF NOT EXISTS "public_flow_requests_tenant_key_idx"
ON "public_flow_requests" USING btree ("tenant_id", "flow", "idempotency_key");

CREATE INDEX IF NOT EXISTS "public_flow_requests_status_idx"
ON "public_flow_requests" USING btree ("status", "created_at");
