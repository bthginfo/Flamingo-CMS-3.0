import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { buildAtomicTenantPurgeSql } from './tenant-data-migration';
import { createTenantOperationFingerprint } from './tenant-operation';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('operation fingerprints are deterministic across object key order', () => {
  assert.equal(
    createTenantOperationFingerprint({ slug: 'tenant', nested: { mode: 'standalone', attempt: 1 } }),
    createTenantOperationFingerprint({ nested: { attempt: 1, mode: 'standalone' }, slug: 'tenant' }),
  );
});

test('atomic purge builder validates identifiers and emits one owner-checked DO statement', () => {
  const tenantId = '6f1c4984-1ae6-4b93-a590-d61416e09fa2';
  const ownerToken = '4ce83473-790f-4e40-ae18-509a51033b4a';
  const statement = buildAtomicTenantPurgeSql(tenantId, { operationKey: 'purge-shared-copy:tenant', ownerToken });
  assert.match(statement, /^DO \$flamingo_tenant_purge\$/);
  assert.match(statement, /DELETE FROM "custom_form_deliveries"/);
  assert.match(statement, /owner_token/);
  assert.equal((statement.match(/DO \$flamingo_tenant_purge\$/g) || []).length, 1);
  assert.throws(() => buildAtomicTenantPurgeSql("bad'; DROP TABLE tenants; --"));
});

test('standalone Vercel projects receive an explicit tenant database and keep auth keys stable', () => {
  const vercel = source('./vercel.ts');
  const createProject = vercel.slice(
    vercel.indexOf('export async function createStandaloneProject'),
    vercel.indexOf('/** Configure Blob storage'),
  );
  assert.match(createProject, /databaseUrl: string/);
  assert.doesNotMatch(createProject, /process\.env\.DATABASE_URL/);
  for (const key of ['ADMIN_JWT_SECRET', 'RENDERER_RATE_LIMIT_SECRET', 'CONFIG_ENCRYPTION_KEY', 'PREVIEW_SECRET']) {
    assert.match(createProject, new RegExp(`key: '${key}'[\\s\\S]{0,180}replaceExisting: false`));
  }
});

test('standalone renderer projects inherit safe runtime env from CRM provisioning env', () => {
  const vercel = source('./vercel.ts');
  assert.match(vercel, /function buildForwardedRendererRuntimeEnvVars/);
  assert.match(vercel, /function buildForwardedPlatformSmtpEnvVars/);
  assert.match(vercel, /process\.env\.PLATFORM_SMTP_HOST \|\| process\.env\.SMTP_HOST/);
  assert.match(vercel, /process\.env\.PLATFORM_SMTP_PASS \|\| process\.env\.SMTP_PASS/);
  for (const key of ['PLATFORM_SMTP_HOST', 'PLATFORM_SMTP_PORT', 'PLATFORM_SMTP_USER', 'PLATFORM_SMTP_PASS', 'PLATFORM_SMTP_FROM']) {
    assert.match(vercel, new RegExp(`key: '${key}'[\\s\\S]{0,180}replaceExisting: true`));
  }
  for (const key of ['SITE_URL', 'REVALIDATE_SECRET', 'CRON_SECRET']) {
    assert.match(vercel, new RegExp(`'${key}'`));
  }
  assert.match(vercel, /createStandaloneProject[\s\S]*\.\.\.buildForwardedRendererRuntimeEnvVars\(slug\)/);
  assert.match(vercel, /setStandaloneDatabaseConnection[\s\S]*\.\.\.buildForwardedRendererRuntimeEnvVars\(slug\)/);
  assert.doesNotMatch(vercel, /MASTER_ADMIN_PASSWORD/);
  assert.doesNotMatch(vercel, /PLATFORM_ADMIN_TENANT_IDS/);
  assert.doesNotMatch(vercel, /META_APP_SECRET/);
});

test('standalone runtime env backfill updates existing Vercel variables without logging secret values', () => {
  const script = source('../../../../scripts/add-platform-smtp-envs.ts');
  assert.match(script, /function buildPlatformSmtpEnvVars/);
  assert.match(script, /function upsertEnvVar/);
  assert.match(script, /'PATCH'/);
  assert.match(script, /SITE_URL/);
  assert.match(script, /tenantProjectUrl\(tenant\.slug\)/);
  assert.match(script, /PLATFORM_SMTP_PASS/);
  assert.doesNotMatch(script, /console\.(?:log|error)\([^)]*env\.value/);
  assert.doesNotMatch(script, /MASTER_ADMIN_PASSWORD/);
  assert.doesNotMatch(script, /PLATFORM_ADMIN_TENANT_IDS/);
});

