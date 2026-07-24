import { grantRuntimeDatabasePrivileges } from '@flamingo/db';
import { randomBytes } from 'node:crypto';

const NEON_API = 'https://console.neon.tech/api/v2';

type NeonOperation = { id?: string; status?: string; error?: string };
type NeonCreateResponse = {
  project?: { id?: string; region_id?: string; default_branch_id?: string };
  branch?: { id?: string };
  databases?: Array<{ name?: string }>;
  roles?: Array<{ name?: string }>;
  operations?: NeonOperation[];
};
type NeonProjectListResponse = {
  projects?: Array<{ id?: string; name?: string; region_id?: string; created_at?: string; updated_at?: string }>;
};
type NeonProjectResponse = {
  project?: { id?: string; name?: string; region_id?: string; default_branch_id?: string };
};
type NeonBranchResponse = {
  branches?: Array<{ id?: string; name?: string; primary?: boolean; default?: boolean }>;
};
type NeonDatabaseResponse = { databases?: Array<{ name?: string }> };
type NeonRoleResponse = { roles?: Array<{ name?: string }> };
type NeonEndpointResponse = {
  endpoints?: Array<{ id?: string; branch_id?: string; host?: string; proxy_host?: string }>;
};

export type NeonTenantProject = {
  projectId: string;
  branchId: string;
  region: string | null;
  databaseName: string;
  roleName: string;
  pooledConnectionUri: string;
  directConnectionUri: string;
};

export async function getNeonOrganizationPlan(): Promise<string | null> {
  const orgId = process.env.NEON_ORG_ID?.trim();
  if (!orgId) return null;
  const result = await neonFetch<{ plan?: string; organization?: { plan?: string } }>(`/organizations/${encodeURIComponent(orgId)}`);
  return (result.organization?.plan || result.plan || '').trim().toLowerCase() || null;
}

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

async function resolveNeonTenantProject(projectId: string, preferred?: { databaseName?: string; roleName?: string; region?: string | null }): Promise<NeonTenantProject> {
  const [project, branches] = await Promise.all([
    neonFetch<NeonProjectResponse>(`/projects/${encodeURIComponent(projectId)}`),
    neonFetch<NeonBranchResponse>(`/projects/${encodeURIComponent(projectId)}/branches`),
  ]);
  const branchId = project.project?.default_branch_id
    || branches.branches?.find(branch => branch.primary || branch.default)?.id
    || branches.branches?.[0]?.id;
  if (!branchId) throw new Error('Neon hat keinen Branch für das Tenant-Projekt zurückgegeben.');

  const [databases, roles] = await Promise.all([
    neonFetch<NeonDatabaseResponse>(`/projects/${encodeURIComponent(projectId)}/branches/${encodeURIComponent(branchId)}/databases`),
    neonFetch<NeonRoleResponse>(`/projects/${encodeURIComponent(projectId)}/branches/${encodeURIComponent(branchId)}/roles`),
  ]);
  const databaseName = preferred?.databaseName || databases.databases?.find(database => database.name === 'flamingo')?.name || databases.databases?.[0]?.name;
  const roleName = preferred?.roleName || roles.roles?.find(role => role.name === 'flamingo_owner')?.name || roles.roles?.[0]?.name;
  if (!databaseName || !roleName) throw new Error('Neon-Projekt ist unvollständig: Datenbank oder Owner-Rolle fehlt.');

  const [pooledConnectionUri, directConnectionUri] = await Promise.all([
    connectionUri(projectId, databaseName, roleName, true, branchId),
    connectionUri(projectId, databaseName, roleName, false, branchId),
  ]);
  return {
    projectId,
    branchId,
    region: preferred?.region ?? project.project?.region_id ?? null,
    databaseName,
    roleName,
    pooledConnectionUri,
    directConnectionUri,
  };
}

export async function findNeonTenantProject(slug: string): Promise<NeonTenantProject | null> {
  const name = projectName(slug);
  const list = await neonFetch<NeonProjectListResponse>('/projects?limit=100');
  const matches = (list.projects || [])
    .filter(project => project.id && project.name === name)
    .sort((a, b) => Date.parse(b.updated_at || b.created_at || '') - Date.parse(a.updated_at || a.created_at || ''));
  const project = matches[0];
  if (!project?.id) return null;
  return resolveNeonTenantProject(project.id, { region: project.region_id || null });
}

function endpointIdFromConnectionUri(databaseUrl: string) {
  try {
    const host = new URL(databaseUrl).hostname;
    const endpointLabel = host.split('.')[0] || '';
    return endpointLabel.replace(/-pooler$/, '');
  } catch {
    return '';
  }
}

function databaseNameFromConnectionUri(databaseUrl: string) {
  try {
    const pathname = new URL(databaseUrl).pathname.replace(/^\/+/, '').trim();
    return pathname ? decodeURIComponent(pathname) : undefined;
  } catch {
    return undefined;
  }
}

