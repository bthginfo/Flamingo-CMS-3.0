ALTER TABLE "media_assets" ADD COLUMN IF NOT EXISTS "folder" varchar(200);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_assets_folder_idx" ON "media_assets" ("tenant_id", "folder");
