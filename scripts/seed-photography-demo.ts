/**
 * Seed a photography DEMO tenant (isDemo=true) for the /demo/photography route.
 * Usage: npx tsx scripts/seed-photography-demo.ts
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../packages/db/src/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const DEMO_PASSWORD_HASH = '$2a$12$HMKCVT2eAmQj0huq6SUShOGHQOVNO4FWi4teS8IbQvrrymkpRjVHK'; // demo2024

const CONFIG = {
  slug: 'demo-photography',
  name: 'Lisa Fotografie',
  industry: 'photography' as const,
  brand: {
    companyName: 'Lisa Fotografie',
    tagline: 'Emotionale Momentaufnahmen – Hochzeiten, Paare & Portraits im Rhein-Main-Gebiet',
    primaryColor: '#9c7c5c',
  },
  contact: { phone: '+49 171 1234567', email: 'hello@lisa-fotografie.de', address: 'Mainstraße 8, 55116 Mainz' },
  socialLinks: { instagram: 'https://instagram.com/lisafotografie' },
  openingHours: [
    { day: 'Mo–Fr', hours: 'Nach Vereinbarung' },
    { day: 'Sa–So', hours: 'Shootings' },
  ],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Portfolio', href: '/portfolio', type: 'link' },
    { label: 'Leistungen', href: '/leistungen', type: 'link' },
    { label: 'Über mich', href: '/ueber-mich', type: 'link' },
    { label: 'FAQ', href: '/faq', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Anfragen', href: '/kontakt' },
  footerColumns: [
    { title: 'Fotografie', items: [{ text: 'Hochzeiten', href: '/leistungen' }, { text: 'Paare', href: '/leistungen' }, { text: 'Babybauch', href: '/leistungen' }, { text: 'Portraits', href: '/leistungen' }] },
    { title: 'Mehr', items: [{ text: 'Portfolio', href: '/portfolio' }, { text: 'FAQ', href: '/faq' }, { text: 'Über mich', href: '/ueber-mich' }] },
    { title: 'Kontakt', items: [{ text: '+49 171 1234567' }, { text: 'hello@lisa-fotografie.de' }, { text: 'Mainz' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Jetzt anfragen', href: '/kontakt' },
  pages: [
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Emotionale Momentaufnahmen',
          subline: 'Hochzeitsfotografie, Portraits & Paarshootings im Rhein-Main-Gebiet. Authentisch, natürlich, voller Gefühl.',
          badgeText: 'Fotografin seit 2016',
          bgImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1800&q=85',
          trustItems: ['Über 200 Hochzeiten', 'Rhein-Main-Gebiet', 'LGBTQ+ friendly'],
          primaryCta: { label: 'Jetzt anfragen', href: '/kontakt' },
          secondaryCta: { label: 'Portfolio ansehen', href: '/portfolio' },
        }},
        { type: 'uspStrip', sortOrder: 1, data: {
          items: [
            { icon: 'camera', title: 'Natürlicher Stil', text: 'Keine gestellten Posen – echte Emotionen.' },
            { icon: 'heart', title: 'Mit Leidenschaft', text: 'Jede Hochzeit ist einzigartig, so wie meine Fotos.' },
            { icon: 'clock', title: 'Flexible Pakete', text: 'Von 3 bis 10 Stunden, individuell auf euch abgestimmt.' },
            { icon: 'image', title: 'Schnelle Lieferung', text: 'Eure Galerie innerhalb von 8 Wochen.' },
          ],
        }},
        { type: 'portfolioGallery', sortOrder: 2, data: {
          badge: 'Portfolio',
          headline: 'Einblicke in meine Arbeit',
          subline: 'Eine Auswahl meiner liebsten Hochzeits- und Paarfotos.',
          categories: ['Hochzeiten', 'Paare', 'Portraits'],
          images: [
            { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', alt: 'First Look', category: 'Hochzeiten' },
            { src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80', alt: 'Brautpaar im Weinberg', category: 'Hochzeiten' },
            { src: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80', alt: 'Hochzeitstanz', category: 'Hochzeiten' },
            { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80', alt: 'Paar am See', category: 'Paare' },
            { src: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&q=80', alt: 'Golden Hour', category: 'Paare' },
            { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80', alt: 'Portrait', category: 'Portraits' },
          ],
        }},
        { type: 'photographerAbout', sortOrder: 3, data: {
          badge: 'Über mich',
          headline: 'Hi, ich bin Lisa!',
          intro: 'Fotografin aus Leidenschaft, basiert im Rhein-Main-Gebiet. Seit 2016 begleite ich Paare an ihrem großen Tag.',
          story: 'Meine Kamera ist mein ständiger Begleiter. Was mich antreibt: echte Emotionen, natürliches Licht und die Geschichten hinter jedem Lächeln.',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
          values: [
            { title: 'Authentisch', text: 'Keine steifen Posen – ihr seid ihr selbst.' },
            { title: 'Emotional', text: 'Die großen Gefühle und kleinen Details.' },
            { title: 'Persönlich', text: 'Vom Kennenlernen bis zur Galerie an eurer Seite.' },
            { title: 'Professionell', text: 'Zuverlässig, erfahren, gut organisiert.' },
          ],
          ctaLabel: 'Mehr über mich',
          ctaHref: '/ueber-mich',
        }},
        { type: 'shootingProcess', sortOrder: 4, data: {
          badge: 'So läuft es ab',
          headline: 'Euer Weg zu perfekten Fotos',
          steps: [
            { icon: 'message', title: 'Anfrage & Kennenlernen', text: 'Ihr schreibt mir und wir verabreden ein unverbindliches Gespräch.' },
            { icon: 'calendar', title: 'Planung & Buchung', text: 'Wir besprechen eure Wünsche und ich reserviere euren Termin.' },
            { icon: 'camera', title: 'Der große Tag', text: 'Ich begleite euch diskret und halte die magischen Momente fest.' },
            { icon: 'image', title: 'Bildbearbeitung', text: 'Innerhalb von 8 Wochen bearbeite ich alle Fotos in meinem Stil.' },
            { icon: 'send', title: 'Eure Galerie', text: 'Ihr erhaltet eure Online-Galerie zum Teilen und einen USB-Stick.' },
          ],
        }},
        { type: 'testimonials', sortOrder: 5, data: {
          headline: 'Was meine Paare sagen',
          badgeText: 'Bewertungen',
          ratingValue: '5.0 von 5',
          ratingCount: '89 Bewertungen',
          items: [
            { quote: 'Lisa hat unseren Tag perfekt eingefangen. Die Fotos sind unglaublich natürlich und emotional.', name: 'Julia & Marco', context: 'Hochzeit in Eltville', rating: 5 },
            { quote: 'Wir haben uns vom ersten Moment an wohlgefühlt. Lisa hat ein unglaubliches Gespür für besondere Augenblicke.', name: 'Sarah & Tim', context: 'Hochzeit in Mainz', rating: 5 },
            { quote: 'Die Bilder haben uns zu Tränen gerührt. Jedes einzelne erzählt eine Geschichte.', name: 'Anna & David', context: 'Hochzeit in Frankfurt', rating: 5 },
          ],
        }},
        { type: 'ctaBand', sortOrder: 6, data: {
          headline: 'Bereit für unvergessliche Fotos?',
          subline: 'Sichert euch jetzt euren Wunschtermin – beliebte Daten sind schnell vergeben.',
          badgeText: 'Jetzt anfragen',
          ctaPrimary: { label: 'Termin sichern', href: '/kontakt' },
        }},
      ],
    },
    {
      slug: 'portfolio', title: 'Portfolio', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Portfolio',
          subline: 'Eine Auswahl meiner schönsten Arbeiten.',
          bgImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1800&q=85',
        }},
        { type: 'portfolioGallery', sortOrder: 1, data: {
          badge: 'Galerie',
          headline: 'Meine Arbeiten',
          categories: ['Hochzeiten', 'Paare', 'Babybauch', 'Portraits', 'JGA'],
          images: [
            { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', alt: 'First Look am Schloss', category: 'Hochzeiten', location: 'Eltville' },
            { src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80', alt: 'Weinberg-Shooting', category: 'Hochzeiten', location: 'Ingelheim' },
            { src: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80', alt: 'Eröffnungstanz', category: 'Hochzeiten', location: 'Frankfurt' },
            { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80', alt: 'Am See', category: 'Paare', location: 'Mainz' },
            { src: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&q=80', alt: 'Golden Hour', category: 'Paare', location: 'Wiesbaden' },
            { src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80', alt: 'Outdoor Portrait', category: 'Portraits' },
            { src: 'https://images.unsplash.com/photo-1509027572446-af8401acfdc3?w=600&q=80', alt: 'Babybauch im Park', category: 'Babybauch' },
            { src: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=600&q=80', alt: 'JGA im Weinberg', category: 'JGA', location: 'Rheingau' },
          ],
        }},
      ],
    },
    {
      slug: 'leistungen', title: 'Leistungen', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Leistungen & Pakete',
          subline: 'Flexible Pakete für Hochzeiten, Paarshootings und mehr.',
          bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1800&q=85',
        }},
        { type: 'servicesGrid', sortOrder: 1, data: {
          headline: 'Meine Leistungen',
          subline: 'Von der Hochzeitsreportage bis zum Einzelportrait – ich biete verschiedene Shooting-Formate, individuell auf euch zugeschnitten.',
          badgeText: 'Übersicht',
          manualCards: [
            { title: 'Hochzeitsreportage', text: 'Eure komplette Hochzeit in authentischen Bildern – von Getting Ready bis Party.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', mediaType: 'image', href: '/c/leistungen/hochzeitsreportage' },
            { title: 'Babybauch-Shooting', text: 'Die wunderschöne Vorfreude auf euer Baby in stimmungsvollen Bildern festgehalten.', image: 'https://images.unsplash.com/photo-1509027572446-af8401acfdc3?w=600&q=80', mediaType: 'image', href: '/c/leistungen/babybauch' },
            { title: 'Paarshooting', text: 'Zeit zu zweit – ob Verlobung, Jahrestag oder einfach so.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80', mediaType: 'image', href: '/c/leistungen/paarshooting' },
            { title: 'JGA Shooting', text: 'Feiert den Junggesellenabschied mit unvergesslichen Gruppenfotos.', image: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=600&q=80', mediaType: 'image', href: '/c/leistungen/jga-shooting' },
            { title: 'Portrait-Shooting', text: 'Eure Persönlichkeit aufs Bild – für Business, Social Media oder privat.', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80', mediaType: 'image', href: '/c/leistungen/portrait' },
            { title: 'After-Wedding', text: 'Entspannte Fotos nach der Hochzeit – ohne Zeitdruck, an eurem Lieblingsort.', image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80', mediaType: 'image', href: '/c/leistungen/after-wedding' },
          ],
        }},
        { type: 'servicePackages', sortOrder: 2, data: {
          badge: 'Pakete',
          headline: 'Hochzeitsfotografie',
          subline: 'Individuell abgestimmte Pakete für euren großen Tag.',
          packages: [
            { name: 'Standesamt', price: 'ab 490€', description: 'Perfekt für kleine, intime Trauungen.', features: ['3 Stunden Begleitung', 'Ca. 150-200 Fotos', 'Online-Galerie', 'USB-Stick', '10 Prints'], ctaLabel: 'Anfragen', ctaHref: '/kontakt' },
            { name: 'Hochzeitsreportage', price: 'ab 1.490€', highlighted: true, description: 'Die volle Begleitung eures Tages.', features: ['6-8 Stunden', 'Ca. 400-600 Fotos', 'Getting Ready bis Torte', 'Brautpaar-Shooting', 'Galerie & USB', '25 Prints', 'Vorgespräch'], ctaLabel: 'Anfragen', ctaHref: '/kontakt' },
            { name: 'Premium', price: 'ab 2.290€', description: 'Das volle Programm.', features: ['Bis 10 Stunden', 'Ca. 600-900 Fotos', 'Getting Ready bis Party', 'Engagement-Shooting', 'Fotobuch', '50 Prints', 'Second Shooter'], ctaLabel: 'Anfragen', ctaHref: '/kontakt' },
          ],
          note: 'Alle Preise verstehen sich als Startpreise.',
        }},
        { type: 'servicePackages', sortOrder: 3, data: {
          badge: 'Weitere Shootings',
          headline: 'Paar, Portrait & mehr',
          packages: [
            { name: 'Paarshooting', price: 'ab 290€', features: ['1-2 Stunden', '50-80 Fotos', 'Location-Beratung', 'Online-Galerie'], ctaLabel: 'Anfragen', ctaHref: '/kontakt' },
            { name: 'Babybauch', price: 'ab 250€', features: ['1 Stunde', '30-50 Fotos', 'Indoor oder Outdoor', 'Online-Galerie'], ctaLabel: 'Anfragen', ctaHref: '/kontakt' },
            { name: 'JGA Shooting', price: 'ab 350€', features: ['1-2 Stunden', '80-120 Fotos', 'Gruppen & Einzelportraits', 'Online-Galerie'], ctaLabel: 'Anfragen', ctaHref: '/kontakt' },
          ],
        }},
      ],
    },
    {
      slug: 'ueber-mich', title: 'Über mich', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Über mich',
          subline: 'Die Person hinter der Kamera.',
          bgImage: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1800&q=85',
        }},
        { type: 'photographerAbout', sortOrder: 1, data: {
          badge: 'Über mich',
          headline: 'Hi, ich bin Lisa!',
          intro: 'Fotografin aus Leidenschaft, basiert im wunderschönen Rheinhessen. Seit 2016 widme ich mich der Hochzeits- und Portraitfotografie.',
          story: 'Die Fotografie begleitet mich schon mein ganzes Leben. Inspiriert von meinem Opa, der mir mit 14 meine erste Kamera schenkte. Heute ist es mein größtes Glück, echte Emotionen in Bildern festzuhalten.',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
          facts: ['Seit 2016 selbstständig', 'Über 200 Hochzeiten', 'Basiert in Rheinhessen', 'Sony Alpha 7 IV', 'LGBTQ+ friendly'],
          values: [
            { title: 'Natürlichkeit', text: 'Keine steifen Posen. Ihr seid ihr selbst.' },
            { title: 'Emotionen', text: 'Die großen Highlights und die kleinen Gesten.' },
            { title: 'Vertrauen', text: 'Transparent und zuverlässig.' },
            { title: 'Qualität', text: 'Jedes Bild sorgfältig bearbeitet.' },
          ],
          ctaLabel: 'Schreibt mir',
          ctaHref: '/kontakt',
        }},
      ],
    },
    {
      slug: 'faq', title: 'FAQ', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Häufige Fragen',
          subline: 'Alles was ihr vor der Buchung wissen solltet.',
          bgImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1800&q=85',
        }},
        { type: 'faq', sortOrder: 1, data: {
          headline: 'FAQ',
          badgeText: 'Häufige Fragen',
          items: [
            { question: 'Wie früh sollten wir buchen?', answer: '6-12 Monate Vorlauf empfohlen. Beliebte Sommer-Samstage sind oft 1-2 Jahre vorher vergeben.' },
            { question: 'Wie viele Fotos erhalten wir?', answer: 'Bei 8h-Reportage ca. 400-600 fertig bearbeitete Bilder.' },
            { question: 'Wie lange dauert die Bearbeitung?', answer: 'Innerhalb von 8 Wochen nach der Hochzeit.' },
            { question: 'Auch Verlobungsshootings?', answer: 'Ja! Perfekt um sich vor der Kamera einzugrooven.' },
            { question: 'Was bei schlechtem Wetter?', answer: 'Regen erzeugt stimmungsvolle Fotos! Wir machen das Beste draus.' },
            { question: 'Auch außerhalb der Region?', answer: 'Bundesweit möglich. Anfahrt wird extra berechnet.' },
            { question: 'Bietest du Videos an?', answer: 'Ich konzentriere mich auf Fotografie. Für Videos empfehle ich Kollegen.' },
            { question: 'Welches Format?', answer: 'Hochaufgelöste JPEGs ohne Wasserzeichen.' },
          ],
        }},
      ],
    },
    {
      slug: 'kontakt', title: 'Kontakt', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kontakt',
          subline: 'Erzählt mir von euren Plänen!',
          bgImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1800&q=85',
        }},
        { type: 'contact', sortOrder: 1, data: {
          headline: 'Schreibt mir',
          subline: 'Ich freue mich auf eure Nachricht und melde mich innerhalb von 24 Stunden.',
          badgeText: 'Kontakt',
        }},
      ],
    },
  ],
  collections: [
    {
      key: 'leistungen',
      label: 'Leistungen',
      items: [
        { slug: 'hochzeitsreportage', title: 'Hochzeitsreportage', priority: 1, data: { title: 'Hochzeitsreportage', description: 'Eure komplette Hochzeit in authentischen Bildern.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', features: ['6-12 Stunden', 'Getting Ready bis Party', '400-1000 Fotos'], price: 'ab 1.490€' } },
        { slug: 'babybauch', title: 'Babybauch-Shooting', priority: 2, data: { title: 'Babybauch-Shooting', description: 'Die wunderschöne Vorfreude festgehalten.', image: 'https://images.unsplash.com/photo-1509027572446-af8401acfdc3?w=600&q=80', features: ['1 Stunde', '30-50 Fotos', 'Indoor/Outdoor'], price: 'ab 250€' } },
        { slug: 'paarshooting', title: 'Paarshooting', priority: 3, data: { title: 'Paarshooting', description: 'Zeit zu zweit in wunderschönen Bildern.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80', features: ['1-2 Stunden', '50-80 Fotos', 'Location-Beratung'], price: 'ab 290€' } },
        { slug: 'jga-shooting', title: 'JGA Shooting', priority: 4, data: { title: 'JGA Shooting', description: 'Spaß und Freundschaft festhalten.', image: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=600&q=80', features: ['1-2 Stunden', '80-120 Fotos', 'Gruppen & Einzel'], price: 'ab 350€' } },
        { slug: 'portrait', title: 'Portrait-Shooting', priority: 5, data: { title: 'Portrait-Shooting', description: 'Eure Persönlichkeit aufs Bild.', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80', features: ['45-60 Min', '20-30 Fotos', 'Business/Privat'], price: 'ab 220€' } },
        { slug: 'after-wedding', title: 'After-Wedding-Shooting', priority: 6, data: { title: 'After-Wedding-Shooting', description: 'Entspannte Fotos nach der Hochzeit – ohne Zeitdruck, an eurem Lieblingsort.', image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80', features: ['1-2 Stunden', '60-100 Fotos', 'Location eurer Wahl', 'Brautkleid nochmal tragen'], price: 'ab 350€' } },
      ],
    },
  ],
};

async function main() {
  console.log('🚀 Seeding photography DEMO tenant…');

  const [tenant] = await db.insert(schema.tenants).values({
    name: CONFIG.name,
    slug: CONFIG.slug,
    industry: CONFIG.industry,
    activeStyle: 'classic',
    status: 'active',
    isDemo: true,
  }).onConflictDoNothing().returning();

  let tenantId = tenant?.id;
  if (!tenantId) {
    const [existing] = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, CONFIG.slug));
    if (!existing) { console.error('❌ Failed'); process.exit(1); }
    tenantId = existing.id;
    await db.update(schema.tenants).set({ isDemo: true, industry: CONFIG.industry }).where(eq(schema.tenants.id, tenantId));
    console.log(`ℹ️ Reusing ${tenantId}`);
  } else {
    console.log(`✅ Created: ${tenantId}`);
  }

  // Clean
  await db.delete(schema.publishedSnapshots).where(eq(schema.publishedSnapshots.tenantId, tenantId));
  await db.delete(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  await db.delete(schema.pages).where(eq(schema.pages.tenantId, tenantId));
  await db.delete(schema.collectionItems).where(eq(schema.collectionItems.tenantId, tenantId));
  await db.delete(schema.collections).where(eq(schema.collections.tenantId, tenantId));
  await db.delete(schema.navigation).where(eq(schema.navigation.tenantId, tenantId));
  await db.delete(schema.footer).where(eq(schema.footer.tenantId, tenantId));
  await db.delete(schema.globalSettings).where(eq(schema.globalSettings.tenantId, tenantId));
  await db.delete(schema.adminSecrets).where(eq(schema.adminSecrets.tenantId, tenantId));

  await db.insert(schema.adminSecrets).values({ tenantId, passwordHash: DEMO_PASSWORD_HASH });
  await db.insert(schema.globalSettings).values({ tenantId, brand: CONFIG.brand as any, contact: CONFIG.contact as any, socialLinks: CONFIG.socialLinks as any, openingHours: CONFIG.openingHours as any });
  await db.insert(schema.navigation).values({ tenantId, items: CONFIG.navItems as any, cta: CONFIG.navCta as any });
  await db.insert(schema.footer).values({ tenantId, columns: CONFIG.footerColumns as any, legalLinks: CONFIG.footerLegalLinks as any, cta: CONFIG.footerCta as any });

  let totalSections = 0;
  for (let i = 0; i < CONFIG.pages.length; i++) {
    const page = CONFIG.pages[i];
    const [dbPage] = await db.insert(schema.pages).values({ tenantId, title: page.title, slug: page.slug || 'startseite', type: 'free', status: 'published', visible: true, sortOrder: i }).returning();
    for (const section of page.sections) {
      await db.insert(schema.pageSections).values({ tenantId, pageId: dbPage.id, type: section.type, data: section.data as any, sortOrder: section.sortOrder, visible: true, container: 'default', spacingTop: 'l', spacingBottom: 'l' });
      totalSections++;
    }
  }
  console.log(`✅ ${CONFIG.pages.length} pages, ${totalSections} sections`);

  let totalItems = 0;
  for (const col of CONFIG.collections) {
    const [dbCol] = await db.insert(schema.collections).values({ tenantId, key: col.key, label: col.label, schema: {}, settings: {} }).returning();
    for (const item of col.items) {
      await db.insert(schema.collectionItems).values({ tenantId, collectionId: dbCol.id, slug: item.slug, title: item.title, data: item.data as any, published: true, priority: item.priority ?? 0 });
      totalItems++;
    }
  }
  console.log(`✅ ${CONFIG.collections.length} collections, ${totalItems} items`);

  // Snapshot
  const allPages = await db.select().from(schema.pages).where(eq(schema.pages.tenantId, tenantId));
  const allSections = await db.select().from(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  const snapshot = { pages: allPages.map(p => ({ ...p, sections: allSections.filter(s => s.pageId === p.id).sort((a, b) => a.sortOrder - b.sortOrder) })), generatedAt: new Date().toISOString() };
  const checksum = crypto.createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
  await db.insert(schema.publishedSnapshots).values({ tenantId, version: 1, snapshot: snapshot as any, checksum, isActive: true, createdBy: 'seed-photography-demo' });
  console.log(`✅ Snapshot published`);
  console.log('\n🎉 Photography demo tenant ready! Password: demo2024');
}

main().catch(err => { console.error(err); process.exit(1); });
