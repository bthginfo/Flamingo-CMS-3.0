/**
 * Rich demo seed: Weinhandel / Online Shop
 * Section types: hero, shopCategoryOverview, shopProductGrid, shopFeaturedProducts, textImage, contact, faq
 */
export const SHOP_CONFIG = {
  slug: 'demo-shop',
  name: 'Vinothek Goldberg',
  industry: 'tradesman' as const,
  activeStyle: 'classic',
  brand: {
    companyName: 'Vinothek Goldberg',
    tagline: 'Erlesene Weine aus aller Welt — seit 1962',
    primaryColor: '#4a1942',
    secondaryColor: '#722f37',
    accentColor: '#c9a96e',
  },
  contact: { phone: '+49 221 987 654 32', email: 'info@vinothek-goldberg.de', address: 'Weinstraße 8, 50667 Köln' },
  socialLinks: { instagram: 'https://instagram.com/vinothekgoldberg', facebook: 'https://facebook.com/vinothekgoldberg' },
  openingHours: [
    { day: 'Mo–Fr', hours: '10:00–19:00' },
    { day: 'Sa', hours: '10:00–16:00' },
    { day: 'So', hours: 'Geschlossen' },
  ],
  navItems: [
    { label: 'Startseite', href: '/', type: 'link' },
    { label: 'Weine', href: '/shop', type: 'link' },
    { label: 'Kategorien', href: '/kategorien', type: 'link' },
    { label: 'Über uns', href: '/ueber-uns', type: 'link' },
    { label: 'Kontakt', href: '/kontakt', type: 'link' },
    { label: 'Warenkorb', href: '/warenkorb', type: 'link' },
  ],
  navCta: { label: 'Zum Shop', href: '/shop' },
  footerColumns: [
    { title: 'Shop', items: [{ text: 'Alle Weine', href: '/shop' }, { text: 'Kategorien', href: '/kategorien' }, { text: 'Über uns', href: '/ueber-uns' }] },
    { title: 'Service', items: [{ text: 'Versand & Lieferung', href: '/versand' }, { text: 'Kontakt', href: '/kontakt' }] },
    { title: 'Kontakt', items: [{ text: '+49 221 987 654 32' }, { text: 'info@vinothek-goldberg.de' }, { text: 'Weinstraße 8, Köln' }] },
  ],
  footerLegalLinks: [{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }, { label: 'AGB', href: '/agb' }, { label: 'Widerrufsbelehrung', href: '/widerrufsbelehrung' }],
  footerCta: { label: 'Zum Shop', href: '/shop' },
  pages: [
    /* ─── Startseite ─── */
    {
      slug: 'startseite', title: 'Startseite', sections: [
        { type: 'hero', sortOrder: 0, data: {
          headline: 'Vinothek Goldberg',
          subline: 'Erlesene Weine aus Frankreich, Italien, Spanien und Deutschland — handverlesen von unserer Familie seit 1962.',
          badgeText: 'Seit 1962',
          bgImage: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1800&q=85',
          trustItems: ['Über 500 Weine', 'Kostenloser Versand ab 75€', 'Persönliche Beratung'],
          primaryCta: { label: 'Weine entdecken', href: '/shop' },
          secondaryCta: { label: 'Kategorien', href: '/kategorien' },
        }},
        { type: 'shopFeaturedProducts', sortOrder: 1, data: {
          headline: 'Unsere Empfehlungen',
        }},
        { type: 'shopCategoryOverview', sortOrder: 2, data: {
          headline: 'Unsere Weinwelten',
          subline: 'Entdecken Sie unsere sorgfältig kuratierte Auswahl nach Kategorie.',
          columns: 3,
        }},
        { type: 'textImage', sortOrder: 3, data: {
          headline: 'Unsere Geschichte',
          text: '<p>Seit drei Generationen widmet sich die Familie Goldberg der Kunst des Weins. Was 1962 als kleine Weinhandlung in der Kölner Altstadt begann, ist heute eine der renommiertesten Vinotheken im Rheinland.</p><p>Jeder Wein in unserem Sortiment wurde persönlich von uns verkostet und ausgewählt — wir besuchen unsere Winzer regelmäßig und pflegen enge Beziehungen zu den Weingütern.</p>',
          image: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=900&q=80',
          imagePosition: 'right',
          ctaLabel: 'Mehr über uns',
          ctaHref: '/ueber-uns',
        }},
      ],
    },
    /* ─── Shop (Produkte) ─── */
    {
      slug: 'shop', title: 'Alle Weine', sections: [
        { type: 'shopProductGrid', sortOrder: 0, data: {
          headline: 'Unsere Weine',
          showCategories: true,
          showSearch: true,
          columns: 3,
        }},
      ],
    },
    /* ─── Kategorien ─── */
    {
      slug: 'kategorien', title: 'Kategorien', sections: [
        { type: 'shopCategoryOverview', sortOrder: 0, data: {
          headline: 'Unsere Weinwelten',
          subline: 'Finden Sie den perfekten Wein nach Kategorie.',
          columns: 3,
        }},
      ],
    },
    /* ─── Warenkorb ─── */
    {
      slug: 'warenkorb', title: 'Warenkorb', sections: [
        { type: 'shopCart', sortOrder: 0, data: {
          headline: 'Dein Warenkorb',
          emptyText: 'Dein Warenkorb ist leer.',
          continueShoppingLabel: 'Weiter einkaufen',
          checkoutLabel: 'Zur Kasse',
        }},
      ],
    },
    /* ─── Über uns ─── */
    {
      slug: 'ueber-uns', title: 'Über uns', sections: [
        { type: 'textImage', sortOrder: 0, data: {
          headline: 'Die Familie Goldberg',
          text: '<p>Angefangen hat alles mit meinem Großvater Heinrich Goldberg, der 1962 seine Leidenschaft für Wein zum Beruf machte. Heute führe ich, Thomas Goldberg, das Geschäft in dritter Generation — unterstützt von meiner Frau Katrin und unserem kleinen Team.</p><p>Unsere Philosophie: Qualität statt Quantität. Wir setzen auf kleine Weingüter, nachhaltige Bewirtschaftung und handwerkliche Tradition.</p>',
          image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80',
          imagePosition: 'left',
        }},
        { type: 'faq', sortOrder: 1, data: {
          headline: 'Häufige Fragen',
          items: [
            { question: 'Wie erfolgt der Versand?', answer: 'Wir versenden mit DHL in bruchsicherer Spezialverpackung. Die Lieferung dauert in der Regel 2-3 Werktage.' },
            { question: 'Ab welchem Bestellwert ist der Versand kostenlos?', answer: 'Ab einem Bestellwert von 75€ liefern wir innerhalb Deutschlands versandkostenfrei.' },
            { question: 'Kann ich die Weine auch vor Ort probieren?', answer: 'Selbstverständlich! Besuchen Sie uns in unserer Vinothek in der Weinstraße 8 in Köln.' },
            { question: 'Bieten Sie auch Weinproben an?', answer: 'Ja! Jeden ersten Samstag im Monat veranstalten wir eine geführte Weinprobe. Anfragen bitte per E-Mail.' },
          ],
        }},
      ],
    },
    /* ─── Kontakt ─── */
    {
      slug: 'kontakt', title: 'Kontakt', sections: [
        { type: 'contact', sortOrder: 0, data: {
          headline: 'Kontakt',
          introText: 'Sie haben Fragen zu unserem Sortiment oder möchten eine persönliche Beratung? Wir freuen uns auf Ihre Nachricht.',
          badgeText: 'Wir beraten Sie gerne',
          submitLabel: 'Nachricht senden',
        }},
      ],
    },
  ],
  // Shop-specific data for seeding
  shopCategories: [
    { name: 'Rotwein', slug: 'rotwein', description: 'Kräftige und elegante Rotweine aus den besten Anbaugebieten.', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80' },
    { name: 'Weißwein', slug: 'weisswein', description: 'Frische und aromatische Weißweine für jeden Anlass.', image: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=800&q=80' },
    { name: 'Roséwein', slug: 'rosewein', description: 'Leichte Roséweine — perfekt für den Sommer.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80' },
    { name: 'Schaumwein', slug: 'schaumwein', description: 'Champagner, Prosecco und Crémant für besondere Momente.', image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80' },
    { name: 'Bio-Weine', slug: 'bio-weine', description: 'Nachhaltig angebaute Weine aus biologischem Anbau.', image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80' },
  ],
  shopProducts: [
    { title: 'Château Margaux 2018', slug: 'chateau-margaux-2018', category: 'rotwein', priceCents: 34900, comparePriceCents: null, description: 'Ein Grand Cru Classé aus dem Bordeaux mit eleganter Struktur, samtigen Tanninen und Aromen von schwarzer Johannisbeere, Zeder und Graphit.', shortDescription: 'Grand Cru Classé, Bordeaux', images: ['https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=600&q=80'], stock: 12, status: 'active', highlights: ['Grand Cru Classé', '14,5% Vol.', 'Bordeaux, Frankreich', '24 Monate Barrique'] },
    { title: 'Barolo Riserva 2016', slug: 'barolo-riserva-2016', category: 'rotwein', priceCents: 5900, comparePriceCents: 6900, description: 'Aus dem Piemont stammend, besticht dieser Barolo durch Aromen von Rose, Teer und Kirsche mit kraftvollen, aber geschliffenen Tanninen.', shortDescription: 'DOCG Piemont, Italien', images: ['https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80'], stock: 24, status: 'active', highlights: ['DOCG Qualitätswein', '14% Vol.', 'Nebbiolo-Traube', '36 Monate Reifung'] },
    { title: 'Chablis Premier Cru 2021', slug: 'chablis-premier-cru-2021', category: 'weisswein', priceCents: 2990, comparePriceCents: null, description: 'Mineralischer Chardonnay aus dem Burgund mit Noten von grünem Apfel, Kreide und einer feinen Zitrusnote.', shortDescription: 'Premier Cru, Burgund', images: ['https://images.unsplash.com/photo-1566995541428-f05bc3b5a6e6?w=600&q=80'], stock: 36, status: 'active', highlights: ['Premier Cru', '13% Vol.', 'Chardonnay', 'Burgund, Frankreich'] },
    { title: 'Riesling Spätlese 2022', slug: 'riesling-spaetlese-2022', category: 'weisswein', priceCents: 1890, comparePriceCents: null, description: 'Von der Mosel: Feine Restsüße, lebendige Säure und Aromen von Pfirsich, Aprikose und Schiefermineralik.', shortDescription: 'VDP, Mosel', images: ['https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&q=80'], stock: 48, status: 'active', highlights: ['VDP Qualität', '8,5% Vol.', 'Feinherb', 'Mosel, Deutschland'] },
    { title: 'Provence Rosé 2023', slug: 'provence-rose-2023', category: 'rosewein', priceCents: 1590, comparePriceCents: null, description: 'Blassrosa mit Aromen von Erdbeere, Wassermelone und Kräutern der Provence. Trocken, frisch und elegant.', shortDescription: 'AOP Côtes de Provence', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80'], stock: 60, status: 'active', highlights: ['AOP zertifiziert', '12,5% Vol.', 'Trocken', 'Perfekt gekühlt bei 8–10°C'] },
    { title: 'Dom Pérignon 2012', slug: 'dom-perignon-2012', category: 'schaumwein', priceCents: 21900, comparePriceCents: null, description: 'Ikonischer Champagner mit Noten von geröstetem Brioche, weißen Blüten und einer cremigen, langanhaltenden Perlage.', shortDescription: 'Vintage Champagne, Épernay', images: ['https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=80'], stock: 6, status: 'active', highlights: ['Vintage Champagne', '12,5% Vol.', 'Pinot Noir & Chardonnay', 'Limitierte Auflage'] },
    { title: 'Prosecco Superiore DOCG', slug: 'prosecco-superiore-docg', category: 'schaumwein', priceCents: 1290, comparePriceCents: 1490, description: 'Aus Valdobbiadene: Feiner, anhaltender Schaum mit Aromen von grünem Apfel, Birne und Akazienblüte.', shortDescription: 'DOCG Valdobbiadene', images: ['https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=600&q=80'], stock: 72, status: 'active', highlights: ['DOCG Superiore', '11,5% Vol.', 'Glera-Traube', 'Extra Dry'] },
    { title: 'Grüner Veltliner Bio 2022', slug: 'gruener-veltliner-bio-2022', category: 'bio-weine', priceCents: 1490, comparePriceCents: null, description: 'Biodynamisch angebaut im Kamptal. Pfeffrig, frisch mit Noten von weißem Pfeffer und Grapefruit.', shortDescription: 'Bio, Kamptal, Österreich', images: ['https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80'], stock: 30, status: 'active', highlights: ['Bio-zertifiziert', '12,5% Vol.', 'Biodynamischer Anbau', 'Kamptal DAC'] },
    { title: 'Chianti Classico Bio 2020', slug: 'chianti-classico-bio-2020', category: 'bio-weine', priceCents: 1790, comparePriceCents: 2190, description: 'Biologischer Anbau in der Toskana. Kirscharomen, Gewürze und feinkörnige Tannine mit langem Abgang.', shortDescription: 'Bio DOCG, Toskana', images: ['https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=600&q=80'], stock: 18, status: 'active', highlights: ['Bio DOCG', '13,5% Vol.', 'Sangiovese', 'Toskana, Italien'] },
    { title: 'Rioja Reserva 2017', slug: 'rioja-reserva-2017', category: 'rotwein', priceCents: 2490, comparePriceCents: null, description: 'Eleganter Tempranillo aus dem Rioja mit Vanille, Leder und reifen Beerenfrüchten. 18 Monate Barrique-Ausbau.', shortDescription: 'DOCa Rioja, Spanien', images: ['https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80'], stock: 20, status: 'active', highlights: ['DOCa Reserva', '14% Vol.', 'Tempranillo', '18 Monate Barrique'] },
  ],
};
