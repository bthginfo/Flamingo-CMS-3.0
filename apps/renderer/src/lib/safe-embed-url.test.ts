import assert from 'node:assert/strict';
import test from 'node:test';
import { safeEmbedUrl, safeMapEmbedUrl } from './safe-embed-url';

test('embed URLs require HTTPS and an allowlisted provider host', () => {
  assert.equal(safeMapEmbedUrl('javascript:alert(1)'), '');
  assert.equal(safeMapEmbedUrl('https://evil.example/embed'), '');
  assert.match(safeMapEmbedUrl('https://www.google.com/maps/embed?pb=1'), /^https:\/\/www\.google\.com/);
  assert.match(safeMapEmbedUrl('https://www.openstreetmap.org/export/embed.html'), /^https:\/\/www\.openstreetmap\.org/);
  assert.equal(safeEmbedUrl('https://sub.example.com/widget', ['*.example.com']), 'https://sub.example.com/widget');
  assert.equal(safeEmbedUrl('https://example.com.evil.test/widget', ['*.example.com']), null);
  assert.equal(safeEmbedUrl('https://user:pass@example.com/widget', ['example.com']), null);
});
