import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { orders, shopSettings, orderStatusHistory } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { sendOrderEmails } from '@/lib/shop-email';
import Stripe from 'stripe';

/**
 * Per-tenant Stripe webhook endpoint.
 * URL pattern: /api/shop/webhook/stripe/<tenantId>
 *
 * This is the preferred endpoint for new shops — O(1) lookup of the
 * webhook secret. The legacy `/api/shop/webhook/stripe` route remains for
 * backward compatibility but iterates all tenants per request.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;
  const signature = req.headers.get('stripe-signature');
  if (!signature) return new NextResponse('Missing signature', { status: 400 });

  const body = await req.text();
  const db = getDb();

  const [settings] = await db.select().from(shopSettings)
    .where(eq(shopSettings.tenantId, tenantId))
    .limit(1);

  if (!settings?.stripeSecretKey || !settings?.stripeWebhookSecret) {
    return new NextResponse('Tenant not configured for Stripe', { status: 404 });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(settings.stripeSecretKey, { apiVersion: '2026-04-22.dahlia' });
    event = stripe.webhooks.constructEvent(body, signature, settings.stripeWebhookSecret);
  } catch {
    return new NextResponse('Signature verification failed', { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return new NextResponse('ok', { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  const metaTenantId = session.metadata?.tenantId;

  // Defence in depth: metadata tenantId must match URL tenantId
  if (!orderId || metaTenantId !== tenantId) {
    return new NextResponse('Order/tenant mismatch', { status: 400 });
  }

  const [order] = await db.select().from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)));

  if (order && (order.status === 'pending' || order.status === 'awaiting_payment')) {
    await db.update(orders).set({
      status: 'paid',
      paymentStatus: 'paid',
      paymentId: (session.payment_intent as string) || session.id,
      updatedAt: new Date(),
    }).where(eq(orders.id, orderId));

    await db.insert(orderStatusHistory).values({
      orderId,
      oldStatus: order.status,
      newStatus: 'paid',
      note: 'Stripe payment confirmed (per-tenant webhook)',
    });

    sendOrderEmails(tenantId, {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items as any,
      subtotalCents: order.subtotalCents,
      shippingCents: order.shippingCents,
      totalCents: order.totalCents,
      paymentMethod: 'Kreditkarte (Stripe)',
      shippingAddress: order.shippingAddress as any,
    }).catch(e => console.error('[Stripe Webhook] Email error:', e));
  }

  return new NextResponse('ok', { status: 200 });
}
