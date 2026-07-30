import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveStatsCounterLayout, splitStatTextValue } from './stats-counter-utils';

test('Schuktuew project facts retain the dossier layout after editorial copy migration', () => {
  assert.equal(resolveStatsCounterLayout({
    badge: 'Fakten',
    headline: 'Eine Bildwelt für den ganzen Auftritt.',
  }), 'projectDossier');
  assert.equal(resolveStatsCounterLayout({
    badge: 'Einsatz',
    headline: 'Eine Bildwelt für den ganzen Auftritt.',
  }), 'projectDossier');
});

test('project dossier stays explicit and narrowly inferred', () => {
  assert.equal(resolveStatsCounterLayout({
    layout: 'projectDossier',
    badge: 'Anderer Inhalt',
    headline: 'Andere Headline',
  }), 'projectDossier');
  assert.equal(resolveStatsCounterLayout({
    badge: 'Fakten',
    headline: 'Projekt auf einen Blick.',
  }), 'projectDossier');
  assert.equal(resolveStatsCounterLayout({
    badge: 'Fakten',
    headline: 'Unsere Zahlen',
  }), 'default');
  assert.equal(resolveStatsCounterLayout({
    headline: 'Eine Bildwelt für den ganzen Auftritt.',
  }), 'default');
});

test('text stats split into compact dossier values', () => {
  assert.deepEqual(splitStatTextValue('Website · Kampagne | Recruiting • Social'), [
    'Website',
    'Kampagne',
    'Recruiting',
    'Social',
  ]);
});
