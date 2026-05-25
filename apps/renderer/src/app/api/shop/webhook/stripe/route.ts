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

  // We need to find the tenant by the order's paymentId (session ID)
  // First, try to parse event without verification to get metadata
  let event: Stripe.Event;

  // Get all shop settings with stripe configured to find the right webhook secret
  const allSettings = await db.select().from(shopSettings);
  let matched = false;

  for (const settings of allSettings) {
    if (!settings.stripeSecretKey || !settings.stripeWebhookSecret) continue;

    try {
      const stripe = new Stripe(settings.stripeSecretKey, { apiVersion: '2026-04-22.dahlia' });
      event = stripe.webhooks.constructEvent(body, signature, settings.stripeWebhookSecret);
      matched = true;

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        const tenantId = session.metadata?.tenantId;

        if (!orderId || !tenantId) continue;

        // Update order to paid
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

          // Send confirmation emails now
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

      break;
    } catch {
      // Wrong webhook secret, try next tenant
      continue;
    }
  }

  if (!matched) {
    return new NextResponse('Webhook signature verification failed', { status: 400 });
  }

  return new NextResponse('ok', { status: 200 });
}
