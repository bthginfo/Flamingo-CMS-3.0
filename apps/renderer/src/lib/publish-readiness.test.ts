import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isStoredContentReadyToPublish, partitionPublishAuditIssues } from './publish-readiness';

describe('publish readiness', () => {
  it('does not block publishing for editorial quality recommendations', () => {
    assert.equal(isStoredContentReadyToPublish({
      contentErrors: 0,
      colorErrors: 0,
      colorWarnings: 0,
      qualityWarnings: 308,
      contentWarnings: 310,
    }), true);

    const result = partitionPublishAuditIssues([
      {
        severity: 'warning',
        code: 'budget.too_short',
        location: 'pages[0].sections[1].data.de.rows[0].headline',
        message: 'headline has 9 characters; recommended minimum is 12.',
        repair: { operation: 'replace' },
      },
    ]);

    assert.equal(result.blockers.length, 0);
    assert.equal(result.advisories.length, 1);
  });

  it('keeps structural errors and contrast warnings blocking', () => {
    assert.equal(isStoredContentReadyToPublish({ contentErrors: 1 }), false);
    assert.equal(isStoredContentReadyToPublish({ colorWarnings: 1 }), false);

    const result = partitionPublishAuditIssues(
      [{ severity: 'error', code: 'plan.section_invalid' }, { severity: 'warning', code: 'copy.generic' }],
      [{ severity: 'warning', code: 'LOW_CONTRAST' }],
    );

    assert.deepEqual(result.blockers.map(issue => issue.code), ['plan.section_invalid', 'LOW_CONTRAST']);
    assert.deepEqual(result.advisories.map(issue => issue.code), ['copy.generic']);
  });
});
