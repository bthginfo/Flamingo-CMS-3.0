import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('every CRM data action enforces the CRM admin session boundary', () => {
  const actionFiles = [
    '../app/crm/anfragen/actions.ts',
    '../app/crm/blog/actions.ts',
    '../app/crm/kunden/actions.ts',
    '../app/crm/leads/actions.ts',
    '../app/crm/tenants/actions.ts',
    '../app/crm/tenants/[id]/pat-actions.ts',
  ];

  for (const path of actionFiles) {
    const file = source(path);
    const exports = [...file.matchAll(/^export async function\s+/gm)].length;
    const guards = [...file.matchAll(/await requireCrmAdmin\(\);/g)].length;
    assert.ok(exports > 0, `${path} must contain server actions`);
    assert.equal(guards, exports, `${path} must guard every exported server action`);
  }
});

test('CRM pages with direct database reads require an authenticated admin', () => {
  for (const path of [
    '../app/crm/page.tsx',
    '../app/crm/tenants/page.tsx',
    '../app/crm/tenants/[id]/page.tsx',
  ]) {
    assert.match(source(path), /await requireCrmAdmin\(\);/);
  }
});

test('CRM blob upload authenticates and validates origin before parsing request bodies', () => {
  const route = source('../app/crm/api/upload/route.ts');
  const session = route.indexOf('verifyCrmSession()');
  const origin = route.indexOf('isTrustedRequestOrigin(request)');
  const parse = route.indexOf('readJsonRequestBody(request');
  const handle = route.indexOf('handleUpload({');

  assert.ok(session >= 0 && origin > session && parse > origin && handle > parse);
  assert.doesNotMatch(route.slice(0, handle), /request\.json\(\)/);
  assert.match(route, /MAX_OPTIMIZED_UPLOAD_BYTES = 5 \* 1024 \* 1024/);
});
