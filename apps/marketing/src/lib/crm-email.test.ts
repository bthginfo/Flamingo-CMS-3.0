import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { NextRequest } from 'next/server';
import {
  classifyCrmSmtpSendError,
  createCrmEmailPostHandler,
  MAX_CRM_EMAIL_ATTACHMENT_BYTES,
  MAX_CRM_EMAIL_REQUEST_BYTES,
  type CrmEmailHandlerDependencies,
  type CrmEmailMessage,
} from './crm-email';
import { createCrmApiUnauthorizedResponse } from './crm-api-auth';
import { resolveCrmSmtpConfiguration } from './crm-smtp';
import { POST as legacyPublicPost } from '../app/api/send-lead-email/route';
import { middleware } from '../middleware';
import { hasValidCrmClaims } from './crm-session-claims';
import { createCrmToken } from './session';
import {
  classifyCrmEmailDelivery,
  CRM_EMAIL_DELIVERY_STALE_AFTER_MS,
  normalizeCrmEmailDeliveryErrorCode,
} from './crm-email-store';
import { createCrmEmailActionId, withCrmEmailIdempotency } from './crm-email-client-security';
import {
  contactRateLimitRules,
  crmEmailRateLimitRules,
  crmLoginRateLimitRules,
} from './marketing-rate-policies';

const ENTITY_ID = '6d10ab45-8183-4c69-9ee5-5bfb045739e3';
const IDEMPOTENCY_KEY = '7cb97100-533a-4e2f-b6be-f118440aee71';
const ENDPOINT = 'https://www.flamingomedia.online/crm/api/send-email';

