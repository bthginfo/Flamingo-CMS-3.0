/**
 * Seed rich demo tenants from the new demo-data configs.
 * Replaces thin static imports with comprehensive, all-section content.
 *
 * Usage: npx tsx scripts/seed-rich-demos.ts
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../packages/db/src/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

import { RESTAURANT_CONFIG } from './demo-data/restaurant';
import { HOTEL_CONFIG } from './demo-data/hotel';
import { SALON_CONFIG } from './demo-data/salon';
import { TOURISM_CONFIG } from './demo-data/tourism';
import { MEDICAL_CONFIG } from './demo-data/medical';
import { HANDWERK_CONFIG } from './demo-data/handwerk';
import { WEDDING_CONFIG } from './demo-data/wedding';
import { TATTOO_CONFIG } from './demo-data/tattoo';
import { CAFE_CONFIG } from './demo-data/cafe';
import { CONSULTING_CONFIG } from './demo-data/consulting';
import { REALESTATE_CONFIG } from './demo-data/realestate';
import { PHOTOGRAPHY_LISA_CONFIG } from './demo-data/photography-lisa';
import { FLORIST_CONFIG } from './demo-data/florist';
import { FITNESS_CONFIG } from './demo-data/fitness';
import { LOCATION_CONFIG } from './demo-data/location';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const DEMO_PASSWORD_HASH = '$2a$12$HMKCVT2eAmQj0huq6SUShOGHQOVNO4FWi4teS8IbQvrrymkpRjVHK'; // demo2024

const ALL_CONFIGS = [RESTAURANT_CONFIG, HOTEL_CONFIG, SALON_CONFIG, TOURISM_CONFIG, MEDICAL_CONFIG, HANDWERK_CONFIG, WEDDING_CONFIG, TATTOO_CONFIG, CAFE_CONFIG, CONSULTING_CONFIG, REALESTATE_CONFIG, PHOTOGRAPHY_LISA_CONFIG, FLORIST_CONFIG, FITNESS_CONFIG, LOCATION_CONFIG];
type DemoConfig = (typeof ALL_CONFIGS)[number];

async function seedTenant(config: DemoConfig) {
  console.log(`\n🔧 Seeding ${config.name} (${config.industry})…`);

  // Create or find tenant
  const [tenant] = await db.insert(schema.tenants).values({
    name: config.name,
    slug: config.slug,
    industry: config.industry,
    activeStyle: config.activeStyle,
    status: 'active',
    isDemo: true,
  }).onConflictDoNothing().returning();

  let tenantId = tenant?.id;
  if (!tenantId) {
    const [existing] = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, config.slug));
    if (!existing) { console.error(`  ❌ Failed to find tenant ${config.slug}`); return; }
    tenantId = existing.id;
    await db.update(schema.tenants).set({ isDemo: true, name: config.name }).where(eq(schema.tenants.id, tenantId));
    console.log(`  ℹ️ Tenant exists, reusing ${tenantId}`);
  } else {
    console.log(`  ✅ Tenant created: ${tenantId}`);
  }

  // Clean existing data
  await db.delete(schema.publishedSnapshots).where(eq(schema.publishedSnapshots.tenantId, tenantId));
  await db.delete(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  await db.delete(schema.pages).where(eq(schema.pages.tenantId, tenantId));
  await db.delete(schema.collectionItems).where(eq(schema.collectionItems.tenantId, tenantId));
  await db.delete(schema.collections).where(eq(schema.collections.tenantId, tenantId));
  await db.delete(schema.navigation).where(eq(schema.navigation.tenantId, tenantId));
  await db.delete(schema.footer).where(eq(schema.footer.tenantId, tenantId));
  await db.delete(schema.globalSettings).where(eq(schema.globalSettings.tenantId, tenantId));
  await db.delete(schema.adminSecrets).where(eq(schema.adminSecrets.tenantId, tenantId));

  // Admin secret
  await db.insert(schema.adminSecrets).values({ tenantId, passwordHash: DEMO_PASSWORD_HASH });

  // Global settings
  await db.insert(schema.globalSettings).values({
    tenantId,
    brand: config.brand as Record<string, unknown>,
    contact: config.contact as Record<string, unknown>,
    socialLinks: config.socialLinks as Record<string, unknown>,
    openingHours: (config.openingHours ?? []) as Record<string, unknown>[],
  });

  // Navigation
  await db.insert(schema.navigation).values({
    tenantId,
    items: config.navItems as Record<string, unknown>[],
    cta: config.navCta as Record<string, unknown>,
  });

  // Footer
  await db.insert(schema.footer).values({
    tenantId,
    columns: config.footerColumns as Record<string, unknown>[],
    legalLinks: config.footerLegalLinks as Record<string, unknown>[],
    cta: (config.footerCta ?? null) as Record<string, unknown> | null,
  });

  // Pages + Sections
  let totalSections = 0;
  for (let i = 0; i < config.pages.length; i++) {
    const page = config.pages[i];
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
      totalSections++;
    }
  }
  console.log(`  ✅ ${config.pages.length} pages, ${totalSections} sections`);

  // Collections + Items
  let totalItems = 0;
  if (config.collections) {
    for (const col of config.collections) {
      const [dbCol] = await db.insert(schema.collections).values({
        tenantId,
        key: col.key,
        label: col.label,
        schema: {},
        settings: {},
      }).returning();

      for (const item of col.items) {
        await db.insert(schema.collectionItems).values({
          tenantId,
          collectionId: dbCol.id,
          slug: item.slug,
          title: item.title,
          data: item.data as Record<string, unknown>,
          published: true,
          priority: item.priority ?? 0,
        });
        totalItems++;
      }
    }
    console.log(`  ✅ ${config.collections.length} collections, ${totalItems} items`);
  }

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
    createdBy: 'seed-rich-demos',
  });
  console.log(`  ✅ Snapshot published`);
}

async function main() {
  console.log('🚀 Seeding all rich demo tenants…\n');
  for (const config of ALL_CONFIGS) {
    await seedTenant(config);
  }
  console.log('\n🎉 All rich demo tenants seeded!');
  console.log('   Password for all: demo2024');
}

main().catch(err => { console.error(err); process.exit(1); });
