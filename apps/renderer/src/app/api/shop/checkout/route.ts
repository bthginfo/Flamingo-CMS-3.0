import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { orders, products, productVariants, shopSettings, customers, orderStatusHistory, coupons, shippingMethods, shippingZones } from '@flamingo/db';
import { eq, and, sql, ne } from 'drizzle-orm';
import { resolveTenant } from '@/lib/snapshot';
import { sendOrderEmails } from '@/lib/shop-email';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { getTaxRate } from '@/lib/tax';
import { couponEffect, computeShippingCents, computeTaxCents } from '@/lib/shop-totals';
import Stripe from 'stripe';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function resolveExplicitTenant(queryTenantId: unknown) {
  const fixedTenantId = process.env.FIXED_TENANT_ID;
  if (typeof queryTenantId !== 'string' || !UUID_RE.test(queryTenantId)) return null;
  if (fixedTenantId) return queryTenantId === fixedTenantId ? queryTenantId : null;
  return queryTenantId;
}

// Tax rate resolution is provided by lib/tax (DB-backed tax_rates table
// with per-class defaults). The local fallback below is kept inline only as
// a safety net for the unlikely case where the DB lookup fails synchronously.

type OrderItem = {
  productId: string;
  categoryId?: string;
  variantId?: string;
  title: string;
  variantName?: string;
  quantity: number;
  priceCents: number;
  taxRate: number;
  isDigital: boolean;
};

type ReservedItem = Pick<OrderItem, 'productId' | 'variantId' | 'quantity'>;

async function releaseReservedStock(db: ReturnType<typeof getDb>, tenantId: string, reservedItems: ReservedItem[]) {
  for (const reserved of reservedItems) {
    if (reserved.variantId) {
      await db.execute(sql`UPDATE product_variants SET stock = stock + ${reserved.quantity} WHERE id = ${reserved.variantId} AND tenant_id = ${tenantId}`);
    } else {
      await db.execute(sql`UPDATE products SET stock = stock + ${reserved.quantity} WHERE id = ${reserved.productId} AND tenant_id = ${tenantId} AND track_stock = true`);
    }
  }
}

async function releaseCouponUsage(db: ReturnType<typeof getDb>, couponId: string | null) {
  if (!couponId) return;
  await db.execute(sql`UPDATE coupons SET used_count = GREATEST(used_count - 1, 0) WHERE id = ${couponId}`);
}

async function cancelOrder(db: ReturnType<typeof getDb>, tenantId: string, orderId: string, oldStatus: string, note: string) {
  await db.update(orders)
    .set({ status: 'cancelled', updatedAt: new Date() })
    .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)));
  await db.insert(orderStatusHistory).values({
    orderId,
    oldStatus,
    newStatus: 'cancelled',
    note,
  });
}

async function rollbackCheckoutFailure(
  db: ReturnType<typeof getDb>,
  tenantId: string,
  orderId: string,
  oldStatus: string,
  reservedItems: ReservedItem[],
  couponId: string | null,
  note: string
) {
  await releaseReservedStock(db, tenantId, reservedItems);
  await releaseCouponUsage(db, couponId);
  await cancelOrder(db, tenantId, orderId, oldStatus, note);
}

async function reserveOrderNumber(db: ReturnType<typeof getDb>, tenantId: string, fallbackPrefix: string) {
  const result = await db.execute(sql`
    UPDATE shop_settings
    SET next_order_number = next_order_number + 1
    WHERE tenant_id = ${tenantId}
    RETURNING order_prefix, next_order_number
  `);
  const row = result.rows?.[0] as { order_prefix?: string; next_order_number?: number } | undefined;
  const reservedNumber = Number(row?.next_order_number ?? 2) - 1;
  const prefix = row?.order_prefix || fallbackPrefix;
  return `${prefix}-${String(reservedNumber).padStart(4, '0')}`;
}

