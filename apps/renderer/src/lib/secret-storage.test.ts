import assert from 'node:assert/strict';
import test from 'node:test';
import { isEncryptedSecret, protectStoredSecret, revealShopSecrets, revealStoredSecret } from './secret-storage';

test('stored secrets are encrypted, authenticated and backwards compatible', () => {
  const previous = process.env.CONFIG_ENCRYPTION_KEY;
  process.env.CONFIG_ENCRYPTION_KEY = 'test-only-key-material-with-at-least-32-characters';
  try {
    const encrypted = protectStoredSecret('super-secret-value');
    assert.ok(encrypted);
    assert.equal(isEncryptedSecret(encrypted), true);
    assert.equal(encrypted?.includes('super-secret-value'), false);
    assert.equal(revealStoredSecret(encrypted), 'super-secret-value');
    assert.equal(revealStoredSecret('legacy-plaintext'), 'legacy-plaintext');
    assert.equal(protectStoredSecret(encrypted), encrypted);
    assert.equal(revealStoredSecret(protectStoredSecret('  spaced secret  ')), '  spaced secret  ');
    assert.equal(revealStoredSecret(`${encrypted}tampered`), null);
  } finally {
    if (previous === undefined) delete process.env.CONFIG_ENCRYPTION_KEY;
    else process.env.CONFIG_ENCRYPTION_KEY = previous;
  }
});

test('shop secret hydration never changes public settings fields', () => {
  const previous = process.env.CONFIG_ENCRYPTION_KEY;
  process.env.CONFIG_ENCRYPTION_KEY = 'another-test-only-key-material-with-32-characters';
  try {
    const settings = revealShopSecrets({
      currency: 'EUR',
      stripeSecretKey: protectStoredSecret('stripe-secret'),
      paypalSecret: 'legacy-paypal-secret',
    });
    assert.equal(settings.currency, 'EUR');
    assert.equal(settings.stripeSecretKey, 'stripe-secret');
    assert.equal(settings.paypalSecret, 'legacy-paypal-secret');
  } finally {
    if (previous === undefined) delete process.env.CONFIG_ENCRYPTION_KEY;
    else process.env.CONFIG_ENCRYPTION_KEY = previous;
  }
});
