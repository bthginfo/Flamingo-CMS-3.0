CREATE TABLE IF NOT EXISTS "tenant_operations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "operation_key" varchar(180) NOT NULL,
  "kind" varchar(50) NOT NULL,
  "tenant_id" uuid,
  "slug" varchar(100),
  "owner_token" uuid NOT NULL,
  "input_fingerprint" varchar(64) NOT NULL,
  "status" varchar(24) DEFAULT 'running' NOT NULL,
  "phase" varchar(80) DEFAULT 'claimed' NOT NULL,
  "resources" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "result" jsonb,
  "error" text,
  "attempt" integer DEFAULT 1 NOT NULL,
  "heartbeat_at" timestamp with time zone DEFAULT now() NOT NULL,
  "started_at" timestamp with time zone DEFAULT now() NOT NULL,
  "completed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "tenant_operations_status_check"
    CHECK ("tenant_operations"."status" IN ('running', 'completed', 'failed', 'cleanup_pending'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tenant_operations_key_idx" ON "tenant_operations" USING btree ("operation_key");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tenant_operations_tenant_idx" ON "tenant_operations" USING btree ("tenant_id", "status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tenant_operations_heartbeat_idx" ON "tenant_operations" USING btree ("status", "heartbeat_at");
