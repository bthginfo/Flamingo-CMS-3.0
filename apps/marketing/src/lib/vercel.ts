/**
 * Vercel provisioning engine.
 * Creates a new Vercel project for a tenant's renderer and assigns a custom domain.
 */

import { randomBytes } from 'node:crypto';

const VERCEL_API = 'https://api.vercel.com';

function getToken() {
  const t = process.env.VERCEL_TOKEN;
  if (!t) throw new Error('VERCEL_TOKEN not set');
  return t;
}

function getTeamId() {
  return process.env.VERCEL_TEAM_ID || '';
}

function teamQuery() {
  const tid = getTeamId();
  return tid ? `?teamId=${tid}` : '';
}

async function vercelFetch(path: string, method = 'GET', body?: unknown) {
  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) options.body = JSON.stringify(body);
  const tid = getTeamId();
  const separator = path.includes('?') ? '&' : '?';
  const url = tid
    ? `${VERCEL_API}${path}${separator}teamId=${tid}`
    : `${VERCEL_API}${path}`;
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Vercel API ${method} ${path}: ${res.status} - ${JSON.stringify(data)}`);
  }
  return data;
}

/** Get the Vercel project ID for the renderer project. */
async function getRendererProjectId(): Promise<string> {
  const projectName = process.env.VERCEL_RENDERER_PROJECT || 'flamingo-renderer';
  const data = await vercelFetch(`/v9/projects/${projectName}`);
  return data.id;
}

/** Add a domain to the renderer Vercel project. */
export async function addDomainToRenderer(domain: string): Promise<{ configured: boolean; verified: boolean }> {
  const projectId = await getRendererProjectId();
  try {
    const data = await vercelFetch(`/v10/projects/${projectId}/domains`, 'POST', { name: domain });
    return { configured: true, verified: data.verified ?? false };
  } catch (err: unknown) {
    const msg = (err as Error).message || '';
    // Domain already exists — not an error
    if (msg.includes('already exists') || msg.includes('DOMAIN_ALREADY_IN_USE')) {
      return { configured: true, verified: true };
    }
    throw err;
  }
}

/** Remove a domain from the renderer Vercel project. */
export async function removeDomainFromRenderer(domain: string): Promise<void> {
  const projectId = await getRendererProjectId();
  try {
    await vercelFetch(`/v9/projects/${projectId}/domains/${domain}`, 'DELETE');
  } catch {
    // Ignore if domain doesn't exist
  }
}

/** Check domain configuration status. */
export async function checkDomainStatus(domain: string, projectId?: string): Promise<{ configured: boolean; verified: boolean; dns: unknown }> {
  const resolvedProjectId = projectId || await getRendererProjectId();
  try {
    const data = await vercelFetch(`/v9/projects/${resolvedProjectId}/domains/${encodeURIComponent(domain)}`);
    return { configured: true, verified: data.verified ?? false, dns: data.verification ?? [] };
  } catch {
    return { configured: false, verified: false, dns: [] };
  }
}

/** Create a standalone Vercel project for a tenant. */
type ProjectEnvironmentVariable = {
  key: string;
  value: string;
  target: string[];
  type: 'encrypted' | 'plain';
};

type UpsertableProjectEnvironmentVariable = ProjectEnvironmentVariable & { replaceExisting: boolean };

const RENDERER_ENV_TARGETS = ['production', 'preview'];

function optionalEnvVar(
  key: string,
  value: string | undefined,
  type: ProjectEnvironmentVariable['type'] = 'encrypted',
): UpsertableProjectEnvironmentVariable[] {
  if (!value || value.startsWith('__PLACEHOLDER')) return [];
  return [{ key, value, target: RENDERER_ENV_TARGETS, type, replaceExisting: true }];
}

function getStandaloneProjectName(slug: string) {
  return `flamingo-${slug}`;
}

function getStandaloneProjectUrl(slug: string) {
  return `https://${getStandaloneProjectName(slug)}.vercel.app`;
}

