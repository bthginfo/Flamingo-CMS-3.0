import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  ADMIN_SUPPORT_STALE_AFTER_MS,
  classifyAdminSupportDelivery,
  runAdminSupportPreflight,
  type AdminSupportDeliveryIdentity,
  type AdminSupportDeliveryRecord,
} from './admin-support-security';
import { rendererContactRequestHeaders } from './renderer-contact-client-security';

const routeSource = readFileSync(
  new URL('../app/admin/api/support-request/route.ts', import.meta.url),
  'utf8',
);
const clientSource = readFileSync(
  new URL('../app/admin/functions/functions-client.tsx', import.meta.url),
  'utf8',
);

test('admin support authenticates and checks origin before parsing the request body', () => {
  const auth = routeSource.indexOf('getWritableSession()');
  const origin = routeSource.indexOf('isTrustedRendererContactOrigin(request)');
  const body = routeSource.indexOf('readBoundedRendererContactJson(request');
  assert.ok(auth >= 0 && origin > auth && body > origin);
});

test('admin support persists an idempotency claim and uses a fixed Flamingo recipient', () => {
  assert.match(routeSource, /insert\(crmEmailDeliveries\)/);
  assert.match(routeSource, /insert\(inquiries\)/);
  assert.match(routeSource, /address:\s*'hello@flamingomedia\.online'/);
});

test('admin support classifies every persisted retry state without reopening the action', () => {
  const now = Date.parse('2026-07-12T18:00:00.000Z');
  const expected: AdminSupportDeliveryIdentity = {
    purpose: 'admin_support',
    entityId: '0f3ad89b-54df-4b66-8f2a-2d785f9e02ea',
    requestHash: 'a'.repeat(64),
  };
  const record = (status: string, updatedAt = new Date(now)): AdminSupportDeliveryRecord => ({
    ...expected,
    status,
    updatedAt,
  });

  assert.equal(classifyAdminSupportDelivery(record('sent'), expected, now), 'sent');
  assert.equal(classifyAdminSupportDelivery(record('completed'), expected, now), 'sent');
  assert.equal(classifyAdminSupportDelivery(record('failed'), expected, now), 'failed');
  assert.equal(classifyAdminSupportDelivery(record('uncertain'), expected, now), 'uncertain');
  assert.equal(classifyAdminSupportDelivery(record('sending'), expected, now), 'in_progress');
  assert.equal(classifyAdminSupportDelivery(
    record('sending', new Date(now - ADMIN_SUPPORT_STALE_AFTER_MS)),
    expected,
    now,
  ), 'stale');
  assert.equal(classifyAdminSupportDelivery({
    ...record('sent'),
    requestHash: 'b'.repeat(64),
  }, expected, now), 'conflict');
  assert.equal(classifyAdminSupportDelivery(record('unexpected-state'), expected, now), 'uncertain');
});

test('identical support retries do not consume IP, tenant or global buckets', async () => {
  const existing: AdminSupportDeliveryRecord = {
    purpose: 'admin_support',
    entityId: '0f3ad89b-54df-4b66-8f2a-2d785f9e02ea',
    requestHash: 'a'.repeat(64),
    status: 'sent',
    updatedAt: new Date(),
  };
  const consumedBuckets: string[] = [];
  const retry = await runAdminSupportPreflight({
    inspectExisting: async () => existing,
    consumeRateLimits: async () => {
      consumedBuckets.push('admin_support_ip', 'admin_support_tenant', 'admin_support_global');
      return null;
    },
  });

  assert.equal(retry.existing, existing);
  assert.equal(retry.rateDecision, null);
  assert.deepEqual(consumedBuckets, []);
});

test('a genuinely new support action reaches the narrow-to-broad limiter once', async () => {
  const consumedBuckets: string[] = [];
  const created = await runAdminSupportPreflight({
    inspectExisting: async () => null,
    consumeRateLimits: async () => {
      consumedBuckets.push('admin_support_ip', 'admin_support_tenant', 'admin_support_global');
      return null;
    },
  });

  assert.equal(created.existing, null);
  assert.equal(created.rateDecision, null);
  assert.deepEqual(consumedBuckets, [
    'admin_support_ip',
    'admin_support_tenant',
    'admin_support_global',
  ]);
});

test('admin support route wires idempotency preflight ahead of rate-limit consumption', () => {
  const preflight = routeSource.indexOf('await runAdminSupportPreflight');
  const limiter = routeSource.indexOf('consumeRateLimits: () => consumeRendererContactRateRules');
  assert.ok(preflight >= 0 && limiter > preflight);
});

test('admin support client uses the same-origin endpoint and a stable idempotency header', () => {
  assert.match(clientSource, /fetch\('\/admin\/api\/support-request'/);
  assert.doesNotMatch(clientSource, /https:\/\/www\.flamingomedia\.online\/api\/contact/);
  const key = '123e4567-e89b-42d3-a456-426614174000';
  assert.deepEqual(rendererContactRequestHeaders(key), {
    'Content-Type': 'application/json',
    'Idempotency-Key': key,
  });
});
