import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('AI contract requires automatic reachable collection overviews and detail QA', () => {
  const instructions = readFileSync(
    new URL('../app/api/v1/instructions/route.ts', import.meta.url),
    'utf8',
  );
  const guidance = readFileSync(new URL('./ai-agent-guidance.ts', import.meta.url), 'utf8');

  for (const source of [instructions, guidance]) {
    assert.match(source, /overviewPage/);
    assert.match(source, /overview page|Übersichtsseite|Übersicht/i);
    assert.match(source, /never overwritten|NIE überschrieben/i);
    assert.match(source, /HTTP 200/);
    assert.match(source, /\/c\/<collectionKey>\/<itemSlug>/);
  }
});