function buildForwardedPlatformSmtpEnvVars(): UpsertableProjectEnvironmentVariable[] {
  const host = process.env.PLATFORM_SMTP_HOST || process.env.SMTP_HOST;
  const port = process.env.PLATFORM_SMTP_PORT || process.env.SMTP_PORT || '587';
  const user = process.env.PLATFORM_SMTP_USER || process.env.SMTP_USER;
  const pass = process.env.PLATFORM_SMTP_PASS || process.env.SMTP_PASS;
  const from = process.env.PLATFORM_SMTP_FROM || process.env.SMTP_FROM || user;
  if (!host || !user || !pass || !from) return [];
  return [
    { key: 'PLATFORM_SMTP_HOST', value: host, target: RENDERER_ENV_TARGETS, type: 'encrypted', replaceExisting: true },
    { key: 'PLATFORM_SMTP_PORT', value: port, target: RENDERER_ENV_TARGETS, type: 'encrypted', replaceExisting: true },
    { key: 'PLATFORM_SMTP_USER', value: user, target: RENDERER_ENV_TARGETS, type: 'encrypted', replaceExisting: true },
    { key: 'PLATFORM_SMTP_PASS', value: pass, target: RENDERER_ENV_TARGETS, type: 'encrypted', replaceExisting: true },
    { key: 'PLATFORM_SMTP_FROM', value: from, target: RENDERER_ENV_TARGETS, type: 'encrypted', replaceExisting: true },
  ];
}

function buildRendererRevalidateEnvVar(): UpsertableProjectEnvironmentVariable[] {
  const forwarded = process.env.REVALIDATE_SECRET;
  const value = forwarded && !forwarded.startsWith('__PLACEHOLDER')
    ? forwarded
    : randomBytes(32).toString('base64url');
  return [{ key: 'REVALIDATE_SECRET', value, target: RENDERER_ENV_TARGETS, type: 'encrypted', replaceExisting: false }];
}

function buildForwardedRendererRuntimeEnvVars(slug: string): UpsertableProjectEnvironmentVariable[] {
  return [
    ...optionalEnvVar('SITE_URL', getStandaloneProjectUrl(slug), 'plain'),
    ...buildRendererRevalidateEnvVar(),
    ...optionalEnvVar('CRON_SECRET', process.env.CRON_SECRET),
    ...optionalEnvVar('DEMO_IG_FALLBACK_SLUG', process.env.DEMO_IG_FALLBACK_SLUG, 'plain'),
    ...buildForwardedPlatformSmtpEnvVars(),
  ];
}

async function configureProjectEnvironment(
  projectId: string,
  variables: UpsertableProjectEnvironmentVariable[],
) {
  const current = await vercelFetch(`/v9/projects/${projectId}/env`) as { envs?: Array<{ id: string; key: string }> };
  const byKey = new Map((current.envs || []).map(variable => [variable.key, variable]));
  for (const { replaceExisting, ...variable } of variables) {
    const existing = byKey.get(variable.key);
    if (existing) {
      // Per-tenant signing keys stay stable across retries and DB migrations.
      if (replaceExisting) {
        await vercelFetch(`/v9/projects/${projectId}/env/${existing.id}`, 'PATCH', {
          value: variable.value,
          target: variable.target,
          type: variable.type,
        });
      }
      continue;
    }
    await vercelFetch(`/v10/projects/${projectId}/env`, 'POST', [variable]);
  }
}

async function disableProjectSsoProtection(projectId: string) {
  try {
    // Tenant preview domains are customer-facing in this product. Team-level
    // Vercel Authentication defaults can otherwise make *.vercel.app URLs
    // return SSO/403 until a custom domain is attached.
    await vercelFetch(`/v9/projects/${projectId}`, 'PATCH', { ssoProtection: null });
  } catch (err) {
    console.warn('Could not disable Vercel Authentication for tenant project:', (err as Error).message);
  }
}

export async function waitForVercelDeploymentReady(deploymentId: string, timeoutMs = 300_000) {
  if (!deploymentId) throw new Error('Es wurde keine Vercel-Deployment-ID zurückgegeben. Der automatische Cutover wurde abgebrochen.');
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const deployment = await vercelFetch(`/v13/deployments/${encodeURIComponent(deploymentId)}`) as {
      readyState?: string;
      state?: string;
      url?: string;
      errorCode?: string;
      errorMessage?: string;
    };
    const state = (deployment.readyState || deployment.state || '').toUpperCase();
    if (state === 'READY') return { deploymentId, url: deployment.url || '' };
    if (['ERROR', 'CANCELED', 'CANCELLED'].includes(state)) {
      throw new Error(`Das Standalone-Deployment ist fehlgeschlagen (${deployment.errorCode || state}): ${deployment.errorMessage || 'Keine weiteren Details'}`);
    }
    await new Promise(resolve => setTimeout(resolve, 2_500));
  }
  throw new Error('Das Standalone-Deployment wurde nicht rechtzeitig bereit. Die Quelldaten wurden nicht gelöscht.');
}

