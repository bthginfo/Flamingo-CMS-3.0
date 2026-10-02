import assert from 'node:assert/strict';
import test from 'node:test';
import { ApiRequestBodyError, readApiJsonObject } from './api-request-body';

const request = (body: string, headers: Record<string, string> = {}) => new Request('https://example.test/api', {
  method: 'POST', body, headers: { 'content-type': 'application/json', ...headers },
});

test('AI requests reject malformed JSON and non-object envelopes as client errors', async () => {
  for (const body of ['null', '[]', 'false', '42', '"string"', '{broken']) {
    await assert.rejects(readApiJsonObject(request(body)), (error: unknown) => error instanceof ApiRequestBodyError && error.status === 400);
  }
  assert.deepEqual(await readApiJsonObject(request('{"title":"Änderung"}')), { title: 'Änderung' });
});

test('AI body limits count actual UTF-8 bytes instead of trusting Content-Length', async () => {
  await assert.rejects(readApiJsonObject(request('{"value":"€€€"}', { 'content-length': '1' }), 15),
    (error: unknown) => error instanceof ApiRequestBodyError && error.status === 413);
  await assert.rejects(readApiJsonObject(request('{"x":1}', { 'content-type': 'text/html' })),
    (error: unknown) => error instanceof ApiRequestBodyError && error.status === 415);
});

test('chunked bodies are bounded and the stream is cancelled on overflow', async () => {
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) { controller.enqueue(new Uint8Array(10)); },
    cancel() { cancelled = true; },
  });
  const req = new Request('https://example.test/api', { method: 'POST', body: stream, duplex: 'half' } as RequestInit);
  await assert.rejects(readApiJsonObject(req, 15), (error: unknown) => error instanceof ApiRequestBodyError && error.code === 'BODY_TOO_LARGE');
  assert.equal(cancelled, true);
});
