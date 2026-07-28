import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getSectionTypesForIndustry } from '../app/admin/pages/[id]/section-types';
import { resolveSectionDefinition } from '../templates';
import { validateSections } from './api-utils';
import { getAllSectionContracts } from './section-contracts';
import { SECTION_COLOR_CONTRACTS_GENERIC } from './section-color-contracts-generated';
import { getSectionSchemas } from './section-data-schemas';
import { SECTION_PREVIEW_DATA } from './section-preview-data';

const ADVANCED_TYPES = [
  'dualWave',
  'cinematicChapters',
  'transformationSequence',
  'xrayReveal',
  'sceneLab',
  'infiniteCanvas',
  'kineticIdentity',
  'signaturePath',
  'layeredAnatomy',
  'guidedChoice',
  'dayToNight',
  'livingBlueprint',
  'editorialCardMorph',
  'materialAtelier',
  'verticalReelShowcase',
  'aiWorkflowReel',
  'cameraExplodeScroll',
] as const;

test('advanced experiences are wired across picker, renderer, schemas, previews and colors', () => {
  const picker = getSectionTypesForIndustry('tradesman');
  const schemas = getSectionSchemas('tradesman');
  const contracts = new Map(getAllSectionContracts().map((contract) => [contract.type, contract]));

  for (const type of ADVANCED_TYPES) {
    const definition = picker.find((entry) => entry.type === type);
    assert.equal(definition?.category, 'Advanced', `${type} must live in the Advanced picker category`);
    assert.equal(definition?.serviceAvailable, true, `${type} must offer specialist setup`);
    assert.match(String(definition?.setupLevel || ''), /^(guided|specialist)$/, `${type} must classify setup complexity`);
    assert.ok(definition?.setupHint, `${type} must explain its setup requirements`);
    assert.equal(resolveSectionDefinition({ type, industry: 'tradesman' })?.owner, 'shared');
    assert.ok(schemas[type], `${type} must be documented for the content API`);
    assert.ok(SECTION_PREVIEW_DATA[type], `${type} must have realistic preview data`);
    assert.ok(SECTION_COLOR_CONTRACTS_GENERIC[type]?.length, `${type} must expose a static color contract`);
    assert.equal(contracts.get(type)?.category, 'advanced');
  }
});

test('advanced experiences stay reusable in key tenant industries', () => {
  for (const industry of ['tradesman', 'photography', 'verein'] as const) {
    const picker = getSectionTypesForIndustry(industry);
    for (const type of ADVANCED_TYPES) {
      const definition = picker.find((entry) => entry.type === type);
      assert.equal(definition?.category, 'Advanced', `${type} must be selectable for ${industry}`);
      assert.ok(definition?.setupHint, `${type} must keep setup help for ${industry}`);
      assert.equal(resolveSectionDefinition({ type, industry })?.owner, 'shared', `${type} must render as shared section for ${industry}`);
    }
  }
});

test('advanced experiences use guided admin editors, not the generic field editor', () => {
  const advancedEditorSource = readFileSync(new URL('../app/admin/pages/[id]/advanced-section-editor.tsx', import.meta.url), 'utf8');
  const sectionDataEditorSource = readFileSync(new URL('../app/admin/pages/[id]/section-data-editor.tsx', import.meta.url), 'utf8');

  for (const type of ADVANCED_TYPES) {
    assert.match(
      advancedEditorSource,
      new RegExp(`${type}:\\s*\\{[\\s\\S]*?requirements:\\s*\\[`),
      `${type} must expose guided metadata and requirements in the admin editor`,
    );
    assert.match(
      advancedEditorSource,
      new RegExp(`case ['"]${type}['"]:\\s*return\\s*<[^>]+Editor`),
      `${type} must have an explicit editor switch case`,
    );
    assert.match(
      sectionDataEditorSource,
      new RegExp(`\\b${type}:\\s*AdvancedSectionEditor\\b`),
      `${type} must route from the page editor to AdvancedSectionEditor`,
    );
  }

  assert.match(advancedEditorSource, /<AdvancedFrame/, 'advanced editors must render the guided setup frame');
  assert.match(advancedEditorSource, /Von Flamingo bef/, 'advanced editors must keep the specialist setup CTA');
  assert.doesNotMatch(advancedEditorSource, /default:\s*return\s*<[^>]*Generic/i, 'advanced editor must not silently fall back to a generic editor');
});

