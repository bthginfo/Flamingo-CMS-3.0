WITH ranked AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY tenant_id
      ORDER BY version DESC, created_at DESC, id DESC
    ) AS rn
  FROM published_snapshots
  WHERE is_active = true
)
UPDATE published_snapshots
SET is_active = false
WHERE id IN (
  SELECT id
  FROM ranked
  WHERE rn > 1
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "published_snapshots_one_active_per_tenant_idx"
  ON "published_snapshots" ("tenant_id")
  WHERE "is_active" = true;
