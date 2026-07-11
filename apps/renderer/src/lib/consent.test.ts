import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CONSENT_VERSION,
  createStoredConsent,
  parseStoredConsent,
  undecidedConsent,
} from './consent';

test('stored consent round-trips with version and timestamp', () => {
  const stored = createStoredConsent({
    functional: true,
    analytics: false,
    marketing: true,
  }, 1_725_000_000_000);

  assert.deepEqual(parseStoredConsent(JSON.stringify(stored)), stored);
  assert.equal(stored.v, CONSENT_VERSION);
  assert.equal(stored.necessary, true);
});

test('invalid, incomplete and stale consent fails closed', () => {
  assert.equal(parseStoredConsent(null), null);
  assert.equal(parseStoredConsent('{broken'), null);
  assert.equal(parseStoredConsent(JSON.stringify({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
    ts: Date.now(),
    v: CONSENT_VERSION + 1,
  })), null);
  assert.equal(parseStoredConsent(JSON.stringify({
    necessary: true,
    functional: true,
    analytics: true,
    ts: Date.now(),
    v: CONSENT_VERSION,
  })), null);
});

test('undecided consent grants no optional category', () => {
  assert.deepEqual(undecidedConsent(), {
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
    ts: 0,
    v: CONSENT_VERSION,
  });
});
