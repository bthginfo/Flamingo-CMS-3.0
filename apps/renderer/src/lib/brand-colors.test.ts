import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getBrandCssVars,
  getHexContrastRatio,
  resolveAccessibleFooterForeground,
} from './brand-colors';

test('hex contrast uses the WCAG luminance formula', () => {
  assert.equal(getHexContrastRatio('#000', '#fff'), 21);
  assert.equal(getHexContrastRatio('not-a-color', '#fff'), null);
});

test('accessible explicit footer colors are preserved and normalized', () => {
  assert.equal(resolveAccessibleFooterForeground('#111827', '#F9FAFB'), '#f9fafb');
});

test('low-contrast footer colors fall back to the strongest neutral', () => {
  assert.equal(resolveAccessibleFooterForeground('#4a252b', '#9496a2'), '#ffffff');
  assert.equal(resolveAccessibleFooterForeground('#f8fafc', '#cbd5e1'), '#000000');
});

test('brand variables always include an AA footer palette', () => {
  const vars = getBrandCssVars({
    primaryColor: '#b77772',
    footerColor: '#4a252b',
    footerTextColor: '#9496a2',
    footerLinkColor: '#9496a2',
  });

  assert.equal(vars['--brand-footer'], '#4a252b');
  assert.equal(vars['--brand-footer-text'], '#ffffff');
  assert.equal(vars['--brand-footer-link'], '#ffffff');
  assert.ok((getHexContrastRatio(vars['--brand-footer-link'], vars['--brand-footer']) ?? 0) >= 4.5);
});

test('missing primary color does not disable footer protection', () => {
  const vars = getBrandCssVars({ footerColor: '#ffffff' });
  assert.equal(vars['--brand-footer'], '#ffffff');
  assert.equal(vars['--brand-footer-text'], '#000000');
  assert.equal(vars['--brand-footer-link'], '#000000');
  assert.equal(vars['--brand-primary'], '#1a5276');
});

test('renderer normalizes API-supported rgb and alpha colors consistently', () => {
  const vars = getBrandCssVars({
    primaryColor: 'rgb(26, 82, 118)',
    footerColor: 'rgba(0, 0, 0, 0.5)',
    pageBg: '#ffffff',
  });
  assert.equal(vars['--brand-primary'], '#1a5276');
  assert.equal(vars['--brand-footer'], '#808080');
  assert.equal(vars['--brand-footer-text'], '#000000');
  assert.ok((getHexContrastRatio(vars['--brand-footer-text'], vars['--brand-footer']) ?? 0) >= 4.5);
});

test('dark card surfaces and near-threshold badges receive AA foreground tokens', () => {
  const vars = getBrandCssVars({
    primaryColor: '#9333ea',
    sectionBg: '#ffffff',
    cardBg: '#1a1a1a',
    headingColor: '#11100e',
    bodyTextColor: '#4a4038',
    mutedTextColor: '#7a6d62',
    badgeBg: '#f0e6fa',
    badgeText: '#9333ea',
  });

  assert.ok((getHexContrastRatio(vars['--token-card-heading'], '#1a1a1a') ?? 0) >= 4.5);
  assert.ok((getHexContrastRatio(vars['--token-card-body'], '#1a1a1a') ?? 0) >= 4.5);
  assert.ok((getHexContrastRatio(vars['--token-card-muted'], '#1a1a1a') ?? 0) >= 4.5);
  assert.ok((getHexContrastRatio(vars['--token-badge-text'], '#f0e6fa') ?? 0) >= 4.5);
});

test('bright brand accents keep their hue for decoration but foreground roles are readable', () => {
  const vars = getBrandCssVars({
    primaryColor: '#b45309',
    accentColor: '#f59e0b',
    sectionBg: '#ffffff',
    sectionBgAlt: '#f7f0e8',
    cardBg: '#fffcf6',
    iconColor: '#c0922e',
  });

  assert.equal(vars['--token-accent'], '#f59e0b');
  for (const token of ['--token-eyebrow', '--token-stat-value', '--token-price']) {
    assert.ok((getHexContrastRatio(vars[token], '#ffffff') ?? 0) >= 4.5, token);
    assert.ok((getHexContrastRatio(vars[token], '#f7f0e8') ?? 0) >= 4.5, token);
    assert.ok((getHexContrastRatio(vars[token], '#fffcf6') ?? 0) >= 4.5, token);
  }
  assert.ok((getHexContrastRatio(vars['--token-icon'], '#ffffff') ?? 0) >= 3);
  assert.ok((getHexContrastRatio(vars['--token-card-icon'], '#fffcf6') ?? 0) >= 3);
});
