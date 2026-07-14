'use server';

import { provisionTenant, type ProvisionInput } from '@/lib/provisioning';
import { getDb } from '@/lib/db';
import { tenants, tenantDomains, globalSettings, tenantAddons, shopSettings, bookingSettings, pages, pageSections, type Industry } from '@flamingo/db';
import { eq, and, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { addDomainToRenderer, addDomainToProject, removeDomainFromRenderer, checkDomainStatus, deleteVercelProject, configureBlobForProject, createStandaloneProject } from '@/lib/vercel';
import { requireCrmAdmin } from '@/lib/session';

export async function createTenantAction(input: ProvisionInput) {
  await requireCrmAdmin();
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

export async function updateTenantAction(tenantId: string, data: { name?: string; status?: 'active' | 'suspended'; activeStyle?: string; isDemo?: boolean; isLead?: boolean; deploymentMode?: 'shared' | 'lead_shared'; industry?: Industry }) {
  await requireCrmAdmin();
  const db = getDb();
  await db.update(tenants)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tenants.id, tenantId));
  revalidatePath('/crm');
  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true };
}

export async function addDomainAction(tenantId: string, domain: string) {
  await requireCrmAdmin();
  const db = getDb();
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  if (!tenant) return { success: false, error: 'Tenant nicht gefunden' };

  // Add to DB
  await db.insert(tenantDomains).values({
    tenantId,
    domain,
    type: 'primary',
    verified: false,
  });

  // Add to Vercel
  try {
    const result = tenant.deploymentMode === 'standalone' && tenant.vercelProjectId
      ? await addDomainToProject(tenant.vercelProjectId, domain)
      : await addDomainToRenderer(domain);
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

export async function convertLeadSharedToStandaloneAction(tenantId: string) {
  await requireCrmAdmin();
  const db = getDb();
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  if (!tenant) return { success: false as const, error: 'Tenant nicht gefunden' };
  if (tenant.deploymentMode !== 'lead_shared') {
    return { success: false as const, error: 'Nur Lead-Shared-Tenants können mit diesem Button umgezogen werden.' };
  }

  try {
    const result = await createStandaloneProject(tenant.slug, tenant.id);
    await db.update(tenants)
      .set({ deploymentMode: 'standalone', vercelProjectId: result.projectId, isLead: false, updatedAt: new Date() })
      .where(eq(tenants.id, tenantId));

    const previewDomain = `flamingo-${tenant.slug}.vercel.app`;
    const [existingDomain] = await db.select().from(tenantDomains).where(eq(tenantDomains.domain, previewDomain)).limit(1);
    if (!existingDomain) {
      await db.insert(tenantDomains).values({ tenantId, domain: previewDomain, type: 'preview', verified: true });
    }

    revalidatePath('/crm');
    revalidatePath(`/crm/tenants/${tenantId}`);
    return { success: true as const, projectUrl: result.projectUrl, warning: result.blobConnected ? undefined : 'Blob Storage wurde nicht automatisch verbunden. Bitte im Tenant prüfen.' };
  } catch (err) {
    return { success: false as const, error: err instanceof Error ? err.message : 'Standalone-Umzug fehlgeschlagen' };
  }
}

export async function removeDomainAction(tenantId: string, domain: string) {
  await requireCrmAdmin();
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
  await requireCrmAdmin();
  return checkDomainStatus(domain);
}

export async function updateDesignAction(tenantId: string, data: { brand?: Record<string, unknown>; design?: Record<string, unknown> }) {
  await requireCrmAdmin();
  const db = getDb();
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (data.brand) updates.brand = data.brand;
  if (data.design) updates.design = data.design;
  await db.update(globalSettings).set(updates).where(eq(globalSettings.tenantId, tenantId));
  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true };
}

export async function deleteTenantAction(tenantId: string) {
  await requireCrmAdmin();
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
  await requireCrmAdmin();
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
  await requireCrmAdmin();
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
  await requireCrmAdmin();
  const db = getDb();
  const [row] = await db.select().from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'shop')))
    .limit(1);
  return row?.active ?? false;
}

export async function toggleBookingAddonAction(tenantId: string, activate: boolean) {
  await requireCrmAdmin();
  const db = getDb();
  const now = new Date();

  const [existing] = await db.select().from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'booking')))
    .limit(1);

  if (activate) {
    if (existing) {
      await db.update(tenantAddons).set({ active: true, activatedAt: now }).where(eq(tenantAddons.id, existing.id));
    } else {
      await db.insert(tenantAddons).values({ tenantId, addonKey: 'booking', active: true, activatedAt: now });
    }
    const [settings] = await db.select().from(bookingSettings).where(eq(bookingSettings.tenantId, tenantId)).limit(1);
    if (!settings) {
      await db.insert(bookingSettings).values({ tenantId });
    }
  } else if (existing) {
    await db.update(tenantAddons).set({ active: false }).where(eq(tenantAddons.id, existing.id));
  }

  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true };
}

export async function getBookingAddonStatus(tenantId: string): Promise<boolean> {
  await requireCrmAdmin();
  const db = getDb();
  const [row] = await db.select().from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'booking')))
    .limit(1);
  return row?.active ?? false;
}

export async function toggleI18nAction(tenantId: string, active: boolean) {
  'use server';
  await requireCrmAdmin();
  const db = getDb();
  await db.update(tenants)
    .set({ i18nEnabled: active, updatedAt: new Date() })
    .where(eq(tenants.id, tenantId));
  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true };
}

export async function updateI18nSettingsAction(tenantId: string, data: { maxLanguages?: number }) {
  'use server';
  await requireCrmAdmin();
  const db = getDb();
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (data.maxLanguages !== undefined) updates.i18nMaxLanguages = data.maxLanguages;
  await db.update(tenants).set(updates).where(eq(tenants.id, tenantId));
  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true };
}
