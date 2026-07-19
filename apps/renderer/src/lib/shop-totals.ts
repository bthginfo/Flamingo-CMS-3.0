/**
 * Single source of truth for shop money math.
 *
 * The checkout API (what the customer is *charged*) and the coupon API / cart UI
 * (what the customer is *shown*) must never diverge. Both now go through these
 * pure helpers, so e.g. a `free_shipping` coupon zeroes shipping on the server
 * too, and a fixed discount is capped the same way everywhere.
 *
 * All amounts are integer cents. German gross pricing: tax is broken out for the
 * invoice but is already included in the prices, so it is NOT added to the total.
 */

export type TotalsItem = { priceCents: number; quantity: number; taxRate?: number | null };
export type ShippingLike = { priceCents: number; freeAboveCents?: number | null } | null | undefined;
export type CouponLike = { type: string; value: number } | null | undefined;

export function computeSubtotalCents(items: TotalsItem[]): number {
  return items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
}

/** Tax contained in gross prices, summed per item (supports mixed 19/7/0%). */
export function computeTaxCents(items: TotalsItem[]): number {
  return items.reduce((sum, i) => {
    const rate = i.taxRate ?? 0;
    if (rate <= 0) return sum;
    const itemTotal = i.priceCents * i.quantity;
    return sum + Math.round((itemTotal * rate) / (100 + rate));
  }, 0);
}

/** Tax contained in gross prices after a gross discount has been allocated
 * proportionally across the eligible products. */
export function computeTaxCentsAfterDiscount(
  items: (TotalsItem & { productId?: string })[],
  discountCents: number,
  eligibleProductIds?: string[],
): number {
  if (discountCents <= 0) return computeTaxCents(items);
  const eligible = eligibleProductIds?.length
    ? items.filter(item => item.productId && eligibleProductIds.includes(item.productId))
    : items;
  const eligibleSubtotal = computeSubtotalCents(eligible);
  if (eligibleSubtotal <= 0) return computeTaxCents(items);

  return items.reduce((sum, item) => {
    const rate = item.taxRate ?? 0;
    if (rate <= 0) return sum;
    const gross = item.priceCents * item.quantity;
    const canDiscount = eligible.includes(item);
    const allocatedDiscount = canDiscount
      ? Math.min(gross, Math.round(discountCents * gross / eligibleSubtotal))
      : 0;
    return sum + Math.round(((gross - allocatedDiscount) * rate) / (100 + rate));
  }, 0);
}

/** The discount + free-shipping effect of a coupon (already validated upstream). */
export function couponEffect(
  coupon: CouponLike,
  subtotalCents: number,
): { discountCents: number; freeShipping: boolean } {
  if (!coupon) return { discountCents: 0, freeShipping: false };
  switch (coupon.type) {
    case 'percent':
      return { discountCents: Math.round((subtotalCents * coupon.value) / 100), freeShipping: false };
    case 'free_shipping':
      return { discountCents: 0, freeShipping: true };
    default: // fixed_amount — never discount more than the subtotal
      return { discountCents: Math.min(coupon.value, subtotalCents), freeShipping: false };
  }
}

export function computeShippingCents(
  method: ShippingLike,
  subtotalCents: number,
  freeShipping = false,
): number {
  if (!method) return 0;
  if (freeShipping) return 0;
  if (method.freeAboveCents && subtotalCents >= method.freeAboveCents) return 0;
  return method.priceCents;
}

export type OrderTotals = {
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  discountCents: number;
  freeShipping: boolean;
  totalCents: number;
};

export function computeOrderTotals(args: {
  items: TotalsItem[];
  shipping?: ShippingLike;
  coupon?: CouponLike;
}): OrderTotals {
  const subtotalCents = computeSubtotalCents(args.items);
  const { discountCents, freeShipping } = couponEffect(args.coupon, subtotalCents);
  const shippingCents = computeShippingCents(args.shipping, subtotalCents, freeShipping);
  const taxCents = computeTaxCents(args.items);
  const totalCents = Math.max(0, subtotalCents + shippingCents - discountCents);
  return { subtotalCents, shippingCents, taxCents, discountCents, freeShipping, totalCents };
}
