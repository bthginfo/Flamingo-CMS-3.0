import assert from 'node:assert/strict';
import test from 'node:test';
import { getDesignCssVars } from './design-vars';

test('design CSS variables ignore malformed persisted values', () => {
  const vars = getDesignCssVars({
    sectionBg: '#111827',
    textOnSectionBg: '#ffffff',
    headingColor: '</style><script>alert(1)</script>',
    cardBg: '#fff; background:url(https://attacker.example)',
  });

  assert.equal(vars['--token-section-bg'], '#111827');
  assert.equal(vars['--style-text-on-section'], '#ffffff');
  assert.equal(vars['--token-heading'], '#ffffff');
  assert.equal(vars['--token-card-bg'], undefined);
  assert.ok(!Object.values(vars).some((value) => value.includes('<script')));
});
