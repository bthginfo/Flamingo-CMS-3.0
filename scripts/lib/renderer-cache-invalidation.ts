const DEFAULT_FW_REVALIDATE_URL = 'https://flamingo-freie-waehler-ingolstadt.vercel.app/api/revalidate';
const ALLOWED_FW_REVALIDATE_HOSTS = new Set([
  'flamingo-freie-waehler-ingolstadt.vercel.app',
]);

export type CacheInvalidationResult = {
  scope: string;
  tenantId: string;
};

export function buildFwCacheInvalidationUrl(tenantId: string, configuredUrl?: string) {
  const url = new URL(configuredUrl || DEFAULT_FW_REVALIDATE_URL);
  if (
    url.protocol !== 'https:'
    || !ALLOWED_FW_REVALIDATE_HOSTS.has(url.hostname)
    || url.pathname !== '/api/revalidate'
    || url.username
    || url.password
  ) {
    throw new Error('Renderer revalidation URL is not an approved FW endpoint.');
  }
  url.search = '';
  url.searchParams.set('tenant', tenantId);
  return url;
}

export async function invalidateFwRendererCache(input: {
  tenantId: string;
  secret: string | undefined;
  configuredUrl?: string;
  fetchImpl?: typeof fetch;
}): Promise<CacheInvalidationResult> {
  const secret = input.secret?.trim();
  if (!secret) throw new Error('REVALIDATE_SECRET is required after applying the repair.');
  const url = buildFwCacheInvalidationUrl(input.tenantId, input.configuredUrl);
  const response = await (input.fetchImpl || fetch)(url, {
    method: 'POST',
    headers: {
      'x-revalidate-secret': secret,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ reason: 'targeted-fw-content-repair' }),
    cache: 'no-store',
  });
  const payload = await response.json().catch(() => null) as Record<string, unknown> | null;
  if (!response.ok || payload?.revalidated !== true) {
    throw new Error(`Renderer cache invalidation failed (${response.status}).`);
  }
  return {
    scope: typeof payload.scope === 'string' ? payload.scope : 'tenant',
    tenantId: input.tenantId,
  };
}
