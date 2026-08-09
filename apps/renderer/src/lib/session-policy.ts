import type { SessionClaims } from '@flamingo/auth';

export type SessionTenantState = {
  status: 'active' | 'suspended' | 'provisioning';
  isDemo: boolean;
  sessionVersion: number;
};

/** Pure policy shared by the DB-backed session boundary and its tests. */
export function isSessionStateValid(session: SessionClaims, tenant: SessionTenantState): boolean {
  if (tenant.status !== 'active') return false;
  if (session.sessionVersion !== tenant.sessionVersion) return false;
  if (session.role === 'demo' && !tenant.isDemo) return false;
  return true;
}
