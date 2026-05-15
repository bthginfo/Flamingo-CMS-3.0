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
            headline: 'Studio Bellezza – Hair, Beauty & Wellness in München',
            subline:
              'Ihr Premium-Salon auf der MaximilianStraße. Erleben Sie erstklassige Haarpflege, professionelle Kosmetik und wohltuende Wellness-Behandlungen in stilvollem Ambiente – von zertifizierten Experten, die Ihre Schönheit perfekt in Szene setzen.',
            badgeText: 'Premium Salon München',
            bgImage:
              'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
            ratingText: '4.9 / 5 – über 850 Bewertungen auf Google',
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
            headline: 'Unsere Welt der Schönheit',
            subline: 'Von Hairstyling über Beauty bis Wellness – alles unter einem Dach',
            categories: [
              {
                title: 'Haare',
                text: 'Ob frischer Schnitt, leuchtende Farbe oder glamouröse Hochsteckfrisur – unsere Stylisten kreieren Looks, die begeistern und Ihre persönlichkeit unterstreichen.',
                image:
                  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80',
                services: [
                  'Damen- & Herrenhaarschnitte',
                  'Balayage & Coloring',
                  'Keratin-Glättung',
                  'Extensions & Verdichtung',
                ],
                cta: { label: 'Alle Hair-Services', href: '/demo/salon/services#haare' },
              },
              {
                title: 'Beauty & Kosmetik',
                text: 'Hochwertige Gesichtsbehandlungen, Wimpern-Lifting und professionelles Make-up – wir bringen Ihre natürliche Schönheit zum Strahlen.',
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
                text: 'Gönnen Sie sich eine Auszeit vom Alltag. Unsere Massagen und Wellness-Rituale sorgen für tiefe Entspannung und neue Energie.',
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
            headline: 'Das sagen unsere Gäste',
            subline: 'Echte Bewertungen – echte Ergebnisse',
            items: [
              {
                name: 'Laura M.',
                date: '2026-03-12',
                rating: 5,
                title: 'Balayage Traum!',
                text: 'Sophia hat mir das schönste Balayage gemacht, das ich je hatte. Die Farbe ist natürlich, der Übergang perfekt – und selbst nach 8 Wochen sieht es noch fantastisch aus. Absolut Premium-Qualität!',
                service: 'Balayage bei Sophia',
              },
              {
                name: 'Anna K.',
                date: '2026-02-28',
                rating: 5,
                title: 'Braut-Styling der Extraklasse',
                text: 'Maria und ihr Team haben mein Braut-Styling Übernommen – von der Probe bis zum großen Tag. Ich habe mich wie eine Prinzessin gefühlt. Die Hochsteckfrisur hielt den ganzen Abend perfekt. Danke für diesen unvergesslichen Tag!',
                service: 'Braut-Komplett-Paket',
              },
              {
                name: 'Claudia R.',
                date: '2026-01-15',
                rating: 5,
                title: 'Haut wie neu',
                text: 'Nina hat eine Hydrafacial-Behandlung bei mir durchgeführt und das Ergebnis ist unglaublich. Meine Haut strahlt, die Poren sind verfeinert und das Hautbild ist so ebenmäßig wie nie. Absolut empfehlenswert!',
                service: 'Hydrafacial Premium bei Nina',
              },
            ],
          },
        },
        {
          ...B, type: 'bookingCta', id: 'sl-home-booking',
          data: {
            headline: 'Bereit für Ihren neuen Look?',
            subline: 'Buchen Sie jetzt Ihren Wunschtermin – einfach, schnell und bequem.',
            options: [
              {
                type: 'online',
                label: 'Online buchen',
                description: '24/7 Termine buchen über unser Buchungssystem',
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
            headline: 'Services & Preise – Ihr Weg zu perfekter Schönheit',
            subline:
              'Entdecken Sie unser vollständiges Angebot an Hair-, Beauty- und Wellness-Behandlungen. Transparente Preise, Premium-Produkte und individuelle Beratung – bei Studio Bellezza sind Sie in den besten Händen.',
            bgImage:
              'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1800&q=85',
            primaryCta: { label: 'Jetzt Termin buchen', href: '/demo/salon/kontakt' },
          },
        },
        {
          ...B, type: 'serviceMenu', id: 'sl-srv-menu',
          data: {
            headline: 'Alle Services im Überblick',
            subline: 'Vier Bereiche – ein Ziel: Sie strahlen zu lassen',
            categories: [
              {
                title: 'Haare',
                text: 'Schnitt, Farbe, Styling und Pflege – unsere Haarexperten verwandeln Ihre wünsche in perfekte Looks mit Premium-Produkten von Olaplex und Kerastase.',
                image:
                  'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=900&q=80',
                services: [
                  'Damen- & Herrenschnitt',
                  'Balayage & Highlights',
                  'Keratin-Glättung & Botox',
                  'Tape-In & Bonding Extensions',
                ],
                cta: { label: 'Preise Haare', href: '#sl-srv-prices' },
              },
              {
                title: 'Beauty & Kosmetik',
                text: 'Von klassischen Facials über Anti-Aging bis Microneedling – modernste Technologien und hochwertige Wirkstoffe für Ihr strahlendes Hautbild.',
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
                text: 'Tiefenentspannung für Körper und Geist. Unsere Wellness-Behandlungen sind die perfekte Ergänzung zu Ihrem Beauty-Programm.',
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
                text: 'Ihr perfekter Auftritt für den schönsten Tag Ihres Lebens. Wir begleiten Sie von der Probe bis zum großen Moment – mit Liebe zum Detail.',
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
            subline: 'Transparent & fair – Premium-Qualität hat ihren Wert',
            note: 'Alle Preise inkl. MwSt. Individuelle Beratung vor jeder Behandlung.',
            categories: [
              {
                title: 'Damen Haarschnitt & Styling',
                items: [
                  { name: 'Waschen, Schneiden & Styling', price: 'ab 79 €', duration: '60 Min' },
                  { name: 'Balayage / Highlights', price: 'ab 189 €', duration: '120–180 Min' },
                  { name: 'Keratin-Glättung (Olaplex)', price: 'ab 249 €', duration: '150 Min' },
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
            subline: 'Drei Behandlungen, die begeistern – im Detail erklärt',
            treatments: [
              {
                title: 'Olaplex Balayage',
                description:
                  'Unser meistgebuchtes Treatment: natürliche, sonnengeküsste Strähnen mit Olaplex-Schutz für maximale Farbbrillanz bei minimaler Haarbelastung. Das Ergebnis: ein nahtloser, lebendiger Farbverlauf, der monatelang hält.',
                image:
                  'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=900&q=80',
                duration: '120–180 Min',
                price: 'ab 189 €',
                steps: [
                  'persönliche Farbberatung & Analyse des Haartyps',
                  'Olaplex Nr. 1 Bond Multiplier Vorbehandlung',
                  'Freihand-Balayage-Technik mit Premium-Farbe',
                  'Olaplex Nr. 2 Bond Perfector Einwirkzeit',
                  'Glossing für extra Glanz & Farbversiegelung',
                  'Styling & Pflege-Tipps für zu Hause',
                ],
                careTips: [
                  'Sulfatfreies Shampoo verwenden',
                  'Olaplex Nr. 3 wöchentlich als Kur',
                  'Hitzeschutz vor jedem Styling',
                  'Auffrischung alle 8–12 Wochen empfohlen',
                ],
              },
              {
                title: 'Hydrafacial Premium',
                description:
                  'Die Hollywood-Gesichtsbehandlung für sofort sichtbare Ergebnisse. Tiefenreinigung, sanftes Peeling, Extraktion und intensive Wirkstoffinfusion in einer Behandlung – für strahlende, pralle Haut ohne Ausfallzeit.',
                image:
                  'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&q=80',
                duration: '75 Min',
                price: '149 €',
                steps: [
                  'Hautanalyse mit digitalem Skin Scanner',
                  'Tiefenreinigung & Lymphdrainage',
                  'Sanftes Vortex-Peeling (Milch- & SalicylSäure)',
                  'Schmerzfreie Vortex-Extraktion',
                  'Wirkstoff-Infusion (Hyaluron, Antioxidantien, Peptide)',
                  'LED-Lichttherapie & Abschlusspflege',
                ],
                careTips: [
                  '24h kein Make-up auftragen',
                  'SPF 50 Sonnenschutz Täglich',
                  'Serum-Routine für langanhaltende Ergebnisse',
                  'Empfohlen alle 4–6 Wochen',
                ],
              },
              {
                title: 'Braut-Komplett-Paket',
                description:
                  'Ihr Rundum-Sorglos-Paket für den schönsten Tag. Vom Probe-Styling über das Braut-Make-up bis zur perfekten Hochsteckfrisur – wir kümmern uns um jedes Detail, damit Sie strahlen.',
                image:
                  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=900&q=80',
                duration: 'Probe: 90 Min / Hochzeitstag: 180 Min',
                price: '489 €',
                steps: [
                  'Ausführliches Kennenlern-Gespräch & Stil-Beratung',
                  'Probe-Styling & Probe-Make-up (6–8 Wochen vorher)',
                  'Pflege-Kur-Termin 1 Woche vor der Hochzeit',
                  'Braut-Styling am Hochzeitstag (Frisur & Make-up)',
                  'Notfall-Kit für Nachbesserungen während der Feier',
                  'Optional: Styling für Brautjungfern & Trauzeugin',
                ],
                careTips: [
                  'Keine neuen Farb-Experimente 4 Wochen vorher',
                  'regelmäßige Haarkuren vor dem großen Tag',
                  'Inspirationsbilder zum Probe-Termin mitbringen',
                  'Früh buchen – Brauttermine sind schnell vergeben',
                ],
              },
            ],
          },
        },
        {
          ...B, type: 'packages', id: 'sl-srv-packages',
          data: {
            headline: 'Unsere Pakete – Mehr Schönheit zum Vorteilspreis',
            subline: 'Kombinieren Sie Ihre Lieblings-Treatments und sparen Sie',
            items: [
              {
                title: 'Glow-Up Paket',
                description:
                  'Die perfekte Kombination aus Hair & Skin: Balayage oder Glossing plus Hydrafacial – für den ultimativen Frische-Kick von Kopf bis Fuss.',
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
                  'Das komplette Bridal-Erlebnis: Probe-Styling, Make-up-Test und das volle Programm am Hochzeitstag – für Ihren perfekten Auftritt.',
                price: '489 €',
                originalPrice: '579 €',
                includes: [
                  'Probe-Styling & Probe-Make-up',
                  'Pflegekur eine Woche vor der Hochzeit',
                  'Braut-Styling am Tag (Frisur + Make-up)',
                  'Notfall-Kit für die Feier',
                ],
                image:
                  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=80',
                cta: { label: 'Braut-Paket anfragen', href: '/demo/salon/kontakt' },
              },
              {
                title: "Men's Executive Paket",
                description:
                  'Premium-Pflege für den modernen Mann: Haarschnitt, Bartpflege und eine revitalisierende Gesichtsbehandlung – in 90 Minuten rundum gepflegt.',
                price: '149 €',
                originalPrice: '183 €',
                includes: [
                  'Herrenschnitt & Styling',
                  'Bart-Trim & Hot-Towel Treatment',
                  'Classic Facial für Männer',
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
              'Hinter Studio Bellezza steht ein Team aus erfahrenen Stylisten, Kosmetikerinnen und Wellness-Experten. Lernen Sie die Menschen kennen, die Ihre Schönheit zu ihrer Mission machen.',
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
                bio: 'Maria gründete Studio Bellezza vor über 20 Jahren mit einer Vision: Premium-Qualität in persönlicher Atmosphäre. Als ausgebildete Friseurmeisterin und internationale Trainerin bringt sie Trends aus Mailand, Paris und New York nach München. Ihr Auge für Details und ihre Leidenschaft für Perfektion prägen den Stil des gesamten Salons.',
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
                bio: 'Sophia ist unsere Balayage-Queen. Mit über 8 Jahren Erfahrung und zahlreichen Weiterbildungen bei Olaplex und Wella beherrscht sie die Freihand-Technik wie keine andere. Ihre Arbeiten sind regelmäßig auf unserem Instagram zu sehen – und immer ausgebucht.',
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
                bio: 'Lukas verbindet klassische Barbier-Kunst mit modernem Männerstyling. Ob Skin Fade, Pompadour oder gepflegter Business-Look – bei Lukas ist jeder Mann in besten Händen. Sein Motto: Ein guter Haarschnitt ist das beste Accessoire.',
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
                bio: 'Nina ist unsere Hautexpertin mit Leidenschaft. Ausgebildet in Seoul und München, verbindet sie das Beste aus asiatischer und europäischer Hautpflege. Mit über 6 Jahren Erfahrung in Hydrafacial und Microneedling erzielt sie sichtbare Ergebnisse, die begeistern.',
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
                bio: 'Emma ist unser aufstrebendes Talent. Frisch von der Meisterschule, bringt sie frischen Wind und moderne Techniken ins Team. Unter der Anleitung von Maria und Sophia perfektioniert sie Täglich ihr Handwerk – mit spürbarer Begeisterung für jeden Kunden.',
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
            subline: 'Spezialisiert auf das, was wir am besten können',
            areas: [
              {
                title: 'Balayage & Coloring',
                description: 'Freihand-Farbtechniken für natürliche, lebendige Ergebnisse. Von sanften Strähnen bis hin zu kreativen Fashion-Colors.',
                icon: 'palette',
              },
              {
                title: 'Keratin & Glättung',
                description: 'Langanhaltende Glättung und Reparatur mit Olaplex und Keratin – für geschmeidiges, gesundes Haar ohne Täglichen Aufwand.',
                icon: 'sparkles',
              },
              {
                title: 'Bridal & Events',
                description: 'traumhafte Braut-Frisuren und glamouröse Event-Looks. persönliche Beratung, Probe-Styling und perfekte Umsetzung am großen Tag.',
                icon: 'heart',
              },
              {
                title: 'Anti-Aging Skincare',
                description: 'Modernste Treatments wie Hydrafacial und Microneedling für jugendliche, strahlende Haut. Individuelle Protokolle für jedes Hautbild.',
                icon: 'shield',
              },
              {
                title: 'Barber Art',
                description: 'Klassische und moderne Herrenschnitte, präzise Bart-Designs und traditionelle Hot-Towel Shaves – Barbering auf höchstem Niveau.',
                icon: 'scissors',
              },
              {
                title: 'Wellness Massage',
                description: 'Ganzheitliche Entspannung durch Aroma-, Hot-Stone- und TeilKörpermassagen. Die perfekte Ergänzung zu jedem Beauty-Besuch.',
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
            headline: 'Galerie – Unsere Arbeiten sprechen für sich',
            subline:
              'Von atemberaubenden Balayage-Transformationen über strahlende Skin-Ergebnisse bis zu eleganten Braut-Looks: Lassen Sie sich von unserer Arbeit inspirieren.',
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
                text: 'Von einfarbigem Dunkelbraun zu einem lebendigen, mehrdimensionalen Balayage. Drei Sitzungen mit Olaplex-Schutz für gesundes, strahlendes Haar.',
                beforeImage:
                  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80',
                afterImage:
                  'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=900&q=80',
                category: 'Hair',
                caption: 'Balayage by Sophia – 3 Sessions über 6 Monate',
              },
              {
                title: 'Keratin-Glättung',
                text: 'Widerspenstiges, krauses Haar verwandelt in seidig glattes, pflegeleichtes Haar. Die Keratin-Behandlung hält bis zu 4 Monate und reduziert die Styling-Zeit um 70%.',
                beforeImage:
                  'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&q=80',
                afterImage:
                  'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=900&q=80',
                category: 'Hair',
                caption: 'Keratin Treatment by Maria – Ergebnis nach einer Sitzung',
              },
              {
                title: 'Braut-Styling',
                text: 'Eine romantische Hochsteckfrisur mit eingearbeiteten Blumen und Perlen, kombiniert mit einem natürlichen Braut-Make-up. Der perfekte Look für den schönsten Tag.',
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
            subline: 'Ein Blick hinter die Kulissen und auf unsere schönsten Arbeiten',
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
              'Buchen Sie Ihren Wunschtermin online, telefonisch oder per WhatsApp. Unser Team berät Sie gerne persönlich zu allen Services und Behandlungen.',
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
            subline: 'Wählen Sie Ihren bevorzugten Buchungsweg',
            options: [
              {
                type: 'online',
                label: 'Online buchen',
                description: 'Rund um die Uhr Ihren Wunschtermin Wählen. Schnell, einfach und mit sofortiger Bestätigung.',
                href: '#',
                icon: 'calendar',
              },
              {
                type: 'phone',
                label: 'Telefonisch',
                description: '+49 89 2345 6789 – Dienstag bis Samstag während der Öffnungszeiten.',
                href: 'tel:+498923456789',
                icon: 'phone',
              },
              {
                type: 'whatsapp',
                label: 'WhatsApp',
                description: 'Schreiben Sie uns eine Nachricht – wir antworten schnellstmöglich.',
                href: 'https://wa.me/498923456789',
                icon: 'message',
              },
            ],
          },
        },
        {
          ...B, type: 'openingHours', id: 'sl-contact-hours',
          data: {
            headline: 'Öffnungszeiten',
            subline: 'Wir sind für Sie da',
            hours: [
              { day: 'Montag', time: 'Geschlossen' },
              { day: 'Dienstag', time: '09:00 – 20:00 Uhr' },
              { day: 'Mittwoch', time: '09:00 – 20:00 Uhr' },
              { day: 'Donnerstag', time: '09:00 – 20:00 Uhr' },
              { day: 'Freitag', time: '09:00 – 20:00 Uhr' },
              { day: 'Samstag', time: '09:00 – 18:00 Uhr' },
              { day: 'Sonntag', time: 'Geschlossen' },
            ],
            note: 'Brauttermine und Sondertermine nach Vereinbarung – auch außerhalb der regulären Öffnungszeiten.',
          },
        },
        {
          ...B, type: 'locationContact', id: 'sl-contact-location',
          data: {
            headline: 'So finden Sie uns',
            subline: 'Im Herzen von München – MaximilianStraße',
            address: {
              name: 'Studio Bellezza',
              street: 'MaximilianStraße 15',
              zip: '80539',
              city: 'München',
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
                { name: 'service', label: 'Gewünschter Service', type: 'select', options: ['Haare', 'Kosmetik', 'Wellness', 'Braut & Event', 'Sonstiges'], required: true },
                { name: 'message', label: 'Ihre Nachricht', type: 'textarea', required: true },
              ],
              submitLabel: 'Nachricht senden',
              privacyNote: 'Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu.',
            },
          },
        },
        {
          ...B, type: 'faq', id: 'sl-contact-faq',
          data: {
            headline: 'Häufig gestellte Fragen',
            subline: 'Antworten auf die wichtigsten Fragen rund um Ihren Besuch',
            items: [
              {
                question: 'Wie kann ich einen Termin absagen oder verschieben?',
                answer: 'Bitte sagen Sie Ihren Termin mindestens 24 Stunden vorher ab – telefonisch, per WhatsApp oder über das Online-Buchungssystem. Bei kurzfristigen Absagen unter 24 Stunden behalten wir uns vor, 50% des Behandlungspreises zu berechnen.',
              },
              {
                question: 'Was passiert bei Allergien oder Unverträglichkeiten?',
                answer: 'Ihre Sicherheit steht an erster Stelle. Bitte informieren Sie uns vorab über bekannte Allergien oder Empfindlichkeiten. Wir führen vor jeder chemischen Behandlung (Farbe, Keratin) einen Verträglichkeitstest durch und verwenden auf Wunsch hypoallergene Produkte.',
              },
              {
                question: 'Gibt es Parkmöglichkeiten in der Nähe?',
                answer: 'Ja, direkt um die Ecke befindet sich das Parkhaus an der MaximilianStraße (Einfahrt FalckenbergStraße). Alternativ sind wir hervorragend mit den öffentlichen Verkehrsmitteln erreichbar: U-Bahn Lehel (U4/U5) ist nur 3 Gehminuten entfernt.',
              },
              {
                question: 'Bieten Sie Gutscheine an?',
                answer: 'Ja! Unsere Geschenkgutscheine sind das perfekte Geschenk für jeden Anlass. Sie sind in beliebiger Höhe oder für bestimmte Behandlungen erhältlich – direkt im Salon oder über unseren Online-Shop. Gutscheine sind 3 Jahre Gültig.',
              },
              {
                question: 'Wie lange muss ich auf einen Termin warten?',
                answer: 'für Standard-Treatments (Schnitt, Facial, Massage) können wir in der Regel innerhalb von 3–5 Werktagen einen Termin anbieten. für Balayage, Extensions oder Braut-Pakete empfehlen wir eine Buchung 2–4 Wochen im Voraus, da diese Termine sehr gefragt sind.',
              },
            ],
          },
        },
      ],
    },
  ],
};
