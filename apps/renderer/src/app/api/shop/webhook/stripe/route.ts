import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { orders, shopSettings, orderStatusHistory } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { sendOrderEmails } from '@/lib/shop-email';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new NextResponse('Missing signature', { status: 400 });
  }

  const db = getDb();

  // Stripe events embed our tenantId in metadata when we create the Checkout
  // Session. We parse the body untrusted only to discover *which* tenant's
  // webhook secret to verify against — the signature check below still gates
  // every state change, so forging metadata is harmless.
  let candidateTenantId: string | undefined;
  let candidateOrderId: string | undefined;
  try {
    const parsed = JSON.parse(body) as { data?: { object?: { metadata?: Record<string, string> } } };
    candidateTenantId = parsed?.data?.object?.metadata?.tenantId;
    candidateOrderId = parsed?.data?.object?.metadata?.orderId;
  } catch {
    return new NextResponse('Invalid JSON', { status: 400 });
  }

  if (!candidateTenantId) {
    return new NextResponse('Missing tenant metadata', { status: 400 });
  }

  const [settings] = await db.select().from(shopSettings)
    .where(eq(shopSettings.tenantId, candidateTenantId))
    .limit(1);

  if (!settings?.stripeSecretKey || !settings?.stripeWebhookSecret) {
    return new NextResponse('Tenant not configured for Stripe', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(settings.stripeSecretKey, { apiVersion: '2026-04-22.dahlia' });
    event = stripe.webhooks.constructEvent(body, signature, settings.stripeWebhookSecret);
  } catch {
    return new NextResponse('Webhook signature verification failed', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId || candidateOrderId;
    const tenantId = session.metadata?.tenantId || candidateTenantId;
    if (!orderId || tenantId !== candidateTenantId) {
      return new NextResponse('ok', { status: 200 });
    }

    const [order] = await db.select().from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)));

    if (order && (order.status === 'pending' || order.status === 'awaiting_payment')) {
      await db.update(orders).set({
        status: 'paid',
        paymentStatus: 'paid',
        paymentId: session.payment_intent as string || session.id,
        updatedAt: new Date(),
      }).where(eq(orders.id, orderId));

      await db.insert(orderStatusHistory).values({
        orderId,
        oldStatus: order.status,
        newStatus: 'paid',
        note: 'Stripe payment confirmed',
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
  }

  return new NextResponse('ok', { status: 200 });
}
