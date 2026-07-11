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

test('rejects formatted but unregistered identities and schema drift', () => {
  assert.deepEqual(resolveSectionWriteIdentity({
    type: 'hero', industry: 'hotel', definitionKey: 'hero.shared.v1',
  }), {
    ok: false,
    error: 'definitionKey "hero.shared.v1" is not registered for section type "hero"',
  });
  const mismatch = resolveSectionWriteIdentity({ type: 'hero', industry: 'hotel', schemaVersion: 2 });
  assert.equal(mismatch.ok, false);
});
