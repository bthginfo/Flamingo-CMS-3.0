import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseColor, contrastRatio, isDarkColor, isValidColorString, validateBrandPayload, autoFixDesignReadable, validateSectionStyleOverrides } from './color-validation';

test('parseColor accepts hex/rgb/rgba and rejects junk', () => {
  assert.ok(parseColor('#000000'));
  assert.ok(parseColor('#fff'));
  assert.ok(parseColor('rgb(255, 0, 0)'));
  assert.ok(parseColor('rgba(0, 0, 0, 0.5)'));
  assert.equal(parseColor('not-a-color'), null);
  assert.equal(parseColor(''), null);
});

test('contrastRatio: black on white is ~21, identical colours are 1', () => {
  const bw = contrastRatio('#000000', '#ffffff');
  assert.ok(bw !== null && Math.abs(bw - 21) < 0.1, `expected ~21, got ${bw}`);
  const same = contrastRatio('#3366cc', '#3366cc');
  assert.ok(same !== null && Math.abs(same - 1) < 0.01, `expected ~1, got ${same}`);
});

test('contrastRatio is symmetric', () => {
  const a = contrastRatio('#222222', '#dddddd');
  const b = contrastRatio('#dddddd', '#222222');
  assert.equal(a, b);
});

test('contrastRatio composites translucent backgrounds over the real canvas', () => {
  const ratio = contrastRatio('#ffffff', 'rgba(0,0,0,0.1)', '#ffffff');
  assert.ok(ratio !== null && ratio < 1.3, `expected near-white on white to fail, got ${ratio}`);
});

test('isDarkColor classifies extremes correctly', () => {
  assert.equal(isDarkColor('#000000'), true);
  assert.equal(isDarkColor('#0E3A53'), true);   // the brand dark used in demos
  assert.equal(isDarkColor('#ffffff'), false);
  assert.equal(isDarkColor('#FBF6F2'), false);  // cream
});

test('isValidColorString guards types', () => {
  assert.equal(isValidColorString('#fff'), true);
  assert.equal(isValidColorString('rgba(0,0,0,0)'), true);
  assert.equal(isValidColorString('transparent'), true);
  assert.equal(isValidColorString('rgb(256,0,0)'), false);
  assert.equal(isValidColorString('rgba(0,0,0,1.1)'), false);
  assert.equal(isValidColorString('rgba(0,0,0,)'), false);
  assert.equal(isValidColorString('banana'), false);
  assert.equal(isValidColorString(42), false);
  assert.equal(isValidColorString(null), false);
});

test('rgba accepts a leading-dot alpha with the same numeric and contrast behavior as a leading zero', () => {
  for (const alpha of ['0', '12', '999']) {
    const compact = `rgba(16, 24, 32, .${alpha})`;
    const full = `rgba(16, 24, 32, 0.${alpha})`;
    assert.equal(isValidColorString(compact), true);
    assert.deepEqual(parseColor(compact), parseColor(full));
    assert.equal(contrastRatio('#ffffff', compact), contrastRatio('#ffffff', full));
  }
  assert.deepEqual(parseColor('rgba(16, 24, 32, .12)'), { r: 16, g: 24, b: 32, a: 0.12 });
  for (const value of ['rgba(16,24,32,.)', 'rgba(16,24,32,.12.3)', 'rgba(16,24,32,-.12)', 'rgba(16,24,32,1.12)', 'rgba(256,24,32,.12)']) {
    assert.equal(isValidColorString(value), false, value);
  }
});

test('brand validation covers every rendered color family', () => {
  const issues = validateBrandPayload({
    pageBg: '#gggggg',
    footerLinkColor: 'rgb(300,0,0)',
    navBgColor: 'rgba(0,0,0,2)',
    badgeBorder: 'javascript:red',
    btnOutlineText: '#12345',
  });
  assert.deepEqual(new Set(issues.map(issue => issue.location)), new Set([
    'brand.pageBg',
    'brand.footerLinkColor',
    'brand.navBgColor',
    'brand.badgeBorder',
    'brand.btnOutlineText',
  ]));
});

test('design auto-fix derives readable foregrounds without replacing explicit choices', () => {
  const { design, applied } = autoFixDesignReadable({
    sectionBg: '#050505',
    cardBg: '#111827',
    btnBg: '#f5f5f5',
    badgeBg: '#1f2937',
    headingColor: '#eeeeee',
  });
  assert.equal(design.headingColor, '#eeeeee');
  assert.equal(design.bodyColor, '#ffffff');
  assert.equal(design.cardBodyColor, '#ffffff');
  assert.equal(design.btnText, '#0f172a');
  assert.equal(design.badgeText, '#ffffff');
  assert.ok(applied.includes('bodyColor=#ffffff'));
  assert.ok(!applied.includes('headingColor=#ffffff'));
});

test('light design auto-fix keeps inverse media text independent', () => {
  const { design } = autoFixDesignReadable({ sectionBg: '#f8f7f3' });
  assert.ok((contrastRatio(String(design.headingColor), '#f8f7f3') ?? 0) >= 4.5);
  assert.equal(design.onDarkHeading, undefined);
  assert.equal(design.onDarkBody, undefined);
  assert.equal(design.onDarkMuted, undefined);
});

test('section contrast validation checks inherited design tokens when overrides are absent', () => {
  const issues = validateSectionStyleOverrides(0, 'hero', {}, {
    sectionBg: '#f8fafc',
    headingColor: '#ffffff',
    bodyColor: '#ffffff',
  });
  const locations = issues.map(issue => issue.location);
  assert.ok(locations.includes('sections[0].heading on .sectionBg'));
  assert.ok(locations.includes('sections[0].body on .sectionBg'));
});

test('independent image foregrounds are never treated as the normal section text', () => {
  const issues = validateSectionStyleOverrides(0, 'beforeAfter', { '--token-section-bg': '#ffffff' }, {
    onDarkHeading: '#ffffff', onDarkBody: '#ffffff', onDarkMuted: '#ffffff',
  });
  assert.equal(issues.length, 0);
});
