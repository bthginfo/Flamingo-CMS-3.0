export const FITNESS_CONFIG = {
  slug: 'demo-fitness',
  name: 'Pulse Studio',
  industry: 'fitness' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Pulse Studio',
    tagline: 'Training, Kurse & Personal Coaching',
    primaryColor: '#9333ea',
    secondaryColor: '#581c87',
    accentColor: '#22d3ee',
  },
  contact: { phone: '+49 89 7711 2233', email: 'hello@pulse-studio.de', address: 'Westendstraße 41, 80339 München' },
  socialLinks: { instagram: 'https://instagram.com/pulsestudio' },
  openingHours: [
    { day: 'Mo - Fr', hours: '06:30 - 22:00' },
    { day: 'Sa - So', hours: '08:00 - 18:00' },
  ],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Kurse', href: '/kurse', type: 'link' },
    { label: 'Coaching', href: '/coaching', type: 'link' },
    { label: 'Trainer', href: '/trainer', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Probetraining buchen', href: '/kontakt' },
  footerColumns: [
    { title: 'Training', items: [{ text: 'Kurse', href: '/kurse' }, { text: 'Coaching', href: '/coaching' }] },
    { title: 'Studio', items: [{ text: 'Trainer', href: '/trainer' }, { text: 'Kontakt', href: '/kontakt' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Probetraining buchen', href: '/kontakt' },
  pages: [
    {
      slug: 'startseite',
      title: 'Startseite',
      sections: [
        {
          type: 'fitnessHero',
          sortOrder: 0,
          data: {
            eyebrow: 'Fitness Demo',
            headline: 'Training, das klar motiviert.',
            subline: 'Diese Demo-Hülle ist angelegt und kann anschließend per API mit Kursen, Coaches und Angeboten befüllt werden.',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1800&q=85',
            glowColor: 'rgba(147,51,234,0.44)',
            primaryCta: { label: 'Probetraining buchen', href: '/kontakt' },
            secondaryCta: { label: 'Kurse ansehen', href: '/kurse' },
          },
        },
      ],
    },
  ],
  collections: [],
};
