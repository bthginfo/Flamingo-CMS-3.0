import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), 'utf8');

const protectedMutationModules = [
  '../app/admin/pages/actions.ts',
  '../app/admin/collections/actions.ts',
  '../app/admin/settings-actions.ts',
  '../app/admin/media-actions.ts',
  '../app/admin/seo/actions.ts',
  '../app/admin/security-actions.ts',
  '../app/admin/inbox/actions.ts',
  '../app/admin/functions/reservations/actions.ts',
  '../app/admin/functions/i18n/actions.ts',
  '../app/admin/shop/import/actions.ts',
  '../app/admin/api/contact-form/route.ts',
] as const;

test('admin mutation modules enforce a writable admin session', () => {
  for (const modulePath of protectedMutationModules) {
    const source = read(modulePath);
    assert.match(source, /getWritableSession\(\)/, `${modulePath} must enforce the writable-session boundary`);
  }
});

test('shop routes and actions enforce the active paid entitlement', () => {
  const actions = read('../app/admin/shop/actions.ts');
  const layout = read('../app/admin/shop/layout.tsx');

  assert.match(actions, /eq\(tenantAddons\.addonKey, 'shop'\)/);
  assert.match(actions, /if \(!addon\?\.active\) redirect\('\/admin\/shop'\)/);
  assert.match(layout, /isShopActive\(\)/);
  assert.match(layout, /<ShopPaywall \/>/);
});

test('collection section writes are validated and paid sections are gated', () => {
  const source = read('../app/admin/collections/actions.ts');

  assert.match(source, /normalizeCollectionItemData/);
  assert.match(source, /BOOKING_SECTION_TYPES\.has\(type\)/);
  assert.match(source, /type\.startsWith\('shop'\)/);
  assert.match(source, /validateSectionData\(section\.data \?\? \{\}\)/);
});

test('shop system pages cannot be created without the paid entitlement', () => {
  const source = read('../app/admin/pages/actions.ts');
  const actionStart = source.indexOf('export async function addShopPageAction');
  const actionSource = source.slice(actionStart);

  assert.ok(actionStart >= 0);
  assert.match(actionSource, /eq\(tenantAddons\.addonKey, 'shop'\)/);
  assert.match(actionSource, /if \(!shopAddon\?\.active\)/);
});
