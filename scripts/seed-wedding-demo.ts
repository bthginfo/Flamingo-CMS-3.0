/**
 * Seed wedding demo tenant "Anna & Maximilian" with pages and sections.
 * Usage: npx tsx scripts/seed-wedding-demo.ts
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../packages/db/src/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const DATABASE_URL = 'postgresql://neondb_owner:npg_2Dvar0iXqMIc@ep-mute-recipe-ald7aiv3-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const TENANT_ID = crypto.randomUUID();
const DEMO_PASSWORD_HASH = '$2a$12$HMKCVT2eAmQj0huq6SUShOGHQOVNO4FWi4teS8IbQvrrymkpRjVHK'; // demo2024

function sid() { return crypto.randomUUID(); }

const PAGES = [
  {
    slug: '/',
    title: 'Startseite',
    sections: [
      { id: sid(), type: 'hero', data: { coupleName: 'Anna & Maximilian', date: '2026-09-12', venue: 'Schloss Ambras, Innsbruck', tagline: 'Wir heiraten!', bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80', overlayColor: '#000000', overlayOpacity: '0.3' } },
      { id: sid(), type: 'coupleStory', data: { headline: 'Unsere Geschichte', subline: 'Wie alles begann...', milestones: [
        { year: '2018', title: 'Das erste Treffen', text: 'Auf einer Geburtstagsfeier im Sommer trafen sich unsere Blicke zum ersten Mal.', image: '' },
        { year: '2019', title: 'Erster gemeinsamer Urlaub', text: 'Zwei Wochen in Portugal — und wir wussten: das ist es.', image: '' },
        { year: '2022', title: 'Zusammengezogen', text: 'Unsere erste gemeinsame Wohnung in Innsbruck, mit Blick auf die Nordkette.', image: '' },
        { year: '2025', title: 'Der Antrag', text: 'Am Hafelekar, bei Sonnenuntergang, mit dem schönsten Ja der Welt.', image: '' },
      ] } },
      { id: sid(), type: 'eventSchedule', data: { headline: 'Unser Tag', subline: 'So haben wir uns den Ablauf vorgestellt', events: [
        { time: '14:00', title: 'Trauung', description: 'Kirchliche Zeremonie in der Schlosskapelle', icon: 'Church', location: 'Schlosskapelle Ambras' },
        { time: '15:30', title: 'Sektempfang', description: 'Stoßt mit uns im Schlossgarten an!', icon: 'Wine', location: 'Schlossgarten' },
        { time: '16:30', title: 'Gruppenfoto', description: 'Erinnerungen für die Ewigkeit', icon: 'Camera', location: 'Schlossterrasse' },
        { time: '18:00', title: 'Dinner', description: '4-Gänge-Menü im Festsaal', icon: 'UtensilsCrossed', location: 'Spanischer Saal' },
        { time: '21:00', title: 'Eröffnungstanz', description: 'Unser erster Tanz als Ehepaar', icon: 'Music', location: 'Festsaal' },
        { time: '22:00', title: 'Party', description: 'DJ & Tanzfläche bis in die Nacht', icon: 'PartyPopper', location: 'Festsaal' },
      ] } },
    ],
  },
  {
    slug: '/location',
    title: 'Location',
    sections: [
      { id: sid(), type: 'venueInfo', data: { headline: 'Unsere Location', subline: 'Ein märchenhafter Ort für einen unvergesslichen Tag', venues: [
        { name: 'Schloss Ambras', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80', address: 'Schlossstraße 20, 6020 Innsbruck', description: 'Eines der schönsten Renaissance-Schlösser Österreichs, umgeben von einem weitläufigen Park mit Blick auf die Tiroler Berge.', mapEmbed: '', parkingInfo: 'Kostenfreie Parkplätze am Schloss verfügbar. Shuttle vom Hotel zum Schloss.' },
      ] } },
      { id: sid(), type: 'travelInfo', data: { headline: 'Anreise & Übernachtung', subline: '', sections: [
        { title: 'Mit dem Auto', icon: 'Car', content: 'A13 Inntal-Autobahn, Ausfahrt Innsbruck-Ost → Beschilderung Schloss Ambras folgen. Parkplätze direkt am Schloss.' },
        { title: 'Mit der Bahn', icon: 'Train', content: 'Innsbruck Hbf → Buslinie J Richtung Ambras (10 Min). Oder Taxi ca. 8 Minuten.' },
        { title: 'Flugzeug', icon: 'Plane', content: 'Flughafen Innsbruck (INN), 10 Min Taxi zum Schloss. Alternativ München (MUC) + 2h Zug.' },
      ], hotels: [
        { name: 'Hotel Grauer Bär', image: '', link: '', distance: '3 km', specialRate: 'Sonderkonditionen unter "Hochzeit Anna & Max"', stars: '4' },
        { name: 'STAGE 12', image: '', link: '', distance: '4 km', specialRate: 'Code ANNAMAX2026 für 15% Rabatt', stars: '4' },
        { name: 'Nala Individuell Hotel', image: '', link: '', distance: '3.5 km', specialRate: '', stars: '4' },
      ] } },
    ],
  },
  {
    slug: '/rsvp',
    title: 'Zusage',
    sections: [
      { id: sid(), type: 'rsvp', data: { headline: 'Seid ihr dabei?', subline: 'Bitte gebt uns bis zum 1. Juli 2026 Bescheid.', deadline: '01.07.2026', maxGuests: 4, showSongWish: true, showDietary: true, showAllergies: true } },
    ],
  },
  {
    slug: '/trauzeugen',
    title: 'Trauzeugen',
    sections: [
      { id: sid(), type: 'weddingParty', data: { headline: 'Unsere Trauzeugen', subline: 'Die wichtigsten Menschen an unserer Seite', members: [
        { name: 'Lisa Berger', role: 'Trauzeugin der Braut', relationship: 'Beste Freundin seit dem Studium', text: 'Lisa kennt Anna seit dem ersten Semester und war von Anfang an dabei – bei jedem Abenteuer, jedem Umzug und jetzt auch am Altar.', image: '' },
        { name: 'Thomas Hofer', role: 'Trauzeuge des Bräutigams', relationship: 'Bruder des Bräutigams', text: 'Als großer Bruder hat Thomas Max schon immer den Rücken gestärkt. Natürlich steht er auch an diesem Tag an seiner Seite.', image: '' },
        { name: 'Sophie Auer', role: 'Brautjungfer', relationship: 'Schwester der Braut', text: 'Klein-Schwester, große Stütze. Sophie organisiert, plant und sorgt dafür, dass alles reibungslos läuft.', image: '' },
        { name: 'David Keller', role: 'Groomsman', relationship: 'Bester Freund seit Schulzeit', text: 'Seit der 5. Klasse unzertrennlich — David und Max teilen sich nicht nur Erinnerungen, sondern auch den Musikgeschmack für die Party.', image: '' },
      ] } },
    ],
  },
  {
    slug: '/menue',
    title: 'Menü',
    sections: [
      { id: sid(), type: 'weddingMenu', data: { headline: 'Unser Hochzeitsmenü', subline: 'Kreiert von Küchenchef Martin Riedl', note: 'Bitte gebt bei der RSVP eure Allergien und Ernährungswünsche an.', courses: [
        { title: 'Amuse-Bouche', items: [{ name: 'Tiroler Bergkäse-Praline', description: 'mit Walnuss-Feigen-Chutney' }] },
        { title: 'Vorspeise', items: [{ name: 'Rote-Bete-Carpaccio', description: 'mit Ziegenkäse, Rucola und Honig-Senf-Dressing' }, { name: 'Kürbiscreme-Suppe', description: 'mit Kürbiskernöl und gerösteten Kernen' }] },
        { title: 'Hauptgang', items: [{ name: 'Rosa gebratenes Rinderfilet', description: 'mit Trüffel-Jus, Süßkartoffelpüree und Marktgemüse' }, { name: 'Safran-Risotto (vegetarisch)', description: 'mit gegrilltem Gemüse und Parmesan-Chip' }] },
        { title: 'Dessert', items: [{ name: 'Hochzeitstorte', description: 'Dreistöckig: Vanille, Himbeere, Schokolade' }, { name: 'Kleine Dessert-Auswahl', description: 'Panna Cotta, Macarons, Früchte' }] },
      ] } },
      { id: sid(), type: 'dresscode', data: { headline: 'Dresscode', description: 'Wir freuen uns über festliche Kleidung in gedeckten Farben. Lasst euch inspirieren!', colors: ['#2c3e50', '#8e6f47', '#c9b99a', '#6b8e6b', '#f4ece1'], dos: ['Anzug oder Cocktailkleid', 'Festlich & elegant', 'Gedeckte Erdtöne'], donts: ['Weiß / Creme (reserviert für die Braut)', 'Jeans oder Sneaker', 'Zu kurze Kleider'], note: 'Bei der Feier im Freien empfehlen wir einen Schal oder ein Jacket für den Abend.' } },
    ],
  },
  {
    slug: '/geschenke',
    title: 'Geschenke',
    sections: [
      { id: sid(), type: 'giftRegistry', data: { headline: 'Geschenkewünsche', subline: 'Eure Anwesenheit ist uns das größte Geschenk!', freeText: 'Wer uns dennoch eine Freude machen möchte: Wir sparen für unsere Flitterwochen in Japan. Über einen Beitrag zur Reisekasse freuen wir uns riesig.', gifts: [], bankInfo: { holder: 'Anna Berger & Maximilian Hofer', iban: 'AT12 3456 7890 1234 5678', bic: 'BKAUATWW', note: 'Verwendungszweck: Hochzeitsgeschenk' } } },
    ],
  },
  {
    slug: '/faq',
    title: 'FAQ',
    sections: [
      { id: sid(), type: 'faq', data: { headline: 'Häufige Fragen', items: [
        { question: 'Gibt es einen Shuttle-Service?', answer: 'Ja! Ein Shuttle fährt stündlich zwischen den Hotels in der Innenstadt und dem Schloss (17:00–02:00 Uhr).' },
        { question: 'Dürfen wir Kinder mitbringen?', answer: 'Selbstverständlich! Für die Kleinen gibt es einen separaten Spielbereich mit Betreuung ab 18 Uhr.' },
        { question: 'Gibt es vegetarische/vegane Optionen?', answer: 'Ja, bitte gebt bei der RSVP eure Ernährungswünsche an – die Küche stellt sich gerne darauf ein.' },
        { question: 'Bis wann geht die Feier?', answer: 'Offiziell bis 03:00 Uhr. Der Shuttle fährt bis 02:00, danach stehen Taxis bereit.' },
        { question: 'Können wir Fotos machen?', answer: 'Während der Trauung bitten wir euch, die Handys wegzulegen (Unplugged Ceremony). Danach: drauflos knipsen!' },
        { question: 'Was ist bei Regen?', answer: 'Das Schloss bietet wunderschöne Innenräume — der Sektempfang würde dann im Arkadenhof stattfinden.' },
      ] } },
    ],
  },
];

async function main() {
  console.log('🎉 Seeding wedding demo tenant: Anna & Maximilian...');

  // Delete existing demo-wedding tenant if exists
  const existing = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, 'demo-wedding'));
  if (existing.length > 0) {
    const id = existing[0].id;
    await db.delete(schema.pages).where(eq(schema.pages.tenantId, id));
    await db.delete(schema.tenants).where(eq(schema.tenants.id, id));
    console.log('  ♻️  Removed old demo-wedding tenant');
  }

  // Create tenant
  await db.insert(schema.tenants).values({
    id: TENANT_ID,
    slug: 'demo-wedding',
    name: 'Anna & Maximilian',
    industry: 'wedding',
    isDemo: true,
    activeStyle: 'classic',
    domain: null,
    passwordHash: DEMO_PASSWORD_HASH,
    brand: { companyName: 'Anna & Maximilian', tagline: 'Wir heiraten am 12. September 2026', primaryColor: '#d4a373' },
    contact: { email: 'hochzeit@anna-max.at', phone: '' },
    socialLinks: { instagram: 'https://instagram.com/anna.und.max' },
    navItems: [
      { label: 'Ablauf', href: '/' },
      { label: 'Location', href: '/location' },
      { label: 'Trauzeugen', href: '/trauzeugen' },
      { label: 'Menü', href: '/menue' },
      { label: 'Geschenke', href: '/geschenke' },
      { label: 'FAQ', href: '/faq' },
    ],
    navCta: { label: 'RSVP', href: '/rsvp' },
    footerColumns: [
      { title: 'Programm', items: [{ text: 'Tagesablauf', href: '/' }, { text: 'Location', href: '/location' }, { text: 'Menü', href: '/menue' }] },
      { title: 'Infos', items: [{ text: 'Trauzeugen', href: '/trauzeugen' }, { text: 'Geschenke', href: '/geschenke' }, { text: 'FAQ', href: '/faq' }] },
    ],
    footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    footerCta: { label: 'Zusagen', href: '/rsvp' },
  });
  console.log(`  ✅ Tenant created: ${TENANT_ID}`);

  // Create pages
  for (const page of PAGES) {
    await db.insert(schema.pages).values({
      id: crypto.randomUUID(),
      tenantId: TENANT_ID,
      slug: page.slug,
      title: page.title,
      sections: page.sections.map(s => ({ ...s, variant: null, visible: true, container: 'default', spacingTop: 'md', spacingBottom: 'md', anchorId: null })),
    });
    console.log(`  📄 Page: ${page.title} (${page.slug})`);
  }

  console.log('\n✅ Done! Demo wedding tenant seeded.');
  console.log(`   Slug: demo-wedding`);
  console.log(`   ID: ${TENANT_ID}`);
}

main().catch(console.error);
