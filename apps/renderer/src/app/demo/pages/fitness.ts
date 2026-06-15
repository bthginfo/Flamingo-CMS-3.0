import type { DemoSite } from './types';

const B = { visible: true, variant: null, container: 'default', spacingTop: 'none', spacingBottom: 'none', anchorId: null };

export const fitnessSite: DemoSite = {
  industry: 'fitness',
  industryKey: 'fitness',
  defaultStyle: 'classic',
  pages: [
    {
      slug: 'startseite',
      title: 'Startseite',
      sections: [
        {
          ...B,
          id: 'fitness-placeholder',
          type: 'fitnessHero',
          data: {
            eyebrow: 'Fitness Demo',
            headline: 'Training, das klar motiviert.',
            subline: 'Dieser Demo-Tenant ist als Fallback vorbereitet und kann später per API vollständig mit Kursen, Coaches und Angeboten befüllt werden.',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1800&q=85',
            glowColor: 'rgba(147,51,234,0.44)',
            primaryCta: { label: 'Probetraining buchen', href: '/demo/fitness/kontakt' },
            secondaryCta: { label: 'Kurse ansehen', href: '/demo/fitness/kurse' },
          },
        },
      ],
    },
  ],
};
