/**
 * Seed script: creates a demo "Handwerk" tenant with realistic content.
 * Usage: npx tsx scripts/seed-handwerk-demo.ts
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../packages/db/src/schema';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  console.log('🔧 Seeding Handwerk demo…');

  // ── 1. Tenant ─────────────────────────────────────────────────
  const [tenant] = await db.insert(schema.tenants).values({
    name: 'Müller & Söhne Meisterbetrieb',
    slug: 'mueller-soehne',
    industry: 'tradesman',
    activeStyle: 'classic',
    status: 'active',
  }).onConflictDoNothing().returning();

  const tenantId = tenant?.id;
  if (!tenantId) {
    const [existing] = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, 'mueller-soehne'));
    if (!existing) { console.error('Failed to create or find tenant'); process.exit(1); }
    console.log('Tenant already exists, using existing:', existing.id);
    await seedContent(existing.id);
    return;
  }
  console.log('✅ Tenant created:', tenantId);
  await seedContent(tenantId);
}

async function seedContent(tenantId: string) {
  // ── Clean existing data ────────────────────────────────────────
  await db.delete(schema.publishedSnapshots).where(eq(schema.publishedSnapshots.tenantId, tenantId));
  await db.delete(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  await db.delete(schema.pages).where(eq(schema.pages.tenantId, tenantId));
  await db.delete(schema.navigation).where(eq(schema.navigation.tenantId, tenantId));
  await db.delete(schema.footer).where(eq(schema.footer.tenantId, tenantId));
  await db.delete(schema.globalSettings).where(eq(schema.globalSettings.tenantId, tenantId));
  console.log('🧹 Cleaned existing data');

  // ── 2. Admin secret (password: "demo2024") ────────────────────
  const hash = '$2a$12$HMKCVT2eAmQj0huq6SUShOGHQOVNO4FWi4teS8IbQvrrymkpRjVHK';
  await db.insert(schema.adminSecrets).values({
    tenantId,
    passwordHash: hash,
  }).onConflictDoNothing();
  console.log('✅ Admin secret set (password: demo2024)');

  // ── 3. Global Settings ────────────────────────────────────────
  await db.insert(schema.globalSettings).values({
    tenantId,
    brand: {
      companyName: 'Müller & Söhne Meisterbetrieb',
      tagline: 'Ihr Experte für Heizung, Sanitär & Bäder seit 1987',
      primaryColor: '#1a5276',
      secondaryColor: '#2e86c1',
      accentColor: '#f39c12',
    },
    contact: {
      phone: '0221 / 98 76 54 0',
      email: 'info@mueller-soehne.de',
      address: 'Handwerkerstraße 12, 50667 Köln',
    },
    openingHours: [
      { day: 'Mo–Fr', hours: '07:30 – 17:00 Uhr' },
      { day: 'Sa', hours: '09:00 – 13:00 Uhr' },
      { day: 'Notdienst', hours: '24/7 erreichbar' },
    ],
    socialLinks: {
      instagram: 'https://instagram.com/mueller-soehne',
      facebook: 'https://facebook.com/mueller-soehne',
      google: 'https://g.page/mueller-soehne',
    },
  }).onConflictDoNothing();
  console.log('✅ Global settings');

  // ── 4. Navigation ─────────────────────────────────────────────
  await db.insert(schema.navigation).values({
    tenantId,
    items: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Leistungen', href: '/leistungen', type: 'link' },
      { label: 'Referenzen', href: '/referenzen', type: 'link' },
      { label: 'Über uns', href: '/ueber-uns', type: 'link' },
      { label: 'Kontakt', href: '/kontakt', type: 'link' },
    ],
  }).onConflictDoNothing();

  // ── 5. Footer ─────────────────────────────────────────────────
  await db.insert(schema.footer).values({
    tenantId,
    columns: [
      {
        title: 'Kontakt',
        items: [
          { text: '0221 / 98 76 54 0', href: 'tel:+492219876540' },
          { text: 'info@mueller-soehne.de', href: 'mailto:info@mueller-soehne.de' },
          { text: 'Handwerkerstraße 12, 50667 Köln' },
        ],
      },
      {
        title: 'Leistungen',
        items: [
          { text: 'Heizungsinstallation', href: '/leistungen' },
          { text: 'Badsanierung', href: '/leistungen' },
          { text: 'Notdienst 24/7', href: '/kontakt' },
        ],
      },
      {
        title: 'Öffnungszeiten',
        items: [
          { text: 'Mo–Fr: 07:30 – 17:00' },
          { text: 'Sa: 09:00 – 13:00' },
          { text: 'Notdienst: 24/7' },
        ],
      },
    ],
    legalLinks: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
    cta: { label: 'Kostenlose Beratung anfragen', href: '/kontakt' },
  }).onConflictDoNothing();
  console.log('✅ Navigation + Footer');

  // ── 6. Pages + Sections ───────────────────────────────────────

  // === STARTSEITE ===
  const [homePage] = await db.insert(schema.pages).values({
    tenantId, title: 'Startseite', slug: 'startseite', type: 'free', status: 'published', visible: true, sortOrder: 0,
  }).returning();

  const homeSections = [
    {
      type: 'hero', sortOrder: 0, data: {
        headline: 'Ihr Meisterbetrieb für Heizung, Sanitär & Bäder',
        subline: 'Seit über 35 Jahren vertrauen Kölner Familien und Unternehmen auf unsere Handwerkskunst. Von der Heizungswartung bis zur kompletten Badsanierung – wir sind für Sie da.',
        variant: 'split',
        badgeText: 'Meisterbetrieb seit 1987',
        trustItems: ['Über 2.500 zufriedene Kunden', '4,9 ★ Google-Bewertung', 'Festpreisgarantie'],
        primaryCta: { label: 'Kostenlos beraten lassen', href: '/kontakt' },
        secondaryCta: { label: 'Unsere Leistungen', href: '/leistungen' },
      },
    },
    {
      type: 'uspStrip', sortOrder: 1, data: {
        items: [
          { icon: 'trophy', title: 'Meisterbetrieb', text: 'Zertifizierter Fachbetrieb mit Meisterqualität seit 1987' },
          { icon: 'zap', title: '24/7 Notdienst', text: 'Rohrbruch oder Heizungsausfall? Wir sind rund um die Uhr für Sie da' },
          { icon: 'wallet', title: 'Festpreisgarantie', text: 'Transparente Kosten – keine versteckten Gebühren, versprochen' },
          { icon: 'leaf', title: 'Energieberatung', text: 'Staatlich geförderte Heizungsmodernisierung mit bis zu 70% Zuschuss' },
        ],
        layout: 'cards',
      },
    },
    {
      type: 'servicesGrid', sortOrder: 2, data: {
        headline: 'Unsere Leistungen',
        subline: 'Alles aus einer Hand – von der Planung bis zur Umsetzung',
        badgeText: 'Leistungen',
        source: 'manual',
        manualCards: [
          { title: 'Heizungsinstallation', text: 'Gas, Wärmepumpe, Pellets oder Solar – wir finden die perfekte Lösung für Ihr Zuhause.', icon: 'flame' },
          { title: 'Badsanierung', text: 'Vom barrierefreien Bad bis zum Wellness-Traumbad. Komplettservice inklusive Fliesen.', icon: 'shower' },
          { title: 'Sanitärinstallation', text: 'Professionelle Rohrverlegung, Anschlüsse und Reparaturen für Neu- und Altbau.', icon: 'wrench' },
          { title: 'Wartung & Service', text: 'Regelmäßige Heizungswartung verlängert die Lebensdauer und spart Energiekosten.', icon: 'settings' },
          { title: 'Notdienst 24/7', text: 'Rohrbruch, Heizungsausfall oder verstopfte Leitung? Wir kommen sofort!', icon: 'siren' },
          { title: 'Energieberatung', text: 'BAFA-zertifizierte Energieberatung und Förderanträge für Ihre Heizungsmodernisierung.', icon: 'bar-chart' },
        ],
        sort: 'priority',
      },
    },
    {
      type: 'processSteps', sortOrder: 3, data: {
        headline: 'So läuft Ihr Projekt ab',
        badgeText: 'Unser Prozess',
        steps: [
          { title: 'Kostenlose Erstberatung', text: 'Wir besprechen Ihre Wünsche und begutachten die Gegebenheiten vor Ort – komplett unverbindlich.', icon: 'clipboard' },
          { title: 'Individuelle Planung', text: 'Unsere Meister erstellen einen detaillierten Plan mit 3D-Visualisierung und Festpreisangebot.', icon: 'ruler' },
          { title: 'Professionelle Umsetzung', text: 'Unser erfahrenes Team setzt Ihr Projekt termingerecht und sauber um. Bauschutt? Nehmen wir mit.', icon: 'hard-hat' },
          { title: 'Qualitätskontrolle', text: 'Gemeinsame Abnahme aller Arbeiten. Erst wenn Sie zufrieden sind, ist der Auftrag erledigt.', icon: 'check-circle' },
          { title: 'Langzeit-Service', text: 'Auch nach dem Projekt sind wir für Sie da – mit Wartungsverträgen und schnellem Support.', icon: 'handshake' },
        ],
        style: 'timeline',
      },
    },
    {
      type: 'testimonials', sortOrder: 4, data: {
        headline: 'Was unsere Kunden sagen',
        items: [
          { quote: 'Die komplette Badsanierung war in 2 Wochen fertig – und das Ergebnis ist fantastisch! Alles aus einer Hand, super Team.', name: 'Familie Schneider', context: 'Badsanierung in Ehrenfeld', rating: 5 },
          { quote: 'Heizungsausfall am Sonntagabend und Herr Müller war innerhalb von 45 Minuten da. So muss Handwerk sein!', name: 'Thomas K.', context: 'Notdienst in Nippes', rating: 5 },
          { quote: 'Dank der Energieberatung haben wir 65% Förderung für unsere neue Wärmepumpe bekommen. Hat sich alles Herr Müller gekümmert.', name: 'Andrea & Peter M.', context: 'Heizungsmodernisierung in Rodenkirchen', rating: 5 },
          { quote: 'Seit 10 Jahren unser Sanitärbetrieb des Vertrauens. Immer pünktlich, immer fair, immer top Qualität.', name: 'Hausverwaltung Richter GmbH', context: 'Stammkunde seit 2014', rating: 5 },
        ],
        layout: 'cards',
      },
    },
    {
      type: 'faq', sortOrder: 5, data: {
        headline: 'Häufige Fragen',
        badgeText: 'FAQ',
        source: 'manual',
        items: [
          { question: 'Was kostet eine Badsanierung?', answer: 'Eine komplette Badsanierung beginnt ab ca. 8.000 € für ein Standardbad. Den genauen Preis erhalten Sie nach der kostenlosen Erstberatung als Festpreisangebot – ohne versteckte Kosten.' },
          { question: 'Wie lange dauert eine Heizungsmodernisierung?', answer: 'Der Austausch einer Heizungsanlage dauert in der Regel 2-3 Tage. Bei einer Umstellung auf Wärmepumpe planen wir ca. 1 Woche ein. Während der Umstellung sorgen wir für eine Übergangslösung.' },
          { question: 'Bieten Sie einen Notdienst an?', answer: 'Ja! Unser 24/7 Notdienst ist unter 0221 / 98 76 54 0 erreichbar. Bei Rohrbruch, Heizungsausfall oder anderen Notfällen sind wir meist innerhalb von 60 Minuten bei Ihnen.' },
          { question: 'Welche Fördermöglichkeiten gibt es für eine neue Heizung?', answer: 'Aktuell gibt es über die BAFA bis zu 70% Förderung für den Heizungstausch. Als zertifizierter Energieberater helfen wir Ihnen beim kompletten Förderantrag – kostenfrei.' },
          { question: 'Arbeiten Sie auch im Altbau?', answer: 'Selbstverständlich! Wir haben über 35 Jahre Erfahrung mit Kölner Altbauten. Denkmalschutz, enge Treppenhäuser, alte Leitungen – wir kennen alle Herausforderungen und finden immer eine Lösung.' },
        ],
        layout: 'accordion',
        expandFirst: true,
      },
    },
    {
      type: 'ctaBand', sortOrder: 6, data: {
        headline: 'Bereit für Ihr Projekt?',
        subline: 'Kostenlose Erstberatung vereinbaren und unverbindliches Festpreisangebot erhalten.',
        ctaPrimary: { label: 'Jetzt Termin vereinbaren', href: '/kontakt' },
        background: 'gradient',
      },
    },
  ];

  for (const s of homeSections) {
    await db.insert(schema.pageSections).values({
      tenantId, pageId: homePage.id, type: s.type, data: s.data, sortOrder: s.sortOrder, visible: true,
    });
  }
  console.log(`✅ Startseite: ${homeSections.length} Sektionen`);

  // === KONTAKT ===
  const [contactPage] = await db.insert(schema.pages).values({
    tenantId, title: 'Kontakt', slug: 'kontakt', type: 'free', status: 'published', visible: true, sortOrder: 4,
  }).returning();

  await db.insert(schema.pageSections).values({
    tenantId, pageId: contactPage.id, type: 'contact', sortOrder: 0, visible: true,
    data: {
      headline: 'Sprechen Sie uns an',
      introText: 'Ob Neubau, Sanierung oder Notfall – wir sind für Sie da. Rufen Sie uns an oder nutzen Sie das Kontaktformular für eine kostenlose Erstberatung.',
      badgeText: 'Kontakt',
      formEnabled: true, showOpeningHours: true,
      infoCards: [
        { icon: 'phone', label: 'Telefon', value: '0221 / 98 76 54 0' },
        { icon: 'mail', label: 'E-Mail', value: 'info@mueller-soehne.de' },
        { icon: 'map-pin', label: 'Standort', value: 'Köln & Umgebung' },
        { icon: 'clock', label: 'Öffnungszeiten', value: 'Mo–Fr 07:30–17:00' },
      ],
      submitLabel: 'Nachricht senden',
      gdprCheckboxText: 'Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu.',
    },
  });
  await db.insert(schema.pageSections).values({
    tenantId, pageId: contactPage.id, type: 'map', sortOrder: 1, visible: true,
    data: {
      headline: 'So finden Sie uns',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2515.5!2d6.9578!3d50.9375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDU2JzE1LjAiTiA2wrA1NycyOC4wIkU!5e0!3m2!1sde!2sde!4v1234567890',
      height: 'm',
      provider: 'embed',
    },
  });
  console.log('✅ Kontaktseite');

  // ── 7. Publish Snapshot ───────────────────────────────────────
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
    createdBy: 'seed-script',
  });
  console.log('✅ Snapshot v1 published');

  console.log('\n🎉 Demo-Handwerker "Müller & Söhne" ist fertig!');
  console.log('   Passwort für Admin: demo2024');
  console.log('   Starte den Renderer mit: pnpm --filter @flamingo/renderer dev');
}

main().catch(console.error);
