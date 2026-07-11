-- Compatibility-first section identity. Existing rows intentionally remain
-- NULL and continue to resolve through (tenant.industry, page_sections.type).
-- A later application-level backfill can persist only keys known by the
-- renderer registry, without guessing at cross-industry fallback ownership.
ALTER TABLE "page_sections" ADD COLUMN IF NOT EXISTS "definition_key" varchar(191);
--> statement-breakpoint
ALTER TABLE "page_sections" ADD COLUMN IF NOT EXISTS "schema_version" integer;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'page_sections_schema_version_positive'
  ) THEN
    ALTER TABLE "page_sections"
      ADD CONSTRAINT "page_sections_schema_version_positive"
      CHECK ("schema_version" IS NULL OR "schema_version" > 0);
  END IF;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "page_sections_definition_key_idx"
  ON "page_sections" USING btree ("definition_key");
