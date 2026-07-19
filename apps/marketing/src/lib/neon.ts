const NEON_API = 'https://console.neon.tech/api/v2';

type NeonOperation = { id?: string; status?: string; error?: string };
type NeonCreateResponse = {
  project?: { id?: string; region_id?: string; default_branch_id?: string };
  branch?: { id?: string };
  databases?: Array<{ name?: string }>;
  roles?: Array<{ name?: string }>;
  operations?: NeonOperation[];
};

export type NeonTenantProject = {
  projectId: string;
  region: string | null;
  databaseName: string;
  roleName: string;
  pooledConnectionUri: string;
  directConnectionUri: string;
};

function token() {
  const value = process.env.NEON_API_KEY?.trim();
  if (!value) throw new Error('NEON_API_KEY ist nicht gesetzt. Standalone-Datenbanken können nicht provisioniert werden.');
  return value;
}

function redact(value: string) {
  return value.replace(/postgres(?:ql)?:\/\/[^\s"']+/gi, 'postgresql://[REDACTED]');
}

async function neonFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${NEON_API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token()}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
    cache: 'no-store',
  });
  const data = await response.json().catch(() => null) as T | { message?: string } | null;
  if (!response.ok) {
    const detail = data && typeof data === 'object' && 'message' in data ? data.message : `HTTP ${response.status}`;
    throw new Error(`Neon API ${init?.method || 'GET'} ${path}: ${redact(String(detail || response.statusText))}`);
  }
  return data as T;
}

function projectName(slug: string) {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
  if (!normalized) throw new Error('Der Tenant-Slug ist für ein Neon-Projekt ungültig.');
  return `flamingo-${normalized}`;
}

async function waitForOperations(projectId: string, operations: NeonOperation[] = []) {
  for (const operation of operations) {
    if (!operation.id || operation.status === 'finished') continue;
    for (let attempt = 0; attempt < 45; attempt += 1) {
      const current = await neonFetch<{ operation?: NeonOperation }>(`/projects/${encodeURIComponent(projectId)}/operations/${encodeURIComponent(operation.id)}`);
      const status = current.operation?.status;
      if (status === 'finished') break;
      if (status === 'failed' || status === 'cancelled') throw new Error(`Neon-Projekt konnte nicht bereitgestellt werden: ${current.operation?.error || status}`);
      if (attempt === 44) throw new Error('Neon-Projekt ist nach 45 Sekunden noch nicht bereit.');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

async function connectionUri(projectId: string, databaseName: string, roleName: string, pooled: boolean, branchId?: string) {
  const query = new URLSearchParams({ database_name: databaseName, role_name: roleName, pooled: String(pooled) });
  if (branchId) query.set('branch_id', branchId);
  const result = await neonFetch<{ uri?: string; connection_uri?: string }>(`/projects/${encodeURIComponent(projectId)}/connection_uri?${query}`);
  const uri = result.uri || result.connection_uri;
  if (!uri?.startsWith('postgres')) throw new Error('Neon hat keine gültige Datenbankverbindung zurückgegeben.');
  return uri;
}

export async function createNeonTenantProject(slug: string): Promise<NeonTenantProject> {
  const databaseName = 'flamingo';
  const roleName = 'flamingo_owner';
  const region = process.env.NEON_REGION_ID?.trim() || 'aws-eu-central-1';
  const pgVersion = Number.parseInt(process.env.NEON_PG_VERSION || '17', 10);
  const orgId = process.env.NEON_ORG_ID?.trim();
  const created = await neonFetch<NeonCreateResponse>('/projects', {
    method: 'POST',
    body: JSON.stringify({
      project: {
        name: projectName(slug),
        region_id: region,
        pg_version: Number.isFinite(pgVersion) ? pgVersion : 17,
        ...(orgId ? { org_id: orgId } : {}),
        branch: { name: 'production', database_name: databaseName, role_name: roleName },
      },
    }),
  });
  const projectId = created.project?.id;
  if (!projectId) throw new Error('Neon hat keine Project-ID zurückgegeben.');
  await waitForOperations(projectId, created.operations);
  const branchId = created.branch?.id || created.project?.default_branch_id;
  const effectiveDatabase = created.databases?.[0]?.name || databaseName;
  const effectiveRole = created.roles?.[0]?.name || roleName;
  const [pooledConnectionUri, directConnectionUri] = await Promise.all([
    connectionUri(projectId, effectiveDatabase, effectiveRole, true, branchId),
    connectionUri(projectId, effectiveDatabase, effectiveRole, false, branchId),
  ]);
  return { projectId, region: created.project?.region_id || region, databaseName: effectiveDatabase, roleName: effectiveRole, pooledConnectionUri, directConnectionUri };
}

export async function deleteNeonProject(projectId: string) {
  if (!projectId) return;
  try {
    await neonFetch(`/projects/${encodeURIComponent(projectId)}`, { method: 'DELETE' });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes('404')) throw error;
  }
}
