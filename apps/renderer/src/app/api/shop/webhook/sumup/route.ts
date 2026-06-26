import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { orders, shopSettings, orderStatusHistory } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { sendOrderEmails } from '@/lib/shop-email';

/**
 * SumUp redirect handler.
 * After payment on SumUp hosted checkout, the buyer is redirected here.
 * We verify the checkout status and update the order.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const orderId = searchParams.get('orderId');
  const tenantId = searchParams.get('tenantId');

  if (!orderId || !tenantId) {
    return NextResponse.redirect(new URL('/checkout', req.url));
  }

  const db = getDb();

  const [order] = await db.select().from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)));
  if (!order) return NextResponse.redirect(new URL('/checkout', req.url));

  // Idempotency: the buyer can reload this redirect URL. Without this guard we
  // would re-verify, re-write status/history and re-send the confirmation email
  // on every reload. If the order is already paid, just go to the success page.
  if (order.paymentStatus === 'paid' || order.status === 'paid') {
    return NextResponse.redirect(new URL('/bestellung-abgeschlossen', req.nextUrl.origin));
  }

  const [settings] = await db.select().from(shopSettings)
    .where(eq(shopSettings.tenantId, tenantId)).limit(1);

  if (!settings?.sumupApiKey) {
    return NextResponse.redirect(new URL('/checkout', req.url));
  }

  try {
    // Verify checkout status with SumUp API
    const checkoutRes = await fetch(`https://api.sumup.com/v0.1/checkouts/${order.paymentId}`, {
      headers: { 'Authorization': `Bearer ${settings.sumupApiKey}` },
    });
    const checkout = await checkoutRes.json();

    if (checkout.status !== 'PAID') {
      return NextResponse.redirect(new URL('/checkout?error=payment_failed', req.nextUrl.origin));
    }

    // Update order to paid
    await db.update(orders).set({
      status: 'paid',
      paymentStatus: 'paid',
      updatedAt: new Date(),
    }).where(eq(orders.id, orderId));

    await db.insert(orderStatusHistory).values({
      orderId,
      oldStatus: order.status,
      newStatus: 'paid',
      note: `SumUp payment confirmed (${checkout.transaction_id || checkout.id})`,
    });

    // Send confirmation emails
    sendOrderEmails(tenantId, {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items as any,
      subtotalCents: order.subtotalCents,
      shippingCents: order.shippingCents,
      totalCents: order.totalCents,
      paymentMethod: 'SumUp',
      shippingAddress: order.shippingAddress as any,
    }).catch(e => console.error('[SumUp] Email error:', e));
  } catch (e) {
    console.error('[SumUp] Verification error:', e);
    return NextResponse.redirect(new URL('/checkout?error=payment_failed', req.nextUrl.origin));
  }

  return NextResponse.redirect(new URL('/bestellung-abgeschlossen', req.nextUrl.origin));
}
