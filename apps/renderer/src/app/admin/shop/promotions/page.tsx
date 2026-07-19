import { redirect } from 'next/navigation';

export default function PromotionsPage() {
  // Automatic promotion rules are intentionally not exposed until their
  // checkout calculation and customer-facing price preview share one engine.
  // Coupon codes are fully supported and are the safe discount workflow.
  redirect('/admin/shop/coupons');
}
