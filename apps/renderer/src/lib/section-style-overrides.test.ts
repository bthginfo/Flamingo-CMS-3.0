import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SectionRenderer } from '../components/section-renderer';
import type { SnapshotSection } from './snapshot';
import {
  escapeCssAttributeValue,
  escapeStyleElementText,
  normalizeStyleOverridesForSection,
  normalizeStyleOverridesForSectionWithIssues,
} from './section-style-overrides';

const STYLE_BREAKOUT = '</style><script data-xss="stored">globalThis.__xss = true</script>';

test('storage normalization keeps valid tokens and rejects unsafe, invalid and section-foreign values', () => {
  const result = normalizeStyleOverridesForSectionWithIssues('hero', {
    sectionBg: '#112233',
    '--token-btn-bg': 'var(--brand-primary)',
    btnText: 'rgba(255, 255, 255, 0.9)',
    headingColor: 'red',
    bodyColor: STYLE_BREAKOUT,
    mutedColor: 123,
    cardRadius: '12px',
    '--token-not-real': '#ffffff',
  }, 'hotel');

  assert.deepEqual(result.styleOverrides, {
    '--token-section-bg': '#112233',
    '--token-btn-bg': 'var(--brand-primary)',
    '--token-btn-text': 'rgba(255, 255, 255, 0.9)',
  });
  assert.equal(JSON.stringify(result.styleOverrides).includes(STYLE_BREAKOUT), false);
  assert.deepEqual(
    new Set(result.issues.map((issue) => issue.reason)),
    new Set(['unsafe_value', 'invalid_type', 'section_key_not_allowed', 'unknown_key']),
  );
});

test('documented size values survive the strict grammar while declaration injection does not', () => {
  assert.deepEqual(normalizeStyleOverridesForSection('beforeAfter', {
    cardRadius: '1.25rem',
    cardShadow: '0 4px 20px rgba(0,0,0,0.06)',
    headingWeight: '700',
    headingTracking: '-0.02em',
  }, 'florist'), {
    '--token-card-radius': '1.25rem',
    '--token-card-shadow': '0 4px 20px rgba(0,0,0,0.06)',
    '--token-heading-weight': '700',
    '--token-heading-tracking': '-0.02em',
  });

  assert.equal(normalizeStyleOverridesForSection('beforeAfter', {
    cardShadow: '0 4px #000; color:red',
  }, 'florist'), null);
});

test('known legacy aliases remain renderable but are rewritten to canonical tokens', () => {
  assert.deepEqual(normalizeStyleOverridesForSection('hero', {
    '--style-section-bg': '#101820',
    '--token-on-dark-heading': '#ffffff',
    onDarkBody: 'rgba(255, 255, 255, 0.85)',
  }, 'hotel'), {
    '--token-section-bg': '#101820',
    '--token-heading': '#ffffff',
    '--token-body': 'rgba(255, 255, 255, 0.85)',
  });
});

test('explicit renderer definitions keep their own color roles through normalization', () => {
  const overrides = { '--token-image-overlay': 'rgba(15, 23, 42, 0.72)' };

  assert.equal(normalizeStyleOverridesForSection('hero', overrides, 'salon'), null);
  assert.deepEqual(
    normalizeStyleOverridesForSection('hero', overrides, 'salon', 'hero.consulting.v1'),
    overrides,
  );
});

test('style-element and selector escaping cannot emit a style-tag breakout', () => {
  const selectorValue = escapeCssAttributeValue(`section"]${STYLE_BREAKOUT}`);
  const css = escapeStyleElementText(`[data-section-id="${selectorValue}"] { color: red; }${STYLE_BREAKOUT}`);

  assert.doesNotMatch(css, /<\/style|<script/i);
  assert.match(css, /\\3c /);
});

test('renderer independently drops unsafe snapshot overrides before style output', () => {
  // The test runner transpiles the application's preserved JSX in classic
  // mode. Next.js supplies this automatically in production.
  (globalThis as typeof globalThis & { React: typeof React }).React = React;

  const section: SnapshotSection = {
    id: 'safe-section-id',
    type: 'faq',
    variant: null,
    visible: true,
    container: 'default',
    spacingTop: 'm',
    spacingBottom: 'm',
    anchorId: null,
    data: { items: [] },
    styleOverrides: {
      sectionBg: '#112233',
      headingColor: STYLE_BREAKOUT,
      bodyColor: 'red',
      '--token-not-real': STYLE_BREAKOUT,
    },
  };

  const html = renderToStaticMarkup(React.createElement(SectionRenderer, {
    section,
    industry: 'hotel',
  }));

  assert.match(html, /--token-section-bg:#112233/);
  assert.doesNotMatch(html, /<script|data-xss|globalThis\.__xss/i);
  assert.doesNotMatch(html, /--token-heading:red|--token-body:red/i);
});

test('renderer CSS-escapes an untrusted section id before writing a style element', () => {
  (globalThis as typeof globalThis & { React: typeof React }).React = React;
  const section: SnapshotSection = {
    id: `section"]}${STYLE_BREAKOUT}`,
    type: 'faq',
    variant: null,
    visible: true,
    container: 'default',
    spacingTop: 'm',
    spacingBottom: 'm',
    anchorId: null,
    data: { items: [] },
    styleOverrides: { sectionBg: '#ffffff' },
  };

  const html = renderToStaticMarkup(React.createElement(SectionRenderer, {
    section,
    industry: 'hotel',
  }));
  const styleText = Array.from(html.matchAll(/<style>([\s\S]*?)<\/style>/g), (match) => match[1]).join('\n');

  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(styleText, /<\/style|<script/i);
  assert.match(styleText, /\\3c /);
});
