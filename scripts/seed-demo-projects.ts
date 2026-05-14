/**
 * Seed demo projects collection for the Handwerk demo tenant.
 * Updates the portfolio section on the Referenzen page to link to detail pages.
 * Usage: npx tsx scripts/seed-demo-projects.ts
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

const PROJECTS = [
  {
    slug: 'badsanierung-altstadt-koeln',
    title: 'Komplettsanierung Altbau-Bad · Köln-Altstadt',
    category: 'Badsanierung',
    data: {
      excerpt: 'Aus einem 1960er-Jahre-Bad wurde ein modernes Wellness-Bad mit bodengleicher Dusche, Fußbodenheizung und hochwertigen Fliesen.',
      body: `## Ausgangslage\nDas bestehende Bad in einem Kölner Altbau war über 60 Jahre alt – veraltete Leitungen, undichte Fugen und kein barrierefreier Zugang.\n\n## Unsere Lösung\nKompletter Rückbau bis auf den Rohzustand. Neue Wasser- und Abwasserleitungen, Fußbodenheizung, bodengleiche Dusche mit Glasabtrennung, Unterputz-Armatur und großformatige Fliesen im Naturstein-Look.\n\n## Ergebnis\nEin zeitloses Bad mit Spa-Charakter – fertig in nur 4 Wochen. Der Kunde nutzt das Bad täglich und ist begeistert von der ebenerdigen Dusche.`,
      image: '/images/demo/bad-altstadt.webp',
      duration: '4 Wochen',
      year: '2024',
      stats: [
        { label: 'Fläche', value: '12 m²' },
        { label: 'Bauzeit', value: '4 Wochen' },
        { label: 'Investition', value: 'ca. 28.000 €' },
      ],
    },
  },
  {
    slug: 'heizungsmodernisierung-rodenkirchen',
    title: 'Heizungsmodernisierung mit Wärmepumpe · Rodenkirchen',
    category: 'Heizung & Klima',
    data: {
      excerpt: 'Austausch einer 25 Jahre alten Ölheizung gegen eine moderne Luft-Wasser-Wärmepumpe mit 70 % Förderung durch das BAFA.',
      body: `## Ausgangslage\nEin Einfamilienhaus aus den 90er-Jahren mit einer ineffizienten Ölheizung. Die Heizkosten lagen bei über 3.500 € pro Jahr.\n\n## Unsere Lösung\nDemontage der alten Ölheizung inkl. Tank, Installation einer Luft-Wasser-Wärmepumpe (Vaillant aroTHERM plus) mit 200-Liter-Pufferspeicher. Hydraulischer Abgleich aller Heizkörper.\n\n## Ergebnis\nDie Heizkosten sanken auf unter 1.200 € pro Jahr. Der Kunde erhielt 70 % Förderung über das BAFA – die Investition amortisiert sich in unter 5 Jahren.`,
      image: '/images/demo/heizung-rodenkirchen.webp',
      duration: '3 Tage',
      year: '2024',
      stats: [
        { label: 'Einsparung', value: '65 %' },
        { label: 'Förderung', value: '70 %' },
        { label: 'Amortisation', value: '< 5 Jahre' },
      ],
    },
  },
  {
    slug: 'notdienst-wasserrohrbruch-ehrenfeld',
    title: 'Notdienst Wasserrohrbruch · Köln-Ehrenfeld',
    category: 'Notdienst',
    data: {
      excerpt: 'Sonntagabend, Wasserschaden im Keller: Innerhalb von 45 Minuten waren wir vor Ort und haben den Schaden professionell behoben.',
      body: `## Ausgangslage\nSonntagabend um 21 Uhr: Ein Wasserrohrbruch im Keller eines Mehrfamilienhauses. Wasser stand bereits 5 cm hoch.\n\n## Unsere Lösung\nUnser Notdienst-Team war innerhalb von 45 Minuten vor Ort. Absperrung der Hauptleitung, Leckortung mit Wärmebildkamera, provisorische Reparatur noch in derselben Nacht. Am Folgetag: dauerhafte Instandsetzung und Trocknung.\n\n## Ergebnis\nDer Schaden wurde innerhalb von 24 Stunden vollständig behoben. Die Versicherung übernahm die Kosten – wir haben die Dokumentation direkt mitgeliefert.`,
      image: '/images/demo/notdienst-ehrenfeld.webp',
      duration: '24 Stunden',
      year: '2025',
      stats: [
        { label: 'Reaktionszeit', value: '45 Min.' },
        { label: 'Behebung', value: '24 Std.' },
        { label: 'Kosten', value: 'Versicherung' },
      ],
    },
  },
  {
    slug: 'gaeste-wc-lindenthal',
    title: 'Design-Gäste-WC auf 4 m² · Lindenthal',
    category: 'Badsanierung',
    data: {
      excerpt: 'Ein winziges Gäste-WC wurde mit cleverem Design und platzsparender Technik zum Hingucker – inklusive Handwaschbecken mit Unterschrank.',
      body: `## Ausgangslage\nNur 4 m² Fläche, ein altes Stand-WC und ein winziges Waschbecken ohne Stauraum. Der Raum wirkte dunkel und beengt.\n\n## Unsere Lösung\nWand-WC (Geberit), platzsparendes Handwaschbecken mit integriertem Unterschrank, großformatige helle Fliesen bis zur Decke, indirekte LED-Beleuchtung hinter dem Spiegel.\n\n## Ergebnis\nDer Raum wirkt doppelt so groß und ist ein echter Hingucker für Gäste. Fertigstellung in nur 5 Arbeitstagen.`,
      image: '/images/demo/gaeste-wc-lindenthal.webp',
      duration: '5 Tage',
      year: '2025',
      stats: [
        { label: 'Fläche', value: '4 m²' },
        { label: 'Bauzeit', value: '5 Tage' },
        { label: 'Investition', value: 'ca. 8.500 €' },
      ],
    },
  },
];

async function main() {
  console.log('🔨 Seeding projects collection for demo tenant…');

  // Ensure projects collection exists
  let [projCol] = await db.select().from(schema.collections)
    .where(and(eq(schema.collections.tenantId, TENANT_ID), eq(schema.collections.key, 'projects')));

  if (!projCol) {
    [projCol] = await db.insert(schema.collections).values({
      tenantId: TENANT_ID,
      key: 'projects',
      label: 'Projekte / Referenzen',
      schema: { fields: ['title', 'slug', 'excerpt', 'body', 'image', 'duration', 'year', 'stats'] },
    }).returning();
    console.log('  ✅ Collection "projects" created');
  } else {
    console.log('  ℹ️  Collection "projects" already exists');
  }

  // Upsert project items
  for (const proj of PROJECTS) {
    const existing = await db.select().from(schema.collectionItems)
      .where(and(
        eq(schema.collectionItems.tenantId, TENANT_ID),
        eq(schema.collectionItems.collectionId, projCol.id),
        eq(schema.collectionItems.slug, proj.slug),
      ));

    if (existing.length > 0) {
      await db.update(schema.collectionItems)
        .set({ title: proj.title, data: proj.data, published: true, updatedAt: new Date() })
        .where(eq(schema.collectionItems.id, existing[0].id));
      console.log(`  ↻ Updated: ${proj.title}`);
    } else {
      await db.insert(schema.collectionItems).values({
        tenantId: TENANT_ID,
        collectionId: projCol.id,
        slug: proj.slug,
        title: proj.title,
        data: proj.data,
        published: true,
        priority: PROJECTS.indexOf(proj),
      });
      console.log(`  ✅ Created: ${proj.title}`);
    }
  }

  // Update portfolio section on Referenzen page to link to project detail pages
  const [referenzenPage] = await db.select().from(schema.pages)
    .where(and(eq(schema.pages.tenantId, TENANT_ID), eq(schema.pages.slug, 'referenzen')));

  if (referenzenPage) {
    const sections = await db.select().from(schema.pageSections)
      .where(and(eq(schema.pageSections.pageId, referenzenPage.id), eq(schema.pageSections.type, 'portfolio')));

    for (const section of sections) {
      const data = section.data as Record<string, unknown>;
      const projects = (data.projects as Record<string, unknown>[]) || [];

      // Map existing projects to link to detail pages
      const projectSlugs = PROJECTS.map(p => p.slug);
      const updatedProjects = projects.map((p, i) => ({
        ...p,
        href: i < projectSlugs.length ? `/c/projects/${projectSlugs[i]}` : (p.href as string) || '',
        category: i < PROJECTS.length ? PROJECTS[i].category : (p.category as string) || '',
      }));

      await db.update(schema.pageSections)
        .set({ data: { ...data, projects: updatedProjects }, updatedAt: new Date() })
        .where(eq(schema.pageSections.id, section.id));
      console.log(`  ✅ Updated portfolio section with detail links`);
    }
  } else {
    console.log('  ⚠️  No Referenzen page found');
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
