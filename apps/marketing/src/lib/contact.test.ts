import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createContactPostHandler,
  MAX_CONTACT_REQUEST_BYTES,
  type ContactHandlerDependencies,
} from './contact';
import { contactRequestHeaders, createContactActionIdentity } from './contact-client-security';

const ENDPOINT = 'https://www.flamingomedia.online/api/contact';
const IDEMPOTENCY_KEY = '7cb97100-533a-4e2f-b6be-f118440aee71';

function contactRequest(body: unknown) {
  return new Request(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://www.flamingomedia.online',
      'Idempotency-Key': IDEMPOTENCY_KEY,
    },
    body: JSON.stringify(body),
  });
}

function dependencies(overrides: Partial<ContactHandlerDependencies> = {}) {
  return {
    inspectInquiry: async () => 'new' as const,
    checkRateLimits: async () => ({ allowed: true, limit: 5, remaining: 4, retryAfterSeconds: 0 }),
    saveInquiry: async () => ({ id: '6d10ab45-8183-4c69-9ee5-5bfb045739e3', state: 'created' as const }),
    sendNotification: async () => undefined,
    ...overrides,
  } satisfies ContactHandlerDependencies;
}

describe('public contact security contract', () => {
  it('awaits notification delivery after durable persistence', async () => {
    let saved = false;
    let notificationStarted = false;
    let releaseNotification!: () => void;
    const notificationGate = new Promise<void>(resolve => { releaseNotification = resolve; });
    const handler = createContactPostHandler(dependencies({
      saveInquiry: async () => { saved = true; return { id: '6d10ab45-8183-4c69-9ee5-5bfb045739e3', state: 'created' }; },
      sendNotification: async () => { notificationStarted = true; await notificationGate; },
    }));

    let settled = false;
    const responsePromise = handler(contactRequest({ name: 'Ada', email: 'ada@example.com', message: 'Hallo' }))
      .then(response => { settled = true; return response; });
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(saved, true);
    assert.equal(notificationStarted, true);
    assert.equal(settled, false);
    releaseNotification();
    assert.equal((await responsePromise).status, 200);
  });

  it('rate-limits before persistence and SMTP work', async () => {
    let saved = false;
    let sent = false;
    const handler = createContactPostHandler(dependencies({
      checkRateLimits: async () => ({ allowed: false, limit: 3, remaining: 0, retryAfterSeconds: 90 }),
      saveInquiry: async () => { saved = true; return { id: 'never', state: 'created' }; },
      sendNotification: async () => { sent = true; },
    }));
    const response = await handler(contactRequest({ name: 'Ada', email: 'ada@example.com' }));
    assert.equal(response.status, 429);
    assert.equal(response.headers.get('retry-after'), '90');
    assert.equal(saved, false);
    assert.equal(sent, false);
  });

  it('fails closed when the persistent limiter is unavailable', async () => {
    const handler = createContactPostHandler(dependencies({
      checkRateLimits: async () => { throw new Error('database unavailable'); },
    }));
    const response = await handler(contactRequest({ name: 'Ada', email: 'ada@example.com' }));
    assert.equal(response.status, 503);
  });

  it('bounds the actual body without trusting Content-Length', async () => {
    const request = contactRequest({
      name: 'Ada',
      email: 'ada@example.com',
      message: 'x'.repeat(MAX_CONTACT_REQUEST_BYTES + 1),
    });
    request.headers.delete('Content-Length');
    const response = await createContactPostHandler(dependencies())(request);
    assert.equal(response.status, 413);
  });

  it('does not trust a spoofed forwarded host for Origin validation', async () => {
    const request = contactRequest({ name: 'Ada', email: 'ada@example.com' });
    request.headers.set('Origin', 'https://attacker.example');
    request.headers.set('X-Forwarded-Host', 'attacker.example');
    const response = await createContactPostHandler(dependencies())(request);
    assert.equal(response.status, 403);
  });

  it('acknowledges honeypot submissions without consuming limits or sending', async () => {
    let limited = false;
    let saved = false;
    const handler = createContactPostHandler(dependencies({
      checkRateLimits: async () => { limited = true; throw new Error('must not run'); },
      saveInquiry: async () => { saved = true; return { id: 'never', state: 'created' }; },
    }));
    const response = await handler(contactRequest({
      name: 'Bot', email: 'bot@example.com', website: 'https://spam.example',
    }));
    assert.equal(response.status, 200);
    assert.equal(limited, false);
    assert.equal(saved, false);
  });

  it('keeps a saved inquiry successful when only notification delivery fails', async () => {
    let logged = false;
    const handler = createContactPostHandler(dependencies({
      sendNotification: async () => { throw new Error('SMTP down'); },
      onNotificationError: () => { logged = true; },
    }));
    const response = await handler(contactRequest({ name: 'Ada', email: 'ada@example.com' }));
    assert.equal(response.status, 202);
    assert.equal(logged, true);
    assert.deepEqual(await response.json(), { ok: true, notificationDelayed: true });
  });

  it('requires an idempotency key for non-honeypot submissions', async () => {
    let inspected = false;
    const request = contactRequest({ name: 'Ada', email: 'ada@example.com' });
    request.headers.delete('Idempotency-Key');
    const response = await createContactPostHandler(dependencies({
      inspectInquiry: async () => { inspected = true; return 'new'; },
    }))(request);
    assert.equal(response.status, 400);
    assert.equal(inspected, false);
  });

  it('deduplicates before consuming rate limits or sending another notification', async () => {
    let limited = false;
    let saved = false;
    let sent = false;
    const response = await createContactPostHandler(dependencies({
      inspectInquiry: async () => 'duplicate',
      checkRateLimits: async () => { limited = true; throw new Error('must not run'); },
      saveInquiry: async () => { saved = true; return { id: 'never', state: 'created' }; },
      sendNotification: async () => { sent = true; },
    }))(contactRequest({ name: 'Ada', email: 'ada@example.com' }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, deduplicated: true });
    assert.equal(limited, false);
    assert.equal(saved, false);
    assert.equal(sent, false);
  });

  it('handles a concurrent duplicate insert without sending twice', async () => {
    let sent = false;
    const response = await createContactPostHandler(dependencies({
      saveInquiry: async () => ({ id: IDEMPOTENCY_KEY, state: 'duplicate' }),
      sendNotification: async () => { sent = true; },
    }))(contactRequest({ name: 'Ada', email: 'ada@example.com' }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, deduplicated: true });
    assert.equal(sent, false);
  });

  it('rejects reusing a contact idempotency key for different content', async () => {
    const response = await createContactPostHandler(dependencies({
      inspectInquiry: async () => 'conflict',
    }))(contactRequest({ name: 'Ada', email: 'ada@example.com' }));
    assert.equal(response.status, 409);
  });

  it('keeps the client action id stable for retries and rotates it when payload changes', () => {
    const first = createContactActionIdentity({ name: 'Ada', email: 'ada@example.com' });
    const retry = createContactActionIdentity({ name: 'Ada', email: 'ada@example.com' }, first);
    const edited = createContactActionIdentity({ name: 'Ada', email: 'new@example.com' }, retry);
    assert.equal(retry.idempotencyKey, first.idempotencyKey);
    assert.notEqual(edited.idempotencyKey, first.idempotencyKey);
    assert.equal(contactRequestHeaders(first.idempotencyKey)['Idempotency-Key'], first.idempotencyKey);
  });
});
