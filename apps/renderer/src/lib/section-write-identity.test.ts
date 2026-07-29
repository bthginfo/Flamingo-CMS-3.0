import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveSectionWriteIdentity } from './section-write-identity';

test('derives a stable tenant-aware definition for new sections', () => {
  const result = resolveSectionWriteIdentity({ type: 'hero', industry: 'hotel' });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.identity.definitionKey, 'hero.hotel.v1');
    assert.equal(result.identity.schemaVersion, 1);
  }
});

test('repairs formatted but stale identities and rejects schema drift', () => {
  const stale = resolveSectionWriteIdentity({
    type: 'hero', industry: 'hotel', definitionKey: 'hero.shared.v1',
  });
  assert.equal(stale.ok, true);
  if (stale.ok) assert.equal(stale.identity.definitionKey, 'hero.hotel.v1');

  const advanced = resolveSectionWriteIdentity({
    type: 'xrayReveal', industry: 'photography', definitionKey: 'xrayReveal.advanced.v1',
  });
  assert.equal(advanced.ok, true);
  if (advanced.ok) assert.equal(advanced.identity.definitionKey, 'xrayReveal.shared.v1');

  const mismatch = resolveSectionWriteIdentity({ type: 'hero', industry: 'hotel', schemaVersion: 2 });
  assert.equal(mismatch.ok, false);
});
