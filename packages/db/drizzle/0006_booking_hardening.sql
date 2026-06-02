ALTER TABLE "booking_settings" ADD COLUMN IF NOT EXISTS "timezone" varchar(80) DEFAULT 'Europe/Berlin' NOT NULL;
ALTER TABLE "booking_resources" ADD COLUMN IF NOT EXISTS "seats" integer;
