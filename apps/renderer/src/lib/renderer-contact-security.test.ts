import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  classifyRendererContactIdempotency,
  fingerprintRendererContactSubmission,
  isMissingRendererRateLimitStore,
  isTrustedRendererContactOrigin,
  MAX_RENDERER_CONTACT_REQUEST_BYTES,
  readBoundedRendererContactJson,
  rendererAutoResponseRateRules,
  rendererContactRateRules,
  RendererContactBodyTooLargeError,
} from './renderer-contact-security';
import {
  createRendererContactActionIdentity,
  createRendererContactActionId,
  rendererContactRequestHeaders,
} from './renderer-contact-client-security';
import { normalizeSmtpConfig, pinPublicSmtpHost, resolveRendererPlatformSmtpProfiles } from './smtp';

const ENDPOINT = 'https://tenant.example/api/contact';
const TENANT_ID = '6d10ab45-8183-4c69-9ee5-5bfb045739e3';
const contactRouteSource = readFileSync(new URL('../app/api/contact/route.ts', import.meta.url), 'utf8');

describe('renderer contact security', () => {
  it('bounds streamed request bytes without trusting Content-Length', async () => {
    const request = new Request(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'x'.repeat(MAX_RENDERER_CONTACT_REQUEST_BYTES + 1) }),
    });
    request.headers.delete('Content-Length');
    await assert.rejects(
      () => readBoundedRendererContactJson(request),
      RendererContactBodyTooLargeError,
    );
  });

  it('compares the full Origin and ignores spoofed forwarded hosts', () => {
    const valid = new Request(ENDPOINT, { headers: { Origin: 'https://tenant.example' } });
    assert.equal(isTrustedRendererContactOrigin(valid, []), true);

    const spoofed = new Request(ENDPOINT, {
      headers: { Origin: 'https://attacker.example', 'X-Forwarded-Host': 'attacker.example' },
    });
    assert.equal(isTrustedRendererContactOrigin(spoofed, []), false);

    const crossScheme = new Request(ENDPOINT, { headers: { Origin: 'http://tenant.example' } });
    assert.equal(isTrustedRendererContactOrigin(crossScheme, []), false);
  });

  it('checks unique e-mail/IP identities before tenant and global caps', () => {
    assert.deepEqual(rendererContactRateRules(TENANT_ID, '203.0.113.1', 'person@example.com').map(rule => rule.scope), [
      'renderer_contact_email',
      'renderer_contact_ip',
      'renderer_contact_tenant',
      'renderer_contact_global',
    ]);
    assert.deepEqual(rendererAutoResponseRateRules(TENANT_ID, '203.0.113.1', 'person@example.com').map(rule => rule.scope), [
      'renderer_autoresponse_email',
      'renderer_autoresponse_ip',
      'renderer_autoresponse_tenant',
      'renderer_autoresponse_global',
    ]);
    assert.equal(rendererAutoResponseRateRules(TENANT_ID, 'ip', 'person@example.com')[0]?.limit, 1);
  });

  it('recovers only from a missing persistent rate-limit table', () => {
    assert.equal(isMissingRendererRateLimitStore({ code: '42P01' }), true);
    assert.equal(isMissingRendererRateLimitStore({ cause: { code: '42P01' } }), true);
    assert.equal(isMissingRendererRateLimitStore({ code: '28P01' }), false);
    assert.equal(isMissingRendererRateLimitStore(new Error('database unavailable')), false);
  });

  it('keeps the browser idempotency key stable across retries of one action', () => {
    const actionId = createRendererContactActionId();
    assert.deepEqual(rendererContactRequestHeaders(actionId), rendererContactRequestHeaders(actionId));
    assert.equal(rendererContactRequestHeaders(actionId)['Idempotency-Key'], actionId);
  });

  it('rotates the browser action key only when the submitted payload changes', () => {
    const first = createRendererContactActionIdentity({ email: 'a@example.com', message: 'Hallo' });
    const retry = createRendererContactActionIdentity({ email: 'a@example.com', message: 'Hallo' }, first);
    const edited = createRendererContactActionIdentity({ email: 'a@example.com', message: 'Neu' }, retry);
    assert.equal(retry.idempotencyKey, first.idempotencyKey);
    assert.notEqual(edited.idempotencyKey, first.idempotencyKey);
  });

  it('deduplicates persisted retries before consuming rate-limit buckets', () => {
    assert.ok(
      contactRouteSource.indexOf('const [existingSubmission]')
        < contactRouteSource.indexOf('denied = await consumeRendererContactRateRules'),
    );
  });

  it('deduplicates only an identical submission fingerprint', () => {
    const first = fingerprintRendererContactSubmission({ name: 'Ada', message: 'Hallo' });
    const same = fingerprintRendererContactSubmission({ name: 'Ada', message: 'Hallo' });
    const changed = fingerprintRendererContactSubmission({ name: 'Ada', message: 'Anders' });
    assert.equal(classifyRendererContactIdempotency(first, same), 'duplicate');
    assert.equal(classifyRendererContactIdempotency(first, changed), 'conflict');
    assert.equal(classifyRendererContactIdempotency(null, first), 'conflict');
  });

  it('requires a single valid sender and enforced TLS mode', () => {
    const startTls = normalizeSmtpConfig({
      host: 'smtp.example.com', port: 587, user: 'mailer', pass: 'secret', from: 'hello@example.com',
    });
    assert.ok(startTls);
    assert.equal(startTls.secure, false);
    assert.equal(startTls.requireTLS, true);

    const implicitTls = normalizeSmtpConfig({
      host: 'smtp.example.com', port: 465, user: 'mailer', pass: 'secret', from: 'hello@example.com',
    });
    assert.ok(implicitTls);
    assert.equal(implicitTls.secure, true);
    assert.equal(implicitTls.requireTLS, false);

    assert.equal(normalizeSmtpConfig({
      host: 'smtp.example.com', port: 587, user: 'mailer', pass: 'secret', from: 'Name <hello@example.com>',
    }), null);
  });

  it('keeps complete platform SMTP preferred and supports the complete legacy profile', () => {
    const profiles = resolveRendererPlatformSmtpProfiles({
      PLATFORM_SMTP_HOST: 'smtp.platform.example',
      PLATFORM_SMTP_USER: 'platform@example.com',
      PLATFORM_SMTP_PASS: 'platform-secret',
      PLATFORM_SMTP_FROM: 'platform@example.com',
      SMTP_HOST: 'smtp.legacy.example',
      SMTP_USER: 'legacy@example.com',
      SMTP_PASS: 'legacy-secret',
      SMTP_FROM: 'legacy@example.com',
    });
    assert.deepEqual(profiles.map(profile => profile.host), [
      'smtp.platform.example',
      'smtp.legacy.example',
    ]);

    const legacyFallback = resolveRendererPlatformSmtpProfiles({
      PLATFORM_SMTP_HOST: 'smtp.partial.example',
      SMTP_HOST: 'smtp.legacy.example',
      SMTP_USER: 'legacy@example.com',
      SMTP_PASS: 'legacy-secret',
      SMTP_FROM: 'legacy@example.com',
    });
    assert.equal(legacyFallback[0]?.host, 'smtp.legacy.example');
  });

  it('rejects tenant SMTP connections to loopback and private network targets', async () => {
    for (const host of ['127.0.0.1', '10.0.0.5', '169.254.169.254', '192.168.1.10', 'localhost']) {
      const configuration = normalizeSmtpConfig({
        host, port: 587, user: 'mailer', pass: 'secret', from: 'hello@example.com',
      });
      assert.ok(configuration);
      assert.equal(await pinPublicSmtpHost(configuration), null);
    }
  });
});
