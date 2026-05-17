/**
 * Seed wedding demo tenant "Anna & Maximilian" (modern format).
 * Usage: npx tsx scripts/seed-wedding-demo-v2.ts
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
  slug: 'demo-wedding',
  name: 'Anna & Maximilian',
  industry: 'wedding' as const,
  brand: {
    companyName: 'Anna & Maximilian',
    tagline: 'Wir heiraten am 12. September 2026',
    primaryColor: '#d4a373',
    secondaryColor: '#2c3e50',
    accentColor: '#8e6f47',
  },
  contact: { email: 'hochzeit@anna-max.at', phone: '' },
  socialLinks: { instagram: 'https://instagram.com/anna.und.max' },
  openingHours: [],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Unsere Geschichte', href: '/unsere-geschichte', type: 'link' },
    { label: 'Location', href: '/location', type: 'link' },
    { label: 'Ablauf & Menü', href: '/ablauf', type: 'link' },
    { label: 'Trauzeugen', href: '/trauzeugen', type: 'link' },
    { label: 'Geschenke', href: '/geschenke', type: 'link' },
    { label: 'FAQ', href: '/faq', type: 'link' },
  ],
  navCta: { label: 'RSVP', href: '/rsvp' },
  footerColumns: [
    { title: 'Programm', items: [{ text: 'Tagesablauf', href: '/ablauf' }, { text: 'Location', href: '/location' }, { text: 'Menü', href: '/ablauf' }] },
    { title: 'Infos', items: [{ text: 'Unsere Geschichte', href: '/unsere-geschichte' }, { text: 'Trauzeugen', href: '/trauzeugen' }, { text: 'Geschenke', href: '/geschenke' }, { text: 'FAQ', href: '/faq' }] },
    { title: 'Kontakt', items: [{ text: 'hochzeit@anna-max.at' }, { text: '@anna.und.max' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Jetzt zusagen', href: '/rsvp' },
  pages: [
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          coupleName: 'Anna & Maximilian',
          headline: 'Anna & Maximilian',
          subline: 'Wir heiraten am 12. September 2026 auf Schloss Ambras in Innsbruck.',
          date: '2026-09-12',
          venue: 'Schloss Ambras, Innsbruck',
          tagline: 'Wir heiraten!',
          bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
          overlayColor: '#000000',
          overlayOpacity: '0.35',
          primaryCta: { label: 'Jetzt zusagen', href: '/rsvp' },
          secondaryCta: { label: 'Unsere Geschichte', href: '/unsere-geschichte' },
        }},
        { type: 'uspStrip', sortOrder: 1, data: {
          items: [
            { icon: 'calendar', title: '12. September 2026', text: 'Samstag, ab 14 Uhr' },
            { icon: 'mapPin', title: 'Schloss Ambras', text: 'Innsbruck, Tirol' },
            { icon: 'heart', title: '8 Jahre zusammen', text: 'Endlich wird geheiratet!' },
            { icon: 'users', title: 'Platz für 120 Gäste', text: 'Und ihr seid eingeladen!' },
          ],
        }},
        { type: 'coupleStory', sortOrder: 2, data: {
          headline: 'Unsere Geschichte',
          subline: 'Wie alles begann...',
          milestones: [
            { year: '2018', title: 'Das erste Treffen', text: 'Auf einer Geburtstagsfeier im Sommer trafen sich unsere Blicke zum ersten Mal. Anna verschüttete ihren Cocktail, Max reichte ihr eine Serviette — und seinen Humor gleich dazu.', image: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&q=80' },
            { year: '2019', title: 'Erster gemeinsamer Urlaub', text: 'Zwei Wochen in Portugal — zwischen Surfbrettern, Sonnenuntergängen und der Erkenntnis: das ist es.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80' },
            { year: '2022', title: 'Zusammengezogen', text: 'Unsere erste gemeinsame Wohnung in Innsbruck, mit Blick auf die Nordkette. Und ja, Max hat den IKEA-Aufbau überlebt.', image: '' },
            { year: '2025', title: 'Der Antrag', text: 'Am Hafelekar, bei Sonnenuntergang, 2.334 Meter über dem Meer. Anna sagte „Ja" noch bevor Max die Frage ganz ausgesprochen hatte.', image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80' },
            { year: '2026', title: 'Die Hochzeit', text: 'Und jetzt feiern wir — mit euch! Am 12. September auf Schloss Ambras.', image: '' },
          ],
        }},
        { type: 'eventSchedule', sortOrder: 3, data: {
          headline: 'Unser Tag',
          subline: 'So haben wir uns den Ablauf vorgestellt',
          events: [
            { time: '14:00', title: 'Trauung', description: 'Kirchliche Zeremonie in der Schlosskapelle', icon: 'Church', location: 'Schlosskapelle Ambras' },
            { time: '15:00', title: 'Sektempfang', description: 'Stoßt mit uns im Schlossgarten an — mit Häppchen und Live-Musik.', icon: 'Wine', location: 'Schlossgarten' },
            { time: '16:00', title: 'Gruppenfoto & Spiele', description: 'Erinnerungen für die Ewigkeit und Lawn Games im Park.', icon: 'Camera', location: 'Schlossterrasse' },
            { time: '18:00', title: 'Festdinner', description: '4-Gänge-Menü von Küchenchef Martin Riedl im historischen Spanischen Saal.', icon: 'UtensilsCrossed', location: 'Spanischer Saal' },
            { time: '21:00', title: 'Eröffnungstanz', description: 'Unser erster Tanz als Ehepaar — zu „Thinking Out Loud".', icon: 'Music', location: 'Festsaal' },
            { time: '21:30', title: 'Party bis in die Nacht', description: 'DJ, Tanzfläche, Photobooth und Mitternachtssnack!', icon: 'PartyPopper', location: 'Festsaal & Terrasse' },
          ],
        }},
        { type: 'ctaBand', sortOrder: 4, data: {
          headline: 'Seid ihr dabei?',
          subline: 'Bitte gebt uns bis zum 1. Juli 2026 Bescheid — wir können es kaum erwarten!',
          badgeText: 'RSVP',
          ctaPrimary: { label: 'Jetzt zusagen', href: '/rsvp' },
        }},
      ],
    },
    {
      slug: 'unsere-geschichte', title: 'Unsere Geschichte', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Geschichte',
          subline: '8 Jahre, 1.000 Abenteuer und bald das größte: unsere Hochzeit.',
          bgImage: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=1800&q=85',
        }},
        { type: 'coupleStory', sortOrder: 1, data: {
          headline: 'Vom ersten Blick zum großen Tag',
          subline: 'Eine Liebesgeschichte in Kapiteln',
          milestones: [
            { year: 'Sommer 2018', title: 'Der Funke', text: 'Eine Geburtstagsfeier, ein verschütteter Negroni, ein Lächeln. Anna sagt, sie wusste es sofort. Max sagt, er brauchte zwei Dates (aber das stimmt nicht).', image: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&q=80' },
            { year: 'Herbst 2018', title: 'Das erste Date', text: 'Ein langer Spaziergang durch die Altstadt, ein Café, drei Stunden ohne aufs Handy zu schauen. Ein gutes Zeichen.', image: '' },
            { year: '2019', title: 'Portugal', text: 'Unser erster gemeinsamer Urlaub. Surfen in Ericeira, Sonnenuntergänge in Sintra. „Können wir einfach hierbleiben?" — „Sagen wir erstmal den Rückflug ab."', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80' },
            { year: '2020', title: 'Lockdown-Liebe', text: 'Ein Pandemie-Test für die Beziehung: bestanden! 47 Puzzle, 23 gemeinsam gekochte Rezepte und null Streit (na gut, fast).', image: '' },
            { year: '2022', title: 'Zusammenziehen', text: 'Eine Wohnung in Innsbruck mit Nordkette-Blick. Max hat den IKEA-Schrank gebaut (nur ein Stück übrig). Anna hat die Wände gestrichen (nur einmal den Teppich getroffen).', image: '' },
            { year: 'Dez 2025', title: 'Der Antrag', text: 'Am Hafelekar, 2.334 Meter hoch, Sonnenuntergang, Schnee, ein Ring in der Jackentasche (den Max fast verloren hätte). Anna sagte „Ja" bevor die Frage zu Ende war.', image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80' },
            { year: 'Sep 2026', title: '...und jetzt ihr!', text: 'Wir feiern unsere Liebe — und zwar mit euch. Am 12. September auf Schloss Ambras.', image: '' },
          ],
        }},
        { type: 'textImage', sortOrder: 2, data: {
          headline: 'Warum Schloss Ambras?',
          text: '<p>Als wir das erste Mal gemeinsam durch den Schlosspark spazierten, wussten wir: Hier wollen wir unseren großen Tag feiern. Die Mischung aus Geschichte, Natur und diesem unglaublichen Blick auf die Berge — es gibt keinen magischeren Ort in Innsbruck.</p><p>Der Spanische Saal, in dem wir dinieren werden, ist über 400 Jahre alt und hat schon Tausende von Festen gesehen. Wir hoffen, unseres wird das schönste.</p>',
          image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
          imagePosition: 'right',
        }},
      ],
    },
    {
      slug: 'location', title: 'Location & Anreise', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Location & Anreise',
          subline: 'Schloss Ambras — ein märchenhafter Ort für einen unvergesslichen Tag.',
          bgImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80',
        }},
        { type: 'venueInfo', sortOrder: 1, data: {
          headline: 'Schloss Ambras',
          subline: 'Eines der schönsten Renaissance-Schlösser Österreichs',
          venues: [
            {
              name: 'Schloss Ambras',
              image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
              address: 'Schlossstraße 20, 6020 Innsbruck',
              description: 'Eines der schönsten Renaissance-Schlösser Österreichs, umgeben von einem weitläufigen Park mit Blick auf die Tiroler Berge. Die Trauung findet in der historischen Schlosskapelle statt, der Sektempfang im Schlossgarten und das Dinner im legendären Spanischen Saal.',
              mapEmbed: '',
              parkingInfo: 'Kostenfreie Parkplätze direkt am Schloss verfügbar.',
            },
          ],
        }},
        { type: 'travelInfo', sortOrder: 2, data: {
          headline: 'So kommt ihr zu uns',
          subline: 'Innsbruck ist bestens erreichbar — egal ob mit Auto, Bahn oder Flugzeug.',
          sections: [
            { title: 'Mit dem Auto', icon: 'Car', content: 'A13 Inntal-Autobahn, Ausfahrt Innsbruck-Ost → Beschilderung „Schloss Ambras" folgen. Parkplätze direkt am Schloss (kostenfrei).' },
            { title: 'Mit der Bahn', icon: 'Train', content: 'Innsbruck Hauptbahnhof → Buslinie J Richtung Ambras (10 Minuten). Oder Taxi — ca. 8 Minuten, etwa 12 €.' },
            { title: 'Mit dem Flugzeug', icon: 'Plane', content: 'Flughafen Innsbruck (INN) ist nur 10 Minuten mit dem Taxi entfernt. Alternativ: München (MUC) + 2h Zug nach Innsbruck.' },
          ],
          hotels: [
            { name: 'Hotel Grauer Bär ⭐⭐⭐⭐', image: '', link: '', distance: '3 km', specialRate: 'Sonderkonditionen unter Stichwort „Hochzeit Anna & Max"' },
            { name: 'STAGE 12 Hotel ⭐⭐⭐⭐', image: '', link: '', distance: '4 km', specialRate: 'Code ANNAMAX2026 für 15% Rabatt' },
            { name: 'Nala Individuell Hotel ⭐⭐⭐⭐', image: '', link: '', distance: '3.5 km', specialRate: '' },
            { name: 'Hotel Mondschein ⭐⭐⭐', image: '', link: '', distance: '2.5 km', specialRate: 'Budget-freundliche Option in der Altstadt' },
          ],
        }},
        { type: 'ctaBand', sortOrder: 3, data: {
          headline: 'Shuttle-Service',
          subline: 'Wir organisieren einen kostenlosen Shuttle zwischen den Hotels in der Innenstadt und Schloss Ambras (17:00–02:00 Uhr, stündlich).',
          badgeText: '🚌 Transport',
        }},
      ],
    },
    {
      slug: 'ablauf', title: 'Ablauf & Menü', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Ablauf & Menü',
          subline: 'Was euch am 12. September erwartet.',
          bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=85',
        }},
        { type: 'eventSchedule', sortOrder: 1, data: {
          headline: 'Der Tagesablauf',
          subline: 'Von der Trauung bis zum letzten Tanz',
          events: [
            { time: '13:30', title: 'Ankunft der Gäste', description: 'Empfang mit Willkommensdrink im Schlossgarten.', icon: 'Users', location: 'Schlosseingang' },
            { time: '14:00', title: 'Trauung', description: 'Kirchliche Zeremonie in der historischen Schlosskapelle.', icon: 'Church', location: 'Schlosskapelle' },
            { time: '15:00', title: 'Sektempfang', description: 'Champagner, Häppchen und Live-Akustik-Duo im Schlossgarten.', icon: 'Wine', location: 'Schlossgarten' },
            { time: '16:00', title: 'Gruppenfotos & Lawn Games', description: 'Erinnerungsfotos auf der Schlossterrasse. Danach: Krocket, Boccia und Kubb im Park.', icon: 'Camera', location: 'Schlossterrasse & Park' },
            { time: '18:00', title: 'Festdinner', description: '4-Gänge-Menü von Küchenchef Martin Riedl im Spanischen Saal.', icon: 'UtensilsCrossed', location: 'Spanischer Saal' },
            { time: '20:00', title: 'Reden & Überraschungen', description: 'Tischrede der Trauzeugen und (hoffentlich nicht zu peinliche) Spiele.', icon: 'Mic', location: 'Spanischer Saal' },
            { time: '21:00', title: 'Eröffnungstanz', description: 'Unser erster Tanz als Ehepaar. Taschentücher bereithalten!', icon: 'Music', location: 'Festsaal' },
            { time: '21:30', title: 'Party!', description: 'DJ, Tanzfläche, Photobooth mit Verkleidungen und Mitternachtssnack um 00:00.', icon: 'PartyPopper', location: 'Festsaal & Terrasse' },
          ],
        }},
        { type: 'weddingMenu', sortOrder: 2, data: {
          headline: 'Unser Hochzeitsmenü',
          subline: 'Kreiert von Küchenchef Martin Riedl — mit Produkten aus der Region.',
          note: 'Allergien und Unverträglichkeiten? Bitte bei der RSVP angeben — die Küche kümmert sich um alles.',
          courses: [
            { title: 'Amuse-Bouche', items: [{ name: 'Tiroler Bergkäse-Praline', description: 'mit Walnuss-Feigen-Chutney und Micro-Greens' }] },
            { title: 'Vorspeise', items: [
              { name: 'Rote-Bete-Carpaccio', description: 'mit Ziegenkäse-Mousse, Rucola, karamellisierten Walnüssen und Honig-Senf-Dressing' },
              { name: 'Kürbiscreme-Suppe', description: 'mit Kürbiskernöl, gerösteten Kernen und einem Hauch Ingwer' },
            ]},
            { title: 'Zwischengang', items: [
              { name: 'Zitronensorbet', description: 'mit Prosecco und frischer Minze' },
            ]},
            { title: 'Hauptgang', items: [
              { name: 'Rosa gebratenes Rinderfilet', description: 'mit Trüffel-Jus, Süßkartoffelpüree, glasierten Karotten und saisonalem Marktgemüse' },
              { name: 'Safran-Risotto (vegetarisch)', description: 'mit gegrilltem Gemüse, Parmesan-Chip und Basilikum-Pesto' },
              { name: 'Wildlachsfilet (Fisch)', description: 'auf Fenchel-Orangen-Salat mit Dill-Senf-Sauce' },
            ]},
            { title: 'Dessert', items: [
              { name: 'Hochzeitstorte', description: 'Dreistöckig: Vanille-Himbeere, Schokolade-Karamell, Zitrone-Mohn' },
              { name: 'Dessert-Buffet', description: 'Panna Cotta, Macarons, Crème Brûlée, saisonale Früchte, Petit Fours' },
            ]},
            { title: 'Mitternachtssnack', items: [
              { name: 'Burger-Station', description: 'Mini-Burger mit Pommes und verschiedenen Saucen' },
              { name: 'Käseplatte', description: 'Regionale Käsesorten mit Trauben, Nüssen und Feigensenf' },
            ]},
          ],
        }},
        { type: 'dresscode', sortOrder: 3, data: {
          headline: 'Dresscode',
          description: 'Wir wünschen uns festliche Kleidung in gedeckten Farben — elegant, aber gemütlich genug zum Tanzen!',
          colors: ['#2c3e50', '#8e6f47', '#c9b99a', '#6b8e6b', '#f4ece1'],
          dos: ['Anzug, Cocktailkleid oder langes Kleid', 'Festlich & elegant', 'Gedeckte Erd- und Naturtöne', 'Bequeme Schuhe zum Tanzen!'],
          donts: ['Weiß / Creme (der Braut vorbehalten)', 'Jeans, Sneaker, Flip-Flops', 'Zu kurze oder zu freizügige Outfits'],
          note: 'Die Feier findet teils im Freien statt — packt für den Abend gerne einen Schal, ein Tuch oder ein Jacket ein.',
        }},
      ],
    },
    {
      slug: 'trauzeugen', title: 'Trauzeugen', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unser Team',
          subline: 'Die wichtigsten Menschen an unserer Seite.',
          bgImage: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1800&q=85',
        }},
        { type: 'weddingParty', sortOrder: 1, data: {
          headline: 'Unsere Trauzeugen & Brautjungfern',
          subline: 'Ohne sie wären wir aufgeschmissen — und die Party nur halb so gut.',
          members: [
            { name: 'Lisa Berger', role: 'Trauzeugin der Braut', relationship: 'Beste Freundin seit dem Studium', text: 'Lisa kennt Anna seit dem ersten Uni-Semester. Sie war bei jedem Abenteuer dabei, hat jede Krise mitgetragen und jeden Erfolg mitgefeiert. Und sie ist die Einzige, die Anna zum Lachen bringt, wenn eigentlich nichts lustig ist.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
            { name: 'Thomas Hofer', role: 'Trauzeuge des Bräutigams', relationship: 'Großer Bruder', text: 'Als großer Bruder hat Thomas Max schon immer den Rücken gestärkt — vom Schulhof bis zum Antrag (ja, er wusste Bescheid). Natürlich steht er auch am 12. September an seiner Seite.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
            { name: 'Sophie Auer', role: 'Brautjungfer', relationship: 'Schwester der Braut', text: 'Klein-Schwester, große Stütze. Sophie plant, organisiert und hält im Hintergrund die Fäden zusammen. Ohne sie wäre die Deko nicht halb so hübsch (und die Braut nicht halb so entspannt).', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80' },
            { name: 'David Keller', role: 'Groomsman', relationship: 'Bester Freund seit Schulzeit', text: 'Seit der 5. Klasse unzertrennlich. David und Max teilen sich Erinnerungen, den Musikgeschmack und die Gewissheit, dass DJ-Song #3 „Stayin\' Alive" sein muss.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' },
            { name: 'Klara Winkler', role: 'Brautjungfer', relationship: 'Kollegin & Freundin', text: 'Seit dem ersten Arbeitstag Schreibtisch-Nachbarinnen, inzwischen unzertrennlich. Klara hat das Talent, aus jedem Meeting eine Kaffeepause zu machen — und aus jeder Party ein Fest.', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80' },
            { name: 'Lukas Steiner', role: 'Groomsman', relationship: 'Studienfreund', text: 'Zusammen Maschinenbau studiert, zusammen das erste Auto repariert (es hat nicht überlebt), zusammen durch dick und dünn. Lukas hat versprochen, keine peinlichen Uni-Geschichten zu erzählen. Wir glauben ihm nicht.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80' },
          ],
        }},
        { type: 'textImage', sortOrder: 2, data: {
          headline: 'Ein Wort an unsere Gäste',
          text: '<p>Wir wissen, dass eine Hochzeit viel Organisation bedeutet — auch für euch. Anreise, Outfit, Geschenk, Kinderbetreuung... Danke, dass ihr all das auf euch nehmt, um diesen Tag mit uns zu teilen.</p><p>Ihr seid nicht einfach „Gäste". Ihr seid die Menschen, die unsere Geschichte mitgeschrieben haben. Und genau deshalb wollen wir diesen Tag mit euch feiern.</p>',
          image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80',
          imagePosition: 'right',
        }},
      ],
    },
    {
      slug: 'geschenke', title: 'Geschenke', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Geschenkewünsche',
          subline: 'Eure Anwesenheit ist unser größtes Geschenk!',
          bgImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1800&q=85',
        }},
        { type: 'giftRegistry', sortOrder: 1, data: {
          headline: 'Für die Flitterwochen',
          subline: 'Eure Anwesenheit ist uns das größte Geschenk!',
          freeText: 'Wer uns dennoch eine Freude machen möchte: Wir sparen für unsere Flitterwochen in Japan — drei Wochen Tokio, Kyoto, Osaka und die japanischen Alpen. Jeder Beitrag bringt uns einem Sushi-Kurs in Kyoto, einer Nacht im Ryokan oder einem Besuch im Teamlab näher.',
          gifts: [
            { name: '🍣 Sushi-Kurs in Kyoto', price: '80 €', description: 'Gemeinsam lernen wir die Kunst des Sushi — hoffentlich essbares Ergebnis.' },
            { name: '🏯 Nacht im traditionellen Ryokan', price: '150 €', description: 'Tatami-Matten, Onsen und Kaiseki-Dinner — echtes Japan erleben.' },
            { name: '🚅 Shinkansen-Ticket', price: '120 €', description: 'Tokyo → Kyoto in 2:15h. Schneller als unsere Hochzeitsvorbereitungen.' },
            { name: '⛩️ Tagesausflug nach Nara', price: '50 €', description: 'Tempel, heilige Hirsche und den besten Mochi der Welt.' },
          ],
          bankInfo: {
            holder: 'Anna Berger & Maximilian Hofer',
            iban: 'AT12 3456 7890 1234 5678',
            bic: 'BKAUATWW',
            note: 'Verwendungszweck: Hochzeitsgeschenk',
          },
        }},
      ],
    },
    {
      slug: 'rsvp', title: 'RSVP', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Seid ihr dabei?',
          subline: 'Bitte gebt uns bis zum 1. Juli 2026 Bescheid.',
          bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=85',
        }},
        { type: 'rsvp', sortOrder: 1, data: {
          headline: 'Zusage',
          subline: 'Wir können es kaum erwarten, diesen Tag mit euch zu teilen!',
          deadline: '2026-07-01',
          maxGuests: 4,
          showSongWish: true,
          showDietary: true,
          showAllergies: true,
          note: 'Ihr könnt eure Zusage jederzeit ändern, solange die Frist noch läuft. Bei Fragen meldet euch bei hochzeit@anna-max.at.',
        }},
        { type: 'faq', sortOrder: 2, data: {
          headline: 'Noch Fragen?',
          badgeText: 'FAQ',
          items: [
            { question: 'Bis wann muss ich zusagen?', answer: 'Bitte bis zum 1. Juli 2026 — damit wir dem Schloss die finale Gästezahl melden können.' },
            { question: 'Kann ich eine Begleitung mitbringen?', answer: 'Eure Einladung gilt für die auf der Karte genannten Personen. Falls ihr unsicher seid, meldet euch bei uns.' },
            { question: 'Was, wenn sich meine Pläne ändern?', answer: 'Kein Problem! Sagt uns einfach Bescheid — lieber spät als nie.' },
          ],
        }},
      ],
    },
    {
      slug: 'faq', title: 'FAQ', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Häufige Fragen',
          subline: 'Alles, was ihr wissen müsst — und ein paar Dinge, die ihr nicht gefragt habt.',
          bgImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1800&q=85',
        }},
        { type: 'faq', sortOrder: 1, data: {
          headline: 'FAQ',
          badgeText: 'Häufige Fragen',
          items: [
            { question: 'Gibt es einen Shuttle-Service?', answer: 'Ja! Ein kostenloser Shuttle fährt stündlich zwischen den Hotels in der Innenstadt und dem Schloss (17:00–02:00 Uhr). Danach stehen Taxis bereit.' },
            { question: 'Dürfen wir Kinder mitbringen?', answer: 'Selbstverständlich! Für die Kleinen gibt es ab 18 Uhr einen separaten Spielbereich mit professioneller Betreuung — damit ihr in Ruhe feiern könnt.' },
            { question: 'Gibt es vegetarische/vegane Optionen?', answer: 'Ja! Bitte gebt bei der RSVP eure Ernährungswünsche und Allergien an. Die Küche von Martin Riedl ist flexibel und kocht auch vegan auf höchstem Niveau.' },
            { question: 'Bis wann geht die Feier?', answer: 'Offiziell bis 03:00 Uhr. Der Shuttle fährt bis 02:00, danach sind Taxis organisiert. Max hat versprochen, als Letzter zu gehen.' },
            { question: 'Können wir Fotos machen?', answer: 'Während der Trauung bitten wir euch um eine „Unplugged Ceremony" — bitte Handys in der Tasche lassen. Danach: drauflos knipsen! Es gibt außerdem eine Photobooth mit lustigen Requisiten.' },
            { question: 'Was ist bei Regen?', answer: 'Das Schloss bietet wunderschöne Innenräume. Der Sektempfang findet dann im Arkadenhof mit Glasdach statt — mindestens genauso romantisch.' },
            { question: 'Kann ich einen Songwunsch abgeben?', answer: 'Unbedingt! Bei der RSVP gibt es ein Feld dafür. Der DJ freut sich über Inspiration (außer „Macarena" — das hat Max schon 37-mal gesagt, und nein, es wird nicht gespielt).'},
            { question: 'Was soll ich anziehen?', answer: 'Festlich & elegant in gedeckten Erdtönen. Bitte kein Weiß/Creme (das ist der Braut vorbehalten). Details findet ihr auf der Ablauf-Seite unter „Dresscode".' },
            { question: 'Ich habe eine Überraschung geplant — wen kontaktiere ich?', answer: 'Schreibt am besten unserer Trauzeugin Lisa (lisa@anna-max.at). Sie koordiniert alle Einlagen und sorgt dafür, dass es nicht 27 PowerPoint-Präsentationen werden.' },
            { question: 'Gibt es WLAN auf dem Schloss?', answer: 'Ja, im Festsaal gibt es WLAN. Zugangsdaten bekommt ihr vor Ort. Aber mal ehrlich — tanzen ist besser als scrollen.' },
          ],
        }},
      ],
    },
  ],
};

async function main() {
  console.log('🎉 Seeding wedding demo tenant: Anna & Maximilian (v2)…\n');

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
    console.log(`ℹ️  Reusing tenant ${tenantId}`);
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
  await db.insert(schema.globalSettings).values({ tenantId, brand: CONFIG.brand as any, contact: CONFIG.contact as any, socialLinks: CONFIG.socialLinks as any });
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

  // Snapshot
  const allPages = await db.select().from(schema.pages).where(eq(schema.pages.tenantId, tenantId));
  const allSections = await db.select().from(schema.pageSections).where(eq(schema.pageSections.tenantId, tenantId));
  const snapshot = { pages: allPages.map(p => ({ ...p, sections: allSections.filter(s => s.pageId === p.id).sort((a, b) => a.sortOrder - b.sortOrder) })), generatedAt: new Date().toISOString() };
  const checksum = crypto.createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
  await db.insert(schema.publishedSnapshots).values({ tenantId, version: 1, snapshot: snapshot as any, checksum, isActive: true, createdBy: 'seed-wedding-demo-v2' });
  console.log('✅ Snapshot published');
  console.log('\n🎉 Wedding demo ready! Password: demo2024');
}

main().catch(err => { console.error(err); process.exit(1); });
