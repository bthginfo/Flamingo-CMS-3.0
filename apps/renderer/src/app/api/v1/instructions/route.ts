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
      socialLinks: { method: 'PUT', path: '/api/v1/content/social-links', description: 'Set social media links: { facebook?: url, instagram?: url, linkedin?: url, youtube?: url, tiktok?: url, xing?: url, google?: url, pinterest?: url, twitter?: url }' },
      style: { method: 'PUT', path: '/api/v1/content/style', description: 'Set active style variant: { style: "classic"|"modern"|"bold" }' },
      upload: { method: 'POST', path: '/api/v1/content/upload', description: 'Upload an image (multipart/form-data with "file" field). Returns { url, filename, size }. Use the returned url in bgImage, image fields etc.' },
    },
    restrictions: [
      'Do NOT use section type "freeHtml" or "htmlBlock" — raw HTML is not allowed.',
      'Only use section types listed in availableSectionTypes.',
      'Only fill fields defined in sectionDataSchemas — do not invent custom fields.',
      'Every section MUST have ALL required fields filled with real content — never leave fields empty or with placeholder text like "Lorem ipsum".',
      'Every array field (items, services, steps, etc.) MUST have at least 3 entries unless the real business has fewer.',
      'The footer MUST contain columns with items arrays. Each item needs text and optionally href. Never send empty columns or columns without items.',
      'Navigation items MUST link to existing pages using their slug (e.g. href: "/leistungen", NOT href: "/services").',
    ],
    instructions: `Du bist ein AI-Assistent der eine "${auth.tenant.industry}"-Website für "${auth.tenant.name}" mit deutschsprachigem Content füllt.

═══════════════════════════════════════════
PFLICHT-CHECKLISTE (alles MUSS erstellt werden):
═══════════════════════════════════════════

1. BRAND (PUT /api/v1/content/brand):
   - companyName, tagline, primaryColor, secondaryColor?, accentColor
   - logoUrl: URL zum Firmenlogo (wird im Header + Footer gezeigt)
   - logoDisplay: 'logo' | 'logoAndName' | 'name' (default: 'name' wenn kein Logo)
   - headingFont: Google-Font-Name für Überschriften (z.B. "Playfair Display", "Montserrat")
   - bodyFont: Google-Font-Name für Fließtext (z.B. "Inter", "Open Sans")
   - topBarColor?: hex (Farbe der Top-Navigation-Leiste)
   - footerColor?: hex (Hintergrundfarbe des Footers)

2. CONTACT (PUT /api/v1/content/contact):
   - phone, email, address (vollständig mit Straße, PLZ, Ort)
   - whatsapp (Nummer), whatsappEnabled: true

3. NAVIGATION (PUT /api/v1/content/navigation):
   - items: Array mit ALLEN Seiten die du erstellst (jede Seite braucht einen Nav-Eintrag)
   - Format: { items: [{ label: "Startseite", href: "/" }, { label: "Leistungen", href: "/leistungen" }, ...], cta: { label: "Jetzt anfragen", href: "/kontakt" } }
   - WICHTIG: href MUSS mit "/" beginnen + den Slug der Seite enthalten

4. FOOTER (PUT /api/v1/content/footer):
   - columns: MINDESTENS 2-3 Spalten, JEDE mit title UND items-Array
   - cta: { label: "Jetzt anfragen", href: "/kontakt" } (optionaler CTA-Button im Footer)
   - Beispiel: { columns: [{ title: "Leistungen", items: [{ text: "Badezimmer", href: "/c/leistungen/badezimmer" }, ...] }, { title: "Unternehmen", items: [{ text: "Über uns", href: "/ueber-uns" }, { text: "Kontakt", href: "/kontakt" }] }], legalLinks: [{ label: "Impressum", href: "/impressum" }, { label: "Datenschutz", href: "/datenschutz" }], cta: { label: "Termin vereinbaren", href: "/kontakt" } }
   - NIEMALS leere items-Arrays! Jede Spalte braucht mindestens 2 Links.

5. SEITEN (POST /api/v1/content/pages) — Erstelle ALLE diese Seiten:
   a) Startseite (slug: "startseite") — MINDESTENS 6 Sections:
      - hero (mit headline, subline, bgImage, primaryCta, secondaryCta, trustItems)
      - uspStrip (mindestens 4 Items)
      - servicesGrid (mindestens 4 manualCards mit title, text, icon, href zu Collection-Detail)  
      - processSteps ODER textImage
      - testimonials ODER stats
      - faq (mindestens 4 Fragen)
      - ctaBand (mit headline, subline, ctaPrimary)
   
   b) Leistungen-Übersicht (slug: "leistungen"):
      - collectionHero (headline, subline)
      - servicesGrid (ALLE Leistungen als manualCards mit href="/c/leistungen/[slug]")
      - ctaBand
   
   c) Über uns (slug: "ueber-uns"):
      - collectionHero
      - textImage (mit echtem Text über die Firma, Bild)
      - stats (Gründungsjahr, Mitarbeiter, Projekte, etc.)
      - team (mindestens 2-3 Teammitglieder mit name, role)
      - ctaBand
   
   d) Kontakt (slug: "kontakt"):
      - collectionHero
      - contact (headline, subline, formEnabled: true, mapEmbedUrl wenn möglich)
      - textImage (Öffnungszeiten oder Anfahrt-Info)
   
   e) Impressum (slug: "impressum"):
      - legalContent (headline: "Impressum", blocks mit: Verantwortlicher, Kontaktdaten, Handelsregister, USt-IdNr, Haftungshinweis, Urheberrecht)
   
   f) Datenschutz (slug: "datenschutz"):
      - legalContent (headline: "Datenschutzerklärung", blocks mit: Verantwortlicher, Hosting, Cookies, Kontaktformular, Analyse-Tools, Rechte der Betroffenen)

6. COLLECTIONS — Erstelle MINDESTENS eine Collection für die Kernleistungen:
   - POST /api/v1/content/collections → { key: "leistungen", label: "Leistungen" }
   - Dann für JEDE Leistung ein Item erstellen (MINDESTENS 4 Items):
     POST /api/v1/content/collections/leistungen/items → { title: "...", slug: "...", data: { sections: [...] } }
   - Jedes Collection-Item braucht sections mit echtem Content (collectionHero + textImage + ctaBand minimum)   - WICHTIG: Jede Section in data.sections MUSS ein "id"-Feld haben (UUID v4 Format, z.B. "a1b2c3d4-e5f6-7890-abcd-ef1234567890"). Ohne ID funktioniert Drag&Drop im Editor nicht!
7. SEO (PUT /api/v1/content/seo):
   - titleTemplate: "%s | ${auth.tenant.name}"
   - defaultTitle: Firmenname oder Slogan (Fallback-Titel)
   - defaultDescription: Aussagekräftige Beschreibung
   - defaultOgImage: URL zu einem OG-Bild (wird auf Social Media gezeigt wenn kein seitenspezifisches OG-Bild gesetzt ist)
   - canonicalBase?: "https://domain.de" (optionale Basis-URL für canonical tags)
   - locale?: "de_DE" (Standard)
   - Dann für JEDE Seite: PUT /api/v1/content/seo/:pageId mit metaTitle und metaDescription

8. PUBLISH (POST /api/v1/content/publish):
   - IMMER als letzter Schritt aufrufen!

9. SOCIAL LINKS (PUT /api/v1/content/social-links):
   - Setze passende Social-Media-Profile: { facebook: "url", instagram: "url", google: "url" }
   - Typisch je Branche: Handwerk (Google, Facebook, Instagram), Restaurant (Instagram, Facebook, Google, TripAdvisor), Hotel (Instagram, Facebook, TripAdvisor, Google), Salon (Instagram, Facebook, Google), Medical (Google, Jameda-Link als google), Tourism (Instagram, Facebook, YouTube), Photography (Instagram, Pinterest, Facebook), Wedding (Instagram), Consulting (LinkedIn, Google), Realestate (LinkedIn, Instagram, Google), Cafe (Instagram, Facebook, Google)

10. STYLE (PUT /api/v1/content/style):
    - Wähle den passenden Stil: { style: "classic" } oder "modern" oder "bold"
    - Empfehlung: Hotels/Restaurants → classic, Handwerk/Medical → modern, Fotografie/Salons → bold

═══════════════════════════════════════════
CONTENT-REGELN:
═══════════════════════════════════════════

- JEDES Feld das nicht mit "?" markiert ist, MUSS gefüllt werden
- Array-Felder (items, services, steps, etc.) brauchen MINDESTENS 3-4 Einträge
- Texte müssen ECHTEN, branchenspezifischen Content haben (keine Platzhalter)
- Icons: Verwende passende Lucide-Icon-Namen (z.B. "Wrench", "Phone", "Mail", "MapPin", "Clock", "Shield", "Award", "Users", "Star", "ChevronRight")
- Bilder: Verwende Unsplash-URLs im Format https://images.unsplash.com/photo-XXXXX?w=1200&q=80
- CTAs: Immer mit konkretem href zu einer existierenden Seite (z.B. "/kontakt", "/leistungen")
- ServicesGrid href: Verlinke zu Collection-Detail-Seiten als "/c/leistungen/[slug]"
- Hero Overlay: Nutze overlayColor (hex) + overlayOpacity (0-1) um das Bild-Overlay zu steuern. Ohne diese Felder wird das Standard-Gradient der Branche verwendet.
- Bild-Effekte: Nutze imageEffect (parallax, kenBurns) + imageEffectIntensity (subtle/medium/strong) bei hero und collectionHero für visuelle Aufwertung. Standard: kein Effekt.
- Google Maps: Nutze eine EIGENE "map" Section (NICHT in contact einbauen!). embedUrl = Google Maps > Teilen > Einbetten > src-URL aus dem iframe kopieren. Kontaktseite typisch: hero + contact (Formular+InfoCards) + map (Google Maps Embed).
- SECTION-AUSWAHL: In availableSectionTypes sind auch Sections aus ANDEREN Branchen enthalten (markiert mit Kategorie "Andere: ..."). Bevorzuge IMMER die brancheneigenen Sections! Nutze fremde Sections nur, wenn deine Branche keine passende eigene Section hat. Beispiel: Ein Hotel nutzt "roomShowcase" statt "servicesGrid".

═══════════════════════════════════════════
BEISPIEL — So sieht ein korrekter servicesGrid-Aufruf aus:
═══════════════════════════════════════════

WICHTIG: Das Array-Feld heißt "manualCards" (NICHT "services")!
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
      { "icon": "Droplets", "title": "Leckortung", "text": "Modernste Messtechnik zur zerstörungsfreien Ortung von Wasserschäden.", "href": "/c/leistungen/leckortung", "mediaType": "icon" },
      { "icon": "Wind", "title": "Bautrocknung", "text": "Professionelle Trocknung mit überwachtem Trocknungsverlauf.", "href": "/c/leistungen/bautrocknung", "mediaType": "icon" },
      { "icon": "Hammer", "title": "Sanierung", "text": "Fachgerechte Wiederherstellung nach Wasserschäden.", "href": "/c/leistungen/sanierung", "mediaType": "icon" },
      { "icon": "FileCheck", "title": "Versicherungsabwicklung", "text": "Komplette Dokumentation und Kommunikation mit Ihrer Versicherung.", "href": "/c/leistungen/versicherung", "mediaType": "icon" }
    ]
  }
}

WICHTIG: Jede Karte MUSS title und text haben. icon ODER image ist optional.
Card-Schema: { title: string, text: string, icon?: lucide-name, image?: url, mediaType?: 'icon'|'image', href?: string }
Die href-Werte MÜSSEN auf Collection-Items verweisen die du vorher angelegt hast.

═══════════════════════════════════════════
BEISPIEL — Footer mit vollständigen columns:
═══════════════════════════════════════════

{
  "columns": [
    { "title": "Leistungen", "items": [{ "text": "Leckortung", "href": "/c/leistungen/leckortung" }, { "text": "Bautrocknung", "href": "/c/leistungen/bautrocknung" }, { "text": "Sanierung", "href": "/c/leistungen/sanierung" }] },
    { "title": "Unternehmen", "items": [{ "text": "Über uns", "href": "/ueber-uns" }, { "text": "Team", "href": "/ueber-uns" }, { "text": "Kontakt", "href": "/kontakt" }] },
    { "title": "Service", "items": [{ "text": "Notdienst", "href": "/kontakt" }, { "text": "FAQ", "href": "/startseite" }] }
  ],
  "legalLinks": [{ "label": "Impressum", "href": "/impressum" }, { "label": "Datenschutz", "href": "/datenschutz" }],
  "cta": { "label": "Schaden melden", "href": "/kontakt" }
}

WICHTIG: Jede column MUSS ein items-Array mit mindestens 2 Einträgen haben! Leere columns crashen die Seite.

═══════════════════════════════════════════
BEISPIEL — Contact-Section mit Info-Karten:
═══════════════════════════════════════════

{
  "type": "contact",
  "data": {
    "headline": "Kontaktieren Sie uns",
    "subline": "Wir sind für Sie da",
    "formEnabled": true,
    "mapEmbedUrl": "https://www.google.com/maps/embed?pb=..."
  }
}

Hinweis: Die Kontaktdaten (Adresse, Telefon, E-Mail) werden automatisch aus den Brand/Contact-Settings geladen. Du MUSST also vorher PUT /contact mit allen Daten aufrufen!

═══════════════════════════════════════════
HÄUFIGE FEHLER (VERMEIDE DIESE):
═══════════════════════════════════════════

❌ Footer ohne items in columns → CRASH
❌ servicesGrid mit "services" statt "manualCards" → Karten werden NICHT angezeigt!
❌ servicesGrid mit manualCards aber OHNE href → keine Verlinkung
❌ servicesGrid mit manualCards aber OHNE text → leere Beschreibung
❌ Navigation ohne CTA → fehlender Anruf-Button
❌ Leistungen nur als Seiten statt Collection Items
❌ Collection-Items angelegt aber NICHT im servicesGrid referenziert
❌ Kontaktseite ohne contact-Section → kein Formular
❌ Hero ohne primaryCta → kein Call-to-Action
❌ Sections mit leeren/fehlenden Pflichtfeldern
❌ Array-Felder mit 0 oder 1 Einträgen (MINIMUM 3)
❌ Slugs mit führendem "/" (FALSCH: "/kontakt", RICHTIG: "kontakt")
❌ Publish vergessen am Ende

WICHTIG — Slugs:
Slugs dürfen NIEMALS mit "/" beginnen. Slug = nur Pfadteil, z.B. "kontakt", "ueber-uns", "leistungen". Die Startseite MUSS den Slug "startseite" haben.

WICHTIG — Collections statt Unterseiten:
Für wiederkehrende Inhalte (Leistungen, Zimmer, News, Team, Referenzen, Behandlungen) IMMER Collections verwenden.
Workflow: 1) POST /collections → { key, label }  2) POST /collections/:key/items für jeden Eintrag  3) Auf Übersichtsseiten servicesGrid mit href="/c/:key/:slug" nutzen`,
  });
}

