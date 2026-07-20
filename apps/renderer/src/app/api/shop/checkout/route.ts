import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { orders, products, productVariants, shopSettings, customers, orderStatusHistory, coupons, shippingMethods, shippingZones } from '@flamingo/db';
import { eq, and, sql, ne } from 'drizzle-orm';
import { isDemoTenant } from '@/lib/snapshot';
import { resolvePublicTenantId } from '@/lib/public-tenant';
import { sendOrderEmails } from '@/lib/shop-email';
import {
  claimPublicFlowRequest,
  completePublicFlowRequest,
  consumePublicFlowRateLimit,
  failPublicFlowRequest,
  fingerprintPublicFlowRequest,
  inspectPublicFlowRequest,
  publicFlowClaimResponse,
  publicFlowClientAddress,
  resolvePublicFlowIdempotencyKey,
} from '@/lib/public-flow-security';
import { getTaxRate } from '@/lib/tax';
import { couponEffect, computeShippingCents, computeTaxCentsAfterDiscount } from '@/lib/shop-totals';
import {
  externalProvisioningUncertain,
  runExternalCheckoutLifecycle,
} from '@/lib/checkout-recovery';
import Stripe from 'stripe';
import {
  isTrustedRendererContactOrigin,
  readBoundedRendererContactJson,
  RendererContactBodyInvalidError,
  RendererContactBodyTooLargeError,
} from '@/lib/renderer-contact-security';
import { revealShopSecrets } from '@/lib/secret-storage';
import { isShopActive } from '@/lib/shop-pages';

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
  trackStock: boolean;
};

type ReservedItem = Pick<OrderItem, 'productId' | 'variantId' | 'quantity'>;

async function reserveCheckoutStock(
  db: ReturnType<typeof getDb>,
  tenantId: string,
  idempotencyKey: string,
  orderId: string,
  items: ReservedItem[],
) {
  const variantAdjustments = JSON.stringify(items
    .filter((item): item is ReservedItem & { variantId: string } => Boolean(item.variantId))
    .map(item => ({ id: item.variantId, quantity: item.quantity })));
  const productAdjustments = JSON.stringify(items
    .filter(item => !item.variantId)
    .map(item => ({ id: item.productId, quantity: item.quantity })));

  const result = await db.execute(sql`
    WITH variant_adjustments AS MATERIALIZED (
      SELECT id, SUM(quantity)::integer AS quantity
      FROM jsonb_to_recordset(${variantAdjustments}::jsonb) AS item(id uuid, quantity integer)
      GROUP BY id
    ),
    product_adjustments AS MATERIALIZED (
      SELECT id, SUM(quantity)::integer AS quantity
      FROM jsonb_to_recordset(${productAdjustments}::jsonb) AS item(id uuid, quantity integer)
      GROUP BY id
    ),
    locked_flow AS MATERIALIZED (
      SELECT flow_request.id
      FROM public_flow_requests AS flow_request
      WHERE flow_request.tenant_id = ${tenantId}::uuid
        AND flow_request.flow = 'checkout'
        AND flow_request.idempotency_key = ${idempotencyKey}::uuid
        AND flow_request.status = 'processing'
      FOR UPDATE OF flow_request
    ),
    locked_order AS MATERIALIZED (
      SELECT shop_order.id
      FROM orders AS shop_order
      WHERE shop_order.id = ${orderId}::uuid
        AND shop_order.tenant_id = ${tenantId}::uuid
        AND shop_order.status <> 'cancelled'
      FOR UPDATE OF shop_order
    ),
    locked_variants AS MATERIALIZED (
      SELECT variant.id, variant.stock, adjustment.quantity
      FROM variant_adjustments AS adjustment
      JOIN product_variants AS variant
        ON variant.id = adjustment.id
       AND variant.tenant_id = ${tenantId}::uuid
      ORDER BY variant.id
      FOR UPDATE OF variant
    ),
    locked_products AS MATERIALIZED (
      SELECT product.id, product.stock, adjustment.quantity
      FROM product_adjustments AS adjustment
      JOIN products AS product
        ON product.id = adjustment.id
       AND product.tenant_id = ${tenantId}::uuid
       AND product.track_stock = true
      ORDER BY product.id
      FOR UPDATE OF product
    ),
    inventory_valid AS MATERIALIZED (
      SELECT
        EXISTS (SELECT 1 FROM locked_flow)
        AND EXISTS (SELECT 1 FROM locked_order)
        AND (SELECT COUNT(*) FROM variant_adjustments) = (SELECT COUNT(*) FROM locked_variants)
        AND (SELECT COUNT(*) FROM product_adjustments) = (SELECT COUNT(*) FROM locked_products)
        AND COALESCE((SELECT BOOL_AND(stock >= quantity) FROM locked_variants), true)
        AND COALESCE((SELECT BOOL_AND(stock >= quantity) FROM locked_products), true)
        AS valid
    ),
    recorded_reservation AS (
      UPDATE public_flow_requests AS flow_request
      SET
        response = COALESCE(flow_request.response, '{}'::jsonb)
          || jsonb_build_object('stockReserved', true),
        updated_at = now()
      FROM locked_flow AS locked
      WHERE flow_request.id = locked.id
        AND (SELECT valid FROM inventory_valid)
      RETURNING flow_request.id
    ),
    reserved_variants AS (
      UPDATE product_variants AS variant
      SET stock = variant.stock - locked.quantity
      FROM locked_variants AS locked
      WHERE variant.id = locked.id
        AND EXISTS (SELECT 1 FROM recorded_reservation)
      RETURNING variant.id
    ),
    reserved_products AS (
      UPDATE products AS product
      SET stock = product.stock - locked.quantity
      FROM locked_products AS locked
      WHERE product.id = locked.id
        AND EXISTS (SELECT 1 FROM recorded_reservation)
      RETURNING product.id
    )
    SELECT
      EXISTS (SELECT 1 FROM recorded_reservation) AS reserved,
      (SELECT COUNT(*)::integer FROM reserved_variants) AS reserved_variants,
      (SELECT COUNT(*)::integer FROM reserved_products) AS reserved_products
  `);
  return (result.rows?.[0] as { reserved?: boolean } | undefined)?.reserved === true;
}

