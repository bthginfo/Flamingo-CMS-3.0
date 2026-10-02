import assert from 'node:assert/strict';
import test from 'node:test';
import { pickSectionMetadata } from './section-metadata-input';

test('metadata mutations cannot move a section, unlock it or replace its data', () => {
  for (const injected of [{ tenantId: 'other' }, { pageId: 'other' }, { id: 'other' }, { locked: false }, { data: {} }]) {
    assert.throws(() => pickSectionMetadata({ visible: true, ...injected }));
  }
});

test('metadata preserves valid resets while rejecting values that bypass TS signatures', () => {
  const values = { visible: false, variant: null, titleInternal: null, styleOverrides: null, spacingTop: 'xl' };
  assert.deepEqual(pickSectionMetadata(values), values);
  assert.notEqual(pickSectionMetadata(values), values);
  for (const input of [{ visible: 'false' }, { container: {} }, { schemaVersion: 0 }, { variant: [] }]) {
    assert.throws(() => pickSectionMetadata(input));
  }
});
