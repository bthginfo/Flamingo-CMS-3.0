ALTER TABLE "booking_services"
  ADD COLUMN IF NOT EXISTS "buffer_before_minutes" integer DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS "buffer_after_minutes" integer DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS "min_party_size" integer,
  ADD COLUMN IF NOT EXISTS "max_party_size" integer,
  ADD COLUMN IF NOT EXISTS "intake_questions" jsonb DEFAULT '[]'::jsonb;

ALTER TABLE "booking_requests"
  ADD COLUMN IF NOT EXISTS "buffer_before_minutes" integer DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS "buffer_after_minutes" integer DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS "intake_answers" jsonb DEFAULT '{}'::jsonb;
