export function getSectionSchemas(industry: string): Record<string, object> {
  const schemas: Record<string, object> = {
    hero: { fields: { headline: 'string', subline: 'string', badgeText: 'string?', badgeIcon: 'lucide-icon-name?', badgeStarsIcon: 'lucide-icon-name? (leer = keine Sterne)', bgImage: 'url?', bgImageMobile: 'url?', bgColor: 'hex? (alternative bg color if no image)', bgMode: '"image"|"color"|"gradient" (default gradient)', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', trustItems: 'string[]?', trustStripColor: 'hex?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string? (CSS object-position, e.g. "center 30%")', bgPositionMobile: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
    heroRestaurant: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', badgeIcon: 'lucide-icon-name?', badgeStarsIcon: 'lucide-icon-name?', bgImage: 'url?', bgImageMobile: 'url?', bgColor: 'hex?', bgMode: '"image"|"color"|"gradient"?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', trustItems: 'string[]?', trustStripColor: 'hex?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string?', bgPositionMobile: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
    heroHotel: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', badgeIcon: 'lucide-icon-name?', bgImage: 'url?', bgImageMobile: 'url?', bgColor: 'hex?', bgMode: '"image"|"color"|"gradient"?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', trustItems: 'string[]?', trustStripColor: 'hex?', ratingText: 'string?', availabilityHint: 'string?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string?', bgPositionMobile: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
    heroSalon: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', badgeIcon: 'lucide-icon-name?', bgImage: 'url?', bgImageMobile: 'url?', bgColor: 'hex?', bgMode: '"image"|"color"|"gradient"?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', trustItems: 'string[]?', trustStripColor: 'hex?', ratingText: 'string?', bookingHint: 'string?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string?', bgPositionMobile: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
    heroTourism: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', badgeIcon: 'lucide-icon-name?', locationLabel: 'string?', seasonLabel: 'string?', ratingText: 'string?', availabilityHint: 'string?', bgImage: 'url?', bgImageMobile: 'url?', bgColor: 'hex?', bgMode: '"image"|"color"|"gradient"?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', trustItems: 'string[]?', trustStripColor: 'hex?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string?', bgPositionMobile: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
    heroMedical: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', badgeIcon: 'lucide-icon-name?', specialtyLabel: 'string?', bgImage: 'url?', bgImageMobile: 'url?', bgColor: 'hex?', bgMode: '"image"|"color"|"gradient"?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', emergencyCta: '{ label: string, href: string, icon?: lucide-icon-name }?', emergencyHint: 'string?', trustItems: 'string[]?', trustStripColor: 'hex?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string?', bgPositionMobile: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
    heroWedding: { fields: { headline: 'string?', subline: 'string?', names: 'string?', coupleName: 'string?', tagline: 'string?', date: 'string?', venue: 'string?', showCountdown: 'boolean?', bgImage: 'url?', bgImageMobile: 'url?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string?', bgPositionMobile: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
    heroTattoo: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', bgImage: 'url?', bgImageMobile: 'url?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', overlayOpacity: '0-1?', imageEffect: '"none"|"parallax"|"kenBurns"?' } },
    heroConsulting: { fields: { headline: 'string', subline: 'string?', bgImage: 'url?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', trustItems: 'string[]?', overlayOpacity: '0-1?', imageEffect: '"none"|"parallax"|"kenBurns"?' } },
    richText: { fields: { headline: 'string?', content: 'html-string' } },
    legalContent: { fields: { headline: 'string', blocks: '{ headline: string, text: string (html) }[] — je ein Block pro Thema (z.B. Verantwortlicher, Kontakt, Hosting, Cookies etc.)' } },
    freeText: { fields: { content: 'rich-text (Tiptap JSON or HTML)' } },
    videoEmbed: { fields: { headline: 'string?', subline: 'string?', videoUrl: 'youtube/vimeo URL', aspectRatio: '"16:9"|"4:3"|"1:1"?' } },
    embed: { fields: { headline: 'string?', subline: 'string?', mode: '"standard"|"preset"', provider: 'string? (doctolib|calendly|opentable|treatwell|simplybook|provenexpert|jameda|google-reviews|outdooractive|komoot|booking|youtube|vimeo|spotify|typeform|instagram)', config: 'Record<string,string> — provider-specific fields', embedCode: 'string? (raw iframe HTML, only for mode=standard)', height: 'number? (px)', maxWidth: 'string? (e.g. "800px" or "100%")' } },
    textImage: { fields: { headline: 'string', text: 'string (html)', badge: 'string?', image: 'url', imageAlt: 'string?', layout: '"image-right"|"image-left"', items: '{ icon?: lucide-icon-name, title: string, text: string }[]?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?' } },
    collectionHero: { fields: { headline: 'string', subline: 'string?', bgImage: 'url?', category: 'string?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
    noticeBanner: { fields: { headline: 'string', subline: 'string?', text: 'string? (html)', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?' } },
    popup: { fields: { title: 'string', subtitle: 'string?', text: 'string? (html)', delayMs: 'number? milliseconds until popup opens (1000 = 1 second, default 2500)', frequency: '"once"|"session" (once = after closing, do not show again on same device; session = can appear again in a new browser session)', primaryCta: '{ label?: string, href?: string }?', secondaryCta: '{ label?: string, href?: string }?' } },
    bookingWidget: { fields: { badge: 'string?', headline: 'string', subline: 'string?', submitLabel: 'string? (leer = automatisch je Booking-Modus: Anfrage senden oder Jetzt buchen)', ctaHref: 'string? (optional anchor/target for external CTA use)' }, note: 'Premium Booking Add-on Section. Die echte Buchungslogik kommt aus Admin > Funktionen > Buchungen.' },
    bookingSlotPicker: { fields: { badge: 'string?', headline: 'string', subline: 'string?', submitLabel: 'string?', ctaHref: 'string?' }, note: 'Premium Booking Add-on Section für Datumsauswahl plus sichtbare Uhrzeit-Slots. Ideal für Restaurant, Café, Salon, Fitness, Praxis, Fotograf-Termin oder Beratung.' },
    bookingDateRange: { fields: { badge: 'string?', headline: 'string', subline: 'string?', submitLabel: 'string?', ctaHref: 'string?' }, note: 'Premium Booking Add-on Section für Startdatum + Enddatum. Ideal für Hotel, Apartment, Location, Raum, Fläche, mehrtägige Buchung oder Eventanfrage.' },
    availabilityCalendar: { fields: { badge: 'string?', headline: 'string', subline: 'string?', submitLabel: 'string?', ctaHref: 'string?' }, note: 'Premium Booking Add-on Section für Kalender-/Verfügbarkeits-Einstieg.' },
    resourceBookingShowcase: { fields: { badge: 'string?', headline: 'string', subline: 'string?', submitLabel: 'string?', ctaHref: 'string?' }, note: 'Premium Booking Add-on Section für Ressourcen/Services als Buchungseinstieg.' },
    bookingCtaPro: { fields: { badge: 'string?', headline: 'string', subline: 'string?', submitLabel: 'string?', ctaHref: 'string?' }, note: 'Premium Booking Add-on Section für kompakten Buchungs-CTA.' },
    statsCounter: { fields: { headline: 'string', subline: 'string?', stats: '{ value: number|string, suffix?: string, prefix?: string, label: string }[] (4 items recommended, value can be a number for animated counter OR a string like "seit 2019" for non-numeric facts)' } },
    bentoGrid: { fields: { headline: 'string', subline: 'string?', items: '{ title: string, text: string, icon?: lucide-icon-name, image?: url, span?: "1"|"2" }[] (asymmetric grid with hover spotlight)' } },
    testimonialMarquee: { fields: { headline: 'string?', items: '{ quote: string, name: string, role?: string, image?: url, rating?: 1-5 }[] (min 6 items, auto-scrolling in 2 rows)' } },
    featureShowcase: { fields: { headline: 'string', subline: 'string?', badge: 'string?', text: 'string? (html)', image: 'url', features: 'string[] (kurze Feature-Texte; Objekt-Features werden defensiv gerendert, empfohlen ist string[])', ctaLabel: 'string?', ctaHref: 'string?', ctaPrimary: '{ label: string, href: string, icon?: lucide-icon-name }?', reversed: 'boolean?' } },
    logoMarquee: { fields: { headline: 'string?', logos: '{ src: url, alt: string, href?: url }[] (min 6 logos, auto-scrolling)' } },
    // Shared section schemas available to all industries
    servicesGrid: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', ctaLabel: 'string?', ctaHref: 'string?', manualCards: '{ title: string, text: string, icon?: lucide-icon-name, image?: url, mediaType?: icon|image, href?: string }[]' } },
    uspStrip: { fields: { items: '{ icon: lucide-icon-name, title: string, text: string }[]' } },
    processSteps: { fields: { headline: 'string', badgeText: 'string?', steps: '{ icon: lucide-icon-name, title: string, text: string }[]' } },
    testimonials: { fields: { headline: 'string', badgeText: 'string?', items: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]' } },
    faq: { fields: { headline: 'string', badgeText: 'string?', expandFirst: 'boolean?', items: '{ question: string, answer: string }[]' } },
    ctaBand: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', ctaPrimary: '{ label: string, href: string, icon?: lucide-icon-name }' } },
    contact: { fields: { headline: 'string', introText: 'string?', badgeText: 'string?', formEnabled: 'boolean (default true)', submitLabel: 'string?', formFields: '{ name: string, type: "text"|"email"|"tel"|"textarea", required?: boolean }[]?', infoCards: '{ icon: lucide-icon-name, label: string, value: string }[] (z.B. Phone/Mail/Adresse/Öffnungszeiten)' } },
    map: { fields: { headline: 'string?', embedUrl: 'Google Maps Embed-URL (https://www.google.com/maps/embed?pb=...)', height: '"s"|"m"|"l" (default "m")' } },
    contactLocation: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', addressText: 'string', address: 'string? (legacy alias for addressText)', phone: 'string?', email: 'string?', mapEmbedUrl: 'Google Maps oder OpenStreetMap Embed-URL?', image: 'url?', transportItems: '{ icon?: lucide-icon-name, label: string, value?: string, text?: string }[]?', nearbyItems: '{ title: string, distanceLabel?: string, text?: string, image?: url }[]?', routeCta: '{ label: string, href: string }?' } },
    additionalLocations: { fields: { badge: 'string?', headline: 'string?', subline: 'string?', locations: '{ name?: string, address?: string, phone?: string, email?: string, mail?: string, mapEmbedUrl?: Google Maps Embed-URL, openingHours?: string (mehrzeilig möglich), ctaLabel?: string, ctaHref?: string }[] — alle Felder optional, aber pro Standort mindestens ein sichtbares Feld setzen' } },
    team: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', membersHeadline: 'string?', members: '{ name: string, role: string, image?: url, bio?: string }[]', storyHeadline: 'string?', storyText: 'string?', storyImage: 'url?', valuesHeadline: 'string?', values: '{ icon: lucide-icon-name, title: string, text: string }[]?', stats: '{ value: string, label: string }[]?' } },
    stats: { fields: { headline: 'string?', stats: '{ icon?: lucide-icon-name, value: number|string, suffix?: string, prefix?: string, label: string }[] (value: number for animated counter, or string like "seit 2019" for text facts)' } },
    galleryGrid: { fields: { headline: 'string', subline: 'string?', columns: '2|3|4?', images: '{ src: url, alt: string, caption?: string }[]' } },
    instagramFeed: { fields: { badgeText: 'string?', headline: 'string?', subline: 'string?', ctaLabel: 'string?', layout: '"grid"|"masonry"? (currently rendered as responsive grid)', columns: '2|3|4|6? (default 3)', maxPosts: '6|9|12|16|24? (default 9)', showCaptions: 'boolean? (default true)', showProfileLink: 'boolean? (default true)', sourceTenantSlug: 'string? (optional demo-only feed source override)' } },
    menuCard: { fields: { badgeText: 'string?', headline: 'string?', subline: 'string?', categories: '{ label: string, items: { title: string, description?: string, price?: string, image?: url, badge?: string, allergens?: string }[] }[]' } },
    // News / Collection previews
    newsPreview: { fields: { headline: 'string', subline: 'string?', collectionKey: 'string (default "news" — must match collection key)', collectionBasePath: 'string? (usually injected by renderer)', linkPrefix: 'string? (usually injected by renderer)', linkLabel: 'string? (default "Alle Beiträge")', linkHref: 'string? (auto-derived from collectionKey)' } },
    newsGrid: { fields: { /* identical to newsPreview */ headline: 'string', subline: 'string?', collectionKey: 'string (default "news")', collectionBasePath: 'string? (usually injected by renderer)', linkPrefix: 'string? (usually injected by renderer)', linkLabel: 'string?', linkHref: 'string?' } },
    collectionList: { fields: { headline: 'string?', subline: 'string?', collectionKey: 'string (must match collection key)', sortBy: '"date-desc"|"date-asc"|"alpha-asc"|"alpha-desc"|"priority" (default "date-desc")', columns: '2|3|4 (default 3)', showImage: 'boolean (default true)', showDate: 'boolean (default true)', showExcerpt: 'boolean (default true)', showSortControls: 'boolean (default true)' } },
    shopProductGrid: { fields: { headline: 'string?', showSearch: 'boolean?', showCategories: 'boolean?', columns: '2|3|4?', basePath: 'string? (default "/shop")' } },
    shopProductDetail: { fields: { _slug: 'string? (usually injected by PDP route)', tenantId: 'string? (usually injected by PDP route)', basePath: 'string? (default "/shop")' } },
    shopFeaturedProducts: { fields: { headline: 'string?', mode: '"latest"|"category"|"manual"?', categorySlug: 'string?', productIds: 'string[]?', count: 'number?', columns: '2|3|4?', basePath: 'string? (default "/shop")' } },
    shopCategoryOverview: { fields: { headline: 'string?', subline: 'string?', columns: '2|3|4?', basePath: 'string? (default "/shop")', shopGridPath: 'string? (default basePath)' } },
    shopCart: { fields: { headline: 'string?', checkoutPath: 'string? (default "/checkout")', continueShoppingPath: 'string? (default "/shop")' } },
    shopCheckout: { fields: { headline: 'string?', thankYouPath: 'string? (default "/danke")', requirePhone: 'boolean?', showCompanyField: 'boolean?', tenantId: 'string? (usually injected by checkout route/page renderer)' } },
    shopThankYou: { fields: { headline: 'string?', subline: 'string?', orderNumberLabel: 'string?', continueShoppingPath: 'string? (default "/shop")', ctaLabel: 'string?' } },
    // Additional shared sections
    timeline: { fields: { badge: 'string?', headline: 'string', subline: 'string?', entries: '{ year: string, title: string, text: string }[]' } },
    comparisonTable: { fields: { badge: 'string?', headline: 'string', text: 'string?', columns: '{ label: string }[]', rows: '{ feature: string, values: string[] }[]', highlightCol: 'number? (index of highlighted column, -1 for none)' } },
    socialProofBar: { fields: { items: '{ value: string, label: string, icon?: lucide-icon-name, logo?: url }[]', bgStyle: '"light"|"dark"|"primary"?' } },
    logoCloud: { fields: { headline: 'string?', subline: 'string?', logos: '{ src: url, alt: string, href?: url }[]' } },
    headerBanner: { fields: { items: '{ text: string, link?: string }[]', style: '"warning"|"info"|"neutral"?' } },
    ctaLinks: { fields: { headline: 'string', subline: 'string?', links: '{ label: string, href: string, icon?: lucide-icon-name, description?: string }[]' } },
    serviceDetail: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', items: '{ title: string, text: string, image?: url, icon?: lucide-icon-name, mediaType?: "icon"|"image", features?: string[], ctaLabel?: string, ctaHref?: string }[]' } },
    portfolio: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', projects: '{ title: string, category?: string, description?: string, image: url, href?: string, icon?: lucide-icon-name, stats?: { label: string, value: string }[] }[]', ctaLabel: 'string?', ctaHref: 'string?' } },
    // Tattoo sections
    aftercareSteps: { fields: { headline: 'string', subline: 'string?', steps: '{ title: string, description: string }[]' } },
    artistGrid: { fields: { headline: 'string', subline: 'string?', artists: '{ name: string, image: url, styles: string[], bio?: string, instagram?: string, href?: string }[]' } },
    artistHero: { fields: { name: 'string', image: 'url', bio: 'string (html)', styles: 'string[]', instagram: 'string?', experience: 'string?' } },
    styleGallery: { fields: { headline: 'string', subline: 'string?', styles: '{ name: string, image: url, description?: string }[]' } },
    pricingInfo: { fields: { headline: 'string', subline: 'string?', items: '{ label: string, value: string, note?: string }[]', notes: 'string[]?' } },
    tattooBooking: { fields: { headline: 'string', subline: 'string?', artists: 'string[]? (dropdown options)' } },
    tattooBookingCta: { fields: { badge: 'string?', badgeText: 'string?', headline: 'string', subline: 'string?', ctaLabel: 'string?', ctaHref: 'string? (default "#kontakt")', hints: 'string[]?' } },
    flashDayBanner: { fields: { headline: 'string', date: 'string', description: 'string?', ctaLabel: 'string?', ctaHref: 'string?', bgColor: 'hex?' } },
    // Medical extras
    downloadForms: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', items: '{ title: string, text?: string, fileLabel?: string, fileHref?: string, metaLabel?: string }[]' } },
    practiceGallery: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', images: '{ src: url, alt?: string, caption?: string, category?: string }[]' } },
    practiceTeam: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', members: '{ name: string, role?: string, bio?: string, image?: url }[]' } },
    // Tourism extras
    downloadGuides: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', items: '{ title: string, text?: string, fileLabel?: string, fileHref?: string, metaLabel?: string }[]' } },
    placesMap: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', mapEmbedUrl: 'string? (iframe embed URL)', places: '{ title: string, text?: string, category?: string, distanceLabel?: string, address?: string, image?: url, cta?: { label: string, href: string } }[]', ctaPrimary: '{ label: string, href: string }?' } },
    // Cafe extras
    cafeEventCalendar: { fields: { headline: 'string', subline: 'string?', events: '{ title: string, date: string, time: string, description?: string, image?: url, category?: string }[]' } },
    // Premium interactive sections
    verticalTimeline: { fields: { headline: 'string?', subline: 'string?', steps: '{ number?: string, timeLabel?: string, title: string, text?: string, checkmarks?: string[] }[]' } },
    beforeAfterSlider: { fields: { headline: 'string?', subline: 'string?', slides: '{ imageBefore: url, imageAfter: url, labelBefore?: string, labelAfter?: string, caption?: string }[]', aspectRatio: '"16/9"|"4/3"|"1/1"?' } },
    horizontalScrollShowcase: { fields: { headline: 'string?', subline: 'string?', panels: '{ image: url, title: string, text?: string, ctaLabel?: string, ctaHref?: string }[]', panelHeight: '"full"|"compact"?' } },
    cinematicHero: { fields: { eyebrow: 'string?', headline: 'string', subline: 'string?', image: 'url?', videoUrl: 'url?', overlay: 'rgba()?', align: '"left"|"center"?', primaryCta: '{ label: string, href: string }?', secondaryCta: '{ label: string, href: string }?', facts: '{ value: string, label: string }[]?' } },
    spotlightCards: { fields: { badge: 'string?', headline: 'string', subline: 'string?', cards: '{ title: string, text?: string, icon?: lucide-icon-name, image?: url, href?: string }[]' } },
    scrollStory: { fields: { headline: 'string', subline: 'string?', steps: '{ kicker?: string, title: string, text?: string, image?: url }[]' } },
    premiumComparison: { fields: { badge: 'string?', headline: 'string', subline: 'string?', columns: '{ label: string, note?: string }[]', rows: '{ feature: string, values: (string|boolean)[] }[]', highlightCol: 'number?' } },
    immersiveCtaBanner: { fields: { badge: 'string?', headline: 'string', subline: 'string?', image: 'url?', overlay: 'rgba()?', primaryCta: '{ label: string, href: string }?', secondaryCta: '{ label: string, href: string }?', metrics: '{ value: string, label: string }[]?' } },
    proofWall: { fields: { badge: 'string?', headline: 'string', subline: 'string?', stats: '{ value: string, label: string }[]?', proofs: '{ value?: string, label: string, note?: string }[]?', reviews: '{ quote: string, name: string, context?: string, rating?: number }[]?', logos: '{ name: string, image?: url }[]?' } },
    editorialFeatureRail: { fields: { badge: 'string?', headline: 'string', subline: 'string?', items: '{ kicker?: string, title: string, text?: string, image?: url, ctaLabel?: string, ctaHref?: string }[]' } },
    offerCampaignStrip: { fields: { badge: 'string?', headline: 'string', subline: 'string?', image: 'url?', offerLabel: 'string?', deadline: 'string?', benefits: 'string[]?', cta: '{ label: string, href: string }?' } },
    beforeAfterStoryPro: { fields: { badge: 'string?', headline: 'string', problem: 'string?', solution: 'string?', result: 'string?', beforeImage: 'url?', afterImage: 'url?', points: '{ value?: string, label: string }[]?', cta: '{ label: string, href: string }?' } },
    signatureGrid: { fields: { badge: 'string?', headline: 'string', subline: 'string?', image: 'url?', traits: '{ title: string, text?: string, icon?: lucide-icon-name }[]?', stats: '{ value: string, label: string }[]?' } },
    comparisonCardsPro: { fields: { badge: 'string?', headline: 'string', subline: 'string?', plans: '{ name: string, price?: string, note?: string, highlighted?: boolean, features?: string[], missing?: string[], ctaLabel?: string, ctaHref?: string }[]' } },
    templateAdvantage: { fields: { badge: 'string?', headline: 'string', subline: 'string?', bullets: 'string[]?', cards: '{ title?: string, text?: string, image?: url, href?: string, label?: string }[]', cta: '{ label?: string, href?: string }?' } },
    principlesGrid: { fields: { badge: 'string?', headline: 'string', subline: 'string?', principles: '{ eyebrow?: string, title?: string, text?: string }[]', cta: '{ label?: string, href?: string }?' } },
    serviceTabs: { fields: { badge: 'string?', headline: 'string?', subline: 'string?', tabs: '{ label: string, icon?: lucide-icon-name, title?: string, text?: string (html), image?: url, features?: string[], cta?: { label: string, href: string } }[] (3-5 tabs empfohlen)' } },
    priceCalculator: { fields: { badge: 'string?', headline: 'string', subline: 'string?', currency: 'string? (default "€")', basePrice: 'number?', baseLabel: 'string? (default "Grundpreis")', priceNote: 'string? (Hinweis unter der Summe)', options: '{ label: string, description?: string, type?: "select"|"toggle"|"quantity", choices?: { label: string, price?: number }[] (nur für select), price?: number (für toggle/quantity), min?: number, max?: number }[]', cta: '{ label: string, href: string }?' } },
    smartInquiry: { fields: { badge: 'string?', headline: 'string', subline: 'string?', trustNote: 'string?', goals: '{ label: string, description?: string, icon?: lucide-icon-name }[] (3–6 konkrete Besucherziele)', scopeLabel: 'string?', scopeOptions: '{ label: string, description?: string }[]?', timingLabel: 'string?', timingOptions: '{ label: string, description?: string }[]?', budgetLabel: 'string?', budgetOptions: '{ label: string, description?: string }[]?', fields: '{ name: string, label: string, type: "text"|"email"|"tel"|"textarea"|"select", placeholder?: string, required?: boolean, options?: string[], halfWidth?: boolean }[]?', nextLabel: 'string?', backLabel: 'string?', submitLabel: 'string?', summaryTitle: 'string?', summaryEmptyText: 'string?' }, note: 'Branchenneutrale Premium-Anfrage in drei kurzen Schritten. Ziele und Optionen konkret, überschneidungsfrei und aus Besuchersicht formulieren.' },
    mobileActionDock: { fields: { compactLabel: 'string? (kurzer Kontext über den Aktionen)', revealAfterScroll: 'boolean? (auf Mobilgeräten erst nach Scrollen zeigen)', revealAfterPx: 'number? (0–2000, default 220)', desktopMode: '"hidden"|"inline"? (default hidden)', hideOnPaths: 'string[]? (z.B. ["/checkout", "/warenkorb"])', actions: '{ kind: "call"|"route"|"booking"|"enquiry"|"internal"|"cart", label: string, href: safe-url, icon?: lucide-icon-name }[] (1–3 Aktionen)' }, note: 'Mobile Conversion-Leiste. Keine personenbezogenen Daten oder Tracking-IDs eintragen; data-event/data-action stehen für spätere First-Party-Analytics bereit.' },
    jobListings: { fields: { badge: 'string?', headline: 'string', subline: 'string?', benefits: 'string[]? (Benefit-Pills über den Jobs)', jobs: '{ title: string, location?: string, type?: string (z.B. "Vollzeit"), schedule?: string, text?: string, href?: string, tags?: string[] }[]', emptyText: 'string? (Text wenn keine Jobs)', contactCta: '{ label: string, href: string }?' } },
    ctaSplit: { fields: { badge: 'string?', headline: 'string', text: 'string? (html)', image: 'url?', checklist: 'string[]?', primaryCta: '{ label: string, href: string }?', secondaryCta: '{ label: string, href: string }?', note: 'string? (Kleingedrucktes unter den Buttons)', reversed: 'boolean? (Bild links)' } },
    openingStatus: { fields: { badge: 'string?', headline: 'string?', subline: 'string?', days: '{ day: string (z.B. "Montag"), hours?: string (z.B. "09:00 – 18:00", auch "09:00–13:00, 14:00–18:00"), closed?: boolean, note?: string }[]', address: 'string?', phone: 'string?', openLabel: 'string?', closedLabel: 'string?', note: 'string?' } },
    teamSpotlight: { fields: { badge: 'string?', headline: 'string?', subline: 'string?', members: '{ name: string, role?: string, image?: url (3:4 Portrait), quote?: string, focus?: string[], instagram?: url, linkedin?: url, email?: string }[]' } },
    faqContactSplit: { fields: { badge: 'string?', headline: 'string?', subline: 'string?', items: '{ question: string, answer: string (html) }[]', contactTitle: 'string?', contactText: 'string?', phone: 'string?', email: 'string?', whatsapp: 'string? (Nummer)', cta: '{ label: string, href: string }?' } },
    galleryPro: { fields: { badge: 'string?', headline: 'string?', subline: 'string?', images: '{ src: url, alt?: string, category?: string, caption?: string }[]', categories: 'string[]? (leer = automatisch aus Bildern)' } },
    editorialHero: { fields: { eyebrow: 'string?', headline: 'string', text: 'string? (html)', imagePrimary: 'url (4:5 Portrait)', imageSecondary: 'url? (überlappendes Quadrat)', primaryCta: '{ label: string, href: string }?', secondaryCta: '{ label: string, href: string }?', hint: 'string? (kleine Zeile unter den Buttons)' } },
    zigzagShowcase: { fields: { startRight: 'boolean? (erste Reihe Bild rechts)', rows: '{ eyebrow?: string, headline: string, text?: string (html), image?: url (4:3), imageAlt?: string, links?: { label: string, href: string }[] (max 2) }[]' } },
    nextMatchHero: { fields: { eyebrow: 'string?', headline: 'string', competition: 'string? (Liga/Wettbewerb)', dateLabel: 'string? (z.B. "Sa 12.10. · 19:30")', homeTeam: 'string', awayTeam: 'string', homeLogo: 'url?', awayLogo: 'url?', venue: 'string? (Halle/Ort)', image: 'url? (Hintergrund)', primaryCta: '{ label: string, href: string }? (Tickets)', secondaryCta: '{ label: string, href: string }?' } },
    matchSchedule: { fields: { badgeText: 'string?', headline: 'string', subline: 'string?', matches: '{ dateLabel?: string, competition?: string, homeTeam?: string, awayTeam?: string, venue?: string, result?: string (z.B. "3:2"), homeGame?: boolean, ticketHref?: string }[]' } },
    leagueTable: { fields: { badgeText: 'string?', headline: 'string', subline: 'string?', rows: '{ rank?: string, team: string, played?: string, won?: string, drawn?: string, lost?: string, points?: string, highlight?: boolean (eigenes Team) }[]' } },
    teamRoster: { fields: { badgeText: 'string?', headline: 'string', subline: 'string?', players: '{ number?: string, name: string, position?: string, image?: url (3:4 Portrait), nationality?: string }[]' } },
    sponsorsWall: { fields: { badgeText: 'string?', headline: 'string', subline: 'string?', tiers: '{ tierLabel?: string, logos: { name?: string, image?: url, href?: string }[] }[]' } },
    glowHero: { fields: { eyebrow: 'string?', headline: 'string', subline: 'string?', image: 'url?', glowColor: 'CSS color/rgba/hex — Farbe des Mouse-Glow-Effekts', primaryCta: '{ label?: string, href?: string }?', secondaryCta: '{ label?: string, href?: string }?', facts: '{ value?: string, label?: string }[]?' } },
    floristHero: { fields: { eyebrow: 'string?', headline: 'string', subline: 'string?', image: 'url?', glowColor: 'CSS color/rgba/hex — Farbe des Mouse-Glow-Effekts', primaryCta: '{ label?: string, href?: string }?', secondaryCta: '{ label?: string, href?: string }?', facts: '{ value?: string, label?: string }[]?' } },
    bouquetShowcase: { fields: { headline: 'string', subline: 'string?', columns: 'string? (2|3|4)', items: '{ image?: url, title: string, price?: string, badge?: string, href?: string, description?: string }[]' } },
    occasionMosaic: { fields: { headline: 'string', subline: 'string?', items: '{ image?: url, title: string, href?: string, size?: string (large|small) }[]' } },
    weddingFloristry: { fields: { headline: 'string', subline: 'string?', image: 'url', overlayOpacity: 'number? (0-1)', highlights: '{ title: string, text: string }[]', cta: '{ label: string, href: string }?' } },
    workshopBooking: { fields: { headline: 'string', subline: 'string?', image: 'url?', services: '{ icon?: lucide-icon-name, title: string, description?: string }[]', cta: '{ label: string, href: string }?' } },
    seasonalCampaign: { fields: { badge: 'string?', headline: 'string', subline: 'string?', image: 'url?', offerLabel: 'string?', deadline: 'string?', benefits: 'string[]?', cta: '{ label: string, href: string }?' } },
    floristMaterials: { fields: { headline: 'string', subline: 'string?', categories: 'string[]', items: '{ image?: url, name: string, category?: string }[]' } },
    fitnessHero: { fields: { eyebrow: 'string?', headline: 'string', subline: 'string?', image: 'url?', glowColor: 'CSS color/rgba/hex — Farbe des Mouse-Glow-Effekts', primaryCta: '{ label?: string, href?: string }?', secondaryCta: '{ label?: string, href?: string }?', facts: '{ value?: string, label?: string }[]?' } },
    programGrid: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', ctaLabel: 'string?', ctaHref: 'string?', manualCards: '{ title: string, text: string, icon?: lucide-icon-name, image?: url, mediaType?: icon|image, href?: string }[]' } },
    courseSchedule: { fields: { badge: 'string?', headline: 'string', subline: 'string?', entries: '{ year: string (z.B. "Mo 07:00"), title: string, text: string }[]' } },
    trainerProfiles: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', members: '{ name: string, role: string, image?: url, bio?: string }[]' } },
    membershipPlans: { fields: { badge: 'string?', headline: 'string', subline: 'string?', plans: '{ name: string, price?: string, note?: string, highlighted?: boolean, features?: string[], missing?: string[], ctaLabel?: string, ctaHref?: string }[]' } },
    trialSessionCta: { fields: { badge: 'string?', headline: 'string', subline: 'string?', image: 'url?', overlay: 'rgba()?', primaryCta: '{ label: string, href: string }?', secondaryCta: '{ label: string, href: string }?', metrics: '{ value: string, label: string }[]?' } },
    transformationStories: { fields: { badge: 'string?', headline: 'string', problem: 'string?', solution: 'string?', result: 'string?', beforeImage: 'url?', afterImage: 'url?', points: '{ value?: string, label: string }[]?', cta: '{ label: string, href: string }?' } },
    studioAmenities: { fields: { headline: 'string?', subline: 'string?', badge: 'string?', items: '{ title: string, description?: string, icon?: lucide-icon-name, size?: "sm"|"md"|"lg" }[]' } },
    locationHero: { fields: { eyebrow: 'string?', headline: 'string', subline: 'string?', image: 'url?', videoUrl: 'url?', overlay: 'rgba()?', align: '"left"|"center"?', primaryCta: '{ label: string, href: string }?', secondaryCta: '{ label: string, href: string }?', facts: '{ value: string, label: string }[]?' } },
    spaceShowcase: { fields: { headline: 'string', subline: 'string?', columns: 'string? (2|3|4)', items: '{ image?: url, title: string, price?: string, badge?: string, href?: string, description?: string }[]' } },
    eventTypes: { fields: { headline: 'string', subline: 'string?', items: '{ image?: url, title: string, href?: string, size?: string (large|small) }[]' } },
    availabilityCta: { fields: { badge: 'string?', headline: 'string', subline: 'string?', image: 'url?', overlay: 'rgba()?', primaryCta: '{ label: string, href: string }?', secondaryCta: '{ label: string, href: string }?', metrics: '{ value: string, label: string }[]?' } },
    locationPackages: { fields: { badge: 'string?', headline: 'string', subline: 'string?', plans: '{ name: string, price?: string, note?: string, highlighted?: boolean, features?: string[], missing?: string[], ctaLabel?: string, ctaHref?: string }[]' } },
    amenitiesGrid: { fields: { headline: 'string?', subline: 'string?', badge: 'string?', items: '{ title: string, description?: string, icon?: lucide-icon-name, size?: "sm"|"md"|"lg" }[]' } },
    floorPlanOverview: { fields: { headline: 'string', text: 'string (html)', badge: 'string?', image: 'url', imageAlt: 'string?', layout: '"image-right"|"image-left"', items: '{ icon?: lucide-icon-name, title: string, text: string }[]?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?' } },
    galleryMoodboard: { fields: { headline: 'string', subline: 'string?', columns: '2|3|4?', images: '{ src: url, alt: string, caption?: string }[]' } },
    locationAccess: { fields: { headline: 'string?', embedUrl: 'Google Maps Embed-URL', height: '"s"|"m"|"l"?' } },
    hostTeam: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', members: '{ name: string, role: string, image?: url, bio?: string }[]' } },
    dualWave: { fields: { badge: 'string?', headline: 'string', subline: 'string?', preset: '"calm"|"editorial"|"dynamic"?', items: '{ title: string, text?: string, image?: url, href?: safe-url }[] (6–12 kurze Einträge empfohlen)' }, note: 'Advanced Section. Nur eine Liste liefern; die zweite Welle wird automatisch erzeugt. Kein AI-Autofill ohne expliziten API-Aufruf.' },
    cinematicChapters: { fields: { badge: 'string?', headline: 'string', intro: 'string?', subline: 'string? (legacy alias for intro)', transition: '"crossfade"|"push"|"depth"?', chapters: '{ kicker?: string, title: string, text?: string, image: url, ctaLabel?: string, ctaHref?: safe-url }[] (3–6 Kapitel)' }, note: 'Advanced Section mit begrenztem native-scroll Storybereich. Kurze Texte und kohärente Bildsprache verwenden.' },
    transformationSequence: { fields: { badge: 'string?', headline: 'string', subline: 'string?', states: '{ kicker?: string, title: string, text?: string, image: url, metricValue?: string, metricLabel?: string }[] (3–6 chronologische Zustände)', cta: '{ label: string, href: safe-url }?' }, note: 'Advanced Section. Zustände müssen eine echte, nachvollziehbare Entwicklung abbilden.' },
    xrayReveal: { fields: { badge: 'string?', headline: 'string', subline: 'string?', imageBase: 'url (Bild A, identischer Zuschnitt wie Bild B)', imageReveal: 'url (Bild B, identischer Zuschnitt wie Bild A)', labelBase: 'string?', labelReveal: 'string?', caption: 'string?', revealStyle: '"lens"|"soft"|"scan"?', aspectRatio: '"16/9"|"4/3"|"1/1"?' }, note: 'Advanced Section. Nur verwenden, wenn beide Bilder Perspektive, Abmessungen und Fokus exakt teilen.' },
    sceneLab: { fields: { badge: 'string?', headline: 'string', subline: 'string?', baseImage: 'url', aspectRatio: '"16/9"|"4/3"|"1/1"?', groups: '{ id: stable-string, label: string, description?: string, choices: { id: stable-string, label: string, image: url (transparenter deckungsgleicher Layer), swatch?: css-color, description?: string, priceLabel?: string }[] }[]', defaultSelections: 'Record<groupId, choiceId>?', cta: '{ label: string, href: safe-url }?' }, note: 'Advanced 2D-Konfigurator. Alle Choice-Layer müssen transparent, deckungsgleich und im Format des Basisbilds sein.' },
    infiniteCanvas: { fields: { badge: 'string?', headline: 'string', subline: 'string?', ctaLabel: 'string?', items: '{ image: url, alt: string, title?: string, caption?: string, category?: string, href?: safe-url, featured?: boolean }[] (10–40 Bilder empfohlen)' }, note: 'Advanced Section. Explorer öffnet erst nach expliziter Besucheraktion; Positionen werden automatisch berechnet.' },
    kineticIdentity: { fields: { badge: 'string?', headline: 'string', subline: 'string?', preset: '"editorial"|"architectural"|"expressive"?', statements: '{ id?: stable-string, prefix?: string, highlight: string, suffix?: string, text?: string, image?: url }[] (3–6 Aussagen)', cta: '{ label: string, href: safe-url }?' }, note: 'Advanced Section. Das highlight ist das typografische Fokuswort; Aussagen kurz halten. Mobile rendert eine statische hochwertige Sequenz.' },
    signaturePath: { fields: { badge: 'string?', headline: 'string', subline: 'string?', pathPreset: '"flow"|"route"|"craft"|"pulse"?', items: '{ id?: stable-string, title: string, text?: string, icon?: lucide-icon-name, image?: url, href?: safe-url }[] (3–7 Stationen)', cta: '{ label: string, href: safe-url }?' }, note: 'Advanced Section. Keine SVG-Pfade oder Koordinaten liefern; Flamingo erzeugt Pfad und Positionen aus dem Preset.' },
    layeredAnatomy: { fields: { badge: 'string?', headline: 'string', subline: 'string?', mode: '"hotspots"|"layers" (default hotspots)', baseImage: 'url', aspectRatio: '"16/9"|"4/3"|"1/1"?', hotspots: '{ id?: stable-string, x: number 0–100, y: number 0–100, title: string, text?: string, icon?: lucide-icon-name }[] (2–8 im hotspots-Modus)', layers: '{ id?: stable-string, image: url (transparenter ausgerichteter Layer), title: string, text?: string, direction: "left"|"right"|"up"|"down", depth?: number 1–8 }[] (2–8 im layers-Modus)', cta: '{ label: string, href: safe-url }?' }, note: 'Advanced Section mit zwei Modi. Pro-Layer nur mit transparenten, pixelgenau zum Basisbild ausgerichteten Assets verwenden; sonst hotspots wählen.' },
    guidedChoice: { fields: { badge: 'string?', headline: 'string', subline: 'string?', mode: '"score"|"branch" (default score)', restartLabel: 'string?', questions: '{ id: stable-string, label: string, description?: string, answers: { id: stable-string, label: string, description?: string, scores?: { resultId: stable-string, points: integer 0–10 }[], nextQuestionId?: stable-string, resultId?: stable-string }[] (2–4 Antworten) }[] (2–6 Fragen)', results: '{ id: stable-string, title: string, text?: string, image?: url, features?: string[], cta?: { label: string, href: safe-url } }[] (2–6 Ergebnisse)' }, note: 'Advanced Empfehlung. Score: jede Antwort braucht mindestens einen gültigen Score; erster Result-Eintrag gewinnt deterministische Gleichstände. Branch: jede Antwort braucht genau ein erreichbares Ziel; keine Zyklen oder Sackgassen.' },
    dayToNight: { fields: { badge: 'string?', headline: 'string', subline: 'string?', scenes: '{ id?: stable-string, time: string, label: string, title: string, text?: string, image: url, tint?: sanitized-css-color }[] (2–4 chronologisch geordnete Szenen)', cta: '{ label: string, href: safe-url }?' }, note: 'Advanced Section ohne Scroll-Hijacking. Ein Bild darf mit unterschiedlichen Tints wiederholt werden; mehrere koordinierte Bilder sind besser.' },
    livingBlueprint: { fields: { badge: 'string?', headline: 'string', subline: 'string?', layout: '"flow"|"radial"|"blueprint"?', nodes: '{ id: stable-string, title: string, text?: string, icon?: lucide-icon-name, image?: url, metric?: string }[] (3–8 Knoten)', cta: '{ label: string, href: safe-url }?' }, note: 'Advanced Section. Keine SVG-Daten, Verbindungen oder Koordinaten liefern; sie werden aus Reihenfolge und Layout-Preset erzeugt.' },
    editorialCardMorph: { fields: { badge: 'string?', headline: 'string', subline: 'string?', layout: '"stack"|"rail"?', items: '{ id?: stable-string, kicker?: string, title: string, text?: string, image: url, facts?: { value: string, label: string }[] (max 4), href?: safe-url, ctaLabel?: string }[] (3–8 Cases)' }, note: 'Advanced Editorial Section. items kann manuell gepflegt oder durch die bestehende Collection-Injektion geliefert werden; kein separates Collection-System anlegen.' },
    materialAtelier: { fields: { badge: 'string?', headline: 'string', subline: 'string?', preset: '"architectural"|"quiet"|"editorial"?', items: '{ id?: stable-string, title: string, kicker?: string, text?: string, image: url, href?: safe-url, meta?: string[] }[] (3–8 Positionen)', cta: '{ label: string, href: safe-url }?' }, note: 'Advanced Section für Materialien, Leistungen, Kollektionen, Räume oder Produkte. Das Ledger entsteht automatisch aus einer einzigen geordneten Liste; keine Koordinaten oder separaten Mobile-Daten liefern.' },
  };

  if (industry === 'wedding') {
    Object.assign(schemas, {
      hero: { fields: { headline: 'string?', subline: 'string?', names: 'string?', coupleName: 'string (z.B. "Anna & Max")', date: 'YYYY-MM-DD', venue: 'string', tagline: 'string?', showCountdown: 'boolean?', bgImage: 'url?', bgImageMobile: 'url?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string?', bgPositionMobile: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
      coupleStory: { fields: { headline: 'string', subline: 'string?', milestones: '{ year: string, title: string, text: string, image?: url }[]' } },
      eventSchedule: { fields: { headline: 'string', subline: 'string?', events: '{ time: string, title: string, description: string, icon?: lucide-icon-name, location?: string }[]' } },
      venueInfo: { fields: { headline: 'string', subline: 'string?', venues: '{ name: string, image?: url, address: string, description: string, mapEmbed?: url, parkingInfo?: string }[]' } },
      travelInfo: { fields: { badge: 'string?', headline: 'string', subline: 'string?', sections: '{ title: string, icon?: lucide-icon-name, content: string }[]', directions: '{ title: string, icon?: lucide-icon-name, text?: string, content?: string }[]?', hotels: '{ name: string, image?: url, link?: url, distance: string, specialRate?: string, stars?: string }[]', accommodations: '{ name: string, description?: string, image?: url, link?: url }[]?', address: 'string?', contact: 'string?', image: 'url?', mapUrl: 'url?', venues: '{ name?: string, address?: string, contact?: string }[]?' } },
      weddingParty: { fields: { headline: 'string', subline: 'string?', members: '{ name: string, role: string, relationship?: string, text?: string, image?: url }[]' } },
      giftRegistry: { fields: { headline: 'string', subline: 'string?', freeText: 'string?', gifts: '{ title: string, description?: string, link?: url, price?: string, claimed?: boolean }[]', bankInfo: '{ holder?: string, iban?: string, bic?: string, note?: string }?' } },
      dresscode: { fields: { headline: 'string', description: 'string?', colors: 'hex[]?', dos: 'string[]?', donts: 'string[]?', note: 'string?' } },
      rsvp: { fields: { headline: 'string', subline: 'string?', deadline: 'string?', maxGuests: 'number?', showSongWish: 'boolean?', showDietary: 'boolean?', showAllergies: 'boolean?' } },
      weddingMenu: { fields: { headline: 'string', subline: 'string?', note: 'string?', courses: '{ title: string, items: { name: string, description?: string }[] }[]' } },
      faq: { fields: { headline: 'string', items: '{ question: string, answer: string }[]', images: '{ src?: url, image?: url, alt?: string, caption?: string }[]?' } },
      gallery: { fields: { headline: 'string', images: '{ src: url, alt?: string }[]', items: '{ src?: url, image?: url, alt?: string, caption?: string }[]?' } },
    });
  } else if (industry === 'tradesman') {
    Object.assign(schemas, {
      uspStrip: { fields: { items: '{ icon: lucide-icon-name, title: string, text: string }[]' } },
      servicesGrid: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', ctaLabel: 'string?', ctaHref: 'string?', manualCards: '{ title: string, text: string, icon?: lucide-icon-name, image?: url, mediaType?: icon|image, href?: string }[]' } },
      processSteps: { fields: { headline: 'string', badgeText: 'string?', steps: '{ icon: lucide-icon-name, title: string, text: string }[]' } },
      testimonials: { fields: { headline: 'string', badgeText: 'string?', items: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]' } },
      faq: { fields: { headline: 'string', badgeText: 'string?', expandFirst: 'boolean?', items: '{ question: string, answer: string }[]' } },
      ctaBand: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', ctaPrimary: '{ label: string, href: string, icon?: lucide-icon-name }' } },
      contact: { fields: { headline: 'string', introText: 'string?', badgeText: 'string?', formEnabled: 'boolean (default true)', submitLabel: 'string?', formFields: '{ name: string, type: "text"|"email"|"tel"|"textarea", required?: boolean }[]?', infoCards: '{ icon: lucide-icon-name, label: string, value: string }[] (z.B. Phone/Mail/Adresse/Öffnungszeiten)' } },
      map: { fields: { headline: 'string?', embedUrl: 'Google Maps Embed-URL (https://www.google.com/maps/embed?pb=...)', height: '"s"|"m"|"l" (default "m")' } },
      team: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', membersHeadline: 'string?', members: '{ name: string, role: string, image?: url, bio?: string }[]', storyHeadline: 'string?', storyText: 'string?', storyImage: 'url?', valuesHeadline: 'string?', values: '{ icon: lucide-icon-name, title: string, text: string }[]?', stats: '{ value: string, label: string }[]?' } },
      textImage: { fields: { headline: 'string', text: 'string (html)', badge: 'string?', image: 'url', imageAlt: 'string?', layout: '"image-right" | "image-left"', items: '{ icon?: lucide-icon-name, title: string, text: string }[]?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?' } },
      galleryGrid: { fields: { headline: 'string', subline: 'string?', columns: '2|3|4?', images: '{ src: url, alt: string, caption?: string }[]' } },
      stats: { fields: { headline: 'string?', stats: '{ icon?: lucide-icon-name, value: number|string, suffix?: string, prefix?: string, label: string }[] (value: number for animated counter, or string like "seit 2019" for text facts)' } },
      richText: { fields: { headline: 'string?', content: 'string (html)' } },
      collectionHero: { fields: { headline: 'string', subline: 'string?', bgImage: 'url?', category: 'string?', overlayColor: 'hex?', overlayOpacity: '0-1?' } },
    });
  } else if (industry === 'restaurant' || industry === 'bar') {
    Object.assign(schemas, {
      menu: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', introText: 'string?', footnote: 'string?', ctaPrimary: '{ label: string, href: string }?', categories: '{ title: string, description?: string, items: { name: string, description?: string, price?: string, image?: url, allergens?: string[], tags?: string[], highlighted?: boolean, vegetarian?: boolean, vegan?: boolean, spicy?: boolean }[] }[]' } },
      reservation: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', introText: 'string? (html)', formEnabled: 'boolean (default true — shows real reservation form)', submitLabel: 'string? (default "Anfrage senden")', phoneCta: '{ label: string, href: string }? (e.g. { label: "Anrufen", href: "tel:+49..." })', externalBookingCta: '{ label: string, href: string }? (external booking link)', partySizeOptions: 'string[]? (e.g. ["1-2","3-4","5-6","7+"])', timeHint: 'string? (e.g. "Di–Sa 18:00–22:00")', policyText: 'string? (cancellation note)', image: 'image-path?' } },
      openingHours: { fields: { headline: 'string', days: '{ label: string, hours: string }[]' } },
      signatureDishes: { fields: { headline: 'string', dishes: '{ name: string, description: string, image?: url, price?: string }[]' } },
      events: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', fallbackText: 'string?', events: '{ title: string, description: string, image?: url, dateLabel?: string, timeLabel?: string, priceLabel?: string, cta?: { label: string, href: string } }[]' } },
      ambience: { fields: { headline: 'string', subline: 'string? (html allowed)', badgeText: 'string?', imagePrimary: 'url (main large image)', imageSecondary: 'url? (smaller square image)', imageTertiary: 'url? (smaller square image)', highlights: '{ title: string, text?: string (html), icon?: lucide-icon-name }[]', ctaPrimary: '{ label: string, href: string }?' } },
      story: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', storyText: 'string (html)', imagePrimary: 'url?', imageSecondary: 'url?', founderName: 'string?', founderRole: 'string?', founderQuote: 'string?', values: '{ icon: lucide-icon-name, title: string, text: string }[]?', milestones: '{ year: string, title: string, text: string }[]?', ctaPrimary: '{ label: string, href: string }?' } },
      testimonials: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', ratingValue: 'string? (e.g. "4.9")', ratingCount: 'string? (e.g. "230+ Bewertungen")', items: '{ quote: string, name: string, context?: string, rating?: 1-5, sourceLabel?: string }[]', ctaPrimary: '{ label: string, href: string }?' } },
      faq: { fields: { headline: 'string', items: '{ question: string, answer: string }[]', ctaPrimary: '{ label: string, href: string }?' } },
      contact: { fields: { headline: 'string', subline: 'string?', image: 'url?', mapEmbedUrl: 'url?', formEnabled: 'boolean?', primaryCta: '{ label: string, href: string }?', secondaryCta: '{ label: string, href: string }?', infoCards: '{ icon: lucide-icon-name, label: string, value: string }[]?' } },
      gallery: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', images: '{ src: url, alt?: string, caption?: string, category?: string }[]', items: '{ src?: url, image?: url, alt?: string, caption?: string, category?: string }[]?', ctaPrimary: '{ label: string, href: string }?' } },
    });
  } else if (industry === 'hotel') {
    Object.assign(schemas, {
      hero: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', badgeIcon: 'lucide-icon-name?', bgImage: 'url?', bgImageMobile: 'url?', bgColor: 'hex?', bgMode: '"image"|"color"|"gradient"?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', trustItems: 'string[]?', trustStripColor: 'hex?', ratingText: 'string?', availabilityHint: 'string?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string?', bgPositionMobile: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
      bookingStrip: { fields: { headline: 'string', subline: 'string? (html)', badgeText: 'string?', submitCta: '{ label: string, href: string } (link to external booking platform)', secondaryCta: '{ label: string, href: string }?', bookingNote: 'string? (e.g. "Bestpreisgarantie bei Direktbuchung")', trustItems: '{ icon?: lucide-icon-name, text: string }[]? (e.g. [{ icon: "shield", text: "Kostenlose Stornierung" }])' } },
      roomShowcase: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', footerText: 'string?', rooms: '{ name: string, description: string, image: url, priceLabel: string, sizeLabel?: string, occupancyLabel?: string, bedLabel?: string, features: string[], detailCta?: { label: string, href: string }, bookingCta?: { label: string, href: string }, highlighted?: boolean, galleryImages?: url[] }[]' } },
      amenities: { fields: { headline: 'string', subline: 'string?', items: '{ icon: lucide-icon-name, title: string, text: string, image?: url }[]', ctaPrimary: '{ label: string, href: string }?' } },
      wellness: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', introText: 'string?', imagePrimary: 'url?', imageSecondary: 'url?', treatments: '{ title: string, text: string, durationLabel?: string, priceLabel?: string, image?: url, cta?: { label: string, href: string } }[]', features: '{ icon: lucide-icon-name, title: string, text: string }[]?', ctaPrimary: '{ label: string, href: string }?' } },
      location: { fields: { headline: 'string', subline: 'string?', addressText: 'string', address: 'string? (legacy alias for addressText)', phone: 'string?', email: 'string?', mapEmbedUrl: 'url?', image: 'url?', transportItems: '{ icon: lucide-icon-name, label: string, value: string }[]?', nearbyItems: '{ title: string, distanceLabel: string, text?: string }[]?', routeCta: '{ label: string, href: string }?' } },
      hotelDining: { fields: { headline: 'string', subline: 'string?', introText: 'string?', image: 'url?', openingText: 'string?', menus: '{ title: string, description: string, timeLabel?: string, priceLabel?: string }[]', ctaPrimary: '{ label: string, href: string }?' } },
      eventSpaces: { fields: { headline: 'string', subline: 'string?', spaces: '{ name: string, description: string, image: url, capacityLabel?: string, sizeLabel?: string, features: string[] }[]', ctaPrimary: '{ label: string, href: string }?' } },
      offers: { fields: { headline: 'string', subline: 'string?', offers: '{ title: string, description: string, image?: url, priceLabel?: string, durationLabel?: string, includes: string[], cta?: { label: string, href: string }, highlighted?: boolean }[]' } },
      story: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', storyText: 'string (html)', imagePrimary: 'url?', imageSecondary: 'url?', founderName: 'string?', founderRole: 'string?', founderQuote: 'string?', stats: '{ value: string, label: string }[]?', values: '{ icon: lucide-icon-name, title: string, text: string }[]?', milestones: '{ year: string, title: string, text: string }[]?', ctaPrimary: '{ label: string, href: string }?' } },
      testimonials: { fields: { headline: 'string', sourceLabel: 'string?', items: '{ quote: string, name: string, context?: string, rating?: 1-5, sourceLabel?: string }[]' } },
      faq: { fields: { headline: 'string', items: '{ question: string, answer: string }[]', ctaPrimary: '{ label: string, href: string }?' } },
      contact: { fields: { headline: 'string', subline: 'string?', image: 'url?', mapEmbedUrl: 'url?', formEnabled: 'boolean?', contactCta: '{ label: string, href: string }?', routeCta: '{ label: string, href: string }?', infoCards: '{ icon: lucide-icon-name, label: string, value: string }[]?' } },
      gallery: { fields: { headline: 'string', images: '{ src: url, alt?: string, caption?: string }[]', items: '{ src?: url, image?: url, alt?: string, caption?: string }[]?' } },
    });
  } else if (industry === 'salon') {
    Object.assign(schemas, {
      hero: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', badgeIcon: 'lucide-icon-name?', bgImage: 'url?', bgImageMobile: 'url?', bgColor: 'hex?', bgMode: '"image"|"color"|"gradient"?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', trustItems: 'string[]?', trustStripColor: 'hex?', ratingText: 'string?', bookingHint: 'string?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string?', bgPositionMobile: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
      serviceMenu: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', ctaPrimary: '{ label: string, href: string }?', categories: '{ title: string, text?: string, image?: url, category?: string, services: string[] (z.B. ["Waschen & Schneiden", "Färben", "Styling"]), cta?: { label: string, href: string } }[]' } },
      priceList: { fields: { headline: 'string', subline: 'string?', categories: '{ title: string, items: { name: string, description?: string, durationLabel?: string, priceLabel: string }[] }[]', footnote: 'string?' } },
      packages: { fields: { headline: 'string', subline: 'string?', packages: '{ title: string, text: string, image?: url, priceLabel: string, includes: string[], cta?: { label: string, href: string } }[]' } },
      teamShowcase: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', members: '{ name: string, role: string, bio?: string, image?: url, specialties: string[], bookingCta?: { label: string, href: string } }[]' } },
      expertiseGrid: { fields: { headline: 'string', subline: 'string?', items: '{ icon: lucide-icon-name, title: string, text: string }[]' } },
      beforeAfter: { fields: { headline: 'string', subline: 'string?', items: '{ title: string, text?: string, beforeImage: url, afterImage: url, category?: string }[]' } },
      bookingCta: { fields: { headline: 'string', subline: 'string?', introText: 'string?', onlineCta: '{ label: string, href: string }?', phoneCta: '{ label: string, href: string }?', whatsappCta: '{ label: string, href: string }?', notes: 'string[]?' } },
      locationContact: { fields: { headline: 'string', subline: 'string?', image: 'url?', mapEmbedUrl: 'url?', formEnabled: 'boolean?', infoCards: '{ icon: lucide-icon-name, label: string, value: string }[]?' } },
      openingHours: { fields: { headline: 'string', days: '{ label: string, hours: string }[]' } },
      testimonials: { fields: { headline: 'string', items: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]' } },
      faq: { fields: { headline: 'string', items: '{ question: string, answer: string }[]', ctaPrimary: '{ label: string, href: string }?' } },
      gallery: { fields: { headline: 'string', images: '{ src: url, alt?: string }[]', items: '{ src?: url, image?: url, alt?: string, caption?: string }[]?' } },
    });
  } else if (industry === 'medical') {
    Object.assign(schemas, {
      hero: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', badgeIcon: 'lucide-icon-name?', specialtyLabel: 'string?', bgImage: 'url?', bgImageMobile: 'url?', bgColor: 'hex?', bgMode: '"image"|"color"|"gradient"?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', emergencyCta: '{ label: string, href: string, icon?: lucide-icon-name }?', emergencyHint: 'string?', trustItems: 'string[]?', trustStripColor: 'hex?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string?', bgPositionMobile: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
      serviceOverview: { fields: { headline: 'string', subline: 'string?', items: '{ title: string, text: string, image?: url, icon?: lucide-icon-name, cta?: { label: string, href: string } }[]' } },
      treatmentDetail: { fields: { headline: 'string', subline: 'string?', treatments: '{ title: string, text: string, image?: url, durationLabel?: string, steps: string[]? }[]' } },
      diagnostics: { fields: { headline: 'string', subline: 'string?', items: '{ title: string, text: string, image?: url, benefitLabel?: string, methodLabel?: string }[]' } },
      doctorTeam: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', doctors: '{ name: string, title: string, specialty: string, bio?: string, image?: url, languages: string[]?, appointmentCta?: { label: string, href: string } }[]' } },
      certifications: { fields: { headline: 'string', subline: 'string?', items: '{ icon: lucide-icon-name, title: string, text: string }[]' } },
      patientInfo: { fields: { headline: 'string', subline: 'string?', introText: 'string?', cards: '{ icon: lucide-icon-name, title: string, text: string, items: string[]? }[]' } },
      insuranceInfo: { fields: { headline: 'string', subline: 'string?', items: '{ title: string, text: string, typeLabel?: string, notice?: string }[]' } },
      appointmentCta: { fields: { headline: 'string', subline: 'string?', introText: 'string?', onlineCta: '{ label: string, href: string }?', phoneCta: '{ label: string, href: string }?', notes: 'string[]?' } },
      emergencyInfo: { fields: { headline: 'string', subline: 'string?', introText: 'string?', items: '{ title: string, text: string, phoneLabel?: string, phoneHref?: string }[]' } },
      equipmentHighlights: { fields: { headline: 'string', subline: 'string?', items: '{ title: string, text: string, image?: url, category?: string, benefitLabel?: string }[]' } },
      valuesGrid: { fields: { headline: 'string', subline: 'string?', items: '{ icon: lucide-icon-name, title: string, text: string }[]' } },
      openingHours: { fields: { headline: 'string', days: '{ label: string, hours: string }[]' } },
      testimonials: { fields: { headline: 'string', items: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]' } },
      faq: { fields: { headline: 'string', items: '{ question: string, answer: string }[]', ctaPrimary: '{ label: string, href: string }?' } },
      story: { fields: { headline: 'string', subline: 'string?', text: 'string (html)', image: 'url?', ctaPrimary: '{ label: string, href: string }?' } },
      gallery: { fields: { headline: 'string', images: '{ src: url, alt?: string }[]', items: '{ src?: url, image?: url, alt?: string, caption?: string }[]?' } },
      locationContact: { fields: { headline: 'string', subline: 'string?', mapEmbedUrl: 'url?', formEnabled: 'boolean?', infoCards: '{ icon: lucide-icon-name, label: string, value: string }[]?' } },
    });
  } else if (industry === 'tourism') {
    Object.assign(schemas, {
      hero: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', locationLabel: 'string?', seasonLabel: 'string?', bgImage: 'url?', bgImageMobile: 'url?', bgColor: 'hex?', bgMode: '"image"|"color"|"gradient"?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', trustItems: 'string[]?', trustStripColor: 'hex?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string?', bgPositionMobile: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
      destinationHighlights: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', items: '{ title: string, text: string, image: url, category?: string, cta?: { label: string, href: string } }[]', ctaPrimary: '{ label: string, href: string }?' } },
      experienceGrid: { fields: { headline: 'string', subline: 'string?', items: '{ title: string, text: string, image: url, category?: string, durationLabel?: string, priceLabel?: string, cta?: { label: string, href: string } }[]' } },
      seasonTeaser: { fields: { headline: 'string', subline: 'string?', seasons: '{ title: string, text: string, image: url, periodLabel?: string, cta?: { label: string, href: string } }[]' } },
      eventsCalendar: { fields: { headline: 'string', subline: 'string?', events: '{ title: string, text: string, image?: url, dateLabel: string, locationLabel?: string, category?: string, priceLabel?: string, cta?: { label: string, href: string } }[]' } },
      sightseeingList: { fields: { headline: 'string', subline: 'string?', items: '{ title: string, text: string, image: url, openingText?: string, category?: string, cta?: { label: string, href: string } }[]' } },
      tourRoutes: { fields: { headline: 'string', subline: 'string?', routes: '{ title: string, text: string, image: url, lengthLabel?: string, durationLabel?: string, difficultyLabel?: string, highlights: string[]?, cta?: { label: string, href: string } }[]' } },
      accommodationGrid: { fields: { headline: 'string', subline: 'string?', items: '{ title: string, text: string, image: url, typeLabel?: string, priceLabel?: string, amenities: string[]?, cta?: { label: string, href: string } }[]' } },
      visitorInfo: { fields: { headline: 'string', subline: 'string?', introText: 'string?', blocks: '{ title: string, text: string, icon?: lucide-icon-name, items: string[]? }[]' } },
      story: { fields: { headline: 'string', subline: 'string?', text: 'string (html)', image: 'url?', ctaPrimary: '{ label: string, href: string }?' } },
      testimonials: { fields: { headline: 'string', items: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]' } },
      faq: { fields: { headline: 'string', items: '{ question: string, answer: string }[]', ctaPrimary: '{ label: string, href: string }?' } },
      gallery: { fields: { headline: 'string', images: '{ src: url, alt?: string }[]', items: '{ src?: url, image?: url, alt?: string, caption?: string }[]?' } },
      tourismContact: { fields: { headline: 'string', subline: 'string?', mapEmbedUrl: 'url?', formEnabled: 'boolean?', infoCards: '{ icon: lucide-icon-name, label: string, value: string }[]?' } },
    });
  } else if (industry === 'photography') {
    Object.assign(schemas, {
      portfolioGallery: { fields: { headline: 'string?', subline: 'string?', images: '{ src: url, alt: string, category: string, location?: string }[]', cta: '{ label: string, href: string }?' } },
      servicePackages: { fields: { badge: 'string?', headline: 'string', subline: 'string?', note: 'string?', packages: '{ title: string, price: string, description?: string, features: string[], cta?: { label: string, href: string }, highlighted?: boolean }[]' } },
      photographerAbout: { fields: { headline: 'string', text: 'string (html)', image: 'url?', signature: 'string?', stats: '{ label: string, value: string }[]?' } },
      shootingProcess: { fields: { headline: 'string', subline: 'string?', steps: '{ icon?: lucide-icon-name, title: string, text: string }[]' } },
    });
  } else if (industry === 'consulting') {
    Object.assign(schemas, {
      practiceAreas: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', areas: '{ title: string, text: string, icon: lucide-icon-name, href?: string }[]' } },
      caseResults: { fields: { headline: 'string', subline: 'string?', stats: '{ value: number|string, suffix?: string, prefix?: string, label: string, icon?: lucide-icon-name }[]' } },
      feeTable: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', fees: '{ title: string, price?: string, description?: string, icon?: lucide-icon-name, highlighted?: boolean }[]', footnote: 'string?' } },
      publications: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', articles: '{ title: string, excerpt?: string, date?: string, category?: string, href?: string, image?: url }[]', ctaLabel: 'string?', ctaHref: 'string?' } },
      team: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', members: '{ name: string, role?: string, specialization?: string, image?: url, phone?: string, email?: string }[]' } },
      testimonials: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', items: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]' } },
      faq: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', items: '{ question: string, answer: string }[]' } },
      contact: { fields: { headline: 'string', subline: 'string?', phone: 'string?', email: 'string?', address: 'string?', hours: 'string[]?' } },
    });
  } else if (industry === 'realestate') {
    Object.assign(schemas, {
      heroRealestate: { fields: { headline: 'string', subline: 'string?', bgImage: 'url?', overlayOpacity: 'number? (0-1)', primaryCta: '{ label: string, href: string }?', secondaryCta: '{ label: string, href: string }?', trustItems: 'string[]? (e.g. ["500+ vermittelte Objekte"])', imageEffect: 'string? (none|zoom|parallax)' } },
      propertyShowcase: { fields: { headline: 'string', subline: 'string?', properties: '{ title: string, price: string, size: string, rooms: string, location: string, image: url, href?: string, badge?: string }[]' } },
      propertySearch: { fields: { headline: 'string', subline: 'string?', categories: '(string | { label: string, href?: string, count?: string })[] (e.g. ["Kaufen","Mieten","Gewerbe"] or [{ label: "Wohnungen", href: "/c/objekte", count: "12 Objekte" }])', collectionKey: 'string? (default "objekte" — links to this collection)', ctaLabel: 'string?', ctaHref: 'string?', bgColor: 'string?' } },
      marketReport: { fields: { headline: 'string', subline: 'string?', region: 'string?', stats: '{ label: string, value: string, trend?: string (up|down|stable) }[]', description: 'string? (html)' } },
      agentTeam: { fields: { headline: 'string', subline: 'string?', agents: '{ name: string, role: string, image: url, specialization: string, phone?: string, email?: string, soldCount?: string }[]' } },
      valuationCta: { fields: { headline: 'string', subline: 'string?', ctaLabel: 'string?', ctaHref: 'string?', bgImage: 'url?', stats: '{ label: string, value: string }[]?' } },
      referencesSold: { fields: { headline: 'string', subline: 'string?', totalSold: 'string?', properties: '{ title: string, location: string, price?: string, image: url, soldIn?: string }[]' } },
      locationHighlight: { fields: { headline: 'string', subline: 'string?', description: 'string (html)', image: 'url?', pois: '{ label: string, distance: string, icon?: lucide-icon-name }[]' } },
      testimonials: { fields: { headline: 'string', subline: 'string?', testimonials: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]?', items: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]' } },
      faq: { fields: { headline: 'string', subline: 'string?', items: '{ question: string, answer: string }[]' } },
      contact: { fields: { headline: 'string', subline: 'string?', introText: 'string?', badgeText: 'string?', phone: 'string?', email: 'string?', address: 'string?', hours: 'string?', formEnabled: 'boolean? (default true)', submitLabel: 'string?', infoCards: '{ icon: lucide-icon-name, label: string, value: string }[]?' } },
    });
  } else if (industry === 'cafe') {
    Object.assign(schemas, {
      hero: { fields: { headline: 'string', subline: 'string?', bgImage: 'url?', bgImageMobile: 'url?', overlayOpacity: 'number? (0-1, default 0.5)', primaryCta: '{ label: string, href: string }?', secondaryCta: '{ label: string, href: string }?', trustItems: 'string[]?', openingHint: 'string? (e.g. "Mo-Fr 7-18 Uhr")', imageEffect: 'string? (none|zoom|parallax)' } },
      heroCafe: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', badgeIcon: 'lucide-icon-name?', bgImage: 'url?', bgMode: '"image"|"color"|"gradient"?', bgPosition: 'string?', overlayColor: 'hex?', overlayOpacity: 'number? (0-1, default 0.5)', primaryCta: '{ label: string, href: string }?', secondaryCta: '{ label: string, href: string }?', trustItems: 'string[]?', trustStripColor: 'hex?', openingHint: 'string? (e.g. "Mo-Fr 7-18 Uhr")', imageEffect: 'string? (none|zoom|parallax)', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
      drinkMenu: { fields: { headline: 'string', subline: 'string?', categories: '{ title: string, items: { name: string, description?: string, price: string }[] }[]' } },
      foodMenu: { fields: { headline: 'string', subline: 'string?', items: '{ name: string, description?: string, price: string, image?: url, badge?: string }[]' } },
      atmosphereGallery: { fields: { headline: 'string', images: '{ src: url, caption?: string }[]' } },
      dailySpecials: { fields: { headline: 'string', subline: 'string?', specials: '{ day?: string, title: string, description?: string, price?: string }[]' } },
      eventCalendar: { fields: { headline: 'string', subline: 'string?', fallbackText: 'string?', events: '{ title: string, date: string, time?: string, description?: string, image?: url, category?: string }[]' } },
      locationVibe: { fields: { headline: 'string', address: 'string', description: 'string? (html)', hours: '{ day: string, hours: string }[]?', vibeText: 'string?', mapImage: 'url?', mapEmbed: 'url? (Google Maps embed URL)' } },
      testimonials: { fields: { headline: 'string', subline: 'string?', testimonials: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]?', items: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]' } },
      faq: { fields: { headline: 'string', subline: 'string?', items: '{ question: string, answer: string }[]' } },
      contact: { fields: { headline: 'string', subline: 'string?', introText: 'string?', badgeText: 'string?', phone: 'string?', email: 'string?', address: 'string?', formEnabled: 'boolean? (default true)', submitLabel: 'string?', infoCards: '{ icon: lucide-icon-name, label: string, value: string }[]?' } },
    });
  } else if (industry === 'florist') {
    Object.assign(schemas, {
      hero: { fields: { eyebrow: 'string?', headline: 'string', subline: 'string?', image: 'url?', imagePosition: 'string? (CSS object-position, e.g. "center 35%")', glowColor: 'CSS color/rgba/hex — Farbe des Glow-Effekts', primaryCta: '{ label?: string, href?: string }?', secondaryCta: '{ label?: string, href?: string }?', facts: '{ value?: string, label?: string }[]?' } },
    });
  } else if (industry === 'fitness') {
    Object.assign(schemas, {
      hero: { fields: { eyebrow: 'string?', headline: 'string', subline: 'string?', image: 'url?', imagePosition: 'string? (CSS object-position, e.g. "center 35%")', glowColor: 'CSS color/rgba/hex — Farbe des Glow-Effekts', primaryCta: '{ label?: string, href?: string }?', secondaryCta: '{ label?: string, href?: string }?', facts: '{ value?: string, label?: string }[]?' } },
    });
  } else if (industry === 'retail') {
    Object.assign(schemas, {
      productShowcase: { fields: { headline: 'string', subline: 'string?', columns: 'string? (2|3|4, default 3)', items: '{ image?: url, title: string, price?: string, badge?: string, href?: string, description?: string }[]' } },
      categoryMosaic: { fields: { headline: 'string', subline: 'string?', items: '{ image?: url, title: string, href?: string, size?: string (large|small) }[]' } },
      brandShowroom: { fields: { headline: 'string', subline: 'string?', image: 'url', overlayOpacity: 'number? (0-1)', highlights: '{ title: string, text: string }[]', cta: '{ label: string, href: string }?' } },
      consultationBooking: { fields: { headline: 'string', subline: 'string?', image: 'url?', services: '{ icon?: lucide-icon-name, title: string, description?: string }[]', cta: '{ label: string, href: string }?' } },
      materialGallery: { fields: { headline: 'string', subline: 'string?', categories: 'string[]', items: '{ image?: url, name: string, category?: string }[]' } },
      deliveryTimeline: { fields: { headline: 'string', subline: 'string?', steps: '{ number?: string, icon?: lucide-icon-name, title: string, text?: string }[]' } },
      inspirationGrid: { fields: { headline: 'string', subline: 'string?', items: '{ image?: url, title?: string, href?: string }[]' } },
      beforeAfter: { fields: { headline: 'string', description: 'string?', imageBefore: 'url', imageAfter: 'url', labelBefore: 'string? (default "Vorher")', labelAfter: 'string? (default "Nachher")' } },
      testimonials: { fields: { headline: 'string', subline: 'string?', items: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]' } },
      faq: { fields: { headline: 'string', subline: 'string?', items: '{ question: string, answer: string }[]' } },
      contact: { fields: { headline: 'string', subline: 'string?', introText: 'string?', badgeText: 'string?', phone: 'string?', email: 'string?', address: 'string?', formEnabled: 'boolean? (default true)', submitLabel: 'string?', infoCards: '{ icon: lucide-icon-name, label: string, value: string }[]?' } },
    });
  }

  Object.assign(schemas, {
    offerMatcher: { fields: { badge: 'string?', headline: 'string', subline: 'string?', panelTitle: 'string?', panelHint: 'string?', helperText: 'string?', privacyText: 'string?', progressLabel: 'string?', questionLabel: 'string?', nextLabel: 'string?', backLabel: 'string?', resultLabel: 'string?', restartLabel: 'string?', fallbackText: 'string?', fallbackCta: '{ label: string, href: string }?', questions: '{ id: string (stable and unique), label: string, description?: string, options: { id or value: string (unique per question), label: string, description?: string, icon?: lucide-icon-name, matches: string[] (matching offer IDs), tags?: string[] }[] (2-6 answers) }[] (2-5 short questions)', offers: '{ id: string (must match options[].matches), eyebrow?: string, title: string, description?: string, reason?: string, priceLabel?: string, features?: string[], tags?: string[], priority?: number, fallback?: boolean, primaryCta?: { label: string, href: string }, secondaryCta?: { label: string, href: string } }[] (2-8 offers)' }, note: 'Deterministic offer finder. Every answer should name at least one existing offer ID in matches. Mark one offer as fallback; priority breaks ties. Do not invent unmatched IDs. Links must be internal, https, mailto or tel.' },
  });

  return schemas;
}

const SECTION_SCHEMA_PRESET_INDUSTRIES = [
  'wedding',
  'tradesman',
  'restaurant',
  'hotel',
  'salon',
  'medical',
  'tourism',
  'photography',
  'consulting',
  'realestate',
  'cafe',
  'florist',
  'fitness',
  'retail',
] as const;

type CatalogSchemaIndex = {
  schemasByIndustry: Map<string, Record<string, object>>;
  uniqueForeignSchemas: Map<string, { industry: string; schema: object }>;
};

let catalogSchemaIndex: CatalogSchemaIndex | null = null;

function schemaEquals(left: object | undefined, right: object | undefined) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function getCatalogSchemaIndex(): CatalogSchemaIndex {
  if (catalogSchemaIndex) return catalogSchemaIndex;
  const baseSchemas = getSectionSchemas('__catalog_base__');
  const schemasByIndustry = new Map<string, Record<string, object>>();
  const ownersByType = new Map<string, { industry: string; schema: object }[]>();

  for (const industry of SECTION_SCHEMA_PRESET_INDUSTRIES) {
    const schemas = getSectionSchemas(industry);
    schemasByIndustry.set(industry, schemas);
    for (const [type, schema] of Object.entries(schemas)) {
      if (schemaEquals(schema, baseSchemas[type])) continue;
      const owners = ownersByType.get(type) ?? [];
      owners.push({ industry, schema });
      ownersByType.set(type, owners);
    }
  }

  const uniqueForeignSchemas = new Map<string, { industry: string; schema: object }>();
  for (const [type, owners] of ownersByType) {
    if (owners.length === 1) uniqueForeignSchemas.set(type, owners[0]);
  }
  catalogSchemaIndex = { schemasByIndustry, uniqueForeignSchemas };
  return catalogSchemaIndex;
}

/**
 * Schemas for the cross-industry section catalog. The active tenant keeps its
 * complete schema semantics; only section types owned by exactly one foreign
 * preset are added. Ambiguous shared names never inherit a random industry.
 */
export function getCatalogSectionSchemas(industry: string): Record<string, object> {
  const index = getCatalogSchemaIndex();
  const currentSchemas = index.schemasByIndustry.get(industry) ?? getSectionSchemas(industry);
  const catalog = { ...currentSchemas };
  for (const [type, owner] of index.uniqueForeignSchemas) {
    if (owner.industry === industry || Object.hasOwn(catalog, type)) continue;
    catalog[type] = owner.schema;
  }
  return catalog;
}


