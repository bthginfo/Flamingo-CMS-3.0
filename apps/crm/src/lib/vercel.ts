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
  const res = await fetch(`${VERCEL_API}${path}${path.includes('?') ? '&' : '?'}teamId=${getTeamId()}`, options);
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
