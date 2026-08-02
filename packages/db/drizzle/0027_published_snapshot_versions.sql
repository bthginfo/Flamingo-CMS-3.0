-- Older deployments could contain duplicate versions after concurrent
-- neon-http publishes. Keep all snapshots/history rows and normalize their
-- per-tenant sequence before enforcing the invariant.
WITH ranked AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY tenant_id
      ORDER BY version ASC, created_at ASC, id ASC
    )::integer AS normalized_version
  FROM published_snapshots
)
UPDATE published_snapshots AS snapshot
SET version = ranked.normalized_version
FROM ranked
WHERE snapshot.id = ranked.id
  AND snapshot.version <> ranked.normalized_version;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "published_snapshots_tenant_version_idx"
  ON "published_snapshots" ("tenant_id", "version");
