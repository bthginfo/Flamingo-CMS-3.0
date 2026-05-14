/**
 * Seed demo content: news articles for the Handwerk demo tenant.
 * Usage: npx tsx scripts/seed-demo-news.ts
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../packages/db/src/schema';
import { eq, and } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const TENANT_ID = 'f50cbf53-279d-43f3-b58b-f5ae3d550ab2';

async function main() {
  console.log('📰 Seeding news articles for demo tenant…');

  // Ensure news collection exists
  let [newsCol] = await db.select().from(schema.collections)
    .where(and(eq(schema.collections.tenantId, TENANT_ID), eq(schema.collections.key, 'news')));

  if (!newsCol) {
    [newsCol] = await db.insert(schema.collections).values({
      tenantId: TENANT_ID,
      key: 'news',
      label: 'Neuigkeiten',
      schema: { fields: ['title', 'slug', 'excerpt', 'body', 'image', 'date'] },
      settings: {},
    }).returning();
    console.log('✅ News collection created');
  }

  // Delete existing items
  await db.delete(schema.collectionItems)
    .where(and(eq(schema.collectionItems.tenantId, TENANT_ID), eq(schema.collectionItems.collectionId, newsCol.id)));

  const articles = [
    {
      slug: 'waermepumpe-foerderung-2025',
      title: 'Neue Fördersätze 2025: Bis zu 70 % für Ihre Wärmepumpe',
      priority: 0,
      data: {
        excerpt: 'Die BAFA hat die Fördersätze für den Heizungstausch angepasst. Erfahren Sie, wie Sie von bis zu 70 % Zuschuss profitieren.',
        body: '<p>Ab Januar 2025 gelten neue Fördersätze für die Heizungsmodernisierung. Die Grundförderung liegt bei 30%, dazu kommen Klima-Geschwindigkeitsbonus (20%) und Einkommensbonus (30%).</p><p>Als zertifizierter Energieberater (BAFA) übernehmen wir den kompletten Förderantrag für Sie – kostenfrei. Vereinbaren Sie jetzt einen Beratungstermin!</p>',
        image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
        date: '2025-01-15',
      },
    },
    {
      slug: 'badsanierung-trends-2025',
      title: 'Badsanierung 2025: Diese Trends bestimmen das Design',
      priority: 1,
      data: {
        excerpt: 'Von XXL-Fliesen bis zur schwarzen Armatur – diese Badtrends setzen wir aktuell am häufigsten um.',
        body: '<p>Das moderne Bad wird zur Wellness-Oase. Unsere drei Top-Trends: großformatige Fliesen in Naturoptik, bodengleiche Walk-In-Duschen mit Regenbrause und matte schwarze Armaturen als Kontrastakzent.</p><p>Barrierefreiheit ist dabei kein Kompromiss mehr, sondern integraler Bestandteil guten Designs. Lassen Sie sich von unseren 3D-Visualisierungen inspirieren!</p>',
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
        date: '2025-02-03',
      },
    },
    {
      slug: 'notdienst-rohrbruch-tipps',
      title: 'Rohrbruch: Was tun? Unsere Sofort-Tipps vom Profi',
      priority: 2,
      data: {
        excerpt: 'Wasser in der Wohnung? So reagieren Sie richtig – und so schnell sind wir bei Ihnen.',
        body: '<p><strong>Schritt 1:</strong> Hauptwasserhahn zudrehen (meist im Keller oder Hausanschlussraum). <strong>Schritt 2:</strong> Strom in betroffenen Räumen abschalten. <strong>Schritt 3:</strong> Uns anrufen unter 0221 / 98 76 54 0.</p><p>Unser Notdienst ist 24/7 erreichbar und in der Regel innerhalb von 60 Minuten bei Ihnen vor Ort in Köln und Umgebung.</p>',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80',
        date: '2025-03-10',
      },
    },
    {
      slug: 'mitarbeiter-des-monats-klaus',
      title: 'Mitarbeiter im Fokus: Klaus Weber feiert 15-jähriges Jubiläum',
      priority: 3,
      data: {
        excerpt: 'Unser Obermonteur Klaus Weber ist seit 15 Jahren das Herzstück unseres Heizungsteams.',
        body: '<p>Klaus Weber kam 2010 als Geselle zu uns und hat sich zum Obermonteur Heizung entwickelt. Mit über 3.000 Heizungsinstallationen ist er unser Spezialist für Fußbodenheizung und hydraulischen Abgleich.</p><p>„Was ich an meinem Job am meisten schätze? Wenn der Kunde am Ende strahlt, weil alles perfekt funktioniert", sagt Klaus. Herzlichen Glückwunsch zum Jubiläum!</p>',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
        date: '2025-03-20',
      },
    },
    {
      slug: 'energieberatung-kosten-sparen',
      title: 'Energieberatung: So senken Sie Ihre Heizkosten um bis zu 60 %',
      priority: 4,
      data: {
        excerpt: 'Eine professionelle Energieberatung zeigt auf, wo Ihr Haus Energie verliert – und wie sich die Investition in wenigen Jahren rechnet.',
        body: '<p>Steigende Energiekosten belasten viele Haushalte. Eine BAFA-zertifizierte Energieberatung (iSFP) kostet ab 300 € Eigenanteil und zeigt konkret, welche Maßnahmen sich lohnen.</p><p>Typische Einsparpotenziale: Heizungstausch (30-60%), Dachdämmung (15-25%), Fenstererneuerung (10-20%). Wir begleiten Sie vom Beratungsgespräch bis zum fertigen Förderantrag.</p>',
        image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80',
        date: '2025-04-05',
      },
    },
  ];

  for (const a of articles) {
    await db.insert(schema.collectionItems).values({
      tenantId: TENANT_ID,
      collectionId: newsCol.id,
      slug: a.slug,
      title: a.title,
      data: a.data,
      published: true,
      priority: a.priority,
    });
  }

  console.log(`✅ ${articles.length} news articles seeded`);

  // Also ensure a "News" page exists with a newsGrid section
  const existingNewsPage = await db.select().from(schema.pages)
    .where(and(eq(schema.pages.tenantId, TENANT_ID), eq(schema.pages.slug, 'neuigkeiten')));

  if (existingNewsPage.length === 0) {
    const [newsPage] = await db.insert(schema.pages).values({
      tenantId: TENANT_ID,
      title: 'Neuigkeiten',
      slug: 'neuigkeiten',
      type: 'free',
      status: 'published',
      visible: true,
      sortOrder: 5,
    }).returning();

    await db.insert(schema.pageSections).values([
      {
        tenantId: TENANT_ID,
        pageId: newsPage.id,
        type: 'hero',
        sortOrder: 0,
        visible: true,
        data: {
          headline: 'Neuigkeiten & Tipps',
          subline: 'Aktuelles aus unserem Betrieb, Fördernews und praktische Ratgeber rund um Heizung, Sanitär und Bad.',
          badgeText: 'Blog',
          bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80',
        },
      },
      {
        tenantId: TENANT_ID,
        pageId: newsPage.id,
        type: 'newsGrid',
        sortOrder: 1,
        visible: true,
        data: {
          headline: 'Aktuelle Beiträge',
          collectionKey: 'news',
          layout: 'grid',
        },
      },
    ]);
    console.log('✅ Neuigkeiten page created');
  }

  // Update navigation to include Neuigkeiten
  const [nav] = await db.select().from(schema.navigation).where(eq(schema.navigation.tenantId, TENANT_ID));
  if (nav) {
    const items = nav.items as { label: string; href: string; type?: string }[];
    const hasNews = items.some(i => i.href === '/neuigkeiten');
    if (!hasNews) {
      // Insert before Kontakt
      const kontaktIdx = items.findIndex(i => i.href === '/kontakt');
      const newItem = { label: 'Neuigkeiten', href: '/neuigkeiten', type: 'link' };
      if (kontaktIdx >= 0) {
        items.splice(kontaktIdx, 0, newItem);
      } else {
        items.push(newItem);
      }
      await db.update(schema.navigation).set({ items }).where(eq(schema.navigation.id, nav.id));
      console.log('✅ Navigation updated with Neuigkeiten');
    }
  }

  console.log('\n🎉 Demo content seeded! Remember to re-publish the snapshot.');
}

main().catch(console.error);
