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

test('standalone provisioning creates, migrates and registers a dedicated Neon database', () => {
  const provisioning = source('./provisioning.ts');
  assert.match(provisioning, /createNeonTenantProject\(input\.slug\)/);
  assert.match(provisioning, /registerTenantDatabase\(\{ tenantId, \.\.\.neonProject \}\)/);
  assert.match(provisioning, /migrateDatabase\(neonProject\.directConnectionUri\)/);
  assert.match(provisioning, /createStandaloneProject\(input\.slug, tenantId, neonProject\.pooledConnectionUri\)/);
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