async function recordCustomerOrder(
  db: ReturnType<typeof getDb>,
  input: {
    tenantId: string;
    email: string;
    name: string;
    phone?: string | null;
    totalCents: number;
    address: { street: string; city: string; zip: string; country: string; company?: string };
  },
) {
  const now = new Date();
  await db.insert(customers).values({
    tenantId: input.tenantId,
    email: input.email,
    name: input.name,
    phone: input.phone || null,
    defaultShippingAddress: input.address,
    orderCount: 1,
    totalSpentCents: input.totalCents,
    firstOrderAt: now,
    lastOrderAt: now,
  }).onConflictDoUpdate({
    target: [customers.tenantId, customers.email],
    set: {
      name: input.name,
      phone: input.phone || null,
      defaultShippingAddress: input.address,
      orderCount: sql`${customers.orderCount} + 1`,
      totalSpentCents: sql`${customers.totalSpentCents} + ${input.totalCents}`,
      lastOrderAt: now,
    },
  });
}

async function recordCustomerOrderSafely(
  db: ReturnType<typeof getDb>,
  input: Parameters<typeof recordCustomerOrder>[1],
) {
  try {
    await recordCustomerOrder(db, input);
  } catch (error) {
    // Customer analytics must never invalidate a successfully created payment
    // session. The order remains the source of truth and can be reconciled.
    console.error('[Checkout] Customer analytics update failed:', error);
  }
}

