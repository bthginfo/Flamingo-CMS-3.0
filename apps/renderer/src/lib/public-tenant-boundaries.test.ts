import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('public widget tenant selection is bound to standalone or demo/lead tenants', () => {
  const policy = source('./public-tenant.ts');
  assert.match(policy, /explicitTenantId !== fixedTenantId/);
  assert.match(policy, /resolveActiveFixedTenantId/);
  assert.match(policy, /tenant\.deploymentMode === 'shared'/);
  assert.match(policy, /tenant\.deploymentMode === 'lead_shared'/);
  assert.match(policy, /tenant\.isDemo \|\| tenant\.isLead/);

  for (const route of [
    '../app/api/booking/config/route.ts',
    '../app/api/booking/availability/route.ts',
    '../app/api/booking/request/route.ts',
    '../app/api/shop/coupon/route.ts',
    '../app/api/shop/checkout/route.ts',
    '../app/api/shop/products/route.ts',
    '../app/api/shop/products/[slug]/route.ts',
    '../app/api/shop/shipping/route.ts',
    '../app/shop/[slug]/page.tsx',
  ]) {
    const routeSource = source(route);
    assert.match(routeSource, /resolvePublicTenantId/);
    assert.doesNotMatch(routeSource, /function resolveExplicitTenant/);
  }
});

test('shared slug routing is restricted to active demo or lead shared tenants', () => {
  const snapshotSource = source('./snapshot.ts');
  const productPageSource = source('../app/shop/[slug]/page.tsx');

  assert.match(snapshotSource, /inArray\(tenants\.deploymentMode, \['shared', 'lead_shared'\]\)/);
  assert.match(snapshotSource, /or\(eq\(tenants\.isDemo, true\), eq\(tenants\.isLead, true\)\)/);
  assert.match(productPageSource, /innerJoin\(tenants, eq\(tenants\.id, products\.tenantId\)\)/);
  assert.match(productPageSource, /eq\(tenants\.status, 'active'\)/);
  assert.match(productPageSource, /or\(eq\(tenants\.isDemo, true\), eq\(tenants\.isLead, true\)\)/);
});

test('domain and standalone routing reject suspended tenants', () => {
  const snapshotSource = source('./snapshot.ts');
  const activeTenantSource = source('./active-tenant.ts');

  assert.match(snapshotSource, /innerJoin\(tenants, eq\(tenants\.id, tenantDomains\.tenantId\)\)/);
  assert.match(snapshotSource, /eq\(tenants\.status, 'active'\)/);
  assert.match(snapshotSource, /resolveActiveFixedTenantId/);
  assert.match(activeTenantSource, /eq\(tenants\.status, 'active'\)/);
  assert.match(activeTenantSource, /revalidate: ACTIVE_TENANT_REVALIDATE_SECONDS/);
});

test('booking availability batches its state and never queries once per candidate slot', () => {
  const route = source('../app/api/booking/availability/route.ts');
  const computeSlots = route.slice(route.indexOf('function computeSlots'), route.indexOf('function computeSuggestions'));
  assert.match(route, /loadAvailabilityState/);
  assert.match(route, /Promise\.all/);
  assert.doesNotMatch(computeSlots, /await /);
  assert.match(route, /s-maxage=15/);
});
