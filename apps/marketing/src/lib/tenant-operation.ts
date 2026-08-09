import { createHash, randomUUID } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { getDb } from './db';

export const TENANT_OPERATION_STALE_AFTER_MS = 20 * 60 * 1000;

type OperationRow = {
  operation_key: string;
  kind: string;
  tenant_id: string | null;
  slug: string | null;
  owner_token: string;
  input_fingerprint: string;
  status: 'running' | 'completed' | 'failed' | 'cleanup_pending';
  phase: string;
  resources: Record<string, unknown> | null;
  result: Record<string, unknown> | null;
  attempt: number | string;
  heartbeat_at: Date | string;
};

export type TenantOperationClaim =
  | { state: 'acquired'; ownerToken: string; tenantId: string | null; phase: string; resources: Record<string, unknown>; attempt: number }
  | { state: 'in_progress'; phase: string; attempt: number }
  | { state: 'completed'; result: Record<string, unknown> };

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, canonicalize(child)]),
    );
  }
  return value;
}

export function createTenantOperationFingerprint(input: unknown) {
  return createHash('sha256').update(JSON.stringify(canonicalize(input))).digest('hex');
}

function asRow(result: { rows?: unknown[] }) {
  return result.rows?.[0] as OperationRow | undefined;
}

/**
 * Atomically claims a durable operation key. A fresh running owner is never
 * replaced. Only failed/cleanup-pending work or a genuinely stale heartbeat
 * with the exact same input may be resumed by another invocation.
 */
export async function acquireTenantOperation(input: {
  operationKey: string;
  kind: string;
  inputFingerprint: string;
  tenantId?: string | null;
  slug?: string | null;
  now?: Date;
}): Promise<TenantOperationClaim> {
  const db = getDb();
  const ownerToken = randomUUID();
  const now = input.now || new Date();
  const staleBefore = new Date(now.getTime() - TENANT_OPERATION_STALE_AFTER_MS);
  const result = await db.execute(sql`
    INSERT INTO tenant_operations (
      operation_key, kind, tenant_id, slug, owner_token, input_fingerprint,
      status, phase, heartbeat_at, started_at, created_at, updated_at
    ) VALUES (
      ${input.operationKey}, ${input.kind}, ${input.tenantId || null}, ${input.slug || null},
      ${ownerToken}, ${input.inputFingerprint}, 'running', 'claimed', ${now}, ${now}, ${now}, ${now}
    )
    ON CONFLICT (operation_key) DO UPDATE SET
      owner_token = EXCLUDED.owner_token,
      tenant_id = COALESCE(tenant_operations.tenant_id, EXCLUDED.tenant_id),
      slug = COALESCE(tenant_operations.slug, EXCLUDED.slug),
      status = 'running',
      phase = CASE WHEN tenant_operations.status = 'running' THEN tenant_operations.phase ELSE 'resuming' END,
      error = NULL,
      attempt = tenant_operations.attempt + 1,
      heartbeat_at = EXCLUDED.heartbeat_at,
      started_at = EXCLUDED.started_at,
      completed_at = NULL,
      updated_at = EXCLUDED.updated_at
    WHERE tenant_operations.input_fingerprint = EXCLUDED.input_fingerprint
      AND (
        tenant_operations.status IN ('failed', 'cleanup_pending')
        OR (tenant_operations.status = 'running' AND tenant_operations.heartbeat_at <= ${staleBefore})
      )
    RETURNING operation_key, kind, tenant_id, slug, owner_token, input_fingerprint,
      status, phase, resources, result, attempt, heartbeat_at
  `);
  const claimed = asRow(result);
  if (claimed?.owner_token === ownerToken) {
    return {
      state: 'acquired',
      ownerToken,
      tenantId: claimed.tenant_id,
      phase: claimed.phase,
      resources: claimed.resources || {},
      attempt: Number(claimed.attempt),
    };
  }

  const existingResult = await db.execute(sql`
    SELECT operation_key, kind, tenant_id, slug, owner_token, input_fingerprint,
      status, phase, resources, result, attempt, heartbeat_at
    FROM tenant_operations
    WHERE operation_key = ${input.operationKey}
    LIMIT 1
  `);
  const existing = asRow(existingResult);
  if (!existing) throw new Error('Die Provisioning-Sperre konnte nicht gelesen werden.');
  if (existing.input_fingerprint !== input.inputFingerprint) {
    throw new Error('Für diesen Tenant existiert bereits ein Vorgang mit abweichenden Eingaben.');
  }
  if (existing.status === 'completed') return { state: 'completed', result: existing.result || {} };
  return { state: 'in_progress', phase: existing.phase, attempt: Number(existing.attempt) };
}

export async function heartbeatTenantOperation(input: {
  operationKey: string;
  ownerToken: string;
  phase: string;
  tenantId?: string | null;
  resources?: Record<string, unknown>;
}) {
  const now = new Date();
  const result = await getDb().execute(sql`
    UPDATE tenant_operations
    SET phase = ${input.phase},
        tenant_id = COALESCE(tenant_id, ${input.tenantId || null}),
        resources = resources || ${JSON.stringify(input.resources || {})}::jsonb,
        heartbeat_at = ${now}, updated_at = ${now}
    WHERE operation_key = ${input.operationKey}
      AND owner_token = ${input.ownerToken}
      AND status = 'running'
    RETURNING operation_key
  `);
  if (!result.rows?.length) throw new Error('Der Vorgang wird bereits von einem anderen Prozess fortgesetzt.');
}

export async function completeTenantOperation(input: {
  operationKey: string;
  ownerToken: string;
  result: Record<string, unknown>;
}) {
  const now = new Date();
  const update = await getDb().execute(sql`
    UPDATE tenant_operations
    SET status = 'completed', phase = 'completed', result = ${JSON.stringify(input.result)}::jsonb,
        heartbeat_at = ${now}, completed_at = ${now}, updated_at = ${now}
    WHERE operation_key = ${input.operationKey}
      AND owner_token = ${input.ownerToken}
      AND status = 'running'
    RETURNING operation_key
  `);
  if (!update.rows?.length) throw new Error('Der Vorgang konnte nicht als abgeschlossen markiert werden.');
}

export async function failTenantOperation(input: {
  operationKey: string;
  ownerToken: string;
  error: unknown;
  cleanupPending?: boolean;
}) {
  const message = input.error instanceof Error ? input.error.message : String(input.error);
  const now = new Date();
  await getDb().execute(sql`
    UPDATE tenant_operations
    SET status = ${input.cleanupPending ? 'cleanup_pending' : 'failed'},
        error = ${message.slice(0, 4000)}, heartbeat_at = ${now}, updated_at = ${now}
    WHERE operation_key = ${input.operationKey}
      AND owner_token = ${input.ownerToken}
      AND status = 'running'
  `);
}

export async function ownsTenantOperation(operationKey: string, ownerToken: string) {
  const result = await getDb().execute(sql`
    SELECT 1 FROM tenant_operations
    WHERE operation_key = ${operationKey} AND owner_token = ${ownerToken} AND status = 'running'
    LIMIT 1
  `);
  return Boolean(result.rows?.length);
}
