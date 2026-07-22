import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source(relative: string) {
  return readFileSync(new URL(relative, import.meta.url), 'utf8');
}

test('live preview direct editing rescans dynamic section states and resolves same-element collection paths', () => {
  const client = source('../app/live-preview/client.tsx');
  const overlays = source('../app/live-preview/edit-overlays.tsx');

  assert.match(client, /new MutationObserver\(scan\)/, 'dynamic content mounted by tabs, accordions and advanced scenes must become editable without toggling edit mode');
  assert.match(client, /attributeFilter:\s*\[[\s\S]*?data-edit-collection[\s\S]*?data-edit-index[\s\S]*?\]/, 'path-relevant attribute changes must trigger a rescan');
  assert.match(client, /attributeFilter:\s*\[[\s\S]*?data-edit-link[\s\S]*?\]/, 'link path marker changes must trigger a rescan');
  assert.match(client, /let cursor: HTMLElement \| null = el;/, 'text path builder must include collection markers placed on the editable element itself');
  assert.match(client, /const linkPath = cursor\.getAttribute\('data-edit-link'\);[\s\S]*?segments\.unshift\(linkPath\);/, 'CTA labels inside data-edit-link elements must write to e.g. primaryCta.label, not a top-level label field');
  assert.match(overlays, /let cursor: HTMLElement \| null = el;/, 'image/link/icon path builder must include collection markers placed on the target element itself');
});

test('advanced sections expose direct-edit markers for visible nested content', () => {
  const sceneLab = source('../templates/advanced/scene-lab.tsx');
  assert.match(sceneLab, /data-edit-collection="groups"[\s\S]*?data-edit-path="description"/, 'sceneLab group description must edit groups[index].description');
  assert.match(sceneLab, /data-edit-collection="choices"[\s\S]*?data-edit-path="label"/, 'sceneLab choice label must edit groups[index].choices[index].label');
  assert.match(sceneLab, /data-edit-path="priceLabel"/, 'sceneLab choice price label must be editable');
  assert.match(sceneLab, /data-edit-image=\{`choices\.\$\{choiceIndex\}\.image`\}/, 'sceneLab selected overlay image must edit the selected choice image');
  assert.match(sceneLab, /data-edit-link="cta"/, 'sceneLab CTA must expose the link editor');

  const guidedChoice = source('../templates/advanced/guided-choice.tsx');
  assert.match(guidedChoice, /data-edit-collection="questions"[\s\S]*?data-edit-collection="answers"/, 'guidedChoice answers must stay nested under the active question');
  assert.match(guidedChoice, /data-edit-collection="results"[\s\S]*?data-edit-link="cta"/, 'guidedChoice result CTA must expose the link editor on the result object');
  assert.match(guidedChoice, /data-edit-path="restartLabel"/, 'guidedChoice visible restart label must be editable');

  const dayToNight = source('../templates/advanced/day-to-night.tsx');
  assert.match(dayToNight, /data-edit-collection="scenes"[\s\S]*?data-edit-image="image"/, 'dayToNight image must edit scenes[index].image');
  assert.match(dayToNight, /data-edit-path="time"[\s\S]*?data-edit-path="label"/, 'dayToNight time and label must be separate editable fields');

  const kinetic = source('../templates/advanced/kinetic-identity.tsx');
  assert.match(kinetic, /data-edit-collection="statements"/, 'kinetic statement containers must carry the statements[index] context');
  assert.match(kinetic, /data-edit-path="prefix"[\s\S]*?data-edit-path="highlight"[\s\S]*?data-edit-path="suffix"/, 'kinetic statement copy must expose prefix/highlight/suffix editing');
  assert.match(kinetic, /data-card data-edit-collection="statements" data-edit-index=\{active\}/, 'kinetic active media must edit statements[active].image');

  const dualWave = source('../templates/advanced/dual-wave.tsx');
  assert.match(dualWave, /data-card data-edit-collection="items" data-edit-index=\{activeIndex\}/, 'dualWave active media card must edit items[activeIndex].*');

  const transformation = source('../templates/advanced/transformation-sequence.tsx');
  assert.match(transformation, /data-edit-path="metricValue"[\s\S]*?data-edit-path="metricLabel"/, 'transformation metrics must be directly editable');
  assert.match(transformation, /data-edit-link="cta"/, 'transformation CTA must expose the link editor');

  const editorial = source('../templates/advanced/editorial-card-morph.tsx');
  assert.match(editorial, /data-edit-collection="facts"[\s\S]*?data-edit-path="value"[\s\S]*?data-edit-path="label"/, 'editorial facts must edit items[index].facts[index].*');

  const material = source('../templates/advanced/material-atelier.tsx');
  assert.match(material, /data-edit-path="kicker"[\s\S]*?data-edit-path="title"/, 'material atelier list labels must be directly editable');
  assert.match(material, /data-edit-collection="items" data-edit-index=\{active\}[\s\S]*?data-edit-path="text"/, 'material atelier active description must edit items[active].text');
});

test('shared advanced CTA helper exposes both inline label editing and link modal editing', () => {
  const shared = source('../templates/advanced/advanced-shared.tsx');
  assert.match(shared, /data-edit-link="cta"/);
  assert.match(shared, /data-edit-path="cta\.label"/);
});
