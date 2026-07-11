import assert from 'node:assert/strict';
import test from 'node:test';
import { FIELD_DEFS, type ColorFieldKey } from './section-color-fields';
import {
  composeColorWithAlpha,
  evaluateContrastPairs,
  getContrastRatio,
  groupEditorFields,
  parseColorWithAlpha,
} from './section-color-editor-utils';

test('groupEditorFields shows only rendered or explicitly set roles by default', () => {
  const fields: ColorFieldKey[] = [
    'sectionBg',
    'headingColor',
    'bodyColor',
    'accentColor',
    'glowColor',
    'cardRadius',
  ];
  const groups = groupEditorFields(
    fields,
    new Set(['--token-heading', '--token-glow-color']),
    { '--token-accent': '#ff0000' },
  );

  assert.deepEqual(groups.core, ['sectionBg', 'headingColor', 'accentColor']);
  assert.deepEqual(groups.special, ['glowColor']);
  assert.deepEqual(groups.design, []);
  assert.deepEqual(groups.inactive, ['bodyColor', 'cardRadius']);
});

test('groupEditorFields caps the visible core group without losing live fields', () => {
  const fields: ColorFieldKey[] = ['sectionBg', 'headingColor', 'bodyColor', 'accentColor'];
  const used = new Set(fields.map((field) => FIELD_DEFS[field].cssVar));
  const groups = groupEditorFields(fields, used, {}, 2);

  assert.deepEqual(groups.core, ['sectionBg', 'headingColor']);
  assert.deepEqual(groups.coreOverflow, ['bodyColor', 'accentColor']);
});

test('color parsing and composition preserve a deliberate alpha value', () => {
  assert.deepEqual(parseColorWithAlpha('#33669980'), { hex: '#336699', alpha: 128 / 255 });
  assert.equal(composeColorWithAlpha('#336699', 0.4), 'rgba(51, 102, 153, 0.4)');
  assert.deepEqual(parseColorWithAlpha('#12345'), { hex: '', alpha: undefined });
});

test('WCAG contrast handles opaque and translucent foreground colors', () => {
  assert.equal(getContrastRatio('#000000', '#ffffff'), 21);
  const translucentRatio = getContrastRatio('rgba(0, 0, 0, 0.5)', '#ffffff');
  assert.ok(translucentRatio && translucentRatio > 3.9 && translucentRatio < 4.1);
});

test('evaluateContrastPairs returns only resolvable pairs with an AA verdict', () => {
  const fields = new Set<ColorFieldKey>(['sectionBg', 'headingColor', 'bodyColor', 'btnBg', 'btnText']);
  const colors: Partial<Record<ColorFieldKey, string>> = {
    sectionBg: '#ffffff',
    headingColor: '#111111',
    bodyColor: '#aaaaaa',
    btnBg: '#111111',
    btnText: '#ffffff',
  };
  const results = evaluateContrastPairs(fields, (field) => colors[field]);

  assert.equal(results.length, 3);
  assert.equal(results.find((result) => result.id === 'heading-section')?.passesAA, true);
  assert.equal(results.find((result) => result.id === 'body-section')?.passesAA, false);
  assert.equal(results.find((result) => result.id === 'button')?.passesAA, true);
});