export async function createStandaloneProject(
  slug: string,
  tenantId: string,
  databaseUrl: string,
  options: { waitForDeployment?: boolean } = {},
): Promise<{ projectId: string; projectUrl: string; blobConnected: boolean; projectCreated: boolean; deploymentId: string }> {
  const projectName = getStandaloneProjectName(slug);
  const projectUrl = getStandaloneProjectUrl(slug);

  // Validate required env vars upfront
  if (!process.env.VERCEL_TOKEN) throw new Error('VERCEL_TOKEN ist nicht gesetzt. Bitte in den Vercel-Umgebungsvariablen konfigurieren.');
  if (!databaseUrl?.startsWith('postgres')) throw new Error('Eine dedizierte Standalone-Datenbankverbindung fehlt.');

  // Create project linked to the monorepo
  const repoId = process.env.GITHUB_REPO_ID;
  const projectBody: Record<string, unknown> = {
    name: projectName,
    framework: 'nextjs',
    rootDirectory: 'apps/renderer',
    buildCommand: 'pnpm turbo build --filter=@flamingo/renderer',
    installCommand: 'pnpm install',
  };
  if (repoId) {
    projectBody.gitRepository = { type: 'github', repo: repoId };
  }

  let project: Record<string, unknown>;
  let projectCreated = true;
  try {
    project = await vercelFetch('/v9/projects', 'POST', projectBody);
  } catch (err) {
    const msg = (err as Error).message || '';
    // If project already exists, try to fetch it
    if (msg.includes('409') || msg.includes('already exist')) {
      project = await vercelFetch(`/v9/projects/${projectName}`);
      projectCreated = false;
    } else {
      throw new Error(`Vercel-Projekt konnte nicht erstellt werden: ${msg}`);
    }
  }

  const projectId = project.id as string;

  try {
    const envVars: UpsertableProjectEnvironmentVariable[] = [
      { key: 'DATABASE_URL', value: databaseUrl, target: RENDERER_ENV_TARGETS, type: 'encrypted', replaceExisting: true },
      { key: 'FIXED_TENANT_ID', value: tenantId, target: RENDERER_ENV_TARGETS, type: 'plain', replaceExisting: true },
      // Tenant deployments must never share signing or configuration-encryption
      // keys. A compromise is then contained to one renderer project.
      { key: 'ADMIN_JWT_SECRET', value: randomBytes(32).toString('base64url'), target: RENDERER_ENV_TARGETS, type: 'encrypted', replaceExisting: false },
      { key: 'RENDERER_RATE_LIMIT_SECRET', value: randomBytes(32).toString('base64url'), target: RENDERER_ENV_TARGETS, type: 'encrypted', replaceExisting: false },
      { key: 'CONFIG_ENCRYPTION_KEY', value: randomBytes(32).toString('base64url'), target: RENDERER_ENV_TARGETS, type: 'encrypted', replaceExisting: false },
      { key: 'PREVIEW_SECRET', value: randomBytes(32).toString('base64url'), target: RENDERER_ENV_TARGETS, type: 'encrypted', replaceExisting: false },
      ...buildForwardedRendererRuntimeEnvVars(slug),
    ];
    await disableProjectSsoProtection(projectId);
    await configureProjectEnvironment(projectId, envVars);

  // Connect shared Blob store to the new project (provides BLOB_READ_WRITE_TOKEN automatically)
  const blobStoreId = process.env.VERCEL_BLOB_STORE_ID;
  let blobConnected = false;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (blobStoreId) {
    try {
      await vercelFetch(`/v1/storage/stores/${blobStoreId}/connections`, 'POST', {
        projectId,
        environments: ['production', 'preview', 'development'],
      });
      blobConnected = true;
    } catch (err) {
      console.warn('Blob store connection failed:', (err as Error).message);
    }
  }

  // Always also set BLOB_READ_WRITE_TOKEN explicitly as env var for reliability
  if (blobToken && !blobToken.startsWith('__PLACEHOLDER')) {
    try {
      await vercelFetch(`/v10/projects/${projectId}/env`, 'POST', [
        { key: 'BLOB_READ_WRITE_TOKEN', value: blobToken, target: ['production', 'preview'], type: 'encrypted' },
      ]);
      blobConnected = true;
    } catch (err) {
      const msg = (err as Error).message || '';
      if (msg.includes('ENV_CONFLICT') || msg.includes('already exists')) {
        // Already set (e.g. by store connection) — update it to ensure correct value
        try {
          const envsData = await vercelFetch(`/v9/projects/${projectId}/env`) as { envs: Array<{ id: string; key: string }> };
          const existing = envsData.envs?.find((e) => e.key === 'BLOB_READ_WRITE_TOKEN');
          if (existing) {
            await vercelFetch(`/v9/projects/${projectId}/env/${existing.id}`, 'PATCH', { value: blobToken, target: ['production', 'preview'], type: 'encrypted' });
          }
          blobConnected = true;
        } catch (updateErr) {
          console.warn('Failed to update BLOB_READ_WRITE_TOKEN:', (updateErr as Error).message);
        }
      } else {
        console.warn('Failed to set BLOB_READ_WRITE_TOKEN:', msg);
      }
    }
  } else if (!blobConnected) {
    console.warn('Blob storage not configured — neither VERCEL_BLOB_STORE_ID connected nor BLOB_READ_WRITE_TOKEN available.');
  }

  // Trigger a final production deployment AFTER all env vars (incl. blob token) are set.
  // This guarantees the running deployment has access to BLOB_READ_WRITE_TOKEN,
  // regardless of any earlier auto-deployment that started without it.
  const numericRepoId = process.env.GITHUB_REPO_NUMERIC_ID;
  let deploymentId = '';
  if (numericRepoId) {
    const deployment = await vercelFetch('/v13/deployments', 'POST', {
      name: projectName,
      target: 'production',
      gitSource: { type: 'github', repoId: Number(numericRepoId), ref: 'main' },
    }) as { id?: string };
    deploymentId = deployment.id || '';
  } else throw new Error('GITHUB_REPO_NUMERIC_ID muss für ein verifiziertes, vollautomatisches Production-Deployment gesetzt sein.');
  if (!deploymentId) throw new Error('Vercel hat keine Production-Deployment-ID zurückgegeben.');
  if (options.waitForDeployment !== false) await waitForVercelDeploymentReady(deploymentId);

  return { projectId: projectId as string, projectUrl, blobConnected, projectCreated, deploymentId };
  } catch (error) {
    if (projectCreated) {
      await deleteVercelProject(projectId).catch(cleanupError => console.error('Standalone Vercel rollback failed:', cleanupError));
    }
    throw error;
  }
}