test('advanced preview payloads satisfy the public API contract', () => {
  for (const type of ADVANCED_TYPES) {
    assert.equal(
      validateSections([{ type, data: SECTION_PREVIEW_DATA[type] }], 'tradesman'),
      null,
      `${type} preview data must remain a valid AI/API example`,
    );
  }
});

test('advanced API validation returns actionable nested paths', () => {
  assert.match(
    validateSections([{ type: 'cinematicChapters', data: { headline: 'Story', chapters: [{ title: 'Start' }, {}, {}] } }], 'tradesman') || '',
    /chapters\[0\]\.image/,
  );
  assert.match(
    validateSections([{ type: 'sceneLab', data: { headline: 'Lab', baseImage: '/base.jpg', groups: [{ label: 'Material', choices: [] }, { label: 'Licht', choices: [] }] } }], 'tradesman') || '',
    /groups\[0\]\.choices/,
  );
  assert.match(
    validateSections([{ type: 'infiniteCanvas', data: { headline: 'Work', items: [] } }], 'tradesman') || '',
    /10–40 items/,
  );
  assert.match(
    validateSections([{ type: 'guidedChoice', data: { headline: 'Find it', mode: 'branch', questions: [{ id: 'q1', label: 'Start', answers: [{ id: 'a1', label: 'Loop', nextQuestionId: 'q1' }, { id: 'a2', label: 'Loop too', nextQuestionId: 'q1' }] }, { id: 'q2', label: 'Lost', answers: [{ id: 'a3', label: 'A', resultId: 'r1' }, { id: 'a4', label: 'B', resultId: 'r2' }] }], results: [{ id: 'r1', title: 'One' }, { id: 'r2', title: 'Two' }] } }], 'tradesman') || '',
    /cycle/,
  );
  assert.match(
    validateSections([{ type: 'verticalReelShowcase', data: { headline: 'Reels', reels: [{ title: 'One' }] } }], 'tradesman') || '',
    /2â€“5 items|2–5 items/,
  );
  assert.match(
    validateSections([{ type: 'aiWorkflowReel', data: { headline: 'Workflow', media: {}, steps: [{ title: 'Brief', text: 'Start' }, { title: 'Shoot', text: 'Set' }, { title: 'Output' }] } }], 'tradesman') || '',
    /media\.videoSrc/,
  );
  assert.match(
    validateSections([{ type: 'cameraExplodeScroll', data: { headline: 'Camera', parts: [{ label: 'Lens', text: 'Focus', offsetX: 999, offsetY: 0 }, { label: 'Body', text: 'Brand', offsetX: 0, offsetY: 0 }, { label: 'Sensor', text: 'AI', offsetX: 0, offsetY: 0 }, { label: 'Light', text: 'Mood', offsetX: 0, offsetY: 0 }] } }], 'tradesman') || '',
    /offsetX/,
  );
});

test('advanced scroll stories keep reduced-motion SSR markup hydration-stable', () => {
  for (const file of ['dual-wave.tsx', 'cinematic-chapters.tsx', 'transformation-sequence.tsx', 'kinetic-identity.tsx']) {
    const source = readFileSync(new URL(`../templates/advanced/${file}`, import.meta.url), 'utf8');
    assert.match(source, /advanced-static-fallback/, `${file} must render the static fallback on server and client`);
    assert.match(source, /advanced-motion-experience/, `${file} must keep the motion experience as a sibling`);
    assert.doesNotMatch(source, /if\s*\(reduceMotion\)\s*return/, `${file} must not branch SSR markup on a media query`);
  }
});

test('dark color contexts outrank generic card text rules', () => {
  const source = readFileSync(new URL('../components/section-renderer.tsx', import.meta.url), 'utf8');
  assert.match(
    source,
    /\[data-color-context="dark"\] :is\(h1,h2,h3,h4,h5,h6\):not\(\[class\*="text-white"\]\):not\(\[class\*="text-black"\]\)/,
  );
});

