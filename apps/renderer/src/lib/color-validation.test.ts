import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseColor, contrastRatio, isDarkColor, isValidColorString } from './color-validation';

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

test('isDarkColor classifies extremes correctly', () => {
  assert.equal(isDarkColor('#000000'), true);
  assert.equal(isDarkColor('#0E3A53'), true);   // the brand dark used in demos
  assert.equal(isDarkColor('#ffffff'), false);
  assert.equal(isDarkColor('#FBF6F2'), false);  // cream
});

test('isValidColorString guards types', () => {
  assert.equal(isValidColorString('#fff'), true);
  assert.equal(isValidColorString('rgba(0,0,0,0)'), true);
  assert.equal(isValidColorString('banana'), false);
  assert.equal(isValidColorString(42), false);
  assert.equal(isValidColorString(null), false);
});