async function rollbackCheckoutFailure(
  db: ReturnType<typeof getDb>,
  tenantId: string,
  idempotencyKey: string,
  orderId: string,
  oldStatus: string,
  reservedItems: ReservedItem[],
  couponId: string | null,
  note: string
) {
  const variantAdjustments = JSON.stringify(reservedItems
    .filter((item): item is ReservedItem & { variantId: string } => Boolean(item.variantId))
    .map(item => ({ id: item.variantId, quantity: item.quantity })));
  const productAdjustments = JSON.stringify(reservedItems
    .filter(item => !item.variantId)
    .map(item => ({ id: item.productId, quantity: item.quantity })));

  // One PostgreSQL statement is one transaction with neon-http. Both durable
  // rows are locked before the compensation starts; a retry can therefore
  // either own the whole rollback or observe that it already happened. A
  // transport error after COMMIT is safe to retry because status predicates
  // prevent a second stock/coupon credit.
  const result = await db.execute(sql`
    WITH locked_checkout AS MATERIALIZED (
      SELECT
        shop_order.id AS order_id,
        flow_request.id AS flow_id,
        NULLIF(flow_request.response ->> 'couponId', '')::uuid AS coupon_id,
        COALESCE((flow_request.response ->> 'stockReserved')::boolean, false) AS stock_reserved
      FROM orders AS shop_order
      JOIN public_flow_requests AS flow_request
        ON flow_request.tenant_id = shop_order.tenant_id
       AND flow_request.flow = 'checkout'
       AND flow_request.idempotency_key = ${idempotencyKey}::uuid
      WHERE shop_order.id = ${orderId}::uuid
        AND shop_order.tenant_id = ${tenantId}::uuid
        AND shop_order.status = ${oldStatus}::order_status
        AND flow_request.status = 'processing'
      FOR UPDATE OF shop_order, flow_request
    ),
    cancelled_order AS (
      UPDATE orders AS shop_order
      SET status = 'cancelled', updated_at = now()
      FROM locked_checkout AS locked
      WHERE shop_order.id = locked.order_id
      RETURNING shop_order.id
    ),
    rollback_claim AS (
      UPDATE public_flow_requests AS flow_request
      SET
        status = 'failed',
        response = jsonb_build_object('kind', 'checkout_rollback', 'orderId', ${orderId}),
        updated_at = now()
      FROM locked_checkout AS locked
      WHERE flow_request.id = locked.flow_id
        AND EXISTS (SELECT 1 FROM cancelled_order)
      RETURNING flow_request.id
    ),
    variant_adjustments AS MATERIALIZED (
      SELECT id, SUM(quantity)::integer AS quantity
      FROM jsonb_to_recordset(${variantAdjustments}::jsonb) AS item(id uuid, quantity integer)
      GROUP BY id
    ),
    restored_variants AS (
      UPDATE product_variants AS variant
      SET stock = variant.stock + adjustment.quantity
      FROM variant_adjustments AS adjustment
      WHERE variant.id = adjustment.id
        AND variant.tenant_id = ${tenantId}::uuid
        AND EXISTS (SELECT 1 FROM rollback_claim)
        AND EXISTS (SELECT 1 FROM locked_checkout AS locked WHERE locked.stock_reserved)
      RETURNING variant.id
    ),
    product_adjustments AS MATERIALIZED (
      SELECT id, SUM(quantity)::integer AS quantity
      FROM jsonb_to_recordset(${productAdjustments}::jsonb) AS item(id uuid, quantity integer)
      GROUP BY id
    ),
    restored_products AS (
      UPDATE products AS product
      SET stock = product.stock + adjustment.quantity
      FROM product_adjustments AS adjustment
      WHERE product.id = adjustment.id
        AND product.tenant_id = ${tenantId}::uuid
        AND EXISTS (SELECT 1 FROM rollback_claim)
        AND EXISTS (SELECT 1 FROM locked_checkout AS locked WHERE locked.stock_reserved)
      RETURNING product.id
    ),
    released_coupon AS (
      UPDATE coupons AS coupon
      SET used_count = GREATEST(coupon.used_count - 1, 0)
      FROM locked_checkout AS locked
      WHERE coupon.id = locked.coupon_id
        AND coupon.tenant_id = ${tenantId}::uuid
        AND (${couponId}::uuid IS NULL OR locked.coupon_id = ${couponId}::uuid)
        AND EXISTS (SELECT 1 FROM rollback_claim)
      RETURNING coupon.id
    ),
    recorded_history AS (
      INSERT INTO order_status_history (order_id, old_status, new_status, note)
      SELECT locked.order_id, ${oldStatus}, 'cancelled', ${note}
      FROM locked_checkout AS locked
      WHERE EXISTS (SELECT 1 FROM rollback_claim)
      RETURNING id
    )
    SELECT
      EXISTS (SELECT 1 FROM rollback_claim) AS rolled_back,
      (SELECT COUNT(*)::integer FROM restored_variants) AS restored_variants,
      (SELECT COUNT(*)::integer FROM restored_products) AS restored_products,
      EXISTS (SELECT 1 FROM released_coupon) AS released_coupon,
      EXISTS (SELECT 1 FROM recorded_history) AS recorded_history
  `);
  const row = result.rows?.[0] as { rolled_back?: boolean } | undefined;
  return row?.rolled_back === true;
}

