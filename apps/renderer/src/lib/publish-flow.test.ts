import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const adminPublishSource = readFileSync(
  new URL('../app/admin/actions/publish.ts', import.meta.url),
  'utf8',
);
const apiPublishSource = readFileSync(
  new URL('../app/api/v1/content/publish/route.ts', import.meta.url),
  'utf8',
);

describe('publish flow', () => {
  it('does not gate admin or API publishing behind the optional content audit', () => {
    for (const source of [adminPublishSource, apiPublishSource]) {
      assert.doesNotMatch(source, /runStoredContentAudit/);
      assert.doesNotMatch(source, /PUBLISH_PREFLIGHT_FAILED/);
      assert.doesNotMatch(source, /readyToPublish/);
      assert.match(source, /getDraftSnapshot/);
    }
  });

  it('does not run editorial or color warning scans after API publishing', () => {
    assert.doesNotMatch(apiPublishSource, /validateSectionStyleOverrides/);
    assert.doesNotMatch(apiPublishSource, /colorWarnings/);
    assert.doesNotMatch(apiPublishSource, /warnings\.push/);
  });
});
