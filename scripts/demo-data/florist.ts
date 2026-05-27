export const FLORIST_CONFIG = {
  slug: 'demo-florist',
  name: 'Blütenwerk Atelier',
  industry: 'florist' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Blütenwerk Atelier',
    tagline: 'Floristik, Hochzeiten & saisonale Blumenwelten',
    primaryColor: '#be185d',
    secondaryColor: '#831843',
    accentColor: '#f9a8d4',
  },
  contact: { phone: '+49 89 4455 2211', email: 'hello@bluetenwerk-atelier.de', address: 'Gärtnerplatz 8, 80469 München' },
  socialLinks: { instagram: 'https://instagram.com/bluetenwerk' },
  openingHours: [
    { day: 'Di - Fr', hours: '10:00 - 18:30' },
    { day: 'Sa', hours: '09:00 - 15:00' },
  ],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Sträuße', href: '/straeusse', type: 'link' },
    { label: 'Hochzeiten', href: '/hochzeiten', type: 'link' },
    { label: 'Workshops', href: '/workshops', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Beratung anfragen', href: '/kontakt' },
  footerColumns: [
    { title: 'Floristik', items: [{ text: 'Sträuße', href: '/straeusse' }, { text: 'Hochzeiten', href: '/hochzeiten' }, { text: 'Workshops', href: '/workshops' }] },
    { title: 'Atelier', items: [{ text: 'Kontakt', href: '/kontakt' }, { text: 'Anfahrt', href: '/kontakt' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Beratung anfragen', href: '/kontakt' },
  pages: [
    {
      slug: 'startseite',
      title: 'Startseite',
      sections: [
        {
          type: 'floristHero',
          sortOrder: 0,
          data: {
            eyebrow: 'Floristik Demo',
            headline: 'Blumen, die Räume und Momente verändern.',
            subline: 'Diese Demo-Hülle ist angelegt und kann anschließend per API mit vollständigen Floristik-Inhalten befüllt werden.',
            image: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=1800&q=85',
            glowColor: 'rgba(190,24,93,0.42)',
            primaryCta: { label: 'Kontakt aufnehmen', href: '/kontakt' },
            secondaryCta: { label: 'Sortiment entdecken', href: '/straeusse' },
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
