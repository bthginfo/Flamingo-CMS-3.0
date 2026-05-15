/**
 * Seed all demo tenants from the existing static demo data files.
 * This creates DB tenants with isDemo=true for each industry,
 * then populates pages/sections/nav/footer/brand from the static TS data.
 *
 * Usage: npx tsx scripts/seed-demo-tenants.ts
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../packages/db/src/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// Import static demo data
import { restaurantSite } from '../apps/renderer/src/app/demo/pages/restaurant';
import { hotelSite } from '../apps/renderer/src/app/demo/pages/hotel';
import { salonSite } from '../apps/renderer/src/app/demo/pages/salon';
import { tourismSite } from '../apps/renderer/src/app/demo/pages/tourism';
import { medicalSite } from '../apps/renderer/src/app/demo/pages/medical';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const DEMO_PASSWORD_HASH = '$2a$12$HMKCVT2eAmQj0huq6SUShOGHQOVNO4FWi4teS8IbQvrrymkpRjVHK'; // demo2024

interface DemoTenantConfig {
  slug: string;
  name: string;
  industry: typeof schema.industryEnum.enumValues[number];
  activeStyle: string;
  brand: Record<string, unknown>;
  contact: Record<string, unknown>;
  socialLinks: Record<string, unknown>;
  openingHours?: Record<string, unknown>[];
  navItems: { label: string; href: string; type?: string }[];
  navCta: { label: string; href: string };
  footerColumns: { title: string; items: { text: string; href?: string }[] }[];
  footerLegalLinks: { label: string; href: string }[];
  footerCta?: { label: string; href: string };
  pages: { slug: string; title: string; sections: { id: string; type: string; variant: string | null; visible: boolean; container: string; spacingTop: string; spacingBottom: string; anchorId: string | null; data: Record<string, unknown> }[] }[];
}

const DEMO_TENANTS: DemoTenantConfig[] = [
  {
    slug: 'demo-restaurant',
    name: 'Trattoria Dal Maestro',
    industry: 'restaurant',
    activeStyle: 'classic',
    brand: { companyName: 'Trattoria Dal Maestro', tagline: 'Authentische italienische Küche in Innsbruck', primaryColor: '#9a3412' },
    contact: { phone: '+43 512 123 456', email: 'info@trattoria-dalmaestro.at', address: 'Maria-Theresien-Straße 24, 6020 Innsbruck' },
    socialLinks: { instagram: 'https://instagram.com/trattoria-dalmaestro', facebook: 'https://facebook.com/trattoria-dalmaestro' },
    openingHours: [
      { day: 'Di–Sa', hours: '11:30–14:30 & 17:30–23:00' },
      { day: 'So', hours: '11:30–22:00' },
      { day: 'Mo', hours: 'Ruhetag' },
    ],
    navItems: [
      { label: 'Speisekarte', href: '/speisekarte' },
      { label: 'Ambiente', href: '/ambiente' },
      { label: 'Events', href: '/events' },
      { label: 'Reservierung', href: '/reservierung' },
    ],
    navCta: { label: 'Tisch reservieren', href: '/reservierung' },
    footerColumns: [
      { title: 'Küche', items: [{ text: 'Speisekarte', href: '/speisekarte' }, { text: 'Empfehlungen', href: '/' }, { text: 'Events', href: '/events' }] },
      { title: 'Besuch', items: [{ text: 'Reservierung', href: '/reservierung' }, { text: 'Ambiente', href: '/ambiente' }] },
    ],
    footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    footerCta: { label: 'Tisch reservieren', href: '/reservierung' },
    pages: restaurantSite.pages.map(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        // Rewrite demo hrefs to use tenant-relative paths
        data: rewriteDemoHrefs(s.data as Record<string, unknown>, '/demo/restaurant'),
      })),
    })),
  },
  {
    slug: 'demo-hotel',
    name: 'Hotel Alpenblick',
    industry: 'hotel',
    activeStyle: 'classic',
    brand: { companyName: 'Hotel Alpenblick', tagline: 'Ihr Refugium in den Tiroler Alpen', primaryColor: '#7c5e3c' },
    contact: { phone: '+43 5242 1234', email: 'info@hotel-alpenblick.at', address: 'Bergstraße 8, 6370 Kitzbühel' },
    socialLinks: { instagram: 'https://instagram.com/hotel-alpenblick', facebook: 'https://facebook.com/hotel-alpenblick' },
    navItems: [
      { label: 'Zimmer', href: '/zimmer' },
      { label: 'Wellness', href: '/wellness' },
      { label: 'Restaurant', href: '/restaurant' },
      { label: 'Events', href: '/veranstaltungen' },
      { label: 'Galerie', href: '/galerie' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    navCta: { label: 'Jetzt buchen', href: '/kontakt' },
    footerColumns: [
      { title: 'Hotel', items: [{ text: 'Zimmer & Suiten', href: '/zimmer' }, { text: 'Wellness & Spa', href: '/wellness' }, { text: 'Restaurant', href: '/restaurant' }] },
      { title: 'Service', items: [{ text: 'Veranstaltungen', href: '/veranstaltungen' }, { text: 'Galerie', href: '/galerie' }, { text: 'Kontakt', href: '/kontakt' }] },
    ],
    footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    footerCta: { label: 'Jetzt buchen', href: '/kontakt' },
    pages: hotelSite.pages.map(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        data: rewriteDemoHrefs(s.data as Record<string, unknown>, '/demo/hotel'),
      })),
    })),
  },
  {
    slug: 'demo-salon',
    name: 'Studio Bellezza',
    industry: 'salon',
    activeStyle: 'classic',
    brand: { companyName: 'Studio Bellezza', tagline: 'Hair · Beauty · Wellness', primaryColor: '#be185d' },
    contact: { phone: '+49 89 987 654', email: 'hello@studio-bellezza.de', address: 'Maximilianstraße 15, 80539 München' },
    socialLinks: { instagram: 'https://instagram.com/studio-bellezza' },
    navItems: [
      { label: 'Services & Preise', href: '/services' },
      { label: 'Team', href: '/team' },
      { label: 'Galerie', href: '/galerie' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    navCta: { label: 'Termin buchen', href: '/kontakt' },
    footerColumns: [
      { title: 'Angebot', items: [{ text: 'Services & Preise', href: '/services' }, { text: 'Team', href: '/team' }, { text: 'Galerie', href: '/galerie' }] },
      { title: 'Studio', items: [{ text: 'Kontakt', href: '/kontakt' }, { text: 'Termin buchen', href: '/kontakt' }] },
    ],
    footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    footerCta: { label: 'Termin buchen', href: '/kontakt' },
    pages: salonSite.pages.map(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        data: rewriteDemoHrefs(s.data as Record<string, unknown>, '/demo/salon'),
      })),
    })),
  },
  {
    slug: 'demo-tourism',
    name: 'Tiroler Bergwelt',
    industry: 'tourism',
    activeStyle: 'classic',
    brand: { companyName: 'Tiroler Bergwelt', tagline: 'Natur erleben · Berge entdecken', primaryColor: '#0e7490' },
    contact: { phone: '+43 5242 9876', email: 'info@tiroler-bergwelt.at', address: 'Dorfplatz 3, 6365 Kirchberg' },
    socialLinks: { instagram: 'https://instagram.com/tiroler-bergwelt', facebook: 'https://facebook.com/tiroler-bergwelt' },
    navItems: [
      { label: 'Erlebnisse', href: '/erlebnisse' },
      { label: 'Orte', href: '/orte' },
      { label: 'Reiseplanung', href: '/planung' },
      { label: 'Galerie', href: '/galerie' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    navCta: { label: 'Erlebnisse entdecken', href: '/erlebnisse' },
    footerColumns: [
      { title: 'Entdecken', items: [{ text: 'Erlebnisse & Touren', href: '/erlebnisse' }, { text: 'Orte & Sehenswertes', href: '/orte' }, { text: 'Galerie', href: '/galerie' }] },
      { title: 'Service', items: [{ text: 'Reiseplanung', href: '/planung' }, { text: 'Kontakt', href: '/kontakt' }] },
    ],
    footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    footerCta: { label: 'Erlebnisse entdecken', href: '/erlebnisse' },
    pages: tourismSite.pages.map(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        data: rewriteDemoHrefs(s.data as Record<string, unknown>, '/demo/tourism'),
      })),
    })),
  },
  {
    slug: 'demo-medical',
    name: 'Praxis am Stadtpark',
    industry: 'medical',
    activeStyle: 'classic',
    brand: { companyName: 'Praxis am Stadtpark', tagline: 'Hausarztmedizin, Diagnostik und Prävention', primaryColor: '#0e7490' },
    contact: { phone: '+49 221 123 456', email: 'praxis@example.de', address: 'Parkallee 12, 50667 Köln' },
    socialLinks: {},
    openingHours: [
      { day: 'Mo–Fr', hours: '08:00–12:00 & 14:00–18:00' },
      { day: 'Sa', hours: 'nach Vereinbarung' },
    ],
    navItems: [
      { label: 'Leistungen', href: '/leistungen' },
      { label: 'Team', href: '/team' },
      { label: 'Patienten-Info', href: '/patienten' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    navCta: { label: 'Termin buchen', href: '/kontakt' },
    footerColumns: [
      { title: 'Praxis', items: [{ text: 'Leistungen', href: '/leistungen' }, { text: 'Ärzteteam', href: '/team' }, { text: 'Unsere Praxis', href: '/praxis' }] },
      { title: 'Patienten', items: [{ text: 'Patienten-Info', href: '/patienten' }, { text: 'Notfall', href: '/notfall' }, { text: 'Kontakt', href: '/kontakt' }] },
    ],
    footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    footerCta: { label: 'Termin buchen', href: '/kontakt' },
    pages: medicalSite.pages.map(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        data: rewriteDemoHrefs(s.data as Record<string, unknown>, '/demo/medical'),
      })),
    })),
  },
];

/**
 * Recursively rewrite hrefs that start with a demo prefix to be tenant-relative.
 * e.g., '/demo/restaurant/speisekarte' → '/speisekarte'
 */
