import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { orders, shopSettings, orderStatusHistory } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { sendOrderEmails } from '@/lib/shop-email';
import { revealShopSecrets } from '@/lib/secret-storage';

/**
 * PayPal return URL handler.
 * After the buyer approves payment on PayPal, they're redirected here.
 * We capture the payment and update the order status.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const orderId = searchParams.get('orderId');
  const tenantId = searchParams.get('tenantId');
  const token = searchParams.get('token'); // PayPal order ID

  if (!orderId || !tenantId || !token) {
    return NextResponse.redirect(new URL('/checkout', req.url));
  }

  const db = getDb();

  const [order] = await db.select().from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)));
  if (!order) return NextResponse.redirect(new URL('/checkout', req.url));
  if (order.paymentMethod !== 'paypal' || !order.paymentId || order.paymentId !== token) {
    return NextResponse.redirect(new URL('/checkout?error=payment_mismatch', req.nextUrl.origin));
  }

  // Idempotency: the buyer can reload this return URL. Without this guard we
  // would re-capture, re-write status/history and re-send the confirmation
  // email on every reload. If already paid, just go to the success page.
  if (order.paymentStatus === 'paid' || order.status === 'paid') {
    return NextResponse.redirect(new URL('/bestellung-abgeschlossen', req.nextUrl.origin));
  }

  const [storedSettings] = await db.select().from(shopSettings)
    .where(eq(shopSettings.tenantId, tenantId)).limit(1);
  const settings = storedSettings ? revealShopSecrets(storedSettings) : null;

  if (!settings?.paypalClientId || !settings?.paypalSecret) {
    return NextResponse.redirect(new URL('/checkout', req.url));
  }

  const baseUrl = settings.paypalMode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  try {
    // Get access token
    const authRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${settings.paypalClientId}:${settings.paypalSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!authRes.ok) throw new Error(`PayPal authentication failed (${authRes.status})`);
    const { access_token } = await authRes.json();
    if (!access_token) throw new Error('PayPal authentication returned no access token');

    // Capture payment
    const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${token}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });
    const captureData = await captureRes.json();

    if (!captureRes.ok || captureData.status !== 'COMPLETED') {
      return NextResponse.redirect(new URL('/checkout?error=payment_failed', req.nextUrl.origin));
    }

    const purchaseUnit = captureData.purchase_units?.[0];
    const capturedAmount = purchaseUnit?.payments?.captures?.[0]?.amount || purchaseUnit?.amount;
    const expectedValue = (order.totalCents / 100).toFixed(2);
    if (
      purchaseUnit?.reference_id !== order.id ||
      capturedAmount?.currency_code !== settings.currency ||
      capturedAmount?.value !== expectedValue
    ) {
      console.error('[PayPal] Captured payment did not match order', {
        orderId: order.id,
        paypalOrderId: token,
        referenceId: purchaseUnit?.reference_id,
        amount: capturedAmount?.value,
        currency: capturedAmount?.currency_code,
      });
      return NextResponse.redirect(new URL('/checkout?error=payment_mismatch', req.nextUrl.origin));
    }

    // Update order to paid
    const [updated] = await db.update(orders).set({
        status: 'paid',
        paymentStatus: 'paid',
        updatedAt: new Date(),
      }).where(and(
        eq(orders.id, orderId),
        eq(orders.tenantId, tenantId),
        eq(orders.paymentId, token),
        eq(orders.status, 'awaiting_payment'),
      )).returning({ id: orders.id });
    if (!updated) return NextResponse.redirect(new URL('/bestellung-abgeschlossen', req.nextUrl.origin));

      await db.insert(orderStatusHistory).values({
        orderId,
        oldStatus: order.status,
        newStatus: 'paid',
        note: 'PayPal payment captured',
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
        paymentMethod: 'PayPal',
        shippingAddress: order.shippingAddress as any,
      }).catch(e => console.error('[PayPal] Email error:', e));
  } catch (e) {
    console.error('[PayPal] Capture error:', e);
    return NextResponse.redirect(new URL('/checkout?error=payment_failed', req.nextUrl.origin));
  }

  // Redirect to success page
  const origin = req.nextUrl.origin;
  return NextResponse.redirect(new URL('/bestellung-abgeschlossen', origin));
}