/** Switches an existing standalone renderer between databases without rotating its auth secrets. */
export async function setStandaloneDatabaseConnection(projectId: string, slug: string, tenantId: string, databaseUrl: string) {
  if (!databaseUrl?.startsWith('postgres')) throw new Error('Eine gültige Datenbankverbindung fehlt.');
  await disableProjectSsoProtection(projectId);
  await configureProjectEnvironment(projectId, [
    { key: 'DATABASE_URL', value: databaseUrl, target: RENDERER_ENV_TARGETS, type: 'encrypted', replaceExisting: true },
    { key: 'FIXED_TENANT_ID', value: tenantId, target: RENDERER_ENV_TARGETS, type: 'plain', replaceExisting: true },
    ...buildForwardedRendererRuntimeEnvVars(slug),
  ]);
  const deployment = await triggerProjectDeployment(getStandaloneProjectName(slug));
  if (!deployment.id) throw new Error('Der Datenbank-Cutover wurde nicht deployed. Die bisherige Verbindung bleibt aktiv.');
  await waitForVercelDeploymentReady(deployment.id);
}

/** Configure Blob storage for an existing standalone project. */
export async function configureBlobForProject(projectName: string): Promise<{ success: boolean; error?: string }> {
  // Get project
  let project: Record<string, unknown>;
  try {
    project = await vercelFetch(`/v9/projects/${projectName}`);
  } catch {
    return { success: false, error: `Vercel-Projekt "${projectName}" nicht gefunden.` };
  }
  const projectId = project.id as string;

  // Try store connection first
  const blobStoreId = process.env.VERCEL_BLOB_STORE_ID;
  if (blobStoreId) {
    try {
      await vercelFetch(`/v1/storage/stores/${blobStoreId}/connections`, 'POST', {
        projectId,
        environments: ['production', 'preview', 'development'],
      });
    } catch (err) {
      console.warn('Blob store connection failed:', (err as Error).message);
    }
  }

  // Always set BLOB_READ_WRITE_TOKEN explicitly for reliability
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken && !blobToken.startsWith('__PLACEHOLDER')) {
    try {
      const envsData = await vercelFetch(`/v9/projects/${projectId}/env`);
      const envs = (envsData.envs || []) as { id: string; key: string }[];
      const existing = envs.find((e) => e.key === 'BLOB_READ_WRITE_TOKEN');
      if (existing) {
        await vercelFetch(`/v9/projects/${projectId}/env/${existing.id}`, 'PATCH', { value: blobToken });
      } else {
        await vercelFetch(`/v10/projects/${projectId}/env`, 'POST', [
          { key: 'BLOB_READ_WRITE_TOKEN', value: blobToken, target: ['production', 'preview'], type: 'encrypted' },
        ]);
      }
    } catch (err) {
      return { success: false, error: `Token konnte nicht gesetzt werden: ${(err as Error).message}` };
    }
    // Trigger redeploy
    await triggerProjectDeployment(projectName);
    return { success: true };
  }

  // If store connection worked but no explicit token available, still redeploy
  if (blobStoreId) {
    await triggerProjectDeployment(projectName);
    return { success: true };
  }

  return { success: false, error: 'Weder VERCEL_BLOB_STORE_ID noch BLOB_READ_WRITE_TOKEN sind auf der Marketing-App konfiguriert.' };
}

