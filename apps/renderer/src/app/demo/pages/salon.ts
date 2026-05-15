import type { DemoSite } from './types';
import { B, HERO } from './types';

export const salonSite: DemoSite = {
  industry: 'salon',
  industryKey: 'salon',
  defaultStyle: 'classic',
  pages: [
    // ─── 1. HOME ───────────────────────────────────────────────
    {
      slug: '',
      title: 'Startseite',
      sections: [
        {
          ...HERO, type: 'hero', id: 'sl-home-hero',
          data: {
            headline: 'Studio Bellezza – Hair, Beauty & Wellness in Muenchen',
            subline:
              'Ihr Premium-Salon auf der Maximilianstrasse. Erleben Sie erstklassige Haarpflege, professionelle Kosmetik und wohltuende Wellness-Behandlungen in stilvollem Ambiente – von zertifizierten Experten, die Ihre Schoenheit perfekt in Szene setzen.',
            badgeText: 'Premium Salon Muenchen',
            bgImage:
              'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
            ratingText: '4.9 / 5 – ueber 850 Bewertungen auf Google',
            trustItems: [
              'Top-Produkte von Olaplex, Kerastase & Dermalogica',
              'Zertifizierte Stylisten & Kosmetikerinnen',
              'Online-Buchung rund um die Uhr',
            ],
            primaryCta: { label: 'Termin buchen', href: '/demo/salon/kontakt' },
            secondaryCta: { label: 'Services entdecken', href: '/demo/salon/services' },
          },
        },
        {
          ...B, type: 'serviceMenu', id: 'sl-home-services',
          data: {
            headline: 'Unsere Welt der Schoenheit',
            subline: 'Von Hairstyling ueber Beauty bis Wellness – alles unter einem Dach',
            categories: [
              {
                title: 'Haare',
                text: 'Ob frischer Schnitt, leuchtende Farbe oder glamouroese Hochsteckfrisur – unsere Stylisten kreieren Looks, die begeistern und Ihre Persoenlichkeit unterstreichen.',
                image:
                  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80',
                services: [
                  'Damen- & Herrenhaarschnitte',
                  'Balayage & Coloring',
                  'Keratin-Glaettung',
                  'Extensions & Verdichtung',
                ],
                cta: { label: 'Alle Hair-Services', href: '/demo/salon/services#haare' },
              },
              {
                title: 'Beauty & Kosmetik',
                text: 'Hochwertige Gesichtsbehandlungen, Wimpern-Lifting und professionelles Make-up – wir bringen Ihre natuerliche Schoenheit zum Strahlen.',
                image:
                  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80',
                services: [
                  'Classic & Anti-Aging Facials',
                  'Microneedling',
                  'Wimpern- & Brauen-Styling',
                  'Professionelles Make-up',
                ],
                cta: { label: 'Alle Beauty-Services', href: '/demo/salon/services#beauty' },
              },
              {
                title: 'Wellness & Massage',
                text: 'Goennen Sie sich eine Auszeit vom Alltag. Unsere Massagen und Wellness-Rituale sorgen fuer tiefe Entspannung und neue Energie.',
                image:
                  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80',
                services: [
                  'Aroma-Massage',
                  'Hot-Stone-Massage',
                  'Kopf-Nacken-Schulter-Massage',
                ],
                cta: { label: 'Alle Wellness-Angebote', href: '/demo/salon/services#wellness' },
              },
            ],
          },
        },
        {
          ...B, type: 'testimonials', id: 'sl-home-testimonials',
          data: {
            headline: 'Das sagen unsere Gaeste',
            subline: 'Echte Bewertungen – echte Ergebnisse',
            items: [
              {
                name: 'Laura M.',
                date: '2026-03-12',
                rating: 5,
                title: 'Balayage Traum!',
                text: 'Sophia hat mir das schoenste Balayage gemacht, das ich je hatte. Die Farbe ist natuerlich, der Uebergang perfekt – und selbst nach 8 Wochen sieht es noch fantastisch aus. Absolut Premium-Qualitaet!',
                service: 'Balayage bei Sophia',
              },
              {
                name: 'Anna K.',
                date: '2026-02-28',
                rating: 5,
                title: 'Braut-Styling der Extraklasse',
                text: 'Maria und ihr Team haben mein Braut-Styling uebernommen – von der Probe bis zum grossen Tag. Ich habe mich wie eine Prinzessin gefuehlt. Die Hochsteckfrisur hielt den ganzen Abend perfekt. Danke fuer diesen unvergesslichen Tag!',
                service: 'Braut-Komplett-Paket',
              },
              {
                name: 'Claudia R.',
                date: '2026-01-15',
                rating: 5,
                title: 'Haut wie neu',
                text: 'Nina hat eine Hydrafacial-Behandlung bei mir durchgefuehrt und das Ergebnis ist unglaublich. Meine Haut strahlt, die Poren sind verfeinert und das Hautbild ist so ebenmassig wie nie. Absolut empfehlenswert!',
                service: 'Hydrafacial Premium bei Nina',
              },
            ],
          },
        },
        {
          ...B, type: 'bookingCta', id: 'sl-home-booking',
          data: {
            headline: 'Bereit fuer Ihren neuen Look?',
            subline: 'Buchen Sie jetzt Ihren Wunschtermin – einfach, schnell und bequem.',
            options: [
              {
                type: 'online',
                label: 'Online buchen',
                description: '24/7 Termine buchen ueber unser Buchungssystem',
                href: '/demo/salon/kontakt',
                icon: 'calendar',
              },
              {
                type: 'phone',
                label: 'Anrufen',
                description: '+49 89 2345 6789 – Di bis Sa erreichbar',
                href: 'tel:+498923456789',
                icon: 'phone',
              },
              {
                type: 'whatsapp',
                label: 'WhatsApp',
                description: 'Schnell & unkompliziert per WhatsApp anfragen',
                href: 'https://wa.me/498923456789',
                icon: 'message',
              },
            ],
          },
        },
      ],
    },

    // ─── 2. SERVICES & PREISE ──────────────────────────────────
    {
      slug: 'services',
      title: 'Services & Preise',
      sections: [
        {
          ...HERO, type: 'hero', id: 'sl-srv-hero',
          data: {
            headline: 'Services & Preise – Ihr Weg zu perfekter Schoenheit',
            subline:
              'Entdecken Sie unser vollstaendiges Angebot an Hair-, Beauty- und Wellness-Behandlungen. Transparente Preise, Premium-Produkte und individuelle Beratung – bei Studio Bellezza sind Sie in den besten Haenden.',
            bgImage:
              'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1800&q=85',
            primaryCta: { label: 'Jetzt Termin buchen', href: '/demo/salon/kontakt' },
          },
        },
        {
          ...B, type: 'serviceMenu', id: 'sl-srv-menu',
          data: {
            headline: 'Alle Services im Ueberblick',
            subline: 'Vier Bereiche – ein Ziel: Sie strahlen zu lassen',
            categories: [
              {
                title: 'Haare',
                text: 'Schnitt, Farbe, Styling und Pflege – unsere Haarexperten verwandeln Ihre Wuensche in perfekte Looks mit Premium-Produkten von Olaplex und Kerastase.',
                image:
                  'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=900&q=80',
                services: [
                  'Damen- & Herrenschnitt',
                  'Balayage & Highlights',
                  'Keratin-Glaettung & Botox',
                  'Tape-In & Bonding Extensions',
                ],
                cta: { label: 'Preise Haare', href: '#sl-srv-prices' },
              },
              {
                title: 'Beauty & Kosmetik',
                text: 'Von klassischen Facials ueber Anti-Aging bis Microneedling – modernste Technologien und hochwertige Wirkstoffe fuer Ihr strahlendes Hautbild.',
                image:
                  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=900&q=80',
                services: [
                  'Classic Facial',
                  'Anti-Aging Intensivpflege',
                  'Microneedling',
                  'Wimpern-Lifting & Lash Tint',
                ],
                cta: { label: 'Preise Kosmetik', href: '#sl-srv-prices' },
              },
              {
                title: 'Wellness & Massage',
                text: 'Tiefenentspannung fuer Koerper und Geist. Unsere Wellness-Behandlungen sind die perfekte Ergaenzung zu Ihrem Beauty-Programm.',
                image:
                  'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=900&q=80',
                services: [
                  'Aroma-Massage 60 Min',
                  'Hot-Stone-Massage 90 Min',
                  'Kopf-Nacken-Schulter 30 Min',
                ],
                cta: { label: 'Preise Wellness', href: '#sl-srv-prices' },
              },
              {
                title: 'Braut & Event',
                text: 'Ihr perfekter Auftritt fuer den schoensten Tag Ihres Lebens. Wir begleiten Sie von der Probe bis zum grossen Moment – mit Liebe zum Detail.',
                image:
                  'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80',
                services: [
                  'Braut-Styling komplett',
                  'Probe-Styling & Beratung',
                  'Event- & Gala-Frisuren',
                  'Braut-Make-up',
                ],
                cta: { label: 'Braut-Pakete', href: '#sl-srv-packages' },
              },
            ],
          },
        },
        {
          ...B, type: 'priceList', id: 'sl-srv-prices',
          data: {
            headline: 'Unsere Preise',
            subline: 'Transparent & fair – Premium-Qualitaet hat ihren Wert',
            note: 'Alle Preise inkl. MwSt. Individuelle Beratung vor jeder Behandlung.',
            categories: [
              {
                title: 'Damen Haarschnitt & Styling',
                items: [
                  { name: 'Waschen, Schneiden & Styling', price: 'ab 79 €', duration: '60 Min' },
                  { name: 'Balayage / Highlights', price: 'ab 189 €', duration: '120–180 Min' },
                  { name: 'Keratin-Glaettung (Olaplex)', price: 'ab 249 €', duration: '150 Min' },
                  { name: 'Tape-In Extensions (komplett)', price: 'ab 399 €', duration: '180 Min' },
                ],
              },
              {
                title: 'Herren',
                items: [
                  { name: 'Herrenschnitt & Styling', price: 'ab 45 €', duration: '30 Min' },
                  { name: 'Bart-Trim & Kontur', price: 'ab 25 €', duration: '15 Min' },
                  { name: 'Kopfhaut-Treatment', price: 'ab 59 €', duration: '45 Min' },
                ],
              },
              {
                title: 'Kosmetik & Gesichtspflege',
                items: [
                  { name: 'Classic Facial', price: '89 €', duration: '60 Min' },
                  { name: 'Anti-Aging Intensivpflege', price: '129 €', duration: '75 Min' },
                  { name: 'Microneedling', price: '179 €', duration: '60 Min' },
                  { name: 'Wimpern-Lifting inkl. Tint', price: '69 €', duration: '45 Min' },
                ],
              },
              {
                title: 'Wellness & Massage',
                items: [
                  { name: 'Aroma-Massage', price: '99 €', duration: '60 Min' },
                  { name: 'Hot-Stone-Massage', price: '139 €', duration: '90 Min' },
                  { name: 'Kopf-Nacken-Schulter-Massage', price: '59 €', duration: '30 Min' },
                ],
              },
            ],
          },
        },
        {
          ...B, type: 'treatmentDetail', id: 'sl-srv-treatments',
          data: {
            headline: 'Unsere Signature-Treatments',
            subline: 'Drei Behandlungen, die begeistern – im Detail erklaert',
            treatments: [
              {
                title: 'Olaplex Balayage',
                description:
                  'Unser meistgebuchtes Treatment: Natuerliche, sonnengekuesste Straehnen mit Olaplex-Schutz fuer maximale Farbbrillanz bei minimaler Haarbelastung. Das Ergebnis: ein nahtloser, lebendiger Farbverlauf, der monatelang haelt.',
                image:
                  'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=900&q=80',
                duration: '120–180 Min',
                price: 'ab 189 €',
                steps: [
                  'Persoenliche Farbberatung & Analyse des Haartyps',
                  'Olaplex Nr. 1 Bond Multiplier Vorbehandlung',
                  'Freihand-Balayage-Technik mit Premium-Farbe',
                  'Olaplex Nr. 2 Bond Perfector Einwirkzeit',
                  'Glossing fuer extra Glanz & Farbversiegelung',
                  'Styling & Pflege-Tipps fuer zu Hause',
                ],
                careTips: [
                  'Sulfatfreies Shampoo verwenden',
                  'Olaplex Nr. 3 woechentlich als Kur',
                  'Hitzeschutz vor jedem Styling',
                  'Auffrischung alle 8–12 Wochen empfohlen',
                ],
              },
              {
                title: 'Hydrafacial Premium',
                description:
                  'Die Hollywood-Gesichtsbehandlung fuer sofort sichtbare Ergebnisse. Tiefenreinigung, sanftes Peeling, Extraktion und intensive Wirkstoffinfusion in einer Behandlung – fuer strahlende, pralle Haut ohne Ausfallzeit.',
                image:
                  'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&q=80',
                duration: '75 Min',
                price: '149 €',
                steps: [
                  'Hautanalyse mit digitalem Skin Scanner',
                  'Tiefenreinigung & Lymphdrainage',
                  'Sanftes Vortex-Peeling (Milch- & Salicylsaeure)',
                  'Schmerzfreie Vortex-Extraktion',
                  'Wirkstoff-Infusion (Hyaluron, Antioxidantien, Peptide)',
                  'LED-Lichttherapie & Abschlusspflege',
                ],
                careTips: [
                  '24h kein Make-up auftragen',
                  'SPF 50 Sonnenschutz taeglich',
                  'Serum-Routine fuer langanhaltende Ergebnisse',
                  'Empfohlen alle 4–6 Wochen',
                ],
              },
              {
                title: 'Braut-Komplett-Paket',
                description:
                  'Ihr Rundum-Sorglos-Paket fuer den schoensten Tag. Vom Probe-Styling ueber das Braut-Make-up bis zur perfekten Hochsteckfrisur – wir kuemmern uns um jedes Detail, damit Sie strahlen.',
                image:
                  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=900&q=80',
                duration: 'Probe: 90 Min / Hochzeitstag: 180 Min',
                price: '489 €',
                steps: [
                  'Ausfuehrliches Kennenlern-Gespraech & Stil-Beratung',
                  'Probe-Styling & Probe-Make-up (6–8 Wochen vorher)',
                  'Pflege-Kur-Termin 1 Woche vor der Hochzeit',
                  'Braut-Styling am Hochzeitstag (Frisur & Make-up)',
                  'Notfall-Kit fuer Nachbesserungen waehrend der Feier',
                  'Optional: Styling fuer Brautjungfern & Trauzeugin',
                ],
                careTips: [
                  'Keine neuen Farb-Experimente 4 Wochen vorher',
                  'Regelmaessige Haarkuren vor dem grossen Tag',
                  'Inspirationsbilder zum Probe-Termin mitbringen',
                  'Frueh buchen – Brauttermine sind schnell vergeben',
                ],
              },
            ],
          },
        },
        {
          ...B, type: 'packages', id: 'sl-srv-packages',
          data: {
            headline: 'Unsere Pakete – Mehr Schoenheit zum Vorteilspreis',
            subline: 'Kombinieren Sie Ihre Lieblings-Treatments und sparen Sie',
            items: [
              {
                title: 'Glow-Up Paket',
                description:
                  'Die perfekte Kombination aus Hair & Skin: Balayage oder Glossing plus Hydrafacial – fuer den ultimativen Frische-Kick von Kopf bis Fuss.',
                price: '229 €',
                originalPrice: '278 €',
                includes: [
                  'Balayage oder Glossing',
                  'Hydrafacial Classic',
                  'Styling & Pflege-Beratung',
                ],
                image:
                  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=80',
                cta: { label: 'Glow-Up buchen', href: '/demo/salon/kontakt' },
              },
              {
                title: 'Braut-Paket',
                description:
                  'Das komplette Bridal-Erlebnis: Probe-Styling, Make-up-Test und das volle Programm am Hochzeitstag – fuer Ihren perfekten Auftritt.',
                price: '489 €',
                originalPrice: '579 €',
                includes: [
                  'Probe-Styling & Probe-Make-up',
                  'Pflegekur eine Woche vor der Hochzeit',
                  'Braut-Styling am Tag (Frisur + Make-up)',
                  'Notfall-Kit fuer die Feier',
                ],
                image:
                  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=80',
                cta: { label: 'Braut-Paket anfragen', href: '/demo/salon/kontakt' },
              },
              {
                title: "Men's Executive Paket",
                description:
                  'Premium-Pflege fuer den modernen Mann: Haarschnitt, Bartpflege und eine revitalisierende Gesichtsbehandlung – in 90 Minuten rundum gepflegt.',
                price: '149 €',
                originalPrice: '183 €',
                includes: [
                  'Herrenschnitt & Styling',
                  'Bart-Trim & Hot-Towel Treatment',
                  'Classic Facial fuer Maenner',
                ],
                image:
                  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=80',
                cta: { label: 'Executive buchen', href: '/demo/salon/kontakt' },
              },
            ],
          },
        },
      ],
    },

    // ─── 3. TEAM ───────────────────────────────────────────────
    {
      slug: 'team',
      title: 'Unser Team',
      sections: [
        {
          ...HERO, type: 'hero', id: 'sl-team-hero',
          data: {
            headline: 'Unser Team – Leidenschaft trifft Expertise',
            subline:
              'Hinter Studio Bellezza steht ein Team aus erfahrenen Stylisten, Kosmetikerinnen und Wellness-Experten. Lernen Sie die Menschen kennen, die Ihre Schoenheit zu ihrer Mission machen.',
            bgImage:
              'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1800&q=85',
            primaryCta: { label: 'Team kennenlernen', href: '#sl-team-members' },
          },
        },
        {
          ...B, type: 'teamShowcase', id: 'sl-team-members',
          data: {
            headline: 'Die Gesichter von Studio Bellezza',
            subline: 'Kreativ, erfahren und mit Herz dabei',
            members: [
              {
                name: 'Maria Bellezza',
                role: 'Inhaberin & Creative Director',
                bio: 'Maria gruendete Studio Bellezza vor ueber 20 Jahren mit einer Vision: Premium-Qualitaet in persoenlicher Atmosphaere. Als ausgebildete Friseurmeisterin und internationale Trainerin bringt sie Trends aus Mailand, Paris und New York nach Muenchen. Ihr Auge fuer Details und ihre Leidenschaft fuer Perfektion praegen den Stil des gesamten Salons.',
                image:
                  'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=80',
                specialties: [
                  'Creative Coloring',
                  'Braut-Styling',
                  'Salon Management',
                  'Internationale Trends',
                ],
                bookingCta: { label: 'Bei Maria buchen', href: '/demo/salon/kontakt' },
              },
              {
                name: 'Sophia Kraus',
                role: 'Senior Stylistin – Balayage-Spezialistin',
                bio: 'Sophia ist unsere Balayage-Queen. Mit ueber 8 Jahren Erfahrung und zahlreichen Weiterbildungen bei Olaplex und Wella beherrscht sie die Freihand-Technik wie keine andere. Ihre Arbeiten sind regelmaessig auf unserem Instagram zu sehen – und immer ausgebucht.',
                image:
                  'https://images.unsplash.com/photo-1595959183082-7b570b7e1e6b?w=900&q=80',
                specialties: [
                  'Balayage & Ombre',
                  'Olaplex Treatments',
                  'Blonde-Spezialistin',
                  'Curly Hair',
                ],
                bookingCta: { label: 'Bei Sophia buchen', href: '/demo/salon/kontakt' },
              },
              {
                name: 'Lukas Meier',
                role: 'Barber & Men\'s Specialist',
                bio: 'Lukas verbindet klassische Barbier-Kunst mit modernem Maennerstyling. Ob Skin Fade, Pompadour oder gepflegter Business-Look – bei Lukas ist jeder Mann in besten Haenden. Sein Motto: Ein guter Haarschnitt ist das beste Accessoire.',
                image:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80',
                specialties: [
                  'Skin Fade & Taper',
                  'Bart-Design',
                  'Hot-Towel Shave',
                  'Herren-Styling',
                ],
                bookingCta: { label: 'Bei Lukas buchen', href: '/demo/salon/kontakt' },
              },
              {
                name: 'Nina Chen',
                role: 'Kosmetikerin & Skin Expert',
                bio: 'Nina ist unsere Hautexpertin mit Leidenschaft. Ausgebildet in Seoul und Muenchen, verbindet sie das Beste aus asiatischer und europaeischer Hautpflege. Mit ueber 6 Jahren Erfahrung in Hydrafacial und Microneedling erzielt sie sichtbare Ergebnisse, die begeistern.',
                image:
                  'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=900&q=80',
                specialties: [
                  'Hydrafacial',
                  'Microneedling',
                  'Anti-Aging Treatments',
                  'K-Beauty Protocols',
                ],
                bookingCta: { label: 'Bei Nina buchen', href: '/demo/salon/kontakt' },
              },
              {
                name: 'Emma Vogt',
                role: 'Junior Stylistin',
                bio: 'Emma ist unser aufstrebendes Talent. Frisch von der Meisterschule, bringt sie frischen Wind und moderne Techniken ins Team. Unter der Anleitung von Maria und Sophia perfektioniert sie taeglich ihr Handwerk – mit spuerbarer Begeisterung fuer jeden Kunden.',
                image:
                  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80',
                specialties: [
                  'Schnitt & Styling',
                  'Flechtfrisuren',
                  'Blow-Dry Styling',
                ],
                bookingCta: { label: 'Bei Emma buchen', href: '/demo/salon/kontakt' },
              },
            ],
          },
        },
        {
          ...B, type: 'expertiseGrid', id: 'sl-team-expertise',
          data: {
            headline: 'Unsere Expertise',
            subline: 'Spezialisiert auf das, was wir am besten koennen',
            areas: [
              {
                title: 'Balayage & Coloring',
                description: 'Freihand-Farbtechniken fuer natuerliche, lebendige Ergebnisse. Von sanften Straehnen bis hin zu kreativen Fashion-Colors.',
                icon: 'palette',
              },
              {
                title: 'Keratin & Glaettung',
                description: 'Langanhaltende Glaettung und Reparatur mit Olaplex und Keratin – fuer geschmeidiges, gesundes Haar ohne taeglichen Aufwand.',
                icon: 'sparkles',
              },
              {
                title: 'Bridal & Events',
                description: 'Traumhafte Braut-Frisuren und glamouroese Event-Looks. Persoenliche Beratung, Probe-Styling und perfekte Umsetzung am grossen Tag.',
                icon: 'heart',
              },
              {
                title: 'Anti-Aging Skincare',
                description: 'Modernste Treatments wie Hydrafacial und Microneedling fuer jugendliche, strahlende Haut. Individuelle Protokolle fuer jedes Hautbild.',
                icon: 'shield',
              },
              {
                title: 'Barber Art',
                description: 'Klassische und moderne Herrenschnitte, praezise Bart-Designs und traditionelle Hot-Towel Shaves – Barbering auf hoechstem Niveau.',
                icon: 'scissors',
              },
              {
                title: 'Wellness Massage',
                description: 'Ganzheitliche Entspannung durch Aroma-, Hot-Stone- und Teilkoerpermassagen. Die perfekte Ergaenzung zu jedem Beauty-Besuch.',
                icon: 'leaf',
              },
            ],
          },
        },
      ],
    },

    // ─── 4. GALERIE & ERGEBNISSE ───────────────────────────────
    {
      slug: 'galerie',
      title: 'Galerie & Ergebnisse',
      sections: [
        {
          ...HERO, type: 'hero', id: 'sl-gal-hero',
          data: {
            headline: 'Galerie – Unsere Arbeiten sprechen fuer sich',
            subline:
              'Von atemberaubenden Balayage-Transformationen ueber strahlende Skin-Ergebnisse bis zu eleganten Braut-Looks: Lassen Sie sich von unserer Arbeit inspirieren.',
            bgImage:
              'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=1800&q=85',
            primaryCta: { label: 'Termin buchen', href: '/demo/salon/kontakt' },
            secondaryCta: { label: 'Mehr auf Instagram', href: '#' },
          },
        },
        {
          ...B, type: 'beforeAfter', id: 'sl-gal-beforeafter',
          data: {
            headline: 'Vorher & Nachher',
            subline: 'Echte Transformationen – echte Ergebnisse',
            items: [
              {
                title: 'Balayage Transformation',
                text: 'Von einfarbigem Dunkelbraun zu einem lebendigen, mehrdimensionalen Balayage. Drei Sitzungen mit Olaplex-Schutz fuer gesundes, strahlendes Haar.',
                beforeImage:
                  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80',
                afterImage:
                  'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=900&q=80',
                category: 'Hair',
                caption: 'Balayage by Sophia – 3 Sessions ueber 6 Monate',
              },
              {
                title: 'Keratin-Glaettung',
                text: 'Widerspenstiges, krauses Haar verwandelt in seidig glattes, pflegeleichtes Haar. Die Keratin-Behandlung haelt bis zu 4 Monate und reduziert die Styling-Zeit um 70%.',
                beforeImage:
                  'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&q=80',
                afterImage:
                  'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=900&q=80',
                category: 'Hair',
                caption: 'Keratin Treatment by Maria – Ergebnis nach einer Sitzung',
              },
              {
                title: 'Braut-Styling',
                text: 'Eine romantische Hochsteckfrisur mit eingearbeiteten Blumen und Perlen, kombiniert mit einem natuerlichen Braut-Make-up. Der perfekte Look fuer den schoensten Tag.',
                beforeImage:
                  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80',
                afterImage:
                  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=900&q=80',
                category: 'Events',
                caption: 'Bridal Styling by Maria & Emma – Hochzeit im Schloss Nymphenburg',
              },
            ],
          },
        },
        {
          ...B, type: 'gallery', id: 'sl-gal-gallery',
          data: {
            headline: 'Impressionen aus dem Studio',
            subline: 'Ein Blick hinter die Kulissen und auf unsere schoensten Arbeiten',
            categories: ['Hair', 'Beauty', 'Studio', 'Events'],
            images: [
              { src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80', alt: 'Salon Interior Empfang', category: 'Studio' },
              { src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80', alt: 'Balayage Ergebnis', category: 'Hair' },
              { src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80', alt: 'Facial Treatment', category: 'Beauty' },
              { src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80', alt: 'Styling am Platz', category: 'Studio' },
              { src: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=900&q=80', alt: 'Blonde Highlights', category: 'Hair' },
              { src: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=900&q=80', alt: 'Nagelpflege Detail', category: 'Beauty' },
              { src: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=900&q=80', alt: 'Braut Hochsteckfrisur', category: 'Events' },
              { src: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=900&q=80', alt: 'Team bei der Arbeit', category: 'Studio' },
              { src: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=900&q=80', alt: 'Glattes Haar nach Keratin', category: 'Hair' },
              { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80', alt: 'Braut Getting Ready', category: 'Events' },
            ],
          },
        },
      ],
    },

    // ─── 5. KONTAKT & BUCHUNG ──────────────────────────────────
    {
      slug: 'kontakt',
      title: 'Kontakt & Buchung',
      sections: [
        {
          ...HERO, type: 'hero', id: 'sl-contact-hero',
          data: {
            headline: 'Kontakt & Buchung – Wir freuen uns auf Sie',
            subline:
              'Buchen Sie Ihren Wunschtermin online, telefonisch oder per WhatsApp. Unser Team beraet Sie gerne persoenlich zu allen Services und Behandlungen.',
            bgImage:
              'https://images.unsplash.com/photo-1633681122956-0fddfa640b39?w=1800&q=85',
            primaryCta: { label: 'Jetzt online buchen', href: '#sl-contact-booking' },
            secondaryCta: { label: 'Anrufen: +49 89 2345 6789', href: 'tel:+498923456789' },
          },
        },
        {
          ...B, type: 'bookingCta', id: 'sl-contact-booking',
          data: {
            headline: 'Termin buchen',
            subline: 'Waehlen Sie Ihren bevorzugten Buchungsweg',
            options: [
              {
                type: 'online',
                label: 'Online buchen',
                description: 'Rund um die Uhr Ihren Wunschtermin waehlen. Schnell, einfach und mit sofortiger Bestaetigung.',
                href: '#',
                icon: 'calendar',
              },
              {
                type: 'phone',
                label: 'Telefonisch',
                description: '+49 89 2345 6789 – Dienstag bis Samstag waehrend der Oeffnungszeiten.',
                href: 'tel:+498923456789',
                icon: 'phone',
              },
              {
                type: 'whatsapp',
                label: 'WhatsApp',
                description: 'Schreiben Sie uns eine Nachricht – wir antworten schnellstmoeglich.',
                href: 'https://wa.me/498923456789',
                icon: 'message',
              },
            ],
          },
        },
        {
          ...B, type: 'openingHours', id: 'sl-contact-hours',
          data: {
            headline: 'Oeffnungszeiten',
            subline: 'Wir sind fuer Sie da',
            hours: [
              { day: 'Montag', time: 'Geschlossen' },
              { day: 'Dienstag', time: '09:00 – 20:00 Uhr' },
              { day: 'Mittwoch', time: '09:00 – 20:00 Uhr' },
              { day: 'Donnerstag', time: '09:00 – 20:00 Uhr' },
              { day: 'Freitag', time: '09:00 – 20:00 Uhr' },
              { day: 'Samstag', time: '09:00 – 18:00 Uhr' },
              { day: 'Sonntag', time: 'Geschlossen' },
            ],
            note: 'Brauttermine und Sondertermine nach Vereinbarung – auch ausserhalb der regulaeren Oeffnungszeiten.',
          },
        },
        {
          ...B, type: 'locationContact', id: 'sl-contact-location',
          data: {
            headline: 'So finden Sie uns',
            subline: 'Im Herzen von Muenchen – Maximilianstrasse',
            address: {
              name: 'Studio Bellezza',
              street: 'Maximilianstrasse 15',
              zip: '80539',
              city: 'Muenchen',
              phone: '+49 89 2345 6789',
              email: 'info@studio-bellezza.de',
            },
            mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.5!2d11.5820!3d48.1392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDA4JzIxLjEiTiAxMcKwMzQnNTUuMiJF!5e0!3m2!1sde!2sde!4v1',
            form: {
              headline: 'Schreiben Sie uns',
              fields: [
                { name: 'name', label: 'Ihr Name', type: 'text', required: true },
                { name: 'email', label: 'E-Mail-Adresse', type: 'email', required: true },
                { name: 'phone', label: 'Telefon (optional)', type: 'tel', required: false },
                { name: 'service', label: 'Gewuenschter Service', type: 'select', options: ['Haare', 'Kosmetik', 'Wellness', 'Braut & Event', 'Sonstiges'], required: true },
                { name: 'message', label: 'Ihre Nachricht', type: 'textarea', required: true },
              ],
              submitLabel: 'Nachricht senden',
              privacyNote: 'Mit dem Absenden stimmen Sie unserer Datenschutzerklaerung zu.',
            },
          },
        },
        {
          ...B, type: 'faq', id: 'sl-contact-faq',
          data: {
            headline: 'Haeufig gestellte Fragen',
            subline: 'Antworten auf die wichtigsten Fragen rund um Ihren Besuch',
            items: [
              {
                question: 'Wie kann ich einen Termin absagen oder verschieben?',
                answer: 'Bitte sagen Sie Ihren Termin mindestens 24 Stunden vorher ab – telefonisch, per WhatsApp oder ueber das Online-Buchungssystem. Bei kurzfristigen Absagen unter 24 Stunden behalten wir uns vor, 50% des Behandlungspreises zu berechnen.',
              },
              {
                question: 'Was passiert bei Allergien oder Unvertraeglichkeiten?',
                answer: 'Ihre Sicherheit steht an erster Stelle. Bitte informieren Sie uns vorab ueber bekannte Allergien oder Empfindlichkeiten. Wir fuehren vor jeder chemischen Behandlung (Farbe, Keratin) einen Vertraeglichkeitstest durch und verwenden auf Wunsch hypoallergene Produkte.',
              },
              {
                question: 'Gibt es Parkmoeglichkeiten in der Naehe?',
                answer: 'Ja, direkt um die Ecke befindet sich das Parkhaus an der Maximilianstrasse (Einfahrt Falckenbergstrasse). Alternativ sind wir hervorragend mit den oeffentlichen Verkehrsmitteln erreichbar: U-Bahn Lehel (U4/U5) ist nur 3 Gehminuten entfernt.',
              },
              {
                question: 'Bieten Sie Gutscheine an?',
                answer: 'Ja! Unsere Geschenkgutscheine sind das perfekte Geschenk fuer jeden Anlass. Sie sind in beliebiger Hoehe oder fuer bestimmte Behandlungen erhaeltlich – direkt im Salon oder ueber unseren Online-Shop. Gutscheine sind 3 Jahre gueltig.',
              },
              {
                question: 'Wie lange muss ich auf einen Termin warten?',
                answer: 'Fuer Standard-Treatments (Schnitt, Facial, Massage) koennen wir in der Regel innerhalb von 3–5 Werktagen einen Termin anbieten. Fuer Balayage, Extensions oder Braut-Pakete empfehlen wir eine Buchung 2–4 Wochen im Voraus, da diese Termine sehr gefragt sind.',
              },
            ],
          },
        },
      ],
    },
  ],
};
