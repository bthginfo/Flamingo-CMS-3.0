import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getVisibleTestimonialItems,
  getVisibleTimelineEntries,
} from './section-collection-view';

test('timeline view keeps original edit indices after blank rows are removed', () => {
  const result = getVisibleTimelineEntries({
    entries: [
      {},
      { year: '1989', title: 'Erste Ausstellung' },
      null,
      { year: '2014', text: 'Wärmepumpen-Kompetenz' },
    ],
  });

  assert.equal(result.collectionKey, 'entries');
  assert.deepEqual(result.entries.map(({ originalIndex }) => originalIndex), [1, 3]);
  assert.deepEqual(result.entries.map(({ item }) => item.year), ['1989', '2014']);
});

test('testimonial view keeps original edit indices after blank rows are removed', () => {
  const result = getVisibleTestimonialItems([
    { quote: '', name: '' },
    { quote: 'Sehr gute Beratung', name: 'Ada' },
    undefined,
    { name: 'Lin' },
  ]);

  assert.deepEqual(result.map(({ originalIndex }) => originalIndex), [1, 3]);
  assert.deepEqual(result.map(({ item }) => item.name), ['Ada', 'Lin']);
});
