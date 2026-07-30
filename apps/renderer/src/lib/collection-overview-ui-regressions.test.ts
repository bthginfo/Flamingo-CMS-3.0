import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

function source(relativePath: string) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

test('collection admin promotes overview editing before entry management', () => {
  const page = source('../app/admin/collections/[key]/page.tsx');
  const submit = source('../app/admin/collections/[key]/overview-page-submit.tsx');
  const overviewPanel = page.indexOf('aria-labelledby="collection-overview-title"');
  const entriesHeading = page.indexOf('>Einträge</h2>');

  assert.ok(overviewPanel >= 0, 'overview destination panel should be present');
  assert.ok(entriesHeading > overviewPanel, 'entry management should follow the overview destination');
  assert.match(page, /<OverviewPageSubmit \/>/);
  assert.match(submit, /Übersichtsseite gestalten/);
  assert.match(page, /htmlFor="new-collection-item"/);
});

test('collection overview destination stays tablet-safe and reports pending navigation', () => {
  const page = source('../app/admin/collections/[key]/page.tsx');
  const submit = source('../app/admin/collections/[key]/overview-page-submit.tsx');

  assert.match(page, /grid-cols-\[auto_1fr\]/);
  assert.match(page, /lg:grid-cols-\[auto_1fr_auto\]/);
  assert.match(page, /className="col-span-2 lg:col-span-1"/);
  assert.match(page, /from-blue-600 via-indigo-500 to-admin-accent/);
  assert.match(submit, /useFormStatus\(\)/);
  assert.match(submit, /disabled=\{pending\}/);
  assert.match(submit, /Wird geöffnet …/);
});

test('fullscreen infinite canvas carries section-scoped color roles into its portal', () => {
  const canvas = source('../templates/advanced/infinite-canvas.tsx');
  assert.match(canvas, /CANVAS_THEME_VARS/);
  assert.match(canvas, /getComputedStyle\(sectionRef\.current\)/);
  assert.match(canvas, /style=\{theme\}/);
  assert.match(canvas, /--token-section-bg,#08090b/);
  assert.match(canvas, /--token-card-heading/);
  assert.match(canvas, /--token-card-body/);
});

test('infinite canvas keeps item links outside its pan pointer capture', () => {
  const canvas = source('../templates/advanced/infinite-canvas.tsx');
  assert.match(canvas, /target\.closest\('a\[href\], button'\)/);
  assert.match(canvas, /onPointerDown=\{\(event\) => event\.stopPropagation\(\)\}/);
});

test('editorial feature cards own explicit card roles over image overlays', () => {
  const rail = source('../templates/shared/editorial-feature-rail.tsx');
  assert.match(rail, /var\(--token-card-heading,\s*#ffffff/);
  assert.match(rail, /var\(--token-card-body,\s*rgba\(255,255,255,0\.88\)/);
  assert.match(rail, /data-color-slot="cardBg borderColor cardMutedColor"/);
  assert.match(rail, /data-color-slot="cardHeadingColor"/);
  assert.match(rail, /data-color-slot="cardBodyColor"/);
});

test('mobile project dossier uses per-row rails and never draws a global line through its numbers', () => {
  const dossier = source('../templates/shared/stats-counter.tsx');
  assert.doesNotMatch(dossier, /absolute bottom-5 left-\[1\.08rem\] top-5/);
  assert.match(dossier, /i < stats\.length - 1/);
  assert.match(dossier, /bottom-\[-1\.55rem\] top-10/);
});