function roleNameFromConnectionUri(databaseUrl: string) {
  try {
    const username = new URL(databaseUrl).username;
    return username ? decodeURIComponent(username) : undefined;
  } catch {
    return undefined;
  }
}

export async function findNeonTenantProjectByConnectionUri(databaseUrl: string): Promise<NeonTenantProject | null> {
  const endpointId = endpointIdFromConnectionUri(databaseUrl);
  if (!endpointId.startsWith('ep-')) return null;

  const list = await neonFetch<NeonProjectListResponse>('/projects?limit=100');
  const projects = (list.projects || [])
    .filter(project => project.id)
    .sort((a, b) => Date.parse(b.updated_at || b.created_at || '') - Date.parse(a.updated_at || a.created_at || ''));

  for (const project of projects) {
    const endpoints = await neonFetch<NeonEndpointResponse>(`/projects/${encodeURIComponent(project.id!)}/endpoints`);
    const match = endpoints.endpoints?.find(endpoint => endpoint.id === endpointId);
    if (!match) continue;
    return resolveNeonTenantProject(project.id!, {
      region: project.region_id || null,
      databaseName: databaseNameFromConnectionUri(databaseUrl),
      roleName: roleNameFromConnectionUri(databaseUrl),
    });
  }

  return null;
}

export async function getNeonTenantProjectById(projectId: string, preferred?: { databaseName?: string; roleName?: string; region?: string | null }) {
  return resolveNeonTenantProject(projectId, preferred);
}

export async function createNeonRuntimeDatabaseRole(project: Pick<NeonTenantProject, 'projectId' | 'branchId' | 'databaseName' | 'directConnectionUri'>) {
  const roleName = `flamingo_app_${randomBytes(4).toString('hex')}`;
  const created = await neonFetch<{ role?: { name?: string }; operations?: NeonOperation[] }>(
    `/projects/${encodeURIComponent(project.projectId)}/branches/${encodeURIComponent(project.branchId)}/roles`,
    {
      method: 'POST',
      body: JSON.stringify({ role: { name: roleName } }),
    },
  );
  await waitForOperations(project.projectId, created.operations);
  const effectiveRole = created.role?.name || roleName;
  const passwordResponse = await neonFetch<{ password?: string; role?: { password?: string } }>(
    `/projects/${encodeURIComponent(project.projectId)}/branches/${encodeURIComponent(project.branchId)}/roles/${encodeURIComponent(effectiveRole)}/reveal_password`,
  );
  const password = passwordResponse.password || passwordResponse.role?.password;

  await grantRuntimeDatabasePrivileges(project.directConnectionUri, effectiveRole);

  let runtimeConnectionUri = await connectionUri(project.projectId, project.databaseName, effectiveRole, true, project.branchId);
  if (password) {
    const url = new URL(runtimeConnectionUri);
    if (!url.password) {
      url.username = effectiveRole;
      url.password = password;
      runtimeConnectionUri = url.toString();
    }
  }
  if (!runtimeConnectionUri.startsWith('postgres')) throw new Error('Neon hat keine gültige Runtime-Datenbankverbindung zurückgegeben.');
  return { roleName: effectiveRole, connectionUri: runtimeConnectionUri };
}

export async function createNeonTenantProject(slug: string): Promise<NeonTenantProject> {
  const databaseName = 'flamingo';
  const roleName = 'flamingo_owner';
  const region = process.env.NEON_REGION_ID?.trim() || 'aws-eu-central-1';
  const pgVersion = Number.parseInt(process.env.NEON_PG_VERSION || '17', 10);
  const orgId = process.env.NEON_ORG_ID?.trim();
  if (orgId) {
    const plan = await getNeonOrganizationPlan();
    if (plan && plan !== 'free' && process.env.ALLOW_PAID_NEON_PROVISIONING !== 'true') {
      throw new Error(`Die konfigurierte Neon-Organisation nutzt den Tarif "${plan}". Automatische Standalone-Provisionierung ist auf Neon Free begrenzt; für kostenpflichtige Ressourcen ist eine bewusste separate Konfiguration erforderlich.`);
    }
  }
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
  if (!branchId) throw new Error('Neon hat keine Branch-ID zurückgegeben.');
  const effectiveDatabase = created.databases?.[0]?.name || databaseName;
  const effectiveRole = created.roles?.[0]?.name || roleName;
  const [pooledConnectionUri, directConnectionUri] = await Promise.all([
    connectionUri(projectId, effectiveDatabase, effectiveRole, true, branchId),
    connectionUri(projectId, effectiveDatabase, effectiveRole, false, branchId),
  ]);
  return { projectId, branchId, region: created.project?.region_id || region, databaseName: effectiveDatabase, roleName: effectiveRole, pooledConnectionUri, directConnectionUri };
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
