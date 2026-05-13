import { z } from 'zod';

/** Reusable page-hero / block heading (eyebrow + title + subtitle). */
const pageHeaderBlock = z.object({
  eyebrow: z.string().optional().default(''),
  title: z.string().optional().default(''),
  subtitle: z.string().optional().default(''),
});

/** Rich detail subpage under the branch services URL (e.g. /zimmer/suite). */
const catalogItemDetailSchema = z.object({
  detailSlug: z.string().optional().default(''),
  detailPublished: z.boolean().optional().default(true),
  detailSubtitle: z.string().optional().default(''),
  detailBody: z.string().optional().default(''),
  detailBodyHtml: z.string().optional().default(''),
  detailGallery: z.array(z.string()).optional().default([]),
});

/** Title + body pairs (`t`/`d`) used for highlights, process lists, values, etc. */
const tdPair = z.object({
  t: z.string().optional().default(''),
  d: z.string().optional().default(''),
});

const templateKeyZ = z.enum(['restaurant', 'hotel', 'tourism', 'salon', 'tradesman', 'consulting', 'medical', 'fitness', 'wedding']);
const templateStyleZ = z.enum(['classic', 'modern', 'bold']);

/**
 * Spec-first modular page block (v1). `type` matches CMS spec block ids
 * (e.g. `noticeBanner`, `hero`, `featuredDishesGrid`). `data` holds fields per spec.
 */
export const ModularSectionV1Schema = z.object({
  id: z.string(),
  type: z.string(),
  isVisible: z.boolean().optional().default(true),
  data: z.record(z.string(), z.unknown()).optional().default({}),
});
export type ModularSectionV1 = z.infer<typeof ModularSectionV1Schema>;

const ModularPageV1Schema = z.object({
  sections: z.array(ModularSectionV1Schema).optional().default([]),
});

/**
 * Optional modular page tree. When present for the active tenant template+style,
 * editors and (progressively) renderers merge these blocks into legacy `SiteContent`
 * fields so existing templates keep working during migration.
 */
export const ModularPagesV1Schema = z.object({
  combo: z.object({
    template: templateKeyZ,
    style: templateStyleZ,
  }),
  home: ModularPageV1Schema.optional(),
  services: ModularPageV1Schema.optional(),
  gallery: ModularPageV1Schema.optional(),
  about: ModularPageV1Schema.optional(),
  contact: ModularPageV1Schema.optional(),
});
export type ModularPagesV1 = z.infer<typeof ModularPagesV1Schema>;

/**
 * Direct-render CMS page tree (v2). Unlike `modularPagesV1`, v2 is not merged
 * into legacy `SiteContent` fields. Frontend renderers consume these section
 * instances directly, while global tenant settings stay on the existing top-level
 * content keys during the migration.
 */
export const ModularSectionV2Schema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  visible: z.boolean().optional().default(true),
  data: z.record(z.string(), z.unknown()).optional().default({}),
});
export type ModularSectionV2 = z.infer<typeof ModularSectionV2Schema>;

const ModularPageV2Schema = z.object({
  sections: z.array(ModularSectionV2Schema).optional().default([]),
});

const CustomModularPageV2Schema = ModularPageV2Schema.extend({
  id: z.string().min(1),
  slug: z.string().min(1),
  label: z.string().optional().default('Neue Seite'),
  visible: z.boolean().optional().default(true),
});

export const ModularPagesV2Schema = z.object({
  version: z.literal(2).default(2),
  combo: z.object({
    template: templateKeyZ,
    style: templateStyleZ,
  }),
  home: ModularPageV2Schema.optional(),
  services: ModularPageV2Schema.optional(),
  gallery: ModularPageV2Schema.optional(),
  about: ModularPageV2Schema.optional(),
  contact: ModularPageV2Schema.optional(),
  customPages: z.array(CustomModularPageV2Schema).optional().default([]),
});
export type ModularPagesV2 = z.infer<typeof ModularPagesV2Schema>;

