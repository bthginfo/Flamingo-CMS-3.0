import type { DemoSite } from './types';

const B = { visible: true, variant: null, container: 'default', spacingTop: 'none', spacingBottom: 'none', anchorId: null };

export const locationSite: DemoSite = {
  industry: 'location',
  industryKey: 'location',
  defaultStyle: 'classic',
  pages: [
    {
      slug: 'startseite',
      title: 'Startseite',
      sections: [
        {
          ...B,
          id: 'location-placeholder',
          type: 'locationHero',
          data: {
            eyebrow: 'Location Demo',
            headline: 'Räume, die aus Plänen echte Momente machen.',
            subline: 'Dieser Demo-Tenant ist technisch vorbereitet und wird anschließend per API mit vollständigen Location-Inhalten befüllt.',
            image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&q=85',
            overlay: 'rgba(0,0,0,0.58)',
            primaryCta: { label: 'Wunschtermin anfragen', href: '/demo/location/kontakt' },
            secondaryCta: { label: 'Räume ansehen', href: '/demo/location/raeume' },
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
