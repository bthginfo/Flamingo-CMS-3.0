import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { pages } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { getSectionTypesForIndustry } from '@/app/admin/pages/[id]/section-types';

export async function GET(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const tenantPages = await db.select({ id: pages.id, slug: pages.slug, title: pages.title }).from(pages).where(eq(pages.tenantId, auth.tenantId));

  const sectionTypes = getSectionTypesForIndustry(auth.tenant.industry);
  // Exclude HTML-Block (freeHtml) from AI usage
  const allowedSectionTypes = sectionTypes.filter((s: { type?: string; id?: string }) => {
    const key = s.type || s.id || '';
    return key !== 'freeHtml' && key !== 'htmlBlock' && key !== 'html';
  });

  return NextResponse.json({
    tenant: auth.tenant,
    tenantId: auth.tenantId,
    existingPages: tenantPages,
    availableSectionTypes: allowedSectionTypes,
    sectionDataSchemas: getSectionSchemas(auth.tenant.industry),
    endpoints: {
      brand: { method: 'PUT', path: '/api/v1/content/brand', description: 'Set brand data (companyName, tagline, primaryColor, logo, etc.)' },
      contact: { method: 'PUT', path: '/api/v1/content/contact', description: 'Set contact info (email, phone, address, whatsapp, whatsappEnabled, whatsappColor)' },
      navigation: { method: 'PUT', path: '/api/v1/content/navigation', description: 'Set nav items + CTA' },
      footer: { method: 'PUT', path: '/api/v1/content/footer', description: 'Set footer columns + legal links + CTA' },
      createPage: { method: 'POST', path: '/api/v1/content/pages', description: 'Create a new page with sections' },
      updatePage: { method: 'PUT', path: '/api/v1/content/pages/:id', description: 'Update a page (title, sections)' },
      deletePage: { method: 'DELETE', path: '/api/v1/content/pages/:id', description: 'Delete a page' },
      seoGlobal: { method: 'PUT', path: '/api/v1/content/seo', description: 'Set global SEO defaults (titleTemplate, defaultDescription, canonicalBase, locale)' },
      seoPage: { method: 'PUT', path: '/api/v1/content/seo/:pageId', description: 'Set page-level SEO (metaTitle, metaDescription, ogImage, canonical, noindex)' },
      design: { method: 'PUT', path: '/api/v1/content/design', description: 'Set design overrides (textPrimary, textSecondary, sectionBg, sectionBgAlt, cardBg, badgeBg, badgeText, brand, dividerColor)' },
      formFields: { method: 'PUT', path: '/api/v1/content/form-fields', description: 'Set contact form fields: { fields: [{ name, label, type: "text"|"email"|"tel"|"textarea"|"select", placeholder?, required?, options?, halfWidth? }] }' },
      openingHours: { method: 'PUT', path: '/api/v1/content/opening-hours', description: 'Set opening hours: { hours: [{ day: string, hours: string }] }' },
      listCollections: { method: 'GET', path: '/api/v1/content/collections', description: 'List all collections' },
      createCollection: { method: 'POST', path: '/api/v1/content/collections', description: 'Create a new collection (key: lowercase-slug, label: display name). Use for repeating content types like services, rooms, news, team members, etc.' },
      createCollectionItem: { method: 'POST', path: '/api/v1/content/collections/:key/items', description: 'Create a collection item (title, slug, data with sections)' },
      updateCollectionItem: { method: 'PUT', path: '/api/v1/content/collections/:key/items/:id', description: 'Update a collection item' },
      deleteCollectionItem: { method: 'DELETE', path: '/api/v1/content/collections/:key/items/:id', description: 'Delete a collection item' },
      publish: { method: 'POST', path: '/api/v1/content/publish', description: 'Publish all current content as snapshot' },
    },
    restrictions: [
      'Do NOT use section type "freeHtml" or "htmlBlock" â€” raw HTML is not allowed.',
      'Only use section types listed in availableSectionTypes.',
      'Only fill fields defined in sectionDataSchemas â€” do not invent custom fields.',
      'Every section MUST have ALL required fields filled with real content â€” never leave fields empty or with placeholder text like "Lorem ipsum".',
      'Every array field (items, services, steps, etc.) MUST have at least 3 entries unless the real business has fewer.',
      'The footer MUST contain columns with items arrays. Each item needs text and optionally href. Never send empty columns or columns without items.',
      'Navigation items MUST link to existing pages using their slug (e.g. href: "/leistungen", NOT href: "/services").',
    ],
    instructions: `Du bist ein AI-Assistent der eine "${auth.tenant.industry}"-Website fÃ¼r "${auth.tenant.name}" mit deutschsprachigem Content fÃ¼llt.

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
PFLICHT-CHECKLISTE (alles MUSS erstellt werden):
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

1. BRAND (PUT /api/v1/content/brand):
   - companyName, tagline, primaryColor, secondaryColor?, accentColor
   - logoUrl: URL zum Firmenlogo (wird im Header + Footer gezeigt)
   - logoDisplay: 'logo' | 'logoAndName' | 'name' (default: 'name' wenn kein Logo)
   - headingFont: Google-Font-Name fÃ¼r Ãœberschriften (z.B. "Playfair Display", "Montserrat")
   - bodyFont: Google-Font-Name fÃ¼r FlieÃŸtext (z.B. "Inter", "Open Sans")
   - topBarColor?: hex (Farbe der Top-Navigation-Leiste)
   - footerColor?: hex (Hintergrundfarbe des Footers)

2. CONTACT (PUT /api/v1/content/contact):
   - phone, email, address (vollstÃ¤ndig mit StraÃŸe, PLZ, Ort)
   - whatsapp (Nummer), whatsappEnabled: true

3. NAVIGATION (PUT /api/v1/content/navigation):
   - items: Array mit ALLEN Seiten die du erstellst (jede Seite braucht einen Nav-Eintrag)
   - Format: { items: [{ label: "Startseite", href: "/" }, { label: "Leistungen", href: "/leistungen" }, ...], cta: { label: "Jetzt anfragen", href: "/kontakt" } }
   - WICHTIG: href MUSS mit "/" beginnen + den Slug der Seite enthalten

4. FOOTER (PUT /api/v1/content/footer):
   - columns: MINDESTENS 2-3 Spalten, JEDE mit title UND items-Array
   - cta: { label: "Jetzt anfragen", href: "/kontakt" } (optionaler CTA-Button im Footer)
   - Beispiel: { columns: [{ title: "Leistungen", items: [{ text: "Badezimmer", href: "/c/leistungen/badezimmer" }, ...] }, { title: "Unternehmen", items: [{ text: "Ãœber uns", href: "/ueber-uns" }, { text: "Kontakt", href: "/kontakt" }] }], legalLinks: [{ label: "Impressum", href: "/impressum" }, { label: "Datenschutz", href: "/datenschutz" }], cta: { label: "Termin vereinbaren", href: "/kontakt" } }
   - NIEMALS leere items-Arrays! Jede Spalte braucht mindestens 2 Links.

5. SEITEN (POST /api/v1/content/pages) â€” Erstelle ALLE diese Seiten:
   a) Startseite (slug: "startseite") â€” MINDESTENS 6 Sections:
      - hero (mit headline, subline, bgImage, primaryCta, secondaryCta, trustItems)
      - uspStrip (mindestens 4 Items)
      - servicesGrid (mindestens 4 manualCards mit title, text, icon, href zu Collection-Detail)  
      - processSteps ODER textImage
      - testimonials ODER stats
      - faq (mindestens 4 Fragen)
      - ctaBand (mit headline, subline, ctaPrimary)
   
   b) Leistungen-Ãœbersicht (slug: "leistungen"):
      - collectionHero (headline, subline)
      - servicesGrid (ALLE Leistungen als manualCards mit href="/c/leistungen/[slug]")
      - ctaBand
   
   c) Ãœber uns (slug: "ueber-uns"):
      - collectionHero
      - textImage (mit echtem Text Ã¼ber die Firma, Bild)
      - stats (GrÃ¼ndungsjahr, Mitarbeiter, Projekte, etc.)
      - team (mindestens 2-3 Teammitglieder mit name, role)
      - ctaBand
   
   d) Kontakt (slug: "kontakt"):
      - collectionHero
      - contact (headline, subline, formEnabled: true, mapEmbedUrl wenn mÃ¶glich)
      - textImage (Ã–ffnungszeiten oder Anfahrt-Info)
   
   e) Impressum (slug: "impressum"):
      - collectionHero
      - richText (vollstÃ¤ndiges deutsches Impressum mit Firmenname, Adresse, Telefon, E-Mail, GeschÃ¤ftsfÃ¼hrer, Handelsregister, USt-IdNr)
   
   f) Datenschutz (slug: "datenschutz"):
      - collectionHero
      - richText (DatenschutzerklÃ¤rung nach DSGVO)

6. COLLECTIONS â€” Erstelle MINDESTENS eine Collection fÃ¼r die Kernleistungen:
   - POST /api/v1/content/collections â†’ { key: "leistungen", label: "Leistungen" }
   - Dann fÃ¼r JEDE Leistung ein Item erstellen (MINDESTENS 4 Items):
     POST /api/v1/content/collections/leistungen/items â†’ { title: "...", slug: "...", data: { sections: [...] } }
   - Jedes Collection-Item braucht sections mit echtem Content (collectionHero + textImage + ctaBand minimum)

7. SEO (PUT /api/v1/content/seo):
   - titleTemplate: "%s | ${auth.tenant.name}"
   - defaultTitle: Firmenname oder Slogan (Fallback-Titel)
   - defaultDescription: AussagekrÃ¤ftige Beschreibung
   - defaultOgImage: URL zu einem OG-Bild (wird auf Social Media gezeigt wenn kein seitenspezifisches OG-Bild gesetzt ist)
   - canonicalBase?: "https://domain.de" (optionale Basis-URL fÃ¼r canonical tags)
   - locale?: "de_DE" (Standard)
   - Dann fÃ¼r JEDE Seite: PUT /api/v1/content/seo/:pageId mit metaTitle und metaDescription

8. PUBLISH (POST /api/v1/content/publish):
   - IMMER als letzter Schritt aufrufen!

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
CONTENT-REGELN:
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

- JEDES Feld das nicht mit "?" markiert ist, MUSS gefÃ¼llt werden
- Array-Felder (items, services, steps, etc.) brauchen MINDESTENS 3-4 EintrÃ¤ge
- Texte mÃ¼ssen ECHTEN, branchenspezifischen Content haben (keine Platzhalter)
- Icons: Verwende passende Lucide-Icon-Namen (z.B. "Wrench", "Phone", "Mail", "MapPin", "Clock", "Shield", "Award", "Users", "Star", "ChevronRight")
- Bilder: Verwende Unsplash-URLs im Format https://images.unsplash.com/photo-XXXXX?w=1200&q=80
- CTAs: Immer mit konkretem href zu einer existierenden Seite (z.B. "/kontakt", "/leistungen")
- ServicesGrid href: Verlinke zu Collection-Detail-Seiten als "/c/leistungen/[slug]"
- Google Maps: Nutze eine EIGENE "map" Section (NICHT in contact einbauen!). embedUrl = Google Maps > Teilen > Einbetten > src-URL aus dem iframe kopieren. Kontaktseite typisch: hero + contact (Formular+InfoCards) + map (Google Maps Embed).

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BEISPIEL â€” So sieht ein korrekter servicesGrid-Aufruf aus:
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

WICHTIG: Das Array-Feld heiÃŸt "manualCards" (NICHT "services")!
Der Renderer liest NUR data.manualCards. Wenn du "services" sendest, werden die Karten NICHT angezeigt!

{
  "type": "servicesGrid",
  "data": {
    "headline": "Unsere Leistungen",
    "subline": "Kompetenz aus einer Hand",
    "badgeText": "Leistungen",
    "ctaLabel": "Alle Leistungen ansehen",
    "ctaHref": "/leistungen",
    "manualCards": [
      { "icon": "Droplets", "title": "Leckortung", "text": "Modernste Messtechnik zur zerstÃ¶rungsfreien Ortung von WasserschÃ¤den.", "href": "/c/leistungen/leckortung", "mediaType": "icon" },
      { "icon": "Wind", "title": "Bautrocknung", "text": "Professionelle Trocknung mit Ã¼berwachtem Trocknungsverlauf.", "href": "/c/leistungen/bautrocknung", "mediaType": "icon" },
      { "icon": "Hammer", "title": "Sanierung", "text": "Fachgerechte Wiederherstellung nach WasserschÃ¤den.", "href": "/c/leistungen/sanierung", "mediaType": "icon" },
      { "icon": "FileCheck", "title": "Versicherungsabwicklung", "text": "Komplette Dokumentation und Kommunikation mit Ihrer Versicherung.", "href": "/c/leistungen/versicherung", "mediaType": "icon" }
    ]
  }
}

WICHTIG: Jede Karte MUSS title und text haben. icon ODER image ist optional.
Card-Schema: { title: string, text: string, icon?: lucide-name, image?: url, mediaType?: 'icon'|'image', href?: string }
Die href-Werte MÃœSSEN auf Collection-Items verweisen die du vorher angelegt hast.

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BEISPIEL â€” Footer mit vollstÃ¤ndigen columns:
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

{
  "columns": [
    { "title": "Leistungen", "items": [{ "text": "Leckortung", "href": "/c/leistungen/leckortung" }, { "text": "Bautrocknung", "href": "/c/leistungen/bautrocknung" }, { "text": "Sanierung", "href": "/c/leistungen/sanierung" }] },
    { "title": "Unternehmen", "items": [{ "text": "Ãœber uns", "href": "/ueber-uns" }, { "text": "Team", "href": "/ueber-uns" }, { "text": "Kontakt", "href": "/kontakt" }] },
    { "title": "Service", "items": [{ "text": "Notdienst", "href": "/kontakt" }, { "text": "FAQ", "href": "/startseite" }] }
  ],
  "legalLinks": [{ "label": "Impressum", "href": "/impressum" }, { "label": "Datenschutz", "href": "/datenschutz" }],
  "cta": { "label": "Schaden melden", "href": "/kontakt" }
}

WICHTIG: Jede column MUSS ein items-Array mit mindestens 2 EintrÃ¤gen haben! Leere columns crashen die Seite.

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BEISPIEL â€” Contact-Section mit Info-Karten:
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

{
  "type": "contact",
  "data": {
    "headline": "Kontaktieren Sie uns",
    "subline": "Wir sind fÃ¼r Sie da",
    "formEnabled": true,
    "mapEmbedUrl": "https://www.google.com/maps/embed?pb=..."
  }
}

Hinweis: Die Kontaktdaten (Adresse, Telefon, E-Mail) werden automatisch aus den Brand/Contact-Settings geladen. Du MUSST also vorher PUT /contact mit allen Daten aufrufen!

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
HÃ„UFIGE FEHLER (VERMEIDE DIESE):
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

âŒ Footer ohne items in columns â†’ CRASH
âŒ servicesGrid mit "services" statt "manualCards" â†’ Karten werden NICHT angezeigt!
âŒ servicesGrid mit manualCards aber OHNE href â†’ keine Verlinkung
âŒ servicesGrid mit manualCards aber OHNE text â†’ leere Beschreibung
âŒ Navigation ohne CTA â†’ fehlender Anruf-Button
âŒ Leistungen nur als Seiten statt Collection Items
âŒ Collection-Items angelegt aber NICHT im servicesGrid referenziert
âŒ Kontaktseite ohne contact-Section â†’ kein Formular
âŒ Hero ohne primaryCta â†’ kein Call-to-Action
âŒ Sections mit leeren/fehlenden Pflichtfeldern
âŒ Array-Felder mit 0 oder 1 EintrÃ¤gen (MINIMUM 3)
âŒ Slugs mit fÃ¼hrendem "/" (FALSCH: "/kontakt", RICHTIG: "kontakt")
âŒ Publish vergessen am Ende

WICHTIG â€” Slugs:
Slugs dÃ¼rfen NIEMALS mit "/" beginnen. Slug = nur Pfadteil, z.B. "kontakt", "ueber-uns", "leistungen". Die Startseite MUSS den Slug "startseite" haben.

WICHTIG â€” Collections statt Unterseiten:
FÃ¼r wiederkehrende Inhalte (Leistungen, Zimmer, News, Team, Referenzen, Behandlungen) IMMER Collections verwenden.
Workflow: 1) POST /collections â†’ { key, label }  2) POST /collections/:key/items fÃ¼r jeden Eintrag  3) Auf Ãœbersichtsseiten servicesGrid mit href="/c/:key/:slug" nutzen`,
  });
}

