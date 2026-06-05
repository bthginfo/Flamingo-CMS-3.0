'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { tenantAddons, shopSettings, products, productCategories, productVariants, variantOptions, orders, orderStatusHistory, shippingZones, shippingMethods, coupons, pages, pageSections, invoices, formSubmissions, tenants, promotions } from '@flamingo/db';
import { eq, and, desc, sql, not } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

async function requireTenant() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session.tenantId;
}

// ─── Addon Check ──────────────────────────────────────────────────────

export async function isShopActive(): Promise<boolean> {
  const tenantId = await requireTenant();
  const db = getDb();
  const [row] = await db.select().from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'shop')))
    .limit(1);
  return row?.active ?? false;
}

export async function requestShopAddon(message?: string): Promise<void> {
  const tenantId = await requireTenant();
  const db = getDb();

  // Store as form submission (visible in CRM inbox)
  const [tenant] = await db.select({ name: tenants.name, slug: tenants.slug }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);

  await db.insert(formSubmissions).values({
    tenantId,
    name: tenant?.name || 'Kunde',
    email: '',
    message: `[Shop-Addon Anfrage] ${message || 'Keine Nachricht'}`,
    page: '/admin/shop',
  });

  // Send email notification to Flamingo Media
  try {
    const nodemailer = await import('nodemailer');
    const transport = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST || 'smtp.resend.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: { user: process.env.SMTP_USER || 'resend', pass: process.env.SMTP_PASS || '' },
    });
    await transport.sendMail({
      from: process.env.SMTP_FROM || 'noreply@flamingomedia.online',
      to: 'hello@flamingomedia.online',
      subject: `Shop-Addon Anfrage: ${tenant?.name || tenantId}`,
      text: `Tenant: ${tenant?.name} (${tenant?.slug})\nID: ${tenantId}\n\nNachricht:\n${message || '–'}`,
    });
  } catch (e) {
    console.error('[requestShopAddon] mail error:', e);
  }
}

/**
 * Activates the shop addon for the current tenant.
 *
 * Even though this is in a 'use server' file (and therefore reachable as a
 * POST endpoint from any authenticated admin), we restrict execution to
 * platform admins. The list is configured via the PLATFORM_ADMIN_TENANT_IDS
 * env var (comma-separated tenant UUIDs). Without that env var, the action
 * refuses to run, preventing self-activation by regular tenants who haven't
 * been onboarded for billing.
 */
export async function activateShopAddon(): Promise<void> {
  const tenantId = await requireTenant();
  const allow = (process.env.PLATFORM_ADMIN_TENANT_IDS || '')
    .split(',').map(s => s.trim()).filter(Boolean);
  if (allow.length === 0 || !allow.includes(tenantId)) {
    throw new Error('Shop-Aktivierung ist nur für Platform-Admins erlaubt. Bitte kontaktiere FlamingoMedia.');
  }
  const db = getDb();
  const now = new Date();

  const [existing] = await db.select().from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'shop')))
    .limit(1);

  if (existing) {
    await db.update(tenantAddons)
      .set({ active: true, activatedAt: now })
      .where(eq(tenantAddons.id, existing.id));
  } else {
    await db.insert(tenantAddons).values({ tenantId, addonKey: 'shop', active: true, activatedAt: now });
  }

  // Create default shop settings if not exists
  const [settings] = await db.select().from(shopSettings).where(eq(shopSettings.tenantId, tenantId)).limit(1);
  if (!settings) {
    await db.insert(shopSettings).values({ tenantId });
  }

  // Create shop system pages with locked sections
  await ensureShopPages(tenantId);

  revalidatePath('/admin/shop');
}

// ─── Shop System Pages ────────────────────────────────────────────────
// SHOP_PAGES and the pure ensureShopPages implementation now live in
// @/lib/shop-pages so the PAT-authenticated /api/v1/instructions route can
// call them without a session cookie.

// Public action: callable from admin UI. Enforces session === tenantId.
export async function ensureShopPages(tenantId: string) {
  const session = await getSession();
  if (!session || session.tenantId !== tenantId) {
    throw new Error('Unauthorized: tenantId mismatch');
  }
  const { ensureShopPages: impl } = await import('@/lib/shop-pages');
  return impl(tenantId);
}

// ─── Shop Settings ────────────────────────────────────────────────────