function rewriteDemoHrefs(data: Record<string, unknown>, prefix: string): Record<string, unknown> {
  const json = JSON.stringify(data);
  const rewritten = json.replace(new RegExp(escapeRegex(prefix), 'g'), '');
  return JSON.parse(rewritten);
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function seedTenant(config: DemoTenantConfig) {
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
    if (!existing) { console.error(`  ❌ Failed to create or find tenant ${config.slug}`); return; }
    tenantId = existing.id;
    // Ensure isDemo is set
    await db.update(schema.tenants).set({ isDemo: true }).where(eq(schema.tenants.id, tenantId));
    console.log(`  ℹ️ Tenant exists, reusing ${tenantId}`);
  } else {
    console.log(`  ✅ Tenant created: ${tenantId}`);
  }

  // Clean existing data
  await db.delete(schema.publishedSnapshots).where(eq(schema.publishedSnapshots.tenantId, tenantId));
  await db.delete(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  await db.delete(schema.pages).where(eq(schema.pages.tenantId, tenantId));
  await db.delete(schema.navigation).where(eq(schema.navigation.tenantId, tenantId));
  await db.delete(schema.footer).where(eq(schema.footer.tenantId, tenantId));
  await db.delete(schema.globalSettings).where(eq(schema.globalSettings.tenantId, tenantId));
  await db.delete(schema.adminSecrets).where(eq(schema.adminSecrets.tenantId, tenantId));

  // Admin secret
  await db.insert(schema.adminSecrets).values({ tenantId, passwordHash: DEMO_PASSWORD_HASH });

  // Global settings
  await db.insert(schema.globalSettings).values({
    tenantId,
    brand: config.brand,
    contact: config.contact,
    socialLinks: config.socialLinks,
    openingHours: config.openingHours ?? [],
  });

  // Navigation
  await db.insert(schema.navigation).values({
    tenantId,
    items: config.navItems,
    cta: config.navCta,
  });

  // Footer
  await db.insert(schema.footer).values({
    tenantId,
    columns: config.footerColumns,
    legalLinks: config.footerLegalLinks,
    cta: config.footerCta ?? null,
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

    for (let j = 0; j < page.sections.length; j++) {
      const section = page.sections[j];
      await db.insert(schema.pageSections).values({
        tenantId,
        pageId: dbPage.id,
        type: section.type,
        data: section.data,
        sortOrder: j,
        visible: section.visible,
        container: section.container || 'default',
        spacingTop: section.spacingTop || 'l',
        spacingBottom: section.spacingBottom || 'l',
      });
      totalSections++;
    }
  }
  console.log(`  ✅ ${config.pages.length} pages, ${totalSections} sections`);

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
    createdBy: 'seed-demo-tenants',
  });
  console.log(`  ✅ Snapshot published`);
}

async function main() {
  console.log('🚀 Seeding all demo tenants…\n');

  for (const config of DEMO_TENANTS) {
    await seedTenant(config);
  }

  console.log('\n🎉 All demo tenants seeded!');
  console.log('   Password for all: demo2024');
}

main().catch(err => { console.error(err); process.exit(1); });