function getSectionSchemas(industry: string): Record<string, object> {
  const schemas: Record<string, object> = {
    hero: { fields: { headline: 'string', subline: 'string', badgeText: 'string?', badgeIcon: 'lucide-icon-name?', badgeStarsIcon: 'lucide-icon-name? (leer = keine Sterne)', bgImage: 'url?', bgImageMobile: 'url?', bgColor: 'hex? (alternative bg color if no image)', bgMode: '"image"|"color"|"gradient" (default gradient)', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', trustItems: 'string[]?', trustStripColor: 'hex?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string? (CSS object-position, e.g. "center 30%")', bgPositionMobile: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
    richText: { fields: { headline: 'string?', content: 'html-string' } },
    legalContent: { fields: { headline: 'string', blocks: '{ headline: string, text: string (html) }[] — je ein Block pro Thema (z.B. Verantwortlicher, Kontakt, Hosting, Cookies etc.)' } },
    freeText: { fields: { content: 'rich-text (Tiptap JSON or HTML)' } },
    videoEmbed: { fields: { headline: 'string?', subline: 'string?', videoUrl: 'youtube/vimeo URL', aspectRatio: '"16:9"|"4:3"|"1:1"?' } },
    embed: { fields: { headline: 'string?', subline: 'string?', mode: '"standard"|"preset"', provider: 'string? (doctolib|calendly|opentable|treatwell|simplybook|provenexpert|jameda|google-reviews|outdooractive|komoot|booking|youtube|vimeo|spotify|typeform|instagram)', config: 'Record<string,string> — provider-specific fields', embedCode: 'string? (raw iframe HTML, only for mode=standard)', height: 'number? (px)', maxWidth: 'string? (e.g. "800px" or "100%")' } },
    textImage: { fields: { headline: 'string', text: 'string (html)', badge: 'string?', image: 'url', imageAlt: 'string?', layout: '"image-right"|"image-left"', items: '{ icon?: lucide-icon-name, title: string, text: string }[]?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?' } },
    collectionHero: { fields: { headline: 'string', subline: 'string?', bgImage: 'url?', category: 'string?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string?', imageEffect: '"none"|"parallax"|"kenBurns"?', imageEffectIntensity: '"subtle"|"medium"|"strong"?' } },
    noticeBanner: { fields: { headline: 'string', subline: 'string?', text: 'string? (html)', bgColor: 'hex?', textColor: 'hex? (default white)', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?' } },
    statsCounter: { fields: { headline: 'string', subline: 'string?', stats: '{ value: number|string, suffix?: string, prefix?: string, label: string }[] (4 items recommended, value can be a number for animated counter OR a string like "seit 2019" for non-numeric facts)' } },
    bentoGrid: { fields: { headline: 'string', subline: 'string?', items: '{ title: string, text: string, icon?: lucide-icon-name, image?: url, span?: "1"|"2" }[] (asymmetric grid with hover spotlight)' } },
    testimonialMarquee: { fields: { headline: 'string?', items: '{ quote: string, name: string, role?: string, image?: url, rating?: 1-5 }[] (min 6 items, auto-scrolling in 2 rows)' } },
    featureShowcase: { fields: { headline: 'string', subline: 'string?', image: 'url', features: '{ icon?: lucide-icon-name, title: string, text: string }[]', ctaPrimary: '{ label: string, href: string }?' } },
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
    team: { fields: { headline: 'string', subline: 'string?', badgeText: 'string?', membersHeadline: 'string?', members: '{ name: string, role: string, image?: url, bio?: string }[]', storyHeadline: 'string?', storyText: 'string?', storyImage: 'url?', valuesHeadline: 'string?', values: '{ icon: lucide-icon-name, title: string, text: string }[]?', stats: '{ value: string, label: string }[]?' } },
    stats: { fields: { headline: 'string?', stats: '{ icon?: lucide-icon-name, value: number|string, suffix?: string, prefix?: string, label: string }[] (value: number for animated counter, or string like "seit 2019" for text facts)' } },
    galleryGrid: { fields: { headline: 'string', subline: 'string?', columns: '2|3|4?', images: '{ src: url, alt: string, caption?: string }[]' } },
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
      textImage: { fields: { headline: 'string', text: 'string (html)', badge: 'string?', image: 'url', imageAlt: 'string?', layout: '"image-right" | "image-left"', items: '{ icon?: lucide-icon-name, title: string, text: string }[]?', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?' } },
      galleryGrid: { fields: { headline: 'string', subline: 'string?', columns: '2|3|4?', images: '{ src: url, alt: string, caption?: string }[]' } },
      stats: { fields: { headline: 'string?', stats: '{ icon?: lucide-icon-name, value: number|string, suffix?: string, prefix?: string, label: string }[] (value: number for animated counter, or string like "seit 2019" for text facts)' } },
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
      heroRealestate: { fields: { headline: 'string', subline: 'string?', ctaLabel: 'string?', ctaHref: 'string?', bgImage: 'url?' } },
      propertyShowcase: { fields: { headline: 'string', subline: 'string?', properties: '{ title: string, price: string, size?: string, rooms?: number, image?: url, href?: string, badge?: string }[]' } },
      propertySearch: { fields: { headline: 'string', subline: 'string?', filters: '{ type: string[], location: string[], priceRange?: string }?' } },
      marketReport: { fields: { headline: 'string', subline: 'string?', stats: '{ label: string, value: string, trend?: up|down|stable }[]', text: 'string (html)?' } },
      agentTeam: { fields: { headline: 'string', subline: 'string?', members: '{ name: string, role?: string, image?: url, phone?: string, email?: string }[]' } },
      valuationCta: { fields: { headline: 'string', subline: 'string?', ctaLabel: 'string?', ctaHref: 'string?', bgImage: 'url?' } },
      referencesSold: { fields: { headline: 'string', subline: 'string?', properties: '{ title: string, location?: string, soldPrice?: string, image?: url }[]' } },
      locationHighlight: { fields: { headline: 'string', subline: 'string?', text: 'string (html)', image: 'url?', features: 'string[]?' } },
      testimonials: { fields: { headline: 'string', subline: 'string?', items: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]' } },
      faq: { fields: { headline: 'string', subline: 'string?', items: '{ question: string, answer: string }[]' } },
      contact: { fields: { headline: 'string', subline: 'string?', phone: 'string?', email: 'string?', address: 'string?', hours: 'string[]?' } },
    });
  } else if (industry === 'cafe') {
    Object.assign(schemas, {
      heroCafe: { fields: { headline: 'string', subline: 'string?', ctaLabel: 'string?', ctaHref: 'string?', bgImage: 'url?' } },
      drinkMenu: { fields: { headline: 'string', subline: 'string?', categories: '{ name: string, items: { name: string, description?: string, price: string }[] }[]' } },
      foodMenu: { fields: { headline: 'string', subline: 'string?', items: '{ name: string, description?: string, price: string, image?: url, tags?: string[] }[]' } },
      atmosphereGallery: { fields: { headline: 'string', subline: 'string?', images: '{ src: url, alt?: string }[]' } },
      dailySpecials: { fields: { headline: 'string', subline: 'string?', specials: '{ day?: string, title: string, description?: string, price?: string }[]' } },
      eventCalendar: { fields: { headline: 'string', subline: 'string?', events: '{ title: string, date: string, time?: string, description?: string, image?: url }[]' } },
      locationVibe: { fields: { headline: 'string', subline: 'string?', text: 'string (html)', image: 'url?', features: 'string[]?' } },
      testimonials: { fields: { headline: 'string', subline: 'string?', items: '{ quote: string, name: string, context?: string, rating?: 1-5 }[]' } },
      faq: { fields: { headline: 'string', subline: 'string?', items: '{ question: string, answer: string }[]' } },
      contact: { fields: { headline: 'string', subline: 'string?', phone: 'string?', email: 'string?', address: 'string?', hours: 'string[]?' } },
    });
  }

  return schemas;
}
