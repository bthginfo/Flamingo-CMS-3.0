import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { pages, globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { getSectionTypesForIndustry } from '@/app/admin/pages/[id]/section-types';
import { resolveSectionDefinition } from '@/templates';
import { FIELD_DEFS, PUBLIC_COLOR_FIELD_KEYS, type ColorFieldKey } from '@/lib/section-color-fields';
import { getFieldsForSection } from '@/lib/section-color-resolver';
import {
  SECTION_COLOR_CONTRACTS_GENERATED,
  SECTION_COLOR_CONTRACTS_GENERIC,
  SECTION_COLOR_CONTRACTS_ANY,
} from '@/lib/section-color-contracts-generated';
import { getSectionSchemas } from '@/lib/section-data-schemas';
import { buildAiAgentContract, buildAiAgentPrompt } from '@/lib/ai-agent-guidance';

export async function GET(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();

  const hasShop = auth.addons.includes('shop');
  const hasBooking = auth.addons.includes('booking');

  const tenantPages = await db.select({ id: pages.id, slug: pages.slug, title: pages.title }).from(pages).where(eq(pages.tenantId, auth.tenantId));
  const [settings] = await db.select({ brand: globalSettings.brand, contact: globalSettings.contact })
    .from(globalSettings)
    .where(eq(globalSettings.tenantId, auth.tenantId))
    .limit(1);
  const existingBrand = (settings?.brand || {}) as Record<string, unknown>;
  const existingContact = (settings?.contact || {}) as Record<string, unknown>;

  const sectionTypes = getSectionTypesForIndustry(auth.tenant.industry, { hasShop, hasBooking });
  // Exclude HTML-Block (freeHtml) from AI usage
  const allowedSectionTypes = sectionTypes
    .filter((s: { type?: string; id?: string; requiresAddon?: 'shop' | 'booking' }) => {
      const key = s.type || s.id || '';
      const addonAvailable = !s.requiresAddon
        || (s.requiresAddon === 'shop' && hasShop)
        || (s.requiresAddon === 'booking' && hasBooking);
      return addonAvailable && key !== 'freeHtml' && key !== 'htmlBlock' && key !== 'html';
    })
    .map(section => {
      const definition = resolveSectionDefinition({ type: section.type, industry: auth.tenant.industry });
      return {
        ...section,
        definitionKey: definition?.key,
        schemaVersion: definition?.schemaVersion,
      };
    });
  const sectionDataSchemas = getSectionSchemas(auth.tenant.industry);

  const response: Record<string, unknown> = {
    tenant: auth.tenant,
    tenantId: auth.tenantId,
    hasShopAddon: hasShop,
    hasBookingAddon: hasBooking,
    i18n: {
      enabled: auth.tenant.i18nEnabled,
      locales: auth.tenant.i18nLocales.split(','),
      defaultLocale: auth.tenant.i18nDefaultLocale,
    },
    existingPages: tenantPages,
    availableSectionTypes: allowedSectionTypes,
    sectionDataSchemas,
    styleSystem: getStyleSystemInstructions(),
    sectionStyleContracts: getSectionStyleContracts(allowedSectionTypes, auth.tenant.industry),
    aiContentPlaybook: getAiContentPlaybook(auth.tenant.industry, { hasShop, hasBooking }),
    agentContract: buildAiAgentContract({
      tenantName: auth.tenant.name,
      industry: auth.tenant.industry,
      allowedSections: allowedSectionTypes,
      existingPages: tenantPages,
      sectionSchemas: sectionDataSchemas,
      hasShop,
      hasBooking,
      siteProfileSeed: {
        businessName: typeof existingBrand.companyName === 'string' ? existingBrand.companyName : auth.tenant.name,
        industry: auth.tenant.industry,
        address: typeof existingContact.address === 'string' ? existingContact.address : undefined,
        phone: typeof existingContact.phone === 'string' ? existingContact.phone : undefined,
        email: typeof existingContact.email === 'string' ? existingContact.email : undefined,
      },
    }),
    endpoints: {
      brand: { method: 'PUT', path: '/api/v1/content/brand', description: 'Set brand data (companyName, tagline, primaryColor, logoUrl, faviconUrl, etc.)' },
      contact: { method: 'PUT', path: '/api/v1/content/contact', description: 'Set contact info (email, phone, address, whatsapp, whatsappEnabled, whatsappColor)' },
      navigation: { method: 'PUT', path: '/api/v1/content/navigation', description: 'Set nav items + CTA' },
      footer: { method: 'PUT', path: '/api/v1/content/footer', description: 'Set footer columns + legal links + CTA' },
      createPage: { method: 'POST', path: '/api/v1/content/pages', description: 'Create or idempotently update a page. Send upsert: true so retries and corrections update an existing slug instead of returning 409.' },
      updatePage: { method: 'PUT', path: '/api/v1/content/pages/:id', description: 'Update a page (title, sections)' },
      deletePage: { method: 'DELETE', path: '/api/v1/content/pages/:id', description: 'Delete a page' },
      seoGlobal: { method: 'PUT', path: '/api/v1/content/seo', description: 'Set global SEO defaults (titleTemplate, defaultDescription, canonicalBase, locale)' },
      seoPage: { method: 'PUT', path: '/api/v1/content/seo/:pageId', description: 'Set page-level SEO (metaTitle, metaDescription, ogImage, canonical, noindex)' },
      design: { method: 'PUT', path: '/api/v1/content/design', description: 'Set GLOBAL design defaults. These cascade to every section. For PER-SECTION color tuning use section.styleOverrides with the exact fields from sectionStyleContracts[type].colorFields.' },
      formFields: { method: 'PUT', path: '/api/v1/content/form-fields', description: 'Set contact form fields: { fields: [{ name, label, type: "text"|"email"|"tel"|"textarea"|"select", placeholder?, required?, options?, halfWidth? }] }' },
      openingHours: { method: 'PUT', path: '/api/v1/content/opening-hours', description: 'Set opening hours: { hours: [{ type?: "regular"|"special", day?: string, date?: "YYYY-MM-DD", hours?: string, closed?: boolean, note?: string }] }. Use regular rows for weekly hours and special rows for holidays, vacations or one-off changes.' },
      listCollections: { method: 'GET', path: '/api/v1/content/collections', description: 'List all collections' },
      createCollection: { method: 'POST', path: '/api/v1/content/collections', description: 'Create a new collection (key: lowercase-slug, label: display name). Use for repeating content types like services, rooms, news, team members, etc.' },
      createCollectionItem: { method: 'POST', path: '/api/v1/content/collections/:key/items', description: 'Create a collection item (title, slug, data with sections)' },
      updateCollectionItem: { method: 'PUT', path: '/api/v1/content/collections/:key/items/:id', description: 'Update a collection item (full replace of provided fields)' },
      patchCollectionItem: { method: 'PATCH', path: '/api/v1/content/collections/:key/items/:id', description: 'Partially update a collection item (merges data fields instead of replacing)' },
      getCollectionItem: { method: 'GET', path: '/api/v1/content/collections/:key/items/:id', description: 'Get a single collection item with all data' },
      deleteCollectionItem: { method: 'DELETE', path: '/api/v1/content/collections/:key/items/:id', description: 'Delete a collection item' },
      patchPage: { method: 'PATCH', path: '/api/v1/content/pages/:id', description: 'Partially update a page. Send patchSections: [{id, data: {partial fields}}] to merge section data without full replace.' },
      publish: { method: 'POST', path: '/api/v1/content/publish', description: 'Publish all current content. Returns warnings (incomplete content) AND colorWarnings (low contrast / malformed colors). Call /validate FIRST.' },
      validate: { method: 'GET', path: '/api/v1/content/validate', description: 'Pre-publish audit. Returns { readyToPublish, summary, contentIssues, colorIssues }. ALWAYS call before /publish, fix every error + critical warning, repeat until readyToPublish=true.' },
      validatePlan: { method: 'POST', path: '/api/v1/content/validate', description: 'Preflight a siteProfile + page plan before any write. Returns stable issue codes, exact locations and deterministic repair instructions.' },
      debug: { method: 'GET', path: '/api/v1/content/debug', description: 'Get raw stored data for all pages, sections, collections and items (for debugging)' },
      socialLinks: { method: 'PUT', path: '/api/v1/content/social-links', description: 'Set social media links: { facebook?: url, instagram?: url, linkedin?: url, youtube?: url, tiktok?: url, xing?: url, google?: url, pinterest?: url, twitter?: url }' },
      style: { method: 'PUT', path: '/api/v1/content/style', description: 'Set active style variant. Only { style: "classic" } is supported; old modern/bold values are ignored by the renderer.' },
      upload: { method: 'POST', path: '/api/v1/content/upload', description: 'Upload an image (multipart/form-data with "file" field). Returns { url, filename, size }. Use the returned url in bgImage, image fields etc.' },
      i18nGet: { method: 'GET', path: '/api/v1/content/i18n', description: 'Get i18n config (enabled, locales, defaultLocale), all pages with section data, AND all collections with their items and embedded sections. Use to discover which sections/items need translation.' },
      i18nPut: { method: 'PUT', path: '/api/v1/content/i18n', description: 'Update locale-specific data. Body: { sections?: [{ id, locale, data }], items?: [{ id: "collection-item-id", locale, title?, excerpt?, sections?: [{ id: "section-id-in-item", data }] }] }. Works for both page sections and collection item sections.' },
      ...(hasShop ? {
        shopCreateCategory: { method: 'POST', path: '/api/v1/shop/categories', description: 'Create a product category: { name, slug, description?, image? }' },
        shopUpdateCategory: { method: 'PUT', path: '/api/v1/shop/categories/:id', description: 'Update a product category' },
        shopDeleteCategory: { method: 'DELETE', path: '/api/v1/shop/categories/:id', description: 'Delete a product category' },
        shopListCategories: { method: 'GET', path: '/api/v1/shop/categories', description: 'List all product categories' },
        shopCreateProduct: { method: 'POST', path: '/api/v1/shop/products', description: 'Create a product: { title, slug, categoryId?, description?, shortDescription?, priceCents, comparePriceCents?, images?: url[], stock?, status?: "active"|"draft", highlights?: string[] }' },
        shopUpdateProduct: { method: 'PUT', path: '/api/v1/shop/products/:id', description: 'Update a product (full replace of provided fields)' },
        shopDeleteProduct: { method: 'DELETE', path: '/api/v1/shop/products/:id', description: 'Delete a product' },
        shopListProducts: { method: 'GET', path: '/api/v1/shop/products', description: 'List all products' },
        shopSettings: { method: 'PUT', path: '/api/v1/shop/settings', description: 'Update shop settings: { currency?, paymentMethods?: string[], pickupEnabled?, pickupInstructions?, notificationEmail?, orderPrefix?, invoicePrefix?, lowStockThreshold?, companyInfo?: { name, street, zip, city, country, email?, phone?, taxId?, vatId?, registerCourt?, registerNumber?, ceo? }, bankDetails?: { iban, bic, bankName, accountHolder } }' },
        shopGetSettings: { method: 'GET', path: '/api/v1/shop/settings', description: 'Get current shop settings (secrets are redacted)' },
        shopListShipping: { method: 'GET', path: '/api/v1/shop/shipping', description: 'List all shipping zones with their methods' },
        shopCreateShipping: { method: 'POST', path: '/api/v1/shop/shipping', description: 'Create shipping zone: { name, countries?: string[] (ISO codes), methods?: [{ name, priceCents, freeAboveCents?, estimatedDays? }] }' },
        shopListCoupons: { method: 'GET', path: '/api/v1/shop/coupons', description: 'List all coupons' },
        shopCreateCoupon: { method: 'POST', path: '/api/v1/shop/coupons', description: 'Create coupon: { code, type: "percent"|"fixed_amount"|"free_shipping", value (cents for fixed, % for percent), minOrderCents?, maxUses?, validFrom?, validUntil?, appliesTo?: "all"|"specific_products", appliesToIds?: string[] }' },
      } : {}),
    },
    restrictions: [
      'Do NOT use section type "freeHtml" or "htmlBlock" — raw HTML is not allowed.',
      'Only use section types listed in availableSectionTypes.',
      'Only fill fields defined in sectionDataSchemas — do not invent custom fields.',
      'Section colors are NOT normal data fields. Put per-section colors into section.styleOverrides using exact field names or CSS variables from sectionStyleContracts[type].colorFields.',
      'sectionStyleContracts is COMPLETE: it also contains entries with source="borrowed" for section types that are valid in stored content but not offered in this industry\'s picker. When updating such a section, use exactly its listed colorFields.',
      'For every section with an image, dark background or overlay, explicitly set contrasting text/button colors in styleOverrides. Do not rely on global theme colors when contrast is uncertain.',
      'Never send text and background colors with low contrast. Use dark text on light backgrounds, light text on dark backgrounds, and pair --token-btn-bg with a readable --token-btn-text. WCAG AA requires a contrast ratio of 4.5:1 for body text and 3:1 for large text.',
      'Every section MUST have ALL required fields filled with real content — never leave fields empty or with placeholder text like "Lorem ipsum".',
      'Every array field (items, services, steps, etc.) MUST have at least 3 entries unless the real business has fewer.',
      'The footer MUST contain columns with items arrays. Each item needs text and optionally href. Never send empty columns or columns without items.',
      'Navigation items MUST link to existing pages using their slug (e.g. href: "/leistungen", NOT href: "/services").',
      'When using section.styleOverrides, the keys MUST be EXACTLY one of the documented keys from sectionStyleContracts. Unknown keys are rejected by API write endpoints so the problem is visible immediately.',
      'Per-section styleOverrides values are CSS colour strings — hex (#rrggbb), rgb(), rgba(), safe var(--token-*) references or safe border/dimension values are valid. Do NOT pass slot enums or label names like "primary" — these are not colours.',
      'BEFORE calling /publish, ALWAYS call GET /api/v1/content/validate. Fix every "error" issue and every contrast warning. Only publish when readyToPublish=true.',
      ...(hasShop ? ['This tenant has the SHOP addon active. Include shop pages (slug: "shop", "warenkorb") with shopProductGrid and shopCart sections. Add a "Shop" / "Produkte" link in the navigation. Create product categories and products via the shop endpoints.'] : ['This tenant does NOT have the shop addon. Do NOT create shop pages or use shop section types.']),
      ...(hasBooking ? ['This tenant has the BOOKING addon active. You may use bookingWidget, bookingSlotPicker, bookingDateRange, availabilityCalendar, resourceBookingShowcase and bookingCtaPro sections where they make sense. Use bookingSlotPicker for restaurants/cafes/salons/appointments where the visitor chooses a day and sees available times. Use bookingDateRange for hotels, apartments, locations, rooms and multi-day requests. The actual booking logic is configured in Admin > Funktionen > Buchungen.'] : ['This tenant does NOT have the booking addon. Do NOT use bookingWidget, bookingSlotPicker, bookingDateRange, availabilityCalendar, resourceBookingShowcase or bookingCtaPro. Keep simple reservation/contact sections if needed.']),
    ],
    instructions: buildAiAgentPrompt(auth.tenant.name, auth.tenant.industry),
    legacyInstructions: `Du bist ein AI-Assistent der eine "${auth.tenant.industry}"-Website für "${auth.tenant.name}" mit deutschsprachigem Content füllt.

WICHTIG: agentContract.sitemapPolicy ist für die Seitenwahl verbindlich. Die unten beschriebenen Seiten "Leistungen" und "Über uns" sind ein Dienstleister-Beispiel, keine universelle Pflicht. Erstelle keine branchenfremden Seiten; nutze required und recommended aus der Sitemap-Policy.

═══════════════════════════════════════════
PFLICHT-CHECKLISTE (alles MUSS erstellt werden):
═══════════════════════════════════════════

1. BRAND (PUT /api/v1/content/brand):
   - companyName, tagline, primaryColor, secondaryColor?, accentColor
   - logoUrl: URL zum Firmenlogo (wird im Header + Footer gezeigt)
   - faviconUrl?: separates Browser-Icon; leer lassen, wenn das Logo als Fallback genutzt werden soll
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
   - i18n: Optionales "locale" Feld um Navigation pro Sprache zu setzen: { locale: "en", items: [...], cta: {...} }

4. FOOTER (PUT /api/v1/content/footer):
   - columns: MINDESTENS 2-3 Spalten, JEDE mit title UND items-Array
   - cta: { label: "Jetzt anfragen", href: "/kontakt" } (optionaler CTA-Button im Footer)
   - Beispiel: { columns: [{ title: "Leistungen", items: [{ text: "Badezimmer", href: "/c/leistungen/badezimmer" }, ...] }, { title: "Unternehmen", items: [{ text: "Über uns", href: "/ueber-uns" }, { text: "Kontakt", href: "/kontakt" }] }], legalLinks: [{ label: "Impressum", href: "/impressum" }, { label: "Datenschutz", href: "/datenschutz" }], cta: { label: "Termin vereinbaren", href: "/kontakt" } }
   - NIEMALS leere items-Arrays! Jede Spalte braucht mindestens 2 Links.
   - i18n: Optionales "locale" Feld um Footer pro Sprache zu setzen: { locale: "en", columns: [...], legalLinks: [...], cta: {...} }

5. SEITEN (POST /api/v1/content/pages) — DIENSTLEISTER-BEISPIEL; agentContract.sitemapPolicy hat Vorrang:
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

6. COLLECTIONS — Nur wenn wiederholbare Inhalte fachlich sinnvoll sind; Key und Inhalt an sitemapPolicy/Branche anpassen. Dienstleister-Beispiel:
   - POST /api/v1/content/collections → { key: "leistungen", label: "Leistungen" }
   - Dann für JEDE Leistung ein Item erstellen (MINDESTENS 4 Items):
     POST /api/v1/content/collections/leistungen/items → { title: "...", slug: "...", data: { sections: [...] } }
   - Jedes Collection-Item braucht sections mit echtem Content (collectionHero + textImage + ctaBand minimum)   - WICHTIG: Jede Section in data.sections MUSS ein "id"-Feld haben (UUID v4 Format, z.B. "a1b2c3d4-e5f6-7890-abcd-ef1234567890"). Ohne ID funktioniert Drag&Drop im Editor nicht!
   - BILDER: Das Vorschaubild (image) für newsPreview/newsGrid/collectionList wird automatisch aus der ERSTEN hero/collectionHero-Section des Items gezogen (data.sections[0].data.backgroundImage oder .bgImage). Setze dort IMMER ein Bild!
   - Optional: data.excerpt (string) für Kurzbeschreibung in der Übersicht.
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
   - VORHER: Call GET /api/v1/content/validate. Wenn readyToPublish=false → fixe ALLE contentIssues mit severity "error" und ALLE colorIssues mit code "INVALID_COLOR_FORMAT" oder severity "error". Wiederhole bis readyToPublish=true.
   - Beachte auch die "warnings" (z.B. LOW_CONTRAST). Setze passende styleOverrides damit Texte lesbar werden, dann erneut /validate aufrufen.

═══════════════════════════════════════════
FARB- & KONTRAST-PFLICHTREGELN (verhindert "weiß auf weiß" / "dunkel auf dunkel"):
═══════════════════════════════════════════

A) JEDES Background+Text-Paar MUSS WCAG AA erfüllen:
   - Body-Text auf Hintergrund:  Kontrastverhältnis ≥ 4.5:1
   - Headlines (groß, ≥18pt):    Kontrastverhältnis ≥ 3.0:1
   - Button-Text auf Button-Bg:  ≥ 4.5:1

B) WENN sectionBg DUNKEL ist (Helligkeit < 50%, also rel. Luminanz < 0.5):
   MUSST du im SELBEN Section/Design-Payload die normalen Text-Slots passend hell SETZEN:
   - heading / --token-heading: "#ffffff"  (oder ähnlich hell)
   - body / --token-body:       "rgba(255,255,255,0.85)"
   - muted / --token-muted:     "rgba(255,255,255,0.6)"
   Die internen Dark-Aliases werden automatisch daraus abgeleitet. Sende KEINE onDark*-Felder.

   Beispiel (Dark CTA-Band):
   {
     "type": "ctaBand",
     "data": { "headline": "...", "subline": "..." },
     "styleOverrides": {
       "--token-section-bg": "#0f4c4c",
       "--token-heading": "#ffffff",
       "--token-body": "rgba(255,255,255,0.88)",
       "--token-muted": "rgba(255,255,255,0.65)",
       "--token-btn-bg": "#f5e8d8",
       "--token-btn-text": "#0f4c4c"
     }
   }

C) BUTTONS: Wenn du --token-btn-bg setzt, MUSST du --token-btn-text mitsetzen.
   Ebenso für Sekundär-Buttons.

D) BADGES/EYEBROWS: Wenn du --token-badge-bg setzt, MUSST du --token-badge-text mitsetzen.

E) BILD-HEROES mit overlayColor/overlayOpacity:
   - Bild ist meist hell-bis-mittel → dunkles Overlay (rgba(0,0,0,0.5–0.7)) + hellen Headline-Text.
   - ODER helles Overlay (rgba(255,255,255,0.85)) + dunklen Headline-Text.
   - NIE: hell-Overlay + heller Text. NIE: ohne Overlay + heller Text auf hellem Bild.

F) VERBOTENE KOMBINATIONEN (führen zu unsichtbaren Texten in der Live-Vorschau):
   ❌ sectionBg: #ffffff + heading: #f5f5f5    (weiß-grau auf weiß)
   ❌ sectionBg: #0a0a0a + heading: #1a1a1a    (fast-schwarz auf schwarz)
   ❌ btnBg: #ffffff + btnText: #cccccc        (hellgrau auf weiß)
   ❌ Dunkler Header (#1a1a1a) ohne helle heading/body/muted Textfarben
   ❌ Hero mit dunklem Bild ohne overlayOpacity ≥ 0.4 + helle heading/body/muted Textfarben

G) SICHERER WORKFLOW:
   1) Setze JEDES Mal wenn du eine eigene sectionBg setzt AUCH passende Text-Farben.
   2) Nach allen PUT/POSTs: GET /api/v1/content/validate.
   3) Fixe alle "colorIssues" bevor /publish aufgerufen wird.
   4) Der Server lehnt ungültige styleOverrides (#xyz, "primary", "blue", unbekannte Keys) mit 400 und konkretem Pfad ab — korrigiere die Werte statt sie erneut zu senden.

H) AUTO-FIX: Wenn du PUT /content/design oder section.styleOverrides mit heading/body/muted sendest,
   schreibt der Server die internen Dark-Aliases automatisch mit. Das verhindert doppelte CMS-Felder
   und hält alte Templates kompatibel. Nutze trotzdem GET /api/v1/content/validate, um Kontrastprobleme
   vor dem Publish zu finden.

═══════════════════════════════════════════
i18n — MEHRSPRACHIGKEIT:
═══════════════════════════════════════════

Prüfe ZUERST ob i18n aktiv ist: Der Response enthält ein "tenant.i18nEnabled" Feld.
Wenn i18nEnabled = false → ignoriere diesen Abschnitt komplett. Mehrsprachigkeit
ist ein kostenpflichtiges, kontobezogenes Feature und kann NICHT über die API
aktiviert werden. Der Kontoinhaber aktiviert die Sprachen im Admin unter
"Funktionen → Mehrsprachigkeit". Versuche NICHT, i18n zu aktivieren oder die
Anzahl der Sprachen zu ändern (PATCH /content/i18n antwortet mit 403).

Wenn i18nEnabled = true:

DATENMODELL:
- Jede Section speichert ihre Daten pro Locale in einer flachen Struktur
- Unübersetzte Sections haben normales data-Objekt: { headline: "...", subline: "..." }
- Übersetzte Sections haben: { _localized: true, de: { headline: "...", subline: "..." }, en: { headline: "...", subline: "..." } }
- Der Renderer fällt auf die defaultLocale zurück wenn eine Locale fehlt

WORKFLOW:
1. Erstelle ZUERST alle Inhalte in der Default-Locale (de) wie gewohnt (POST /pages, /collections, etc.)
2. Dann GET /api/v1/content/i18n aufrufen → gibt dir alle Sections mit IDs
3. Für jede Section die übersetzt werden soll: PUT /api/v1/content/i18n mit:
   { sections: [{ id: "section-uuid", locale: "en", data: { headline: "English Title", subline: "English text" } }] }
4. Du kannst mehrere Sections in einem Request übersetzen (Array)

WAS WIRD ÜBERSETZT:
- Alle Text-Felder in Section data (headline, subline, text, items[].title, items[].text, etc.)
- Collection-Item title und excerpt (über items[].title / items[].excerpt)
- Collection-Item Sections (über items[].sections[])
- NICHT übersetzen: Bild-URLs, href-Links, Icons, Farben, Zahlen, Slugs

SLUGS & NAVIGATION:
- Slugs bleiben in ALLEN Sprachen gleich (z.B. "/leistungen" für de UND en)
- Die Navigation/Footer-Texte werden über Brand/Contact/Navigation-Endpoints pro Locale gesetzt
- Der Language-Switcher wird automatisch im Frontend gerendert (Stil über Tenant-Settings)

COLLECTION-ITEMS ÜBERSETZEN:
Die GET-Response enthält auch collections[].items[].sections. Nutze PUT /content/i18n mit dem items-Array:
{
  "items": [
    {
      "id": "collection-item-uuid",
      "locale": "en",
      "title": "Leadership That Works",
      "excerpt": "English excerpt text",
      "sections": [
        { "id": "section-id-inside-item", "data": { "headline": "English Headline", "text": "<p>English text</p>" } }
      ]
    }
  ]
}
Die Section-IDs findest du in der GET-Response unter collections[].items[].sections[].id.

BEISPIEL-PAYLOAD für PUT /api/v1/content/i18n:
{
  "sections": [
    { "id": "abc-123", "locale": "en", "data": { "headline": "Our Services", "subline": "Quality from one source", "manualCards": [{ "title": "Leak Detection", "text": "Modern technology for non-destructive detection." }] } },
    { "id": "def-456", "locale": "en", "data": { "headline": "About Us", "text": "<p>We have been your partner since 2005.</p>" } }
  ],
  "items": [
    { "id": "item-789", "locale": "en", "title": "Leak Detection Service", "excerpt": "Professional leak detection", "sections": [{ "id": "sec-in-item-1", "data": { "headline": "Leak Detection", "subline": "Fast and reliable" } }] }
  ]
}

REIHENFOLGE: Immer NACH dem Erstellen aller Inhalte + VOR dem Publish übersetzen!

9. SOCIAL LINKS (PUT /api/v1/content/social-links):
   - Setze passende Social-Media-Profile: { facebook: "url", instagram: "url", google: "url" }
   - Typisch je Branche: Handwerk (Google, Facebook, Instagram), Restaurant (Instagram, Facebook, Google, TripAdvisor), Hotel (Instagram, Facebook, TripAdvisor, Google), Salon (Instagram, Facebook, Google), Medical (Google, Jameda-Link als google), Tourism (Instagram, Facebook, YouTube), Photography (Instagram, Pinterest, Facebook), Wedding (Instagram), Consulting (LinkedIn, Google), Realestate (LinkedIn, Instagram, Google), Cafe (Instagram, Facebook, Google), Retail (Instagram, Facebook, Google, Pinterest)

10. STYLE (PUT /api/v1/content/style):
    - Verwende immer { style: "classic" }.
    - Es gibt keine alternativen Website-Stile mehr. Unterschiede entstehen über Brand-Farben, globale Design-Farben und section.styleOverrides.

11. DESIGN-FARBEN — GLOBAL (PUT /api/v1/content/design):
    - Setze die globalen Farbtöne für die gesamte Site. Jeder Wert ist EIN Hex-String (z.B. "#1a5276"):
      * sectionBg, sectionBgAlt, cardBg, cardBorder
      * heading, subheading, body, muted
      * brand, accent, icon
      * btnBg, btnText
      * badgeBg, badgeText, badgeBorder
      * dividerColor
      * eyebrow, statValue, quote, ratingStar, check  (granulare Slot-Farben)
    - Diese Werte gelten als Defaults für ALLE Sections. Für einzelne Sections kannst du sie überschreiben (siehe 12.).
    - Wichtig: Achte auf WCAG-Kontrast. Bei dunkler sectionBg unbedingt heading/body/muted hell setzen; interne Dark-Aliases werden automatisch daraus geschrieben.

12. PER-SECTION FARB-OVERRIDES — section.styleOverrides:
    - Jede Section kann individuelle CSS-Variablen überschreiben — nutze styleOverrides als zusätzliches Property auf einer section.
    - Format: { "--token-<slot>": "<hexFarbe>" }
    - Erlaubte Slot-Variablen (gleicher Namensraum wie unter 11., aber mit --token- prefix und kebab-case):
      --token-section-bg, --token-section-bg-alt, --token-card-bg, --token-card-border,
      --token-heading, --token-subheading, --token-body, --token-muted, --token-icon,
      --token-eyebrow, --token-stat-value, --token-quote, --token-rating-star, --token-check,
      --token-badge-bg, --token-badge-text, --token-badge-border,
      --token-btn-bg, --token-btn-text, --token-divider
    - Beispiel:
      {
        "type": "ctaBand",
        "data": { "headline": "...", "subline": "..." },
        "styleOverrides": {
          "--token-section-bg": "#0f4c4c",
          "--token-heading": "#ffffff",
          "--token-body": "rgba(255,255,255,0.85)",
          "--token-btn-bg": "#f5e8d8",
          "--token-btn-text": "#0f4c4c"
        }
      }
    - Nutze styleOverrides SPARSAM und gezielt: typische Einsatzgebiete sind dunkle Hero-Sections, kontrastreiche CTA-Bänder, oder einzelne Karten mit Sonderfarben. Lass sonst die globalen Werte aus DESIGN gewinnen — das hält die Site konsistent.
    - Setze styleOverrides NUR für Slots die du wirklich ändern willst. Nicht-gesetzte Slots erben automatisch über die Fallback-Kette --token-* → --style-* → --brand-*.

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

WICHTIG — Interaktive Sections:
Folgende Sections speichern echte Nutzerdaten in der Datenbank:
- reservation (Restaurant): Echtes Reservierungsformular → Daten landen unter Admin > Funktionen > Reservierungen
- rsvp (Wedding): Echtes RSVP-Formular → Admin > Funktionen > RSVP-Gäste
- contact mit formEnabled:true (Alle): Kontaktformular → Admin > Posteingang
- bookingStrip (Hotel): KEIN Formular, nur CTA-Link zu externer Buchungsplattform (submitCta.href)
- propertySearch (Realestate): KEIN Suchformular, zeigt Kategorie-Karten die zu Collections verlinken
Workflow: 1) POST /collections → { key, label }  2) POST /collections/:key/items für jeden Eintrag  3) Auf Übersichtsseiten servicesGrid mit href="/c/:key/:slug" nutzen`,
  };
  if (req.nextUrl.searchParams.get('legacy') !== '1') delete response.legacyInstructions;
  return NextResponse.json(response);
}

function getStyleSystemInstructions() {
  return {
    whereToPutSectionColors: 'Set per-section colors on the section object as styleOverrides, not inside section.data.',
    sectionObjectShape: {
      type: 'sectionType',
      data: '{ content fields from sectionDataSchemas }',
      styleOverrides: {
        '--token-section-bg': '#ffffff',
        '--token-heading': '#111111',
        '--token-body': '#3f3f46',
        '--token-btn-bg': '#111111',
        '--token-btn-text': '#ffffff',
      },
    },
    globalVsSection: [
      'Use /api/v1/content/brand and /api/v1/content/design for global brand defaults.',
      'Use section.styleOverrides only when a specific section needs its own background, text, card, badge, button or overlay colors.',
      'Do not place color keys like headingColor, btnBg or cardBg inside data unless that exact field is listed in sectionDataSchemas. Renderer colors are controlled by CSS variables in styleOverrides.',
    ],
    contrastRules: [
      'Every background/text pair must be readable: section/card/image backgrounds must contrast with heading, body and muted text.',
      'Every primary CTA must define both --token-btn-bg and --token-btn-text when overriding one of them.',
      'Image sections should use a dark overlay with light text OR a light overlay with dark text. Do not use dark text on dark images.',
      'Badge colors must pair --token-badge-bg with --token-badge-text.',
      'If a section has cards on a dark section background, set --token-card-bg and text colors independently so card content remains readable.',
    ],
    canonicalSlots: [
      '--token-section-bg', '--token-section-bg-alt', '--token-card-bg', '--token-card-border',
      '--token-heading', '--token-subheading', '--token-body', '--token-muted',
      '--token-icon', '--token-accent', '--token-eyebrow', '--token-stat-value',
      '--token-quote', '--token-rating-star', '--token-check',
      '--token-badge-bg', '--token-badge-text', '--token-badge-border',
      '--token-btn-bg', '--token-btn-text', '--token-divider',
      '--token-image-overlay', '--token-card-radius', '--token-button-radius',
    ],
    commonCssVariables: Object.fromEntries(
      PUBLIC_COLOR_FIELD_KEYS.map((slot) => {
        const def = FIELD_DEFS[slot];
        return [slot, {
        cssVar: def.cssVar,
        label: def.label,
        description: def.description,
        group: def.group,
        }];
      })
    ),
  };
}

function getAiContentPlaybook(industry: string, addons: { hasShop: boolean; hasBooking: boolean }) {
  const industryHints: Record<string, {
    tone: string;
    preferredCollectionKeys: string[];
    preferredSections: string[];
    avoidPatterns: string[];
  }> = {
    tradesman: {
      tone: 'klar, verlässlich, meisterlich, konkret; Probleme und Ablauf erklären statt nur Versprechen machen',
      preferredCollectionKeys: ['leistungen', 'referenzen', 'news'],
      preferredSections: ['hero', 'servicesGrid', 'processSteps', 'serviceDetail', 'portfolio', 'testimonials', 'faq', 'ctaBand'],
      avoidPatterns: ['Luxus-Sprache ohne Substanz', 'zu viel Lifestyle statt handwerklicher Ablauf', 'Notdienst ohne Kontakt-CTA'],
    },
    restaurant: {
      tone: 'sinnlich, produktnah, gastgeberhaft, kurze Sätze; Herkunft, Saison, Atmosphäre und Reservierung klar machen',
      preferredCollectionKeys: ['speisekarte', 'events', 'news'],
      preferredSections: ['hero', 'menu', 'signatureDishes', 'reservation', 'ambience', 'events', 'testimonials', 'gallery', 'contact'],
      avoidPatterns: ['generische Food-Floskeln', 'Speisekarte ohne Preise oder Kategorien', 'Reservierung ohne Telefon-Alternative'],
    },
    hotel: {
      tone: 'warm, ruhig, gastgeberhaft, ortsverliebt; Zimmer, Lage, Spa und Direktanfrage sauber einordnen',
      preferredCollectionKeys: ['leistungen', 'angebote', 'news'],
      preferredSections: ['hero', 'bookingStrip', 'roomShowcase', 'wellness', 'hotelDining', 'location', 'offers', 'testimonials', 'faq'],
      avoidPatterns: ['Portal-Sprache', 'Zimmer ohne Preis-/Größenhinweise', 'zu laute Superlative'],
    },
    salon: {
      tone: 'modern, persönlich, beratend; Ergebnis, Alltagstauglichkeit, Preislogik und Termin klar machen',
      preferredCollectionKeys: ['leistungen', 'news'],
      preferredSections: ['hero', 'priceList', 'packages', 'team', 'gallery', 'expertise', 'beforeAfter', 'testimonials', 'bookingCta'],
      avoidPatterns: ['Beauty-Floskeln ohne konkrete Beratung', 'Preise ohne Dauer/Hinweis', 'zu viel Weiß-auf-hell bei Foto-Sections'],
    },
    tourism: {
      tone: 'bildreich, lokal, einladend, aber konkret; Routen, Saison, Wetter, Mobilität und Alternativen erklären',
      preferredCollectionKeys: ['erlebnisse', 'routen', 'news'],
      preferredSections: ['hero', 'destinationHighlights', 'experienceGrid', 'seasonTeaser', 'tourRoutes', 'placesMap', 'visitorInfo', 'downloadGuides', 'tourismContact'],
      avoidPatterns: ['beliebige Reiseführer-Sprache', 'Routen ohne Dauer/Schwierigkeit', 'Saisonhinweise ohne konkrete Konsequenz'],
    },
    medical: {
      tone: 'sachlich, vertrauensbildend, ruhig; Datenschutz, klare Abläufe, Terminarten und verständliche Befunde betonen',
      preferredCollectionKeys: ['leistungen', 'ratgeber', 'team'],
      preferredSections: ['hero', 'doctorTeam', 'servicesGrid', 'equipmentHighlights', 'downloadForms', 'practiceGallery', 'faq', 'contact'],
      avoidPatterns: ['Heilsversprechen', 'zu aggressive CTAs', 'medizinische Aussagen ohne Vorsicht'],
    },
    wedding: {
      tone: 'persönlich, emotional, aber nicht kitschig; Ablauf, Ort, RSVP und Gastinfos klar machen',
      preferredCollectionKeys: ['updates', 'orte', 'news'],
      preferredSections: ['hero', 'coupleStory', 'eventSchedule', 'venueInfo', 'travelInfo', 'rsvp', 'dresscode', 'weddingMenu', 'faq'],
      avoidPatterns: ['Kitsch ohne Information', 'RSVP ohne Deadline', 'zu dunkle Overlays mit dunklem Text'],
    },
    photography: {
      tone: 'visuell ruhig, präzise, beobachtend; Bildstil, Ablauf, Pakete und Auswahlprozess zeigen',
      preferredCollectionKeys: ['leistungen', 'portfolio', 'news'],
      preferredSections: ['hero', 'portfolioGallery', 'servicesGrid', 'featureShowcase', 'beforeAfterStoryPro', 'testimonials', 'contact'],
      avoidPatterns: ['zu viel Text vor den Bildern', 'leere Galerie-Kacheln', 'Kontakt ohne Einsatzgebiet'],
    },
    consulting: {
      tone: 'präzise, outcome-orientiert, B2B-tauglich; Probleme, Vorgehen, Ergebnis und Entscheidungslogik zeigen',
      preferredCollectionKeys: ['leistungen', 'cases', 'news'],
      preferredSections: ['hero', 'servicesGrid', 'comparisonTable', 'processSteps', 'statsCounter', 'portfolio', 'proofWall', 'ctaBand'],
      avoidPatterns: ['Berater-Buzzwords ohne Ergebnis', 'Cases ohne Ausgangslage/Resultat', 'CTA ohne Erstgespräch-Kontext'],
    },
  };

  const fallback = {
    tone: 'branchenspezifisch, lokal verankert, klar, hochwertig und ohne generische AI-Floskeln',
    preferredCollectionKeys: ['leistungen', 'news'],
    preferredSections: ['hero', 'servicesGrid', 'featureShowcase', 'processSteps', 'bentoGrid', 'statsCounter', 'testimonials', 'faq', 'ctaBand'],
    avoidPatterns: ['Platzhaltertexte', 'leere Bildfelder', 'wiederholte Section-Reihenfolgen über mehrere Demos'],
  };

  return {
    goal: 'Build a full premium demo website that feels custom-made for this exact tenant and industry. Use the API only; do not invent fields or section types.',
    workflow: [
      '1. Read tenant, existingPages, hasShopAddon, hasBookingAddon, availableSectionTypes, sectionDataSchemas, sectionStyleContracts.',
      '2. Design a tenant identity before writing content: company name, city/region, story, tone, brand palette, image world.',
      '3. Create global brand/contact/design/style/navigation/footer/SEO first.',
      '4. Create collections before pages when pages link to collection items.',
      '5. Create pages with complete sections and real content.',
      '6. Create collection items with embedded sections and stable UUIDs for every item section.',
      '7. Call /validate before /publish. Fix every error and every contrast warning. Repeat until readyToPublish=true.',
      '8. Publish only after validation passes, then manually check live pages and collection routes.',
    ],
    style: {
      supportedWebsiteStyle: 'classic',
      deprecatedStyles: ['modern', 'bold'],
      rule: 'Always send PUT /api/v1/content/style with { "style": "classic" }. Visual variety must come from brand/design colors, section choice, copy, imagery and layout, not from old style variants.',
    },
    minimumContentStandard: {
      homePage: {
        minSections: 12,
        requiredMix: ['hero', 'socialProofBar', 'storytelling/textImage or branch equivalent', 'branch-specific offer/overview section', 'featureShowcase', 'processSteps', 'bentoGrid', 'statsCounter', 'timeline', 'testimonials/proof', 'faq', 'ctaBand'],
      },
      overviewPages: {
        minSections: 6,
        requiredMix: ['hero/collectionHero', 'branch-specific overview', 'premium section', 'collectionList or cards', 'faq/testimonials', 'ctaBand'],
      },
      aboutPage: {
        minSections: 6,
        requiredMix: ['hero/collectionHero', 'textImage/story', 'team or values', 'timeline', 'stats/proof', 'ctaBand'],
      },
      contactPage: {
        minSections: 4,
        requiredMix: ['hero/collectionHero', 'contact or branch contact', 'map/places/additionalLocations', 'visitorInfo/openingHours/faq', 'ctaBand optional'],
      },
      collectionItems: {
        minSections: 4,
        requiredMix: ['collectionHero with bgImage/backgroundImage', 'textImage or detail section', 'benefits/process/info section', 'faq or proof', 'ctaBand'],
      },
      arrays: {
        cardArraysMinItems: 4,
        faqMinItems: 4,
        collectionMinItems: 3,
        footerLinksPerColumnMin: 2,
      },
    },
    routingRules: [
      'Page slug values never start with "/". Use "leistungen", not "/leistungen".',
      'Navigation/footer href values do start with "/". Use "/leistungen".',
      'Only link to pages and collection items that actually exist.',
      'Collection detail links use "/c/<collectionKey>/<itemSlug>".',
      'If the API validation lists a required page, create that exact slug even if the visible nav label differs.',
    ],
    contentRules: [
      'Use real German copy with umlauts and no mojibake.',
      'Write from the business perspective, not as a neutral directory.',
      'Avoid generic phrases such as "maßgeschneiderte Lösungen", "Ihre Zufriedenheit ist unser Ziel" unless backed by concrete content.',
      'Every image field must be filled with a contextually fitting image URL or uploaded media URL.',
      'Every image should have meaningful alt text when the schema exposes an alt field.',
      'No placeholder labels like "Mehr erfahren" repeated everywhere; CTAs should be specific to the action.',
      'Use branch-specific sections before generic shared sections when available.',
    ],
    // The single biggest quality gap of AI-built sites is mechanical repetition:
    // every page opens with the same hero and closes with the same CTA band.
    // /validate now emits "variety.*" warnings when this happens — treat them as
    // must-fix. Build variety in from the start with these rules.
    varietyRules: [
      'Rotate the OPENING section type across pages. No hero/opener type should cover more than ~half of the content pages. Cycle through the hero variants available for this industry (e.g. editorialHero, cinematicHero, collectionHero, glowHero, hero).',
      'Rotate the CLOSING section type. Do not end every page with the same ctaBand — alternate ctaBand, immersiveCtaBanner, faq, contact, ctaSplit.',
      'Never reuse a headline verbatim across sections. Each headline is unique and specific.',
      'CTA labels are action-specific and rarely repeated (max ~4 uses of any single label site-wide).',
      'Vary the middle of each page too: the sequence of section types should differ noticeably page to page, not a fixed template stamped N times.',
      'Give each page its own hero image; do not reuse one image as the hero of every page.',
    ],
    seoRules: [
      'Set per-page SEO via PUT /api/v1/content/seo/:pageId with { metaTitle, metaDescription }.',
      'metaTitle max 70 characters, metaDescription max 170 characters — the API rejects longer values with a 400.',
      'Set a global template via PUT /api/v1/content/seo: { titleTemplate: "%s | <Brand> <City>", defaultTitle, defaultDescription, defaultOgImage, locale }.',
      'If titleTemplate already appends the brand/city, do NOT repeat the brand name inside each page metaTitle.',
      'Every metaDescription is unique and reflects that page; include the city/region for local SEO where relevant.',
    ],
    colorRules: [
      'Global design colors should establish readable defaults for all light sections: sectionBg, cardBg, heading, body, muted, btnBg, btnText, badgeBg, badgeText.',
      'For every image hero or dark/overlay section, set overlayColor/overlayOpacity and section.styleOverrides for --token-heading, --token-body and --token-muted. Do not send onDark* fields; internal dark aliases are written automatically.',
      'If overriding --token-btn-bg, always set --token-btn-text in the same styleOverrides.',
      'If overriding --token-badge-bg, always set --token-badge-text.',
      'If cards sit on a dark section, set --token-card-bg, --token-card-border and readable text tokens. Do NOT use rgba(255,255,255,0.05-0.2) with white heading/body tokens; use a solid dark card bg (for example #0A2A33) with white text, or a solid light card bg with dark text.',
      'Do not use white text on pale backgrounds or dark text on dark imagery. Validate contrast before publishing.',
      'Use sectionStyleContracts[type].colorSlots to know which visual parts a section supports.',
    ],
    addons: {
      shop: addons.hasShop
        ? 'Shop addon is active. It is valid to create shop pages, categories, products and shop sections.'
        : 'Shop addon is not active. Do not create shop pages/products or use shop sections.',
      booking: addons.hasBooking
        ? 'Booking addon is active. Use bookingSlotPicker for time-slot bookings, bookingDateRange for multi-day stays/rooms/locations, availabilityCalendar for availability overview, and resourceBookingShowcase for resources.'
        : 'Booking addon is not active. Do not use premium booking sections; simple contact/reservation sections are still allowed when listed in availableSectionTypes.',
    },
    industry: industryHints[industry] || fallback,
    finalValidation: [
      'GET /api/v1/content/validate returns readyToPublish=true.',
      'No colorIssues warnings remain.',
      'Every main route returns 200.',
      'Every collection item linked from nav/cards/footer returns 200.',
      'Visible content is not repeated mechanically across pages.',
      'The page would convince a real prospect in this industry.',
    ],
  };
}

const INDUSTRY_CONTRACT_ALIASES: Record<string, string> = { handwerk: 'tradesman' };

/** Every section type the style validator accepts for this industry — the
 * curated catalog PLUS borrowed/alias types that exist only in stored content
 * (e.g. `story`, `contactLocation`). Derived from the generated colour
 * contracts so the list can never drift from what the API validates. */
function getAllValidatedSectionTypes(industry?: string): string[] {
  const normalized = (industry || '').trim().toLowerCase();
  const resolved = INDUSTRY_CONTRACT_ALIASES[normalized] ?? normalized;
  const pascal = resolved ? resolved.charAt(0).toUpperCase() + resolved.slice(1) : '';
  const types = new Set<string>();
  for (const key of Object.keys(SECTION_COLOR_CONTRACTS_GENERIC)) types.add(key);
  for (const key of Object.keys(SECTION_COLOR_CONTRACTS_ANY)) types.add(key);
  if (pascal) {
    for (const key of Object.keys(SECTION_COLOR_CONTRACTS_GENERATED)) {
      if (key.endsWith(pascal)) types.add(key.slice(0, -pascal.length));
    }
  }
  return [...types];
}

function getSectionStyleContracts(sectionTypes: Array<{ type?: string; id?: string; label?: string }>, industry?: string) {
  const available = new Set(sectionTypes.map(section => section.type || section.id).filter(Boolean));
  // Borrowed/alias types: validated by the write endpoints but not part of the
  // curated picker list. Without them the contract list was incomplete and AI
  // clients had no way to know the allowed styleOverride keys for e.g. `story`.
  const borrowed = getAllValidatedSectionTypes(industry)
    .filter(type => !available.has(type))
    .sort()
    .map(type => ({ type, id: undefined as string | undefined, label: type, borrowed: true }));
  return [...sectionTypes.map(s => ({ ...s, borrowed: false })), ...borrowed]
    .map(section => {
      const type = section.type || section.id;
      if (!type) return null;
      const colorFields = getFieldsForSection(type, industry);
      return {
        type,
        label: section.label || type,
        ...(section.borrowed ? { source: 'borrowed', note: 'Nicht im Section-Picker dieser Branche, aber in gespeichertem Content gültig — styleOverrides werden gegen genau diese colorFields validiert.' } : {}),
        colorFields: colorFields.map(field => ({
          field,
          cssVar: FIELD_DEFS[field].cssVar,
          label: FIELD_DEFS[field].label,
          description: FIELD_DEFS[field].description,
          group: FIELD_DEFS[field].group,
        })),
        colorSlots: colorFields.map(field => ({
          slot: field,
          cssVar: FIELD_DEFS[field].cssVar,
          label: FIELD_DEFS[field].label,
          description: FIELD_DEFS[field].description,
          group: FIELD_DEFS[field].group,
          contrastWith: [],
        })),
        recommendedMinimum: getRecommendedMinimumStyle(colorFields),
      };
    })
    .filter(Boolean);
}

function getRecommendedMinimumStyle(colorFields: ColorFieldKey[]) {
  const style: Record<string, string> = {};
  for (const field of colorFields) {
    style[FIELD_DEFS[field].cssVar] = FIELD_DEFS[field].description;
  }
  return style;
}
