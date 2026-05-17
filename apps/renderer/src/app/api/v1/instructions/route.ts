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
   - companyName, tagline, primaryColor, accentColor

2. CONTACT (PUT /api/v1/content/contact):
   - phone, email, address (vollständig mit Straße, PLZ, Ort)
   - whatsapp (Nummer), whatsappEnabled: true

3. NAVIGATION (PUT /api/v1/content/navigation):
   - items: Array mit ALLEN Seiten die du erstellst (jede Seite braucht einen Nav-Eintrag)
   - Format: { items: [{ label: "Startseite", href: "/" }, { label: "Leistungen", href: "/leistungen" }, ...], cta: { label: "Jetzt anfragen", href: "/kontakt" } }
   - WICHTIG: href MUSS mit "/" beginnen + den Slug der Seite enthalten

4. FOOTER (PUT /api/v1/content/footer):
   - columns: MINDESTENS 2-3 Spalten, JEDE mit title UND items-Array
   - Beispiel: { columns: [{ title: "Leistungen", items: [{ text: "Badezimmer", href: "/c/leistungen/badezimmer" }, ...] }, { title: "Unternehmen", items: [{ text: "Über uns", href: "/ueber-uns" }, { text: "Kontakt", href: "/kontakt" }] }], legalLinks: [{ label: "Impressum", href: "/impressum" }, { label: "Datenschutz", href: "/datenschutz" }] }
   - NIEMALS leere items-Arrays! Jede Spalte braucht mindestens 2 Links.

5. SEITEN (POST /api/v1/content/pages) — Erstelle ALLE diese Seiten:
   a) Startseite (slug: "startseite") — MINDESTENS 6 Sections:
      - hero (mit headline, subline, bgImage, primaryCta, secondaryCta, trustItems)
      - uspStrip (mindestens 4 Items)
      - servicesGrid (mindestens 4 Services mit icon, title, text, href zu Collection-Detail)  
      - processSteps ODER textImage
      - testimonials ODER stats
      - faq (mindestens 4 Fragen)
      - ctaBand (mit headline, text, primaryCta)
   
   b) Leistungen-Übersicht (slug: "leistungen"):
      - collectionHero (headline, subline)
      - servicesGrid (ALLE Leistungen aus der Collection mit href="/c/leistungen/[slug]")
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
      - collectionHero
      - richText (vollständiges deutsches Impressum mit Firmenname, Adresse, Telefon, E-Mail, Geschäftsführer, Handelsregister, USt-IdNr)
   
   f) Datenschutz (slug: "datenschutz"):
      - collectionHero
      - richText (Datenschutzerklärung nach DSGVO)

6. COLLECTIONS — Erstelle MINDESTENS eine Collection für die Kernleistungen:
   - POST /api/v1/content/collections → { key: "leistungen", label: "Leistungen" }
   - Dann für JEDE Leistung ein Item erstellen (MINDESTENS 4 Items):
     POST /api/v1/content/collections/leistungen/items → { title: "...", slug: "...", data: { sections: [...] } }
   - Jedes Collection-Item braucht sections mit echtem Content (collectionHero + textImage + ctaBand minimum)

7. SEO (PUT /api/v1/content/seo):
   - titleTemplate: "%s | ${auth.tenant.name}"
   - defaultDescription: Aussagekräftige Beschreibung
   - Dann für JEDE Seite: PUT /api/v1/content/seo/:pageId mit metaTitle und metaDescription

8. PUBLISH (POST /api/v1/content/publish):
   - IMMER als letzter Schritt aufrufen!

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

═══════════════════════════════════════════
HÄUFIGE FEHLER (VERMEIDE DIESE):
═══════════════════════════════════════════

❌ Footer ohne items in columns → CRASH
❌ Navigation ohne CTA → fehlender Anruf-Button
❌ Leistungen nur als Seiten statt Collection Items
❌ servicesGrid ohne href → keine Verlinkung zu Details
❌ Kontaktseite ohne contact-Section → kein Formular
❌ Hero ohne primaryCta → kein Call-to-Action
❌ Sections mit leeren/fehlenden Pflichtfeldern
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
    hero: { fields: { headline: 'string', subline: 'string', badgeText: 'string?', badgeIcon: 'lucide-icon-name?', badgeStarsIcon: 'lucide-icon-name? (leer = keine Sterne)', bgImage: 'url?', bgColor: 'hex? (alternative bg color if no image)', bgMode: '"image"|"color"|"gradient" (default gradient)', primaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', secondaryCta: '{ label: string, href: string, icon?: lucide-icon-name }?', trustItems: 'string[]?', overlayColor: 'hex?', overlayOpacity: '0-1?', bgPosition: 'string? (CSS object-position, e.g. "center 30%")' } },
    richText: { fields: { content: 'html-string' } },
    freeText: { fields: { content: 'rich-text (Tiptap JSON or HTML)' } },
    videoEmbed: { fields: { headline: 'string?', subline: 'string?', videoUrl: 'youtube/vimeo URL', aspectRatio: '"16:9"|"4:3"|"1:1"?' } },
    textImage: { fields: { headline: 'string', text: 'string (html)', image: 'url', imagePosition: '"left"|"right"?', cta: '{ label: string, href: string }?' } },
    collectionHero: { fields: { headline: 'string', subline: 'string?', bgImage: 'url?', breadcrumb: '{ label: string, href: string }[]?', meta: 'string[]?' } },
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
      uspStrip: { fields: { items: '{ icon: lucide-icon-name, text: string }[]' } },
      servicesGrid: { fields: { headline: 'string', subline: 'string?', services: '{ icon: lucide-icon-name, title: string, text: string, href?: string }[]' } },
      processSteps: { fields: { headline: 'string', subline: 'string?', steps: '{ icon: lucide-icon-name, title: string, text: string }[]' } },
      testimonials: { fields: { headline: 'string', items: '{ quote: string, name: string, role?: string, rating?: 1-5 }[]' } },
      faq: { fields: { headline: 'string', items: '{ question: string, answer: string }[]' } },
      ctaBand: { fields: { headline: 'string', text: 'string?', primaryCta: '{ label: string, href: string }', secondaryCta: '{ label: string, href: string }?' } },
      contact: { fields: { headline: 'string', subline: 'string?', mapEmbedUrl: 'url?', formEnabled: 'boolean?' } },
      team: { fields: { headline: 'string', members: '{ name: string, role: string, image?: url, bio?: string }[]' } },
      galleryGrid: { fields: { headline: 'string', images: '{ src: url, alt: string, caption?: string }[]' } },
      stats: { fields: { headline: 'string?', items: '{ icon: lucide-icon-name, value: string, label: string }[]' } },
    });
  } else if (industry === 'restaurant') {
    Object.assign(schemas, {
      menu: { fields: { headline: 'string', categories: '{ title: string, items: { name: string, description?: string, price?: string, allergens?: string }[] }[]' } },
      reservation: { fields: { headline: 'string', text: 'string?', cta: '{ label: string, href: string }?' } },
      openingHours: { fields: { headline: 'string', days: '{ label: string, hours: string }[]' } },
      signatureDishes: { fields: { headline: 'string', dishes: '{ name: string, description: string, image?: url, price?: string }[]' } },
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