export async function getShopSettings() {
  const tenantId = await requireTenant();
  const db = getDb();
  const [row] = await db.select().from(shopSettings).where(eq(shopSettings.tenantId, tenantId)).limit(1);
  return row;
}

export async function saveShopSettings(data: Partial<{
  currency: string;
  currencySymbol: string;
  paymentMethods: string[];
  bankDetails: { iban: string; bic: string; bankName: string; accountHolder: string } | null;
  pickupEnabled: boolean;
  pickupInstructions: string | null;
  stripePublicKey: string | null;
  stripeSecretKey: string | null;
  stripeWebhookSecret: string | null;
  paypalClientId: string | null;
  paypalSecret: string | null;
  paypalMode: string;
  sumupApiKey: string | null;
  sumupMerchantCode: string | null;
  sumupMode: string;
  orderPrefix: string;
  invoicePrefix: string;
  notificationEmail: string | null;
  lowStockThreshold: number;
  companyInfo: { name: string; street: string; zip: string; city: string; country: string; email?: string; phone?: string; taxId?: string; vatId?: string; registerCourt?: string; registerNumber?: string; ceo?: string } | null;
}>) {
  const tenantId = await requireTenant();
  const db = getDb();
  // Upsert: create settings row if it doesn't exist, otherwise update
  const cleanData = { ...data };
  if (cleanData.paymentMethods) cleanData.paymentMethods = [...new Set(cleanData.paymentMethods)];
  const [existing] = await db.select({ tenantId: shopSettings.tenantId }).from(shopSettings).where(eq(shopSettings.tenantId, tenantId)).limit(1);
  if (existing) {
    await db.update(shopSettings)
      .set({ ...cleanData, updatedAt: new Date() })
      .where(eq(shopSettings.tenantId, tenantId));
  } else {
    await db.insert(shopSettings).values({ tenantId, ...cleanData });
  }
  revalidatePath('/admin/shop');
}

// ─── Categories ───────────────────────────────────────────────────────

export async function getCategories() {
  const tenantId = await requireTenant();
  const db = getDb();
  return db.select().from(productCategories)
    .where(eq(productCategories.tenantId, tenantId))
    .orderBy(productCategories.sortOrder);
}

export async function createCategory(data: { name: string; slug: string; description?: string; image?: string; parentId?: string }) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.insert(productCategories).values({ tenantId, ...data });
  revalidatePath('/admin/shop');
}

export async function updateCategory(id: string, data: Partial<{ name: string; slug: string; description: string; image: string; parentId: string; sortOrder: number }>) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.update(productCategories).set(data).where(and(eq(productCategories.id, id), eq(productCategories.tenantId, tenantId)));
  revalidatePath('/admin/shop');
}

export async function deleteCategory(id: string) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.delete(productCategories).where(and(eq(productCategories.id, id), eq(productCategories.tenantId, tenantId)));
  revalidatePath('/admin/shop');
}

// ─── Products ─────────────────────────────────────────────────────────

export async function getProducts() {
  const tenantId = await requireTenant();
  const db = getDb();
  return db.select().from(products)
    .where(eq(products.tenantId, tenantId))
    .orderBy(products.sortOrder);
}

export async function getProduct(id: string) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [product] = await db.select().from(products)
    .where(and(eq(products.id, id), eq(products.tenantId, tenantId)))
    .limit(1);
  if (!product) return null;

  const variants = await db.select().from(productVariants)
    .where(and(eq(productVariants.productId, id), eq(productVariants.tenantId, tenantId)))
    .orderBy(productVariants.sortOrder);

  const options = await db.select().from(variantOptions)
    .where(and(eq(variantOptions.productId, id), eq(variantOptions.tenantId, tenantId)))
    .orderBy(variantOptions.sortOrder);

  return { ...product, variants, variantOptions: options };
}

export async function createProduct(data: {
  title: string; slug: string; description?: string; shortDescription?: string;
  priceCents: number; comparePriceCents?: number; sku?: string;
  stock?: number; trackStock?: boolean; isDigital?: boolean;
  categoryId?: string; status?: 'draft' | 'active' | 'archived';
  images?: string[]; weightGrams?: number; taxClass?: string;
  metaTitle?: string; metaDescription?: string; highlights?: string[];
}) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [row] = await db.insert(products).values({ tenantId, ...data }).returning({ id: products.id });
  revalidatePath('/admin/shop');
  return row.id;
}

