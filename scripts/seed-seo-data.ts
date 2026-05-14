import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../packages/db/src/schema';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const TENANT_ID = 'f50cbf53-279d-43f3-b58b-f5ae3d550ab2';

async function main() {
  // 1. Seed seo_global
  const existing = await db.select().from(schema.seoGlobal).where(eq(schema.seoGlobal.tenantId, TENANT_ID)).limit(1);
  if (existing.length === 0) {
    await db.insert(schema.seoGlobal).values({
      tenantId: TENANT_ID,
      defaultTitle: 'Müller & Söhne Meisterbetrieb',
      titleTemplate: '%s | Müller & Söhne Meisterbetrieb Köln',
      defaultDescription: 'Ihr Meisterbetrieb für Heizung, Sanitär & Bäder in Köln. Seit über 35 Jahren Qualität, Zuverlässigkeit und faire Preise. Jetzt kostenlos beraten lassen!',
      canonicalBase: 'https://mueller-soehne.flamingomedia.online',
      locale: 'de_DE',
      robots: 'index,follow',
    });
    console.log('Created seo_global');
  } else {
    await db.update(schema.seoGlobal).set({
      defaultTitle: 'Müller & Söhne Meisterbetrieb',
      titleTemplate: '%s | Müller & Söhne Meisterbetrieb Köln',
      defaultDescription: 'Ihr Meisterbetrieb für Heizung, Sanitär & Bäder in Köln. Seit über 35 Jahren Qualität, Zuverlässigkeit und faire Preise. Jetzt kostenlos beraten lassen!',
      canonicalBase: 'https://mueller-soehne.flamingomedia.online',
    }).where(eq(schema.seoGlobal.tenantId, TENANT_ID));
    console.log('Updated seo_global');
  }

  // 2. Seed seo_page for each page
  const pages = await db.select({ id: schema.pages.id, slug: schema.pages.slug, title: schema.pages.title })
    .from(schema.pages).where(eq(schema.pages.tenantId, TENANT_ID));

  const seoData: Record<string, { metaTitle: string; metaDescription: string }> = {
    '': {
      metaTitle: 'Heizung, Sanitär & Bäder in Köln',
      metaDescription: 'Müller & Söhne – Ihr Meisterbetrieb für Heizung, Sanitär und Badsanierung in Köln. Über 35 Jahre Erfahrung. Kostenlose Erstberatung & Festpreisgarantie.',
    },
    'home': {
      metaTitle: 'Heizung, Sanitär & Bäder in Köln',
      metaDescription: 'Müller & Söhne – Ihr Meisterbetrieb für Heizung, Sanitär und Badsanierung in Köln. Über 35 Jahre Erfahrung. Kostenlose Erstberatung & Festpreisgarantie.',
    },
    'startseite': {
      metaTitle: 'Heizung, Sanitär & Bäder in Köln',
      metaDescription: 'Müller & Söhne – Ihr Meisterbetrieb für Heizung, Sanitär und Badsanierung in Köln. Über 35 Jahre Erfahrung. Kostenlose Erstberatung & Festpreisgarantie.',
    },
    'leistungen': {
      metaTitle: 'Unsere Leistungen',
      metaDescription: 'Heizungsinstallation, Badsanierung, Sanitärtechnik, Wartung & Notdienst. Alle Leistungen von Müller & Söhne im Überblick.',
    },
    'ueber-uns': {
      metaTitle: 'Über uns – Tradition & Handwerkskunst',
      metaDescription: 'Lernen Sie das Team von Müller & Söhne kennen. Seit 1987 Meisterqualität in Köln – familiär, zuverlässig und mit Leidenschaft fürs Handwerk.',
    },
    'kontakt': {
      metaTitle: 'Kontakt & Anfahrt',
      metaDescription: 'Kontaktieren Sie Müller & Söhne in Köln. Kostenlose Erstberatung, schnelle Terminvergabe. Tel: 0221 / 98 76 54 0.',
    },
    'news': {
      metaTitle: 'Neuigkeiten & Ratgeber',
      metaDescription: 'Aktuelle News, Tipps und Ratgeber rund um Heizung, Sanitär und Badsanierung von Ihrem Meisterbetrieb in Köln.',
    },
    'impressum': {
      metaTitle: 'Impressum',
      metaDescription: 'Impressum der Müller & Söhne Meisterbetrieb GmbH, Handwerkerstraße 12, 50667 Köln.',
    },
    'datenschutz': {
      metaTitle: 'Datenschutzerklärung',
      metaDescription: 'Datenschutzerklärung der Müller & Söhne Meisterbetrieb GmbH gemäß DSGVO.',
    },
  };

  for (const page of pages) {
    const seo = seoData[page.slug] || { metaTitle: page.title, metaDescription: '' };
    const existingPage = await db.select().from(schema.seoPage)
      .where(eq(schema.seoPage.pageId, page.id)).limit(1);
    
    if (existingPage.length === 0) {
      await db.insert(schema.seoPage).values({
        tenantId: TENANT_ID,
        pageId: page.id,
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        noindex: page.slug === 'impressum' || page.slug === 'datenschutz',
      });
      console.log(`Created seo_page for ${page.slug || 'home'}`);
    } else {
      await db.update(schema.seoPage).set({
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        noindex: page.slug === 'impressum' || page.slug === 'datenschutz',
      }).where(eq(schema.seoPage.pageId, page.id));
      console.log(`Updated seo_page for ${page.slug || 'home'}`);
    }
  }

  console.log('Done!');
}

main().catch(console.error);
