import assert from 'node:assert/strict';
import test from 'node:test';
import { getBrandForegroundOverrides } from './brand-foreground-overrides';

test('brand foregrounds defer to local roles while preserving image and card contexts', () => {
  const rules = getBrandForegroundOverrides({ headingColor: '#f4f1e9', bodyTextColor: '#d3d4c9', mutedTextColor: '#adb3a5', linkColor: '#c7cf9e' });
  assert.match(rules[0], /color: var\(--token-heading, #f4f1e9\) !important/);
  assert.match(rules[1], /color: var\(--token-body, #d3d4c9\) !important/);
  assert.match(rules[2], /color: var\(--token-muted, #adb3a5\) !important/);
  assert.match(rules[3], /color: var\(--token-link, #c7cf9e\) !important/);
  assert.match(rules[3], /:not\(\.cms-button\)/);
  assert.ok(rules.find(rule => rule.includes('data-color-context="dark"') && rule.includes('--token-on-dark-heading')));
  assert.ok(rules.find(rule => rule.includes('[data-card]') && rule.includes('--token-card-body')));
  assert.ok(rules.find(rule => rule.includes('data-color-context="light"') && rule.includes('--token-card-heading')));
});

test('invalid brand colors cannot enter a style rule', () => {
  const rules = getBrandForegroundOverrides({ headingColor: '</style><script>', bodyTextColor: 'red;display:none', mutedTextColor: '', linkColor: 'url(javascript:evil)' });
  assert.equal(rules.some(rule => rule.includes('script') || rule.includes('display:none') || rule.includes('javascript')), false);
  assert.equal(rules.length, 9, 'explicit semantic context rules remain available without brand overrides');
});
