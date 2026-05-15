/**
 * Rich demo seed: Salon (Salon Isabelle)
 * Section types match template keys in templates/index.ts:
 * hero, serviceMenu, priceList, treatmentDetail, packages, teamShowcase, expertiseGrid,
 * beforeAfter, gallery, testimonials, openingHours, bookingCta, locationContact, faq, richText
 */
export const SALON_CONFIG = {
  slug: 'demo-salon',
  name: 'Salon Isabelle',
  industry: 'salon' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Salon Isabelle',
    tagline: 'Ihr Beauty-Experte in Hamburg — Haare, Nägel & Kosmetik',
    primaryColor: '#8b5e6b',
    secondaryColor: '#c2528a',
    accentColor: '#e8c4d0',
  },
  contact: { phone: '+49 40 987 654 32', email: 'info@salon-isabelle.de', address: 'Eppendorfer Baum 14, 20249 Hamburg' },
  socialLinks: { instagram: 'https://instagram.com/salonisabelle', facebook: 'https://facebook.com/salonisabelle' },
  openingHours: [
    { day: 'Di–Fr', hours: '09:00–19:00' },
    { day: 'Sa', hours: '09:00–16:00' },
    { day: 'Mo & So', hours: 'Geschlossen' },
  ],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Leistungen', href: '/leistungen', type: 'link' },
    { label: 'Preise', href: '/preise', type: 'link' },
    { label: 'Team', href: '/team', type: 'link' },
    { label: 'Galerie', href: '/galerie', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
  ],
  navCta: { label: 'Termin buchen', href: '/kontakt' },
  footerColumns: [
    { title: 'Salon', items: [{ text: 'Leistungen', href: '/leistungen' }, { text: 'Preise', href: '/preise' }, { text: 'Team', href: '/team' }] },
    { title: 'Mehr', items: [{ text: 'Galerie', href: '/galerie' }, { text: 'FAQ', href: '/faq' }] },
    { title: 'Kontakt', items: [{ text: '+49 40 987 654 32' }, { text: 'info@salon-isabelle.de' }, { text: 'Eppendorfer Baum 14, Hamburg' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }],
  footerCta: { label: 'Termin buchen', href: '/kontakt' },
  pages: [
    /* ─── Startseite ─── */
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Salon Isabelle',
          subline: 'Haare, Nägel & Kosmetik — Ihr Beauty-Experte in Hamburg-Eppendorf seit 2012.',
          badgeText: 'Meisterbetrieb',
          bgImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
          trustItems: ['Über 5.000 zufriedene Kunden', 'Nachhaltiger Salon', 'Meisterbetrieb'],
          ratingText: '4.9 ★ auf Google (380+ Bewertungen)',
          primaryCta: { label: 'Termin buchen', href: '/kontakt' },
          secondaryCta: { label: 'Leistungen entdecken', href: '/leistungen' },
        }},
        { type: 'serviceMenu', sortOrder: 1, data: {
          headline: 'Unsere Leistungen',
          subline: 'Von der Beratung bis zum perfekten Ergebnis',
          badgeText: 'Meisterbetrieb',
          categories: [
            { title: 'Damen Haarschnitt', text: 'Waschen, Schnitt, Föhnen — individuell auf Ihre Gesichtsform abgestimmt.', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80', category: 'Haare', services: ['Beratung', 'Waschen & Pflege', 'Schnitt', 'Styling & Föhnen'], cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'Coloration & Highlights', text: 'Von Balayage bis Full-Color: Wir arbeiten mit AVEDA und Kevin Murphy.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80', category: 'Haare', services: ['Beratung', 'Ansatzfarbe', 'Balayage', 'Highlights', 'Glossing'], cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'Kosmetik & Gesichtspflege', text: 'Reinigende und pflegende Treatments für jeden Hauttyp.', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80', category: 'Kosmetik', services: ['Hautanalyse', 'Tiefenreinigung', 'Anti-Aging Treatment', 'Augenbrauen-Design'], cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'Nagelpflege', text: 'Maniküre, Pediküre und Shellac — für gepflegte Hände und Füße.', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=80', category: 'Nägel', services: ['Maniküre', 'Pediküre', 'Shellac', 'Nail Art'], cta: { label: 'Buchen', href: '/kontakt' } },
          ],
          ctaPrimary: { label: 'Alle Preise ansehen', href: '/preise' },
        }},
        { type: 'testimonials', sortOrder: 2, data: {
          headline: 'Das sagen unsere Kundinnen',
          subline: 'Über 380 Google-Bewertungen',
          ratingValue: '4.9',
          ratingCount: '380',
          items: [
            { name: 'Lisa M.', context: 'Stammkundin seit 2018', rating: 5, quote: 'Isabelle hat ein unglaubliches Gespür für Farbe. Mein Balayage sieht jedes Mal perfekt aus!', sourceLabel: 'Google' },
            { name: 'Sandra K.', context: 'Neukunde', rating: 5, quote: 'Endlich ein Salon, der zuhört! Tolle Beratung, wunderschönes Ergebnis.', sourceLabel: 'Google' },
            { name: 'Anna T.', context: 'Hochzeitsstyling', rating: 5, quote: 'Das Brautstyling war der Wahnsinn. Alle haben nach dem Friseur gefragt!', sourceLabel: 'Google' },
          ],
          ctaPrimary: { label: 'Termin buchen', href: '/kontakt' },
        }},
        { type: 'bookingCta', sortOrder: 3, data: {
          headline: 'Termin vereinbaren',
          subline: 'Online oder telefonisch',
          introText: 'Buchen Sie Ihren Wunschtermin bequem online oder rufen Sie uns an.',
          notes: ['Online-Buchung rund um die Uhr', 'Terminänderung bis 24h vorher kostenlos', 'Erstberatung gratis'],
          onlineCta: { label: 'Online buchen', href: '/kontakt' },
          phoneCta: { label: 'Anrufen: 040 987 654 32', href: 'tel:+494098765432' },
        }},
        { type: 'newsPreview', sortOrder: 4, data: {
          headline: 'Salon-News',
          subline: 'Neues aus dem Salon Isabelle',
          collectionKey: 'news',
          linkLabel: 'Alle Beiträge',
          linkHref: '/neuigkeiten',
        }},
      ],
    },
    /* ─── Leistungen ─── */
    {
      slug: 'leistungen', title: 'Leistungen', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unsere Leistungen',
          subline: 'Professionelle Beauty-Services — individuell auf Sie abgestimmt',
          bgImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
        }},
        { type: 'serviceMenu', sortOrder: 1, data: {
          headline: 'Beauty-Leistungen im Überblick',
          subline: 'Qualität und Individualität',
          categories: [
            { title: 'Damen Haarschnitt', text: 'Waschen, Schnitt, Styling — individuell beraten.', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80', category: 'Haare', services: ['Beratung', 'Waschen', 'Schneiden', 'Styling', 'Föhnen'], cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'Herren Haarschnitt', text: 'Moderner Herren-Cut mit Barber-Techniken.', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=80', category: 'Haare', services: ['Beratung', 'Waschen', 'Schneiden', 'Styling'], cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'Coloration', text: 'AVEDA- und Kevin-Murphy-Produkte für brillante Farben.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80', category: 'Haare', services: ['Ansatzfarbe', 'Balayage', 'Highlights', 'Glossing', 'Toning'], cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'Braut- & Eventstyling', text: 'Der perfekte Look für Ihren besonderen Tag.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80', category: 'Styling', services: ['Probestyling', 'Brautfrisur', 'Make-up', 'Locken', 'Hochsteckfrisur'], cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'Gesichtsbehandlungen', text: 'Reinigende und Anti-Aging-Treatments.', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80', category: 'Kosmetik', services: ['Hautanalyse', 'Tiefenreinigung', 'Anti-Aging', 'Microneedling', 'Peeling'], cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'Nagelpflege', text: 'Maniküre, Pediküre und kreatives Nail Design.', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=80', category: 'Nägel', services: ['Maniküre', 'Pediküre', 'Shellac', 'Gel-Nägel', 'Nail Art'], cta: { label: 'Buchen', href: '/kontakt' } },
          ],
        }},
        { type: 'expertiseGrid', sortOrder: 2, data: {
          headline: 'Warum Salon Isabelle?',
          subline: 'Was uns auszeichnet',
          items: [
            { icon: 'award', title: 'Meisterbetrieb', text: 'Inhaberin Isabelle ist Friseurmeisterin mit über 15 Jahren Erfahrung.', metaLabel: 'Seit 2012' },
            { icon: 'leaf', title: 'Nachhaltige Produkte', text: 'Wir arbeiten ausschließlich mit AVEDA, Kevin Murphy und veganen Produkten.', metaLabel: 'Vegan & cruelty-free' },
            { icon: 'heart', title: 'Individuelle Beratung', text: 'Jeder Termin beginnt mit einem persönlichen Beratungsgespräch.', metaLabel: 'Für jeden Typ' },
            { icon: 'sparkles', title: 'Weiterbildung', text: 'Regelmäßige Schulungen bei AVEDA und internationalen Trainern.', metaLabel: 'Jährlich 40+ Stunden' },
          ],
        }},
      ],
    },
    /* ─── Preise ─── */
    {
      slug: 'preise', title: 'Preise', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Preisliste',
          subline: 'Transparente Preise — faire Qualität',
          bgImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
        }},
        { type: 'priceList', sortOrder: 1, data: {
          headline: 'Unsere Preise',
          subline: 'Alle Preise inkl. MwSt.',
          footnote: 'Für Langhaar-Zuschlag und Sonderbehandlungen sprechen Sie uns gerne an.',
          categories: [
            {
              title: 'Damen — Schnitt & Styling',
              items: [
                { name: 'Waschen, Schneiden, Föhnen', durationLabel: '60 Min.', priceLabel: 'Ab 68 €' },
                { name: 'Nur Schneiden (trocken)', durationLabel: '30 Min.', priceLabel: 'Ab 45 €' },
                { name: 'Föhnen & Styling', durationLabel: '45 Min.', priceLabel: 'Ab 38 €' },
                { name: 'Hochsteckfrisur / Eventstyling', durationLabel: '90 Min.', priceLabel: 'Ab 85 €' },
              ],
            },
            {
              title: 'Coloration',
              items: [
                { name: 'Ansatzfarbe', durationLabel: '90 Min.', priceLabel: 'Ab 72 €' },
                { name: 'Balayage / Ombré', durationLabel: '150 Min.', priceLabel: 'Ab 140 €', note: 'Bestseller' },
                { name: 'Highlights / Strähnchen', durationLabel: '120 Min.', priceLabel: 'Ab 95 €' },
                { name: 'Glossing', durationLabel: '45 Min.', priceLabel: 'Ab 45 €' },
              ],
            },
            {
              title: 'Herren',
              items: [
                { name: 'Waschen, Schneiden, Styling', durationLabel: '30 Min.', priceLabel: 'Ab 38 €' },
                { name: 'Maschinenschnitt', durationLabel: '20 Min.', priceLabel: 'Ab 28 €' },
                { name: 'Bart-Trimm', durationLabel: '15 Min.', priceLabel: 'Ab 18 €' },
              ],
            },
            {
              title: 'Kosmetik & Nägel',
              items: [
                { name: 'Gesichtsbehandlung Classic', durationLabel: '60 Min.', priceLabel: 'Ab 78 €' },
                { name: 'Anti-Aging Treatment', durationLabel: '75 Min.', priceLabel: 'Ab 95 €' },
                { name: 'Maniküre', durationLabel: '45 Min.', priceLabel: 'Ab 35 €' },
                { name: 'Shellac Maniküre', durationLabel: '60 Min.', priceLabel: 'Ab 48 €' },
                { name: 'Pediküre', durationLabel: '60 Min.', priceLabel: 'Ab 45 €' },
              ],
            },
          ],
          ctaPrimary: { label: 'Termin buchen', href: '/kontakt' },
        }},
        { type: 'packages', sortOrder: 2, data: {
          headline: 'Beauty-Packages',
          subline: 'Sparen Sie mit unseren Kombiangeboten',
          packages: [
            { title: 'Verwöhn-Paket', text: 'Waschen, Schnitt, Föhnen + Gesichtsbehandlung Classic.', priceLabel: '129 € statt 146 €', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80', includes: ['Haarschnitt', 'Kopfmassage', 'Gesichtsbehandlung', 'Styling'], cta: { label: 'Buchen', href: '/kontakt' } },
            { title: 'Braut-Paket', text: 'Probestyling + Brautfrisur + Make-up am Hochzeitstag.', priceLabel: 'Ab 280 €', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80', includes: ['Probestyling', 'Brautfrisur', 'Make-up', 'Notfall-Kit'], cta: { label: 'Anfragen', href: '/kontakt' } },
          ],
          ctaPrimary: { label: 'Alle Packages ansehen', href: '/kontakt' },
        }},
      ],
    },
    /* ─── Team ─── */
    {
      slug: 'team', title: 'Team', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Unser Team',
          subline: 'Leidenschaft für Schönheit — Expertise in jedem Detail',
          bgImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
        }},
        { type: 'teamShowcase', sortOrder: 1, data: {
          headline: 'Lernen Sie uns kennen',
          subline: 'Ein Team aus erfahrenen Stylisten und Kosmetikern',
          members: [
            { name: 'Isabelle Krüger', role: 'Inhaberin & Friseurmeisterin', bio: 'Isabelle führt den Salon seit 2012. Ihr Schwerpunkt: Balayage und natürliche Farbverläufe. AVEDA Master Colorist.', image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=80', specialties: ['Balayage', 'Coloration', 'Beratung'], bookingCta: { label: 'Termin bei Isabelle', href: '/kontakt' } },
            { name: 'Lena Hoffmann', role: 'Senior Stylistin', bio: 'Lena ist spezialisiert auf Hochsteckfrisuren und Brautstyling. 8 Jahre Berufserfahrung.', image: 'https://images.unsplash.com/photo-1595959183082-7b570b7e1e2b?w=900&q=80', specialties: ['Brautstyling', 'Hochsteckfrisuren', 'Herrenschnitte'], bookingCta: { label: 'Termin bei Lena', href: '/kontakt' } },
            { name: 'Marie Schuster', role: 'Kosmetikerin', bio: 'Marie bietet professionelle Gesichtsbehandlungen und Mikroneedling. Zertifizierte Hautpflege-Expertin.', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80', specialties: ['Gesichtsbehandlung', 'Anti-Aging', 'Mikroneedling'], bookingCta: { label: 'Termin bei Marie', href: '/kontakt' } },
            { name: 'Julia Weber', role: 'Nageldesignerin', bio: 'Julia ist Expertin für Shellac, Gel-Nägel und kreatives Nail Art. 6 Jahre Erfahrung.', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=80', specialties: ['Shellac', 'Gel-Nägel', 'Nail Art'], bookingCta: { label: 'Termin bei Julia', href: '/kontakt' } },
          ],
        }},
      ],
    },
    /* ─── Galerie ─── */
    {
      slug: 'galerie', title: 'Galerie', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Galerie',
          subline: 'Einblicke in unsere Arbeit und unseren Salon',
          bgImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
        }},
        { type: 'beforeAfter', sortOrder: 1, data: {
          headline: 'Vorher & Nachher',
          subline: 'Unsere Verwandlungen',
          items: [
            { title: 'Balayage-Verwandlung', text: 'Von einfarbig zu natürlichem Balayage-Look.', beforeImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80', afterImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80', category: 'Coloration' },
            { title: 'Bob-Cut', text: 'Vom langen Haar zum modernen Blunt Bob.', beforeImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=80', afterImage: 'https://images.unsplash.com/photo-1595959183082-7b570b7e1e2b?w=900&q=80', category: 'Schnitt' },
          ],
        }},
        { type: 'gallery', sortOrder: 2, data: {
          headline: 'Unser Salon',
          subline: 'Wohlfühlatmosphäre in Hamburg-Eppendorf',
          images: [
            { src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80', alt: 'Salon Innenansicht', category: 'Salon' },
            { src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80', alt: 'Coloration', category: 'Farbe' },
            { src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80', alt: 'Kosmetikbehandlung', category: 'Kosmetik' },
            { src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=80', alt: 'Nagelpflege', category: 'Nägel' },
          ],
        }},
      ],
    },
    /* ─── FAQ ─── */
    {
      slug: 'faq', title: 'FAQ', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Häufig gestellte Fragen',
          subline: 'Antworten rund um Ihren Besuch bei uns',
          bgImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
        }},
        { type: 'faq', sortOrder: 1, data: {
          headline: 'FAQ',
          subline: 'Wir beantworten Ihre Fragen',
          items: [
            { question: 'Muss ich einen Termin buchen?', answer: 'Ja, wir arbeiten ausschließlich mit Terminvereinbarung. Online oder telefonisch buchbar.' },
            { question: 'Welche Produkte verwenden Sie?', answer: 'Wir arbeiten mit AVEDA, Kevin Murphy und anderen hochwertigen, nachhaltigen Marken.' },
            { question: 'Bieten Sie auch Kinderhaare an?', answer: 'Ja! Kinderhaare (bis 12 J.) ab 22 €. Bitte bei der Buchung angeben.' },
            { question: 'Kann ich meinen Termin stornieren?', answer: 'Kostenlose Stornierung bis 24 Stunden vorher. Danach No-Show-Gebühr von 50 % des Servicepreises.' },
            { question: 'Gibt es Parkmöglichkeiten?', answer: 'Im Parkhaus Eppendorfer Baum (3 Min. Fußweg). Straßenparken mit Anwohnerzone.' },
          ],
          ctaPrimary: { label: 'Weitere Fragen? Kontakt', href: '/kontakt' },
        }},
      ],
    },
    /* ─── Kontakt ─── */
    {
      slug: 'kontakt', title: 'Kontakt', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Kontakt & Termin',
          subline: 'Wir freuen uns auf Ihren Besuch',
          bgImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85',
        }},
        { type: 'locationContact', sortOrder: 1, data: {
          headline: 'So finden Sie uns',
          subline: 'Im Herzen von Hamburg-Eppendorf',
          introText: 'Besuchen Sie uns im Eppendorfer Baum — nur 3 Minuten von der U-Bahn-Station Eppendorfer Baum.',
          image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80',
          mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2369.0!2d9.98!3d53.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTPCsDM0JzQ4LjAiTiA5wrA1OCc0OC4wIkU!5e0!3m2!1sde!2sde!4v1700000000000',
          formEnabled: true,
          infoCards: [
            { icon: 'phone', label: 'Telefon', value: '+49 40 987 654 32' },
            { icon: 'mail', label: 'E-Mail', value: 'info@salon-isabelle.de' },
            { icon: 'map-pin', label: 'Adresse', value: 'Eppendorfer Baum 14, 20249 Hamburg' },
            { icon: 'clock', label: 'Öffnungszeiten', value: 'Di–Fr 9–19 Uhr, Sa 9–16 Uhr' },
          ],
          primaryCta: { label: 'Termin buchen', href: '/kontakt' },
          secondaryCta: { label: 'Anrufen', href: 'tel:+494098765432' },
        }},
        { type: 'openingHours', sortOrder: 2, data: {
          headline: 'Öffnungszeiten',
          subline: 'Wann Sie uns besuchen können',
          bookingNote: 'Termine nur mit Voranmeldung. Online-Buchung rund um die Uhr möglich.',
          days: [
            { label: 'Montag', hours: 'Geschlossen', closed: true },
            { label: 'Dienstag–Freitag', hours: '09:00–19:00' },
            { label: 'Samstag', hours: '09:00–16:00' },
            { label: 'Sonntag', hours: 'Geschlossen', closed: true },
          ],
          ctaPrimary: { label: 'Termin buchen', href: '/kontakt' },
        }},
      ],
    },
  ],
  collections: [
    {
      key: 'news', label: 'Salon-News', items: [
        { slug: 'balayage-trends-2025', title: 'Balayage-Trends 2025: Natürliche Farbverläufe dominieren', priority: 0, data: { excerpt: 'Von Honey Blonde bis Mushroom Brown — diese Balayage-Trends setzen wir diesen Herbst am häufigsten um.', content: '<p>Balayage bleibt auch 2025 die beliebteste Färbetechnik. Der Trend geht zu noch natürlicheren Verläufen mit subtilen Lichtreflexen. Unsere Top 3 Farben: Honey Blonde, Caramel Bronde und Mushroom Brown.</p><p>Unsere Coloristin Isabelle berät Sie gerne bei einem kostenlosen Erstgespräch.</p>', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80', date: '2025-09-15' } },
        { slug: 'neue-pflegeserie', title: 'Neu im Salon: Olaplex Professional Pflegeserie', priority: 1, data: { excerpt: 'Ab sofort verwenden wir die komplette Olaplex Professional Linie — für gesünderes Haar nach jeder Behandlung.', content: '<p>Wir haben unser Pflegesortiment erweitert und setzen ab sofort auf Olaplex Professional. Die patentierte Bond-Building-Technologie repariert geschädigtes Haar von innen und schützt bei Färbe- und Blondierbehandlungen.</p><p>Alle Olaplex-Produkte sind auch im Salon zum Mitnehmen erhältlich.</p>', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', date: '2025-07-01' } },
        { slug: 'brautstyling-special', title: 'Brautstyling 2025: Jetzt Beratungstermin sichern', priority: 2, data: { excerpt: 'Planen Sie Ihre Hochzeit 2025? Sichern Sie sich jetzt Ihren Brautstyling-Termin — inklusive Probe-Styling.', content: '<p>Die Hochzeitssaison 2025 ist fast ausgebucht! Sichern Sie sich rechtzeitig Ihren Termin für das perfekte Brautstyling. Unser Paket enthält: persönliches Beratungsgespräch, Probe-Styling, Make-up am Hochzeitstag und Styling für 2 Brautjungfern.</p><p>Paketpreis: ab 450 €. Inkl. Anfahrt im Großraum Hamburg.</p>', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80', date: '2025-03-15' } },
      ],
    },
  ],
};
