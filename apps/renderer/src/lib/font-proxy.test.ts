import assert from 'node:assert/strict';
import test from 'node:test';
import { buildGoogleFontsProxyUrl, normalizeGoogleFontFamilies } from './font-proxy';

test('builds a deduplicated same-origin font URL from allowlisted families', () => {
  assert.deepEqual(normalizeGoogleFontFamilies(['Inter', ' Inter ', 'Playfair Display']), ['Inter', 'Playfair Display']);
  assert.equal(
    buildGoogleFontsProxyUrl(['Inter', 'Playfair Display']),
    '/api/fonts/google?family=Inter&family=Playfair+Display',
  );
});

test('rejects unknown font names and injection attempts', () => {
  assert.equal(buildGoogleFontsProxyUrl(['https://example.com/font', 'Inter;url(x)']), null);
});

test('allowlists the editorial font families used by curated demos', () => {
  assert.deepEqual(
    normalizeGoogleFontFamilies(['Fraunces', 'Manrope', 'Nunito Sans']),
    ['Fraunces', 'Manrope', 'Nunito Sans'],
  );
});
