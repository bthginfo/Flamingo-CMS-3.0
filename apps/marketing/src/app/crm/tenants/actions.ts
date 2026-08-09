'use server';

import { provisionTenant, type ProvisionInput } from '@/lib/provisioning';
import { getDb } from '@/lib/db';
import { BCRYPT_MAX_PASSWORD_BYTES, hashPassword, isPasswordWithinBcryptLimit } from '@flamingo/auth';
import { BILLING_ADDON_KEY, createDb, migrateDatabase, tenants, tenantDatabaseConnections, tenantDomains, globalSettings, tenantAddons, shopSettings, bookingSettings, billingSettings, pages, pageSections, crmCustomers, leads, type Industry } from '@flamingo/db';
import { eq, and, inArray, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { addDomainToRenderer, addDomainToProject, removeDomainFromProject, removeDomainFromRenderer, checkDomainStatus, deleteVercelProject, configureBlobForProject, createStandaloneProject, setStandaloneDatabaseConnection } from '@/lib/vercel';
import { requireCrmAdmin } from '@/lib/session';
import { protectCrmSecret } from '@/lib/secret-storage';
import { createNeonRuntimeDatabaseRole, createNeonTenantProject, deleteNeonProject, findNeonTenantProject, getNeonTenantProjectById } from '@/lib/neon';
import { getRequiredStandaloneDatabase, getTenantDataDb, getTenantDatabaseRecord, markTenantDatabaseActive, mirrorTenantControlFields, registerTenantDatabase, updateTenantRuntimeDatabaseConnection } from '@/lib/tenant-data-db';
import { copyTenantData, purgeSharedTenantData, verifyTenantDataCopy } from '@/lib/tenant-data-migration';
import { acquireTenantOperation, completeTenantOperation, createTenantOperationFingerprint, failTenantOperation, heartbeatTenantOperation } from '@/lib/tenant-operation';

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
  const controlDb = getDb();
  if (data.status === 'suspended') {
    // Revoke in the runtime database first. If the subsequent control-plane
    // mirror fails, the customer-facing admin boundary still fails closed.
    const dataDb = await getTenantDataDb(tenantId);
    const [revokedTenant] = await dataDb.update(tenants)
      .set({
        ...data,
        sessionVersion: sql`${tenants.sessionVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, tenantId))
      .returning({ sessionVersion: tenants.sessionVersion });
    if (!revokedTenant) throw new Error('Tenant nicht gefunden');
    if (dataDb !== controlDb) {
      await controlDb.update(tenants)
        .set({ ...data, sessionVersion: revokedTenant.sessionVersion, updatedAt: new Date() })
        .where(eq(tenants.id, tenantId));
    }
  } else {
    await controlDb.update(tenants)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tenants.id, tenantId));
    await mirrorTenantControlFields(tenantId, data);
  }
  revalidatePath('/crm');
  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true };
}

export async function resetTenantAdminPasswordAction(tenantId: string, rawPassword: string) {
  await requireCrmAdmin();
  const password = rawPassword.trim();
  if (password.length < 12) return { success: false as const, error: 'Das neue Passwort muss mindestens 12 Zeichen haben.' };
  if (!isPasswordWithinBcryptLimit(password)) return { success: false as const, error: `Das neue Passwort ist zu lang. Maximal ${BCRYPT_MAX_PASSWORD_BYTES} UTF-8-Bytes sind erlaubt.` };

  const controlDb = getDb();
  const [tenant] = await controlDb.select({ id: tenants.id }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  if (!tenant) return { success: false as const, error: 'Tenant nicht gefunden.' };

  const now = new Date();
  const passwordHash = await hashPassword(password);
  const dataDb = await getTenantDataDb(tenantId);

  // neon-http has no interactive Drizzle transactions. Upsert the secret and
  // revoke every previous session in one atomic statement instead.
  const resetResult = await dataDb.execute(sql`
    WITH upserted_secret AS (
      INSERT INTO admin_secrets (tenant_id, password_hash, password_updated_at, updated_at)
      VALUES (${tenantId}::uuid, ${passwordHash}, ${now}, ${now})
      ON CONFLICT (tenant_id) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        password_updated_at = EXCLUDED.password_updated_at,
        updated_at = EXCLUDED.updated_at
      RETURNING tenant_id
    ),
    updated_tenant AS (
      UPDATE tenants
      SET session_version = session_version + 1,
          updated_at = ${now}
      WHERE id = ${tenantId}::uuid
        AND EXISTS (SELECT 1 FROM upserted_secret)
      RETURNING session_version
    )
    SELECT session_version FROM updated_tenant
  `);
  const nextSessionVersion = Number((resetResult.rows[0] as { session_version?: number | string } | undefined)?.session_version);
  if (!Number.isSafeInteger(nextSessionVersion) || nextSessionVersion < 0) throw new Error('Tenant nicht gefunden.');
  if (dataDb !== controlDb) {
    await controlDb.update(tenants).set({ sessionVersion: nextSessionVersion, updatedAt: now }).where(eq(tenants.id, tenantId));
  }

  const encryptedPassword = protectCrmSecret(password);
  await Promise.all([
    controlDb.update(crmCustomers).set({ adminPassword: encryptedPassword, updatedAt: now }).where(eq(crmCustomers.tenantId, tenantId)),
    controlDb.update(leads).set({ adminPassword: encryptedPassword, updatedAt: now }).where(eq(leads.tenantId, tenantId)),
  ]);

  revalidatePath('/crm');
  revalidatePath('/crm/tenants');
  revalidatePath(`/crm/tenants/${tenantId}`);
  revalidatePath('/crm/kunden');
  revalidatePath('/crm/leads');
  return { success: true as const };
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
  const operationKey = `shared-to-standalone:${tenantId}`;
  // This remains stable across the final routing flip, allowing a response
  // retry to resolve the same durable operation after the tenant is standalone.
  const inputFingerprint = createTenantOperationFingerprint({ tenantId, slug: tenant.slug });
  const claim = await acquireTenantOperation({
    operationKey,
    kind: 'shared_to_standalone',
    inputFingerprint,
    tenantId,
    slug: tenant.slug,
  });
  if (claim.state === 'completed') return claim.result as { success: true; projectUrl?: string; warning?: string };
  if (claim.state === 'in_progress') {
    return { success: false as const, error: `Der Standalone-Umzug läuft bereits (Phase: ${claim.phase}).` };
  }
  const ownerToken = claim.ownerToken;
  if (!['shared', 'lead_shared'].includes(tenant.deploymentMode)) {
    if (tenant.deploymentMode === 'standalone' && tenant.vercelProjectId) {
      const existingRegistry = await getTenantDatabaseRecord(tenantId);
      if (existingRegistry?.status === 'active') {
        const alreadyComplete = {
          success: true as const,
          projectUrl: `https://flamingo-${tenant.slug}.vercel.app`,
          warning: 'Der Tenant war bereits vollständig auf Standalone umgestellt.',
        };
        await completeTenantOperation({ operationKey, ownerToken, result: alreadyComplete });
        return alreadyComplete;
      }
    }
    const error = new Error('Nur Shared-Tenants können in ein Standalone-Projekt umgezogen werden.');
    await failTenantOperation({ operationKey, ownerToken, error });
    return { success: false as const, error: error.message };
  }

  let neonProject: Awaited<ReturnType<typeof createNeonTenantProject>> | undefined;
  let vercelProjectId: string | undefined;
  let cutoverComplete = false;
  const movedDomains: string[] = [];
  try {
    const [quiesced] = await db.update(tenants)
      .set({ status: 'provisioning', updatedAt: new Date() })
      .where(and(eq(tenants.id, tenantId), inArray(tenants.deploymentMode, ['shared', 'lead_shared'])))
      .returning({ id: tenants.id });
    if (!quiesced) throw new Error('Der Tenant wurde parallel verändert; der Umzug wurde sicher abgebrochen.');
    await heartbeatTenantOperation({ operationKey, ownerToken, phase: 'writes_quiesced', tenantId });

    const registered = await getTenantDatabaseRecord(tenantId);
    if (registered) {
      const standalone = await getRequiredStandaloneDatabase(tenantId);
      neonProject = {
        projectId: registered.projectId,
        branchId: '',
        region: registered.region,
        databaseName: registered.databaseName,
        roleName: registered.roleName,
        pooledConnectionUri: standalone.pooledConnectionUri,
        directConnectionUri: standalone.directConnectionUri,
      };
    } else {
      neonProject = await findNeonTenantProject(tenant.slug) || await createNeonTenantProject(tenant.slug);
      await migrateDatabase(neonProject.directConnectionUri);
      const runtime = await createNeonRuntimeDatabaseRole(neonProject);
      neonProject = { ...neonProject, roleName: runtime.roleName, pooledConnectionUri: runtime.connectionUri };
      await registerTenantDatabase({ tenantId, ...neonProject });
    }
    await migrateDatabase(neonProject.directConnectionUri);
    await heartbeatTenantOperation({ operationKey, ownerToken, phase: 'database_ready', tenantId, resources: { neonProjectId: neonProject.projectId } });
    const targetDb = createDb(neonProject.pooledConnectionUri);
    let targetVerified = false;
    try {
      await verifyTenantDataCopy(db, targetDb, tenantId);
      targetVerified = true;
    } catch {
      // A previous owned attempt may have stopped halfway through the copy.
      // Target is not routable while the control tenant is quiesced, so only
      // this incomplete target copy is reset and then resumed from source.
      const [partialTenant] = await targetDb.select({ id: tenants.id }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
      if (partialTenant) {
        await heartbeatTenantOperation({ operationKey, ownerToken, phase: 'resetting_partial_target', tenantId });
        await purgeSharedTenantData(targetDb, tenantId);
        await targetDb.delete(tenants).where(eq(tenants.id, tenantId));
      }
    }
    if (!targetVerified) await copyTenantData(db, targetDb, tenantId);
    await verifyTenantDataCopy(db, targetDb, tenantId);
    await heartbeatTenantOperation({ operationKey, ownerToken, phase: 'copy_verified', tenantId });

    const result = await createStandaloneProject(tenant.slug, tenant.id, neonProject.pooledConnectionUri);
    vercelProjectId = result.projectId;
    await heartbeatTenantOperation({ operationKey, ownerToken, phase: 'deployment_ready', tenantId, resources: { vercelProjectId } });

    // Custom domains must never route to a target whose tenant is still
    // provisioning. The source stays quiesced through the final verification.
    await targetDb.update(tenants)
      .set({ deploymentMode: 'standalone', vercelProjectId, isLead: false, status: 'active', updatedAt: new Date() })
      .where(eq(tenants.id, tenantId));

    const previewDomain = `flamingo-${tenant.slug}.vercel.app`;
    for (const database of [db, targetDb]) {
      const [existingDomain] = await database.select().from(tenantDomains).where(eq(tenantDomains.domain, previewDomain)).limit(1);
      if (existingDomain && existingDomain.tenantId !== tenantId) throw new Error(`Die Preview-Domain ${previewDomain} ist bereits belegt.`);
      if (!existingDomain) await database.insert(tenantDomains).values({ tenantId, domain: previewDomain, type: 'preview', verified: true });
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
        await heartbeatTenantOperation({ operationKey, ownerToken, phase: 'routing_domains', tenantId });
      } catch (domainError) {
        console.error(`Domain cutover failed for ${domain.domain}:`, domainError);
        await addDomainToRenderer(domain.domain).catch(restoreError => console.error(`Domain restore failed for ${domain.domain}:`, restoreError));
        throw new Error(`Der Domain-Cutover für ${domain.domain} ist fehlgeschlagen. Die Quelldaten wurden nicht gelöscht.`);
      }
    }

    await verifyTenantDataCopy(db, targetDb, tenantId);
    await markTenantDatabaseActive(tenantId);
    // deploymentMode is the routing authority and is flipped only after the
    // target, deployment and domains are ready. Source rows remain available
    // for an explicit later purge after an observation window.
    await db.update(tenants)
      .set({ deploymentMode: 'standalone', vercelProjectId, isLead: false, status: 'active', updatedAt: new Date() })
      .where(eq(tenants.id, tenantId));
    cutoverComplete = true;

    revalidatePath('/crm');
    revalidatePath(`/crm/tenants/${tenantId}`);
    const warnings = [
      !result.blobConnected ? 'Blob Storage wurde nicht automatisch verbunden. Bitte im Tenant prüfen.' : '',
    ].filter(Boolean);
    warnings.push('Die Shared-Quelldaten bleiben bis zu einer separaten, verifizierten Bereinigung als Rückfallkopie erhalten.');
    const actionResult = { success: true as const, projectUrl: result.projectUrl, warning: warnings.join(' ') };
    await completeTenantOperation({ operationKey, ownerToken, result: actionResult }).catch(error => console.error('Cutover operation completion failed:', error));
    return actionResult;
  } catch (err) {
    if (!cutoverComplete) {
      for (const domain of movedDomains) {
        if (vercelProjectId) await removeDomainFromProject(vercelProjectId, domain).catch(() => undefined);
        await addDomainToRenderer(domain).catch(cleanupError => console.error(`Domain rollback failed for ${domain}:`, cleanupError));
      }
      await db.update(tenants).set({ status: tenant.status, deploymentMode: tenant.deploymentMode, isLead: tenant.isLead, vercelProjectId: tenant.vercelProjectId, updatedAt: new Date() }).where(eq(tenants.id, tenantId));
      if (neonProject) {
        const targetDb = createDb(neonProject.pooledConnectionUri);
        await targetDb.update(tenants).set({ status: 'provisioning', updatedAt: new Date() }).where(eq(tenants.id, tenantId)).catch(() => undefined);
      }
      await db.update(tenantDatabaseConnections).set({ status: 'provisioning', updatedAt: new Date() })
        .where(eq(tenantDatabaseConnections.tenantId, tenantId)).catch(() => undefined);
    }
    await failTenantOperation({ operationKey, ownerToken, error: err }).catch(error => console.error('Cutover operation failure update failed:', error));
    return { success: false as const, error: err instanceof Error ? err.message : 'Standalone-Umzug fehlgeschlagen' };
  }
}

