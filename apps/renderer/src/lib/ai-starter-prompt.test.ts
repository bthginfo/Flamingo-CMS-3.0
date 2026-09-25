import assert from 'node:assert/strict';
import test from 'node:test';
import { buildAiStarterPrompt } from './ai-starter-prompt';

test('admin starter prompt makes the API contract and per-section color work explicit', () => {
  const prompt = buildAiStarterPrompt('https://example.test/api/v1/instructions');

  assert.match(prompt, /GET https:\/\/example\.test\/api\/v1\/instructions/);
  assert.match(prompt, /agentContract\.sitemapPolicy/);
  assert.match(prompt, /sectionDataSchemas\[section\.type\]/);
  assert.match(prompt, /JEDE einzelne Section[\s\S]*section\.styleOverrides/i);
  assert.match(prompt, /sectionStyleContracts\[section\.type\]\.colorFields/);
  assert.match(prompt, /Verlasse dich nicht allein auf globale Farben/);
  assert.match(prompt, /WCAG AA/);
  assert.match(prompt, /Erfinde keine Unternehmensdaten/);
  assert.doesNotMatch(prompt, /HERO-BANNER|LEISTUNG A|12 Sections|Platzhalter anlegen/);
});
