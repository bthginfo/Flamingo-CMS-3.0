'use server';

import { getDb } from '@/lib/db';
import { getWritableSession } from '@/lib/session';
import { getSessionCookieName } from '@flamingo/auth';
import { tenantAddons, shopSettings, products, productCategories, productVariants, variantOptions, orders, orderStatusHistory, shippingZones, shippingMethods, coupons, pages, pageSections, formSubmissions, tenants, promotions, crmEmailDeliveries, taxRates } from '@flamingo/db';
import { eq, and, desc, sql, not } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import {
  createHardenedRendererSmtpTransport,
  getEffectiveSmtp,
  getPlatformSmtp,
  isValidSmtpAddress,
} from '@/lib/smtp';
import {
  escapeShopEmailHtml,
  getSafeShopEmailUrl,
  sanitizeShopEmailHeaderValue,
} from '@/lib/shop-email-security';
import {
  createShopAddonIdempotencyKey,
  createShopOrderMailIdempotencyKey,
  classifyShopMailDelivery,
  classifyShopSmtpSendError,
  fingerprintShopAddonActor,
  fingerprintShopAddonRequest,
  fingerprintShopOrderMail,
  isOrderStatus,
  isShopAddonClaimStale,
  normalizeShopAddonMessage,
  shopAddonRateRules,
  shouldSendShippedNotification,
  type OrderStatus,
} from '@/lib/shop-admin-security';
import {
  consumeRendererContactRateRules,
  getRendererContactClientAddress,
} from '@/lib/renderer-contact-security';
import { protectStoredSecret } from '@/lib/secret-storage';
import { getShopCurrencySymbol, normalizeShopCurrency } from '@/lib/shop-currency';

async function requireAuthenticatedTenant() {
  const session = await getWritableSession();
  if (!session) throw new Error('Unauthorized');
  return session.tenantId;
}

/**
 * Every shop-admin read and mutation must enforce the paid entitlement on the
 * server. Hiding navigation or rendering a paywall is only presentation and
 * must never be the authorization boundary for server actions.
 */
async function requireTenant() {
  const tenantId = await requireAuthenticatedTenant();
  const [addon] = await getDb().select({ active: tenantAddons.active }).from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'shop')))
    .limit(1);
  if (!addon?.active) redirect('/admin/shop');
  return tenantId;
}

// ─── Addon Check ──────────────────────────────────────────────────────

export async function isShopActive(): Promise<boolean> {
  const tenantId = await requireAuthenticatedTenant();
  const db = getDb();
  const [row] = await db.select().from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'shop')))
    .limit(1);
  return row?.active ?? false;
}

