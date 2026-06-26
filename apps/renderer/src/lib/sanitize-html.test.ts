import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeHtml } from './sanitize-html';

// Security: the sanitizer is the single defence for user/AI-authored HTML that
// is later injected via dangerouslySetInnerHTML. These tests lock down its
// behaviour so a future regression can't silently re-open an XSS hole.

test('strips <script> blocks', () => {
  const out = sanitizeHtml('<p>ok</p><script>alert(1)</script>');
  assert.ok(!/script/i.test(out));
  assert.ok(out.includes('ok'));
});

test('strips an unclosed/dangling <script>', () => {
  const out = sanitizeHtml('<script src="x">');
  assert.ok(!/script/i.test(out));
});

test('strips iframe/object/embed/form/style', () => {
  for (const tag of ['iframe', 'object', 'embed', 'form', 'style']) {
    const out = sanitizeHtml(`<${tag}>x</${tag}>`);
    assert.ok(!new RegExp(tag, 'i').test(out), `${tag} should be stripped`);
  }
});

test('strips on* event handlers from allowed tags', () => {
  assert.ok(!/onerror/i.test(sanitizeHtml('<img src="/a.png" onerror="alert(1)">')));
  assert.ok(!/onclick/i.test(sanitizeHtml('<a href="/x" onclick="alert(1)">l</a>')));
});

test('rejects javascript: and disallowed data: URLs in href', () => {
  assert.ok(!/javascript:/i.test(sanitizeHtml('<a href="javascript:alert(1)">x</a>')));
  assert.ok(!/data:text\/html/i.test(sanitizeHtml('<a href="data:text/html,<script>">x</a>')));
});

test('allows safe href schemes', () => {
  for (const href of ['https://example.com', 'mailto:a@b.de', 'tel:+49123', '/relative', '#anchor']) {
    assert.ok(sanitizeHtml(`<a href="${href}">x</a>`).includes(href), `${href} should survive`);
  }
});

test('allows a safe base64 image but not other data URLs', () => {
  const img = 'data:image/png;base64,iVBORw0KGgo=';
  assert.ok(sanitizeHtml(`<img src="${img}">`).includes(img));
  assert.ok(!sanitizeHtml('<img src="data:application/javascript,x">').includes('data:application'));
});

test('keeps basic formatting tags', () => {
  const out = sanitizeHtml('<p><strong>a</strong> <em>b</em> <a href="/c">c</a></p>');
  for (const t of ['<p>', '<strong>', '<em>', '<a ']) assert.ok(out.includes(t));
});

test('keeps structural tags added for legal/rich content (tables, h1)', () => {
  const out = sanitizeHtml('<h1>T</h1><table><thead><tr><th colspan="2">H</th></tr></thead><tbody><tr><td>x</td></tr></tbody></table>');
  for (const t of ['<h1>', '<table>', '<thead>', '<tbody>', '<tr>', '<th', '<td>']) assert.ok(out.includes(t), `${t} should survive`);
  assert.ok(/colspan="2"/.test(out), 'th colspan should be kept');
});

test('strips disallowed attributes (style/class) but keeps the tag', () => {
  const out = sanitizeHtml('<p style="x" class="y">hi</p>');
  assert.ok(out.includes('hi'));
  assert.ok(!/style=/.test(out) && !/class=/.test(out));
});

test('forces rel=noopener and only allows target=_blank', () => {
  const out = sanitizeHtml('<a href="https://x.de" target="_blank">x</a>');
  assert.ok(/rel="noopener noreferrer"/.test(out));
  assert.ok(!/target="_self"/.test(sanitizeHtml('<a href="/x" target="_self">x</a>')));
});

test('strips HTML comments and handles empty input', () => {
  assert.equal(sanitizeHtml(''), '');
  assert.ok(!sanitizeHtml('<!-- secret --><p>x</p>').includes('secret'));
});
