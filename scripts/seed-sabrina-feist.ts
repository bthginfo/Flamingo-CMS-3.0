/**
 * Seed standalone tenant: Sabrina Feist Photography
 * Real client with content from sabrinafeistphotography.de
 *
 * Usage: npx tsx scripts/seed-sabrina-feist.ts
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../packages/db/src/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

import { SABRINA_CONFIG } from './demo-data/photography-sabrina';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const DEFAULT_PASSWORD_HASH = '$2a$12$HMKCVT2eAmQj0huq6SUShOGHQOVNO4FWi4teS8IbQvrrymkpRjVHK'; // demo2024

async function main() {
  console.log('🚀 Seeding Sabrina Feist Photography (standalone)…\n');

  // Create or find tenant
  const [tenant] = await db.insert(schema.tenants).values({
    name: SABRINA_CONFIG.name,
    slug: SABRINA_CONFIG.slug,
    industry: SABRINA_CONFIG.industry,
    activeStyle: SABRINA_CONFIG.activeStyle,
    deploymentMode: SABRINA_CONFIG.deploymentMode,
    status: 'active',
    isDemo: false,
  }).onConflictDoNothing().returning();

  let tenantId = tenant?.id;
  if (!tenantId) {
    const [existing] = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, SABRINA_CONFIG.slug));
    if (!existing) { console.error('❌ Failed to find tenant'); process.exit(1); }
    tenantId = existing.id;
    // Update existing
    await db.update(schema.tenants).set({
      name: SABRINA_CONFIG.name,
      industry: SABRINA_CONFIG.industry,
      deploymentMode: SABRINA_CONFIG.deploymentMode,
      isDemo: false,
    }).where(eq(schema.tenants.id, tenantId));
    console.log(`ℹ️ Tenant exists, reusing ${tenantId}`);
  } else {
    console.log(`✅ Tenant created: ${tenantId}`);
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
  await db.insert(schema.adminSecrets).values({ tenantId, passwordHash: DEFAULT_PASSWORD_HASH });

  // Global settings
  await db.insert(schema.globalSettings).values({
    tenantId,
    brand: SABRINA_CONFIG.brand as Record<string, unknown>,
    contact: SABRINA_CONFIG.contact as Record<string, unknown>,
    socialLinks: SABRINA_CONFIG.socialLinks as Record<string, unknown>,
    openingHours: SABRINA_CONFIG.openingHours as Record<string, unknown>[],
  });

  // Navigation
  await db.insert(schema.navigation).values({
    tenantId,
    items: SABRINA_CONFIG.navItems as Record<string, unknown>[],
    cta: SABRINA_CONFIG.navCta as Record<string, unknown>,
  });

  // Footer
  await db.insert(schema.footer).values({
    tenantId,
    columns: SABRINA_CONFIG.footerColumns as Record<string, unknown>[],
    legalLinks: SABRINA_CONFIG.footerLegalLinks as Record<string, unknown>[],
    cta: SABRINA_CONFIG.footerCta as Record<string, unknown>,
  });

  // Pages + Sections
  let totalSections = 0;
  for (let i = 0; i < SABRINA_CONFIG.pages.length; i++) {
    const page = SABRINA_CONFIG.pages[i];
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
  console.log(`✅ ${SABRINA_CONFIG.pages.length} pages, ${totalSections} sections`);

  // Collections + Items
  let totalItems = 0;
  if (SABRINA_CONFIG.collections) {
    for (const col of SABRINA_CONFIG.collections) {
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
    console.log(`✅ ${SABRINA_CONFIG.collections.length} collections, ${totalItems} items`);
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
    createdBy: 'seed-sabrina-feist',
  });
  console.log(`✅ Snapshot published`);

  console.log('\n🎉 Sabrina Feist Photography tenant seeded!');
  console.log('   Slug: sabrina-feist');
  console.log('   Mode: standalone');
  console.log('   Password: demo2024');
}

main().catch(err => { console.error(err); process.exit(1); });