export async function requestShopAddon(message?: string): Promise<void> {
  const session = await getWritableSession();
  if (!session) throw new Error('Unauthorized');
  const tenantId = session.tenantId;
  const normalizedMessage = normalizeShopAddonMessage(message);
  const requestHash = fingerprintShopAddonRequest(tenantId, normalizedMessage);
  const idempotencyKey = createShopAddonIdempotencyKey(tenantId, normalizedMessage);
  const db = getDb();

  try {
    const requestHeaders = await headers();
    const sessionToken = (await cookies()).get(getSessionCookieName())?.value;
    if (!sessionToken) throw new Error('Missing authenticated shop actor.');
    const denied = await consumeRendererContactRateRules(shopAddonRateRules(
      tenantId,
      fingerprintShopAddonActor(sessionToken),
      getRendererContactClientAddress(requestHeaders),
    ));
    if (denied) throw new Error('Zu viele Anfragen. Bitte versuche es später erneut.');
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Zu viele Anfragen.')) throw error;
    console.error('[requestShopAddon] persistent rate limit unavailable', error);
    throw new Error('Die Shop-Anfrage ist vorübergehend nicht verfügbar.');
  }

  let claimed: { idempotencyKey: string } | undefined;
  try {
    [claimed] = await db.insert(crmEmailDeliveries).values({
      idempotencyKey,
      purpose: 'shop_addon',
      entityId: tenantId,
      requestHash,
      status: 'sending',
    }).onConflictDoNothing({ target: crmEmailDeliveries.idempotencyKey }).returning({
      idempotencyKey: crmEmailDeliveries.idempotencyKey,
    });
  } catch (error) {
    console.error('[requestShopAddon] idempotency store unavailable', error);
    throw new Error('Die Shop-Anfrage ist vorübergehend nicht verfügbar.');
  }

  if (!claimed) {
    const [existing] = await db.select({
      purpose: crmEmailDeliveries.purpose,
      entityId: crmEmailDeliveries.entityId,
      requestHash: crmEmailDeliveries.requestHash,
      status: crmEmailDeliveries.status,
      updatedAt: crmEmailDeliveries.updatedAt,
    }).from(crmEmailDeliveries)
      .where(eq(crmEmailDeliveries.idempotencyKey, idempotencyKey))
      .limit(1);

    if (!existing
      || existing.purpose !== 'shop_addon'
      || existing.entityId !== tenantId
      || existing.requestHash !== requestHash) {
      throw new Error('Die Anfrage konnte nicht eindeutig zugeordnet werden.');
    }

    const [savedSubmission] = await db.select({ id: formSubmissions.id })
      .from(formSubmissions)
      .where(and(
        eq(formSubmissions.tenantId, tenantId),
        eq(formSubmissions.idempotencyKey, idempotencyKey),
      ))
      .limit(1);
    if (savedSubmission) {
      const recoveredAt = new Date();
      await db.update(crmEmailDeliveries).set({
        status: 'sent',
        sentAt: recoveredAt,
        lastErrorCode: null,
        updatedAt: recoveredAt,
      }).where(eq(crmEmailDeliveries.idempotencyKey, idempotencyKey)).catch(() => undefined);
      return;
    }

    if (existing.status === 'failed' || (existing.status === 'sending' && isShopAddonClaimStale(existing.updatedAt))) {
      [claimed] = await db.update(crmEmailDeliveries).set({
        status: 'sending',
        attemptCount: sql`${crmEmailDeliveries.attemptCount} + 1`,
        lastErrorCode: null,
        updatedAt: new Date(),
      }).where(and(
        eq(crmEmailDeliveries.idempotencyKey, idempotencyKey),
        eq(crmEmailDeliveries.status, existing.status),
        eq(crmEmailDeliveries.updatedAt, existing.updatedAt),
      )).returning({ idempotencyKey: crmEmailDeliveries.idempotencyKey });
    }

    // A concurrent identical action is already processing the durable claim.
    if (!claimed) return;
  }

  // Store as form submission (visible in CRM inbox)
  const [tenant] = await db.select({ name: tenants.name, slug: tenants.slug }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);

  let createdSubmission: { id: string } | undefined;
  try {
    [createdSubmission] = await db.insert(formSubmissions).values({
      tenantId,
      idempotencyKey,
      requestHash,
      name: tenant?.name || 'Kunde',
      email: '',
      message: `[Shop-Addon Anfrage] ${normalizedMessage || 'Keine Nachricht'}`,
      page: '/admin/shop',
    }).onConflictDoNothing({
      target: [formSubmissions.tenantId, formSubmissions.idempotencyKey],
    }).returning({ id: formSubmissions.id });
  } catch (error) {
    await db.update(crmEmailDeliveries).set({
      status: 'failed',
      lastErrorCode: 'shop_addon_persist_failed',
      updatedAt: new Date(),
    }).where(eq(crmEmailDeliveries.idempotencyKey, idempotencyKey)).catch(() => undefined);
    console.error('[requestShopAddon] persistence failed', error);
    throw new Error('Die Shop-Anfrage konnte nicht gespeichert werden.');
  }

  // The action is durably accepted once its CRM record exists. Mark it before
  // SMTP so a timeout after sending can never trigger a duplicate notification.
  const acceptedAt = new Date();
  await db.update(crmEmailDeliveries).set({
    status: 'sent',
    sentAt: acceptedAt,
    lastErrorCode: null,
    updatedAt: acceptedAt,
  }).where(eq(crmEmailDeliveries.idempotencyKey, idempotencyKey)).catch((error) => {
    console.error(`[requestShopAddon] failed to finalize ${idempotencyKey}`, error);
  });

  // Another recovered worker may have inserted the same durable submission.
  // Only the worker that created it may emit the notification.
  if (!createdSubmission) return;

  // Send email notification to Flamingo Media
  try {
    const smtp = await getPlatformSmtp();
    if (!smtp) throw new Error('Platform SMTP is not configured or not publicly routable');
    const transport = createHardenedRendererSmtpTransport(smtp);
    await transport.sendMail({
      from: smtp.from,
      to: 'hello@flamingomedia.online',
      subject: `Shop-Addon Anfrage: ${sanitizeShopEmailHeaderValue(tenant?.name || tenantId)}`,
      text: `Tenant: ${tenant?.name} (${tenant?.slug})\nID: ${tenantId}\n\nNachricht:\n${normalizedMessage || '–'}`,
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
  const tenantId = await requireAuthenticatedTenant();
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
  const session = await getWritableSession();
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
  const [[row], configuredTaxRates] = await Promise.all([
    db.select().from(shopSettings).where(eq(shopSettings.tenantId, tenantId)).limit(1),
    db.select({ name: taxRates.name, rate: taxRates.rate }).from(taxRates)
      .where(and(eq(taxRates.tenantId, tenantId), eq(taxRates.country, 'DE'))),
  ]);
  if (!row) return row;
  const { stripeSecretKey, stripeWebhookSecret, paypalSecret, sumupApiKey, ...safe } = row;
  return {
    ...safe,
    stripeSecretKey: null,
    stripeWebhookSecret: null,
    paypalSecret: null,
    sumupApiKey: null,
    taxClasses: ['standard', 'reduced', 'zero'].map(key => ({
      key,
      label: key === 'standard' ? 'Standard' : key === 'reduced' ? 'Ermäßigt' : 'Steuerfrei',
      rate: Number(configuredTaxRates.find(item => item.name === key)?.rate ?? (key === 'standard' ? 19 : key === 'reduced' ? 7 : 0)),
    })),
    stripeSecretConfigured: Boolean(stripeSecretKey),
    stripeWebhookConfigured: Boolean(stripeWebhookSecret),
    paypalSecretConfigured: Boolean(paypalSecret),
    sumupApiKeyConfigured: Boolean(sumupApiKey),
  };
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
  taxClasses: { key: string; label: string; rate: number }[];
  companyInfo: { name: string; street: string; zip: string; city: string; country: string; email?: string; phone?: string; taxId?: string; vatId?: string; registerCourt?: string; registerNumber?: string; ceo?: string } | null;
}>) {
  const tenantId = await requireTenant();
  const db = getDb();
  // Upsert: create settings row if it doesn't exist, otherwise update
  const { taxClasses: requestedTaxClasses, ...cleanData } = data;
  if ('currency' in cleanData) {
    cleanData.currency = normalizeShopCurrency(cleanData.currency);
    if (!cleanData.currencySymbol?.trim()) cleanData.currencySymbol = getShopCurrencySymbol(cleanData.currency);
  }
  if (cleanData.paymentMethods) cleanData.paymentMethods = [...new Set(cleanData.paymentMethods)];
  for (const key of ['stripeSecretKey', 'stripeWebhookSecret', 'paypalSecret', 'sumupApiKey'] as const) {
    const value = cleanData[key];
    if (typeof value === 'string' && value.trim()) {
      cleanData[key] = protectStoredSecret(value);
    } else {
      // Empty write-only inputs mean "keep the existing secret".
      delete cleanData[key];
    }
  }
  const [existing] = await db.select({ tenantId: shopSettings.tenantId }).from(shopSettings).where(eq(shopSettings.tenantId, tenantId)).limit(1);
  if (existing) {
    await db.update(shopSettings)
      .set({ ...cleanData, updatedAt: new Date() })
      .where(eq(shopSettings.tenantId, tenantId));
  } else {
    await db.insert(shopSettings).values({ tenantId, ...cleanData });
  }
  for (const taxClass of requestedTaxClasses || []) {
    if (!['standard', 'reduced', 'zero'].includes(taxClass.key)) continue;
    const rate = Math.max(0, Math.min(100, Number(taxClass.rate) || 0));
    await db.insert(taxRates).values({
      tenantId,
      name: taxClass.key,
      rate: String(rate),
      country: 'DE',
      isDefault: taxClass.key === 'standard',
    }).onConflictDoUpdate({
      target: [taxRates.tenantId, taxRates.name, taxRates.country],
      set: { rate: String(rate), isDefault: taxClass.key === 'standard' },
    });
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

/**
 * Returns active products for the page-editor picker.
 *
 * This read is embedded in the page editor, so it must never use the shop
 * route guard: that guard redirects tenants without the add-on to
 * `/admin/shop`, which would throw them out of the editor merely by opening a
 * section. Entitlement is still checked before any product data is returned.
 */
export async function getProductLinksAction() {
  const tenantId = await requireAuthenticatedTenant();
  const db = getDb();
  const [addon] = await db
    .select({ active: tenantAddons.active })
    .from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'shop')))
    .limit(1);

  if (!addon?.active) {
    return { shopActive: false as const, products: [] };
  }

  const productLinks = await db
    .select({ id: products.id, title: products.title, slug: products.slug })
    .from(products)
    .where(and(eq(products.tenantId, tenantId), eq(products.status, 'active')))
    .orderBy(products.sortOrder);

  return { shopActive: true as const, products: productLinks };
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
  if (data.isDigital) throw new Error('Digitale Produkte sind erst mit sicherer Download-Auslieferung verfügbar.');
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
  if (data.isDigital) throw new Error('Digitale Produkte sind erst mit sicherer Download-Auslieferung verfügbar.');
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

  if (!isOrderStatus(newStatus)) throw new Error('Invalid order status');

  const [order] = await db.select().from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)));
  if (!order) throw new Error('Order not found');

  const oldStatus = order.status as OrderStatus;
  const allowedTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
    awaiting_payment: ['pending', 'paid'],
    pending: ['paid', 'processing'],
    paid: ['processing'],
    processing: ['shipped'],
    shipped: ['delivered'],
  };
  if (oldStatus !== newStatus && !allowedTransitions[oldStatus]?.includes(newStatus)) {
    throw new Error(`Statuswechsel von ${oldStatus} zu ${newStatus} ist nicht erlaubt`);
  }
  const needsShippedMail = shouldSendShippedNotification(oldStatus, newStatus);
  const deliveryKey = createShopOrderMailIdempotencyKey(orderId, 'shipped');
  const requestHash = fingerprintShopOrderMail(orderId, 'shipped');
  let transitioned = false;
  let deliveryCreated = false;

  if (oldStatus !== newStatus) {
    // neon-http cannot run an interactive callback transaction, but one SQL
    // statement is atomic. The status transition, audit history and durable
    // mail outbox therefore either commit together or not at all.
    const result = await db.execute(sql`
      WITH transitioned_order AS (
        UPDATE orders AS shop_order
        SET status = ${newStatus}::order_status, updated_at = now()
        WHERE shop_order.id = ${orderId}::uuid
          AND shop_order.tenant_id = ${tenantId}::uuid
          AND shop_order.status = ${oldStatus}::order_status
        RETURNING shop_order.id
      ),
      recorded_history AS (
        INSERT INTO order_status_history (order_id, old_status, new_status, note)
        SELECT id, ${oldStatus}, ${newStatus}, ${note || null}
        FROM transitioned_order
        RETURNING id
      ),
      created_delivery AS (
        INSERT INTO crm_email_deliveries (
          idempotency_key, purpose, entity_id, request_hash, status, attempt_count, created_at, updated_at
        )
        SELECT ${deliveryKey}::uuid, 'shop_shipped', id, ${requestHash}, 'sending', 1, now(), now()
        FROM transitioned_order
        WHERE ${needsShippedMail}
        ON CONFLICT (idempotency_key) DO NOTHING
        RETURNING idempotency_key
      )
      SELECT
        EXISTS (SELECT 1 FROM transitioned_order) AS transitioned,
        EXISTS (SELECT 1 FROM recorded_history) AS history_recorded,
        EXISTS (SELECT 1 FROM created_delivery) AS delivery_created
    `);
    const transition = result.rows?.[0] as {
      transitioned?: boolean;
      delivery_created?: boolean;
    } | undefined;
    transitioned = transition?.transitioned === true;
    deliveryCreated = transition?.delivery_created === true;

    if (!transitioned) {
      const [current] = await db.select({ status: orders.status }).from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)))
        .limit(1);
      if (!current || current.status !== newStatus) {
        throw new Error('Die Bestellung wurde zwischenzeitlich geändert. Bitte Ansicht aktualisieren.');
      }
    }
  }

  if (newStatus === 'shipped') {
    await deliverShippedNotification({
      db,
      tenantId,
      order,
      deliveryKey,
      deliveryCreated,
    });
  }

  revalidatePath('/admin/shop/orders');
}