function jsonRequest(body: unknown) {
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

function formRequest(form: FormData) {
  return new Request(ENDPOINT, {
    method: 'POST',
    headers: {
      Origin: 'https://www.flamingomedia.online',
      'Idempotency-Key': IDEMPOTENCY_KEY,
    },
    body: form,
  });
}

function dependencies(overrides: Partial<CrmEmailHandlerDependencies> = {}) {
  return {
    verifySession: async () => true,
    loadEntity: async () => ({ company: 'Muster GmbH', email: 'kontakt@muster.example' }),
    sendMail: async () => undefined,
    checkRateLimits: async () => ({ allowed: true, limit: 100, remaining: 99, retryAfterSeconds: 0 }),
    inspectDelivery: async () => 'available' as const,
    claimDelivery: async () => 'acquired' as const,
    markDeliverySent: async () => undefined,
    markDeliveryFailed: async () => undefined,
    markDeliveryUncertain: async () => undefined,
    now: () => new Date('2026-07-11T12:00:00.000Z'),
    ...overrides,
  } satisfies CrmEmailHandlerDependencies;
}

describe('CRM email handler security contract', () => {
  it('returns a no-store JSON 401 for unauthenticated CRM API requests', async () => {
    const response = createCrmApiUnauthorizedResponse('/crm/api/send-email');
    assert.ok(response);
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), { error: 'Nicht autorisiert.' });
    assert.equal(createCrmApiUnauthorizedResponse('/crm/leads'), null);
  });

  it('wires the JSON 401 response into the actual CRM middleware', async () => {
    const response = await middleware(new NextRequest(ENDPOINT, { method: 'POST' }));
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), { error: 'Nicht autorisiert.' });
  });

  it('derives the same domain-separated CRM key in session signing and middleware', async () => {
    const previousCrmSecret = process.env.CRM_JWT_SECRET;
    const previousAdminSecret = process.env.ADMIN_JWT_SECRET;
    delete process.env.CRM_JWT_SECRET;
    process.env.ADMIN_JWT_SECRET = 'a'.repeat(48);
    try {
      const token = await createCrmToken();
      const response = await middleware(new NextRequest(ENDPOINT, {
        method: 'POST',
        headers: { Cookie: `flamingo_crm_session=${token}` },
      }));
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('x-middleware-next'), '1');
    } finally {
      if (previousCrmSecret === undefined) delete process.env.CRM_JWT_SECRET;
      else process.env.CRM_JWT_SECRET = previousCrmSecret;
      if (previousAdminSecret === undefined) delete process.env.ADMIN_JWT_SECRET;
      else process.env.ADMIN_JWT_SECRET = previousAdminSecret;
    }
  });

  it('keeps the legacy public relay endpoint disabled', async () => {
    const response = await legacyPublicPost();
    assert.equal(response.status, 401);
  });

  it('rejects anonymous requests before parsing or sending', async () => {
    let entityLoaded = false;
    let sent = false;
    const handler = createCrmEmailPostHandler(dependencies({
      verifySession: async () => false,
      loadEntity: async () => {
        entityLoaded = true;
        return null;
      },
      sendMail: async () => {
        sent = true;
      },
    }));

    const response = await handler(jsonRequest({
      purpose: 'lead_outreach',
      entityId: ENTITY_ID,
      body: 'Hallo',
    }));

    assert.equal(response.status, 401);
    assert.equal(entityLoaded, false);
    assert.equal(sent, false);
  });

  it('rejects caller-controlled recipient, subject and raw HTML fields', async () => {
    let sent = false;
    const handler = createCrmEmailPostHandler(dependencies({
      sendMail: async () => {
        sent = true;
      },
    }));

    const response = await handler(jsonRequest({
      purpose: 'lead_outreach',
      entityId: ENTITY_ID,
      body: 'Legitimer Klartext',
      to: 'attacker@example.com',
      subject: 'Caller controlled',
      html: '<img src=x onerror=alert(1)>',
    }));

    assert.equal(response.status, 400);
    assert.equal(sent, false);
  });

  it('loads recipient and subject server-side and escapes message HTML', async () => {
    const deliveries: CrmEmailMessage[] = [];
    const handler = createCrmEmailPostHandler(dependencies({
      loadEntity: async (purpose, entityId) => {
        assert.equal(purpose, 'lead_outreach');
        assert.equal(entityId, ENTITY_ID);
        return { company: 'Muster & Partner', email: 'crm-recipient@muster.example' };
      },
      sendMail: async message => {
        deliveries.push(message);
      },
    }));

    const response = await handler(jsonRequest({
      purpose: 'lead_outreach',
      entityId: ENTITY_ID,
      body: 'Hallo <script>alert("x")</script>\nZweite Zeile',
    }));

    assert.equal(response.status, 200);
    const delivered = deliveries[0];
    assert.ok(delivered);
    assert.equal(delivered.to, 'crm-recipient@muster.example');
    assert.equal(delivered.subject, 'Professioneller Webauftritt für Muster & Partner');
    assert.match(delivered.html, /Hallo &lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt;<br>Zweite Zeile/);
    assert.doesNotMatch(delivered.html, /<script>/);
  });

  it('accepts a genuine allowlisted attachment for a customer update', async () => {
    const deliveries: CrmEmailMessage[] = [];
    const form = new FormData();
    form.set('purpose', 'customer_update');
    form.set('entityId', ENTITY_ID);
    form.set('body', 'Das PDF finden Sie im Anhang.');
    form.set('attachment', new File([Buffer.from('%PDF-1.7\n%%EOF')], 'angebot.pdf', { type: 'application/pdf' }));

    const handler = createCrmEmailPostHandler(dependencies({
      sendMail: async message => {
        deliveries.push(message);
      },
    }));
    const response = await handler(formRequest(form));

    assert.equal(response.status, 200);
    const delivered = deliveries[0];
    assert.ok(delivered);
    assert.equal(delivered.attachments.length, 1);
    assert.equal(delivered.attachments[0]?.filename, 'angebot.pdf');
    assert.equal(delivered.attachments[0]?.contentType, 'application/pdf');
  });

  it('rejects disallowed, spoofed and oversized attachments', async () => {
    const handler = createCrmEmailPostHandler(dependencies());

    const invalidType = new FormData();
    invalidType.set('purpose', 'customer_update');
    invalidType.set('entityId', ENTITY_ID);
    invalidType.set('body', 'Anhang');
    invalidType.set('attachment', new File(['hello'], 'payload.html', { type: 'text/html' }));
    assert.equal((await handler(formRequest(invalidType))).status, 400);

    const spoofedPdf = new FormData();
    spoofedPdf.set('purpose', 'customer_update');
    spoofedPdf.set('entityId', ENTITY_ID);
    spoofedPdf.set('body', 'Anhang');
    spoofedPdf.set('attachment', new File(['not a pdf'], 'payload.pdf', { type: 'application/pdf' }));
    assert.equal((await handler(formRequest(spoofedPdf))).status, 400);

    const oversized = new FormData();
    oversized.set('purpose', 'customer_update');
    oversized.set('entityId', ENTITY_ID);
    oversized.set('body', 'Anhang');
    oversized.set('attachment', new File(
      [Buffer.alloc(MAX_CRM_EMAIL_ATTACHMENT_BYTES + 1)],
      'zu-gross.pdf',
      { type: 'application/pdf' },
    ));
    assert.equal((await handler(formRequest(oversized))).status, 413);
  });

  it('rejects cross-origin requests even with a valid session', async () => {
    let sent = false;
    const handler = createCrmEmailPostHandler(dependencies({
      sendMail: async () => {
        sent = true;
      },
    }));
    const request = jsonRequest({ purpose: 'lead_outreach', entityId: ENTITY_ID, body: 'Hallo' });
    request.headers.set('Origin', 'https://attacker.example');

    const response = await handler(request);
    assert.equal(response.status, 403);
    assert.equal(sent, false);
  });

  it('rejects requests without an Origin header', async () => {
    let sent = false;
    const handler = createCrmEmailPostHandler(dependencies({
      sendMail: async () => {
        sent = true;
      },
    }));
    const request = jsonRequest({ purpose: 'lead_outreach', entityId: ENTITY_ID, body: 'Hallo' });
    request.headers.delete('Origin');

    const response = await handler(request);
    assert.equal(response.status, 403);
    assert.equal(sent, false);
  });

  it('uses a safe subject fallback when the stored company is blank', async () => {
    const deliveries: CrmEmailMessage[] = [];
    const handler = createCrmEmailPostHandler(dependencies({
      loadEntity: async () => ({ company: '  \r\n ', email: 'kontakt@muster.example' }),
      sendMail: async message => {
        deliveries.push(message);
      },
    }));

    const response = await handler(jsonRequest({
      purpose: 'lead_outreach',
      entityId: ENTITY_ID,
      body: 'Hallo',
    }));

    assert.equal(response.status, 200);
    assert.equal(deliveries[0]?.subject, 'Professioneller Webauftritt für Ihr Unternehmen');
  });

  it('requires an idempotency key before parsing or sending', async () => {
    let sent = false;
    const request = jsonRequest({ purpose: 'lead_outreach', entityId: ENTITY_ID, body: 'Hallo' });
    request.headers.delete('Idempotency-Key');
    const handler = createCrmEmailPostHandler(dependencies({
      sendMail: async () => { sent = true; },
    }));

    const response = await handler(request);
    assert.equal(response.status, 400);
    assert.equal(sent, false);
  });

  it('enforces server-side rate limits before claiming or sending', async () => {
    let claimed = false;
    let sent = false;
    const handler = createCrmEmailPostHandler(dependencies({
      checkRateLimits: async () => ({ allowed: false, limit: 5, remaining: 0, retryAfterSeconds: 120 }),
      claimDelivery: async () => { claimed = true; return 'acquired'; },
      sendMail: async () => { sent = true; },
    }));

    const response = await handler(jsonRequest({ purpose: 'lead_outreach', entityId: ENTITY_ID, body: 'Hallo' }));
    assert.equal(response.status, 429);
    assert.equal(response.headers.get('retry-after'), '120');
    assert.equal(claimed, false);
    assert.equal(sent, false);
  });

  it('deduplicates an already-sent delivery before consuming limits or sending again', async () => {
    let limited = false;
    let sent = false;
    const handler = createCrmEmailPostHandler(dependencies({
      inspectDelivery: async () => 'already_sent',
      checkRateLimits: async () => { limited = true; throw new Error('must not run'); },
      sendMail: async () => { sent = true; },
    }));

    const response = await handler(jsonRequest({ purpose: 'lead_outreach', entityId: ENTITY_ID, body: 'Hallo' }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true, deduplicated: true });
    assert.equal(limited, false);
    assert.equal(sent, false);
  });

  it('records a definitive SMTP rejection as retryable without exposing provider internals', async () => {
    const failures: Array<{ key: string; code: string }> = [];
    const uncertain: Array<{ key: string; code: string }> = [];
    const handler = createCrmEmailPostHandler(dependencies({
      sendMail: async () => {
        throw Object.assign(new Error('SMTP credentials and internals'), {
          responseCode: 550,
          code: 'EENVELOPE',
        });
      },
      markDeliveryFailed: async (key, code) => { failures.push({ key, code }); },
      markDeliveryUncertain: async (key, code) => { uncertain.push({ key, code }); },
    }));

    const response = await handler(jsonRequest({ purpose: 'lead_outreach', entityId: ENTITY_ID, body: 'Hallo' }));
    assert.equal(response.status, 500);
    assert.deepEqual(failures, [{ key: IDEMPOTENCY_KEY, code: 'crm_smtp_rejected' }]);
    assert.deepEqual(uncertain, []);
    assert.deepEqual(await response.json(), { error: 'E-Mail konnte nicht gesendet werden.' });
  });

  it('persists timeout, socket and generic SMTP throws as uncertain', async () => {
    const injectedErrors: unknown[] = [
      Object.assign(new Error('timeout after DATA'), { code: 'ETIMEDOUT', command: 'DATA' }),
      Object.assign(new Error('socket closed'), { code: 'ECONNRESET' }),
      new Error('provider internals and credentials'),
    ];

    for (const injectedError of injectedErrors) {
      const failures: Array<{ key: string; code: string }> = [];
      const uncertain: Array<{ key: string; code: string }> = [];
      const handler = createCrmEmailPostHandler(dependencies({
        sendMail: async () => { throw injectedError; },
        markDeliveryFailed: async (key, code) => { failures.push({ key, code }); },
        markDeliveryUncertain: async (key, code) => { uncertain.push({ key, code }); },
      }));

      const response = await handler(jsonRequest({ purpose: 'lead_outreach', entityId: ENTITY_ID, body: 'Hallo' }));
      assert.equal(response.status, 500);
      assert.deepEqual(failures, []);
      assert.deepEqual(uncertain, [{ key: IDEMPOTENCY_KEY, code: 'crm_smtp_uncertain' }]);
      assert.deepEqual(await response.json(), { error: 'E-Mail konnte nicht gesendet werden.' });
    }
  });

  it('does not trust forwarded host headers or a cross-scheme Origin', async () => {
    const handler = createCrmEmailPostHandler(dependencies());
    const spoofed = jsonRequest({ purpose: 'lead_outreach', entityId: ENTITY_ID, body: 'Hallo' });
    spoofed.headers.set('Origin', 'https://attacker.example');
    spoofed.headers.set('X-Forwarded-Host', 'attacker.example');
    assert.equal((await handler(spoofed)).status, 403);

    const crossScheme = jsonRequest({ purpose: 'lead_outreach', entityId: ENTITY_ID, body: 'Hallo' });
    crossScheme.headers.set('Origin', 'http://www.flamingomedia.online');
    assert.equal((await handler(crossScheme)).status, 403);
  });

  it('enforces the actual body size when Content-Length is missing', async () => {
    const request = new Request(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://www.flamingomedia.online',
        'Idempotency-Key': IDEMPOTENCY_KEY,
      },
      body: JSON.stringify({
        purpose: 'lead_outreach',
        entityId: ENTITY_ID,
        body: 'x'.repeat(MAX_CRM_EMAIL_REQUEST_BYTES + 1),
      }),
    });
    request.headers.delete('Content-Length');
    const response = await createCrmEmailPostHandler(dependencies())(request);
    assert.equal(response.status, 413);
  });

  it('includes attachment bytes in the idempotency request fingerprint', async () => {
    const hashes: string[] = [];
    const handler = createCrmEmailPostHandler(dependencies({
      claimDelivery: async input => { hashes.push(input.requestHash); return 'acquired'; },
    }));
    for (const marker of ['first', 'second']) {
      const form = new FormData();
      form.set('purpose', 'customer_update');
      form.set('entityId', ENTITY_ID);
      form.set('body', 'Gleicher Text');
      form.set('attachment', new File([`%PDF-1.7\n${marker}`], 'update.pdf', { type: 'application/pdf' }));
      assert.equal((await handler(formRequest(form))).status, 200);
    }
    assert.equal(hashes.length, 2);
    assert.notEqual(hashes[0], hashes[1]);
  });

  it('deduplicates uncertain deliveries before limits and blocks automatic resend', async () => {
    let limited = false;
    let claimed = false;
    let sent = false;
    const handler = createCrmEmailPostHandler(dependencies({
      inspectDelivery: async () => 'delivery_uncertain',
      checkRateLimits: async () => { limited = true; throw new Error('must not run'); },
      claimDelivery: async () => { claimed = true; return 'acquired'; },
      sendMail: async () => { sent = true; },
    }));
    const response = await handler(jsonRequest({ purpose: 'lead_outreach', entityId: ENTITY_ID, body: 'Hallo' }));
    assert.equal(response.status, 409);
    assert.equal((await response.json() as { code?: string }).code, 'DELIVERY_UNCERTAIN');
    assert.equal(limited, false);
    assert.equal(claimed, false);
    assert.equal(sent, false);
  });
});

