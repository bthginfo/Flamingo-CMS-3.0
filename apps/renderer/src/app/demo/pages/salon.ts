import type { DemoSite } from './types';
import { B, HERO } from './types';

export const salonSite: DemoSite = {
  industry: 'salon',
  industryKey: 'salon',
  defaultStyle: 'classic',
  pages: [
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO, id: 'sl-home-hero', type: 'hero',
          data: {
            headline: 'Atelier Rose',
            subline: 'Haare, Beauty und Treatments in ruhiger Studio-Atmosphaere.',
            badgeText: 'Salon Demo',
            bgImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
            trustItems: ['Online buchbar', 'Farbexpertise', '4.9 Sterne'],
            primaryCta: { label: 'Termin buchen', href: '/demo/salon/kontakt' },
            secondaryCta: { label: 'Preise ansehen', href: '/demo/salon/services' },
            bookingHint: 'Neue Termine diese Woche',
            ratingText: '4.9 / 5 Google',
          },
        },
        {
          ...B, id: 'sl-home-services', type: 'serviceMenu',
          data: {
            headline: 'Leistungen',
            subline: 'Services fuer Haar, Beauty und kleine Auszeiten.',
            badgeText: 'Services',
            categories: [{ title: 'Hair', text: 'Cut, Styling und Farbe.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80', category: 'Haare', services: ['Cut', 'Color', 'Glossing'], cta: { label: 'Buchen', href: '/demo/salon/kontakt' } }],
            ctaPrimary: { label: 'Alle Services', href: '/demo/salon/services' },
          },
        },
        {
          ...B, id: 'sl-home-testimonials', type: 'testimonials',
          data: {
            headline: 'Bewertungen',
            subline: 'Stimmen unserer Kundinnen und Kunden.',
            badgeText: 'Feedback',
            ratingValue: '4.9 von 5',
            ratingCount: '184 Bewertungen',
            items: [{ quote: 'Sehr ruhige Beratung und genau die Farbe, die ich wollte.', name: 'Lena K.', context: 'Balayage', rating: 5, sourceLabel: 'Google' }],
            ctaPrimary: { label: 'Termin buchen', href: '/demo/salon/kontakt' },
          },
        },
        {
          ...B, id: 'sl-home-booking', type: 'bookingCta',
          data: {
            headline: 'Termin buchen',
            subline: 'Online, telefonisch oder per WhatsApp.',
            badgeText: 'Buchung',
            introText: 'Wir bestaetigen Anfragen persoenlich und planen genug Zeit fuer Beratung ein.',
            onlineCta: { label: 'Online buchen', href: '/demo/salon/kontakt' },
            phoneCta: { label: 'Anrufen', href: 'tel:+49221123456' },
            whatsappCta: { label: 'WhatsApp', href: 'https://wa.me/49221123456' },
            notes: ['Bitte 24h vorher absagen', 'Color-Termine mit Beratung'],
          },
        },
      ],
    },
    {
      slug: 'services',
      title: 'Services & Preise',
      sections: [
        {
          ...HERO, id: 'sl-srv-hero', type: 'hero',
          data: {
            headline: 'Services & Preise',
            subline: 'Unser Angebot fuer Haar, Beauty und Treatments.',
            badgeText: 'Leistungen',
            bgImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1800&q=85',
            primaryCta: { label: 'Termin buchen', href: '/demo/salon/kontakt' },
          },
        },
        {
          ...B, id: 'sl-srv-menu', type: 'serviceMenu',
          data: {
            headline: 'Leistungen',
            subline: 'Services fuer Haar, Beauty und kleine Auszeiten.',
            badgeText: 'Services',
            categories: [{ title: 'Hair', text: 'Cut, Styling und Farbe.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80', category: 'Haare', services: ['Cut', 'Color', 'Glossing'], cta: { label: 'Buchen', href: '/demo/salon/kontakt' } }],
            ctaPrimary: { label: 'Alle Services', href: '/demo/salon/services' },
          },
        },
        {
          ...B, id: 'sl-srv-prices', type: 'priceList',
          data: {
            headline: 'Preise',
            subline: 'Transparente Orientierung fuer die Terminplanung.',
            badgeText: 'Preisliste',
            categories: [{ title: 'Hair', text: 'Beratung inklusive.', items: [{ name: 'Cut & Styling', description: 'Waschen, Schnitt, Foehnen.', durationLabel: '60 Min.', priceLabel: 'ab 69', note: 'nach Laenge', cta: { label: 'Termin', href: '/demo/salon/kontakt' } }] }],
            footnote: 'Alle Preise sind ab-Preise und werden im Termin final besprochen.',
            ctaPrimary: { label: 'Termin buchen', href: '/demo/salon/kontakt' },
          },
        },
        {
          ...B, id: 'sl-srv-treatment', type: 'treatmentDetail',
          data: {
            headline: 'Treatments',
            subline: 'Details zu Ablauf, Ergebnis und Pflege.',
            badgeText: 'Behandlungen',
            treatments: [{ title: 'Glossing Ritual', text: 'Mehr Glanz und frische Nuance.', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80', resultLabel: 'Glanz', durationLabel: '45 Min.', priceLabel: 'ab 49', steps: ['Beratung', 'Glossing', 'Pflege'], careTips: ['Sulfatarmes Shampoo'], cta: { label: 'Anfragen', href: '/demo/salon/kontakt' } }],
          },
        },
        {
          ...B, id: 'sl-srv-packages', type: 'packages',
          data: {
            headline: 'Pakete & Specials',
            subline: 'Kombinationen, Gutscheine und Saison-Angebote.',
            badgeText: 'Specials',
            packages: [{ title: 'Fresh Start', text: 'Cut, Pflege und Styling.', image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=900&q=80', priceLabel: 'ab 119', validUntilLabel: 'bis September', includes: ['Cut', 'Treatment', 'Styling'], cta: { label: 'Buchen', href: '/demo/salon/kontakt' } }],
            ctaPrimary: { label: 'Special sichern', href: '/demo/salon/kontakt' },
          },
        },
      ],
    },
    {
      slug: 'team',
      title: 'Unser Team',
      sections: [
        {
          ...HERO, id: 'sl-team-hero', type: 'hero',
          data: {
            headline: 'Unser Team',
            subline: 'Spezialistinnen fuer Cut, Color und Pflege.',
            badgeText: 'Menschen',
            bgImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1800&q=85',
            primaryCta: { label: 'Termin buchen', href: '/demo/salon/kontakt' },
          },
        },
        {
          ...B, id: 'sl-team-showcase', type: 'teamShowcase',
          data: {
            headline: 'Team',
            subline: 'Spezialistinnen fuer Cut, Color und Pflege.',
            badgeText: 'Menschen',
            members: [{ name: 'Mara', role: 'Color Specialist', bio: 'Balayage, Glossing und weiche Farbverlaeufe.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80', specialties: ['Balayage', 'Glossing'], bookingCta: { label: 'Bei Mara buchen', href: '/demo/salon/kontakt' } }],
          },
        },
        {
          ...B, id: 'sl-team-expertise', type: 'expertiseGrid',
          data: {
            headline: 'Expertise',
            subline: 'Methoden, Marken und Spezialisierungen.',
            badgeText: 'Skills',
            items: [{ icon: 'sparkles', title: 'Balayage', text: 'Natuerliche Farbverlaeufe mit Beratung.', metaLabel: 'Color' }, { icon: 'leaf', title: 'Pflege', text: 'Rituale fuer Haar und Kopfhaut.', metaLabel: 'Care' }],
          },
        },
      ],
    },
    {
      slug: 'galerie',
      title: 'Galerie',
      sections: [
        {
          ...HERO, id: 'sl-gal-hero', type: 'hero',
          data: {
            headline: 'Galerie',
            subline: 'Salon, Looks und Transformationen.',
            badgeText: 'Einblicke',
            bgImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1800&q=85',
            primaryCta: { label: 'Termin buchen', href: '/demo/salon/kontakt' },
          },
        },
        {
          ...B, id: 'sl-gal-before-after', type: 'beforeAfter',
          data: {
            headline: 'Vorher & Nachher',
            subline: 'Transformationen aus dem Studio.',
            badgeText: 'Looks',
            items: [{ title: 'Soft Blonde', text: 'Sanfte Aufhellung mit Glossing.', beforeImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&q=80', afterImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80', category: 'Color', caption: 'Ergebnis nach 2.5 Stunden', cta: { label: 'Aehnlichen Look buchen', href: '/demo/salon/kontakt' } }],
          },
        },
        {
          ...B, id: 'sl-gal-gallery', type: 'gallery',
          data: {
            headline: 'Galerie',
            subline: 'Salon, Looks und Details.',
            badgeText: 'Einblicke',
            images: [{ src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80', alt: 'Salon', caption: 'Studio', category: 'Salon' }, { src: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=900&q=80', alt: 'Styling', caption: 'Styling', category: 'Hair' }],
          },
        },
      ],
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      sections: [
        {
          ...HERO, id: 'sl-contact-hero', type: 'hero',
          data: {
            headline: 'Kontakt & Termin',
            subline: 'Wir freuen uns auf Ihre Anfrage.',
            badgeText: 'Kontakt',
            bgImage: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1800&q=85',
            primaryCta: { label: 'Jetzt buchen', href: '/demo/salon/kontakt' },
          },
        },
        {
          ...B, id: 'sl-contact-location', type: 'locationContact',
          data: {
            headline: 'Kontakt & Standort',
            subline: 'Atelier Rose im Belgischen Viertel.',
            badgeText: 'Kontakt',
            introText: 'Fragen zu Leistungen, Gutscheinen oder Terminen beantworten wir persoenlich.',
            image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=900&q=80',
            mapEmbedUrl: '',
            formEnabled: true,
            namePlaceholder: 'Name',
            emailPlaceholder: 'E-Mail',
            messagePlaceholder: 'Nachricht',
            submitLabel: 'Anfrage senden',
            infoCards: [{ icon: 'phone', label: 'Telefon', value: '+49 221 123456' }, { icon: 'mail', label: 'E-Mail', value: 'hello@atelier-rose.de' }],
            primaryCta: { label: 'Anrufen', href: 'tel:+49221123456' },
            secondaryCta: { label: 'Route planen', href: 'https://maps.google.com' },
          },
        },
        {
          ...B, id: 'sl-contact-hours', type: 'openingHours',
          data: {
            headline: 'Oeffnungszeiten',
            subline: 'Termine nach Verfuegbarkeit.',
            badgeText: 'Zeiten',
            days: [{ label: 'Di-Fr', hours: '10:00-19:00', note: 'Termine' }, { label: 'Sa', hours: '09:00-15:00', note: 'nach Buchung' }],
            bookingNote: 'Online-Termine sind jederzeit moeglich.',
            ctaPrimary: { label: 'Buchen', href: '/demo/salon/kontakt' },
          },
        },
        {
          ...B, id: 'sl-contact-faq', type: 'faq',
          data: {
            headline: 'FAQ',
            subline: 'Haeufige Fragen vor dem Termin.',
            badgeText: 'Fragen',
            items: [{ question: 'Wie lange dauert eine Farbberatung?', answer: 'Plane je nach Wunsch 15 bis 30 Minuten ein.' }],
            ctaPrimary: { label: 'Frage stellen', href: '/demo/salon/kontakt' },
          },
        },
      ],
    },
  ],
};
