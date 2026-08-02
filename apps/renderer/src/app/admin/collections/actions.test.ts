import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source() {
  return readFileSync(new URL('./actions.ts', import.meta.url), 'utf8');
}

test('createItemAction verifies that the collection belongs to the writable tenant before inserting', () => {
  const actions = source();
  const createItemAction = actions.slice(
    actions.indexOf('export async function createItemAction'),
    actions.indexOf('export async function getItemAction'),
  );

  assert.match(createItemAction, /select\(\{ id: collections\.id \}\)\.from\(collections\)/);
  assert.match(createItemAction, /eq\(collections\.id, collectionId\), eq\(collections\.tenantId, session\.tenantId\)/);
  assert.match(createItemAction, /if \(!collection\) return \{ error: 'Collection nicht gefunden oder keine Berechtigung' \}/);
  assert.match(createItemAction, /collectionId: collection\.id/);
  assert.doesNotMatch(createItemAction, /collectionId,\s*title/);
});
