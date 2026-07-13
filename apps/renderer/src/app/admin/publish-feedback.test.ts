import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getPublishFailureDescription } from './publish-feedback';

const publishClientSources = [
  readFileSync(new URL('./dashboard-actions.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('./pages/[id]/page-editor.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('./collections/[key]/[itemId]/item-editor.tsx', import.meta.url), 'utf8'),
];

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

  it('keeps success toasts terse across every publish entry point', () => {
    for (const source of publishClientSources) {
      assert.doesNotMatch(source, /getPublishAdvisoryDescription/);
      assert.doesNotMatch(source, /duration:\s*result\.advisoryQueue/);
      assert.match(source, /toast\.success\(result\.unchanged/);
    }
  });
});
