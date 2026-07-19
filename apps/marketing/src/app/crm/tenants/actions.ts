'use server';

import { provisionTenant, type ProvisionInput } from '@/lib/provisioning';
import { getDb } from '@/lib/db';
import { BILLING_ADDON_KEY, createDb, migrateDatabase, tenants, tenantDomains, globalSettings, tenantAddons, shopSettings, bookingSettings, billingSettings, pages, pageSections, type Industry } from '@flamingo/db';
import { eq, and, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { addDomainToRenderer, addDomainToProject, removeDomainFromProject, removeDomainFromRenderer, checkDomainStatus, deleteVercelProject, configureBlobForProject, createStandaloneProject } from '@/lib/vercel';
import { requireCrmAdmin } from '@/lib/session';
import { createNeonTenantProject, deleteNeonProject } from '@/lib/neon';
import { getTenantDataDb, getTenantDatabaseRecord, markTenantDatabaseActive, mirrorTenantControlFields, registerTenantDatabase, removeTenantDatabaseRecord } from '@/lib/tenant-data-db';
import { copyTenantData, purgeSharedTenantData, verifyTenantDataCopy } from '@/lib/tenant-data-migration';

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
  await mirrorTenantControlFields(tenantId, data);
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
  const dataDb = await getTenantDataDb(tenantId);
  if (dataDb !== db) await dataDb.insert(tenantDomains).values({ tenantId, domain, type: 'primary', verified: false });

  // Add to Vercel
  try {
    const result = tenant.deploymentMode === 'standalone' && tenant.vercelProjectId
      ? await addDomainToProject(tenant.vercelProjectId, domain)
      : await addDomainToRenderer(domain);
    if (result.verified) {
      await db.update(tenantDomains)
        .set({ verified: true })
        .where(eq(tenantDomains.domain, domain));
      if (dataDb !== db) await dataDb.update(tenantDomains).set({ verified: true }).where(eq(tenantDomains.domain, domain));
    }
    revalidatePath(`/crm/tenants/${tenantId}`);
    return { success: true, configured: result.configured, verified: result.verified };
  } catch (err) {
    revalidatePath(`/crm/tenants/${tenantId}`);
    return { success: false, error: (err as Error).message };
  }
}

export async function convertSharedToStandaloneAction(tenantId: string) {
  await requireCrmAdmin();
  const db = getDb();
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  if (!tenant) return { success: false as const, error: 'Tenant nicht gefunden' };
  if (!['shared', 'lead_shared'].includes(tenant.deploymentMode)) {
    return { success: false as const, error: 'Nur Shared-Tenants können in ein Standalone-Projekt umgezogen werden.' };
  }

  let neonProject: Awaited<ReturnType<typeof createNeonTenantProject>> | undefined;
  let vercelProjectId: string | undefined;
  let vercelProjectCreated = false;
  let cutoverComplete = false;
  const movedDomains: string[] = [];
  try {
    await db.update(tenants).set({ status: 'provisioning', updatedAt: new Date() }).where(eq(tenants.id, tenantId));
    neonProject = await createNeonTenantProject(tenant.slug);
    await registerTenantDatabase({ tenantId, ...neonProject });
    await migrateDatabase(neonProject.directConnectionUri);
    const targetDb = createDb(neonProject.pooledConnectionUri);
    await copyTenantData(db, targetDb, tenantId);

    const result = await createStandaloneProject(tenant.slug, tenant.id, neonProject.pooledConnectionUri);
    vercelProjectId = result.projectId;
    vercelProjectCreated = result.projectCreated;
    await verifyTenantDataCopy(db, targetDb, tenantId);
    await db.update(tenants)
      .set({ deploymentMode: 'standalone', vercelProjectId, isLead: false, status: tenant.status, updatedAt: new Date() })
      .where(eq(tenants.id, tenantId));
    await targetDb.update(tenants)
      .set({ deploymentMode: 'standalone', vercelProjectId, isLead: false, status: tenant.status, updatedAt: new Date() })
      .where(eq(tenants.id, tenantId));

    const previewDomain = `flamingo-${tenant.slug}.vercel.app`;
    const [existingDomain] = await db.select().from(tenantDomains).where(eq(tenantDomains.domain, previewDomain)).limit(1);
    if (!existingDomain) {
      await db.insert(tenantDomains).values({ tenantId, domain: previewDomain, type: 'preview', verified: true });
      await targetDb.insert(tenantDomains).values({ tenantId, domain: previewDomain, type: 'preview', verified: true });
    }

    const existingDomains = await db.select().from(tenantDomains).where(eq(tenantDomains.tenantId, tenantId));
    for (const domain of existingDomains.filter(item => item.domain !== previewDomain)) {
      try {
        await removeDomainFromRenderer(domain.domain);
        const configured = await addDomainToProject(vercelProjectId, domain.domain);
        if (configured.verified) {
          await db.update(tenantDomains).set({ verified: true }).where(eq(tenantDomains.domain, domain.domain));
          await targetDb.update(tenantDomains).set({ verified: true }).where(eq(tenantDomains.domain, domain.domain));
        }
        movedDomains.push(domain.domain);
      } catch (domainError) {
        console.error(`Domain cutover failed for ${domain.domain}:`, domainError);
        await addDomainToRenderer(domain.domain).catch(restoreError => console.error(`Domain restore failed for ${domain.domain}:`, restoreError));
        throw new Error(`Der Domain-Cutover für ${domain.domain} ist fehlgeschlagen. Die Quelldaten wurden nicht gelöscht.`);
      }
    }

    await markTenantDatabaseActive(tenantId);
    await purgeSharedTenantData(db, tenantId);
    cutoverComplete = true;

    revalidatePath('/crm');
    revalidatePath(`/crm/tenants/${tenantId}`);
    const warnings = [
      !result.blobConnected ? 'Blob Storage wurde nicht automatisch verbunden. Bitte im Tenant prüfen.' : '',
    ].filter(Boolean);
    return { success: true as const, projectUrl: result.projectUrl, warning: warnings.join(' ') };
  } catch (err) {
    if (!cutoverComplete) {
      if (vercelProjectId && vercelProjectCreated) await deleteVercelProject(vercelProjectId).catch(cleanupError => console.error('Vercel rollback failed:', cleanupError));
      for (const domain of movedDomains) {
        if (vercelProjectId) await removeDomainFromProject(vercelProjectId, domain).catch(() => undefined);
        await addDomainToRenderer(domain).catch(cleanupError => console.error(`Domain rollback failed for ${domain}:`, cleanupError));
      }
      if (neonProject?.projectId) await deleteNeonProject(neonProject.projectId).catch(cleanupError => console.error('Neon rollback failed:', cleanupError));
      await removeTenantDatabaseRecord(tenantId).catch(cleanupError => console.error('Database registry rollback failed:', cleanupError));
      await db.update(tenants).set({ status: tenant.status, deploymentMode: tenant.deploymentMode, isLead: tenant.isLead, vercelProjectId: tenant.vercelProjectId, updatedAt: new Date() }).where(eq(tenants.id, tenantId));
    }
    return { success: false as const, error: err instanceof Error ? err.message : 'Standalone-Umzug fehlgeschlagen' };
  }
}