/**
 * CMS block instance (Phase 1). `type` must be an `AdminSectionKey` listed in
 * `SECTION_CONTRACTS`; `data` holds section-local payload (per-type Zod in later phases).
 */
export const PageBlockInstanceV1Schema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  isVisible: z.boolean().optional().default(true),
  data: z.record(z.string(), z.unknown()).optional().default({}),
});
export type PageBlockInstanceV1 = z.infer<typeof PageBlockInstanceV1Schema>;

/** Optional arrays per page id — all keys optional (partial page graph). */
export const PageBlocksV1Schema = z.object({
  home: z.array(PageBlockInstanceV1Schema).optional(),
  services: z.array(PageBlockInstanceV1Schema).optional(),
  gallery: z.array(PageBlockInstanceV1Schema).optional(),
  about: z.array(PageBlockInstanceV1Schema).optional(),
  contact: z.array(PageBlockInstanceV1Schema).optional(),
});
export type PageBlocksV1 = z.infer<typeof PageBlocksV1Schema>;

/** Tenant-owned named palette; referenced by `brand.themePresetId` as `custom:<id>`. */
export const TenantCustomThemeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  primary: z.string(),
  primaryFg: z.string(),
  accent: z.string(),
  accentFg: z.string().optional(),
  surface: z.string(),
  bg: z.string(),
  text: z.string(),
});
export type TenantCustomTheme = z.infer<typeof TenantCustomThemeSchema>;

/**
 * Shared content shape. Every template renders from a SiteContent object.
 * Keep new fields optional so old tenants don't break when we extend the schema.
 */