export async function updateProduct(id: string, data: Partial<{
  title: string; slug: string; description: string; shortDescription: string;
  priceCents: number; comparePriceCents: number | null; sku: string | null;
  stock: number; trackStock: boolean; isDigital: boolean;
  categoryId: string | null; status: 'draft' | 'active' | 'archived';
  images: string[]; weightGrams: number | null; taxClass: string;
  metaTitle: string | null; metaDescription: string | null; sortOrder: number;
  highlights: string[];
}>) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.update(products).set({ ...data, updatedAt: new Date() })
    .where(and(eq(products.id, id), eq(products.tenantId, tenantId)));
  revalidatePath('/admin/shop');
}

export async function deleteProduct(id: string) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.delete(products).where(and(eq(products.id, id), eq(products.tenantId, tenantId)));
  revalidatePath('/admin/shop');
}

// ─── Orders ───────────────────────────────────────────────────────────

export async function getOrders() {
  const tenantId = await requireTenant();
  const db = getDb();
  return db.select().from(orders)
    .where(and(eq(orders.tenantId, tenantId), not(eq(orders.status, 'awaiting_payment'))))
    .orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(orderId: string, newStatus: string, note?: string) {
  const tenantId = await requireTenant();
  const db = getDb();

  const [order] = await db.select().from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)));
  if (!order) throw new Error('Order not found');

  const oldStatus = order.status;
  await db.update(orders)
    .set({ status: newStatus as typeof order.status, updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  await db.insert(orderStatusHistory).values({
    orderId,
    oldStatus,
    newStatus,
    note: note || null,
  });

  // Send shipped notification email
  if (newStatus === 'shipped') {
    sendShippedEmail(tenantId, order).catch(e => console.error('[Order] Shipped email error:', e));
  }

  revalidatePath('/admin/shop/orders');
}

export async function updateOrderTracking(orderId: string, trackingNumber: string, trackingUrl?: string) {
  const tenantId = await requireTenant();
  const db = getDb();

  const [order] = await db.select().from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)));
  if (!order) throw new Error('Order not found');

  await db.update(orders)
    .set({ trackingNumber, trackingUrl: trackingUrl || null, updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  revalidatePath('/admin/shop/orders');
}

// ─── Shipping ─────────────────────────────────────────────────────────

export async function getShippingZones() {
  const tenantId = await requireTenant();
  const db = getDb();
  const zones = await db.select().from(shippingZones)
    .where(eq(shippingZones.tenantId, tenantId))
    .orderBy(shippingZones.sortOrder);

  const methods = await db.select().from(shippingMethods)
    .where(eq(shippingMethods.tenantId, tenantId));

  return zones.map(z => ({ ...z, methods: methods.filter(m => m.zoneId === z.id) }));
}

export async function createShippingZone(data: { name: string; countries: string[] }) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [zone] = await db.insert(shippingZones).values({ tenantId, ...data }).returning({ id: shippingZones.id });
  revalidatePath('/admin/shop/shipping');
  return zone.id;
}

export async function updateShippingZone(id: string, data: Partial<{ name: string; countries: string[]; sortOrder: number }>) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.update(shippingZones).set(data)
    .where(and(eq(shippingZones.id, id), eq(shippingZones.tenantId, tenantId)));
  revalidatePath('/admin/shop/shipping');
}

export async function deleteShippingZone(id: string) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.delete(shippingZones).where(and(eq(shippingZones.id, id), eq(shippingZones.tenantId, tenantId)));
  revalidatePath('/admin/shop/shipping');
}

export async function createShippingMethod(data: { zoneId: string; name: string; priceCents: number; freeAboveCents?: number; estimatedDays?: string }) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.insert(shippingMethods).values({ tenantId, ...data });
  revalidatePath('/admin/shop/shipping');
}

export async function updateShippingMethod(id: string, data: Partial<{ name: string; priceCents: number; freeAboveCents: number | null; estimatedDays: string | null; active: boolean }>) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.update(shippingMethods).set(data)
    .where(and(eq(shippingMethods.id, id), eq(shippingMethods.tenantId, tenantId)));
  revalidatePath('/admin/shop/shipping');
}

export async function deleteShippingMethod(id: string) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.delete(shippingMethods).where(and(eq(shippingMethods.id, id), eq(shippingMethods.tenantId, tenantId)));
  revalidatePath('/admin/shop/shipping');
}

// ─── Coupons ──────────────────────────────────────────────────────────

