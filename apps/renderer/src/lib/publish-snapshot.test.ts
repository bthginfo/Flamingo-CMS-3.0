import assert from 'node:assert/strict';
import test from 'node:test';
import { checksumPublishedSnapshot } from './publish-snapshot';

test('published snapshot checksum ignores the volatile read timestamp', () => {
  const base = {
    pages: [{ id: 'page-1', title: 'Start' }],
    collections: [],
    generatedAt: '2026-08-02T10:00:00.000Z',
  };

  assert.equal(
    checksumPublishedSnapshot(base),
    checksumPublishedSnapshot({ ...base, generatedAt: '2026-08-02T10:05:00.000Z' }),
  );
});

test('published snapshot checksum remains sensitive to editorial changes', () => {
  const base = {
    pages: [{ id: 'page-1', title: 'Start' }],
    collections: [],
    generatedAt: '2026-08-02T10:00:00.000Z',
  };

  assert.notEqual(
    checksumPublishedSnapshot(base),
    checksumPublishedSnapshot({ ...base, pages: [{ id: 'page-1', title: 'Neu' }] }),
  );
});

test('published snapshot checksum is independent of object insertion order', () => {
  assert.equal(
    checksumPublishedSnapshot({ pages: [], collections: [], generatedAt: 'a' }),
    checksumPublishedSnapshot({ collections: [], generatedAt: 'b', pages: [] }),
  );
});
