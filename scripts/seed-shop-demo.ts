/**
 * Seed demo wine shop tenant with products, categories, and shop settings.
 * Usage: npx tsx scripts/seed-shop-demo.ts
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../packages/db/src/schema';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';
import { SHOP_CONFIG } from './demo-data/shop';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const DEMO_PASSWORD_HASH = '$2a$12$HMKCVT2eAmQj0huq6SUShOGHQOVNO4FWi4teS8IbQvrrymkpRjVHK'; // demo2024

async function main() {
  console.log('🍷 Seeding wine shop demo…\n');

  // Create or find tenant
  const [tenant] = await db.insert(schema.tenants).values({
    name: SHOP_CONFIG.name,
    slug: SHOP_CONFIG.slug,
    industry: SHOP_CONFIG.industry,
    activeStyle: SHOP_CONFIG.activeStyle,
    status: 'active',
    isDemo: true,
  }).onConflictDoNothing().returning();

  let tenantId = tenant?.id;
  if (!tenantId) {
    const [existing] = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, SHOP_CONFIG.slug));
    if (!existing) { console.error('Failed to find tenant'); process.exit(1); }
    tenantId = existing.id;
    await db.update(schema.tenants).set({ isDemo: true, name: SHOP_CONFIG.name }).where(eq(schema.tenants.id, tenantId));
    console.log(`  ℹ️ Tenant exists: ${tenantId}`);
  } else {
    console.log(`  ✅ Tenant created: ${tenantId}`);
  }

  // Clean existing data
  await db.delete(schema.publishedSnapshots).where(eq(schema.publishedSnapshots.tenantId, tenantId));
  await db.delete(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  await db.delete(schema.pages).where(eq(schema.pages.tenantId, tenantId));
  await db.delete(schema.products).where(eq(schema.products.tenantId, tenantId));
  await db.delete(schema.productCategories).where(eq(schema.productCategories.tenantId, tenantId));
  await db.delete(schema.shopSettings).where(eq(schema.shopSettings.tenantId, tenantId));
  await db.delete(schema.tenantAddons).where(eq(schema.tenantAddons.tenantId, tenantId));
  await db.delete(schema.shippingZones).where(eq(schema.shippingZones.tenantId, tenantId));
  await db.delete(schema.navigation).where(eq(schema.navigation.tenantId, tenantId));
  await db.delete(schema.footer).where(eq(schema.footer.tenantId, tenantId));
  await db.delete(schema.globalSettings).where(eq(schema.globalSettings.tenantId, tenantId));
  await db.delete(schema.adminSecrets).where(eq(schema.adminSecrets.tenantId, tenantId));

  // Admin secret
  await db.insert(schema.adminSecrets).values({ tenantId, passwordHash: DEMO_PASSWORD_HASH });

  // Global settings
  await db.insert(schema.globalSettings).values({
    tenantId,
    brand: SHOP_CONFIG.brand as Record<string, unknown>,
    contact: SHOP_CONFIG.contact as Record<string, unknown>,
    socialLinks: SHOP_CONFIG.socialLinks as Record<string, unknown>,
    openingHours: (SHOP_CONFIG.openingHours ?? []) as Record<string, unknown>[],
  });

  // Navigation
  await db.insert(schema.navigation).values({
    tenantId,
    items: SHOP_CONFIG.navItems as Record<string, unknown>[],
    cta: SHOP_CONFIG.navCta as Record<string, unknown>,
  });

  // Footer
  await db.insert(schema.footer).values({
    tenantId,
    columns: SHOP_CONFIG.footerColumns as Record<string, unknown>[],
    legalLinks: SHOP_CONFIG.footerLegalLinks as Record<string, unknown>[],
    cta: (SHOP_CONFIG.footerCta ?? null) as Record<string, unknown> | null,
  });

  // Activate shop addon
  await db.insert(schema.tenantAddons).values({ tenantId, addonKey: 'shop', active: true, activatedAt: new Date() });

  // Shop settings
  await db.insert(schema.shopSettings).values({
    tenantId,
    currency: 'EUR',
    currencySymbol: '€',
    paymentMethods: ['prepayment'],
    orderPrefix: 'VG',
    invoicePrefix: 'RE',
    pickupEnabled: true,
    pickupInstructions: 'Abholung in unserer Vinothek: Weinstraße 8, 50667 Köln. Mo-Fr 10-19 Uhr, Sa 10-16 Uhr.',
  });

  // Shipping zone
  const [zone] = await db.insert(schema.shippingZones).values({
    tenantId,
    name: 'Deutschland',
    countries: ['DE'],
  }).returning();

  await db.insert(schema.shippingMethods).values([
    { tenantId, zoneId: zone.id, name: 'DHL Paket', priceCents: 690, freeAboveCents: 7500, estimatedDays: '2-3 Werktage', active: true },
    { tenantId, zoneId: zone.id, name: 'DHL Express', priceCents: 1490, freeAboveCents: null, estimatedDays: '1 Werktag', active: true },
  ]);

  // Product categories
  const catMap = new Map<string, string>();
  for (let i = 0; i < SHOP_CONFIG.shopCategories.length; i++) {
    const cat = SHOP_CONFIG.shopCategories[i];
    const [dbCat] = await db.insert(schema.productCategories).values({
      tenantId,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      sortOrder: i,
    }).returning();
    catMap.set(cat.slug, dbCat.id);
  }
  console.log(`  ✅ ${SHOP_CONFIG.shopCategories.length} categories`);

  // Products
  for (let i = 0; i < SHOP_CONFIG.shopProducts.length; i++) {
    const p = SHOP_CONFIG.shopProducts[i];
    await db.insert(schema.products).values({
      tenantId,
      categoryId: catMap.get(p.category) || null,
      title: p.title,
      slug: p.slug,
      description: p.description,
      shortDescription: p.shortDescription,
      priceCents: p.priceCents,
      comparePriceCents: p.comparePriceCents,
      images: p.images,
      stock: p.stock,
      status: p.status as 'active',
      highlights: (p as any).highlights || [],
      sortOrder: i,
    });
  }
  console.log(`  ✅ ${SHOP_CONFIG.shopProducts.length} products`);

  // Pages + Sections
  for (let i = 0; i < SHOP_CONFIG.pages.length; i++) {
    const page = SHOP_CONFIG.pages[i];
    const [dbPage] = await db.insert(schema.pages).values({
      tenantId,
      title: page.title,
      slug: page.slug || 'startseite',
      type: 'free',
      status: 'published',
      visible: true,
      sortOrder: i,
    }).returning();

    for (const section of page.sections) {
      await db.insert(schema.pageSections).values({
        tenantId,
        pageId: dbPage.id,
        type: section.type,
        data: section.data as Record<string, unknown>,
        sortOrder: section.sortOrder,
        visible: true,
        container: 'default',
        spacingTop: 'l',
        spacingBottom: 'l',
      });
    }
  }
  console.log(`  ✅ ${SHOP_CONFIG.pages.length} pages`);

  // Publish snapshot
  const allPages = await db.select().from(schema.pages).where(eq(schema.pages.tenantId, tenantId));
  const allSections = await db.select().from(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  const snapshot = {
    pages: allPages.map(p => ({
      ...p,
      sections: allSections.filter(s => s.pageId === p.id).sort((a, b) => a.sortOrder - b.sortOrder),
    })),
    generatedAt: new Date().toISOString(),
  };
  const snapshotJson = JSON.stringify(snapshot);
  const checksum = crypto.createHash('sha256').update(snapshotJson).digest('hex');
  await db.insert(schema.publishedSnapshots).values({
    tenantId,
    version: 1,
    snapshot: snapshot as unknown as Record<string, unknown>,
    checksum,
    isActive: true,
    createdBy: 'seed-shop-demo',
  });
  console.log(`  ✅ Snapshot published`);
  console.log('\n🎉 Wine shop demo seeded! Password: demo2024');
}

main().catch(err => { console.error(err); process.exit(1); });
