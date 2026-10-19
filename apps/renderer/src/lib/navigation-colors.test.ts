import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveNavigationHoverColor } from './navigation-colors';
import { getHexContrastRatio } from './brand-colors';

test('a dark body hover falls back to the readable Schubert nav foreground', () => {
  for (const background of ['#151A17', 'rgb(21, 26, 23)']) {
    assert.equal(resolveNavigationHoverColor({ background, hover: '#222622', foreground: '#F7F4EF' }), '#F7F4EF');
  }
});

test('preserves explicit CMS hover colors when readable on the actual surface', () => {
  assert.equal(resolveNavigationHoverColor({ background: '#151A17', hover: '#C5AF8A', foreground: '#F7F4EF' }), '#C5AF8A');
  assert.equal(resolveNavigationHoverColor({ background: '#FFFFFF', hover: '#222622', foreground: '#111827' }), '#222622');
});

test('composites alpha colors and rejects unreadable fallback foregrounds too', () => {
  assert.equal(resolveNavigationHoverColor({ background: '#151A17', hover: 'rgba(255,255,255,0.1)', foreground: '#F7F4EF' }), '#F7F4EF');
  const result = resolveNavigationHoverColor({ background: '#151A17', hover: '#222622', foreground: '#222622' });
  assert.ok((getHexContrastRatio(result, '#151A17') || 0) >= 4.5);
  assert.equal(resolveNavigationHoverColor({ background: 'rgba(255,255,255,0.8)', hover: '#ffffff', foreground: '#111827' }), '#111827');
});
