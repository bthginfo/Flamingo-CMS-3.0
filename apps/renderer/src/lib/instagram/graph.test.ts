import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchUserMedia } from './graph';

test('malformed successful media responses cannot masquerade as an empty feed', async () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({}), { status: 200 });
  try {
    await assert.rejects(fetchUserMedia('test-token'), /expected a data array/);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test('a valid empty media feed remains a deliberate empty result', async () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ data: [] }), { status: 200 });
  try {
    assert.deepEqual(await fetchUserMedia('test-token'), []);
  } finally {
    globalThis.fetch = previousFetch;
  }
});
