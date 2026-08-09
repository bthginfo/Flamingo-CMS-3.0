import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { shouldResetSectionError } from '../components/section-error-boundary';

test('section error recovery is triggered only by a changed render payload', () => {
  const payload = { title: 'Before' };
  assert.equal(shouldResetSectionError(payload, payload), false);
  assert.equal(shouldResetSectionError(payload, { title: 'After' }), true);
});

test('both section renderer branches pass the full section revision to the boundary', () => {
  const renderer = readFileSync(new URL('../components/section-renderer.tsx', import.meta.url), 'utf8');
  const resetKeys = renderer.match(/<SectionErrorBoundary sectionType=\{section\.type\} resetKey=\{section\}>/g) ?? [];
  assert.equal(resetKeys.length, 2);
});
