export function hasValidCrmClaims(payload: unknown, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (!payload || typeof payload !== 'object') return false;
  const claims = payload as { role?: unknown; exp?: unknown };
  return claims.role === 'crm_admin'
    && typeof claims.exp === 'number'
    && Number.isFinite(claims.exp)
    && claims.exp > nowSeconds;
}
