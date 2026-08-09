import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BCRYPT_MAX_PASSWORD_BYTES,
  createSessionToken,
  getPasswordByteLength,
  hashPassword,
  verifyPassword,
  verifySessionToken,
  type SessionClaims,
} from '@flamingo/auth';
import { isSessionStateValid } from './session-policy';
import { rendererDemoLoginRateRules } from './renderer-contact-security';
import { readFileSync } from 'node:fs';

test('bcrypt password boundary is enforced in UTF-8 bytes before hashing or verification', async () => {
  const exactLimit = '\u00e9'.repeat(36);
  const overLimit = `${exactLimit}a`;
  assert.equal(getPasswordByteLength(exactLimit), BCRYPT_MAX_PASSWORD_BYTES);
  assert.equal(getPasswordByteLength(overLimit), BCRYPT_MAX_PASSWORD_BYTES + 1);

  const hash = await hashPassword(exactLimit);
  assert.equal(await verifyPassword(exactLimit, hash), true);
  assert.equal(await verifyPassword(overLimit, hash), false);
  await assert.rejects(() => hashPassword(overLimit), RangeError);
});

test('admin tokens carry a non-negative tenant session version', async () => {
  const previousSecret = process.env.ADMIN_JWT_SECRET;
  process.env.ADMIN_JWT_SECRET = 'session-security-test-secret-at-least-32-bytes';
  try {
    const token = await createSessionToken('tenant-1', '1h', 'admin', 7);
    assert.deepEqual(await verifySessionToken(token), {
      tenantId: 'tenant-1',
      role: 'admin',
      sessionVersion: 7,
    });
    await assert.rejects(() => createSessionToken('tenant-1', '1h', 'admin', -1), RangeError);
  } finally {
    if (previousSecret === undefined) delete process.env.ADMIN_JWT_SECRET;
    else process.env.ADMIN_JWT_SECRET = previousSecret;
  }
});

test('session policy rejects suspension, revocation and removed demo capability', () => {
  const admin: SessionClaims = { tenantId: 'tenant-1', role: 'admin', sessionVersion: 4 };
  const demo: SessionClaims = { tenantId: 'tenant-1', role: 'demo', sessionVersion: 4 };
  const active = { status: 'active' as const, isDemo: true, sessionVersion: 4 };

  assert.equal(isSessionStateValid(admin, active), true);
  assert.equal(isSessionStateValid(admin, { ...active, status: 'suspended' }), false);
  assert.equal(isSessionStateValid(admin, { ...active, sessionVersion: 5 }), false);
  assert.equal(isSessionStateValid(demo, { ...active, isDemo: false }), false);
});

test('demo login uses persistent IP and global limits and fails closed', () => {
  assert.deepEqual(rendererDemoLoginRateRules('203.0.113.10').map(rule => rule.scope), [
    'renderer_demo_login_ip',
    'renderer_demo_login_global',
  ]);
  const route = readFileSync(new URL('../app/admin/demo-login/route.ts', import.meta.url), 'utf8');
  assert.match(route, /consumeRendererContactRateRules/);
  assert.match(route, /getRendererContactClientAddress/);
  assert.match(route, /rendererDemoLoginRateRules/);
  assert.match(route, /rate-limit store unavailable/);
  assert.match(route, /status: 503/);
  assert.doesNotMatch(route, /from ['"]@\/lib\/rate-limit['"]/);
});
