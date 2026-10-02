import assert from 'node:assert/strict';
import test from 'node:test';
import { parsePatBearer, isPatExpired, shouldTouchPatUsage } from './pat-auth-policy';

test('PAT headers accept the case-insensitive Bearer scheme and reject malformed tokens before DB access', () => {
  const token = `flm_pat_${'a'.repeat(64)}`;
  assert.equal(parsePatBearer(`bearer ${token}`), token);
  for (const value of [null, `Basic ${token}`, 'Bearer flm_pat_short', `Bearer ${token} extra`]) {
    assert.equal(parsePatBearer(value), null);
  }
});

test('PAT expiry is inclusive and usage bookkeeping is coalesced without caching authorization', () => {
  const now = new Date('2026-10-02T12:00:00Z');
  assert.equal(isPatExpired(now, now), true);
  assert.equal(isPatExpired(null, now), false);
  assert.equal(shouldTouchPatUsage(new Date('2026-10-02T11:59:00Z'), now), false);
  assert.equal(shouldTouchPatUsage(new Date('2026-10-02T11:00:00Z'), now), true);
  assert.equal(shouldTouchPatUsage(null, now), true);
});
