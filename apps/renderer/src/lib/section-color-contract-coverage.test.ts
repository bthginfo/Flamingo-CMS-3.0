import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SECTION_COLOR_CONTRACTS_GENERATED,
  SECTION_COLOR_CONTRACTS_GENERIC,
} from './section-color-contracts-generated';
import { getCtaStateCoverage, getEditorFieldGroup } from './section-color-editor-utils';
import { FIELD_DEFS, type ColorFieldKey } from './section-color-fields';
import { listSectionDefinitions } from '../templates';

function definitionContract(type: string, owner: string): ColorFieldKey[] | undefined {
  if (owner === 'shared') return SECTION_COLOR_CONTRACTS_GENERIC[type];
  const key = `${type}${owner.charAt(0).toUpperCase()}${owner.slice(1)}`;
  return SECTION_COLOR_CONTRACTS_GENERATED[key];
}

test('every registered renderer definition has complete editor color metadata', () => {
  const definitions = listSectionDefinitions();
  assert.ok(definitions.length > 500, 'the coverage gate must scan the complete renderer registry');

  for (const definition of definitions) {
    const fields = definitionContract(definition.type, definition.owner);
    assert.ok(fields?.length, `${definition.key} is missing a generated static color contract`);
    for (const field of fields) {
      assert.ok(FIELD_DEFS[field], `${definition.key} uses ${field} without editor metadata`);
      assert.ok(getEditorFieldGroup(field), `${definition.key} uses ${field} without a customer-facing group`);
    }
  }
});

test('every registered hero contract exposes its primary conversion colors', () => {
  const heroDefinitions = listSectionDefinitions().filter((definition) => definition.type.toLowerCase().includes('hero'));
  assert.ok(heroDefinitions.length > 10, 'expected the registered hero family');

  for (const definition of heroDefinitions) {
    const fields = definitionContract(definition.type, definition.owner) || [];
    assert.ok(fields.includes('btnBg'), `${definition.key} must expose the primary button background`);
    assert.ok(fields.includes('btnText'), `${definition.key} must expose primary button text and icons`);
    const coverage = getCtaStateCoverage(fields);
    for (const state of ['surface', 'content', 'border', 'hover', 'focus'] as const) {
      const entry = coverage.find((item) => item.id === `primary-${state}`);
      assert.ok(entry, `${definition.key} must document primary ${state} coverage`);
      assert.ok(entry.mode === 'editable' || entry.mode === 'derived');
    }
    if (fields.some((field) => field.startsWith('btnSecondary'))) {
      for (const state of ['surface', 'content', 'border', 'hover', 'focus'] as const) {
        const entry = coverage.find((item) => item.id === `secondary-${state}`);
        assert.ok(entry, `${definition.key} must document secondary ${state} coverage`);
        assert.ok(entry.mode === 'editable' || entry.mode === 'derived');
      }
    }
  }
});

test('the salon hero outline CTA exposes its rendered border token', () => {
  const fields = definitionContract('hero', 'salon') || [];
  assert.ok(fields.includes('btnSecondaryBorder'));
  assert.equal(
    getCtaStateCoverage(fields).find((item) => item.id === 'secondary-border')?.mode,
    'editable',
  );
});

test('every registered CTA contract documents editable or derived interaction states', () => {
  for (const definition of listSectionDefinitions()) {
    const fields = definitionContract(definition.type, definition.owner) || [];
    const scopes = fields.some((field) => field.startsWith('btnSecondary'))
      ? ['primary', 'secondary'] as const
      : ['primary'] as const;
    const coverage = getCtaStateCoverage(fields);
    for (const scope of scopes) {
      for (const state of ['surface', 'content', 'border', 'hover', 'focus'] as const) {
        const entry = coverage.find((item) => item.id === `${scope}-${state}`);
        assert.ok(entry, `${definition.key} must document ${scope} ${state}`);
        assert.ok(entry.mode === 'editable' || entry.mode === 'derived');
      }
    }
  }
});