test('standalone provisioning creates, migrates and registers a dedicated Neon database', () => {
  const provisioning = source('./provisioning.ts');
  assert.match(provisioning, /createNeonTenantProject\(input\.slug\)/);
  assert.match(provisioning, /registerTenantDatabase\(\{ tenantId, \.\.\.neonProject \}\)/);
  assert.match(provisioning, /migrateDatabase\(neonProject\.directConnectionUri\)/);
  assert.match(provisioning, /createNeonRuntimeDatabaseRole\(neonProject\)/);
  assert.match(provisioning, /createStandaloneProject\(input\.slug, tenantId, neonProject\.pooledConnectionUri, \{ waitForDeployment: false \}\)/);
});

test('registry repair treats the supplied database URL as the authoritative rotation target', () => {
  const route = source('../app/api/internal/provisioning/tenants/route.ts');
  const byConnectionIndex = route.indexOf('findNeonTenantProjectByConnectionUri(databaseUrl)');
  const bySlugIndex = route.indexOf('findNeonTenantProject(slug)');
  assert.ok(byConnectionIndex > 0, 'repair route must resolve the supplied database URL');
  assert.ok(bySlugIndex > byConnectionIndex, 'the supplied database URL must win over an older slug-matching project');
});

test('standalone Vercel provisioning cleans up freshly created projects on late failures', () => {
  const vercel = source('./vercel.ts');
  const createProject = vercel.slice(
    vercel.indexOf('export async function createStandaloneProject'),
    vercel.indexOf('/** Configure Blob storage'),
  );
  assert.match(createProject, /try \{\s*const envVars/);
  assert.match(createProject, /catch \(error\)[\s\S]*if \(projectCreated\)[\s\S]*deleteVercelProject\(projectId\)/);
  assert.match(createProject, /throw error/);
});

test('new customer tenants default to isolated Neon Free infrastructure', () => {
  const provisioning = source('./provisioning.ts');
  const newTenantPage = source('../app/crm/tenants/new/page.tsx');
  const schema = source('../../../../packages/db/src/schema/index.ts');
  assert.match(provisioning, /input\.deploymentMode \|\| 'standalone'/);
  assert.match(newTenantPage, /deploymentMode: 'standalone'/);
  assert.match(newTenantPage, /Neon Free/);
  assert.match(schema, /deploymentMode: deploymentModeEnum\('deployment_mode'\)\.notNull\(\)\.default\('standalone'\)/);
});

test('paid database needs remain an explicit cost-free CRM intent flag', () => {
  const schema = source('../../../../packages/db/src/schema/index.ts');
  const actions = source('../app/crm/tenants/actions.ts');
  const tenantActions = source('../app/crm/tenants/[id]/tenant-actions.tsx');
  const tenantList = source('../app/crm/tenants/page.tsx');
  assert.match(schema, /billingPlanIntent: varchar\('billing_plan_intent'/);
  assert.match(schema, /'free', 'paid_requested', 'external_paid'/);
  assert.match(actions, /setDatabasePlanIntentAction/);
  assert.match(actions, /billingPlanIntent: intent/);
  assert.match(tenantActions, /Die Vormerkung ändert keinen Tarif und erzeugt keine Kosten/);
  assert.match(tenantList, /Paid-DB vorgemerkt/);
});

test('shared-to-standalone cutover quiesces writes, verifies twice and retains the source', () => {
  const vercel = source('./vercel.ts');
  const actions = source('../app/crm/tenants/actions.ts');
  const migration = source('./tenant-data-migration.ts');
  assert.match(vercel, /waitForVercelDeploymentReady\(deploymentId\)/);
  const verifyMatches = actions.match(/await verifyTenantDataCopy\(db, targetDb, tenantId\)/g) || [];
  assert.ok(verifyMatches.length >= 2, 'copy must be verified before deployment and immediately before cutover');
  assert.doesNotMatch(actions, /await purgeSharedTenantData\(db, tenantId\)/, 'the conversion action must retain shared source rows');
  assert.match(actions, /status: 'provisioning'/, 'the source must be write-quiesced');
  const targetActive = actions.indexOf("targetDb.update(tenants)\n      .set({ deploymentMode: 'standalone'");
  const domainRouting = actions.indexOf('const existingDomains = await db.select()', targetActive);
  const registryActive = actions.indexOf('await markTenantDatabaseActive(tenantId)', targetActive);
  const controlFlip = actions.indexOf("db.update(tenants)\n      .set({ deploymentMode: 'standalone'", registryActive);
  assert.ok(targetActive > 0 && registryActive > targetActive && controlFlip > registryActive, 'target, registry and control routing must activate in order');
  assert.ok(domainRouting > targetActive, 'custom domains must not route before the target tenant is active');
  assert.match(actions, /\['shared', 'lead_shared'\]\.includes\(tenant\.deploymentMode\)/);
  assert.doesNotMatch(migration, /source\.transaction\(async transaction/);
  assert.match(migration, /DO \$flamingo_tenant_purge\$/);
  assert.match(migration, /name === 'billing_documents'[\s\S]*status: 'draft'/, 'immutable billing documents must be staged before their items are copied');
  assert.match(migration, /set_config\('flamingo\.tenant_maintenance_tenant',[\s\S]*true\)/, 'purge must use the transaction-local tenant maintenance capability');
  assert.match(migration, /order_status_history/, 'order status history must be copied and verified');
  assert.match(migration, /'custom_form_deliveries'/, 'the custom form delivery ledger must be copied and verified');
  assert.match(migration, /content_digest/, 'final verification must detect in-place stale writes, not only row-count drift');
  assert.match(migration, /to_jsonb\(row_data\)/, 'tenant rows must be content-hashed during cutover verification');
  for (const table of [
    'billing_settings',
    'billing_services',
    'billing_documents',
    'billing_document_items',
    'billing_payments',
    'billing_reminders',
    'billing_recurring_schedules',
    'billing_recurring_runs',
    'billing_portal_links',
    'billing_document_events',
    'billing_delivery_attempts',
    'booking_blackouts',
  ]) {
    assert.match(migration, new RegExp(`'${table}'`), `${table} must move with standalone tenants`);
  }
});

test('provisioning retries use durable ownership and never delete a running attempt', () => {
  const provisioning = source('./provisioning.ts');
  const operations = source('./tenant-operation.ts');
  assert.match(provisioning, /acquireTenantOperation/);
  assert.match(provisioning, /existing\.status !== 'provisioning'/);
  assert.doesNotMatch(provisioning, /Interrupted Vercel cleanup|Interrupted Neon cleanup/);
  assert.doesNotMatch(provisioning, /db\.delete\(tenants\)/);
  assert.match(provisioning, /waitForVercelDeploymentReady\(standaloneResult\.deploymentId/);
  assert.match(operations, /tenant_operations\.heartbeat_at <=/);
  assert.match(operations, /tenant_operations\.input_fingerprint = EXCLUDED\.input_fingerprint/);
  assert.match(operations, /AND owner_token = \$\{/);
});

test('tenant database routing cannot retain stale handles across rotations', () => {
  const routing = source('./tenant-data-db.ts');
  assert.doesNotMatch(routing, /new Map<string, Database>/);
  assert.doesNotMatch(routing, /tenantDbs\.get|tenantDbs\.set/);
  const modeCheck = routing.indexOf("tenant.deploymentMode !== 'standalone'");
  const registryRead = routing.indexOf('getTenantDatabaseRecord(tenantId)', modeCheck);
  assert.ok(modeCheck > 0 && registryRead > modeCheck, 'shared tenants must not be routed by a prepared target registry row');
  assert.match(routing, /tenant\.status !== 'active'/, 'cutover provisioning status must quiesce writes');
});

test('explicit shared purge is atomic and owner checked on neon-http', () => {
  const migration = source('./tenant-data-migration.ts');
  const purgeScript = source('../../scripts/purge-standalone-shared-copy.ts');
  assert.match(migration, /purgeSharedTenantDataWithOperation/);
  assert.match(migration, /GET DIAGNOSTICS operation_rows = ROW_COUNT/);
  assert.match(migration, /tenant operation ownership lost/);
  assert.match(purgeScript, /verifyTenantDataCopy\(controlDb, dedicated\.db, tenantId\)/);
  assert.match(purgeScript, /purgeSharedTenantDataWithOperation/);
});

test('partial target cleanup is immediately preceded by an owner-checked heartbeat', () => {
  for (const file of [
    '../app/crm/tenants/actions.ts',
    '../../scripts/rotate-standalone-database.ts',
    '../../scripts/isolate-existing-standalone.ts',
  ]) {
    const contents = source(file);
    const reset = contents.indexOf("phase: 'resetting_partial_target'");
    const purge = contents.indexOf('purgeSharedTenantData(targetDb', reset);
    assert.ok(reset > 0 && purge > reset, `${file} must renew ownership immediately before destructive target cleanup`);
  }
});

test('database rotation leaves the retired data plane quiesced after success', () => {
  const rotation = source('../../scripts/rotate-standalone-database.ts');
  const successStart = rotation.indexOf('await registerTenantDatabase({ tenantId: tenant.id, ...nextProject })');
  const failureStart = rotation.indexOf('} catch (error)', successStart);
  const successBlock = rotation.slice(successStart, failureStart);
  assert.doesNotMatch(successBlock, /current\.db\.update\(tenants\)\.set\(\{ status: 'active'/);
  assert.match(rotation.slice(failureStart), /current\.db\.update\(tenants\)\.set\(\{ status: 'active'/, 'rollback must reactivate the retained source');
});

test('registry recovery verifies either the retained source or a complete standalone target', () => {
  const route = source('../app/api/internal/provisioning/tenants/route.ts');
  const migration = source('./tenant-data-migration.ts');
  assert.match(route, /canCompareSource/);
  assert.match(route, /verifyStandaloneTargetReady\(targetDb, tenant\.id\)/);
  for (const core of ['admin_secret', 'global_settings', 'pages', 'active_snapshot']) {
    assert.match(migration, new RegExp(core));
  }
});

test('tenant migration preserves every billing document status and respects recurring-document foreign keys', () => {
  const migration = source('./tenant-data-migration.ts');
  const recurringSchedulesIndex = migration.indexOf("['billing_recurring_schedules', billingRecurringSchedules]");
  const billingDocumentsIndex = migration.indexOf("['billing_documents', billingDocuments]");

  assert.ok(recurringSchedulesIndex > 0, 'recurring schedules must be part of the tenant copy');
  assert.ok(
    billingDocumentsIndex > recurringSchedulesIndex,
    'recurring schedules must be inserted before documents that reference them',
  );

  assert.match(migration, /const finalizedBillingStatuses = new Map<string, string\[\]>/);
  assert.match(migration, /finalizedBillingStatuses\.get\(row\.status\)/);
  assert.match(migration, /finalizedBillingStatuses\.set\(row\.status, ids\)/);
  assert.match(
    migration,
    /for \(const \[status, ids\] of finalizedBillingStatuses\)[\s\S]*set\(\{ status \}\)/,
    'every non-draft source status must be restored instead of using a partial allow-list',
  );

  assert.match(migration, /groupBy\(billingDocuments\.status\)/);
  assert.match(
    migration,
    /new Set\(\[\.\.\.sourceBillingStatuses\.keys\(\), \.\.\.targetBillingStatuses\.keys\(\)\]\)/,
    'verification must compare every status present on either side',
  );
  for (const status of ['issued', 'partially_paid', 'accepted', 'rejected', 'expired', 'converted']) {
    assert.match(
      migration,
      new RegExp(`\\b${status}\\b`),
      `${status} must be explicitly documented as a migration-preserved state`,
    );
  }
});

test('tenant connection URIs are stored encrypted outside the tenant record', () => {
  const schema = source('../../../../packages/db/src/schema/index.ts');
  const registry = schema.slice(schema.indexOf('export const tenantDatabaseConnections'), schema.indexOf('export const adminSecrets'));
  const tenant = schema.slice(schema.indexOf('export const tenants'), schema.indexOf('export const tenantDomains'));
  assert.match(registry, /connectionUriEncrypted: text\('connection_uri_encrypted'\)/);
  assert.match(registry, /directConnectionUriEncrypted: text\('direct_connection_uri_encrypted'\)/);
  assert.doesNotMatch(tenant, /connectionUri|databaseUrl/i);
});

test('standalone maintenance entrypoints run without unsupported top-level await', () => {
  for (const file of [
    '../../scripts/migrate-standalone-databases.ts',
    '../../scripts/isolate-existing-standalone.ts',
    '../../scripts/purge-standalone-shared-copy.ts',
  ]) {
    const script = source(file);
    assert.match(script, /async function main\(\)/);
    assert.match(script, /main\(\)\.catch\(/);
  }
});

test('billing migration keeps one prepared command per breakpoint', () => {
  const migration = source('../../../../packages/db/drizzle/0021_billing_customer_management.sql');
  const chunks = migration.split(/--> statement-breakpoint\s*/).map(value => value.trim()).filter(Boolean);
  for (const chunk of chunks) {
    if (/^(?:DO \$\$|CREATE OR REPLACE FUNCTION)/.test(chunk)) continue;
    assert.equal((chunk.match(/;/g) || []).length, 1, `multiple commands in migration chunk: ${chunk.slice(0, 80)}`);
  }
});
