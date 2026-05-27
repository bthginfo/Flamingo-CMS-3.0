import type { DemoSite } from './types';

const B = { visible: true, variant: null, container: 'default', spacingTop: 'none', spacingBottom: 'none', anchorId: null };

export const floristSite: DemoSite = {
  industry: 'florist',
  industryKey: 'florist',
  defaultStyle: 'classic',
  pages: [
    {
      slug: 'startseite',
      title: 'Startseite',
      sections: [
        {
          ...B,
          id: 'florist-placeholder',
          type: 'floristHero',
          data: {
            eyebrow: 'Floristik Demo',
            headline: 'Blumen, die Räume und Momente verändern.',
            subline: 'Dieser Demo-Tenant ist technisch vorbereitet und wird anschließend per API mit vollständigen Floristik-Inhalten befüllt.',
            image: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=1800&q=85',
            glowColor: 'rgba(190,24,93,0.42)',
            primaryCta: { label: 'Kontakt aufnehmen', href: '/demo/florist/kontakt' },
            secondaryCta: { label: 'Sortiment entdecken', href: '/demo/florist/straeusse' },
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
};
