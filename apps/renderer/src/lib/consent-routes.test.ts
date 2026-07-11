import assert from 'node:assert/strict';
import test from 'node:test';
import { isConsentUiSuppressed } from './consent-routes';

test('suppresses consent UI on internal preview and showcase surfaces', () => {
  for (const pathname of ['/section-preview', '/preview/example', '/live-preview', '/demo/showcase']) {
    assert.equal(isConsentUiSuppressed(pathname), true, pathname);
  }
});

test('keeps consent UI on real demo tenant pages', () => {
  for (const pathname of ['/demo/handwerk', '/demo/handwerk/kontakt', '/demo/showcase-example', '/']) {
    assert.equal(isConsentUiSuppressed(pathname), false, pathname);
  }
});
