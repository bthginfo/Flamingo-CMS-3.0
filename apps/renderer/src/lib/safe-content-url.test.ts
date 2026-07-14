import assert from 'node:assert/strict';
import test from 'node:test';
import { safeContentUrl } from './safe-content-url';

test('content URLs reject executable schemes and credentials', () => {
  assert.equal(safeContentUrl('javascript:alert(1)'), '');
  assert.equal(safeContentUrl('data:text/html,<script>alert(1)</script>'), '');
  assert.equal(safeContentUrl('//evil.example/path'), '');
  assert.equal(safeContentUrl('https://user:pass@example.com/path'), '');
  assert.equal(safeContentUrl('/kontakt'), '/kontakt');
  assert.equal(safeContentUrl('#kontakt'), '#kontakt');
  assert.equal(safeContentUrl('mailto:hello@example.com'), 'mailto:hello@example.com');
  assert.equal(safeContentUrl('https://example.com/a'), 'https://example.com/a');
});
