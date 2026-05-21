import type { NavItem, NavCta, FooterData, BrandData, ContactData, SocialLinks } from '@/lib/tenant-data';

export type IndustryKey = 'handwerk' | 'hotel' | 'medical' | 'restaurant' | 'salon' | 'tourism' | 'wedding' | 'photography' | 'consulting' | 'realestate' | 'cafe' | 'tattoo' | 'showcase';

export interface DemoSiteData {
  navItems: NavItem[];
  cta: NavCta;
  brand: BrandData;
  contact: ContactData;
  socialLinks: SocialLinks;
  footer: FooterData;
}

const DEMO_DATA: Record<IndustryKey, DemoSiteData> = {
  handwerk: {
    brand: { companyName: 'Müller & Söhne', tagline: 'Meisterbetrieb für Sanitär, Heizung & Bäder', primaryColor: '#1d4ed8' },
    contact: { phone: '+49 221 987 654', email: 'info@mueller-soehne.de', address: 'Handwerkerstraße 12, 50667 Köln' },
    socialLinks: { instagram: '#', facebook: '#' },
    navItems: [
      { label: 'Leistungen', href: '/demo/handwerk/leistungen' },
      { label: 'Projekte', href: '/demo/handwerk/projekte' },
      { label: 'Über uns', href: '/demo/handwerk/ueber-uns' },
      { label: 'Kontakt', href: '/demo/handwerk/kontakt' },
    ],
    cta: { label: 'Anfrage senden', href: '/demo/handwerk/kontakt' },
    footer: {
      columns: [
        { title: 'Leistungen', items: [{ text: 'Sanitär', href: '/demo/handwerk/leistungen' }, { text: 'Heizung', href: '/demo/handwerk/leistungen' }, { text: 'Bäder', href: '/demo/handwerk/leistungen' }, { text: 'Notdienst', href: '/demo/handwerk/leistungen' }] },
        { title: 'Unternehmen', items: [{ text: 'Über uns', href: '/demo/handwerk/ueber-uns' }, { text: 'Projekte', href: '/demo/handwerk/projekte' }, { text: 'Kontakt', href: '/demo/handwerk/kontakt' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  restaurant: {
    brand: { companyName: 'Trattoria Dal Maestro', tagline: 'Authentische italienische Küche in Innsbruck', primaryColor: '#9a3412' },
    contact: { phone: '+43 512 123 456', email: 'info@trattoria-dalmaestro.at', address: 'Maria-Theresien-Straße 24, 6020 Innsbruck' },
    socialLinks: { instagram: '#', facebook: '#' },
    navItems: [
      { label: 'Speisekarte', href: '/demo/restaurant/speisekarte' },
      { label: 'Über uns', href: '/demo/restaurant/ueber-uns' },
      { label: 'Ambiente', href: '/demo/restaurant/ambiente' },
      { label: 'Events', href: '/demo/restaurant/events' },
      { label: 'Galerie', href: '/demo/restaurant/galerie' },
      { label: 'Reservierung', href: '/demo/restaurant/reservierung' },
    ],
    cta: { label: 'Tisch reservieren', href: '/demo/restaurant/reservierung' },
    footer: {
      columns: [
        { title: 'Küche', items: [{ text: 'Speisekarte', href: '/demo/restaurant/speisekarte' }, { text: 'Empfehlungen', href: '/demo/restaurant' }, { text: 'Events', href: '/demo/restaurant/events' }] },
        { title: 'Besuch', items: [{ text: 'Reservierung', href: '/demo/restaurant/reservierung' }, { text: 'Über uns', href: '/demo/restaurant/ueber-uns' }, { text: 'Galerie', href: '/demo/restaurant/galerie' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  hotel: {
    brand: { companyName: 'Hotel Alpenblick', tagline: 'Ihr Refugium in den Tiroler Alpen', primaryColor: '#7c5e3c' },
    contact: { phone: '+43 5242 1234', email: 'info@hotel-alpenblick.at', address: 'Bergstraße 8, 6370 Kitzbühel' },
    socialLinks: { instagram: '#', facebook: '#' },
    navItems: [
      { label: 'Zimmer', href: '/demo/hotel/zimmer' },
      { label: 'Wellness', href: '/demo/hotel/wellness' },
      { label: 'Restaurant', href: '/demo/hotel/restaurant' },
      { label: 'Events', href: '/demo/hotel/veranstaltungen' },
      { label: 'Galerie', href: '/demo/hotel/galerie' },
      { label: 'Kontakt', href: '/demo/hotel/kontakt' },
    ],
    cta: { label: 'Jetzt buchen', href: '/demo/hotel/kontakt' },
    footer: {
      columns: [
        { title: 'Hotel', items: [{ text: 'Zimmer & Suiten', href: '/demo/hotel/zimmer' }, { text: 'Wellness & Spa', href: '/demo/hotel/wellness' }, { text: 'Restaurant', href: '/demo/hotel/restaurant' }] },
        { title: 'Service', items: [{ text: 'Veranstaltungen', href: '/demo/hotel/veranstaltungen' }, { text: 'Galerie', href: '/demo/hotel/galerie' }, { text: 'Kontakt', href: '/demo/hotel/kontakt' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  medical: {
    brand: { companyName: 'Praxis am Stadtpark', tagline: 'Hausarztmedizin, Diagnostik und Prävention', primaryColor: '#0e7490' },
    contact: { phone: '+49 221 123 456', email: 'praxis@example.de', address: 'Parkallee 12, 50667 Köln' },
    socialLinks: {},
    navItems: [
      { label: 'Leistungen', href: '/demo/medical/leistungen' },
      { label: 'Team', href: '/demo/medical/team' },
      { label: 'Patienten-Info', href: '/demo/medical/patienten' },
      { label: 'Kontakt', href: '/demo/medical/kontakt' },
    ],
    cta: { label: 'Termin buchen', href: '/demo/medical/kontakt' },
    footer: {
      columns: [
        { title: 'Praxis', items: [{ text: 'Leistungen', href: '/demo/medical/leistungen' }, { text: 'Ärzteteam', href: '/demo/medical/team' }, { text: 'Unsere Praxis', href: '/demo/medical/praxis' }] },
        { title: 'Patienten', items: [{ text: 'Patienten-Info', href: '/demo/medical/patienten' }, { text: 'Notfall', href: '/demo/medical/notfall' }, { text: 'Kontakt', href: '/demo/medical/kontakt' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  salon: {
    brand: { companyName: 'Studio Bellezza', tagline: 'Hair · Beauty · Wellness', primaryColor: '#be185d' },
    contact: { phone: '+49 89 987 654', email: 'hello@studio-bellezza.de', address: 'Maximilianstraße 15, 80539 München' },
    socialLinks: { instagram: '#' },
    navItems: [
      { label: 'Services & Preise', href: '/demo/salon/services' },
      { label: 'Team', href: '/demo/salon/team' },
      { label: 'Galerie', href: '/demo/salon/galerie' },
      { label: 'Kontakt', href: '/demo/salon/kontakt' },
    ],
    cta: { label: 'Termin buchen', href: '/demo/salon/kontakt' },
    footer: {
      columns: [
        { title: 'Angebot', items: [{ text: 'Services & Preise', href: '/demo/salon/services' }, { text: 'Team', href: '/demo/salon/team' }, { text: 'Galerie', href: '/demo/salon/galerie' }] },
        { title: 'Studio', items: [{ text: 'Kontakt', href: '/demo/salon/kontakt' }, { text: 'Termin buchen', href: '/demo/salon/kontakt' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  tourism: {
    brand: { companyName: 'Tiroler Bergwelt', tagline: 'Natur erleben · Berge entdecken', primaryColor: '#0e7490' },
    contact: { phone: '+43 5242 9876', email: 'info@tiroler-bergwelt.at', address: 'Dorfplatz 3, 6365 Kirchberg' },
    socialLinks: { instagram: '#', facebook: '#' },
    navItems: [
      { label: 'Erlebnisse', href: '/demo/tourism/erlebnisse' },
      { label: 'Orte', href: '/demo/tourism/orte' },
      { label: 'Reiseplanung', href: '/demo/tourism/planung' },
      { label: 'Galerie', href: '/demo/tourism/galerie' },
      { label: 'Kontakt', href: '/demo/tourism/kontakt' },
    ],
    cta: { label: 'Erlebnisse entdecken', href: '/demo/tourism/erlebnisse' },
    footer: {
      columns: [
        { title: 'Entdecken', items: [{ text: 'Erlebnisse & Touren', href: '/demo/tourism/erlebnisse' }, { text: 'Orte & Sehenswertes', href: '/demo/tourism/orte' }, { text: 'Galerie', href: '/demo/tourism/galerie' }] },
        { title: 'Service', items: [{ text: 'Reiseplanung', href: '/demo/tourism/planung' }, { text: 'Kontakt', href: '/demo/tourism/kontakt' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  wedding: {
    brand: { companyName: 'Anna & Sebastian', tagline: 'Unsere Hochzeit – 14. September 2025, Salzburg', primaryColor: '#9f7048' },
    contact: { phone: '', email: 'hochzeit@anna-sebastian.at', address: 'Schloss Mirabell, 5020 Salzburg' },
    socialLinks: { instagram: '#' },
    navItems: [
      { label: 'Unsere Geschichte', href: '/demo/wedding/unsere-geschichte' },
      { label: 'Ablauf', href: '/demo/wedding/ablauf' },
      { label: 'Location', href: '/demo/wedding/location' },
      { label: 'Anreise', href: '/demo/wedding/anreise' },
      { label: 'RSVP', href: '/demo/wedding/rsvp' },
    ],
    cta: { label: 'Zusagen', href: '/demo/wedding/rsvp' },
    footer: {
      columns: [
        { title: 'Infos', items: [{ text: 'Unsere Geschichte', href: '/demo/wedding/unsere-geschichte' }, { text: 'Ablauf', href: '/demo/wedding/ablauf' }, { text: 'Location', href: '/demo/wedding/location' }] },
        { title: 'Gäste', items: [{ text: 'Anreise & Hotels', href: '/demo/wedding/anreise' }, { text: 'RSVP', href: '/demo/wedding/rsvp' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  photography: {
    brand: { companyName: 'Lisa Fotografie', tagline: 'Emotionale Momentaufnahmen – Hochzeiten, Paare & Portraits', primaryColor: '#9c7c5c' },
    contact: { phone: '+49 171 1234567', email: 'hello@lisa-fotografie.de', address: 'Mainstraße 8, 55116 Mainz' },
    socialLinks: { instagram: '#' },
    navItems: [
      { label: 'Portfolio', href: '/demo/photography/portfolio' },
      { label: 'Leistungen', href: '/demo/photography/leistungen' },
      { label: 'Über mich', href: '/demo/photography/ueber-mich' },
      { label: 'FAQ', href: '/demo/photography/faq' },
      { label: 'Kontakt', href: '/demo/photography/kontakt' },
    ],
    cta: { label: 'Anfragen', href: '/demo/photography/kontakt' },
    footer: {
      columns: [
        { title: 'Fotografie', items: [{ text: 'Hochzeiten', href: '/demo/photography/leistungen' }, { text: 'Paare', href: '/demo/photography/leistungen' }, { text: 'Portfolio', href: '/demo/photography/portfolio' }] },
        { title: 'Mehr', items: [{ text: 'FAQ', href: '/demo/photography/faq' }, { text: 'Über mich', href: '/demo/photography/ueber-mich' }, { text: 'Kontakt', href: '/demo/photography/kontakt' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  consulting: {
    brand: { companyName: 'Kanzlei Bergmann & Partner', tagline: 'Ihre Experten für Arbeits-, Familien- und Wirtschaftsrecht', primaryColor: '#1a2744' },
    contact: { phone: '+49 30 2589 4400', email: 'kanzlei@bergmann-partner.de', address: 'Friedrichstraße 78, 10117 Berlin' },
    socialLinks: { linkedin: '#' },
    navItems: [
      { label: 'Rechtsgebiete', href: '/demo/consulting/rechtsgebiete' },
      { label: 'Team', href: '/demo/consulting/team' },
      { label: 'Über uns', href: '/demo/consulting/ueber-uns' },
      { label: 'Aktuelles', href: '/demo/consulting/aktuelles' },
      { label: 'Kontakt', href: '/demo/consulting/kontakt' },
    ],
    cta: { label: 'Erstberatung', href: '/demo/consulting/kontakt' },
    footer: {
      columns: [
        { title: 'Rechtsgebiete', items: [{ text: 'Arbeitsrecht', href: '/demo/consulting/rechtsgebiete' }, { text: 'Familienrecht', href: '/demo/consulting/rechtsgebiete' }, { text: 'Mietrecht', href: '/demo/consulting/rechtsgebiete' }, { text: 'Handelsrecht', href: '/demo/consulting/rechtsgebiete' }] },
        { title: 'Kanzlei', items: [{ text: 'Über uns', href: '/demo/consulting/ueber-uns' }, { text: 'Team', href: '/demo/consulting/team' }, { text: 'Aktuelles', href: '/demo/consulting/aktuelles' }, { text: 'Kontakt', href: '/demo/consulting/kontakt' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  realestate: {
    brand: { companyName: 'Rheinblick Immobilien', tagline: 'Ihr Premiumpartner für Kauf, Verkauf & Bewertung in Köln', primaryColor: '#1e3a5f' },
    contact: { phone: '+49 221 9876 100', email: 'info@rheinblick-immobilien.de', address: 'Rheinuferstraße 12, 50676 Köln' },
    socialLinks: { linkedin: '#', instagram: '#' },
    navItems: [
      { label: 'Kaufen', href: '/demo/realestate/kaufen' },
      { label: 'Bewertung', href: '/demo/realestate/bewertung' },
      { label: 'Über uns', href: '/demo/realestate/ueber-uns' },
      { label: 'Kontakt', href: '/demo/realestate/kontakt' },
    ],
    cta: { label: 'Bewertung anfordern', href: '/demo/realestate/bewertung' },
    footer: {
      columns: [
        { title: 'Immobilien', items: [{ text: 'Kaufen', href: '/demo/realestate/kaufen' }, { text: 'Bewertung', href: '/demo/realestate/bewertung' }] },
        { title: 'Unternehmen', items: [{ text: 'Über uns', href: '/demo/realestate/ueber-uns' }, { text: 'Kontakt', href: '/demo/realestate/kontakt' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  cafe: {
    brand: { companyName: 'Röstwerk', tagline: 'Third-Wave-Coffee & Craft-Bar in München-Haidhausen', primaryColor: '#8b4513' },
    contact: { phone: '+49 89 2345 6789', email: 'hello@roestwerk-muenchen.de', address: 'Wörthstraße 23, 81667 München' },
    socialLinks: { instagram: '#' },
    navItems: [
      { label: 'Karte', href: '/demo/cafe/karte' },
      { label: 'Events', href: '/demo/cafe/events' },
      { label: 'Über uns', href: '/demo/cafe/ueber-uns' },
      { label: 'Kontakt', href: '/demo/cafe/kontakt' },
    ],
    cta: { label: 'Reservieren', href: '/demo/cafe/kontakt' },
    footer: {
      columns: [
        { title: 'Röstwerk', items: [{ text: 'Karte', href: '/demo/cafe/karte' }, { text: 'Events', href: '/demo/cafe/events' }, { text: 'Über uns', href: '/demo/cafe/ueber-uns' }] },
        { title: 'Besuch', items: [{ text: 'Kontakt', href: '/demo/cafe/kontakt' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  tattoo: {
    brand: { companyName: 'INK DISTRICT', tagline: 'Tattoo Studio Berlin — Custom Ink & Flash', primaryColor: '#dc2626' },
    contact: { phone: '+49 30 555 1234', email: 'booking@inkdistrict.de', address: 'Oranienstraße 42, 10999 Berlin' },
    socialLinks: { instagram: '#', facebook: '#' },
    navItems: [
      { label: 'Künstler', href: '/demo/tattoo/kuenstler' },
      { label: 'Galerie', href: '/demo/tattoo/galerie' },
      { label: 'Leistungen & Preise', href: '/demo/tattoo/leistungen' },
      { label: 'Pflege', href: '/demo/tattoo/pflege' },
      { label: 'Kontakt', href: '/demo/tattoo/kontakt' },
    ],
    cta: { label: 'Termin anfragen', href: '/demo/tattoo/kontakt' },
    footer: {
      columns: [
        { title: 'Studio', items: [{ text: 'Künstler', href: '/demo/tattoo/kuenstler' }, { text: 'Galerie', href: '/demo/tattoo/galerie' }, { text: 'Flash Designs', href: '/demo/tattoo/galerie' }] },
        { title: 'Info', items: [{ text: 'Preise', href: '/demo/tattoo/leistungen' }, { text: 'Pflege-Guide', href: '/demo/tattoo/pflege' }, { text: 'Kontakt', href: '/demo/tattoo/kontakt' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  showcase: {
    brand: { companyName: 'Flamingo CMS', tagline: 'Sektionen-Galerie — alle verfügbaren Inhaltsbausteine', primaryColor: '#6366f1' },
    contact: { phone: '', email: 'info@flamingo-cms.de', address: '' },
    socialLinks: {},
    navItems: [],
    cta: { label: 'Alle Sektionen', href: '/demo/showcase' },
    footer: {
      columns: [],
      legalLinks: [],
    },
  },
};

export function getDemoSiteData(industry: IndustryKey): DemoSiteData {
  return DEMO_DATA[industry];
}
