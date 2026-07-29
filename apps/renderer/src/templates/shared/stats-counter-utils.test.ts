import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveStatsCounterLayout, splitStatTextValue } from './stats-counter-utils';

test('text fact values become separate dossier keywords', () => {
  assert.deepEqual(
    splitStatTextValue('Website · Kampagne | Recruiting • Social'),
    ['Website', 'Kampagne', 'Recruiting', 'Social'],
  );
});

test('project dossier is explicit and narrowly inferred for existing project facts', () => {
  assert.equal(resolveStatsCounterLayout({ layout: 'projectDossier' }), 'projectDossier');
  assert.equal(resolveStatsCounterLayout({ badge: 'Fakten', headline: 'Projekt auf einen Blick.' }), 'projectDossier');
  assert.equal(resolveStatsCounterLayout({ badge: 'Fakten', headline: 'Unsere Zahlen' }), 'default');
  assert.equal(resolveStatsCounterLayout({ headline: 'Projekt auf einen Blick.' }), 'default');
});
