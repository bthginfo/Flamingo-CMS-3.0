import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Public tenant settings are cached independently from published snapshots.
 * Mutations must invalidate both the tenant data tag and every route that can
 * consume the changed settings (metadata routes included).
 */
export function revalidateTenantPublicData(tenantId: string) {
  revalidateTag(`tenant-${tenantId}`);
  revalidatePath('/', 'layout');
}
