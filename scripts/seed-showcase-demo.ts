/**
 * Seed showcase demo tenant (sections gallery).
 * Usage: npx tsx scripts/seed-showcase-demo.ts
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../packages/db/src/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { showcaseSite } from '../apps/renderer/src/app/demo/pages/showcase';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const DEMO_PASSWORD_HASH = '$2a$12$HMKCVT2eAmQj0huq6SUShOGHQOVNO4FWi4teS8IbQvrrymkpRjVHK'; // demo2024

async function main() {
  console.log('📦 Seeding showcase demo tenant…\n');

  const slug = 'demo-showcase';
  const [tenant] = await db.insert(schema.tenants).values({
    name: 'Flamingo Sektionen-Demo',
    slug,
    industry: 'tradesman',
    activeStyle: 'classic',
    status: 'active',
    isDemo: true,
  }).onConflictDoNothing().returning();

  let tenantId = tenant?.id;
  if (!tenantId) {
    const [existing] = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, slug));
    if (!existing) { console.error('❌ Failed'); process.exit(1); }
    tenantId = existing.id;
    await db.update(schema.tenants).set({ isDemo: true }).where(eq(schema.tenants.id, tenantId));
    console.log(`ℹ️  Reusing ${tenantId}`);
  } else {
    console.log(`✅ Created: ${tenantId}`);
  }

  // Clean
  await db.delete(schema.publishedSnapshots).where(eq(schema.publishedSnapshots.tenantId, tenantId));
  await db.delete(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  await db.delete(schema.pages).where(eq(schema.pages.tenantId, tenantId));
  await db.delete(schema.navigation).where(eq(schema.navigation.tenantId, tenantId));
  await db.delete(schema.footer).where(eq(schema.footer.tenantId, tenantId));
  await db.delete(schema.globalSettings).where(eq(schema.globalSettings.tenantId, tenantId));
  await db.delete(schema.adminSecrets).where(eq(schema.adminSecrets.tenantId, tenantId));

  await db.insert(schema.adminSecrets).values({ tenantId, passwordHash: DEMO_PASSWORD_HASH });
  await db.insert(schema.globalSettings).values({
    tenantId,
    brand: { companyName: 'Flamingo CMS', tagline: 'Sektionen-Galerie — alle verfügbaren Inhaltsbausteine', primaryColor: '#6366f1' } as any,
    contact: { email: 'info@flamingo-cms.de' } as any,
  });
  await db.insert(schema.navigation).values({
    tenantId,
    items: [] as any,
    cta: {} as any,
  });
  await db.insert(schema.footer).values({
    tenantId,
    columns: [] as any,
    legalLinks: [] as any,
  });

  // Create pages from static demo data
  let totalSections = 0;
  for (let i = 0; i < showcaseSite.pages.length; i++) {
    const page = showcaseSite.pages[i];
    const pageSlug = page.slug || 'startseite';
    const [dbPage] = await db.insert(schema.pages).values({
      tenantId, title: page.title, slug: pageSlug, type: 'free', status: 'published', visible: true, sortOrder: i,
    }).returning();
    for (let j = 0; j < page.sections.length; j++) {
      const s = page.sections[j];
      await db.insert(schema.pageSections).values({
        tenantId, pageId: dbPage.id, type: s.type, data: s.data as any, sortOrder: j, visible: true,
        container: 'default', spacingTop: 'l', spacingBottom: 'l',
      });
      totalSections++;
    }
  }
  console.log(`✅ ${showcaseSite.pages.length} pages, ${totalSections} sections`);

  // Snapshot
  const allPages = await db.select().from(schema.pages).where(eq(schema.pages.tenantId, tenantId));
  const allSections = await db.select().from(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  const snapshot = {
    pages: allPages.map(p => ({
      ...p,
      sections: allSections.filter(s => s.pageId === p.id).sort((a, b) => a.sortOrder - b.sortOrder),
    })),
    generatedAt: new Date().toISOString(),
  };
  const checksum = crypto.createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
  await db.insert(schema.publishedSnapshots).values({
    tenantId, version: 1, snapshot: snapshot as any, checksum, isActive: true, createdBy: 'seed-showcase-demo',
  });
  console.log('✅ Snapshot published');
  console.log('\n📦 Showcase demo ready! Password: demo2024');
}

main().catch(err => { console.error(err); process.exit(1); });
