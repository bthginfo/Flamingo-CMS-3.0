import assert from 'node:assert/strict';
import test from 'node:test';
import { isProtectedCrmSecret, protectCrmSecret, revealCrmSecret } from './secret-storage';

test('CRM secrets are encrypted without normalizing password characters', () => {
  const previous = process.env.CRM_CONFIG_ENCRYPTION_KEY;
  process.env.CRM_CONFIG_ENCRYPTION_KEY = 'test-only-crm-key-material-with-at-least-32-characters';
  try {
    const encrypted = protectCrmSecret('  exact password  ');
    assert.ok(encrypted);
    assert.equal(isProtectedCrmSecret(encrypted), true);
    assert.equal(encrypted?.includes('exact password'), false);
    assert.equal(revealCrmSecret(encrypted), '  exact password  ');
    assert.equal(protectCrmSecret(encrypted), encrypted);
    assert.equal(revealCrmSecret(`${encrypted}tampered`), null);
    assert.equal(revealCrmSecret('legacy-plaintext'), 'legacy-plaintext');
  } finally {
    if (previous === undefined) delete process.env.CRM_CONFIG_ENCRYPTION_KEY;
    else process.env.CRM_CONFIG_ENCRYPTION_KEY = previous;
  }
});
