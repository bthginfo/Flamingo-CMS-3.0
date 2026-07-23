import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

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

test('shared-to-standalone cutover verifies deployment and every copied table before purging shared data', () => {
  const vercel = source('./vercel.ts');
  const actions = source('../app/crm/tenants/actions.ts');
  const migration = source('./tenant-data-migration.ts');
  assert.match(vercel, /waitForVercelDeploymentReady\(deploymentId\)/);
  const verifyIndex = actions.indexOf('await verifyTenantDataCopy(db, targetDb, tenantId)');
  const purgeIndex = actions.indexOf('await purgeSharedTenantData(db, tenantId)');
  assert.ok(verifyIndex > 0 && purgeIndex > verifyIndex, 'copy must be verified before shared purge');
  assert.match(actions, /\['shared', 'lead_shared'\]\.includes\(tenant\.deploymentMode\)/);
  assert.match(migration, /source\.transaction\(async transaction/);
  assert.match(migration, /name === 'billing_documents'[\s\S]*status: 'draft'/, 'immutable billing documents must be staged before their items are copied');
  assert.match(migration, /order_status_history/, 'order status history must be copied and verified');
  for (const table of ['billing_settings', 'billing_services', 'billing_documents', 'billing_document_items', 'billing_document_events', 'billing_delivery_attempts']) {
    assert.match(migration, new RegExp(`'${table}'`), `${table} must move with standalone tenants`);
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