async function deliverShippedNotification(input: {
  db: ReturnType<typeof getDb>;
  tenantId: string;
  order: typeof orders.$inferSelect;
  deliveryKey: string;
  deliveryCreated: boolean;
}) {
  const { db, tenantId, order, deliveryKey } = input;
  let ownsDelivery = input.deliveryCreated;

  if (!ownsDelivery) {
    const [existing] = await db.select({
      status: crmEmailDeliveries.status,
      updatedAt: crmEmailDeliveries.updatedAt,
    }).from(crmEmailDeliveries)
      .where(and(
        eq(crmEmailDeliveries.idempotencyKey, deliveryKey),
        eq(crmEmailDeliveries.purpose, 'shop_shipped'),
        eq(crmEmailDeliveries.entityId, order.id),
      ))
      .limit(1);
    if (!existing) return;

    const classification = classifyShopMailDelivery(existing.status, existing.updatedAt);
    if (classification === 'sent') return;
    if (classification === 'in_progress') {
      throw new Error('Die Versandmail wird noch verarbeitet. Bitte in zwei Minuten erneut versuchen.');
    }
    if (classification === 'uncertain') {
      if (existing.status === 'sending') {
        await db.update(crmEmailDeliveries).set({
          status: 'uncertain',
          lastErrorCode: 'shop_shipped_stale_sending',
          updatedAt: new Date(),
        }).where(and(
          eq(crmEmailDeliveries.idempotencyKey, deliveryKey),
          eq(crmEmailDeliveries.status, 'sending'),
          eq(crmEmailDeliveries.updatedAt, existing.updatedAt),
        )).catch(error => console.error('[Order] failed to persist stale shipped delivery', error));
      }
      throw new Error('Der Status der Versandmail ist unklar. Bitte Versandprotokoll prüfen.');
    }

    const [reclaimed] = await db.update(crmEmailDeliveries).set({
      status: 'sending',
      attemptCount: sql`${crmEmailDeliveries.attemptCount} + 1`,
      lastErrorCode: null,
      updatedAt: new Date(),
    }).where(and(
      eq(crmEmailDeliveries.idempotencyKey, deliveryKey),
      eq(crmEmailDeliveries.status, existing.status),
      eq(crmEmailDeliveries.updatedAt, existing.updatedAt),
    )).returning({ idempotencyKey: crmEmailDeliveries.idempotencyKey });
    ownsDelivery = Boolean(reclaimed);
  }

  if (!ownsDelivery) return;

  try {
    await sendShippedEmail(tenantId, order);
  } catch (error) {
    const sendOutcome = classifyShopSmtpSendError(error);
    const retryable = sendOutcome === 'rejected';
    await db.update(crmEmailDeliveries).set({
      status: retryable ? 'failed' : 'uncertain',
      lastErrorCode: retryable
        ? 'shop_shipped_smtp_rejected'
        : 'shop_shipped_smtp_uncertain',
      updatedAt: new Date(),
    }).where(and(
      eq(crmEmailDeliveries.idempotencyKey, deliveryKey),
      eq(crmEmailDeliveries.status, 'sending'),
    )).catch(auditError => console.error('[Order] failed to record shipped email failure', auditError));
    console.error('[Order] Shipped email error:', error);
    if (retryable) {
      throw new Error('Bestellstatus gespeichert, Versandmail wurde abgelehnt. Erneut speichern, um den Versand zu wiederholen.');
    }
    throw new Error('Bestellstatus gespeichert, Versandmail-Status ist unklar. Bitte Versandprotokoll pr\u00fcfen und nicht erneut senden.');
  }

  let markedSent: { idempotencyKey: string } | undefined;
  try {
    [markedSent] = await db.update(crmEmailDeliveries).set({
      status: 'sent',
      sentAt: new Date(),
      lastErrorCode: null,
      updatedAt: new Date(),
    }).where(and(
      eq(crmEmailDeliveries.idempotencyKey, deliveryKey),
      eq(crmEmailDeliveries.status, 'sending'),
    )).returning({ idempotencyKey: crmEmailDeliveries.idempotencyKey });
  } catch (error) {
    await markShippedDeliveryUncertain(db, deliveryKey);
    throw error;
  }

  if (!markedSent) {
    await markShippedDeliveryUncertain(db, deliveryKey);
    throw new Error('Versandmail wurde angenommen, der Audit-Status konnte jedoch nicht bestätigt werden.');
  }
}

