import assert from 'node:assert/strict';
import test from 'node:test';
import { validateCollectionItemInput, collectionItemSlug } from './api-collection-input';

test('collection item payloads reject data that would break rendering or URL lookup', () => {
  for (const body of [{ title: 2 }, { slug: '/news/one' }, { data: [] }, { data: null }, { data: { sections: 'wrong' } }, { published: 'true' }, { priority: 0.5 }]) assert.throws(() => validateCollectionItemInput(body));
  assert.doesNotThrow(() => validateCollectionItemInput({ title: 'Werkstatt', slug: 'werkstatt', data: { sections: [] }, published: false, priority: -1 }, true));
});

test('generated collection slugs support international titles and never become empty', () => {
  assert.equal(collectionItemSlug('  Café in Zürich  '), 'café-in-zürich');
  assert.equal(collectionItemSlug('東京'), '東京');
  assert.throws(() => collectionItemSlug('✨'));
  assert.equal(collectionItemSlug('✨', 'neu'), 'neu');
});
