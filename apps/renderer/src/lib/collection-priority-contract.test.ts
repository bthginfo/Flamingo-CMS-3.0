import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const sources = [
  { file: '../app/admin/collections/actions.ts', expectedReads: 3 },
  { file: '../app/admin/pages/actions.ts', expectedReads: 1 },
  { file: '../app/api/v1/content/debug/route.ts', expectedReads: 1 },
  { file: './snapshot.ts', expectedReads: 1 },
].map(entry => ({ ...entry, source: readFileSync(new URL(entry.file, import.meta.url), 'utf8') }));

describe('collection priority contract', () => {
  it('places higher priorities first with deterministic tie breakers in every read path', () => {
    for (const { file, source, expectedReads } of sources) {
      assert.doesNotMatch(source, /orderBy\(asc\(collectionItems\.priority\)/, file);
      const deterministicOrder = /orderBy\(desc\(collectionItems\.priority\), desc\(collectionItems\.updatedAt\), asc\(collectionItems\.id\)\)/g;
      assert.equal((source.match(deterministicOrder) || []).length, expectedReads, file);
    }
  });

  it('keeps the editor guidance aligned with the query contract', () => {
    const editor = readFileSync(new URL('../app/admin/collections/[key]/[itemId]/item-editor.tsx', import.meta.url), 'utf8');
    assert.match(editor, /Höhere Werte erscheinen weiter oben\./);
  });
});
