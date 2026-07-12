export const MINIMUM_MARQUEE_ITEMS = 6;
export const TESTIMONIAL_MARQUEE_GAP_REM = 1;

function formatCssNumber(value: number): string {
  return Number(value.toFixed(6)).toString();
}

export function shouldAnimateTestimonialMarquee(itemCount: number): boolean {
  return Number.isFinite(itemCount) && itemCount >= MINIMUM_MARQUEE_ITEMS;
}

/**
 * Sizes every card against the marquee query container. The card shares add up
 * to 100cqw and subtract exactly the gaps between them, so each repeated copy
 * is always at least one full rail wide. The 17.5rem floor only increases that
 * coverage on narrow screens.
 */
export function getTestimonialMarqueeRowLayout(itemCount: number): {
  itemCount: number;
  gapRem: number;
  cardShareCqw: number;
  gapCompensationRem: number;
  cardWidth: string;
} {
  const normalizedCount = Number.isFinite(itemCount) ? Math.max(1, Math.floor(itemCount)) : 1;
  const cardShareCqw = 100 / normalizedCount;
  const gapCompensationRem = ((normalizedCount - 1) * TESTIMONIAL_MARQUEE_GAP_REM) / normalizedCount;

  return {
    itemCount: normalizedCount,
    gapRem: TESTIMONIAL_MARQUEE_GAP_REM,
    cardShareCqw,
    gapCompensationRem,
    cardWidth: `max(17.5rem, calc(${formatCssNumber(cardShareCqw)}cqw - ${formatCssNumber(gapCompensationRem)}rem))`,
  };
}
