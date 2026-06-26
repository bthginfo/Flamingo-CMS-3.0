import { test } from 'node:test';
import assert from 'node:assert/strict';
import { plain } from './strip-html';

test('strips tags and returns text content', () => {
  assert.equal(plain('<p>Hello <strong>world</strong></p>'), 'Hello world');
});

test('decodes common entities', () => {
  assert.equal(plain('Tom &amp; Jerry &quot;quote&quot; &#39;apos&#39;'), `Tom & Jerry "quote" 'apos'`);
  assert.equal(plain('a&nbsp;b'), 'a b');
});

test('collapses whitespace and trims', () => {
  assert.equal(plain('  <p>a</p>\n\n  <p>b</p>  '), 'a b');
});

test('handles empty / null / undefined', () => {
  assert.equal(plain(''), '');
  assert.equal(plain(null), '');
  assert.equal(plain(undefined), '');
});

test('output is plain text (used in escaped JSX / meta tags), no leftover tags', () => {
  const out = plain('<a href="/x" onclick="evil()">link</a><img src=x>');
  assert.ok(!out.includes('<'));
  assert.equal(out, 'link');
});