async function rollbackCheckoutBeforeOrder(
  db: ReturnType<typeof getDb>,
  tenantId: string,
  idempotencyKey: string,
) {
  const result = await db.execute(sql`
    WITH locked_flow AS MATERIALIZED (
      SELECT
        flow_request.id,
        NULLIF(flow_request.response ->> 'couponId', '')::uuid AS coupon_id
      FROM public_flow_requests AS flow_request
      WHERE flow_request.tenant_id = ${tenantId}::uuid
        AND flow_request.flow = 'checkout'
        AND flow_request.idempotency_key = ${idempotencyKey}::uuid
        AND flow_request.status = 'processing'
      FOR UPDATE OF flow_request
    ),
    rollback_claim AS (
      UPDATE public_flow_requests AS flow_request
      SET status = 'failed', response = jsonb_build_object('kind', 'checkout_rollback'), updated_at = now()
      FROM locked_flow AS locked
      WHERE flow_request.id = locked.id
      RETURNING flow_request.id
    ),
    released_coupon AS (
      UPDATE coupons AS coupon
      SET used_count = GREATEST(coupon.used_count - 1, 0)
      FROM locked_flow AS locked
      WHERE coupon.id = locked.coupon_id
        AND coupon.tenant_id = ${tenantId}::uuid
        AND EXISTS (SELECT 1 FROM rollback_claim)
      RETURNING coupon.id
    )
    SELECT
      EXISTS (SELECT 1 FROM rollback_claim) AS rolled_back,
      EXISTS (SELECT 1 FROM released_coupon) AS released_coupon
  `);
  const row = result.rows?.[0] as { rolled_back?: boolean } | undefined;
  return row?.rolled_back === true;
}

