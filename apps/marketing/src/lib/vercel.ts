/**
 * Vercel provisioning engine.
 * Creates a new Vercel project for a tenant's renderer and assigns a custom domain.
 */

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
export async function checkDomainStatus(domain: string): Promise<{ configured: boolean; verified: boolean; dns: unknown }> {
  const projectId = await getRendererProjectId();
  try {
    const data = await vercelFetch(`/v9/projects/${projectId}/domains/${domain}`);
    return { configured: true, verified: data.verified ?? false, dns: data.verification ?? [] };
  } catch {
    return { configured: false, verified: false, dns: [] };
  }
}

/** Create a standalone Vercel project for a tenant. */
export async function createStandaloneProject(slug: string, tenantId: string): Promise<{ projectId: string; projectUrl: string; blobConnected: boolean }> {
  const projectName = `flamingo-${slug}`;

  // Validate required env vars upfront
  if (!process.env.VERCEL_TOKEN) throw new Error('VERCEL_TOKEN ist nicht gesetzt. Bitte in den Vercel-Umgebungsvariablen konfigurieren.');
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL ist nicht gesetzt.');

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
  try {
    project = await vercelFetch('/v9/projects', 'POST', projectBody);
  } catch (err) {
    const msg = (err as Error).message || '';
    // If project already exists, try to fetch it
    if (msg.includes('409') || msg.includes('already exist')) {
      project = await vercelFetch(`/v9/projects/${projectName}`);
    } else {
      throw new Error(`Vercel-Projekt konnte nicht erstellt werden: ${msg}`);
    }
  }

  const projectId = project.id as string;

  // Set environment variables — skip the upfront check since we already validated
  const dbUrl = process.env.DATABASE_URL!;

  const envVars = [
    { key: 'DATABASE_URL', value: dbUrl, target: ['production', 'preview'], type: 'encrypted' },
    { key: 'FIXED_TENANT_ID', value: tenantId, target: ['production', 'preview'], type: 'plain' },
  ];

  // Forward optional env vars if available
  const optionalVars = ['ADMIN_JWT_SECRET', 'MASTER_ADMIN_PASSWORD', 'NEXT_PUBLIC_PREVIEW_SECRET'];
  for (const key of optionalVars) {
    const val = process.env[key];
    if (val) envVars.push({ key, value: val, target: ['production', 'preview'], type: 'encrypted' });
  }
  // Generate ADMIN_JWT_SECRET if not available from env
  if (!process.env.ADMIN_JWT_SECRET) {
    const generated = `flamingo-${slug}-${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
    envVars.push({ key: 'ADMIN_JWT_SECRET', value: generated, target: ['production', 'preview'], type: 'encrypted' });
  }

  try {
    await vercelFetch(`/v10/projects/${projectId}/env`, 'POST', envVars);
  } catch (err) {
    const msg = (err as Error).message || '';
    // If some vars already exist, update them individually
    if (msg.includes('ENV_CONFLICT') || msg.includes('already exists')) {
      for (const envVar of envVars) {
        try {
          await vercelFetch(`/v10/projects/${projectId}/env`, 'POST', [envVar]);
        } catch (innerErr) {
          const innerMsg = (innerErr as Error).message || '';
          if (innerMsg.includes('ENV_CONFLICT') || innerMsg.includes('already exists')) {
            // Fetch existing env var ID and update it
            const existing = await vercelFetch(`/v9/projects/${projectId}/env`) as { envs: Array<{ id: string; key: string }> };
            const found = existing.envs?.find((e) => e.key === envVar.key);
            if (found) {
              await vercelFetch(`/v9/projects/${projectId}/env/${found.id}`, 'PATCH', { value: envVar.value, target: envVar.target, type: envVar.type });
            }
          } else {
            console.warn(`Failed to set env var ${envVar.key}:`, innerMsg);
          }
        }
      }
    } else {
      throw err;
    }
  }

  // Connect shared Blob store to the new project (provides BLOB_READ_WRITE_TOKEN automatically)
  const blobStoreId = process.env.VERCEL_BLOB_STORE_ID;
  let blobConnected = false;
  if (blobStoreId) {
    try {
      await vercelFetch(`/v1/storage/stores/${blobStoreId}/connections`, 'POST', {
        projectId,
        environments: ['production', 'preview', 'development'],
      });
      blobConnected = true;

      // Wait for env var to propagate (Vercel injects BLOB_READ_WRITE_TOKEN async after store connection)
      for (let attempt = 0; attempt < 5; attempt++) {
        const envsData = await vercelFetch(`/v9/projects/${projectId}/env`);
        const envs = (envsData.envs || []) as { key: string }[];
        if (envs.some((e) => e.key === 'BLOB_READ_WRITE_TOKEN')) break;
        await new Promise((r) => setTimeout(r, 1500));
      }
    } catch (err) {
      console.warn('Blob store connection failed, falling back to explicit token:', (err as Error).message);
    }
  }
  // Fallback: set BLOB_READ_WRITE_TOKEN explicitly if store connection failed or no store ID
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobConnected && blobToken && !blobToken.startsWith('__PLACEHOLDER')) {
    try {
      await vercelFetch(`/v10/projects/${projectId}/env`, 'POST', [
        { key: 'BLOB_READ_WRITE_TOKEN', value: blobToken, target: ['production', 'preview'], type: 'encrypted' },
      ]);
    } catch (err) {
      console.error('Failed to set BLOB_READ_WRITE_TOKEN on standalone project:', (err as Error).message);
      // Don't throw — allow provisioning to continue; blob can be configured later
    }
  } else if (!blobConnected) {
    console.warn('Blob storage not configured for standalone project — BLOB_READ_WRITE_TOKEN missing. Image uploads will not work until configured.');
  }

  // Trigger a final production deployment AFTER all env vars (incl. blob token) are set.
  // This guarantees the running deployment has access to BLOB_READ_WRITE_TOKEN,
  // regardless of any earlier auto-deployment that started without it.
  const numericRepoId = process.env.GITHUB_REPO_NUMERIC_ID;
  if (numericRepoId) {
    try {
      await vercelFetch('/v13/deployments', 'POST', {
        name: projectName,
        target: 'production',
        gitSource: { type: 'github', repoId: Number(numericRepoId), ref: 'main' },
      });
    } catch (err) {
      console.warn('Final redeploy after env setup failed (non-critical):', (err as Error).message);
    }
  }

  return { projectId: projectId as string, projectUrl: `https://${projectName}.vercel.app`, blobConnected };
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
      // Trigger redeploy so the new env vars take effect
      await triggerProjectDeployment(projectName);
      return { success: true };
    } catch (err) {
      console.warn('Blob store connection failed:', (err as Error).message);
    }
  }

  // Fallback: set BLOB_READ_WRITE_TOKEN explicitly
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken && !blobToken.startsWith('__PLACEHOLDER')) {
    try {
      // Check if already set
      const envsData = await vercelFetch(`/v9/projects/${projectId}/env`);
      const envs = (envsData.envs || []) as { id: string; key: string }[];
      const existing = envs.find((e) => e.key === 'BLOB_READ_WRITE_TOKEN');
      if (existing) {
        // Update existing
        await vercelFetch(`/v9/projects/${projectId}/env/${existing.id}`, 'PATCH', { value: blobToken });
      } else {
        // Create new
        await vercelFetch(`/v10/projects/${projectId}/env`, 'POST', [
          { key: 'BLOB_READ_WRITE_TOKEN', value: blobToken, target: ['production', 'preview'], type: 'encrypted' },
        ]);
      }
      // Trigger redeploy
      await triggerProjectDeployment(projectName);
      return { success: true };
    } catch (err) {
      return { success: false, error: `Token konnte nicht gesetzt werden: ${(err as Error).message}` };
    }
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
