import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('common exploit scans are rejected before public rendering', () => {
  const middleware = source('../middleware.ts');
  const rejectIndex = middleware.indexOf('EXPLOIT_SCAN_PATH.test(pathname)');
  const publicPassIndex = middleware.indexOf("!pathname.startsWith('/admin')");

  assert.ok(rejectIndex > 0 && publicPassIndex > rejectIndex);
  for (const signature of ['wp-admin', 'wp-login', 'xmlrpc', '.env', '.git', 'phpunit']) {
    assert.ok(middleware.includes(signature), `missing exploit-scan signature: ${signature}`);
  }
  assert.match(middleware, /status: 404/);
});

test('catch-all skips collection and tenant lookups for ordinary routes', () => {
  const page = source('../app/[[...slug]]/page.tsx');
  const routeStart = page.indexOf('async function tryResolveCollectionItemRoute');
  const routeEnd = page.indexOf('async function resolvePageData');
  const route = page.slice(routeStart, routeEnd);

  assert.ok(route.indexOf('couldBeCollectionRoute') < route.indexOf('resolveTenant('));
  assert.match(route, /if \(!couldBeCollectionRoute\) return null/);
  assert.match(route, /if \(!fixedTenantId\)/);
});
