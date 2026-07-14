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
] as const;

test('advanced experiences are wired across picker, renderer, schemas, previews and colors', () => {
  const picker = getSectionTypesForIndustry('tradesman');
  const schemas = getSectionSchemas('tradesman');
  const contracts = new Map(getAllSectionContracts().map((contract) => [contract.type, contract]));

  for (const type of ADVANCED_TYPES) {
    const definition = picker.find((entry) => entry.type === type);
    assert.equal(definition?.category, 'Advanced', `${type} must live in the Advanced picker category`);
    assert.equal(definition?.serviceAvailable, true, `${type} must offer specialist setup`);
    assert.ok(definition?.setupHint, `${type} must explain its setup requirements`);
    assert.equal(resolveSectionDefinition({ type, industry: 'tradesman' })?.owner, 'shared');
    assert.ok(schemas[type], `${type} must be documented for the content API`);
    assert.ok(SECTION_PREVIEW_DATA[type], `${type} must have realistic preview data`);
    assert.ok(SECTION_COLOR_CONTRACTS_GENERIC[type]?.length, `${type} must expose a static color contract`);
    assert.equal(contracts.get(type)?.category, 'advanced');
  }
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
});

test('advanced scroll stories keep reduced-motion SSR markup hydration-stable', () => {
  for (const file of ['dual-wave.tsx', 'cinematic-chapters.tsx', 'transformation-sequence.tsx']) {
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