function getSectionSchemas(industry: string): Record<string, object> {
  const schemas: Record<string, object> = {
    hero: { fields: { headline: 'string', subline: 'string', badgeText: 'string?', badgeIcon: 'lucide-icon-name?', badgeStarsIcon: 'lucide-icon-name? (leer = keine Sterne)', bgImage: 'url?', bgImageMobile: 'url?', bgColor: 'hex? (alternative bg color if no image)', bgMode: '"image"|"color"|"gradient" (default gradient)', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', trustItems: 'string[]?', trustStripColor: 'hex?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string? (CSS object-position, e.g. "center 30%")', bgPositionMobile: 'string?' } },
    richText: { fields: { headline: 'string?', content: 'html-string' } },
    freeText: { fields: { content: 'rich-text (Tiptap JSON or HTML)' } },
    videoEmbed: { fields: { headline: 'string?', subline: 'string?', videoUrl: 'youtube/vimeo URL', aspectRatio: '"16:9"|"4:3"|"1:1"?' } },
    textImage: { fields: { headline: 'string', text: 'string (html)', badge: 'string?', image: 'url', imageAlt: 'string?', layout: '"image-right"|"image-left"', items: '{ icon?: lucide-icon-name, title: string, text: string }[]?' } },
    collectionHero: { fields: { headline: 'string', subline: 'string?', bgImage: 'url?', category: 'string?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string?' } },
    noticeBanner: { fields: { headline: 'string', subline: 'string?', text: 'string? (html)', bgColor: 'hex?', textColor: 'hex? (default white)', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?' } },
  };

  if (industry === 'wedding') {
    Object.assign(schemas, {
      hero: { fields: { coupleName: 'string (z.B. "Anna & Max")', date: 'YYYY-MM-DD', venue: 'string', tagline: 'string?', bgImage: 'url?', overlayColor: 'hex?', overlayOpacity: '0-1?' } },
      coupleStory: { fields: { headline: 'string', subline: 'string?', milestones: '{ year: string, title: string, text: string, image?: url }[]' } },
      eventSchedule: { fields: { headline: 'string', subline: 'string?', events: '{ time: string, title: string, description: string, icon?: lucide-icon-name, location?: string }[]' } },
      venueInfo: { fields: { headline: 'string', subline: 'string?', venues: '{ name: string, image?: url, address: string, description: string, mapEmbed?: url, parkingInfo?: string }[]' } },
      travelInfo: { fields: { headline: 'string', subline: 'string?', sections: '{ title: string, icon?: lucide-icon-name, content: string }[]', hotels: '{ name: string, image?: url, link?: url, distance: string, specialRate?: string, stars?: string }[]' } },
      weddingParty: { fields: { headline: 'string', subline: 'string?', members: '{ name: string, role: string, relationship?: string, text?: string, image?: url }[]' } },
      giftRegistry: { fields: { headline: 'string', subline: 'string?', freeText: 'string?', gifts: '{ title: string, description?: string, link?: url, price?: string, claimed?: boolean }[]', bankInfo: '{ holder?: string, iban?: string, bic?: string, note?: string }?' } },
      dresscode: { fields: { headline: 'string', description: 'string?', colors: 'hex[]?', dos: 'string[]?', donts: 'string[]?', note: 'string?' } },
      rsvp: { fields: { headline: 'string', subline: 'string?', deadline: 'string?', maxGuests: 'number?', showSongWish: 'boolean?', showDietary: 'boolean?', showAllergies: 'boolean?' } },
      weddingMenu: { fields: { headline: 'string', subline: 'string?', note: 'string?', courses: '{ title: string, items: { name: string, description?: string }[] }[]' } },
      faq: { fields: { headline: 'string', items: '{ question: string, answer: string }[]' } },
      gallery: { fields: { headline: 'string', images: '{ src: url, alt?: string }[]' } },
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
      textImage: { fields: { headline: 'string', text: 'string (html)', badge: 'string?', image: 'url', imageAlt: 'string?', layout: '"image-right" | "image-left"', items: '{ icon?: lucide-icon-name, title: string, text: string }[]?' } },
      galleryGrid: { fields: { headline: 'string', subline: 'string?', columns: '2|3|4?', images: '{ src: url, alt: string, caption?: string }[]' } },
      stats: { fields: { headline: 'string?', stats: '{ icon: lucide-icon-name, value: string, label: string }[]' } },
      richText: { fields: { headline: 'string?', content: 'string (html)' } },
      collectionHero: { fields: { headline: 'string', subline: 'string?', bgImage: 'url?', category: 'string?', overlayColor: 'hex?', overlayOpacity: '0-1?' } },
    });
  } else if (industry === 'restaurant') {
    Object.assign(schemas, {
      menu: { fields: { headline: 'string', categories: '{ title: string, items: { name: string, description?: string, price?: string, allergens?: string }[] }[]' } },
      reservation: { fields: { headline: 'string', text: 'string?', cta: '{ label: string, href: string }?' } },
      openingHours: { fields: { headline: 'string', days: '{ label: string, hours: string }[]' } },
      signatureDishes: { fields: { headline: 'string', dishes: '{ name: string, description: string, image?: url, price?: string }[]' } },
      events: { fields: { headline: 'string', subline: 'string?', events: '{ title: string, text: string, image?: url, dateLabel?: string, cta?: { label: string, href: string } }[]' } },
      ambience: { fields: { headline: 'string', subline: 'string?', text: 'string?', images: '{ src: url, alt?: string }[]', cta: '{ label: string, href: string }?' } },
      story: { fields: { headline: 'string', subline: 'string?', text: 'string (html)', image: 'url?', founderName: 'string?', founderRole: 'string?', ctaPrimary: '{ label: string, href: string }?' } },
      testimonials: { fields: { headline: 'string', items: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]' } },
      faq: { fields: { headline: 'string', items: '{ question: string, answer: string }[]' } },
      contact: { fields: { headline: 'string', subline: 'string?', mapEmbedUrl: 'url?', formEnabled: 'boolean?', infoCards: '{ icon: lucide-icon-name, label: string, value: string }[]?' } },
      gallery: { fields: { headline: 'string', images: '{ src: url, alt?: string, caption?: string }[]' } },
    });
  } else if (industry === 'hotel') {
    Object.assign(schemas, {
      bookingStrip: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', submitCta: '{ label: string, href: string }', bookingNote: 'string?' } },
      roomShowcase: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', footerText: 'string?', rooms: '{ name: string, description: string, image: url, priceLabel: string, sizeLabel?: string, occupancyLabel?: string, bedLabel?: string, features: string[], detailCta?: { label: string, href: string }, bookingCta?: { label: string, href: string }, highlighted?: boolean, galleryImages?: url[] }[]' } },
      amenities: { fields: { headline: 'string', subline: 'string?', items: '{ icon: lucide-icon-name, title: string, text: string, image?: url }[]', ctaPrimary: '{ label: string, href: string }?' } },
      wellness: { fields: { headline: 'string', subline: 'string?', introText: 'string?', imagePrimary: 'url?', treatments: '{ title: string, text: string, durationLabel?: string, priceLabel?: string }[]', features: '{ icon: lucide-icon-name, title: string, text: string }[]?', ctaPrimary: '{ label: string, href: string }?' } },
      location: { fields: { headline: 'string', subline: 'string?', addressText: 'string', mapEmbedUrl: 'url?', image: 'url?', transportItems: '{ icon: lucide-icon-name, label: string, value: string }[]?', nearbyItems: '{ title: string, distanceLabel: string, text?: string }[]?', routeCta: '{ label: string, href: string }?' } },
      hotelDining: { fields: { headline: 'string', subline: 'string?', introText: 'string?', image: 'url?', openingText: 'string?', menus: '{ title: string, description: string, timeLabel?: string, priceLabel?: string }[]', ctaPrimary: '{ label: string, href: string }?' } },
      eventSpaces: { fields: { headline: 'string', subline: 'string?', spaces: '{ name: string, description: string, image: url, capacityLabel?: string, sizeLabel?: string, features: string[] }[]', ctaPrimary: '{ label: string, href: string }?' } },
      offers: { fields: { headline: 'string', subline: 'string?', offers: '{ title: string, description: string, image?: url, priceLabel?: string, durationLabel?: string, includes: string[], cta?: { label: string, href: string }, highlighted?: boolean }[]' } },
      story: { fields: { headline: 'string', subline: 'string?', storyText: 'string (html)', imagePrimary: 'url?', founderName: 'string?', founderRole: 'string?', founderQuote: 'string?', stats: '{ value: string, label: string }[]?', milestones: '{ year: string, title: string, text: string }[]?' } },
      testimonials: { fields: { headline: 'string', items: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]' } },
      faq: { fields: { headline: 'string', items: '{ question: string, answer: string }[]' } },
      contact: { fields: { headline: 'string', subline: 'string?', mapEmbedUrl: 'url?', formEnabled: 'boolean?', infoCards: '{ icon: lucide-icon-name, label: string, value: string }[]?' } },
      gallery: { fields: { headline: 'string', images: '{ src: url, alt?: string, caption?: string }[]' } },
    });
  } else if (industry === 'salon') {
    Object.assign(schemas, {
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
      faq: { fields: { headline: 'string', items: '{ question: string, answer: string }[]' } },
      gallery: { fields: { headline: 'string', images: '{ src: url, alt?: string }[]' } },
    });
  } else if (industry === 'medical') {
    Object.assign(schemas, {
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
      faq: { fields: { headline: 'string', items: '{ question: string, answer: string }[]' } },
      story: { fields: { headline: 'string', subline: 'string?', text: 'string (html)', image: 'url?', ctaPrimary: '{ label: string, href: string }?' } },
      gallery: { fields: { headline: 'string', images: '{ src: url, alt?: string }[]' } },
      locationContact: { fields: { headline: 'string', subline: 'string?', mapEmbedUrl: 'url?', formEnabled: 'boolean?', infoCards: '{ icon: lucide-icon-name, label: string, value: string }[]?' } },
    });
  } else if (industry === 'tourism') {
    Object.assign(schemas, {
      destinationHighlights: { fields: { headline: 'string', subline: 'string?', items: '{ title: string, text: string, image: url, category?: string, cta?: { label: string, href: string } }[]' } },
      experienceGrid: { fields: { headline: 'string', subline: 'string?', items: '{ title: string, text: string, image: url, category?: string, durationLabel?: string, priceLabel?: string, cta?: { label: string, href: string } }[]' } },
      seasonTeaser: { fields: { headline: 'string', subline: 'string?', seasons: '{ title: string, text: string, image: url, periodLabel?: string, cta?: { label: string, href: string } }[]' } },
      eventsCalendar: { fields: { headline: 'string', subline: 'string?', events: '{ title: string, text: string, image?: url, dateLabel: string, locationLabel?: string, category?: string, priceLabel?: string, cta?: { label: string, href: string } }[]' } },
      sightseeingList: { fields: { headline: 'string', subline: 'string?', items: '{ title: string, text: string, image: url, openingText?: string, category?: string, cta?: { label: string, href: string } }[]' } },
      tourRoutes: { fields: { headline: 'string', subline: 'string?', routes: '{ title: string, text: string, image: url, lengthLabel?: string, durationLabel?: string, difficultyLabel?: string, highlights: string[]?, cta?: { label: string, href: string } }[]' } },
      accommodationGrid: { fields: { headline: 'string', subline: 'string?', items: '{ title: string, text: string, image: url, typeLabel?: string, priceLabel?: string, amenities: string[]?, cta?: { label: string, href: string } }[]' } },
      visitorInfo: { fields: { headline: 'string', subline: 'string?', introText: 'string?', blocks: '{ title: string, text: string, icon?: lucide-icon-name, items: string[]? }[]' } },
      story: { fields: { headline: 'string', subline: 'string?', text: 'string (html)', image: 'url?', ctaPrimary: '{ label: string, href: string }?' } },
      testimonials: { fields: { headline: 'string', items: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]' } },
      faq: { fields: { headline: 'string', items: '{ question: string, answer: string }[]' } },
      gallery: { fields: { headline: 'string', images: '{ src: url, alt?: string }[]' } },
      tourismContact: { fields: { headline: 'string', subline: 'string?', mapEmbedUrl: 'url?', formEnabled: 'boolean?', infoCards: '{ icon: lucide-icon-name, label: string, value: string }[]?' } },
    });
  } else if (industry === 'photography') {
    Object.assign(schemas, {
      portfolioGallery: { fields: { headline: 'string?', images: '{ src: url, alt: string, category: string, location?: string }[]' } },
      servicePackages: { fields: { headline: 'string', subline: 'string?', packages: '{ title: string, price: string, description?: string, features: string[], cta?: { label: string, href: string }, highlighted?: boolean }[]' } },
      photographerAbout: { fields: { headline: 'string', text: 'string (html)', image: 'url?', signature: 'string?', stats: '{ label: string, value: string }[]?' } },
      shootingProcess: { fields: { headline: 'string', subline: 'string?', steps: '{ icon?: lucide-icon-name, title: string, text: string }[]' } },
    });
  }

  return schemas;
}
