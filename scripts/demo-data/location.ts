export const LOCATION_CONFIG = {
  slug: 'demo-location',
  name: 'Lichtwerk Loft',
  industry: 'location' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Lichtwerk Loft',
    tagline: 'Eventlocation, Hochzeiten & Coworking',
    primaryColor: '#b45309',
    secondaryColor: '#451a03',
    accentColor: '#f59e0b',
  },
  contact: { phone: '+49 841 8899 4411', email: 'events@lichtwerk-loft.de', address: 'Am Speicher 12, 85049 Ingolstadt' },
  socialLinks: { instagram: 'https://instagram.com/lichtwerkloft' },
  openingHours: [
    { day: 'Mo - Fr', hours: '09:00 - 18:00' },
    { day: 'Events', hours: 'nach Vereinbarung' },
  ],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Räume', href: '/raeume', type: 'link' },
    { label: 'Events', href: '/events', type: 'link' },
    { label: 'Coworking', href: '/coworking', type: 'link' },
    { label: 'Galerie', href: '/galerie', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Wunschtermin anfragen', href: '/kontakt' },
  footerColumns: [
    { title: 'Location', items: [{ text: 'Räume', href: '/raeume' }, { text: 'Events', href: '/events' }, { text: 'Coworking', href: '/coworking' }] },
    { title: 'Planung', items: [{ text: 'Galerie', href: '/galerie' }, { text: 'Kontakt', href: '/kontakt' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Wunschtermin anfragen', href: '/kontakt' },
  pages: [
    {
      slug: 'startseite',
      title: 'Startseite',
      sections: [
        {
          type: 'locationHero',
          sortOrder: 0,
          data: {
            eyebrow: 'Location Demo',
            headline: 'Räume, die aus Plänen echte Momente machen.',
            subline: 'Diese Demo-Hülle ist angelegt und kann anschließend per API mit vollständigen Location-Inhalten befüllt werden.',
            image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&q=85',
            overlay: 'rgba(0,0,0,0.58)',
            primaryCta: { label: 'Wunschtermin anfragen', href: '/kontakt' },
            secondaryCta: { label: 'Räume ansehen', href: '/raeume' },
            facts: [
              { value: 'Neu', label: 'Branchentemplate vorbereitet' },
              { value: 'CMS', label: 'bereit für API-Befüllung' },
              { value: 'Shared', label: 'Premium-Sections verfügbar' },
            ],
          },
        },
      ],
    },
  ],
  collections: [],
};
