import assert from 'node:assert/strict';
import test from 'node:test';
import { compactStringList, deserializeStringList, serializeStringList } from './string-list';

test('string lists drop empty drafts without changing content or order', () => {
  const draft = ['Erster Eintrag', '', '   ', ' Zweiter Eintrag '];
  assert.deepEqual(compactStringList(draft), ['Erster Eintrag', ' Zweiter Eintrag ']);
});

test('clean string lists survive the legacy newline roundtrip', () => {
  const draft = ['Erster Eintrag', '', 'Zweiter Eintrag', '  '];
  const serialized = serializeStringList(draft);

  assert.equal(serialized, 'Erster Eintrag\nZweiter Eintrag');
  assert.deepEqual(deserializeStringList(serialized), ['Erster Eintrag', 'Zweiter Eintrag']);
});