const ALLOWED_PAYMENT_METHODS = new Set(['prepayment', 'invoice', 'pickup', 'cash', 'stripe', 'paypal', 'sumup']);
const MAX_ORDER_ITEMS = 100;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
    if (!body || typeof body !== 'object') throw new Error('not an object');
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }
  const tenantId = resolveExplicitTenant(body.tenantId) || await resolveTenant();
  if (!tenantId) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  // Rate limit: 10 checkout attempts / 10 min per IP+tenant. Slows down both
  // card-testing bots and accidental double-submits.
  const ip = getClientIp(req);
  const rl = rateLimit(`checkout:${tenantId}:${ip}`, 10, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Zu viele Bestellversuche. Bitte sp\u00e4ter erneut versuchen.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetMs / 1000)) } },
    );
  }

  const { name, email, phone, street, city, zip, country, company, paymentMethod, customerNotes, items, shippingMethod: shippingMethodId, couponCode, idempotencyKey } = body as Record<string, any>;

  if (!name || !email || !items?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
  }
  if (!ALLOWED_PAYMENT_METHODS.has(paymentMethod)) {
    return NextResponse.json({ error: 'Ungültige Zahlungsart.' }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length > MAX_ORDER_ITEMS) {
    // Every item costs product lookups — an unbounded list is a DoS vector.
    return NextResponse.json({ error: 'Zu viele Positionen im Warenkorb.' }, { status: 400 });
  }

  const db = getDb();

  // Idempotency: reject duplicate submissions
  if (idempotencyKey) {
    const [existing] = await db.select({ id: orders.id, orderNumber: orders.orderNumber })
      .from(orders)
      .where(and(eq(orders.tenantId, tenantId), eq(orders.idempotencyKey, idempotencyKey)))
      .limit(1);
    if (existing) {
      return NextResponse.json({ success: true, orderNumber: existing.orderNumber, orderId: existing.id, duplicate: true });
    }
  }

  // Get shop settings for order number
  const [settings] = await db.select().from(shopSettings).where(eq(shopSettings.tenantId, tenantId)).limit(1);
  if (!settings) return NextResponse.json({ error: 'Shop not configured' }, { status: 400 });

  const enabledPaymentMethods = new Set(
    Array.isArray(settings.paymentMethods) ? settings.paymentMethods : ['prepayment'],
  );
  if (!enabledPaymentMethods.has(paymentMethod)) {
    return NextResponse.json({ error: 'Diese Zahlungsart ist für diesen Shop nicht aktiviert.' }, { status: 400 });
  }
  if (paymentMethod === 'pickup' && !settings.pickupEnabled) {
    return NextResponse.json({ error: 'Abholung ist für diesen Shop nicht aktiviert.' }, { status: 400 });
  }

  const externalPaymentMethods = new Set(['stripe', 'paypal', 'sumup']);
  const isExternalPayment = externalPaymentMethods.has(paymentMethod);
  if (isExternalPayment) {
    const configured =
      (paymentMethod === 'stripe' && settings.stripeSecretKey) ||
      (paymentMethod === 'paypal' && settings.paypalClientId && settings.paypalSecret) ||
      (paymentMethod === 'sumup' && settings.sumupApiKey && settings.sumupMerchantCode);
    if (!configured) {
      return NextResponse.json({ error: 'Diese Zahlungsart ist nicht vollständig konfiguriert.' }, { status: 400 });
    }
  }

  // Resolve product prices and build order items
  const orderItems: OrderItem[] = [];
  const missingProducts: string[] = [];
  let subtotalCents = 0;
  let requiresShipping = false;

  for (const item of items) {
    const [product] = await db.select().from(products)
      .where(and(eq(products.id, item.productId), eq(products.tenantId, tenantId), eq(products.status, 'active')))
      .limit(1);
    if (!product) {
      // Customer's cart referenced a product that no longer exists / belongs
      // to a different tenant. Never silently drop — refuse the order so the
      // displayed cart total cannot diverge from what gets charged.
      missingProducts.push(String(item.productId));
      continue;
    }

    let priceCents = product.priceCents;
    let variantName: string | undefined;
    let availableStock = product.stock;
    let trackStock = product.trackStock;

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      return NextResponse.json({ error: 'Artikelmengen müssen ganze Zahlen zwischen 1 und 100 sein.' }, { status: 400 });
    }

    if (item.variantId) {
      const [variant] = await db.select().from(productVariants)
        .where(and(
          eq(productVariants.id, item.variantId),
          eq(productVariants.tenantId, tenantId),
          eq(productVariants.productId, product.id),
        ))
        .limit(1);
      if (!variant) {
        return NextResponse.json({ error: `Die gewählte Variante gehört nicht zu "${product.title}".` }, { status: 400 });
      }
      priceCents = variant.priceCents ?? product.priceCents;
      variantName = variant.name;
      availableStock = variant.stock ?? product.stock;
      trackStock = true; // variants always track
    }

    // Stock validation: reject if insufficient stock
    if (trackStock && availableStock < quantity) {
      return NextResponse.json({
        error: `Nicht genügend Bestand für "${product.title}"${variantName ? ` (${variantName})` : ''}. Verfügbar: ${availableStock}`,
        outOfStock: true,
        productId: product.id,
        available: availableStock,
      }, { status: 400 });
    }

    orderItems.push({
      productId: product.id,
      categoryId: product.categoryId || undefined,
      variantId: item.variantId || undefined,
      title: product.title,
      variantName,
      quantity,
      priceCents,
      taxRate: await getTaxRate(tenantId, product.taxClass),
      isDigital: product.isDigital,
    });
    subtotalCents += priceCents * quantity;
    if (!product.isDigital) requiresShipping = true;
  }

  if (orderItems.length === 0) {
    return NextResponse.json({ error: 'No valid items' }, { status: 400 });
  }
  if (missingProducts.length > 0) {
    return NextResponse.json({
      error: 'Einige Artikel in deinem Warenkorb sind nicht mehr verf\u00fcgbar. Bitte Warenkorb aktualisieren.',
      missingProductIds: missingProducts,
    }, { status: 409 });
  }

  // Server-side discount calculation (never trust client). Resolved BEFORE
  // shipping so a free_shipping coupon can zero the shipping cost — matching what
  // the cart/coupon API shows the customer (see lib/shop-totals.couponEffect).
  let discountCents = 0;
  let freeShipping = false;
  let appliedCouponId: string | null = null;
  if (couponCode) {
    const [coupon] = await db.select().from(coupons)
      .where(and(eq(coupons.tenantId, tenantId), eq(coupons.code, couponCode.toUpperCase()), eq(coupons.active, true)))
      .limit(1);
    if (coupon) {
      // Validate expiry and usage limits
      const now = new Date();
      const expired = (coupon.validUntil && now > coupon.validUntil) || (coupon.validFrom && now < coupon.validFrom);
      const maxedOut = coupon.maxUses && coupon.usedCount >= coupon.maxUses;
      if (expired) return NextResponse.json({ error: 'Der Gutscheincode ist nicht mehr gültig.' }, { status: 400 });
      if (maxedOut) return NextResponse.json({ error: 'Der Gutscheincode wurde bereits zu oft eingelöst.' }, { status: 400 });
      if (coupon.minOrderCents && subtotalCents < coupon.minOrderCents) {
        return NextResponse.json({ error: `Mindestbestellwert: ${(coupon.minOrderCents / 100).toFixed(2)} ${settings.currency}` }, { status: 400 });
      }

      if (coupon.maxUsesPerCustomer) {
        const [usage] = await db.select({ count: sql<number>`count(*)::int` }).from(orders)
          .where(and(
            eq(orders.tenantId, tenantId),
            sql`lower(${orders.customerEmail}) = lower(${email})`,
            eq(orders.couponCode, coupon.code),
            ne(orders.status, 'cancelled'),
          ));
        if ((usage?.count ?? 0) >= coupon.maxUsesPerCustomer) {
          return NextResponse.json({ error: 'Dieser Gutschein wurde für diese E-Mail-Adresse bereits vollständig genutzt.' }, { status: 400 });
        }
      }

      const appliesToIds = Array.isArray(coupon.appliesToIds) ? coupon.appliesToIds : [];
      const eligibleItems = orderItems.filter((orderItem) => {
        if (coupon.appliesTo === 'specific_products') return appliesToIds.includes(orderItem.productId);
        if (coupon.appliesTo === 'specific_categories') return !!orderItem.categoryId && appliesToIds.includes(orderItem.categoryId);
        return true;
      });
      const eligibleSubtotal = eligibleItems.reduce((sum, orderItem) => sum + orderItem.priceCents * orderItem.quantity, 0);
      if (eligibleSubtotal <= 0) {
        return NextResponse.json({ error: 'Der Gutscheincode gilt nicht für die gewählten Artikel.' }, { status: 400 });
      }

      if (!expired && !maxedOut) {
        const effect = couponEffect(coupon, eligibleSubtotal);
        // Atomic increment with max-uses guard (prevents race condition)
        const result = await db.execute(
          sql`UPDATE coupons SET used_count = used_count + 1 WHERE id = ${coupon.id} AND (max_uses IS NULL OR used_count < max_uses) RETURNING id`
        );
        if (result.rows?.length) {
          discountCents = effect.discountCents;
          freeShipping = effect.freeShipping;
          appliedCouponId = coupon.id;
        }
        // else race: coupon maxed out between check and increment → no effect
      }
    } else {
      return NextResponse.json({ error: 'Ungültiger Gutscheincode.' }, { status: 400 });
    }
  }

  // Server-side shipping cost validation (honours a free_shipping coupon)
  let shippingCents = 0;
  if (requiresShipping && paymentMethod !== 'pickup') {
    if (!street || !city || !zip || !country) {
      return NextResponse.json({ error: 'Für physische Artikel ist eine vollständige Lieferadresse erforderlich.' }, { status: 400 });
    }
    if (!shippingMethodId) {
      return NextResponse.json({ error: 'Bitte eine Versandmethode auswählen.' }, { status: 400 });
    }
    const [method] = await db.select().from(shippingMethods)
      .where(and(eq(shippingMethods.id, shippingMethodId), eq(shippingMethods.tenantId, tenantId), eq(shippingMethods.active, true)))
      .limit(1);
    if (!method) {
      return NextResponse.json({ error: 'Die gewählte Versandmethode ist nicht verfügbar.' }, { status: 400 });
    }
    const [zone] = await db.select({ countries: shippingZones.countries }).from(shippingZones)
      .where(and(eq(shippingZones.id, method.zoneId), eq(shippingZones.tenantId, tenantId)))
      .limit(1);
    const allowedCountries = Array.isArray(zone?.countries) ? zone.countries.map(value => value.toUpperCase()) : [];
    if (!zone || (allowedCountries.length > 0 && !allowedCountries.includes(String(country).toUpperCase()))) {
      return NextResponse.json({ error: 'Die gewählte Versandmethode gilt nicht für das Lieferland.' }, { status: 400 });
    }
    shippingCents = computeShippingCents(
      { priceCents: method.priceCents, freeAboveCents: method.freeAboveCents },
      subtotalCents,
      freeShipping,
    );
  }

  // Tax contained in the gross prices (informational; not added to the total).
  const taxCents = computeTaxCents(orderItems);

  // Ensure total never goes negative
  const totalCents = Math.max(0, subtotalCents + shippingCents - discountCents);

  // Reserve the next order number atomically so parallel checkouts do not collide.
  const orderNumber = await reserveOrderNumber(db, tenantId, settings.orderPrefix);

  // Create order
  const initialStatus = (paymentMethod === 'stripe' || paymentMethod === 'paypal' || paymentMethod === 'sumup') ? 'awaiting_payment' : paymentMethod === 'pickup' ? 'processing' : 'pending';
  const [order] = await db.insert(orders).values({
    tenantId,
    orderNumber,
    status: initialStatus,
    customerEmail: email,
    customerName: name,
    customerPhone: phone || null,
    shippingAddress: { street, city, zip, country, company: company || undefined },
    items: orderItems,
    subtotalCents,
    shippingCents,
    discountCents,
    taxCents,
    totalCents,
    paymentMethod,
    couponCode: couponCode || null,
    customerNotes: customerNotes || null,
    idempotencyKey: idempotencyKey || null,
  }).returning({ id: orders.id });

  // Add status history
  await db.insert(orderStatusHistory).values({
    orderId: order.id,
    oldStatus: null,
    newStatus: initialStatus,
  });

  // Reserve stock atomically. Neon HTTP does not provide interactive transactions here,
  // so each stock mutation guards against concurrent overselling and rolls back earlier reservations on failure.
  const reservedItems: ReservedItem[] = [];
  for (const item of orderItems) {
    let result: { rows?: unknown[] };
    if (item.variantId) {
      result = await db.execute(sql`
        UPDATE product_variants
        SET stock = stock - ${item.quantity}
        WHERE id = ${item.variantId}
          AND tenant_id = ${tenantId}
          AND stock >= ${item.quantity}
        RETURNING id
      `);
    } else {
      result = await db.execute(sql`
        UPDATE products
        SET stock = stock - ${item.quantity}
        WHERE id = ${item.productId}
          AND tenant_id = ${tenantId}
          AND track_stock = true
          AND stock >= ${item.quantity}
        RETURNING id
      `);
      if (!result.rows?.length) {
        const [untracked] = await db.select({ trackStock: products.trackStock }).from(products)
          .where(and(eq(products.id, item.productId), eq(products.tenantId, tenantId)))
          .limit(1);
        if (untracked && !untracked.trackStock) {
          reservedItems.push(item);
          continue;
        }
      }
    }

    if (!result.rows?.length) {
      await releaseReservedStock(db, tenantId, reservedItems);
      await releaseCouponUsage(db, appliedCouponId);
      await db.update(orders).set({ status: 'cancelled', updatedAt: new Date() }).where(and(eq(orders.id, order.id), eq(orders.tenantId, tenantId)));
      return NextResponse.json({
        error: 'Der Bestand hat sich gerade geändert. Bitte Warenkorb prüfen und erneut versuchen.',
        outOfStock: true,
        productId: item.productId,
      }, { status: 409 });
    }
    reservedItems.push(item);
  }

  // Send order confirmation emails (fire-and-forget) — only for immediate methods (not stripe/paypal/sumup which confirm async)
  if (!isExternalPayment) {
    sendOrderEmails(tenantId, {
      orderNumber,
      customerName: name,
      customerEmail: email,
      items: orderItems,
      subtotalCents,
      shippingCents,
      totalCents,
      paymentMethod: paymentMethod || '',
      shippingAddress: street ? { street, city, zip, country, company: company || undefined } : null,
    }).catch(e => console.error('[Checkout] Email send error:', e));
  }

  // If Stripe payment — create Checkout Session and return URL
  if (paymentMethod === 'stripe' && settings.stripeSecretKey) {
    try {
      const stripe = new Stripe(settings.stripeSecretKey, { apiVersion: '2026-04-22.dahlia' });
      const origin = req.headers.get('origin') || req.nextUrl.origin;

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: email,
        metadata: { orderId: order.id, tenantId },
        line_items: orderItems.map(item => ({
          price_data: {
            currency: settings.currency.toLowerCase(),
            product_data: { name: item.variantName ? `${item.title} (${item.variantName})` : item.title },
            unit_amount: item.priceCents,
          },
          quantity: item.quantity,
        })).concat(
          shippingCents > 0 ? [{ price_data: { currency: settings.currency.toLowerCase(), product_data: { name: 'Versand' }, unit_amount: shippingCents }, quantity: 1 }] : []
        ),
        ...(discountCents > 0 ? {
          discounts: [{
            coupon: (await stripe.coupons.create({
              amount_off: discountCents,
              currency: settings.currency.toLowerCase(),
              duration: 'once',
            })).id,
          }],
        } : {}),
        success_url: `${origin}/bestellung-abgeschlossen?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout`,
      });

      await db.update(orders).set({ paymentId: session.id }).where(eq(orders.id, order.id));
      await recordCustomerOrderSafely(db, {
        tenantId, email, name, phone, totalCents,
        address: { street, city, zip, country, company: company || undefined },
      });

      return NextResponse.json({ success: true, orderNumber, orderId: order.id, stripeUrl: session.url });
    } catch (e: any) {
      console.error('[Checkout] Stripe session error:', e);
      await rollbackCheckoutFailure(db, tenantId, order.id, initialStatus, reservedItems, appliedCouponId, 'Stripe checkout session could not be created.');
      return NextResponse.json({ error: 'Zahlung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.', stripeError: e.message }, { status: 502 });
    }
  }

  // If PayPal payment — create PayPal order and return approval URL
  if (paymentMethod === 'paypal' && settings.paypalClientId && settings.paypalSecret) {
    try {
      const origin = req.headers.get('origin') || req.nextUrl.origin;
      const baseUrl = settings.paypalMode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';

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

      // Create PayPal order
      const ppOrderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            reference_id: order.id,
            description: `Bestellung ${orderNumber}`,
            amount: {
              currency_code: settings.currency,
              value: (totalCents / 100).toFixed(2),
            },
          }],
          application_context: {
            return_url: `${origin}/api/shop/webhook/paypal?orderId=${order.id}&tenantId=${tenantId}`,
            cancel_url: `${origin}/checkout`,
            brand_name: 'Shop',
            user_action: 'PAY_NOW',
          },
        }),
      });
      const ppOrder = await ppOrderRes.json();
      const approveLink = ppOrder.links?.find((l: { rel: string; href: string }) => l.rel === 'approve')?.href;

      if (approveLink) {
        await db.update(orders).set({ paymentId: ppOrder.id }).where(eq(orders.id, order.id));
        await recordCustomerOrderSafely(db, {
          tenantId, email, name, phone, totalCents,
          address: { street, city, zip, country, company: company || undefined },
        });
        return NextResponse.json({ success: true, orderNumber, orderId: order.id, paypalUrl: approveLink });
      }
      console.error('[Checkout] PayPal approval link missing:', ppOrder);
      await rollbackCheckoutFailure(db, tenantId, order.id, initialStatus, reservedItems, appliedCouponId, 'PayPal approval link missing.');
      return NextResponse.json({ error: 'PayPal-Zahlung konnte nicht gestartet werden.' }, { status: 502 });
    } catch (e: any) {
      console.error('[Checkout] PayPal order error:', e);
      await rollbackCheckoutFailure(db, tenantId, order.id, initialStatus, reservedItems, appliedCouponId, 'PayPal order could not be created.');
      return NextResponse.json({ error: 'PayPal-Zahlung konnte nicht gestartet werden.', paypalError: e.message }, { status: 502 });
    }
  }

  // If SumUp payment — create SumUp checkout and return redirect URL
  if (paymentMethod === 'sumup' && settings.sumupApiKey && settings.sumupMerchantCode) {
    try {
      const origin = req.headers.get('origin') || req.nextUrl.origin;
      const baseUrl = settings.sumupMode === 'live'
        ? 'https://api.sumup.com'
        : 'https://api.sumup.com'; // SumUp uses same URL, sandbox is account-based

      const checkoutRes = await fetch(`${baseUrl}/v0.1/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.sumupApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkout_reference: order.id,
          amount: totalCents / 100,
          currency: settings.currency,
          merchant_code: settings.sumupMerchantCode,
          description: `Bestellung ${orderNumber}`,
          redirect_url: `${origin}/api/shop/webhook/sumup?orderId=${order.id}&tenantId=${tenantId}`,
        }),
      });
      const checkout = await checkoutRes.json();

      if (checkout.id) {
        await db.update(orders).set({ paymentId: checkout.id }).where(eq(orders.id, order.id));
        await recordCustomerOrderSafely(db, {
          tenantId, email, name, phone, totalCents,
          address: { street, city, zip, country, company: company || undefined },
        });
        // SumUp hosted checkout URL
        const sumupUrl = `https://pay.sumup.com/b2c/v0.1/checkouts/${checkout.id}`;
        return NextResponse.json({ success: true, orderNumber, orderId: order.id, sumupUrl });
      } else {
        console.error('[Checkout] SumUp create error:', checkout);
        await rollbackCheckoutFailure(db, tenantId, order.id, initialStatus, reservedItems, appliedCouponId, 'SumUp checkout response did not contain an id.');
        return NextResponse.json({ error: 'SumUp-Zahlung konnte nicht gestartet werden.' }, { status: 502 });
      }
    } catch (e: any) {
      console.error('[Checkout] SumUp checkout error:', e);
      await rollbackCheckoutFailure(db, tenantId, order.id, initialStatus, reservedItems, appliedCouponId, 'SumUp checkout could not be created.');
      return NextResponse.json({ error: 'SumUp-Zahlung konnte nicht gestartet werden.', sumupError: e.message }, { status: 502 });
    }
  }

  if (isExternalPayment) {
    await rollbackCheckoutFailure(db, tenantId, order.id, initialStatus, reservedItems, appliedCouponId, 'External payment method reached fallback without payment URL.');
    return NextResponse.json({ error: 'Zahlung konnte nicht gestartet werden. Bitte prüfen Sie die Zahlungsart.' }, { status: 502 });
  }

  await recordCustomerOrderSafely(db, {
    tenantId, email, name, phone, totalCents,
    address: { street, city, zip, country, company: company || undefined },
  });

  return NextResponse.json({ success: true, orderNumber, orderId: order.id });
}
