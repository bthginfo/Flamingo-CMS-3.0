import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  CRM_MASTER_PASSWORD_MAX_LENGTH,
  CRM_MASTER_PASSWORD_MIN_LENGTH,
  normalizeConfiguredCrmMasterPassword,
} from './crm-login-policy';

describe('CRM login password policy', () => {
  it('keeps existing twelve-character master passwords valid', () => {
    const password = 'a'.repeat(CRM_MASTER_PASSWORD_MIN_LENGTH);
    assert.equal(normalizeConfiguredCrmMasterPassword(password), password);
  });

  it('rejects missing, shorter, and excessively long configuration values', () => {
    assert.equal(normalizeConfiguredCrmMasterPassword(undefined), null);
    assert.equal(normalizeConfiguredCrmMasterPassword('a'.repeat(CRM_MASTER_PASSWORD_MIN_LENGTH - 1)), null);
    assert.equal(normalizeConfiguredCrmMasterPassword('a'.repeat(CRM_MASTER_PASSWORD_MAX_LENGTH + 1)), null);
  });

  it('normalizes surrounding whitespace before validation', () => {
    const password = 'secure-login';
    assert.equal(password.length, CRM_MASTER_PASSWORD_MIN_LENGTH);
    assert.equal(normalizeConfiguredCrmMasterPassword(`  ${password}  `), password);
  });
});
