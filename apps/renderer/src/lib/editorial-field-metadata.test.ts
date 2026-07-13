import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getCommonEditorialFieldLabel, getSectionEditorialSummary, groupEditorialFields } from './editorial-field-metadata';

describe('editorial field metadata', () => {
  it('groups and orders fields independently from stored key order', () => {
    const grouped = groupEditorialFields({
      mapEmbedUrl: 'https://maps.example',
      imageSecondary: '/second.jpg',
      text: 'Erklärung',
      primaryCta: { label: 'Termin', href: '/kontakt' },
      headline: 'Willkommen',
      hint: 'Ganzheitlich',
      imagePrimary: '/main.jpg',
      items: [{ title: 'Detail' }],
    });

    assert.deepEqual(grouped.content.map((field) => field.key), ['hint', 'headline', 'text']);
    assert.deepEqual(grouped.actions.map((field) => field.key), ['primaryCta']);
    assert.deepEqual(grouped.media.map((field) => field.key), ['imagePrimary', 'imageSecondary']);
    assert.deepEqual(grouped.details.map((field) => field.key), ['items']);
    assert.deepEqual(grouped.advanced.map((field) => field.key), ['mapEmbedUrl']);
  });

  it('keeps unknown fields editable under advanced', () => {
    const forward = groupEditorialFields({ zebraRendererFlag: 'on', mysteryRendererFlag: 'on' });
    const reversed = groupEditorialFields({ mysteryRendererFlag: 'on', zebraRendererFlag: 'on' });
    assert.deepEqual(forward.advanced.map((field) => field.key), ['mysteryRendererFlag', 'zebraRendererFlag']);
    assert.deepEqual(reversed.advanced.map((field) => field.key), forward.advanced.map((field) => field.key));
  });

  it('does not count empty default arrays or objects as complete', () => {
    assert.deepEqual(getSectionEditorialSummary({
      headline: '',
      cards: [{ title: '', text: '', cta: { label: '', href: '' } }],
      primaryCta: { label: '', href: '' },
      rows: [[{ title: '' }]],
    }), {
      excerpt: null, complete: 0, total: 4, percentage: 0,
    });
  });

  it('provides German labels and a stable completion summary', () => {
    assert.equal(getCommonEditorialFieldLabel('imagePrimary'), 'Hauptbild');
    assert.equal(getCommonEditorialFieldLabel('hint'), 'Hinweis');
    assert.deepEqual(getSectionEditorialSummary({ headline: 'Ein guter Titel', text: '', image: '/image.jpg' }), {
      excerpt: 'Ein guter Titel', complete: 2, total: 3, percentage: 67,
    });
  });
});
