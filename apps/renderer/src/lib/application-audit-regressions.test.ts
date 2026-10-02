import assert from 'node:assert/strict';
import test from 'node:test';
import React, { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LegalContentSection } from '../templates/handwerk/legal-content';
import { InstagramFeedSection } from '../templates/shared/instagram-feed';

test('legacy shop legal blocks render their content and remain sanitized', () => {
  (globalThis as typeof globalThis & { React: typeof React }).React = React;
  const html = renderToStaticMarkup(createElement(LegalContentSection, { data: { blocks: [{ title: 'Information', content: '<p>Bestehender Shop-Text</p><script>alert(1)</script>' }] } }));
  assert.match(html, /Bestehender Shop-Text/);
  assert.match(html, /Information/);
  assert.doesNotMatch(html, /<script/);
});

test('Instagram live-preview hydration starts with the same markup as the server', () => {
  (globalThis as typeof globalThis & { React: typeof React }).React = React;
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  try {
    Reflect.deleteProperty(globalThis, 'window');
    const server = renderToStaticMarkup(createElement(InstagramFeedSection, { data: {} }));
    Object.defineProperty(globalThis, 'window', { value: { __FLAMINGO_TENANT_ID__: 'preview-tenant' }, configurable: true });
    const firstClient = renderToStaticMarkup(createElement(InstagramFeedSection, { data: {} }));
    assert.equal(firstClient, server, 'The injected tenant must not add placeholder copy before hydration completes.');
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'window', descriptor);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});
