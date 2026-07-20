ALTER TABLE "billing_settings" ADD COLUMN IF NOT EXISTS "logo_display" varchar(20) DEFAULT 'logo_and_name' NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_settings" DROP CONSTRAINT IF EXISTS "billing_settings_logo_display_check";
--> statement-breakpoint
ALTER TABLE "billing_settings" ADD CONSTRAINT "billing_settings_logo_display_check" CHECK ("logo_display" IN ('logo_and_name', 'logo_only', 'name_only'));
