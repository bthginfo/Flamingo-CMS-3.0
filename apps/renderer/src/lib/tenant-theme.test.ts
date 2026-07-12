import assert from 'node:assert/strict';
import test from 'node:test';
import { getTenantFontAssets, getTenantThemeCssVars, normalizeTenantFontFamily } from './tenant-theme';

test('tenant theme preserves authored style surfaces and applies design last', () => {
  const vars = getTenantThemeCssVars({
    industry: 'tradesman',
    style: 'classic',
    brand: {
      primaryColor: '#22303A',
      accentColor: '#C0922E',
      headingFont: 'Fraunces',
      bodyFont: 'Inter',
    },
    design: {
      sectionBg: '#FFFFFF',
      sectionBgAlt: '#F4F1EA',
      dividerColor: '#E7E1D4',
      heading: '#22303A',
    },
  });

  assert.match(vars['--style-heading-font'], /Fraunces/);
  assert.match(vars['--custom-body-font'], /Inter/);
  assert.equal(vars['--token-section-bg'], '#FFFFFF');
  assert.equal(vars['--token-section-bg-alt'], '#F4F1EA');
  assert.equal(vars['--token-divider'], '#E7E1D4');
  assert.equal(vars['--token-heading'], '#22303A');
});

test('main and alternate style surfaces remain independent without brand overrides', () => {
  const vars = getTenantThemeCssVars({ industry: 'hotel', style: 'classic', brand: {} });
  assert.ok(vars['--token-section-bg']);
  assert.ok(vars['--token-section-bg-alt']);
  assert.notEqual(vars['--token-section-bg'], vars['--token-section-bg-alt']);
});

test('tenant font CSS rejects declaration injection and non-HTTPS URLs', () => {
  assert.equal(normalizeTenantFontFamily('Demo";color:red;/* Font'), 'Demo color red Font');
  const assets = getTenantFontAssets({
    customHeadingFontName: 'Safe";}body{display:none}/*',
    customHeadingFontUrl: 'javascript:alert(1)',
    customBodyFontName: 'Customer Sans',
    customBodyFontUrl: 'https://example.com/customer.woff2',
  });
  assert.doesNotMatch(assets.fontFaceCss, /javascript|display:none/);
  assert.match(assets.fontFaceCss, /Customer Sans/);
  assert.match(assets.fontFaceCss, /https:\/\/example\.com\/customer\.woff2/);
});

test('an unusable custom font falls back to the configured Google family', () => {
  const vars = getTenantThemeCssVars({
    industry: 'tradesman',
    style: 'classic',
    brand: {
      headingFont: 'Fraunces',
      customHeadingFontName: 'Broken Upload',
      customHeadingFontUrl: 'javascript:alert(1)',
    },
  });
  assert.match(vars['--style-heading-font'], /Fraunces/);
  assert.doesNotMatch(vars['--style-heading-font'], /Broken Upload/);
});
