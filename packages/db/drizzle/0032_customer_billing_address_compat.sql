ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "default_shipping_address" jsonb;
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "default_billing_address" jsonb;