export const SiteContentSchema = z.object({
  brand: z.object({
    name: z.string(),
    tagline: z.string().optional().default(''),
    logoUrl: z.string().url().optional().or(z.literal('')).default(''),
    primaryColor: z.string().default('#0f172a'),
    /** When true and a logo is uploaded, hides the brand name text next to the logo (logo only). */
    hideName: z.boolean().optional().default(false),
    /**
     * Built-in preset id (`PRESETS[template][n].id`) or `custom:<uuid>` for an entry in `customThemes`.
     * When set, overrides `primaryColor` at runtime via `applyTheme()`.
     */
    themePresetId: z.string().optional().default(''),
    /** Named custom color themes created in the admin (button „Eigenes Farbschema“). */
    customThemes: z.array(TenantCustomThemeSchema).optional().default([]),
  }),
  hero: z.object({
    title: z.string(),
    subtitle: z.string().optional().default(''),
    body: z.string().optional().default(''),
    imageUrl: z.string().url().optional().or(z.literal('')).default(''),
    ctaLabel: z.string().optional().default(''),
    ctaHref: z.string().optional().default('#kontakt'),
  }),
  about: z.object({
    title: z.string().optional().default('Über uns'),
    body: z.string().optional().default(''),
    imageUrl: z.string().url().optional().or(z.literal('')).default(''),
  }).optional(),
  services: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional().default(''),
      price: z.string().optional().default(''),
      imageUrl: z.string().url().optional().or(z.literal('')).default(''),
      /** Optional per-card override; falls back to `branchText.learnMoreLabel` / `learnMoreHref`. */
      learnMoreLabel: z.string().optional().default(''),
      learnMoreHref: z.string().optional().default(''),
    }).merge(catalogItemDetailSchema),
  ).default([]),
  gallery: z.array(z.string().url()).default([]),
  testimonials: z.array(
    z.object({
      author: z.string(),
      text: z.string(),
    })
  ).default([]),
  contact: z.object({
    phone: z.string().optional().default(''),
    email: z.string().optional().default(''),
    address: z.string().optional().default(''),
    city: z.string().optional().default(''),
    hours: z.array(
      z.object({ day: z.string(), time: z.string() })
    ).default([]),
    mapsUrl: z.string().optional().default(''),
  }),
  /** Additional business locations beyond the main contact. */
  locations: z.array(z.object({
    name: z.string().default(''),
    phone: z.string().optional().default(''),
    email: z.string().optional().default(''),
    address: z.string().optional().default(''),
    city: z.string().optional().default(''),
    hours: z.array(z.object({ day: z.string(), time: z.string() })).default([]),
    mapsUrl: z.string().optional().default(''),
  })).optional().default([]),
  social: z.object({
    instagram: z.string().optional().default(''),
    facebook: z.string().optional().default(''),
    whatsapp: z.string().optional().default(''),
    linkedin: z.string().optional().default(''),
    youtube: z.string().optional().default(''),
    tiktok: z.string().optional().default(''),
    x: z.string().optional().default(''),
  }).optional(),

  // SEO — global defaults plus per-page overrides. AI/search-engine friendly metadata
  // is rendered by the Seo component and the structured-data injector.
  seo: z.object({
    title: z.string().optional().default(''),
    description: z.string().optional().default(''),
    keywords: z.string().optional().default(''),
    ogImage: z.string().optional().default(''),
    canonical: z.string().optional().default(''),
    twitter: z.string().optional().default(''),
    locale: z.string().optional().default('de_AT'),
    /** Schema.org priceRange ($, $$, $$$, $$$$ or e.g. "€10–25"). */
    priceRange: z.string().optional().default(''),
    /** Restaurants only: cuisine label used in JSON-LD `servesCuisine`. */
    cuisine: z.string().optional().default(''),
    /** OpenAPI-style structured-data overrides (geo, founding date, currency …) */
    extra: z.record(z.string()).optional().default({}),
  }).optional(),

  /** Per-page SEO overrides keyed by page id (home/services/gallery/about/contactPage). */
  pageSeo: z.record(z.object({
    title: z.string().optional().default(''),
    description: z.string().optional().default(''),
    keywords: z.string().optional().default(''),
    ogImage: z.string().optional().default(''),
    noindex: z.boolean().optional().default(false),
  })).optional(),

  /**
   * Custom scripts (analytics, pixels, chat widgets) — gated by cookie consent.
   * Each script is only injected after the visitor consents to its category.
   * `code` may be either an inline snippet ("console.log('hi')") or an external URL.
   */
  customScripts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.enum(['necessary', 'analytics', 'marketing', 'functional']).default('analytics'),
    /** Inline JS code OR full external URL (https://…/script.js). */
    code: z.string().default(''),
    enabled: z.boolean().default(true),
    placement: z.enum(['head', 'body']).default('head'),
  })).optional().default([]),

  /** Story/Timeline entries shown on the About page. */
  timeline: z.array(z.object({
    year: z.string().default(''),
    title: z.string().default(''),
    description: z.string().default(''),
  })).optional().default([]),

  /**
   * News / Blog posts. Latest entries are shown on the home page; full
   * archive lives at /news with detail pages at /news/:slug.
   * `body` is plain text — paragraphs are rendered by splitting on blank lines.
   */
  posts: z.array(z.object({
    id: z.string(),
    title: z.string().default(''),
    slug: z.string().default(''),
    date: z.string().default(''),
    excerpt: z.string().default(''),
    body: z.string().default(''),
    /** Rich-text HTML version of the body. When present, takes precedence over `body`. Sanitised at render time. */
    bodyHtml: z.string().optional().default(''),
    imageUrl: z.string().optional().default(''),
    published: z.boolean().default(true),
  })).optional().default([]),

  /**
   * Branch-text overrides – override hardcoded copy that previously lived inside the
   * template. Each field is optional; if missing or empty the template falls back
   * to the shipped default for that variant/style combination.
   */
  branchText: z.object({
    /** Words shown in the home-page marquee strip. */
    marqueeWords: z.array(z.string()).optional().default([]),
    /** Title of the gallery teaser section on the home page. Plain string – the template wraps the last word in italic-pop. */
    galleryTeaserTitle: z.string().optional().default(''),
    /** Eyebrow of the gallery teaser section on the home page. */
    galleryTeaserEyebrow: z.string().optional().default(''),
    /** Eyebrow of the about teaser section on the home page (modern style). */
    aboutTeaserEyebrow: z.string().optional().default(''),
    /** FAQ section eyebrow + title (used on home + services page). */
    faqEyebrow: z.string().optional().default(''),
    faqTitle: z.string().optional().default(''),
    /** Label of the "learn more" button on the about teaser. */
    learnMoreLabel: z.string().optional().default(''),
    /** Link target of the "learn more" button on the about teaser. */
    learnMoreHref: z.string().optional().default(''),
    /** Label of the "view all" button on the gallery teaser. */
    galleryAllLabel: z.string().optional().default(''),
    /** Link target for the gallery teaser button (internal path or full URL). */
    galleryAllHref: z.string().optional().default(''),
    /** Subtitle / description text used as fallback below hero + above services. */
    teaserSubtitle: z.string().optional().default(''),
    /** Eyebrow + headline of the testimonials block. */
    testimonialsEyebrow: z.string().optional().default(''),
    testimonialsTitle: z.string().optional().default(''),
    /** Eyebrow + headline for the testimonials block on the /ueber-uns page (optional; falls back to home testimonials titles). */
    aboutTestimonialsEyebrow: z.string().optional().default(''),
    aboutTestimonialsTitle: z.string().optional().default(''),
    /** "Manifest" block (Bold style only). */
    manifestEyebrow: z.string().optional().default(''),
    manifestTitle: z.string().optional().default(''),
    /** Eyebrow + lead used by the soft CTA at the bottom of the modern home. */
    softCtaEyebrow: z.string().optional().default(''),
    softCtaTitle: z.string().optional().default(''),
    softCtaText: z.string().optional().default(''),
    softCtaButton: z.string().optional().default(''),
    /** Services-page process section eyebrow + title. */
    processEyebrow: z.string().optional().default(''),
    processTitle: z.string().optional().default(''),
    /** Gallery-page categories section eyebrow + title. */
    galleryCategoriesEyebrow: z.string().optional().default(''),
    galleryCategoriesTitle: z.string().optional().default(''),
    /** About-page values section eyebrow + title. */
    valuesEyebrow: z.string().optional().default(''),
    valuesTitle: z.string().optional().default(''),
    /** About-page team section eyebrow + title. */
    teamEyebrow: z.string().optional().default(''),
    teamTitle: z.string().optional().default(''),
    /** About-page certifications section eyebrow + title (tradesman). */
    certsEyebrow: z.string().optional().default(''),
    certsTitle: z.string().optional().default(''),
    /** About-page press section eyebrow + title (restaurant). */
    pressEyebrow: z.string().optional().default(''),
    pressTitle: z.string().optional().default(''),
    /** Eyebrow + title for the news/blog teaser block on the home page. */
    newsEyebrow: z.string().optional().default(''),
    newsTitle: z.string().optional().default(''),
    /** Label + link for the news teaser “all posts” button. */
    newsAllLabel: z.string().optional().default(''),
    newsAllHref: z.string().optional().default(''),
    /** Eyebrow shown on the about-page sidebar (modern style "Auf einen Blick"). */
    aboutSidebarEyebrow: z.string().optional().default(''),
    /** Eyebrow above the services teaser on the home page (modern/bold). */
    servicesTeaserEyebrow: z.string().optional().default(''),
    /** Title of the services teaser on the home page. */
    servicesTeaserTitle: z.string().optional().default(''),
    /** Label + target of the services teaser action button (used in bold home teaser). */
    servicesAllLabel: z.string().optional().default(''),
    servicesAllHref: z.string().optional().default(''),
    /** Eyebrow shown above the hero headline (bold style). */
    heroEyebrow: z.string().optional().default(''),
    /** Hero image shown on modern and bold home pages. Defaults to first gallery image. */
    heroImageUrl: z.string().url().optional().or(z.literal('')).default(''),
    /** Services page header image (modern style). Defaults to gallery[2] or gallery[0]. */
    servicesPageImageUrl: z.string().url().optional().or(z.literal('')).default(''),
  }).optional().default({}),

  /**
   * Navigation – per-tenant menu. When omitted/empty the template falls back
   * to NAV_BY_VARIANT defaults. Each item: label + path + visible flag.
   * The `path` should match an existing template route (/, /speisekarte,
   * /leistungen, /galerie, /ueber-uns, /kontakt, /news).
   */
  navItems: z.array(z.object({
    label: z.string().default(''),
    path: z.string().default('/'),
    visible: z.boolean().default(true),
  })).optional().default([]),

  /**
   * Footer column links and tagline overrides.
   */
  footer: z.object({
    tagline: z.string().optional().default(''),
    columns: z.array(z.object({
      title: z.string().default(''),
      links: z.array(z.object({
        label: z.string().default(''),
        href: z.string().default(''),
      })).default([]),
    })).optional().default([]),
  }).optional().default({}),

  /**
   * Hero CTA overrides – primary + secondary button labels and links shown
   * in the home-page hero. When fields are empty the template uses defaults.
   */
  heroCta: z.object({
    primaryLabel: z.string().optional().default(''),
    primaryHref: z.string().optional().default(''),
    secondaryLabel: z.string().optional().default(''),
    secondaryHref: z.string().optional().default(''),
  }).optional().default({}),

  /**
   * Navigation CTA button (top-right, e.g. "Termin" / "Reservieren").
   * When empty the template uses a per-variant default.
   */
  navCta: z.object({
    label: z.string().optional().default(''),
    href: z.string().optional().default(''),
  }).optional().default({}),

  /**
   * Bottom CTA-band overrides shown above footer (lead/sub/button).
   * `ctaBandOverride` is the global / home default.
   * `ctaBandOverrides` holds optional per-subpage overrides keyed by page id.
   */
  ctaBandOverride: z.object({
    lead: z.string().optional().default(''),
    sub: z.string().optional().default(''),
    cta: z.string().optional().default(''),
    ctaHref: z.string().optional().default(''),
    eyebrow: z.string().optional().default(''),
    leadAccent: z.string().optional().default(''),
  }).optional().default({}),
  ctaBandOverrides: z.record(z.string(), z.object({
    lead: z.string().optional().default(''),
    sub: z.string().optional().default(''),
    cta: z.string().optional().default(''),
    ctaHref: z.string().optional().default(''),
    eyebrow: z.string().optional().default(''),
    leadAccent: z.string().optional().default(''),
  })).optional().default({}),

  /**
   * Branch action strip (sits under hero) – per-tenant overrides.
   */
  homeStrip: z.object({
    tone: z.enum(['light', 'dark']).optional().default('light'),
    /**
     * When true (default), the eyebrow auto-renders from `contact.hours`
     * ("Heute geöffnet · 17:00 – 22:00" / "Heute geschlossen"). When false,
     * the manual `eyebrow` text wins.
     */
    eyebrowAuto: z.boolean().optional().default(true),
    eyebrow: z.string().optional().default(''),
    hint: z.string().optional().default(''),
    primaryLabel: z.string().optional().default(''),
    primaryHref: z.string().optional().default(''),
    secondaryLabel: z.string().optional().default(''),
    secondaryHref: z.string().optional().default(''),
  }).optional().default({}),

  /**
   * Signature/feature heading block under the hero (classic/modern home).
   */
  homeSignature: z.object({
    eyebrow: z.string().optional().default(''),
    titleA: z.string().optional().default(''),
    titleB: z.string().optional().default(''),
    intro: z.string().optional().default(''),
    /** Modern signature layout — label next to the title (e.g. “Saisonal”). */
    metaLabel: z.string().optional().default(''),
  }).optional().default({}),

  /**
   * Items for the home signature block (e.g. today's specials, featured looks, etc.).
   * Separate from the main services list — allows different selection for the hero teaser.
   */
  homeSignatureItems: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional().default(''),
      price: z.string().optional().default(''),
      imageUrl: z.string().url().optional().or(z.literal('')).default(''),
    })
  ).optional().default([]),

  /**
   * Logo / partner band under the hero. Plain string list.
   * When empty, the template falls back to a per-variant default.
   */
  logos: z.array(z.string()).optional().default([]),

  /* ─── BRANCH-SPECIFIC MODULES ─────────────────────────────────────
   * Each block below maps to a dedicated visual module rendered only
   * for the matching branch (or a small set of branches). All optional;
   * empty arrays/objects mean the module is hidden for that tenant.
   */

  /** Restaurant — categorised menu (Speisekarte mit Kategorien & Allergenen). */
  menu: z.array(z.object({
    category: z.string().default(''),
    description: z.string().optional().default(''),
    /** Optional column header for prices, e.g. "Achterl | Flasche" or "0,33 l | 1,0 l". */
    priceLabel: z.string().optional().default(''),
    items: z.array(z.object({
      name: z.string().default(''),
      description: z.string().optional().default(''),
      price: z.string().optional().default(''),
      allergens: z.string().optional().default(''),
      tags: z.array(z.string()).optional().default([]),
      imageUrl: z.string().optional().default(''),
    }).merge(catalogItemDetailSchema)).default([]),
  })).optional().default([]),

  /** Hotel — Zimmer-Showcase with features. */
  rooms: z.array(z.object({
    name: z.string().default(''),
    description: z.string().optional().default(''),
    size: z.string().optional().default(''),
    beds: z.string().optional().default(''),
    price: z.string().optional().default(''),
    imageUrl: z.string().optional().default(''),
    features: z.array(z.string()).optional().default([]),
  }).merge(catalogItemDetailSchema)).optional().default([]),

  /** Tourism — Tour-Cards with difficulty level. */
  tours: z.array(z.object({
    name: z.string().default(''),
    description: z.string().optional().default(''),
    duration: z.string().optional().default(''),
    level: z.string().optional().default(''), // "1/4 leicht" etc.
    groupSize: z.string().optional().default(''),
    price: z.string().optional().default(''),
    imageUrl: z.string().optional().default(''),
    languages: z.array(z.string()).optional().default([]),
  }).merge(catalogItemDetailSchema)).optional().default([]),

  /** Salon — Treatment list with duration + price. */
  treatments: z.array(z.object({
    name: z.string().default(''),
    description: z.string().optional().default(''),
    duration: z.string().optional().default(''),
    price: z.string().optional().default(''),
    category: z.string().optional().default(''),
    imageUrl: z.string().url().optional().or(z.literal('')).default(''),
  }).merge(catalogItemDetailSchema)).optional().default([]),

  /** Fitness — courses & schedule. */
  courses: z.array(z.object({
    name: z.string().default(''),
    description: z.string().optional().default(''),
    schedule: z.string().optional().default(''), // "Mo 18:00 · Mi 19:30"
    level: z.string().optional().default(''),
    duration: z.string().optional().default(''),
    trainer: z.string().optional().default(''),
    price: z.string().optional().default(''),
    imageUrl: z.string().url().optional().or(z.literal('')).default(''),
  }).merge(catalogItemDetailSchema)).optional().default([]),

  /** Fitness/Consulting — Pricing packages (3-tier compare). */
  packages: z.array(z.object({
    name: z.string().default(''),
    price: z.string().default(''),
    period: z.string().optional().default(''), // "/ Monat"
    description: z.string().optional().default(''),
    features: z.array(z.string()).optional().default([]),
    highlight: z.boolean().optional().default(false),
    ctaLabel: z.string().optional().default(''),
    ctaHref: z.string().optional().default(''),
    imageUrl: z.string().url().optional().or(z.literal('')).default(''),
  }).merge(catalogItemDetailSchema)).optional().default([]),

  /** Wedding — date of the wedding day (ISO: YYYY-MM-DD). */
  weddingDate: z.string().optional().default(''),

  /** Consulting — process / engagement steps. */
  processSteps: z.array(z.object({
    title: z.string().default(''),
    description: z.string().optional().default(''),
    duration: z.string().optional().default(''),
    imageUrl: z.string().url().optional().or(z.literal('')).default(''),
  }).merge(catalogItemDetailSchema)).optional().default([]),

  /** Medical — doctors / specialists. */
  doctors: z.array(z.object({
    name: z.string().default(''),
    role: z.string().optional().default(''),
    specialty: z.string().optional().default(''),
    imageUrl: z.string().optional().default(''),
    bio: z.string().optional().default(''),
  }).merge(catalogItemDetailSchema)).optional().default([]),

  /** Medical — online booking (Doctolib / jameda etc.) */
  booking: z.object({
    enabled: z.boolean().optional().default(false),
    provider: z.string().optional().default(''), // "Doctolib", "jameda", "TIMIFY"
    url: z.string().optional().default(''),
    embedUrl: z.string().optional().default(''),
    note: z.string().optional().default(''),
  }).optional().default({}),

  /** Tradesman — funding/grants list. */
  fundingItems: z.array(z.object({
    title: z.string().default(''),
    description: z.string().optional().default(''),
    percent: z.string().optional().default(''), // "35 %"
    program: z.string().optional().default(''), // "KfW 458"
    imageUrl: z.string().url().optional().or(z.literal('')).default(''),
  }).merge(catalogItemDetailSchema)).optional().default([]),

  /** Tradesman — funding calculator slider bounds (admin-editable). */
  fundingCalc: z.object({
    minInvest: z.number().optional().default(5000),
    maxInvest: z.number().optional().default(150000),
    stepInvest: z.number().optional().default(1000),
    defaultInvest: z.number().optional().default(25000),
  }).optional().default({}),

  /** Tradesman — sticky emergency banner. */
  emergencyBanner: z.object({
    enabled: z.boolean().optional().default(false),
    text: z.string().optional().default(''),
    phone: z.string().optional().default(''),
    sticky: z.boolean().optional().default(true),
  }).optional().default({}),

  /**
   * Per-tenant mail settings — when present the contact form submits to
   * the tenant's own SMTP account instead of the platform default.
   * Password is stored opaquely. Empty fields fall back to env vars.
   */
  mail: z.object({
    enabled: z.boolean().optional().default(false),
    host: z.string().optional().default(''),
    port: z.number().int().optional().default(587),
    user: z.string().optional().default(''),
    pass: z.string().optional().default(''),
    passEnc: z.string().optional().default(''),
    from: z.string().optional().default(''),
    to: z.string().optional().default(''),
    autoReply: z.boolean().optional().default(true),
  }).optional().default({}),

  /** Home ticker / announcement lines. */
  announcements: z.array(z.string()).optional().default([]),
  /** Hero statistic chips (label + value). */
  numbers: z.array(z.object({
    label: z.string().optional().default(''),
    value: z.string().optional().default(''),
  })).optional().default([]),
  /** Extras / modern hero — floating rating pill. */
  heroBadge: z.object({
    text: z.string().optional().default(''),
    label: z.string().optional().default(''),
  }).optional().default({}),
  /** Extra branches — keyword chips under the hero. */
  branchChips: z.array(z.string()).optional().default([]),
  /** Services page USP ribbon. */
  serviceHighlights: z.array(tdPair).optional().default([]),
  /** Consulting process steps / spotlight source (same shape as highlights). */
  serviceProcess: z.array(tdPair).optional().default([]),
  faq: z.array(z.object({
    q: z.string().optional().default(''),
    a: z.string().optional().default(''),
  })).optional().default([]),
  values: z.array(tdPair).optional().default([]),
  team: z.array(z.object({
    n: z.string().optional().default(''),
    r: z.string().optional().default(''),
    img: z.string().optional().default(''),
    bio: z.string().optional().default(''),
  })).optional().default([]),
  aboutNumbers: z.array(z.object({
    label: z.string().optional().default(''),
    value: z.string().optional().default(''),
  })).optional().default([]),
  servicesHeader: pageHeaderBlock.optional().default({}),
  galleryHeader: pageHeaderBlock.optional().default({}),
  aboutHeader: pageHeaderBlock.optional().default({}),
  contactPageHeader: pageHeaderBlock.optional().default({}),
  galleryStory: z.object({
    eyebrow: z.string().optional().default(''),
    title: z.string().optional().default(''),
    body: z.string().optional().default(''),
    captions: z.array(tdPair).optional().default([]),
  }).optional().default({}),
  galleryCategories: z.array(tdPair).optional().default([]),
  formFields: z.array(z.object({
    key: z.string().optional().default(''),
    label: z.string().optional().default(''),
    required: z.boolean().optional().default(false),
    type: z.enum(['text', 'email', 'tel', 'textarea', 'date']).optional().default('text'),
  })).optional().default([]),
  contactBlock: pageHeaderBlock.optional().default({}),
  arrival: z.array(tdPair).optional().default([]),
  arrivalSection: pageHeaderBlock.optional().default({}),
  certifications: z.array(tdPair).optional().default([]),
  press: z.array(z.object({
    src: z.string().optional().default(''),
    q: z.string().optional().default(''),
    y: z.string().optional().default(''),
    url: z.string().optional().default(''),
  })).optional().default([]),
  /** Per-module heading overrides (see `branch-modules.tsx`). */
  moduleHeadings: z.record(z.string(), z.object({
    eyebrow: z.string().optional().default(''),
    titleA: z.string().optional().default(''),
    titleB: z.string().optional().default(''),
    subtitle: z.string().optional().default(''),
  })).optional().default({}),
  programs: z.array(z.object({
    k: z.string().optional().default(''),
    t: z.string().optional().default(''),
    d: z.string().optional().default(''),
    meta: z.string().optional().default(''),
  })).optional().default([]),
  medicalNotice: z.object({
    online: z.string().optional().default(''),
    emergency: z.string().optional().default(''),
  }).optional().default({}),

  /**
   * Per-section visibility. Keys are namespaced by page:
   *   home.<key>      → home page sections (action, signature, services, …)
   *   services.<key>  → services / Speisekarte page
   *   gallery.<key>   → gallery page
   *   about.<key>     → about page
   *   contact.<key>   → contact page
   * Legacy unprefixed keys (action, services, …) are still respected on the home
   * page for backward-compatibility. Default: visible (true).
   */
  sectionVisibility: z.record(z.boolean()).optional().default({}),

  /**
   * Per-page section ordering. Keys are page ids ('home' | 'services' |
   * 'gallery' | 'about' | 'contact') and values are arrays of section keys
   * (without the page prefix) in the desired order. When a page id is
   * missing the template falls back to the hardcoded default flow for the
   * (variant, style) combination.
   */
  sectionOrder: z.record(z.array(z.string())).optional().default({}),

  /**
   * Spec-first modular pages (v1). Scoped to `combo` (template × style).
   * Shared/global admin (SEO, Skripte, …) stays on legacy top-level keys.
   */
  cmsV2: z.object({
    /**
     * Tenant rollout flag for the direct-render CMS.
     * This is the only switch used by provisioning, admin and frontend.
     */
    enabled: z.boolean().optional().default(false),
  }).optional().default({}),
  modularPagesV1: ModularPagesV1Schema.optional(),
  modularPagesV2: ModularPagesV2Schema.optional(),

  /**
   * CMS page composition (Phase 1+). Ordered block instances per page key.
   * Structural + singleton rules validated in `page-blocks-v1-validate.ts`.
   */
  pageBlocksV1: PageBlocksV1Schema.optional(),
})
  .passthrough();
// `.passthrough()` keeps rare forward-compatible keys intact; drift coverage
// requires every `SECTION_CONTRACTS` dataKey root to exist in this Zod object.

export type SiteContent = z.infer<typeof SiteContentSchema>;

export type TemplateKey = 'restaurant' | 'hotel' | 'tourism' | 'salon' | 'tradesman' | 'consulting' | 'medical' | 'fitness' | 'wedding';
export type PageId = 'home' | 'services' | 'gallery' | 'about' | 'contactPage';
