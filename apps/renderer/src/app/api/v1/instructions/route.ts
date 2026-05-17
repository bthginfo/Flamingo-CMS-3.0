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
      createCollectionItem: { method: 'POST', path: '/api/v1/content/collections/:key/items', description: 'Create a collection item (title, slug, data with sections)' },
      updateCollectionItem: { method: 'PUT', path: '/api/v1/content/collections/:key/items/:id', description: 'Update a collection item' },
      deleteCollectionItem: { method: 'DELETE', path: '/api/v1/content/collections/:key/items/:id', description: 'Delete a collection item' },
      publish: { method: 'POST', path: '/api/v1/content/publish', description: 'Publish all current content as snapshot' },
    },
    restrictions: [
      'Do NOT use section type "freeHtml" or "htmlBlock" — raw HTML is not allowed.',
      'Only use section types listed in availableSectionTypes.',
      'Only fill fields defined in sectionDataSchemas — do not invent custom fields.',
    ],
    instructions: `You are an AI assistant filling content for a "${auth.tenant.industry}" website called "${auth.tenant.name}". 
Use the endpoints above to create pages with sections. Each section requires a "type" from availableSectionTypes and a "data" object matching the schema for that type.
Always include relevant real-looking content. Use German language for all content.
Create at least a homepage with hero + 3-5 supporting sections, plus any relevant subpages.
Set SEO fields for each page, configure brand colors, navigation, footer, and contact info.
After creating all content, call the publish endpoint to make it live.`,
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
