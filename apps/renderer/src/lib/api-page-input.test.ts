import assert from 'node:assert/strict';
import test from 'node:test';
import { pageMetadataUpdates, mergeSectionStylePatch, validateSectionPatchKeys } from './api-page-input';

test('page metadata rejects routing characters and invalid values before mutation', () => {
  for (const slug of ['hello world', '../admin', 'home?x=1', 'home#anchor', 'one//two']) {
    assert.throws(() => pageMetadataUpdates({ slug }));
  }
  for (const input of [{ title: '' }, { title: 3 }, { slug: false }, { visible: 'false' }]) {
    assert.throws(() => pageMetadataUpdates(input));
  }
  assert.deepEqual(pageMetadataUpdates({ title: ' Projekte ', slug: '/LEISTUNGEN/Design/', visible: false }), {
    title: 'Projekte', slug: 'leistungen/design', visible: false,
  });
  assert.deepEqual(pageMetadataUpdates({ slug: '/' }), { slug: '' });
});

test('style patches reset all or one role without mutating existing data', () => {
  const existing = { '--token-heading': '#112233', '--token-on-dark-heading': '#ffffff' };
  assert.equal(mergeSectionStylePatch(existing, null), null);
  assert.deepEqual(mergeSectionStylePatch(existing, { '--token-heading': null }), { ...existing, '--token-heading': null });
  assert.equal(existing['--token-heading'], '#112233');
  for (const invalid of [[], false, '#ffffff']) assert.throws(() => mergeSectionStylePatch(existing, invalid));
});

test('section patches reject misspelled fields and id-only success no-ops', () => {
  assert.throws(() => validateSectionPatchKeys({ id: 'one', styleOverride: {} }, 0));
  assert.throws(() => validateSectionPatchKeys({ id: 'one' }, 0));
  assert.doesNotThrow(() => validateSectionPatchKeys({ id: 'one', styleOverrides: null }, 0));
});
