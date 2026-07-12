import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const bookingEmailSource = readFileSync(
  new URL('./booking-email.ts', import.meta.url),
  'utf8',
);
const shopEmailSource = readFileSync(
  new URL('./shop-email.ts', import.meta.url),
  'utf8',
);
const adminShopActionsSource = readFileSync(
  new URL('../app/admin/shop/actions.ts', import.meta.url),
  'utf8',
);
const adminSupportRouteSource = readFileSync(
  new URL('../app/admin/api/support-request/route.ts', import.meta.url),
  'utf8',
);

for (const [name, source] of [
  ['booking email', bookingEmailSource],
  ['shop email', shopEmailSource],
]) {
  test(`${name} uses the shared hardened SMTP transport`, () => {
    assert.match(source, /createHardenedRendererSmtpTransport\(smtp\)/);
    assert.doesNotMatch(source, /nodemailer/);
    assert.doesNotMatch(source, /\.createTransport\s*\(/);
  });
}

test('admin shop mail paths use validated, pinned and hardened SMTP helpers', () => {
  assert.equal(
    adminShopActionsSource.match(/createHardenedRendererSmtpTransport\(/g)?.length,
    3,
  );
  assert.equal(adminShopActionsSource.match(/getEffectiveSmtp\(tenantId\)/g)?.length, 2);
  assert.equal(adminShopActionsSource.match(/getPlatformSmtp\(\)/g)?.length, 1);
  assert.doesNotMatch(adminShopActionsSource, /nodemailer/);
  assert.doesNotMatch(adminShopActionsSource, /\.createTransport\s*\(/);
  assert.doesNotMatch(adminShopActionsSource, /process\.env\.(?:PLATFORM_)?SMTP_/);
});

test('admin support notification uses pinned platform SMTP and the hardened transport', () => {
  assert.match(adminSupportRouteSource, /await getPlatformSmtp\(\)/);
  assert.match(adminSupportRouteSource, /createHardenedRendererSmtpTransport\(smtp\)/);
  assert.doesNotMatch(adminSupportRouteSource, /normalizeSmtpConfig/);
  assert.doesNotMatch(adminSupportRouteSource, /nodemailer/);
  assert.doesNotMatch(adminSupportRouteSource, /\.createTransport\s*\(/);
  assert.doesNotMatch(adminSupportRouteSource, /process\.env\.PLATFORM_SMTP_/);
});
