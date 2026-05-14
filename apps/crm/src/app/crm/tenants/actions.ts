'use server';

import { provisionTenant, type ProvisionInput } from '@/lib/provisioning';
import { getDb } from '@/lib/db';
import { tenants, tenantDomains } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { addDomainToRenderer, removeDomainFromRenderer, checkDomainStatus } from '@/lib/vercel';

export async function createTenantAction(input: ProvisionInput) {
  const result = await provisionTenant(input);
  revalidatePath('/crm');
  revalidatePath('/crm/tenants');
  return result;
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
