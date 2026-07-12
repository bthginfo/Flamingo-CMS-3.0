import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { rendererContactRequestHeaders } from './renderer-contact-client-security';

const routeSource = readFileSync(
  new URL('../app/admin/api/support-request/route.ts', import.meta.url),
  'utf8',
);
const clientSource = readFileSync(
  new URL('../app/admin/functions/functions-client.tsx', import.meta.url),
  'utf8',
);

test('admin support authenticates and checks origin before parsing the request body', () => {
  const auth = routeSource.indexOf('getWritableSession()');
  const origin = routeSource.indexOf('isTrustedRendererContactOrigin(request)');
  const body = routeSource.indexOf('readBoundedRendererContactJson(request');
  assert.ok(auth >= 0 && origin > auth && body > origin);
});

test('admin support persists an idempotency claim and uses a fixed Flamingo recipient', () => {
  assert.match(routeSource, /insert\(crmEmailDeliveries\)/);
  assert.match(routeSource, /insert\(inquiries\)/);
  assert.match(routeSource, /address:\s*'hello@flamingomedia\.online'/);
});

test('admin support client uses the same-origin endpoint and a stable idempotency header', () => {
  assert.match(clientSource, /fetch\('\/admin\/api\/support-request'/);
  assert.doesNotMatch(clientSource, /https:\/\/www\.flamingomedia\.online\/api\/contact/);
  const key = '123e4567-e89b-42d3-a456-426614174000';
  assert.deepEqual(rendererContactRequestHeaders(key), {
    'Content-Type': 'application/json',
    'Idempotency-Key': key,
  });
});
