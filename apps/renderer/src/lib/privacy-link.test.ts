import assert from 'node:assert/strict';
import test from 'node:test';
import { privacyHrefForPath } from './privacy-link';

test('privacy links follow standalone, locale and public demo routes', () => {
  assert.equal(privacyHrefForPath('/kontakt'), '/datenschutz');
  assert.equal(privacyHrefForPath('/en/contact'), '/en/datenschutz');
  assert.equal(privacyHrefForPath('/demo/handwerk/kontakt'), '/demo/handwerk/datenschutz');
  assert.equal(privacyHrefForPath(null), '/datenschutz');
});
