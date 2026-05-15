import type { NavItem, NavCta, FooterData, BrandData, ContactData, SocialLinks } from '@/lib/tenant-data';

export type IndustryKey = 'handwerk' | 'hotel' | 'medical' | 'restaurant' | 'salon' | 'tourism';

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
      { label: 'Ambiente', href: '/demo/restaurant/ambiente' },
      { label: 'Events', href: '/demo/restaurant/events' },
      { label: 'Reservierung', href: '/demo/restaurant/reservierung' },
    ],
    cta: { label: 'Tisch reservieren', href: '/demo/restaurant/reservierung' },
    footer: {
      columns: [
        { title: 'Küche', items: [{ text: 'Speisekarte', href: '/demo/restaurant/speisekarte' }, { text: 'Empfehlungen', href: '/demo/restaurant' }, { text: 'Events', href: '/demo/restaurant/events' }] },
        { title: 'Besuch', items: [{ text: 'Reservierung', href: '/demo/restaurant/reservierung' }, { text: 'Ambiente', href: '/demo/restaurant/ambiente' }, { text: 'Kontakt', href: '/demo/restaurant/reservierung' }] },
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
};

export function getDemoSiteData(industry: IndustryKey): DemoSiteData {
  return DEMO_DATA[industry];
}