export async function removeDomainAction(tenantId: string, domain: string) {
  await requireCrmAdmin();
  const db = getDb();
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  if (!tenant) return { success: false, error: 'Tenant nicht gefunden' };
  const dataDb = await getTenantDataDb(tenantId);
  await db.delete(tenantDomains).where(and(eq(tenantDomains.tenantId, tenantId), eq(tenantDomains.domain, domain)));
  if (dataDb !== db) await dataDb.delete(tenantDomains).where(and(eq(tenantDomains.tenantId, tenantId), eq(tenantDomains.domain, domain)));
  try {
    if (tenant.deploymentMode === 'standalone' && tenant.vercelProjectId) await removeDomainFromProject(tenant.vercelProjectId, domain);
    else await removeDomainFromRenderer(domain);
  } catch {
    // Ignore
  }
  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true };
}

export async function checkDomainAction(tenantId: string, domain: string) {
  await requireCrmAdmin();
  const [tenant] = await getDb().select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  if (!tenant) return { configured: false, verified: false, dns: [], error: 'Tenant nicht gefunden' };
  return checkDomainStatus(domain, tenant.deploymentMode === 'standalone' ? tenant.vercelProjectId || undefined : undefined);
}

export async function updateDesignAction(tenantId: string, data: { brand?: Record<string, unknown>; design?: Record<string, unknown> }) {
  await requireCrmAdmin();
  const db = await getTenantDataDb(tenantId);
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

  const databaseRecord = await getTenantDatabaseRecord(tenantId);
  if (databaseRecord?.projectId) {
    await db.update(tenants).set({ status: 'suspended', updatedAt: new Date() }).where(eq(tenants.id, tenantId));
    await deleteNeonProject(databaseRecord.projectId);
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
  const db = await getTenantDataDb(tenantId);
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
  const db = await getTenantDataDb(tenantId);
  const [row] = await db.select().from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'shop')))
    .limit(1);
  return row?.active ?? false;
}

export async function toggleBookingAddonAction(tenantId: string, activate: boolean) {
  await requireCrmAdmin();
  const db = await getTenantDataDb(tenantId);
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
  const db = await getTenantDataDb(tenantId);
  const [row] = await db.select().from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'booking')))
    .limit(1);
  return row?.active ?? false;
}

export async function toggleBillingAddonAction(tenantId: string, activate: boolean) {
  await requireCrmAdmin();
  const db = await getTenantDataDb(tenantId);
  const now = new Date();
  const [existing] = await db.select().from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, BILLING_ADDON_KEY)))
    .limit(1);
  if (activate) {
    if (existing) await db.update(tenantAddons).set({ active: true, activatedAt: now }).where(eq(tenantAddons.id, existing.id));
    else await db.insert(tenantAddons).values({ tenantId, addonKey: BILLING_ADDON_KEY, active: true, activatedAt: now });
    const [tenant] = await db.select({ name: tenants.name }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
    await db.insert(billingSettings).values({ tenantId, companyName: tenant?.name || null }).onConflictDoNothing({ target: billingSettings.tenantId });
  } else if (existing) {
    // Deactivation hides the module but deliberately retains invoices for the
    // statutory retention period. Reactivation restores the same archive.
    await db.update(tenantAddons).set({ active: false }).where(eq(tenantAddons.id, existing.id));
  }
  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true as const };
}

export async function getBillingAddonStatus(tenantId: string): Promise<boolean> {
  await requireCrmAdmin();
  const db = await getTenantDataDb(tenantId);
  const [row] = await db.select({ active: tenantAddons.active }).from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, BILLING_ADDON_KEY)))
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
  await mirrorTenantControlFields(tenantId, { i18nEnabled: active });
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
  await mirrorTenantControlFields(tenantId, updates);
  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true };
}
