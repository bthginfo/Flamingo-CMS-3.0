import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('tenant suspension and both password-reset paths rotate the tenant session version', () => {
  const crmActions = source('../app/crm/tenants/actions.ts');
  const rendererPasswordAction = source('../../../renderer/src/app/admin/security-actions.ts');

  const suspension = crmActions.slice(
    crmActions.indexOf("data.status === 'suspended'"),
    crmActions.indexOf('export async function resetTenantAdminPasswordAction'),
  );
  assert.match(suspension, /sessionVersion: sql`\$\{tenants\.sessionVersion\} \+ 1`/);
  assert.ok(suspension.indexOf('dataDb.update(tenants)') < suspension.indexOf('controlDb.update(tenants)'));

  const reset = crmActions.slice(crmActions.indexOf('export async function resetTenantAdminPasswordAction'));
  assert.match(reset, /WITH upserted_secret AS/);
  assert.match(reset, /SET session_version = session_version \+ 1/);
  assert.doesNotMatch(reset, /dataDb\.transaction/);

  assert.match(rendererPasswordAction, /WITH updated_secret AS/);
  assert.match(rendererPasswordAction, /SET session_version = session_version \+ 1/);
  assert.doesNotMatch(rendererPasswordAction, /db\.transaction/);
  assert.match(rendererPasswordAction, /createSessionToken\([\s\S]*nextSessionVersion\)/);
});

test('every provisioning entrypoint rejects passwords beyond bcrypt UTF-8 capacity before hashing', () => {
  const provisioning = source('./provisioning.ts');
  const internalRoute = source('../app/api/internal/provisioning/tenants/route.ts');
  const crmActions = source('../app/crm/tenants/actions.ts');

  for (const moduleSource of [provisioning, internalRoute, crmActions]) {
    assert.match(moduleSource, /isPasswordWithinBcryptLimit/);
    assert.match(moduleSource, /BCRYPT_MAX_PASSWORD_BYTES/);
  }
  const provisionFunction = provisioning.slice(provisioning.indexOf('export async function provisionTenant'));
  assert.ok(provisionFunction.indexOf('isPasswordWithinBcryptLimit') < provisionFunction.indexOf('const db = getDb()'));
});

test('database schema ships the monotonic tenant session version migration', () => {
  const schema = source('../../../../packages/db/src/schema/index.ts');
  const migration = source('../../../../packages/db/drizzle/0029_admin_session_revocation.sql');
  assert.match(schema, /sessionVersion: integer\('session_version'\)\.notNull\(\)\.default\(0\)/);
  assert.match(migration, /ADD COLUMN "session_version" integer DEFAULT 0 NOT NULL/);
});
