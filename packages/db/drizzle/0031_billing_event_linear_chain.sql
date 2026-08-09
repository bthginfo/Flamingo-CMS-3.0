ALTER TABLE "billing_settings"
  ADD COLUMN IF NOT EXISTS "configuration_revision" bigint DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_documents"
  ADD COLUMN IF NOT EXISTS "draft_revision" bigint DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "billing_document_events"
  ADD COLUMN IF NOT EXISTS "chain_position" bigint;
--> statement-breakpoint
DO $$
DECLARE
  append_only_trigger_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgrelid = 'billing_document_events'::regclass
      AND tgname = 'billing_document_events_append_only'
      AND NOT tgisinternal
  ) INTO append_only_trigger_exists;

  IF append_only_trigger_exists THEN
    ALTER TABLE "billing_document_events" DISABLE TRIGGER "billing_document_events_append_only";
  END IF;

  WITH ordered_events AS (
    SELECT id, row_number() OVER (
      PARTITION BY tenant_id, document_id
      ORDER BY created_at, id
    ) AS position
    FROM "billing_document_events"
  )
  UPDATE "billing_document_events" event
  SET "chain_position" = ordered_events.position
  FROM ordered_events
  WHERE event.id = ordered_events.id
    AND event."chain_position" IS NULL;

  IF append_only_trigger_exists THEN
    ALTER TABLE "billing_document_events" ENABLE TRIGGER "billing_document_events_append_only";
  END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "billing_document_events"
  ALTER COLUMN "chain_position" SET NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "billing_document_events_chain_position_idx"
  ON "billing_document_events" ("tenant_id", "document_id", "chain_position");
