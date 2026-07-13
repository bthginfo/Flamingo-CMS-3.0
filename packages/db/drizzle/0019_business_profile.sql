ALTER TABLE "global_settings"
  ADD COLUMN IF NOT EXISTS "business_profile" jsonb DEFAULT NULL;
