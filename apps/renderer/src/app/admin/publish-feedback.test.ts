import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getPublishAdvisoryDescription, getPublishFailureDescription } from './publish-feedback';

describe('publish feedback', () => {
  it('shows one blocker with a readable section and field label', () => {
    const description = getPublishFailureDescription({
      code: 'PUBLISH_PREFLIGHT_FAILED',
      repairQueue: [{
        severity: 'error',
        location: 'pages[0].sections[1].data.de.rows[0].headline',
        message: 'Headline fehlt.',
      }],
    });

    assert.equal(description, 'Seite 1 · Sektion 2 · Headline: Headline fehlt.');
    assert.doesNotMatch(description || '', /pages\[0\]/);
  });

  it('groups large advisory queues without flooding the toast with raw paths', () => {
    const advisoryQueue = Array.from({ length: 308 }, (_, index) => ({
      severity: 'warning',
      code: 'budget.too_short',
      location: `pages[${index % 4}].sections[${index % 7}].data.de.rows[0].headline`,
      message: 'recommended minimum is 12.',
    }));

    const description = getPublishAdvisoryDescription({ success: true, advisoryQueue });
    assert.match(description || '', /^308 Qualitäts-Hinweise in 28 Bereichen:/);
    assert.match(description || '', /weitere Bereiche/);
    assert.doesNotMatch(description || '', /pages\[/);
    assert.ok((description || '').length < 240);
  });
});
