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
import { consultingSite } from '../apps/renderer/src/app/demo/pages/consulting';
import { photographySite } from '../apps/renderer/src/app/demo/pages/photography';
import { weddingSite } from '../apps/renderer/src/app/demo/pages/wedding';
import { realestateSite } from '../apps/renderer/src/app/demo/pages/realestate';
import { cafeSite } from '../apps/renderer/src/app/demo/pages/cafe';
import { floristSite } from '../apps/renderer/src/app/demo/pages/florist';
import { fitnessSite } from '../apps/renderer/src/app/demo/pages/fitness';
import { locationSite } from '../apps/renderer/src/app/demo/pages/location';

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
  {
    slug: 'demo-consulting',
    name: 'Kanzlei Bergmann & Partner',
    industry: 'consulting',
    activeStyle: 'classic',
    brand: { companyName: 'Kanzlei Bergmann & Partner', tagline: 'Ihre Experten für Arbeits-, Familien- und Wirtschaftsrecht', primaryColor: '#1a2744' },
    contact: { phone: '+49 30 2589 4400', email: 'kanzlei@bergmann-partner.de', address: 'Friedrichstraße 78, 10117 Berlin' },
    socialLinks: { linkedin: '#' },
    navItems: [
      { label: 'Rechtsgebiete', href: '/rechtsgebiete' },
      { label: 'Team', href: '/team' },
      { label: 'Über uns', href: '/ueber-uns' },
      { label: 'Aktuelles', href: '/aktuelles' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    navCta: { label: 'Erstberatung', href: '/kontakt' },
    footerColumns: [
      { title: 'Rechtsgebiete', items: [{ text: 'Arbeitsrecht', href: '/rechtsgebiete' }, { text: 'Familienrecht', href: '/rechtsgebiete' }, { text: 'Mietrecht', href: '/rechtsgebiete' }, { text: 'Handelsrecht', href: '/rechtsgebiete' }] },
      { title: 'Kanzlei', items: [{ text: 'Über uns', href: '/ueber-uns' }, { text: 'Team', href: '/team' }, { text: 'Aktuelles', href: '/aktuelles' }, { text: 'Kontakt', href: '/kontakt' }] },
    ],
    footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    footerCta: { label: 'Erstberatung vereinbaren', href: '/kontakt' },
    pages: consultingSite.pages.map(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        data: rewriteDemoHrefs(s.data as Record<string, unknown>, '/demo/consulting'),
      })),
    })),
  },
  {
    slug: 'demo-photography',
    name: 'Lisa Fotografie',
    industry: 'photography',
    activeStyle: 'classic',
    brand: { companyName: 'Lisa Fotografie', tagline: 'Emotionale Momentaufnahmen – Hochzeiten, Paare & Portraits', primaryColor: '#9c7c5c' },
    contact: { phone: '+49 171 1234567', email: 'hello@lisa-fotografie.de', address: 'Mainstraße 8, 55116 Mainz' },
    socialLinks: { instagram: '#' },
    navItems: [
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Leistungen', href: '/leistungen' },
      { label: 'Über mich', href: '/ueber-mich' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    navCta: { label: 'Anfragen', href: '/kontakt' },
    footerColumns: [
      { title: 'Fotografie', items: [{ text: 'Hochzeiten', href: '/leistungen' }, { text: 'Paare', href: '/leistungen' }, { text: 'Portfolio', href: '/portfolio' }] },
      { title: 'Mehr', items: [{ text: 'FAQ', href: '/faq' }, { text: 'Über mich', href: '/ueber-mich' }, { text: 'Kontakt', href: '/kontakt' }] },
    ],
    footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
    footerCta: { label: 'Jetzt anfragen', href: '/kontakt' },
    pages: photographySite.pages.map(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        data: rewriteDemoHrefs(s.data as Record<string, unknown>, '/demo/photography'),
      })),
    })),
  },
  {
    slug: 'demo-wedding',
    name: 'Anna & Sebastian',
    industry: 'wedding',
    activeStyle: 'classic',
    brand: { companyName: 'Anna & Sebastian', tagline: 'Unsere Hochzeit – 14. September 2025, Salzburg', primaryColor: '#9f7048' },
    contact: { phone: '', email: 'hochzeit@anna-sebastian.at', address: 'Schloss Mirabell, 5020 Salzburg' },
    socialLinks: { instagram: '#' },
    navItems: [
      { label: 'Unsere Geschichte', href: '/unsere-geschichte' },
      { label: 'Ablauf', href: '/ablauf' },
      { label: 'Location', href: '/location' },
      { label: 'Anreise', href: '/anreise' },
      { label: 'RSVP', href: '/rsvp' },
    ],
    navCta: { label: 'Zusagen', href: '/rsvp' },
    footerColumns: [
      { title: 'Infos', items: [{ text: 'Unsere Geschichte', href: '/unsere-geschichte' }, { text: 'Ablauf', href: '/ablauf' }, { text: 'Location', href: '/location' }] },
      { title: 'Gäste', items: [{ text: 'Anreise & Hotels', href: '/anreise' }, { text: 'RSVP', href: '/rsvp' }] },
    ],
    footerLegalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    pages: weddingSite.pages.map(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        data: rewriteDemoHrefs(s.data as Record<string, unknown>, '/demo/wedding'),
      })),
    })),
  },
  {
    slug: 'demo-realestate',
    name: 'Rheinblick Immobilien',
    industry: 'realestate',
    activeStyle: 'classic',
    brand: { companyName: 'Rheinblick Immobilien', tagline: 'Ihr Premiumpartner für Kauf, Verkauf & Bewertung in Köln', primaryColor: '#1e3a5f' },
    contact: { phone: '+49 221 9876 100', email: 'info@rheinblick-immobilien.de', address: 'Rheinuferstraße 12, 50676 Köln' },
    socialLinks: { linkedin: '#', instagram: '#' },
    navItems: [
      { label: 'Kaufen', href: '/kaufen' },
      { label: 'Bewertung', href: '/bewertung' },
      { label: 'Über uns', href: '/ueber-uns' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    navCta: { label: 'Bewertung anfordern', href: '/bewertung' },
    footerColumns: [
      { title: 'Immobilien', items: [{ text: 'Kaufen', href: '/kaufen' }, { text: 'Bewertung', href: '/bewertung' }] },
      { title: 'Unternehmen', items: [{ text: 'Über uns', href: '/ueber-uns' }, { text: 'Kontakt', href: '/kontakt' }] },
    ],
    footerLegalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    footerCta: { label: 'Kostenlose Bewertung', href: '/bewertung' },
    pages: realestateSite.pages.map(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        data: rewriteDemoHrefs(s.data as Record<string, unknown>, '/demo/realestate'),
      })),
    })),
  },
  {
    slug: 'demo-cafe',
    name: 'Röstwerk',
    industry: 'cafe',
    activeStyle: 'classic',
    brand: { companyName: 'Röstwerk', tagline: 'Third-Wave-Coffee & Craft-Bar in München-Haidhausen', primaryColor: '#8b4513' },
    contact: { phone: '+49 89 2345 6789', email: 'hello@roestwerk-muenchen.de', address: 'Wörthstraße 23, 81667 München' },
    socialLinks: { instagram: '#' },
    navItems: [
      { label: 'Karte', href: '/karte' },
      { label: 'Events', href: '/events' },
      { label: 'Über uns', href: '/ueber-uns' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    navCta: { label: 'Reservieren', href: '/kontakt' },
    footerColumns: [
      { title: 'Röstwerk', items: [{ text: 'Karte', href: '/karte' }, { text: 'Events', href: '/events' }, { text: 'Über uns', href: '/ueber-uns' }] },
      { title: 'Besuch', items: [{ text: 'Kontakt', href: '/kontakt' }] },
    ],
    footerLegalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    pages: cafeSite.pages.map(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        data: rewriteDemoHrefs(s.data as Record<string, unknown>, '/demo/cafe'),
      })),
    })),
  },
  {
    slug: 'demo-florist',
    name: 'Blütenwerk Atelier',
    industry: 'florist',
    activeStyle: 'classic',
    brand: { companyName: 'Blütenwerk Atelier', tagline: 'Floristik, Hochzeiten & saisonale Blumenwelten', primaryColor: '#be185d' },
    contact: { phone: '+49 89 4455 2211', email: 'hello@bluetenwerk-atelier.de', address: 'Gärtnerplatz 8, 80469 München' },
    socialLinks: { instagram: '#' },
    navItems: [
      { label: 'Sträuße', href: '/straeusse' },
      { label: 'Hochzeiten', href: '/hochzeiten' },
      { label: 'Workshops', href: '/workshops' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    navCta: { label: 'Beratung anfragen', href: '/kontakt' },
    footerColumns: [
      { title: 'Floristik', items: [{ text: 'Sträuße', href: '/straeusse' }, { text: 'Hochzeiten', href: '/hochzeiten' }, { text: 'Workshops', href: '/workshops' }] },
      { title: 'Atelier', items: [{ text: 'Kontakt', href: '/kontakt' }, { text: 'Anfahrt', href: '/kontakt' }] },
    ],
    footerLegalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    footerCta: { label: 'Beratung anfragen', href: '/kontakt' },
    pages: floristSite.pages.map(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        data: rewriteDemoHrefs(s.data as Record<string, unknown>, '/demo/florist'),
      })),
    })),
  },
  {
    slug: 'demo-fitness',
    name: 'Pulse Studio',
    industry: 'fitness',
    activeStyle: 'classic',
    brand: { companyName: 'Pulse Studio', tagline: 'Training, Kurse & Personal Coaching', primaryColor: '#9333ea' },
    contact: { phone: '+49 89 7711 2233', email: 'hello@pulse-studio.de', address: 'Westendstraße 41, 80339 München' },
    socialLinks: { instagram: '#' },
    navItems: [
      { label: 'Kurse', href: '/kurse' },
      { label: 'Coaching', href: '/coaching' },
      { label: 'Trainer', href: '/trainer' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    navCta: { label: 'Probetraining buchen', href: '/kontakt' },
    footerColumns: [
      { title: 'Training', items: [{ text: 'Kurse', href: '/kurse' }, { text: 'Coaching', href: '/coaching' }] },
      { title: 'Studio', items: [{ text: 'Trainer', href: '/trainer' }, { text: 'Kontakt', href: '/kontakt' }] },
    ],
    footerLegalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    footerCta: { label: 'Probetraining buchen', href: '/kontakt' },
    pages: fitnessSite.pages.map(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        data: rewriteDemoHrefs(s.data as Record<string, unknown>, '/demo/fitness'),
      })),
    })),
  },
  {
    slug: 'demo-location',
    name: 'Lichtwerk Loft',
    industry: 'location',
    activeStyle: 'classic',
    brand: { companyName: 'Lichtwerk Loft', tagline: 'Eventlocation, Hochzeiten & Coworking', primaryColor: '#b45309' },
    contact: { phone: '+49 841 8899 4411', email: 'events@lichtwerk-loft.de', address: 'Am Speicher 12, 85049 Ingolstadt' },
    socialLinks: { instagram: '#' },
    navItems: [
      { label: 'Räume', href: '/raeume' },
      { label: 'Events', href: '/events' },
      { label: 'Coworking', href: '/coworking' },
      { label: 'Galerie', href: '/galerie' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    navCta: { label: 'Wunschtermin anfragen', href: '/kontakt' },
    footerColumns: [
      { title: 'Location', items: [{ text: 'Räume', href: '/raeume' }, { text: 'Events', href: '/events' }, { text: 'Coworking', href: '/coworking' }] },
      { title: 'Planung', items: [{ text: 'Galerie', href: '/galerie' }, { text: 'Kontakt', href: '/kontakt' }] },
    ],
    footerLegalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    footerCta: { label: 'Wunschtermin anfragen', href: '/kontakt' },
    pages: locationSite.pages.map(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        data: rewriteDemoHrefs(s.data as Record<string, unknown>, '/demo/location'),
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