describe('CRM SMTP configuration', () => {
  it('classifies only explicit SMTP 4xx/5xx replies as retryable rejection', () => {
    assert.equal(classifyCrmSmtpSendError({ responseCode: 450, code: 'EENVELOPE' }), 'rejected');
    assert.equal(classifyCrmSmtpSendError({ responseCode: 550, code: 'EENVELOPE' }), 'rejected');
    assert.equal(classifyCrmSmtpSendError({ responseCode: '550', code: 'EENVELOPE' }), 'uncertain');
    assert.equal(classifyCrmSmtpSendError({ responseCode: 250, code: 'ETIMEDOUT' }), 'uncertain');
    assert.equal(classifyCrmSmtpSendError({ code: 'ETIMEDOUT' }), 'uncertain');
    assert.equal(classifyCrmSmtpSendError({ code: 'ECONNECTION' }), 'uncertain');
    assert.equal(classifyCrmSmtpSendError(new Error('socket closed')), 'uncertain');
  });

  it('normalizes persisted delivery codes through an allowlist', () => {
    assert.equal(normalizeCrmEmailDeliveryErrorCode(' CRM_SMTP_REJECTED '), 'crm_smtp_rejected');
    assert.equal(normalizeCrmEmailDeliveryErrorCode('smtp response: 550 credentials=secret'), 'unknown');
    assert.equal(normalizeCrmEmailDeliveryErrorCode({ code: 'crm_smtp_uncertain' }), 'unknown');
  });

  it('keeps attachment and total request limits below the platform ceiling', () => {
    assert.equal(MAX_CRM_EMAIL_ATTACHMENT_BYTES, 3 * 1024 * 1024);
    assert.equal(MAX_CRM_EMAIL_REQUEST_BYTES, 4 * 1024 * 1024);
    assert.ok(MAX_CRM_EMAIL_REQUEST_BYTES - MAX_CRM_EMAIL_ATTACHMENT_BYTES >= 512 * 1024);
  });

  it('selects one complete platform profile and requires STARTTLS off port 465', () => {
    const configuration = resolveCrmSmtpConfiguration({
      PLATFORM_SMTP_HOST: 'smtp.example.com',
      PLATFORM_SMTP_PORT: '587',
      PLATFORM_SMTP_USER: 'mailer@example.com',
      PLATFORM_SMTP_PASS: 'secret',
      PLATFORM_SMTP_FROM: 'hello@example.com',
      PLATFORM_SMTP_SECURE: 'false',
    });

    assert.equal(configuration.profile, 'PLATFORM_SMTP');
    assert.equal(configuration.host, 'smtp.example.com');
    assert.equal(configuration.secure, false);
    assert.equal(configuration.requireTLS, true);
    assert.equal(configuration.fromAddress, 'hello@example.com');
  });

  it('uses implicit TLS only for a complete port-465 profile', () => {
    const configuration = resolveCrmSmtpConfiguration({
      SMTP_HOST: 'smtp.example.com',
      SMTP_PORT: '465',
      SMTP_USER: 'mailer@example.com',
      SMTP_PASS: 'secret',
      SMTP_SECURE: 'true',
    });

    assert.equal(configuration.profile, 'SMTP');
    assert.equal(configuration.secure, true);
    assert.equal(configuration.requireTLS, false);
  });

  it('rejects incomplete-only and TLS-inconsistent profiles', () => {
    assert.throws(() => resolveCrmSmtpConfiguration({
      SMTP_HOST: 'smtp.example.com',
    }), /SMTP_USER fehlt/);

    assert.throws(() => resolveCrmSmtpConfiguration({
      SMTP_HOST: 'smtp.example.com',
      SMTP_PORT: '587',
      SMTP_USER: 'mailer@example.com',
      SMTP_PASS: 'secret',
      SMTP_SECURE: 'true',
    }), /passt nicht zum Port/);
  });

  it('ignores a partial SMTP profile when a complete platform fallback exists', () => {
    const configuration = resolveCrmSmtpConfiguration({
      SMTP_HOST: 'smtp.partial.example',
      PLATFORM_SMTP_HOST: 'smtp.platform.example',
      PLATFORM_SMTP_USER: 'platform@example.com',
      PLATFORM_SMTP_PASS: 'platform-secret',
      PLATFORM_SMTP_FROM: 'hello@example.com',
    });

    assert.equal(configuration.profile, 'PLATFORM_SMTP');
    assert.equal(configuration.host, 'smtp.platform.example');
    assert.equal(configuration.fromAddress, 'hello@example.com');
  });

  it('selects a complete SMTP profile atomically without borrowing platform fields', () => {
    const configuration = resolveCrmSmtpConfiguration({
      SMTP_HOST: 'smtp.primary.example',
      SMTP_USER: 'primary@example.com',
      SMTP_PASS: 'primary-secret',
      PLATFORM_SMTP_HOST: 'smtp.platform.example',
      PLATFORM_SMTP_USER: 'platform@example.com',
      PLATFORM_SMTP_PASS: 'platform-secret',
      PLATFORM_SMTP_FROM: 'platform-from@example.com',
    });

    assert.equal(configuration.profile, 'SMTP');
    assert.equal(configuration.host, 'smtp.primary.example');
    assert.equal(configuration.user, 'primary@example.com');
    assert.equal(configuration.fromAddress, 'primary@example.com');
  });

  it('rejects malformed SMTP hosts and sender addresses', () => {
    assert.throws(() => resolveCrmSmtpConfiguration({
      SMTP_HOST: 'smtp.example.com\r\nattacker',
      SMTP_USER: 'mailer@example.com',
      SMTP_PASS: 'secret',
    }), /HOST ist ungültig/);

    assert.throws(() => resolveCrmSmtpConfiguration({
      SMTP_HOST: 'smtp.example.com',
      SMTP_USER: 'mailer-user',
      SMTP_PASS: 'secret',
      SMTP_FROM: 'Flamingo <hello@example.com>',
    }), /FROM muss eine gültige/);
  });
});

