import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('instructions business profile boundary', () => {
  it('selects the persisted profile and passes only its validated representation to the contract', () => {
    const source = readFileSync(new URL('../app/api/v1/instructions/route.ts', import.meta.url), 'utf8');
    assert.match(source, /businessProfile:\s*globalSettings\.businessProfile/);
    assert.match(source, /readPersistedBusinessProfile\(settings\?\.businessProfile\)/);
    assert.match(source, /approvedSiteProfile,/);
  });
});
