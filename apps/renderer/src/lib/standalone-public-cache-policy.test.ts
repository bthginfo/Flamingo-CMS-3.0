import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { standalonePublicStatusTtl } from './standalone-public-cache-policy';

test('standalone public TTL accepts the bounded cost-saving window and preserves existing deployments', () => {
  assert.equal(standalonePublicStatusTtl(undefined), 60);
  assert.equal(standalonePublicStatusTtl('3600'), 3600);
  assert.equal(standalonePublicStatusTtl('300'), 300);
  for (const value of ['', '0', '-1', '59', '3601', '60.5', 'Infinity', '1e3', 'NaN', '9999999999999999999']) {
    assert.equal(standalonePublicStatusTtl(value), 60, value);
  }
});

test('long public cache retains tenant invalidation and never replaces current session/PAT authorization', () => {
  const active = readFileSync(new URL('./active-tenant.ts', import.meta.url), 'utf8');
  const session = readFileSync(new URL('./session.ts', import.meta.url), 'utf8');
  const pat = readFileSync(new URL('./pat-auth.ts', import.meta.url), 'utf8');
  assert.match(active, /tags: \[`tenant-\$\{fixedTenantId\}`\]/);
  assert.match(session, /getDb\(\)[\s\S]*status: tenants\.status/);
  assert.match(pat, /eq\(tenants\.status, 'active'\)/);
  assert.doesNotMatch(session + pat, /standalonePublicStatusTtl|resolveActiveFixedTenantId/);
});
