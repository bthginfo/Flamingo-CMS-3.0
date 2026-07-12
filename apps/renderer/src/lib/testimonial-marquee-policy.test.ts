import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getTestimonialMarqueeRowLayout,
  shouldAnimateTestimonialMarquee,
  TESTIMONIAL_MARQUEE_GAP_REM,
} from './testimonial-marquee-policy';

test('testimonial marquee stays static for short 1–5 item collections', () => {
  for (let count = 1; count <= 5; count += 1) {
    assert.equal(shouldAnimateTestimonialMarquee(count), false, `${count} items`);
  }
});

test('testimonial marquee animates only once both rails can remain populated', () => {
  assert.equal(shouldAnimateTestimonialMarquee(6), true);
  assert.equal(shouldAnimateTestimonialMarquee(12), true);
});

test('each repeated marquee copy covers the complete rail at every supported row size', () => {
  for (let itemCount = 1; itemCount <= 24; itemCount += 1) {
    const layout = getTestimonialMarqueeRowLayout(itemCount);
    const totalCardCoverageCqw = layout.itemCount * layout.cardShareCqw;
    const totalGapCompensationRem = layout.itemCount * layout.gapCompensationRem;
    const renderedGapsRem = (layout.itemCount - 1) * TESTIMONIAL_MARQUEE_GAP_REM;

    assert.equal(layout.gapRem, TESTIMONIAL_MARQUEE_GAP_REM);
    assert.ok(Math.abs(totalCardCoverageCqw - 100) < 1e-9, `${itemCount} cards do not span 100cqw`);
    assert.ok(Math.abs(totalGapCompensationRem - renderedGapsRem) < 1e-9, `${itemCount} cards do not compensate their gaps`);
    assert.match(layout.cardWidth, /^max\(17\.5rem, calc\(.+cqw - .+rem\)\)$/);
  }
});