async function markShippedDeliveryUncertain(
  db: ReturnType<typeof getDb>,
  deliveryKey: string,
) {
  await db.update(crmEmailDeliveries).set({
    status: 'uncertain',
    lastErrorCode: 'shop_shipped_audit_uncertain',
    updatedAt: new Date(),
  }).where(and(
    eq(crmEmailDeliveries.idempotencyKey, deliveryKey),
    eq(crmEmailDeliveries.status, 'sending'),
  )).catch(error => console.error('[Order] failed to mark shipped delivery uncertain', error));
}

export async function updateOrderTracking(orderId: string, trackingNumber: string, trackingUrl?: string) {
  const tenantId = await requireTenant();
  const db = getDb();

  const [order] = await db.select().from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)));
  if (!order) throw new Error('Order not found');

  await db.update(orders)
    .set({ trackingNumber, trackingUrl: trackingUrl || null, updatedAt: new Date() })
    .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)));

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

  const orderItems = order.items as {
    productId: string;
    variantId?: string;
    quantity: number;
    trackStock?: boolean;
  }[];
  const variantAdjustments = JSON.stringify(orderItems
    .filter((item): item is typeof item & { variantId: string } => Boolean(item.variantId))
    .map(item => ({ id: item.variantId, quantity: item.quantity })));
  const productAdjustments = JSON.stringify(orderItems
    .filter(item => !item.variantId)
    .map(item => ({
      id: item.productId,
      quantity: item.quantity,
      tracked: typeof item.trackStock === 'boolean' ? item.trackStock : null,
    })));
  const year = new Date().getFullYear();
  const historyNote = reason ? `Storno: ${reason.slice(0, 2_000)}` : 'Storno';

  // Credit note, sequential counter, status, history and inventory compensation
  // are one SQL transaction. A retry after a lost response sees the cancelled
  // order and cannot restore stock or increment the counter a second time.
  const result = await db.execute(sql`
    WITH locked_order AS MATERIALIZED (
      SELECT shop_order.*
      FROM orders AS shop_order
      WHERE shop_order.id = ${orderId}::uuid
        AND shop_order.tenant_id = ${tenantId}::uuid
        AND shop_order.status NOT IN ('cancelled', 'refunded')
      FOR UPDATE OF shop_order
    ),
    locked_settings AS MATERIALIZED (
      SELECT settings.tenant_id, settings.next_invoice_number
      FROM shop_settings AS settings
      WHERE settings.tenant_id = ${tenantId}::uuid
      FOR UPDATE OF settings
    ),
    existing_credit AS MATERIALIZED (
      SELECT invoice.invoice_number
      FROM invoices AS invoice
      JOIN locked_order AS locked ON locked.id = invoice.order_id
      WHERE invoice.tenant_id = ${tenantId}::uuid
        AND invoice.type = 'credit_note'
      LIMIT 1
    ),
    original_invoice AS MATERIALIZED (
      SELECT invoice.invoice_number
      FROM invoices AS invoice
      JOIN locked_order AS locked ON locked.id = invoice.order_id
      WHERE invoice.tenant_id = ${tenantId}::uuid
        AND invoice.type = 'invoice'
      LIMIT 1
    ),
    generated_number AS MATERIALIZED (
      SELECT COALESCE(
        (SELECT invoice_number FROM existing_credit),
        'ST-' || ${String(year)} || '-' || LPAD(COALESCE(
          (SELECT next_invoice_number FROM locked_settings), 1
        )::text, 4, '0')
      ) AS invoice_number
    ),
    created_credit AS (
      INSERT INTO invoices (
        tenant_id, order_id, invoice_number, type,
        amount_net_cents, tax_cents, amount_gross_cents, ref_invoice_number
      )
      SELECT
        ${tenantId}::uuid,
        locked.id,
        generated.invoice_number,
        'credit_note',
        -(locked.subtotal_cents - locked.tax_cents),
        -locked.tax_cents,
        -locked.total_cents,
        (SELECT invoice_number FROM original_invoice)
      FROM locked_order AS locked, generated_number AS generated
      WHERE NOT EXISTS (SELECT 1 FROM existing_credit)
      RETURNING invoice_number
    ),
    credit_note AS MATERIALIZED (
      SELECT invoice_number FROM existing_credit
      UNION ALL
      SELECT invoice_number FROM created_credit
      LIMIT 1
    ),
    counter_decision AS MATERIALIZED (
      SELECT
        EXISTS (SELECT 1 FROM created_credit)
        OR EXISTS (
          SELECT 1
          FROM existing_credit AS existing, locked_settings AS locked
          WHERE existing.invoice_number =
            'ST-' || ${String(year)} || '-' || LPAD(locked.next_invoice_number::text, 4, '0')
        ) AS should_advance
    ),
    advanced_counter AS (
      UPDATE shop_settings AS settings
      SET next_invoice_number = settings.next_invoice_number + 1
      FROM locked_settings AS locked
      WHERE settings.tenant_id = locked.tenant_id
        AND (SELECT should_advance FROM counter_decision)
      RETURNING settings.tenant_id
    ),
    cancelled_order AS (
      UPDATE orders AS shop_order
      SET status = 'cancelled', updated_at = now()
      FROM locked_order AS locked
      WHERE shop_order.id = locked.id
        AND EXISTS (SELECT 1 FROM credit_note)
      RETURNING shop_order.id
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
        AND EXISTS (SELECT 1 FROM cancelled_order)
      RETURNING variant.id
    ),
    raw_product_adjustments AS MATERIALIZED (
      SELECT id, quantity, tracked
      FROM jsonb_to_recordset(${productAdjustments}::jsonb)
        AS item(id uuid, quantity integer, tracked boolean)
    ),
    product_adjustments AS MATERIALIZED (
      SELECT
        id,
        SUM(quantity)::integer AS quantity,
        CASE
          WHEN BOOL_OR(tracked IS NOT NULL) THEN BOOL_OR(COALESCE(tracked, false))
          ELSE NULL
        END AS tracked
      FROM raw_product_adjustments
      GROUP BY id
    ),
    restored_products AS (
      UPDATE products AS product
      SET stock = product.stock + adjustment.quantity
      FROM product_adjustments AS adjustment
      WHERE product.id = adjustment.id
        AND product.tenant_id = ${tenantId}::uuid
        AND COALESCE(adjustment.tracked, product.track_stock)
        AND EXISTS (SELECT 1 FROM cancelled_order)
      RETURNING product.id
    ),
    recorded_history AS (
      INSERT INTO order_status_history (order_id, old_status, new_status, note)
      SELECT locked.id, locked.status::text, 'cancelled', ${historyNote}
      FROM locked_order AS locked
      WHERE EXISTS (SELECT 1 FROM cancelled_order)
      RETURNING id
    )
    SELECT
      (SELECT invoice_number FROM credit_note) AS credit_note_number,
      EXISTS (SELECT 1 FROM cancelled_order) AS cancelled,
      EXISTS (SELECT 1 FROM advanced_counter) AS counter_advanced,
      (SELECT COUNT(*)::integer FROM restored_variants) AS restored_variants,
      (SELECT COUNT(*)::integer FROM restored_products) AS restored_products,
      EXISTS (SELECT 1 FROM recorded_history) AS history_recorded
  `);
  const cancellation = result.rows?.[0] as {
    credit_note_number?: string;
    cancelled?: boolean;
  } | undefined;
  if (!cancellation?.cancelled || !cancellation.credit_note_number) {
    throw new Error('Bestellung konnte nicht atomar storniert werden.');
  }
  const creditNoteNumber = cancellation.credit_note_number;

  // Await the SMTP attempt so the serverless invocation cannot terminate it.
  try {
    await sendCancellationEmail(tenantId, order, creditNoteNumber);
  } catch (error) {
    console.error('[Storno] Email failed:', error);
  }

  revalidatePath('/admin/shop/orders');
  return { creditNoteNumber };
}

