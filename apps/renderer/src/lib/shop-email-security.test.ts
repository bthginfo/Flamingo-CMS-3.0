import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  escapeShopEmailHtml,
  getSafeShopEmailUrl,
  sanitizeShopEmailHeaderValue,
} from './shop-email-security';

const shopEmailSource = readFileSync(new URL('./shop-email.ts', import.meta.url), 'utf8');
const adminShopSource = readFileSync(
  new URL('../app/admin/shop/actions.ts', import.meta.url),
  'utf8',
);

test('shop email HTML escaping neutralizes markup and attribute delimiters', () => {
  assert.equal(
    escapeShopEmailHtml(`<img src=x onerror="alert('x')">`),
    '&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;',
  );
});

test('shop email header values cannot inject additional headers', () => {
  assert.equal(
    sanitizeShopEmailHeaderValue('ORDER-1\r\nBcc: attacker@example.com'),
    'ORDER-1 Bcc: attacker@example.com',
  );
});

test('shop email URLs only allow absolute credential-free HTTP(S) links', () => {
  assert.equal(getSafeShopEmailUrl('javascript:alert(1)'), null);
  assert.equal(getSafeShopEmailUrl('data:text/html,boom'), null);
  assert.equal(getSafeShopEmailUrl('//example.com/tracking'), null);
  assert.equal(getSafeShopEmailUrl('https://user:pass@example.com/tracking'), null);
  assert.equal(
    getSafeShopEmailUrl('https://carrier.example/track?id=ABC&lang=de'),
    'https://carrier.example/track?id=ABC&lang=de',
  );
});

test('all order mail paths use the shared output encoders and recipient validation', () => {
  assert.match(shopEmailSource, /escapeShopEmailHtml/);
  assert.match(shopEmailSource, /sanitizeShopEmailHeaderValue/);
  assert.match(shopEmailSource, /isValidSmtpAddress/);
  assert.doesNotMatch(shopEmailSource, /\$\{i\.title\}/);
  assert.doesNotMatch(shopEmailSource, /\$\{order\.customerName\}/);

  assert.match(adminShopSource, /escapeShopEmailHtml/);
  assert.match(adminShopSource, /getSafeShopEmailUrl/);
  assert.match(adminShopSource, /sanitizeShopEmailHeaderValue/);
  assert.match(adminShopSource, /isValidSmtpAddress/);
  assert.doesNotMatch(adminShopSource, /href="\$\{order\.trackingUrl\}"/);
  assert.doesNotMatch(adminShopSource, /subject:\s*`[^`]*\$\{order\./);
});
