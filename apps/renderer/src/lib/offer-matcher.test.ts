import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildOfferMatcherSummary,
  getOfferMatcherResult,
  isOfferMatcherComplete,
  normalizeOfferMatcherData,
  safeOfferMatcherHref,
} from './offer-matcher';

const DATA = {
  questions: [
    {
      id: 'goal',
      label: 'Was ist Ihr Ziel?',
      options: [
        { id: 'clarity', label: 'Klarheit', matches: ['focus'], tags: ['strategy'] },
        { id: 'launch', label: 'Launch', matches: ['launch'], tags: ['delivery'] },
      ],
    },
    {
      id: 'support',
      label: 'Wie viel Unterstuetzung?',
      options: [
        { id: 'direction', label: 'Richtung', matches: ['focus'], tags: ['strategy'] },
        { id: 'full', label: 'Komplett', matches: ['signature'], tags: ['delivery'] },
      ],
    },
  ],
  offers: [
    { id: 'focus', title: 'Focus Session', tags: ['strategy'], priority: 1, fallback: true },
    { id: 'launch', title: 'Launch Package', tags: ['delivery'], priority: 2 },
    { id: 'signature', title: 'Signature Project', tags: ['delivery'], priority: 3 },
  ],
};

test('normalizes weak or malformed AI data without exposing invalid rows', () => {
  const normalized = normalizeOfferMatcherData({
    questions: [
      null,
      { label: 'Only one answer', options: [{ label: 'One' }] },
      {
        id: ' Goal ',
        label: '  Main goal  ',
        options: [
          { id: 'Same', label: 'First', matches: 'Focus Session, Growth' },
          { id: 'Same', label: 'Second', matches: ['Growth', null, '@@@'], tags: ' Local, Premium ' },
          42,
        ],
      },
      {
        id: 'Timing',
        label: 'When?',
        options: [
          { value: 'Soon', label: 'Soon', matches: ['Growth'] },
          { value: 'Later', label: 'Later', matches: ['Focus Session'] },
        ],
      },
    ],
    offers: [
      { id: 'Focus Session', title: ' Focus ' },
      { id: 'Focus Session', title: 'Duplicate', priority: Number.POSITIVE_INFINITY },
      { title: '' },
    ],
  });

  assert.ok(normalized);
  assert.equal(normalized.questions.length, 2);
  assert.deepEqual(normalized.questions[0].options.map((option) => option.id), ['same', 'same-2']);
  assert.deepEqual(normalized.questions[0].options[0].matches, ['focus-session', 'growth']);
  assert.deepEqual(normalized.questions[0].options[1].matches, ['growth']);
  assert.deepEqual(normalized.offers.map((offer) => offer.id), ['focus-session', 'focus-session-2']);
  assert.equal(normalized.offers[1].priority, 0);
});

test('returns null for unusable data instead of crashing the renderer', () => {
  assert.equal(normalizeOfferMatcherData(null), null);
  assert.equal(normalizeOfferMatcherData({ questions: 'wrong', offers: [] }), null);
  assert.equal(normalizeOfferMatcherData({ questions: [{ label: 'Q', options: [] }], offers: [{ title: 'Offer' }] }), null);
  assert.equal(normalizeOfferMatcherData({ questions: [{ label: 'Q', options: [{ label: 'A' }, { label: 'B' }] }], offers: [{ title: 'Offer' }] }), null);
});

test('accepts only safe hand-off links', () => {
  assert.equal(safeOfferMatcherHref('/kontakt'), '/kontakt');
  assert.equal(safeOfferMatcherHref('tel:+49 89 12345'), 'tel:+498912345');
  assert.equal(safeOfferMatcherHref('javascript:alert(1)'), '');
  assert.equal(safeOfferMatcherHref('data:text/html,test'), '');
});

test('requires every valid question before revealing a result', () => {
  const normalized = normalizeOfferMatcherData(DATA);
  assert.ok(normalized);
  assert.equal(isOfferMatcherComplete(normalized, { goal: 'clarity' }), false);
  assert.equal(getOfferMatcherResult(normalized, { goal: 'clarity' }), null);
});

test('explicit answer mappings outrank soft tag overlap and priority', () => {
  const normalized = normalizeOfferMatcherData(DATA);
  assert.ok(normalized);
  const result = getOfferMatcherResult(normalized, { goal: 'clarity', support: 'direction' });
  assert.equal(result?.offer.id, 'focus');
  assert.equal(result?.directMatches, 2);
  assert.equal(result?.matchedAnswers, 2);
});

test('priority breaks equal explicit matches deterministically', () => {
  const normalized = normalizeOfferMatcherData(DATA);
  assert.ok(normalized);
  const result = getOfferMatcherResult(normalized, { goal: 'launch', support: 'full' });
  assert.equal(result?.offer.id, 'signature');
  assert.equal(result?.directMatches, 1);
});

test('configured fallback wins when no answer maps to an offer', () => {
  const normalized = normalizeOfferMatcherData({
    questions: [
      { id: 'question', label: 'Question', options: [{ label: 'A' }, { label: 'B' }] },
      { id: 'timing', label: 'Timing', options: [{ label: 'Now' }, { label: 'Later' }] },
    ],
    offers: [
      { id: 'premium', title: 'Premium', priority: 99 },
      { id: 'safe', title: 'Safe fallback', priority: 1, fallback: true },
    ],
  });
  assert.ok(normalized);
  const result = getOfferMatcherResult(normalized, { question: 'a', timing: 'now' });
  assert.equal(result?.offer.id, 'safe');
});

test('builds a concise lead-context summary from canonical labels', () => {
  const normalized = normalizeOfferMatcherData(DATA);
  assert.ok(normalized);
  const selections = { goal: 'clarity', support: 'direction' };
  const result = getOfferMatcherResult(normalized, selections);
  assert.equal(
    buildOfferMatcherSummary(normalized, selections, result),
    'Was ist Ihr Ziel?: Klarheit\nWie viel Unterstuetzung?: Richtung\nEmpfehlung: Focus Session',
  );
});