describe('CRM session claim contract', () => {
  it('requires an unexpired numeric expiration claim and the CRM role', () => {
    assert.equal(hasValidCrmClaims({ role: 'crm_admin', exp: 2_000 }, 1_000), true);
    assert.equal(hasValidCrmClaims({ role: 'crm_admin' }, 1_000), false);
    assert.equal(hasValidCrmClaims({ role: 'crm_admin', exp: 1_000 }, 1_000), false);
    assert.equal(hasValidCrmClaims({ role: 'crm_admin', exp: '2000' }, 1_000), false);
    assert.equal(hasValidCrmClaims({ role: 'admin', exp: 2_000 }, 1_000), false);
  });
});

describe('Marketing abuse-prevention policies', () => {
  it('checks narrow identities before tenant or global rate-limit buckets', () => {
    assert.deepEqual(contactRateLimitRules('203.0.113.1', 'person@example.com').map(rule => rule.scope), [
      'contact_email', 'contact_ip', 'contact_global',
    ]);
    assert.deepEqual(crmLoginRateLimitRules('203.0.113.1').map(rule => rule.scope), [
      'crm_login_ip', 'crm_login_global',
    ]);
    assert.deepEqual(crmEmailRateLimitRules('203.0.113.1', 'lead_outreach', ENTITY_ID).map(rule => rule.scope), [
      'crm_email_entity', 'crm_email_ip', 'crm_email_global',
    ]);
  });

  it('classifies stale sends as uncertain and never as automatically acquired', () => {
    const request = { purpose: 'lead_outreach' as const, entityId: ENTITY_ID, requestHash: 'a'.repeat(64) };
    const now = new Date('2026-07-12T12:00:00.000Z');
    const stale = {
      ...request,
      status: 'sending',
      updatedAt: new Date(now.getTime() - CRM_EMAIL_DELIVERY_STALE_AFTER_MS - 1),
    };
    assert.equal(classifyCrmEmailDelivery(stale, request, now), 'stale_sending');
    assert.equal(classifyCrmEmailDelivery({ ...stale, status: 'uncertain' }, request, now), 'delivery_uncertain');
  });

  it('keeps one idempotency key stable for retries of the same UI action', () => {
    const actionId = createCrmEmailActionId();
    const firstAttempt = withCrmEmailIdempotency(actionId, { 'Content-Type': 'application/json' });
    const retry = withCrmEmailIdempotency(actionId, { 'Content-Type': 'application/json' });
    assert.deepEqual(retry, firstAttempt);
    assert.equal(firstAttempt['Idempotency-Key'], actionId);
  });
});
