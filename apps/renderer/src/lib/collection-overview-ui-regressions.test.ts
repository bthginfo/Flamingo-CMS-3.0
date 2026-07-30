import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

function source(relativePath: string) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

test('fullscreen infinite canvas carries section-scoped color roles into its portal', () => {
  const canvas = source('../templates/advanced/infinite-canvas.tsx');
  assert.match(canvas, /CANVAS_THEME_VARS/);
  assert.match(canvas, /getComputedStyle\(sectionRef\.current\)/);
  assert.match(canvas, /style=\{theme\}/);
  assert.match(canvas, /--token-section-bg,#08090b/);
  assert.match(canvas, /--token-card-heading/);
  assert.match(canvas, /--token-card-body/);
});

test('editorial feature cards always use on-dark roles over image overlays', () => {
  const rail = source('../templates/shared/editorial-feature-rail.tsx');
  assert.match(rail, /var\(--token-on-dark-heading,\s*#ffffff/);
  assert.match(rail, /var\(--token-on-dark-body,\s*rgba\(255,255,255,0\.88\)/);
  assert.doesNotMatch(rail, /var\(--token-card-heading,\s*var\(--token-on-dark-heading/);
});

test('mobile project dossier uses per-row rails and never draws a global line through its numbers', () => {
  const dossier = source('../templates/shared/stats-counter.tsx');
  assert.doesNotMatch(dossier, /absolute bottom-5 left-\[1\.08rem\] top-5/);
  assert.match(dossier, /i < stats\.length - 1/);
  assert.match(dossier, /bottom-\[-1\.55rem\] top-10/);
});
