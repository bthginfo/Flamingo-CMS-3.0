import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildSmartInquirySummary,
  isSmartInquiryScopeComplete,
  normalizeSmartInquiryChoices,
  type SmartInquiryGroup,
} from './smart-inquiry';

test('normalizes compact and imperfect AI choice data', () => {
  assert.deepEqual(
    normalizeSmartInquiryChoices([
      'Neue Website',
      { title: 'Bestehende Seite verbessern', text: 'UX und Conversion schärfen', icon: 'sparkles' },
      { name: 'Neue Website' },
      { label: '  Beratung  ', description: '  Erstgespräch  ' },
      null,
      {},
    ]),
    [
      { label: 'Neue Website' },
      { label: 'Bestehende Seite verbessern', description: 'UX und Conversion schärfen', icon: 'sparkles' },
      { label: 'Beratung', description: 'Erstgespräch' },
    ],
  );
});

test('requires a valid selection for every visible qualifying group', () => {
  const groups: SmartInquiryGroup[] = [
    { key: 'scope', label: 'Umfang', options: [{ label: 'Kompakt' }, { label: 'Umfangreich' }] },
    { key: 'timing', label: 'Zeitrahmen', options: [] },
    { key: 'budget', label: 'Budget', options: [{ label: 'Bis 5.000 €' }] },
  ];

  assert.equal(isSmartInquiryScopeComplete(groups, { scope: 'Kompakt' }), false);
  assert.equal(isSmartInquiryScopeComplete(groups, { scope: 'Unbekannt', budget: 'Bis 5.000 €' }), false);
  assert.equal(isSmartInquiryScopeComplete(groups, { scope: 'Kompakt', budget: 'Bis 5.000 €' }), true);
});

test('builds the deterministic lead summary and omits empty rows', () => {
  assert.equal(
    buildSmartInquirySummary(
      { goal: 'Neue Website', timing: 'In 1–3 Monaten', budget: '5.000–10.000 €' },
      { timing: 'Start' },
    ),
    'Ziel: Neue Website\nStart: In 1–3 Monaten\nBudget: 5.000–10.000 €',
  );
});
