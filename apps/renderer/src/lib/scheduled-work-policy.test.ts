import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { shouldRunScheduledWork } from './scheduled-work-policy';

test('idle schedules skip work but become due at the cached timestamp without a cache refresh', () => {
  const dueAt = Date.parse('2026-10-01T12:00:00Z');
  assert.equal(shouldRunScheduledWork(null, new Date(dueAt)), false);
  assert.equal(shouldRunScheduledWork(dueAt, new Date(dueAt - 1)), false);
  assert.equal(shouldRunScheduledWork(dueAt, new Date(dueAt)), true);
  assert.equal(shouldRunScheduledWork(dueAt, new Date(dueAt + 3600000)), true);
  // An invalid index must trigger a live check instead of silently losing work.
  assert.equal(shouldRunScheduledWork(NaN, new Date(dueAt)), true);
});

const source = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('cron work indexes are tenant scoped and every schedule mutation evicts the index', () => {
  const index = source('./scheduled-db-work.ts');
  assert.match(index, /eq\(billingRecurringSchedules.tenantId, fixedTenantId\)/);
  assert.match(index, /eq\(instagramConnections.tenantId, fixedTenantId\)/);
  assert.doesNotMatch(index, /accessTokenEncrypted|\.select\(\)/);
  const actions = source('../app/admin/billing/actions.ts');
  for (const name of ['saveBillingRecurringScheduleAction', 'setBillingRecurringScheduleStatusAction', 'runBillingRecurringScheduleForTenant']) {
    const start = actions.indexOf(`function ${name}`);
    const end = actions.indexOf('\nexport async function ', start + 10);
    assert.match(actions.slice(start, end), /invalidateBillingWork\(\)/);
  }
  const run = actions.slice(actions.indexOf('function runDueBillingRecurringSchedules'));
  assert.ok(run.indexOf('Unauthorized') < run.indexOf('getNextBillingRunAt()'));
  assert.ok(run.indexOf('shouldRunScheduledWork') < run.indexOf('getDb().select'));
});

test('Instagram connection additions and both removal paths invalidate the work index', () => {
  assert.match(source('../app/api/auth/instagram/callback/route.ts'), /invalidateInstagramWork\(\)/);
  const sync = source('./instagram/sync.ts');
  for (const name of ['disconnectTenant', 'deleteByIgUserId']) {
    const start = sync.indexOf(`function ${name}`);
    assert.match(sync.slice(start, sync.indexOf('\n}', start)), /invalidateInstagramWork\(\)/);
  }
});

test('public routing cache keeps host and slug separate and never caches database failures as 404s', () => {
  const snapshot = source('./snapshot.ts');
  assert.match(snapshot, /\['public-tenant-route-v1', host, candidateSlug \|\| ''\]/);
  assert.match(snapshot, /if \(result.status === 'error'\) throw result/);
  assert.match(snapshot, /revalidate: 60, tags: \['public-tenant-routing'\]/);
  assert.match(source('./tenant-cache-invalidation.ts'), /revalidateTag\('public-tenant-routing'\)/);
});