async function sendCancellationEmail(tenantId: string, order: typeof orders.$inferSelect, creditNoteNumber: string) {
  const effectiveSmtp = await getEffectiveSmtp(tenantId);
  if (!effectiveSmtp) return;
  const customerEmail = order.customerEmail.trim();
  if (!isValidSmtpAddress(customerEmail)) {
    console.error('[Storno] Email skipped: invalid recipient');
    return;
  }

  const transporter = createHardenedRendererSmtpTransport(effectiveSmtp);

  const formatPrice = (c: number) => (c / 100).toFixed(2).replace('.', ',') + ' €';
  const safeOrderNumber = sanitizeShopEmailHeaderValue(order.orderNumber);
  const safeCreditNoteNumber = sanitizeShopEmailHeaderValue(creditNoteNumber);
  const htmlOrderNumber = escapeShopEmailHtml(safeOrderNumber);
  const htmlCreditNoteNumber = escapeShopEmailHtml(safeCreditNoteNumber);
  const htmlCustomerName = escapeShopEmailHtml(order.customerName);

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
  <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#991b1b,#dc2626);padding:24px 32px">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">Bestellung storniert</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px">Stornorechnung: ${htmlCreditNoteNumber}</p>
    </div>
    <div style="padding:24px 32px">
      <p style="margin:0 0 16px;color:#374151">Hallo ${htmlCustomerName},</p>
      <p style="margin:0 0 16px;color:#6b7280;font-size:14px">Ihre Bestellung <strong>${htmlOrderNumber}</strong> wurde storniert. Anbei die Stornorechnung als Gutschrift über ${formatPrice(order.totalCents)}.</p>
      <p style="margin:0 0 16px;color:#6b7280;font-size:14px">Der Betrag wird Ihnen in den nächsten 5–10 Werktagen erstattet.</p>
      <p style="margin:0;color:#6b7280;font-size:13px">Stornorechnung-Nr.: ${htmlCreditNoteNumber}</p>
    </div>
  </div>
</div></body></html>`;

  await transporter.sendMail({
    from: effectiveSmtp.from,
    to: customerEmail,
    subject: `Stornierung Bestellung ${safeOrderNumber} – Gutschrift ${safeCreditNoteNumber}`,
    html,
  });
}

async function sendShippedEmail(tenantId: string, order: typeof orders.$inferSelect) {
  const effectiveSmtp = await getEffectiveSmtp(tenantId);
  if (!effectiveSmtp) throw new Error('SMTP is not configured');
  const customerEmail = order.customerEmail.trim();
  if (!isValidSmtpAddress(customerEmail)) {
    throw new Error('Invalid shipped-email recipient');
  }

  const transporter = createHardenedRendererSmtpTransport(effectiveSmtp);
  const safeOrderNumber = sanitizeShopEmailHeaderValue(order.orderNumber);
  const htmlOrderNumber = escapeShopEmailHtml(safeOrderNumber);
  const htmlCustomerName = escapeShopEmailHtml(order.customerName);
  const htmlTrackingNumber = escapeShopEmailHtml(order.trackingNumber);
  const safeTrackingUrl = getSafeShopEmailUrl(order.trackingUrl);
  const trackingLink = safeTrackingUrl
    ? ` — <a href="${escapeShopEmailHtml(safeTrackingUrl)}" style="color:#2563eb">Sendung verfolgen</a>`
    : '';

  const trackingHtml = order.trackingNumber
    ? `<p style="margin:16px 0;font-size:14px;color:#374151"><strong>Sendungsnummer:</strong> ${htmlTrackingNumber}${trackingLink}</p>`
    : '';

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
  <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#065f46,#059669);padding:24px 32px">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">Ihre Bestellung ist unterwegs! 📦</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px">Bestellung: ${htmlOrderNumber}</p>
    </div>
    <div style="padding:24px 32px">
      <p style="margin:0 0 16px;color:#374151">Hallo ${htmlCustomerName},</p>
      <p style="margin:0 0 16px;color:#6b7280;font-size:14px">Ihre Bestellung <strong>${htmlOrderNumber}</strong> wurde versendet.</p>
      ${trackingHtml}
      <p style="margin:16px 0 0;color:#6b7280;font-size:13px">Bei Fragen antworten Sie einfach auf diese E-Mail.</p>
    </div>
  </div>
</div></body></html>`;

  await transporter.sendMail({
    from: effectiveSmtp.from,
    to: customerEmail,
    messageId: `<shop-shipped-${order.id}@flamingomedia.online>`,
    subject: `Ihre Bestellung ${safeOrderNumber} wurde versendet`,
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