export async function getCoupons() {
  const tenantId = await requireTenant();
  const db = getDb();
  return db.select().from(coupons)
    .where(eq(coupons.tenantId, tenantId))
    .orderBy(desc(coupons.createdAt));
}

export async function createCoupon(data: {
  code: string; type: 'percent' | 'fixed_amount' | 'free_shipping';
  value: number; minOrderCents?: number; maxUses?: number;
  maxUsesPerCustomer?: number; validFrom?: string; validUntil?: string;
  appliesTo?: 'all' | 'specific_products' | 'specific_categories';
  appliesToIds?: string[];
}) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.insert(coupons).values({
    tenantId,
    code: data.code.toUpperCase(),
    type: data.type,
    value: data.value,
    minOrderCents: data.minOrderCents || null,
    maxUses: data.maxUses || null,
    maxUsesPerCustomer: data.maxUsesPerCustomer || null,
    validFrom: data.validFrom ? new Date(data.validFrom) : null,
    validUntil: data.validUntil ? new Date(data.validUntil) : null,
    appliesTo: data.appliesTo || 'all',
    appliesToIds: data.appliesToIds || [],
  });
  revalidatePath('/admin/shop/coupons');
}

export async function updateCoupon(id: string, data: Partial<{
  code: string; type: 'percent' | 'fixed_amount' | 'free_shipping';
  value: number; minOrderCents: number | null; maxUses: number | null;
  maxUsesPerCustomer: number | null; active: boolean;
  validFrom: string | null; validUntil: string | null;
}>) {
  const tenantId = await requireTenant();
  const db = getDb();
  const updates: Record<string, unknown> = { ...data };
  if (data.code) updates.code = data.code.toUpperCase();
  if (data.validFrom !== undefined) updates.validFrom = data.validFrom ? new Date(data.validFrom) : null;
  if (data.validUntil !== undefined) updates.validUntil = data.validUntil ? new Date(data.validUntil) : null;
  await db.update(coupons).set(updates)
    .where(and(eq(coupons.id, id), eq(coupons.tenantId, tenantId)));
  revalidatePath('/admin/shop/coupons');
}

export async function deleteCoupon(id: string) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.delete(coupons).where(and(eq(coupons.id, id), eq(coupons.tenantId, tenantId)));
  revalidatePath('/admin/shop/coupons');
}

/**
 * Cancel an order and generate a Stornorechnung (credit note).
 * - Sets status to 'cancelled'
 * - Creates credit note invoice record (negative amounts, referencing original invoice)
 * - Returns credit note number for PDF generation
 */
