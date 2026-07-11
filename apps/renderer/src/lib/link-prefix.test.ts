import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prefixInternalHref, prefixInternalLinks } from './link-prefix';

const P = '/mein-tenant';

test('no prefix or non-string passes through unchanged', () => {
  assert.equal(prefixInternalHref('/x', ''), '/x');
  assert.equal(prefixInternalHref(undefined, P), undefined);
  assert.equal(prefixInternalHref(42, P), 42);
});

test('anchors, external and protocol-relative links are untouched', () => {
  assert.equal(prefixInternalHref('#', P), '#');
  assert.equal(prefixInternalHref('https://x.de', P), 'https://x.de');
  assert.equal(prefixInternalHref('//cdn.x.de/a', P), '//cdn.x.de/a');
  assert.equal(prefixInternalHref('mailto:a@b.de', P), 'mailto:a@b.de');
});

test('internal paths get the prefix; root maps to the prefix root', () => {
  assert.equal(prefixInternalHref('/leistungen', P), '/mein-tenant/leistungen');
  assert.equal(prefixInternalHref('/', P), '/mein-tenant');
});

test('already-prefixed paths are not double-prefixed', () => {
  assert.equal(prefixInternalHref('/mein-tenant', P), '/mein-tenant');
  assert.equal(prefixInternalHref('/mein-tenant/x', P), '/mein-tenant/x');
});

test('api/admin/demo system paths are excluded', () => {
  assert.equal(prefixInternalHref('/api/shop/x', P), '/api/shop/x');
  assert.equal(prefixInternalHref('/admin', P), '/admin');
  assert.equal(prefixInternalHref('/admin/pages', P), '/admin/pages');
  assert.equal(prefixInternalHref('/demo/handwerk', P), '/demo/handwerk');
});

test('tenant slugs that merely START with admin/demo are still prefixed', () => {
  // regression guard: startsWith('/demo') used to wrongly skip these.
  assert.equal(prefixInternalHref('/demo-projekt', P), '/mein-tenant/demo-projekt');
  assert.equal(prefixInternalHref('/administration', P), '/mein-tenant/administration');
});

test('prefixInternalLinks rewrites href/ctaHref keys recursively', () => {
  const input = {
    href: '/a',
    ctaHref: '/b',
    link: '/details',
    to: '/kontakt',
    nested: { buttonHref: '/c', label: 'x' },
    items: [{ href: '/d' }, { href: 'https://ext.de' }],
  };
  const out = prefixInternalLinks(input, P) as typeof input;
  assert.equal(out.href, '/mein-tenant/a');
  assert.equal(out.ctaHref, '/mein-tenant/b');
  assert.equal(out.link, '/mein-tenant/details');
  assert.equal(out.to, '/mein-tenant/kontakt');
  assert.equal(out.nested.buttonHref, '/mein-tenant/c');
  assert.equal(out.nested.label, 'x');
  assert.equal(out.items[0].href, '/mein-tenant/d');
  assert.equal(out.items[1].href, 'https://ext.de');
});
