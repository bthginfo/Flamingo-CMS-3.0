-- Standalone is the safe default for real customer tenants. This changes only
-- the default deployment topology; Neon billing remains on the organization's
-- Free plan unless it is changed deliberately outside tenant provisioning.
ALTER TABLE "tenants" ALTER COLUMN "deployment_mode" SET DEFAULT 'standalone';
--> statement-breakpoint
ALTER TABLE "tenant_database_connections" ADD COLUMN IF NOT EXISTS "billing_plan_intent" varchar(20) DEFAULT 'free' NOT NULL;
--> statement-breakpoint
ALTER TABLE "tenant_database_connections" ADD CONSTRAINT "tenant_database_connections_plan_intent_check" CHECK ("billing_plan_intent" IN ('free', 'paid_requested', 'external_paid'));