export async function setDatabasePlanIntentAction(tenantId: string, intent: 'free' | 'paid_requested') {
  await requireCrmAdmin();
  const db = getDb();
  const [record] = await db.select({ tenantId: tenantDatabaseConnections.tenantId })
    .from(tenantDatabaseConnections)
    .where(eq(tenantDatabaseConnections.tenantId, tenantId))
    .limit(1);
  if (!record) return { success: false as const, error: 'Keine Standalone-Datenbank registriert.' };
  await db.update(tenantDatabaseConnections)
    .set({ billingPlanIntent: intent, updatedAt: new Date() })
    .where(eq(tenantDatabaseConnections.tenantId, tenantId));
  revalidatePath(`/crm/tenants/${tenantId}`);
  revalidatePath('/crm/tenants');
  return { success: true as const };
}

export async function hardenStandaloneDatabaseRoleAction(tenantId: string) {
  await requireCrmAdmin();
  try {
    const db = getDb();
    const [tenant] = await db.select({ slug: tenants.slug, deploymentMode: tenants.deploymentMode, vercelProjectId: tenants.vercelProjectId })
      .from(tenants).where(eq(tenants.id, tenantId)).limit(1);
    if (!tenant || tenant.deploymentMode !== 'standalone' || !tenant.vercelProjectId) {
      return { success: false as const, error: 'Kein vollständiges Standalone-Projekt gefunden.' };
    }
    const standalone = await getRequiredStandaloneDatabase(tenantId);
    if (standalone.record.roleName.startsWith('flamingo_app_')) return { success: true as const, alreadySecure: true };
    const neonProject = await getNeonTenantProjectById(standalone.record.projectId, {
      databaseName: standalone.record.databaseName,
      roleName: standalone.record.roleName,
      region: standalone.record.region,
    });
    const runtime = await createNeonRuntimeDatabaseRole({ ...neonProject, directConnectionUri: standalone.directConnectionUri });
    await setStandaloneDatabaseConnection(tenant.vercelProjectId, tenant.slug, tenantId, runtime.connectionUri);
    await updateTenantRuntimeDatabaseConnection(tenantId, runtime);
    revalidatePath(`/crm/tenants/${tenantId}`);
    return { success: true as const, alreadySecure: false };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Datenbankrolle konnte nicht abgesichert werden.' };
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
  const db = await getTenantDataDb(tenantId).catch(() => null);
  if (!db) return false;
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
  const db = await getTenantDataDb(tenantId).catch(() => null);
  if (!db) return false;
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
  const db = await getTenantDataDb(tenantId).catch(() => null);
  if (!db) return false;
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
