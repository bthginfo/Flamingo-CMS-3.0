'use server';

import { provisionTenant, type ProvisionInput } from '@/lib/provisioning';
import { getDb } from '@/lib/db';
import { tenants, tenantDomains, globalSettings, tenantAddons, shopSettings, pages, pageSections } from '@flamingo/db';
import { eq, and, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { addDomainToRenderer, removeDomainFromRenderer, checkDomainStatus, deleteVercelProject, configureBlobForProject } from '@/lib/vercel';

export async function createTenantAction(input: ProvisionInput) {
  try {
    const result = await provisionTenant(input);
    revalidatePath('/crm');
    revalidatePath('/crm/tenants');
    return { success: true as const, ...result };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Provisioning failed';
    console.error('Provisioning error:', message, err);
    return { success: false as const, error: message };
  }
}

export async function updateTenantAction(tenantId: string, data: { name?: string; status?: 'active' | 'suspended'; activeStyle?: string; isDemo?: boolean; isLead?: boolean }) {
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

export async function configureBlobAction(tenantId: string) {
  const db = getDb();
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId));
  if (!tenant) return { success: false, error: 'Tenant nicht gefunden' };
  if (tenant.deploymentMode !== 'standalone') return { success: false, error: 'Nur für Standalone-Tenants verfügbar' };

  const projectName = `flamingo-${tenant.slug}`;
  const result = await configureBlobForProject(projectName);

  if (!result.success) {
    return { success: false, error: result.error || 'Blob Storage konnte nicht konfiguriert werden' };
  }

  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true };
}

export async function toggleShopAddonAction(tenantId: string, activate: boolean) {
  const db = getDb();
  const now = new Date();

  const [existing] = await db.select().from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'shop')))
    .limit(1);

  if (activate) {
    if (existing) {
      await db.update(tenantAddons).set({ active: true, activatedAt: now }).where(eq(tenantAddons.id, existing.id));
    } else {
      await db.insert(tenantAddons).values({ tenantId, addonKey: 'shop', active: true, activatedAt: now });
    }
    // Ensure shop settings exist
    const [settings] = await db.select().from(shopSettings).where(eq(shopSettings.tenantId, tenantId)).limit(1);
    if (!settings) {
      await db.insert(shopSettings).values({ tenantId });
    }
  } else {
    if (existing) {
      await db.update(tenantAddons).set({ active: false }).where(eq(tenantAddons.id, existing.id));
    }
    // Delete all shop system pages
    const SHOP_SLUGS = ['shop', 'warenkorb', 'checkout', 'bestellung-abgeschlossen', 'agb', 'widerrufsbelehrung'];
    const shopPages = await db.select({ id: pages.id }).from(pages)
      .where(and(eq(pages.tenantId, tenantId), inArray(pages.slug, SHOP_SLUGS)));
    if (shopPages.length > 0) {
      const pageIds = shopPages.map(p => p.id);
      await db.delete(pageSections).where(and(eq(pageSections.tenantId, tenantId), inArray(pageSections.pageId, pageIds)));
      await db.delete(pages).where(and(eq(pages.tenantId, tenantId), inArray(pages.id, pageIds)));
    }
  }

  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true };
}

export async function getShopAddonStatus(tenantId: string): Promise<boolean> {
  const db = getDb();
  const [row] = await db.select().from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'shop')))
    .limit(1);
  return row?.active ?? false;
}