test('wave two media overlays use semantic on-dark roles and robust scrims', () => {
  for (const file of ['day-to-night.tsx', 'editorial-card-morph.tsx']) {
    const source = readFileSync(new URL(`../templates/advanced/${file}`, import.meta.url), 'utf8');
    assert.match(source, /--token-image-overlay/, `${file} must place copy on a semantic media scrim`);
    assert.match(source, /--token-on-dark-heading/, `${file} must use the on-media heading role`);
    assert.match(source, /--token-on-dark-(?:body|muted)/, `${file} must use an on-media supporting text role`);
  }
});

test('wave two responsive and selection semantics cannot drift', () => {
  const signature = readFileSync(new URL('../templates/advanced/signature-path.tsx', import.meta.url), 'utf8');
  assert.match(signature, /lg:hidden/, 'signaturePath must keep a normal-flow mobile/tablet timeline');
  assert.doesNotMatch(signature, /whileInView/, 'signaturePath items must not disappear outside the viewport');
  assert.match(signature, /repeat\(\$\{items\.length\}, minmax\(0, 1fr\)\)/, 'signaturePath markers and cards must share one non-overflowing column geometry');
  assert.match(signature, /grid-rows-\[8rem_1fr\]/, 'each desktop marker must remain attached to its card');
  for (const file of ['day-to-night.tsx', 'layered-anatomy.tsx', 'living-blueprint.tsx']) {
    const source = readFileSync(new URL(`../templates/advanced/${file}`, import.meta.url), 'utf8');
    assert.match(source, /aria-pressed=/, `${file} must expose the active selection`);
    assert.match(source, /focus-visible:outline/, `${file} must retain a visible keyboard focus state`);
  }
  const editorial = readFileSync(new URL('../templates/advanced/editorial-card-morph.tsx', import.meta.url), 'utf8');
  assert.match(editorial, /event\.key !== 'Escape'/);
  assert.match(editorial, /document\.getElementById\(.+\)\?\.focus/);
  assert.match(editorial, /id=\{`\$\{detailId\}-trigger-\$\{index\}`\}/);
  assert.match(editorial, /overflow-wrap:anywhere/);
  const kinetic = readFileSync(new URL('../templates/advanced/kinetic-identity.tsx', import.meta.url), 'utf8');
  assert.match(kinetic, /items-end/, 'kinetic text and media must leave the sticky stage on the same baseline');
  assert.match(kinetic, /window\.addEventListener\('scroll', schedule/, 'kinetic scenes need a native scroll fallback');
  assert.match(kinetic, /requestAnimationFrame\(update\)/, 'the native fallback must stay frame-throttled');
  assert.doesNotMatch(kinetic, /initial=\{reduceMotion \? false : \{ opacity: 0/, 'server-rendered kinetic content must fail open as visible');
});

test('material atelier keeps an accessible ledger and a no-hidden-content mobile sequence', () => {
  const source = readFileSync(new URL('../templates/advanced/material-atelier.tsx', import.meta.url), 'utf8');
  assert.match(source, /aria-pressed=/);
  assert.match(source, /onFocus=\{\(\) => setActive\(index\)\}/);
  assert.match(source, /snap-mandatory/);
  assert.match(source, /focus-visible:outline/);
  assert.match(source, /useReducedMotion/);
  assert.match(source, /safeContentUrl\(item\?\.image/);
  assert.match(source, /aria-label="Merkmale"/, 'mobile and tablet cards must expose item metadata as a semantic list');
  assert.match(source, /item\.meta\.slice\(0, 5\)/, 'responsive metadata must stay deliberately compact');
  assert.match(source, /--token-card-muted/, 'responsive metadata must use semantic color tokens');
  assert.match(source, /visibleText\(item\?\.text\)/, 'raw CSS values must not leak into visible atelier copy');
  assert.match(source, /ResilientImage/, 'atelier media must fail into an intentional visual state');
});

test('primary cms buttons keep the explicit button foreground token', () => {
  const css = readFileSync(new URL('../globals.css', import.meta.url), 'utf8');
  assert.match(css, /:is\(a, button\)\.cms-button\.cms-button--primary\s*\{[\s\S]*?background-color:\s*var\(--token-btn-bg\)\s*!important;[\s\S]*?color:\s*var\(--token-btn-text\)\s*!important;/);
  assert.match(css, /\.cms-button\.cms-button--primary\s*>\s*\*\s*\{[\s\S]*?color:\s*inherit\s*!important;/);
});
