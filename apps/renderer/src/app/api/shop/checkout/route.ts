import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { orders, products, productVariants, shopSettings, customers, orderStatusHistory, coupons } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { resolveTenant } from '@/lib/snapshot';
import { sendOrderEmails } from '@/lib/shop-email';

export async function POST(req: NextRequest) {
  const tenantId = await resolveTenant();
  if (!tenantId) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  const body = await req.json();
  const { name, email, phone, street, city, zip, country, company, paymentMethod, customerNotes, items, shippingCents: clientShipping, discountCents: clientDiscount, couponCode } = body;

  if (!name || !email || !items?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const db = getDb();

  // Get shop settings for order number
  const [settings] = await db.select().from(shopSettings).where(eq(shopSettings.tenantId, tenantId)).limit(1);
  if (!settings) return NextResponse.json({ error: 'Shop not configured' }, { status: 400 });

  // Resolve product prices and build order items
  const orderItems: { productId: string; variantId?: string; title: string; variantName?: string; quantity: number; priceCents: number; taxRate: number }[] = [];
  let subtotalCents = 0;

  for (const item of items) {
    const [product] = await db.select().from(products)
      .where(and(eq(products.id, item.productId), eq(products.tenantId, tenantId)))
      .limit(1);
    if (!product) continue;

    let priceCents = product.priceCents;
    let variantName: string | undefined;

    if (item.variantId) {
      const [variant] = await db.select().from(productVariants)
        .where(and(eq(productVariants.id, item.variantId), eq(productVariants.tenantId, tenantId)))
        .limit(1);
      if (variant) {
        priceCents = variant.priceCents ?? product.priceCents;
        variantName = variant.name;
      }
    }

    const quantity = Math.max(1, Math.min(item.quantity, 100));
    orderItems.push({
      productId: product.id,
      variantId: item.variantId || undefined,
      title: product.title,
      variantName,
      quantity,
      priceCents,
      taxRate: 19,
    });
    subtotalCents += priceCents * quantity;
  }

  if (orderItems.length === 0) {
    return NextResponse.json({ error: 'No valid items' }, { status: 400 });
  }

  const shippingCents = Math.max(0, Math.round(clientShipping || 0));
  const discountCents = Math.max(0, Math.round(clientDiscount || 0));
  const taxCents = Math.round(subtotalCents * 19 / 119); // 19% included
  const totalCents = subtotalCents + shippingCents - discountCents;

  // Validate and increment coupon usage if provided
  if (couponCode) {
    const [coupon] = await db.select().from(coupons)
      .where(and(eq(coupons.tenantId, tenantId), eq(coupons.code, couponCode.toUpperCase()), eq(coupons.active, true)))
      .limit(1);
    if (coupon) {
      await db.update(coupons).set({ usedCount: coupon.usedCount + 1 }).where(eq(coupons.id, coupon.id));
    }
  }

  // Generate order number
  const orderNumber = `${settings.orderPrefix}-${String(settings.nextOrderNumber).padStart(4, '0')}`;

  // Create order
  const [order] = await db.insert(orders).values({
    tenantId,
    orderNumber,
    status: paymentMethod === 'pickup' ? 'processing' : 'pending',
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
  }).returning({ id: orders.id });

  // Increment order number
  await db.update(shopSettings)
    .set({ nextOrderNumber: settings.nextOrderNumber + 1 })
    .where(eq(shopSettings.tenantId, tenantId));

  // Add status history
  await db.insert(orderStatusHistory).values({
    orderId: order.id,
    oldStatus: null,
    newStatus: paymentMethod === 'pickup' ? 'processing' : 'pending',
  });

  // Upsert customer
  const [existingCustomer] = await db.select().from(customers)
    .where(and(eq(customers.tenantId, tenantId), eq(customers.email, email)))
    .limit(1);

  if (existingCustomer) {
    await db.update(customers).set({
      orderCount: existingCustomer.orderCount + 1,
      totalSpentCents: existingCustomer.totalSpentCents + totalCents,
      lastOrderAt: new Date(),
    }).where(eq(customers.id, existingCustomer.id));
  } else {
    await db.insert(customers).values({
      tenantId, email, name, phone: phone || null,
      defaultShippingAddress: { street, city, zip, country, company: company || undefined },
      orderCount: 1, totalSpentCents: totalCents, firstOrderAt: new Date(), lastOrderAt: new Date(),
    });
  }

  // Reduce stock for each item
  for (const item of orderItems) {
    if (item.variantId) {
      const [v] = await db.select().from(productVariants).where(eq(productVariants.id, item.variantId)).limit(1);
      if (v) await db.update(productVariants).set({ stock: Math.max(0, v.stock - item.quantity) }).where(eq(productVariants.id, item.variantId));
    } else {
      const [p] = await db.select().from(products).where(eq(products.id, item.productId)).limit(1);
      if (p && p.trackStock) await db.update(products).set({ stock: Math.max(0, p.stock - item.quantity) }).where(eq(products.id, item.productId));
    }
  }

  // Send order confirmation emails (fire-and-forget)
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

  return NextResponse.json({ success: true, orderNumber, orderId: order.id });
}
