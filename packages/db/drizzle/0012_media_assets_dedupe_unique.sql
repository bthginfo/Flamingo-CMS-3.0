-- Uploads were recorded twice: the blob upload-completed webhook and the
-- admin client's saveMediaRecord both insert into media_assets and raced each
-- other (check-then-insert without a unique constraint). Collapse existing
-- duplicates — keeping the richest row per (tenant_id, blob_url) — then add
-- the unique index that makes the race impossible going forward.
WITH ranked AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY tenant_id, blob_url
      ORDER BY
        (size > 0) DESC,
        (width IS NOT NULL) DESC,
        (alt IS NOT NULL AND alt <> '') DESC,
        created_at ASC,
        id ASC
    ) AS rn
  FROM media_assets
)
DELETE FROM media_assets
WHERE id IN (
  SELECT id
  FROM ranked
  WHERE rn > 1
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "media_assets_tenant_blob_idx"
  ON "media_assets" ("tenant_id", "blob_url");
