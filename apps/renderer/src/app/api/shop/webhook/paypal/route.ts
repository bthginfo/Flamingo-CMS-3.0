import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { orders, shopSettings, orderStatusHistory } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { sendOrderEmails } from '@/lib/shop-email';

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

  const [settings] = await db.select().from(shopSettings)
    .where(eq(shopSettings.tenantId, tenantId)).limit(1);

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
    const { access_token } = await authRes.json();

    // Capture payment
    const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${token}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });
    const captureData = await captureRes.json();

    if (captureData.status === 'COMPLETED') {
      // Update order to paid
      await db.update(orders).set({
        status: 'paid',
        paymentStatus: 'paid',
        paymentId: captureData.id,
        updatedAt: new Date(),
      }).where(eq(orders.id, orderId));

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
    }
  } catch (e) {
    console.error('[PayPal] Capture error:', e);
  }

  // Redirect to success page
  const origin = req.nextUrl.origin;
  return NextResponse.redirect(new URL('/bestellung-abgeschlossen', origin));
}
