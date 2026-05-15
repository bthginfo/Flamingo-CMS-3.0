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
    navItems: [{ label: 'Leistungen', href: '#leistungen' }, { label: 'Projekte', href: '#projekte' }, { label: 'Über uns', href: '#team' }, { label: 'Kontakt', href: '#kontakt' }],
    cta: { label: 'Anfrage senden', href: '#kontakt' },
    footer: {
      columns: [
        { title: 'Leistungen', items: [{ text: 'Sanitär', href: '#' }, { text: 'Heizung', href: '#' }, { text: 'Bäder', href: '#' }, { text: 'Notdienst', href: '#' }] },
        { title: 'Unternehmen', items: [{ text: 'Über uns', href: '#' }, { text: 'Team', href: '#' }, { text: 'Projekte', href: '#' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  restaurant: {
    brand: { companyName: 'Trattoria Dal Maestro', tagline: 'Authentische italienische Küche in Innsbruck', primaryColor: '#9a3412' },
    contact: { phone: '+43 512 123 456', email: 'info@trattoria-dalmaestro.at', address: 'Maria-Theresien-Straße 24, 6020 Innsbruck' },
    socialLinks: { instagram: '#', facebook: '#' },
    navItems: [{ label: 'Speisekarte', href: '#menu' }, { label: 'Reservierung', href: '#reservation' }, { label: 'Events', href: '#events' }, { label: 'Kontakt', href: '#kontakt' }],
    cta: { label: 'Tisch reservieren', href: '#reservation' },
    footer: {
      columns: [
        { title: 'Küche', items: [{ text: 'Speisekarte', href: '#' }, { text: 'Signature Dishes', href: '#' }, { text: 'Weinkarte', href: '#' }] },
        { title: 'Besuch', items: [{ text: 'Reservierung', href: '#' }, { text: 'Öffnungszeiten', href: '#' }, { text: 'Anfahrt', href: '#' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  hotel: {
    brand: { companyName: 'Hotel Alpenblick', tagline: 'Ihr Refugium in den Tiroler Alpen', primaryColor: '#7c5e3c' },
    contact: { phone: '+43 5242 1234', email: 'info@hotel-alpenblick.at', address: 'Bergstraße 8, 6370 Kitzbühel' },
    socialLinks: { instagram: '#', facebook: '#' },
    navItems: [{ label: 'Zimmer', href: '#zimmer' }, { label: 'Wellness', href: '#wellness' }, { label: 'Restaurant', href: '#dining' }, { label: 'Kontakt', href: '#kontakt' }],
    cta: { label: 'Jetzt buchen', href: '#booking' },
    footer: {
      columns: [
        { title: 'Hotel', items: [{ text: 'Zimmer & Suiten', href: '#' }, { text: 'Wellness & Spa', href: '#' }, { text: 'Restaurant', href: '#' }] },
        { title: 'Service', items: [{ text: 'Anreise', href: '#' }, { text: 'Verfügbarkeit', href: '#' }, { text: 'FAQ', href: '#' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  medical: {
    brand: { companyName: 'Praxis am Stadtpark', tagline: 'Hausarztmedizin, Diagnostik und Prävention', primaryColor: '#0e7490' },
    contact: { phone: '+49 221 123 456', email: 'praxis@example.de', address: 'Parkallee 12, 50667 Köln' },
    socialLinks: {},
    navItems: [{ label: 'Leistungen', href: '#leistungen' }, { label: 'Team', href: '#team' }, { label: 'Sprechzeiten', href: '#termin' }, { label: 'Kontakt', href: '#kontakt' }],
    cta: { label: 'Termin buchen', href: '#termin' },
    footer: {
      columns: [
        { title: 'Praxis', items: [{ text: 'Leistungen', href: '#' }, { text: 'Ärzteteam', href: '#' }, { text: 'Sprechzeiten', href: '#' }] },
        { title: 'Patienten', items: [{ text: 'Online-Termin', href: '#' }, { text: 'Notfallinfo', href: '#' }, { text: 'Downloads', href: '#' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  salon: {
    brand: { companyName: 'Studio Bellezza', tagline: 'Hair · Beauty · Wellness', primaryColor: '#be185d' },
    contact: { phone: '+49 89 987 654', email: 'hello@studio-bellezza.de', address: 'Maximilianstraße 15, 80539 München' },
    socialLinks: { instagram: '#' },
    navItems: [{ label: 'Services', href: '#services' }, { label: 'Preise', href: '#preise' }, { label: 'Team', href: '#team' }, { label: 'Buchung', href: '#buchung' }],
    cta: { label: 'Termin buchen', href: '#buchung' },
    footer: {
      columns: [
        { title: 'Angebot', items: [{ text: 'Services', href: '#' }, { text: 'Preisliste', href: '#' }, { text: 'Pakete', href: '#' }] },
        { title: 'Studio', items: [{ text: 'Team', href: '#' }, { text: 'Galerie', href: '#' }, { text: 'Kontakt', href: '#' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
  tourism: {
    brand: { companyName: 'Tiroler Bergwelt', tagline: 'Natur erleben · Berge entdecken', primaryColor: '#0e7490' },
    contact: { phone: '+43 5242 9876', email: 'info@tiroler-bergwelt.at', address: 'Dorfplatz 3, 6365 Kirchberg' },
    socialLinks: { instagram: '#', facebook: '#' },
    navItems: [{ label: 'Erlebnisse', href: '#erlebnisse' }, { label: 'Touren', href: '#touren' }, { label: 'Events', href: '#events' }, { label: 'Kontakt', href: '#kontakt' }],
    cta: { label: 'Erlebnisse entdecken', href: '#erlebnisse' },
    footer: {
      columns: [
        { title: 'Entdecken', items: [{ text: 'Erlebnisse', href: '#' }, { text: 'Touren & Routen', href: '#' }, { text: 'Events', href: '#' }] },
        { title: 'Service', items: [{ text: 'Unterkünfte', href: '#' }, { text: 'Besucherinfo', href: '#' }, { text: 'Kontakt', href: '#' }] },
      ],
      legalLinks: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }],
    },
  },
};

export function getDemoSiteData(industry: IndustryKey): DemoSiteData {
  return DEMO_DATA[industry];
}