async function claimCouponUsage(
  db: ReturnType<typeof getDb>,
  tenantId: string,
  idempotencyKey: string,
  couponId: string,
) {
  const result = await db.execute(sql`
    WITH locked_flow AS MATERIALIZED (
      SELECT flow_request.id
      FROM public_flow_requests AS flow_request
      WHERE flow_request.tenant_id = ${tenantId}::uuid
        AND flow_request.flow = 'checkout'
        AND flow_request.idempotency_key = ${idempotencyKey}::uuid
        AND flow_request.status = 'processing'
      FOR UPDATE OF flow_request
    ),
    applied_coupon AS (
      UPDATE coupons AS coupon
      SET used_count = coupon.used_count + 1
      FROM locked_flow AS locked
      WHERE coupon.id = ${couponId}::uuid
        AND coupon.tenant_id = ${tenantId}::uuid
        AND (coupon.max_uses IS NULL OR coupon.used_count < coupon.max_uses)
      RETURNING coupon.id
    ),
    recorded_claim AS (
      UPDATE public_flow_requests AS flow_request
      SET
        response = jsonb_build_object('kind', 'checkout_processing', 'couponId', applied.id),
        updated_at = now()
      FROM locked_flow AS locked, applied_coupon AS applied
      WHERE flow_request.id = locked.id
      RETURNING applied.id AS coupon_id
    )
    SELECT coupon_id FROM recorded_claim
  `);
  return (result.rows?.[0] as { coupon_id?: string } | undefined)?.coupon_id || null;
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
const MAX_CHECKOUT_REQUEST_BYTES = 256 * 1024;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  if (req.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json') {
    return NextResponse.json({ error: 'Content-Type wird nicht unterstützt.' }, { status: 415 });
  }
  if (!isTrustedRendererContactOrigin(req)) {
    return NextResponse.json({ error: 'Ungültiger Request-Ursprung.' }, { status: 403 });
  }
  try {
    body = await readBoundedRendererContactJson(req, MAX_CHECKOUT_REQUEST_BYTES) as Record<string, unknown>;
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new RendererContactBodyInvalidError();
  } catch (error) {
    if (error instanceof RendererContactBodyTooLargeError) {
      return NextResponse.json({ error: 'Die Anfrage ist zu groß.' }, { status: 413 });
    }
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }
  const tenantId = await resolvePublicTenantId(body.tenantId);
  if (!tenantId) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  if (!await isShopActive(tenantId)) return NextResponse.json({ error: 'Shop not found' }, { status: 404 });

  if (await isDemoTenant(tenantId)) {
    return NextResponse.json(
      { error: 'Demo-Bestellungen werden nicht gespeichert.' },
      { status: 403 },
    );
  }

  const { name, email, phone, street, city, zip, country, company, paymentMethod, customerNotes, items, shippingMethod: shippingMethodId, couponCode, idempotencyKey } = body as Record<string, any>;

  if (!isBoundedText(name, 200, true) || !isBoundedText(email, 320, true) || !items?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
  }
  if (!ALLOWED_PAYMENT_METHODS.has(paymentMethod)) {
    return NextResponse.json({ error: 'Ungültige Zahlungsart.' }, { status: 400 });
  }
  if (
    !isBoundedText(phone, 80)
    || !isBoundedText(street, 300)
    || !isBoundedText(city, 160)
    || !isBoundedText(zip, 32)
    || !isBoundedText(country, 2)
    || !isBoundedText(company, 200)
    || !isBoundedText(customerNotes, 5_000)
    || !isBoundedText(shippingMethodId, 80)
    || !isBoundedText(couponCode, 100)
  ) {
    return NextResponse.json({ error: 'Ungültige oder zu lange Eingabe.' }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length > MAX_ORDER_ITEMS) {
    // Every item costs product lookups — an unbounded list is a DoS vector.
    return NextResponse.json({ error: 'Zu viele Positionen im Warenkorb.' }, { status: 400 });
  }

  const resolvedIdempotencyKey = resolvePublicFlowIdempotencyKey(req, idempotencyKey);
  if (!resolvedIdempotencyKey) {
    return NextResponse.json({ error: 'Ein gültiger Idempotency-Key ist erforderlich.' }, { status: 400 });
  }
  const requestHash = fingerprintPublicFlowRequest('checkout', tenantId, {
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    phone: typeof phone === 'string' ? phone.trim() : '',
    street: typeof street === 'string' ? street.trim() : '',
    city: typeof city === 'string' ? city.trim() : '',
    zip: typeof zip === 'string' ? zip.trim() : '',
    country: typeof country === 'string' ? country.trim().toUpperCase() : '',
    company: typeof company === 'string' ? company.trim() : '',
    paymentMethod,
    customerNotes: typeof customerNotes === 'string' ? customerNotes.trim() : '',
    shippingMethodId,
    couponCode: typeof couponCode === 'string' ? couponCode.trim().toUpperCase() : '',
    items: items.map((item: Record<string, unknown>) => ({
      productId: item.productId,
      variantId: item.variantId || null,
      quantity: item.quantity,
    })),
  });

  const db = getDb();

  const existingFlow = await inspectPublicFlowRequest({
    flow: 'checkout', tenantId, idempotencyKey: resolvedIdempotencyKey, requestHash,
  });
  if (existingFlow) {
    const replay = publicFlowClaimResponse(existingFlow);
    if (replay) return NextResponse.json(replay.body, { status: replay.status });
  }

  // Legacy fallback for an order created before the public-flow audit row was
  // finalized. The unique order key remains the secondary safety net.
  {
    const [existing] = await db.select({ id: orders.id, orderNumber: orders.orderNumber })
      .from(orders)
      .where(and(eq(orders.tenantId, tenantId), eq(orders.idempotencyKey, resolvedIdempotencyKey)))
      .limit(1);
    if (existing) {
      return NextResponse.json({ success: true, orderNumber: existing.orderNumber, orderId: existing.id, duplicate: true });
    }
  }

  try {
    const denied = await consumePublicFlowRateLimit(
      'checkout', tenantId, publicFlowClientAddress(req), String(email),
    );
    if (denied) {
      return NextResponse.json(
        { error: 'Zu viele Bestellversuche. Bitte später erneut versuchen.' },
        { status: 429, headers: { 'Retry-After': String(denied.retryAfterSeconds) } },
      );
    }
  } catch (error) {
    console.error('[Checkout] persistent rate limit unavailable', error);
    return NextResponse.json(
      { error: 'Bestellungen sind vorübergehend nicht verfügbar.' },
      { status: 503, headers: { 'Retry-After': '60' } },
    );
  }

  // Get shop settings for order number
  const [storedSettings] = await db.select().from(shopSettings).where(eq(shopSettings.tenantId, tenantId)).limit(1);
  if (!storedSettings) return NextResponse.json({ error: 'Shop not configured' }, { status: 400 });
  const settings = revealShopSecrets(storedSettings);

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
  const stockReservationPlan: ReservedItem[] = [];
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
    if (product.isDigital) {
      return NextResponse.json({ error: `Das digitale Produkt "${product.title}" ist derzeit nicht verkäuflich.` }, { status: 409 });
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

    if (trackStock) {
      stockReservationPlan.push({
        productId: product.id,
        variantId: item.variantId || undefined,
        quantity,
      });
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
      trackStock,
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
  let pendingCoupon: { id: string; discountCents: number; freeShipping: boolean; eligibleProductIds: string[] } | null = null;
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
        pendingCoupon = { id: coupon.id, ...effect, eligibleProductIds: [...new Set(eligibleItems.map(item => item.productId))] };
        discountCents = effect.discountCents;
        freeShipping = effect.freeShipping;
      }
    } else {
      return NextResponse.json({ error: 'Ungültiger Gutscheincode.' }, { status: 400 });
    }
  }

  // Server-side shipping cost validation (honours a free_shipping coupon)
  let shippingCents = 0;
  let selectedShipping: { priceCents: number; freeAboveCents: number | null } | null = null;
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
    selectedShipping = { priceCents: method.priceCents, freeAboveCents: method.freeAboveCents };
    shippingCents = computeShippingCents(selectedShipping, subtotalCents, freeShipping);
  }

  const flowIdentity = {
    flow: 'checkout' as const,
    tenantId,
    idempotencyKey: resolvedIdempotencyKey,
    requestHash,
  };
  const flowClaim = await claimPublicFlowRequest(flowIdentity);
  const flowClaimResult = publicFlowClaimResponse(flowClaim);
  if (flowClaimResult) {
    return NextResponse.json(flowClaimResult.body, { status: flowClaimResult.status });
  }

  let orderForRecovery: { id: string; status: string } | null = null;
  let preserveOrder = false;
  const reservedItems = stockReservationPlan;
  const completeCheckout = async (resourceId: string, response: Record<string, unknown>) => {
    await completePublicFlowRequest({
      flow: 'checkout',
      tenantId,
      idempotencyKey: resolvedIdempotencyKey,
      resourceId,
      response,
    });
    return NextResponse.json(response);
  };
  const failCheckout = async (
    response: Record<string, unknown>,
    status: number,
    uncertain = false,
  ) => {
    await failPublicFlowRequest({
      flow: 'checkout',
      tenantId,
      idempotencyKey: resolvedIdempotencyKey,
      uncertain,
    }).catch(error => console.error('[Checkout] failed to finalize idempotency claim', error));
    return NextResponse.json({
      ...response,
      ...(uncertain
        ? { retryWithSameIdempotencyKey: true }
        : { retryWithNewIdempotencyKey: true }),
    }, { status });
  };
  try {
    if (pendingCoupon) {
      const claimedCouponId = await claimCouponUsage(
        db,
        tenantId,
        resolvedIdempotencyKey,
        pendingCoupon.id,
      );
      if (claimedCouponId) {
        discountCents = pendingCoupon.discountCents;
        freeShipping = pendingCoupon.freeShipping;
        appliedCouponId = claimedCouponId;
      } else {
        discountCents = 0;
        freeShipping = false;
        shippingCents = selectedShipping
          ? computeShippingCents(selectedShipping, subtotalCents, false)
          : 0;
      }
    }

  // Ensure total never goes negative
  const totalCents = Math.max(0, subtotalCents + shippingCents - discountCents);
  // German gross-price tax must be extracted after allocating discounts;
  // otherwise discounted orders overstate VAT on invoices.
  const taxCents = computeTaxCentsAfterDiscount(orderItems, discountCents, pendingCoupon?.eligibleProductIds);

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
    couponCode: appliedCouponId ? couponCode : null,
    customerNotes: customerNotes || null,
    idempotencyKey: resolvedIdempotencyKey,
  }).returning({ id: orders.id });
  orderForRecovery = { id: order.id, status: initialStatus };

  // Add status history
  await db.insert(orderStatusHistory).values({
    orderId: order.id,
    oldStatus: null,
    newStatus: initialStatus,
  });

  const stockReserved = await reserveCheckoutStock(
    db,
    tenantId,
    resolvedIdempotencyKey,
    order.id,
    reservedItems,
  );
  if (!stockReserved) {
    const rolledBack = await rollbackCheckoutFailure(
      db,
      tenantId,
      resolvedIdempotencyKey,
      order.id,
      initialStatus,
      reservedItems,
      appliedCouponId,
      'Stock changed during checkout.',
    );
    return failCheckout({
      error: 'Der Bestand hat sich gerade geändert. Bitte Warenkorb prüfen und erneut versuchen.',
      outOfStock: true,
    }, 409, !rolledBack);
  }

  // Immediate methods send their confirmation before finalizing idempotency.
  // SMTP failure does not invalidate the durable order, but the promise is
  // awaited so a serverless process cannot drop it on return.
  if (!isExternalPayment) {
    await sendOrderEmails(tenantId, {
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
    return runExternalCheckoutLifecycle({
      provision: async () => {
      const stripe = new Stripe(settings.stripeSecretKey!, { apiVersion: '2026-04-22.dahlia' });
      const origin = req.headers.get('origin') || req.nextUrl.origin;

      let stripeCouponId: string | undefined;
      if (discountCents > 0) {
        stripeCouponId = (await stripe.coupons.create({
          amount_off: discountCents,
          currency: settings.currency.toLowerCase(),
          duration: 'once',
        }, { idempotencyKey: `${resolvedIdempotencyKey}:coupon` })).id;
      }

      let session: Stripe.Checkout.Session;
      try {
        session = await stripe.checkout.sessions.create({
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
        ...(stripeCouponId ? {
          discounts: [{
            coupon: stripeCouponId,
          }],
        } : {}),
        success_url: `${origin}/bestellung-abgeschlossen?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout`,
        }, { idempotencyKey: `${resolvedIdempotencyKey}:session` });
      } catch (error) {
        return externalProvisioningUncertain(error);
      }
      return session;
      },
      finalizeProvisioned: async (session) => {
      preserveOrder = true;
      if (!session.id || !session.url) throw new Error('Stripe checkout session is incomplete.');
      await db.update(orders).set({ paymentId: session.id }).where(eq(orders.id, order.id));
      await recordCustomerOrderSafely(db, {
        tenantId, email, name, phone, totalCents,
        address: { street, city, zip, country, company: company || undefined },
      });

      const response = { success: true, orderNumber, orderId: order.id, stripeUrl: session.url };
      return await completeCheckout(order.id, response);
      },
      onProvisionFailure: async (error) => {
        console.error('[Checkout] Stripe provisioning error:', error);
        const rolledBack = await rollbackCheckoutFailure(
          db, tenantId, resolvedIdempotencyKey, order.id, initialStatus,
          reservedItems, appliedCouponId, 'Stripe checkout session could not be created.',
        );
        return failCheckout({ error: 'Zahlung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.' }, 502, !rolledBack);
      },
      onProvisioningUncertain: async (error) => {
        preserveOrder = true;
        console.error('[Checkout] Stripe provisioning outcome is uncertain:', error);
        return failCheckout({
          error: 'Der Zahlungsanbieter hat nicht eindeutig geantwortet. Bitte nicht erneut bestellen und den Support kontaktieren.',
          code: 'PAYMENT_PROVISIONING_UNCERTAIN',
        }, 502, true);
      },
      onPostProvisionFailure: async (error) => {
        preserveOrder = true;
        console.error('[Checkout] Stripe session exists; local finalization is uncertain:', error);
        return failCheckout({
          error: 'Die Zahlung wurde vorbereitet, der lokale Abschluss ist jedoch unklar. Bitte nicht erneut bestellen und den Support kontaktieren.',
          code: 'PAYMENT_PROVISIONED_UNCERTAIN',
        }, 500, true);
      },
    });
  }

  // If PayPal payment — create PayPal order and return approval URL
  if (paymentMethod === 'paypal' && settings.paypalClientId && settings.paypalSecret) {
    return runExternalCheckoutLifecycle({
      provision: async () => {
      const origin = req.headers.get('origin') || req.nextUrl.origin;
      const baseUrl = settings.paypalMode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';

      // Get access token
      const authRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${settings.paypalClientId!}:${settings.paypalSecret!}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });
      if (!authRes.ok) throw new Error(`PayPal authentication failed with ${authRes.status}.`);
      const { access_token } = await authRes.json();
      if (typeof access_token !== 'string' || !access_token) throw new Error('PayPal access token is missing.');

      // Create PayPal order
      let ppOrderRes: Response;
      let ppOrder: any;
      try {
        ppOrderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': resolvedIdempotencyKey,
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
        ppOrder = await ppOrderRes.json();
      } catch (error) {
        return externalProvisioningUncertain(error);
      }
      if (!ppOrderRes.ok) {
        if (ppOrderRes.status >= 500) return externalProvisioningUncertain(new Error(`PayPal returned ${ppOrderRes.status}.`));
        throw new Error(`PayPal rejected order provisioning with ${ppOrderRes.status}.`);
      }
      const approveLink = ppOrder.links?.find((l: { rel: string; href: string }) => l.rel === 'approve')?.href;
      if (typeof ppOrder.id !== 'string' || !ppOrder.id) {
        return externalProvisioningUncertain(new Error('PayPal response did not identify the created order.'));
      }
      return { id: ppOrder.id as string, approveLink: typeof approveLink === 'string' ? approveLink : null, ok: ppOrderRes.ok };
      },
      finalizeProvisioned: async (ppOrder) => {
        preserveOrder = true;
        if (!ppOrder.ok) throw new Error('PayPal returned an unsuccessful response after creating an order.');
        if (!ppOrder.approveLink) throw new Error('PayPal approval link is missing after provisioning.');
        await db.update(orders).set({ paymentId: ppOrder.id }).where(eq(orders.id, order.id));
        await recordCustomerOrderSafely(db, {
          tenantId, email, name, phone, totalCents,
          address: { street, city, zip, country, company: company || undefined },
        });
        const response = { success: true, orderNumber, orderId: order.id, paypalUrl: ppOrder.approveLink };
        return await completeCheckout(order.id, response);
      },
      onProvisionFailure: async (error) => {
        console.error('[Checkout] PayPal provisioning error:', error);
        const rolledBack = await rollbackCheckoutFailure(
          db, tenantId, resolvedIdempotencyKey, order.id, initialStatus,
          reservedItems, appliedCouponId, 'PayPal order could not be created.',
        );
        return failCheckout({ error: 'PayPal-Zahlung konnte nicht gestartet werden.' }, 502, !rolledBack);
      },
      onProvisioningUncertain: async (error) => {
        preserveOrder = true;
        console.error('[Checkout] PayPal provisioning outcome is uncertain:', error);
        return failCheckout({
          error: 'PayPal hat nicht eindeutig geantwortet. Bitte nicht erneut bestellen und den Support kontaktieren.',
          code: 'PAYMENT_PROVISIONING_UNCERTAIN',
        }, 502, true);
      },
      onPostProvisionFailure: async (error) => {
        preserveOrder = true;
        console.error('[Checkout] PayPal order exists; local finalization is uncertain:', error);
        return failCheckout({
          error: 'Die PayPal-Zahlung wurde vorbereitet, der lokale Abschluss ist jedoch unklar. Bitte nicht erneut bestellen und den Support kontaktieren.',
          code: 'PAYMENT_PROVISIONED_UNCERTAIN',
        }, 500, true);
      },
    });
  }

  // If SumUp payment — create SumUp checkout and return redirect URL
  if (paymentMethod === 'sumup' && settings.sumupApiKey && settings.sumupMerchantCode) {
    return runExternalCheckoutLifecycle({
      provision: async () => {
      const origin = req.headers.get('origin') || req.nextUrl.origin;
      const baseUrl = settings.sumupMode === 'live'
        ? 'https://api.sumup.com'
        : 'https://api.sumup.com'; // SumUp uses same URL, sandbox is account-based

      let checkoutRes: Response;
      let checkout: any;
      try {
        checkoutRes = await fetch(`${baseUrl}/v0.1/checkouts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${settings.sumupApiKey!}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': resolvedIdempotencyKey,
          },
          body: JSON.stringify({
            checkout_reference: order.id,
            amount: totalCents / 100,
            currency: settings.currency,
            merchant_code: settings.sumupMerchantCode!,
            description: `Bestellung ${orderNumber}`,
            redirect_url: `${origin}/api/shop/webhook/sumup?orderId=${order.id}&tenantId=${tenantId}`,
          }),
        });
        checkout = await checkoutRes.json();
      } catch (error) {
        return externalProvisioningUncertain(error);
      }
      if (!checkoutRes.ok) {
        if (checkoutRes.status >= 500) return externalProvisioningUncertain(new Error(`SumUp returned ${checkoutRes.status}.`));
        throw new Error(`SumUp rejected checkout provisioning with ${checkoutRes.status}.`);
      }
      if (typeof checkout.id !== 'string' || !checkout.id) {
        return externalProvisioningUncertain(new Error('SumUp response did not identify the created checkout.'));
      }
      return { id: checkout.id as string, ok: checkoutRes.ok };
      },
      finalizeProvisioned: async (checkout) => {
        preserveOrder = true;
        if (!checkout.ok) throw new Error('SumUp returned an unsuccessful response after creating a checkout.');
        await db.update(orders).set({ paymentId: checkout.id }).where(eq(orders.id, order.id));
        await recordCustomerOrderSafely(db, {
          tenantId, email, name, phone, totalCents,
          address: { street, city, zip, country, company: company || undefined },
        });
        // SumUp hosted checkout URL
        const sumupUrl = `https://pay.sumup.com/b2c/v0.1/checkouts/${checkout.id}`;
        const response = { success: true, orderNumber, orderId: order.id, sumupUrl };
        return await completeCheckout(order.id, response);
      },
      onProvisionFailure: async (error) => {
        console.error('[Checkout] SumUp provisioning error:', error);
        const rolledBack = await rollbackCheckoutFailure(
          db, tenantId, resolvedIdempotencyKey, order.id, initialStatus,
          reservedItems, appliedCouponId, 'SumUp checkout could not be created.',
        );
        return failCheckout({ error: 'SumUp-Zahlung konnte nicht gestartet werden.' }, 502, !rolledBack);
      },
      onProvisioningUncertain: async (error) => {
        preserveOrder = true;
        console.error('[Checkout] SumUp provisioning outcome is uncertain:', error);
        return failCheckout({
          error: 'SumUp hat nicht eindeutig geantwortet. Bitte nicht erneut bestellen und den Support kontaktieren.',
          code: 'PAYMENT_PROVISIONING_UNCERTAIN',
        }, 502, true);
      },
      onPostProvisionFailure: async (error) => {
        preserveOrder = true;
        console.error('[Checkout] SumUp checkout exists; local finalization is uncertain:', error);
        return failCheckout({
          error: 'Die SumUp-Zahlung wurde vorbereitet, der lokale Abschluss ist jedoch unklar. Bitte nicht erneut bestellen und den Support kontaktieren.',
          code: 'PAYMENT_PROVISIONED_UNCERTAIN',
        }, 500, true);
      },
    });
  }

  if (isExternalPayment) {
    const rolledBack = await rollbackCheckoutFailure(
      db, tenantId, resolvedIdempotencyKey, order.id, initialStatus,
      reservedItems, appliedCouponId, 'External payment method reached fallback without payment URL.',
    );
    return failCheckout({ error: 'Zahlung konnte nicht gestartet werden. Bitte prüfen Sie die Zahlungsart.' }, 502, !rolledBack);
  }

  await recordCustomerOrderSafely(db, {
    tenantId, email, name, phone, totalCents,
    address: { street, city, zip, country, company: company || undefined },
  });

  const response = { success: true, orderNumber, orderId: order.id };
  preserveOrder = true;
  return await completeCheckout(order.id, response);
  } catch (error) {
    let uncertain = preserveOrder;
    if (!preserveOrder) {
      try {
        let recoverableOrder = orderForRecovery;
        if (!recoverableOrder) {
          const [persistedOrder] = await db.select({ id: orders.id, status: orders.status })
            .from(orders)
            .where(and(
              eq(orders.tenantId, tenantId),
              eq(orders.idempotencyKey, resolvedIdempotencyKey),
            ))
            .limit(1);
          recoverableOrder = persistedOrder || null;
        }

        if (recoverableOrder) {
          const rolledBack = await rollbackCheckoutFailure(
            db,
            tenantId,
            resolvedIdempotencyKey,
            recoverableOrder.id,
            recoverableOrder.status,
            reservedItems,
            appliedCouponId,
            'Checkout aborted before a response was finalized.',
          );
          uncertain = !rolledBack;
        } else {
          const rolledBack = await rollbackCheckoutBeforeOrder(
            db,
            tenantId,
            resolvedIdempotencyKey,
          );
          uncertain = !rolledBack;
        }
      } catch (cleanupError) {
        uncertain = true;
        console.error('[Checkout] cleanup after unexpected failure failed', cleanupError);
      }
    }
    console.error('[Checkout] unexpected failure', error instanceof Error ? error.name : 'unknown');
    return failCheckout({ error: 'Bestellung konnte nicht abgeschlossen werden.' }, 500, uncertain);
  }
}

function isBoundedText(value: unknown, maximum: number, required = false) {
  if (value === undefined || value === null || value === '') return !required;
  return typeof value === 'string'
    && value.trim().length >= (required ? 1 : 0)
    && value.length <= maximum
    && !/[\u0000]/.test(value);
}
