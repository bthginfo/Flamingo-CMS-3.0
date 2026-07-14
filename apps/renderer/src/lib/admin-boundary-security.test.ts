import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('sensitive admin routes reject demo sessions and stay tenant scoped', () => {
  const reservations = source('../app/admin/functions/reservations/actions.ts');
  const inbox = source('../app/admin/inbox/actions.ts');
  const rsvp = source('../app/admin/rsvp/actions.ts');
  const shop = source('../app/admin/shop/actions.ts');

  assert.match(reservations, /session\.role === 'demo'/);
  assert.match(reservations, /eq\(reservations\.tenantId, tenantId\)/);
  assert.match(inbox, /session\.role === 'demo'/);
  assert.match(rsvp, /session\.role === 'demo'/);
  assert.match(shop, /getWritableSession\(\)/);
  assert.match(shop, /eq\(orders\.tenantId, tenantId\)/);
});

test('invoice documents and Instagram mutations require a writable admin session', () => {
  const invoice = source('../app/api/shop/invoice/[orderId]/route.ts');
  const creditNote = source('../app/api/shop/credit-note/[orderId]/route.ts');
  const instagramRoutes = [
    '../app/api/auth/instagram/login/route.ts',
    '../app/api/auth/instagram/sync/route.ts',
    '../app/api/auth/instagram/disconnect/route.ts',
    '../app/api/auth/instagram/status/route.ts',
  ].map(source);

  for (const documentRoute of [invoice, creditNote]) {
    assert.match(documentRoute, /getWritableSession\(\)/);
    assert.doesNotMatch(documentRoute, /resolveTenant\(\)/);
    assert.match(documentRoute, /private, no-store/);
  }
  for (const route of instagramRoutes) assert.match(route, /getWritableSession\(\)/);
});

test('public demo flows never persist customer data', () => {
  const routes = [
    '../app/api/contact/route.ts',
    '../app/api/reservation/route.ts',
    '../app/api/rsvp/route.ts',
    '../app/api/booking/request/route.ts',
    '../app/api/shop/checkout/route.ts',
  ].map(source);

  for (const route of routes) assert.match(route, /isDemoTenant\(tenantId\)/);
});
