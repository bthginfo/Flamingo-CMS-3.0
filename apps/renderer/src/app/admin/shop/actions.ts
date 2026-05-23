'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { tenantAddons, shopSettings, products, productCategories, productVariants, variantOptions, orders, pages, pageSections } from '@flamingo/db';
import { eq, and, desc } from 'drizzle-orm';
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

export async function activateShopAddon(): Promise<void> {
  const tenantId = await requireTenant();
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

const SHOP_PAGES = [
  {
    slug: 'shop',
    title: 'Shop',
    sortOrder: 50,
    sections: [
      { type: 'shopProductGrid', data: { headline: 'Unsere Produkte', showCategories: true, showSearch: true, showSort: true, columns: 3 }, sortOrder: 0 },
    ],
  },
  {
    slug: 'warenkorb',
    title: 'Warenkorb',
    sortOrder: 51,
    sections: [
      { type: 'shopCart', data: { headline: 'Dein Warenkorb', emptyText: 'Dein Warenkorb ist leer.', continueShoppingLabel: 'Weiter einkaufen', checkoutLabel: 'Zur Kasse' }, sortOrder: 0 },
    ],
  },
  {
    slug: 'checkout',
    title: 'Checkout',
    sortOrder: 52,
    sections: [
      { type: 'shopCheckout', data: { headline: 'Kasse', steps: ['Kontakt', 'Versand', 'Zahlung', 'Bestätigung'] }, sortOrder: 0 },
    ],
  },
  {
    slug: 'bestellung-abgeschlossen',
    title: 'Bestellung abgeschlossen',
    sortOrder: 53,
    sections: [
      { type: 'shopThankYou', data: { headline: 'Vielen Dank für deine Bestellung!', subline: 'Du erhältst in Kürze eine Bestätigung per E-Mail.', continueShoppingLabel: 'Zurück zum Shop' }, sortOrder: 0 },
    ],
  },
  {
    slug: 'agb',
    title: 'AGB',
    sortOrder: 54,
    sections: [
      { type: 'legalContent', data: { headline: 'Allgemeine Geschäftsbedingungen', blocks: [{ title: '§1 Geltungsbereich', content: '<p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen über unseren Online-Shop.</p>' }, { title: '§2 Vertragsschluss', content: '<p>Die Darstellung der Produkte im Shop stellt kein rechtlich bindendes Angebot dar. Erst durch Anklicken des Bestell-Buttons geben Sie eine verbindliche Bestellung ab.</p>' }, { title: '§3 Preise und Zahlung', content: '<p>Alle angegebenen Preise sind Endpreise inkl. gesetzlicher MwSt. zzgl. Versandkosten.</p>' }, { title: '§4 Lieferung', content: '<p>Die Lieferzeit beträgt, sofern nicht anders angegeben, 3-5 Werktage.</p>' }, { title: '§5 Widerrufsrecht', content: '<p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>' }] }, sortOrder: 0, locked: true },
    ],
  },
  {
    slug: 'widerrufsbelehrung',
    title: 'Widerrufsbelehrung',
    sortOrder: 55,
    sections: [
      { type: 'legalContent', data: { headline: 'Widerrufsbelehrung', blocks: [{ title: 'Widerrufsrecht', content: '<p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter die Waren in Besitz genommen haben.</p>' }, { title: 'Folgen des Widerrufs', content: '<p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.</p>' }] }, sortOrder: 0, locked: true },
    ],
  },
] as const;

async function ensureShopPages(tenantId: string) {
  const db = getDb();

  for (const pageDef of SHOP_PAGES) {
    // Check if page already exists
    const [existing] = await db.select({ id: pages.id }).from(pages)
      .where(and(eq(pages.tenantId, tenantId), eq(pages.slug, pageDef.slug)))
      .limit(1);

    if (existing) continue; // Don't recreate if already exists

    // Create the page
    const [page] = await db.insert(pages).values({
      tenantId,
      title: pageDef.title,
      slug: pageDef.slug,
      type: 'system',
      status: 'published',
      visible: true,
      sortOrder: pageDef.sortOrder,
    }).returning({ id: pages.id });

    // Create locked sections
    for (const section of pageDef.sections) {
      await db.insert(pageSections).values({
        tenantId,
        pageId: page.id,
        type: section.type,
        data: section.data,
        sortOrder: section.sortOrder,
        locked: true,
        titleInternal: `[Shop] ${pageDef.title}`,
      });
    }
  }
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
  orderPrefix: string;
  invoicePrefix: string;
  notificationEmail: string | null;
  lowStockThreshold: number;
}>) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.update(shopSettings)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(shopSettings.tenantId, tenantId));
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
  metaTitle?: string; metaDescription?: string;
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
    .where(eq(orders.tenantId, tenantId))
    .orderBy(desc(orders.createdAt));
}