export async function cancelOrder(orderId: string, reason?: string): Promise<{ creditNoteNumber: string }> {
  const tenantId = await requireTenant();
  const db = getDb();

  const [order] = await db.select().from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)));
  if (!order) throw new Error('Order not found');

  if (order.status === 'cancelled' || order.status === 'refunded') {
    throw new Error('Bestellung ist bereits storniert.');
  }

  // Find original invoice
  const [originalInvoice] = await db.select().from(invoices)
    .where(and(eq(invoices.orderId, orderId), eq(invoices.tenantId, tenantId), eq(invoices.type, 'invoice')))
    .limit(1);

  // Check if credit note already exists
  const [existingCreditNote] = await db.select().from(invoices)
    .where(and(eq(invoices.orderId, orderId), eq(invoices.tenantId, tenantId), eq(invoices.type, 'credit_note')))
    .limit(1);

  if (existingCreditNote) {
    // Already has a credit note, just update status
    await db.update(orders)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(orders.id, orderId));
    await db.insert(orderStatusHistory).values({ orderId, oldStatus: order.status, newStatus: 'cancelled', note: reason || 'Storno' });
    revalidatePath('/admin/shop/orders');
    return { creditNoteNumber: existingCreditNote.invoiceNumber };
  }

  // Generate credit note number (uses same sequential counter with "ST" prefix)
  const [settings] = await db.select().from(shopSettings)
    .where(eq(shopSettings.tenantId, tenantId)).limit(1);

  const prefix = 'ST'; // Stornorechnung prefix
  const nextNum = settings?.nextInvoiceNumber || 1;
  const year = new Date().getFullYear();
  const paddedNum = String(nextNum).padStart(4, '0');
  const creditNoteNumber = `${prefix}-${year}-${paddedNum}`;

  // Create credit note record (negative amounts)
  await db.insert(invoices).values({
    tenantId,
    orderId,
    invoiceNumber: creditNoteNumber,
    type: 'credit_note',
    amountNetCents: -(order.subtotalCents - order.taxCents),
    taxCents: -order.taxCents,
    amountGrossCents: -order.totalCents,
    refInvoiceNumber: originalInvoice?.invoiceNumber || null,
  });

  // Increment counter
  await db.update(shopSettings)
    .set({ nextInvoiceNumber: nextNum + 1 })
    .where(eq(shopSettings.tenantId, tenantId));

  // Update order status
  await db.update(orders)
    .set({ status: 'cancelled', updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  await db.insert(orderStatusHistory).values({
    orderId,
    oldStatus: order.status,
    newStatus: 'cancelled',
    note: reason ? `Storno: ${reason}` : 'Storno',
  });

  // Restore stock for cancelled items
  const orderItems = order.items as { productId: string; variantId?: string; quantity: number }[];
  for (const item of orderItems) {
    if (item.variantId) {
      await db.execute(sql`UPDATE product_variants SET stock = stock + ${item.quantity} WHERE id = ${item.variantId}`);
    } else {
      await db.execute(sql`UPDATE products SET stock = stock + ${item.quantity} WHERE id = ${item.productId} AND track_stock = true`);
    }
  }

  // Send cancellation email (fire-and-forget)
  sendCancellationEmail(tenantId, order, creditNoteNumber).catch(e =>
    console.error('[Storno] Email failed:', e)
  );

  revalidatePath('/admin/shop/orders');
  return { creditNoteNumber };
}

async function sendCancellationEmail(tenantId: string, order: typeof orders.$inferSelect, creditNoteNumber: string) {
  const { sendOrderEmails: _ , ...mod } = await import('@/lib/shop-email');
  // Use getSmtp from the module's internal — reimport nodemailer directly
  const nodemailer = (await import('nodemailer')).default;
  const { globalSettings: gs } = await import('@flamingo/db');

  const db = getDb();
  const [settings] = await db.select({ smtp: gs.smtp })
    .from(gs).where(eq(gs.tenantId, tenantId)).limit(1);

  const smtp = settings?.smtp as { host: string; port: number; user: string; pass: string; from: string } | null;
  const effectiveSmtp = (smtp?.host && smtp?.user && smtp?.pass && smtp?.from)
    ? smtp
    : (process.env.PLATFORM_SMTP_HOST && process.env.PLATFORM_SMTP_USER && process.env.PLATFORM_SMTP_PASS && process.env.PLATFORM_SMTP_FROM)
      ? { host: process.env.PLATFORM_SMTP_HOST, port: Number(process.env.PLATFORM_SMTP_PORT) || 587, user: process.env.PLATFORM_SMTP_USER, pass: process.env.PLATFORM_SMTP_PASS, from: process.env.PLATFORM_SMTP_FROM }
      : null;

  if (!effectiveSmtp) return;

  const transporter = nodemailer.createTransport({
    host: effectiveSmtp.host,
    port: effectiveSmtp.port,
    secure: effectiveSmtp.port === 465,
    auth: { user: effectiveSmtp.user, pass: effectiveSmtp.pass },
  });

  const formatPrice = (c: number) => (c / 100).toFixed(2).replace('.', ',') + ' €';

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
  <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#991b1b,#dc2626);padding:24px 32px">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">Bestellung storniert</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px">Stornorechnung: ${creditNoteNumber}</p>
    </div>
    <div style="padding:24px 32px">
      <p style="margin:0 0 16px;color:#374151">Hallo ${order.customerName},</p>
      <p style="margin:0 0 16px;color:#6b7280;font-size:14px">Ihre Bestellung <strong>${order.orderNumber}</strong> wurde storniert. Anbei die Stornorechnung als Gutschrift über ${formatPrice(order.totalCents)}.</p>
      <p style="margin:0 0 16px;color:#6b7280;font-size:14px">Der Betrag wird Ihnen in den nächsten 5–10 Werktagen erstattet.</p>
      <p style="margin:0;color:#6b7280;font-size:13px">Stornorechnung-Nr.: ${creditNoteNumber}</p>
    </div>
  </div>
</div></body></html>`;

  await transporter.sendMail({
    from: effectiveSmtp.from,
    to: order.customerEmail,
    subject: `Stornierung Bestellung ${order.orderNumber} – Gutschrift ${creditNoteNumber}`,
    html,
  });
}

async function sendShippedEmail(tenantId: string, order: typeof orders.$inferSelect) {
  const nodemailer = (await import('nodemailer')).default;
  const { globalSettings: gs } = await import('@flamingo/db');

  const db = getDb();
  const [settings] = await db.select({ smtp: gs.smtp })
    .from(gs).where(eq(gs.tenantId, tenantId)).limit(1);

  const smtp = settings?.smtp as { host: string; port: number; user: string; pass: string; from: string } | null;
  const effectiveSmtp = (smtp?.host && smtp?.user && smtp?.pass && smtp?.from)
    ? smtp
    : (process.env.PLATFORM_SMTP_HOST && process.env.PLATFORM_SMTP_USER && process.env.PLATFORM_SMTP_PASS && process.env.PLATFORM_SMTP_FROM)
      ? { host: process.env.PLATFORM_SMTP_HOST, port: Number(process.env.PLATFORM_SMTP_PORT) || 587, user: process.env.PLATFORM_SMTP_USER, pass: process.env.PLATFORM_SMTP_PASS, from: process.env.PLATFORM_SMTP_FROM }
      : null;

  if (!effectiveSmtp) return;

  const transporter = nodemailer.createTransport({
    host: effectiveSmtp.host,
    port: effectiveSmtp.port,
    secure: effectiveSmtp.port === 465,
    auth: { user: effectiveSmtp.user, pass: effectiveSmtp.pass },
  });

  const trackingHtml = order.trackingNumber
    ? `<p style="margin:16px 0;font-size:14px;color:#374151"><strong>Sendungsnummer:</strong> ${order.trackingNumber}${order.trackingUrl ? ` — <a href="${order.trackingUrl}" style="color:#2563eb">Sendung verfolgen</a>` : ''}</p>`
    : '';

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
  <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#065f46,#059669);padding:24px 32px">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">Ihre Bestellung ist unterwegs! 📦</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px">Bestellung: ${order.orderNumber}</p>
    </div>
    <div style="padding:24px 32px">
      <p style="margin:0 0 16px;color:#374151">Hallo ${order.customerName},</p>
      <p style="margin:0 0 16px;color:#6b7280;font-size:14px">Ihre Bestellung <strong>${order.orderNumber}</strong> wurde versendet.</p>
      ${trackingHtml}
      <p style="margin:16px 0 0;color:#6b7280;font-size:13px">Bei Fragen antworten Sie einfach auf diese E-Mail.</p>
    </div>
  </div>
</div></body></html>`;

  await transporter.sendMail({
    from: effectiveSmtp.from,
    to: order.customerEmail,
    subject: `Ihre Bestellung ${order.orderNumber} wurde versendet`,
    html,
  });
}

// ─── Promotions / Discount Rules ─────────────────────────────────────

export async function getPromotions() {
  const tenantId = await requireTenant();
  const db = getDb();
  return db.select().from(promotions).where(eq(promotions.tenantId, tenantId)).orderBy(desc(promotions.createdAt));
}

export async function createPromotion(data: {
  name: string;
  type: 'free_shipping_above' | 'buy_x_get_discount' | 'bundle_discount' | 'quantity_discount' | 'first_order_discount' | 'spend_x_save_y';
  conditions: Record<string, unknown>;
  discountValue: number;
  discountType: 'percent' | 'fixed';
  active?: boolean;
  validFrom?: string | null;
  validUntil?: string | null;
  stackable?: boolean;
}) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.insert(promotions).values({
    tenantId,
    name: data.name,
    type: data.type,
    conditions: data.conditions,
    discountValue: data.discountValue,
    discountType: data.discountType,
    active: data.active ?? true,
    validFrom: data.validFrom ? new Date(data.validFrom) : null,
    validUntil: data.validUntil ? new Date(data.validUntil) : null,
    stackable: data.stackable ?? false,
  });
  revalidatePath('/admin/shop/promotions');
}

export async function updatePromotion(id: string, data: Partial<{
  name: string;
  active: boolean;
}>) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.update(promotions).set(data).where(and(eq(promotions.id, id), eq(promotions.tenantId, tenantId)));
  revalidatePath('/admin/shop/promotions');
}

export async function deletePromotion(id: string) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.delete(promotions).where(and(eq(promotions.id, id), eq(promotions.tenantId, tenantId)));
  revalidatePath('/admin/shop/promotions');
}
