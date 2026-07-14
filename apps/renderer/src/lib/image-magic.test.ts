import assert from 'node:assert/strict';
import test from 'node:test';
import { detectImageMime } from './image-magic';

test('image signatures are detected independently from filenames and headers', () => {
  assert.equal(detectImageMime(Uint8Array.from([0xff, 0xd8, 0xff, 0x00])), 'image/jpeg');
  assert.equal(detectImageMime(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), 'image/png');
  assert.equal(detectImageMime(new TextEncoder().encode('GIF89a')), 'image/gif');
  assert.equal(detectImageMime(new TextEncoder().encode('RIFF0000WEBP')), 'image/webp');
  assert.equal(detectImageMime(new TextEncoder().encode('0000ftypavif')), 'image/avif');
  assert.equal(detectImageMime(new TextEncoder().encode('<script>alert(1)</script>')), null);
});
