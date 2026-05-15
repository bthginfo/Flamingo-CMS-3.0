'use server';

import { provisionTenant, type ProvisionInput } from '@/lib/provisioning';
import { getDb } from '@/lib/db';
import { tenants, tenantDomains, globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { addDomainToRenderer, removeDomainFromRenderer, checkDomainStatus, deleteVercelProject } from '@/lib/vercel';

export async function createTenantAction(input: ProvisionInput) {
  try {
    const result = await provisionTenant(input);
    revalidatePath('/crm');
    revalidatePath('/crm/tenants');
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Provisioning failed';
    console.error('Provisioning error:', message);
    throw new Error(message);
  }
}

export async function updateTenantAction(tenantId: string, data: { name?: string; status?: 'active' | 'suspended'; activeStyle?: string }) {
  const db = getDb();
  await db.update(tenants)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tenants.id, tenantId));
  revalidatePath('/crm');
  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true };
}

export async function addDomainAction(tenantId: string, domain: string) {
  const db = getDb();

  // Add to DB
  await db.insert(tenantDomains).values({
    tenantId,
    domain,
    type: 'primary',
    verified: false,
  });

  // Add to Vercel
  try {
    const result = await addDomainToRenderer(domain);
    if (result.verified) {
      await db.update(tenantDomains)
        .set({ verified: true })
        .where(eq(tenantDomains.domain, domain));
    }
    revalidatePath(`/crm/tenants/${tenantId}`);
    return { success: true, configured: result.configured, verified: result.verified };
  } catch (err) {
    revalidatePath(`/crm/tenants/${tenantId}`);
    return { success: false, error: (err as Error).message };
  }
}

export async function removeDomainAction(tenantId: string, domain: string) {
  const db = getDb();
  await db.delete(tenantDomains).where(eq(tenantDomains.domain, domain));
  try {
    await removeDomainFromRenderer(domain);
  } catch {
    // Ignore
  }
  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true };
}

export async function checkDomainAction(domain: string) {
  return checkDomainStatus(domain);
}

export async function updateDesignAction(tenantId: string, data: { brand?: Record<string, unknown>; design?: Record<string, unknown> }) {
  const db = getDb();
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (data.brand) updates.brand = data.brand;
  if (data.design) updates.design = data.design;
  await db.update(globalSettings).set(updates).where(eq(globalSettings.tenantId, tenantId));
  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true };
}

export async function deleteTenantAction(tenantId: string) {
  const db = getDb();

  // Look up tenant to check for Vercel project
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId));
  if (!tenant) return { success: false, error: 'Tenant not found' };

  // Remove all domains from Vercel
  const domains = await db.select().from(tenantDomains).where(eq(tenantDomains.tenantId, tenantId));
  for (const d of domains) {
    try { await removeDomainFromRenderer(d.domain); } catch { /* ignore */ }
  }

  // Delete standalone Vercel project if present
  if (tenant.vercelProjectId) {
    await deleteVercelProject(tenant.vercelProjectId);
  }

  // Delete tenant (cascades to all related tables)
  await db.delete(tenants).where(eq(tenants.id, tenantId));

  revalidatePath('/crm');
  revalidatePath('/crm/tenants');
  return { success: true };
}
