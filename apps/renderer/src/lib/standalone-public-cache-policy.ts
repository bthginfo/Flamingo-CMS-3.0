/**
 * Only the public standalone status mirror is cached by this policy. Admin
 * sessions and PAT authorization continue to check current tenant state.
 * Tenant-tag invalidation still takes effect immediately for public content.
 */
export function standalonePublicStatusTtl(configured: string | undefined): number {
  if (!configured || !/^\d+$/.test(configured)) return 60;
  const seconds = Number(configured);
  return Number.isSafeInteger(seconds) && seconds >= 60 && seconds <= 3600 ? seconds : 60;
}
