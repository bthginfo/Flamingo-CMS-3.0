import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source(relative: string) {
  return readFileSync(new URL(relative, import.meta.url), 'utf8');
}

test('page and collection editors reserve the shared bottom action bar', () => {
  const shell = source('../app/admin/editor/editor-workspace-shell.tsx');
  const actionBar = source('../app/admin/editor/editor-action-bar.tsx');
  const pageEditor = source('../app/admin/pages/[id]/page-editor.tsx');
  const itemEditor = source('../app/admin/collections/[key]/[itemId]/item-editor.tsx');

  assert.match(shell, /--editor-action-bar-height/);
  assert.match(shell, /paddingBottom: 'calc\(var\(--editor-action-bar-height\)/);
  assert.match(actionBar, /min-h-\[var\(--editor-action-bar-height,5rem\)\]/);
  assert.match(pageEditor, /<EditorWorkspaceShell>/);
  assert.match(itemEditor, /<EditorWorkspaceShell>/);
});

test('shared section editor controls cannot accidentally submit an outer form', () => {
  const dataEditor = source('../app/admin/pages/[id]/section-data-editor.tsx');
  const buttonLines = dataEditor.split(/\r?\n/).filter((line) => line.includes('<button'));
  assert.ok(buttonLines.length > 90);
  assert.deepEqual(buttonLines.filter((line) => !line.includes('type="button"')), []);
  const removeButtonLines = buttonLines.filter((line) => line.includes('>×</button>'));
  assert.ok(removeButtonLines.length > 0);
  assert.deepEqual(removeButtonLines.filter((line) => !line.includes('aria-label=')), []);
});

test('section focus and media dialog keyboard contracts remain wired', () => {
  const card = source('../app/admin/editor/section-editor-card.tsx');
  const media = source('../components/image-upload-field.tsx');
  assert.match(card, /data-section-card-id=\{section\.id\}/);
  assert.match(media, /event\.key === 'Escape'/);
  assert.match(media, /event\.key !== 'Tab'/);
  assert.match(media, /libraryReturnFocusRef/);
  assert.match(media, /aria-modal="true"/);
});