/** Add a domain to a specific Vercel project. */
export async function addDomainToProject(projectId: string, domain: string): Promise<{ configured: boolean; verified: boolean }> {
  try {
    const data = await vercelFetch(`/v10/projects/${projectId}/domains`, 'POST', { name: domain });
    return { configured: true, verified: data.verified ?? false };
  } catch (err: unknown) {
    const msg = (err as Error).message || '';
    if (msg.includes('already exists') || msg.includes('DOMAIN_ALREADY_IN_USE')) {
      return { configured: true, verified: true };
    }
    throw err;
  }
}

export async function removeDomainFromProject(projectId: string, domain: string): Promise<void> {
  try {
    await vercelFetch(`/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}`, 'DELETE');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes('404')) throw error;
  }
}

/** Trigger a deployment for a specific Vercel project. */
export async function triggerProjectDeployment(projectName: string): Promise<{ id: string; url: string }> {
  const numericRepoId = process.env.GITHUB_REPO_NUMERIC_ID;
  if (!numericRepoId) {
    console.warn('GITHUB_REPO_NUMERIC_ID not set – skipping deployment trigger. The project will build on next git push.');
    return { id: '', url: `https://${projectName}.vercel.app` };
  }
  const data = await vercelFetch('/v13/deployments', 'POST', {
    name: projectName,
    target: 'production',
    gitSource: {
      type: 'github',
      repoId: numericRepoId,
      ref: 'main',
    },
  });
  return { id: data.id, url: data.url };
}

/** Delete a Vercel project by ID. */
export async function deleteVercelProject(projectId: string): Promise<void> {
  try {
    await vercelFetch(`/v9/projects/${projectId}`, 'DELETE');
  } catch {
    // Ignore if project doesn't exist
  }
}

/** Trigger a new deployment for the renderer project. */
export async function triggerRendererDeployment(): Promise<{ id: string; url: string }> {
  const projectName = process.env.VERCEL_RENDERER_PROJECT || 'flamingo-renderer';
  const data = await vercelFetch('/v13/deployments', 'POST', {
    name: projectName,
    target: 'production',
    gitSource: {
      type: 'github',
      repoId: process.env.GITHUB_REPO_ID,
      ref: 'main',
    },
  });
  return { id: data.id, url: data.url };
}
