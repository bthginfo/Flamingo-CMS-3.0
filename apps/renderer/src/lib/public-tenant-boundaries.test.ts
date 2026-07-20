import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('public widget tenant selection is bound to standalone or demo/lead tenants', () => {
  const policy = source('./public-tenant.ts');
  assert.match(policy, /explicitTenantId === fixedTenantId/);
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
  ]) {
    const routeSource = source(route);
    assert.match(routeSource, /resolvePublicTenantId/);
    assert.doesNotMatch(routeSource, /function resolveExplicitTenant/);
  }
});

test('booking availability batches its state and never queries once per candidate slot', () => {
  const route = source('../app/api/booking/availability/route.ts');
  const computeSlots = route.slice(route.indexOf('function computeSlots'), route.indexOf('function computeSuggestions'));
  assert.match(route, /loadAvailabilityState/);
  assert.match(route, /Promise\.all/);
  assert.doesNotMatch(computeSlots, /await /);
  assert.match(route, /s-maxage=15/);
});
