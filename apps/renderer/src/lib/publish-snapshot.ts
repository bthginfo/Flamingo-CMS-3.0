import { createHash } from 'crypto';
import type { Database } from '@flamingo/db';
import { sql } from 'drizzle-orm';

type SqlExecutor = Pick<Database, 'execute'>;

type AtomicPublishInput = {
  tenantId: string;
  snapshot: Record<string, unknown>;
  checksum: string;
  createdBy: string;
  publishDraftPages: boolean;
};

export type AtomicPublishResult = {
  version: number;
  unchanged: boolean;
};

export type AtomicRollbackResult =
  | { version: number }
  | { error: 'no-active-snapshot' | 'no-previous-snapshot' };

/**
 * Canonicalise a draft snapshot before hashing it. `generatedAt` only exists
 * to describe when the draft was read; it must not create a new publication.
 */
export function checksumPublishedSnapshot(snapshot: Record<string, unknown>): string {
  return createHash('sha256')
    .update(JSON.stringify(canonicalise(snapshot, true)))
    .digest('hex');
}

function canonicalise(value: unknown, isRoot = false): unknown {
  if (Array.isArray(value)) return value.map((item) => canonicalise(item));
  if (value && typeof value === 'object') {
    if (value instanceof Date) return value.toISOString();
    const record = value as Record<string, unknown>;
    return Object.keys(record)
      .filter((key) => !(isRoot && key === 'generatedAt'))
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        result[key] = canonicalise(record[key]);
        return result;
      }, {});
  }
  if (typeof value === 'bigint') return value.toString();
  return value;
}

/**
 * A single statement is deliberately used for both node-postgres and the
 * Neon HTTP driver. The transaction-scoped advisory lock serializes writers
 * for one tenant, while the CTE keeps version allocation, activation, history
 * and page promotion atomic even where interactive transactions are absent.
 */
export async function publishSnapshotAtomically(
  db: SqlExecutor,
  input: AtomicPublishInput,
): Promise<AtomicPublishResult> {
  const { tenantId, snapshot, checksum, createdBy, publishDraftPages } = input;
  const result = await db.execute(sql`
    WITH tenant_lock AS (
      SELECT pg_advisory_xact_lock(hashtextextended(${tenantId}::text, 0))
    ),
    current_active AS (
      SELECT id, version, checksum
      FROM published_snapshots, tenant_lock
      WHERE tenant_id = ${tenantId} AND is_active = true
      ORDER BY version DESC
      LIMIT 1
    ),
    latest_version AS (
      SELECT COALESCE(MAX(version), 0)::integer AS version
      FROM published_snapshots, tenant_lock
      WHERE tenant_id = ${tenantId}
    ),
    created AS (
      INSERT INTO published_snapshots (tenant_id, version, snapshot, checksum, created_by, is_active)
      SELECT ${tenantId}, latest_version.version + 1, ${JSON.stringify(snapshot)}::jsonb,
        ${checksum}, ${createdBy}, false
      FROM latest_version
      WHERE NOT EXISTS (
        SELECT 1 FROM current_active WHERE current_active.checksum = ${checksum}
      )
      RETURNING id, version
    ),
    deactivated AS (
      UPDATE published_snapshots
      SET is_active = false
      WHERE tenant_id = ${tenantId}
        AND is_active = true
        AND EXISTS (SELECT 1 FROM created)
      RETURNING id
    ),
    activated AS (
      UPDATE published_snapshots
      SET is_active = true
      WHERE id = (SELECT id FROM created)
        AND tenant_id = ${tenantId}
        AND (SELECT COUNT(*) FROM deactivated) >= 0
      RETURNING id, version
    ),
    history AS (
      INSERT INTO publish_history (tenant_id, snapshot_id, previous_snapshot_id, action, note)
      SELECT ${tenantId}, activated.id, current_active.id, 'publish', CONCAT('v', activated.version)
      FROM activated
      LEFT JOIN current_active ON true
      RETURNING id
    ),
    promoted_pages AS (
      UPDATE pages
      SET status = 'published'
      WHERE ${publishDraftPages}
        AND tenant_id = ${tenantId}
        AND status = 'draft'
      RETURNING id
    )
    SELECT
      COALESCE((SELECT version FROM activated), (SELECT version FROM current_active)) AS version,
      NOT EXISTS (SELECT 1 FROM created) AS unchanged
  `);

  const row = result.rows?.[0] as { version?: number | string; unchanged?: boolean } | undefined;
  const version = Number(row?.version);
  if (!Number.isInteger(version) || version < 1) {
    throw new Error('Published snapshot could not be activated');
  }
  return { version, unchanged: row?.unchanged === true };
}

export async function rollbackSnapshotAtomically(
  db: SqlExecutor,
  tenantId: string,
): Promise<AtomicRollbackResult> {
  const result = await db.execute(sql`
    WITH tenant_lock AS (
      SELECT pg_advisory_xact_lock(hashtextextended(${tenantId}::text, 0))
    ),
    current_active AS (
      SELECT id, version
      FROM published_snapshots, tenant_lock
      WHERE tenant_id = ${tenantId} AND is_active = true
      ORDER BY version DESC
      LIMIT 1
    ),
    previous_snapshot AS (
      SELECT id, version
      FROM published_snapshots
      WHERE tenant_id = ${tenantId}
        AND version < (SELECT version FROM current_active)
      ORDER BY version DESC
      LIMIT 1
    ),
    deactivated AS (
      UPDATE published_snapshots
      SET is_active = false
      WHERE tenant_id = ${tenantId}
        AND is_active = true
        AND EXISTS (SELECT 1 FROM previous_snapshot)
      RETURNING id
    ),
    activated AS (
      UPDATE published_snapshots
      SET is_active = true
      WHERE id = (SELECT id FROM previous_snapshot)
        AND tenant_id = ${tenantId}
        AND (SELECT COUNT(*) FROM deactivated) >= 0
      RETURNING id, version
    ),
    history AS (
      INSERT INTO publish_history (tenant_id, snapshot_id, previous_snapshot_id, action, note)
      SELECT ${tenantId}, activated.id, current_active.id, 'rollback',
        CONCAT('v', current_active.version, ' -> v', activated.version)
      FROM activated
      JOIN current_active ON true
      RETURNING id
    )
    SELECT
      (SELECT version FROM activated) AS version,
      EXISTS (SELECT 1 FROM current_active) AS has_current,
      EXISTS (SELECT 1 FROM previous_snapshot) AS has_previous
  `);

  const row = result.rows?.[0] as {
    version?: number | string | null;
    has_current?: boolean;
    has_previous?: boolean;
  } | undefined;
  if (!row?.has_current) return { error: 'no-active-snapshot' };
  if (!row.has_previous) return { error: 'no-previous-snapshot' };
  const version = Number(row.version);
  if (!Number.isInteger(version) || version < 1) {
    throw new Error('Published snapshot could not be rolled back');
  }
  return { version };
}
