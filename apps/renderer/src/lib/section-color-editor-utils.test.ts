import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { FIELD_DEFS, PUBLIC_COLOR_FIELD_KEYS, type ColorFieldKey } from './section-color-fields';
import {
  composeColorWithAlpha,
  EDITOR_FIELD_GROUPS,
  evaluateContrastPairs,
  getCtaStateCoverage,
  getEditorFieldGroup,
  getContrastRatio,
  getInheritedColorPresentation,
  groupEditorFields,
  parseColorWithAlpha,
  reconcileEditorColorRoles,
} from './section-color-editor-utils';

const colorEditorSource = readFileSync(
  new URL('../app/admin/pages/[id]/section-color-editor.tsx', import.meta.url),
  'utf8',
);

test('groupEditorFields keeps every statically supported role without a preview', () => {
  const fields: ColorFieldKey[] = [
    'sectionBg',
    'headingColor',
    'bodyColor',
    'btnBg',
    'btnText',
    'accentColor',
    'glowColor',
    'linkHoverColor',
    'cardRadius',
  ];
  const groups = groupEditorFields(fields);

  assert.deepEqual(groups.core, ['sectionBg', 'headingColor', 'bodyColor', 'accentColor']);
  assert.deepEqual(groups.actions, ['btnBg', 'btnText']);
  assert.deepEqual(groups.surfaces, ['glowColor']);
  assert.deepEqual(groups.states, ['linkHoverColor']);
  assert.deepEqual(groups.design, ['cardRadius']);
});

test('static and runtime role discovery merge without hiding unsupported preview states', () => {
  const fields: ColorFieldKey[] = ['sectionBg', 'headingColor', 'btnBg', 'btnText'];
  const roles = reconcileEditorColorRoles(
    fields,
    new Set(['--token-section-bg', '--token-heading']),
    { '--token-btn-bg': '#0055ff' },
  );

  assert.deepEqual(roles.map((role) => role.field), fields);
  assert.equal(roles.find((role) => role.field === 'headingColor')?.visibleInPreview, true);
  assert.equal(roles.find((role) => role.field === 'btnBg')?.visibleInPreview, false);
  assert.equal(roles.find((role) => role.field === 'btnBg')?.overridden, true);
  assert.equal(roles.find((role) => role.field === 'btnText')?.available, true);
});

test('every customer-facing editor group has explicit, unique metadata', () => {
  const grouped = Object.values(EDITOR_FIELD_GROUPS).flat();
  assert.equal(new Set(grouped).size, grouped.length, 'a field must not appear in multiple groups');
  assert.deepEqual(
    new Set(grouped),
    new Set(PUBLIC_COLOR_FIELD_KEYS),
    'every public renderer field must be assigned to a customer-facing group',
  );
  for (const field of PUBLIC_COLOR_FIELD_KEYS) {
    assert.ok(FIELD_DEFS[field], `${field} must have a field definition`);
    assert.ok(getEditorFieldGroup(field), `${field} must have a customer-facing editor group`);
  }
});

test('CTA state coverage marks every state as editable or deliberately derived', () => {
  const coverage = getCtaStateCoverage([
    'btnBg',
    'btnText',
    'btnSecondaryBg',
    'btnSecondaryText',
    'btnSecondaryBorder',
  ]);

  assert.deepEqual(
    coverage.map((item) => item.id),
    [
      'primary-surface',
      'primary-content',
      'primary-border',
      'primary-hover',
      'primary-focus',
      'secondary-surface',
      'secondary-content',
      'secondary-border',
      'secondary-hover',
      'secondary-focus',
    ],
  );
  assert.equal(coverage.find((item) => item.id === 'secondary-border')?.mode, 'editable');
  assert.equal(coverage.find((item) => item.id === 'primary-hover')?.mode, 'derived');
  assert.match(coverage.find((item) => item.id === 'primary-hover')?.description || '', /automatisch/i);
  assert.match(coverage.find((item) => item.id === 'primary-focus')?.description || '', /Akzentfarbe/i);
});

test('missing secondary CTA tokens are documented as derived instead of disappearing', () => {
  const coverage = getCtaStateCoverage(['btnBg', 'btnText', 'btnSecondaryText']);
  assert.equal(coverage.find((item) => item.id === 'secondary-surface')?.mode, 'derived');
  assert.equal(coverage.find((item) => item.id === 'secondary-border')?.mode, 'derived');
});

test('derived color recipes use a human label while preserving their exact technical value', () => {
  const technicalValue = 'color-mix(in srgb, var(--token-accent) 22%, transparent)';
  const presentation = getInheritedColorPresentation(technicalValue);

  assert.equal(presentation.isDerived, true);
  assert.equal(presentation.displayValue, 'Automatisch aus der Akzentfarbe abgeleitet');
  assert.equal(presentation.technicalValue, technicalValue);
  assert.doesNotMatch(presentation.displayValue, /color-mix/i);
});

test('concrete inherited colors continue to display unchanged', () => {
  assert.deepEqual(getInheritedColorPresentation('  rgba(15, 23, 42, 0.8)  '), {
    displayValue: 'rgba(15, 23, 42, 0.8)',
    technicalValue: 'rgba(15, 23, 42, 0.8)',
    isDerived: false,
  });
});

test('the CTA interaction matrix becomes a native container-responsive disclosure', () => {
  assert.match(colorEditorSource, /<details className="section-color-editor__cta-compact/);
  assert.match(colorEditorSource, /Button-Zustände/);
  assert.match(colorEditorSource, /@container \(max-width: 30rem\)/);
  assert.match(colorEditorSource, /\.section-color-editor__cta-expanded \{ display: none; \}/);
  assert.match(colorEditorSource, /\.section-color-editor__cta-compact \{ display: block; \}/);
  assert.doesNotMatch(colorEditorSource, /@media[\s\S]*?section-color-editor__cta-compact/);
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
