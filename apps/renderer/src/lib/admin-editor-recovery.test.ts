import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { restoreItemAtIndex, restoreOrderByIds } from './admin-editor-recovery';

test('failed reorders restore the last confirmed order without dropping current items', () => {
  const current = [{ id: 'c' }, { id: 'new' }, { id: 'a' }, { id: 'b' }];
  assert.deepEqual(restoreOrderByIds(current, ['a', 'b', 'c']).map(item => item.id), ['a', 'b', 'c', 'new']);
});

test('failed deletes reinsert the section once at its previous position', () => {
  const removed = { id: 'b' };
  assert.deepEqual(restoreItemAtIndex([{ id: 'a' }, { id: 'c' }], removed, 1).map(item => item.id), ['a', 'b', 'c']);
  assert.deepEqual(restoreItemAtIndex([{ id: 'a' }, removed], removed, 0).map(item => item.id), ['a', 'b']);
});

test('page mutations expose explicit failure handling and atomic reorder persistence', () => {
  const editor = readFileSync(new URL('../app/admin/pages/[id]/page-editor.tsx', import.meta.url), 'utf8');
  const actions = readFileSync(new URL('../app/admin/pages/actions.ts', import.meta.url), 'utf8');
  assert.match(editor, /reorderQueueRef/);
  assert.match(editor, /requestId === latestReorderRequestRef\.current/);
  assert.match(editor, /Reihenfolge konnte nicht gespeichert werden/);
  assert.match(editor, /restoreItemAtIndex\(current, deletedSection, deletedIndex\)/);
  assert.match(editor, /Sektion konnte nicht gelöscht werden/);
  assert.match(actions, /WITH requested\(id, sort_order\) AS/);
  assert.match(actions, /UPDATE page_sections AS section/);
  assert.doesNotMatch(actions, /db\.transaction\(async transaction/);
  assert.match(actions, /return \{ success: true as const \}/);
});
