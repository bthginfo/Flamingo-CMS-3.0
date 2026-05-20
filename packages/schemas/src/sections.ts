import { z } from 'zod';

// ─── Shared primitives ──────────────────────────────────────────────
export const ctaSchema = z.object({
  label: z.string().min(1),
  link: z.string().min(1),
});

export const mediaRefSchema = z.object({
  assetId: z.string().uuid().optional(),
  url: z.string().url().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export const containerEnum = z.enum(['default', 'wide', 'fullBleed']);
export const spacingEnum = z.enum(['none', 's', 'm', 'l']);

// ─── Section meta ───────────────────────────────────────────────────
export const sectionMetaSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  pageId: z.string().uuid(),
  type: z.string(),
  variant: z.string().optional(),
  titleInternal: z.string().optional(),
  visible: z.boolean().default(true),
  container: containerEnum.default('default'),
  spacingTop: spacingEnum.default('m'),
  spacingBottom: spacingEnum.default('m'),
  anchorId: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

// ─── 1. Hero ────────────────────────────────────────────────────────
export const heroDataSchema = z.object({
  eyebrow: z.string().optional(),
  headline: z.string().min(1),
  subline: z.string().min(1),
  body: z.string().max(300).optional(),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema.optional(),
  mediaType: z.enum(['image', 'video', 'none']).default('image'),
  backgroundImage: mediaRefSchema.optional(),
  backgroundVideo: mediaRefSchema.optional(),
  mediaAlt: z.string().optional(),
  trustBadges: z.array(z.object({ label: z.string(), icon: z.string().optional(), link: z.string().optional() })).optional(),
  quickFacts: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  emergencyMode: z.boolean().optional(),
});

export const heroVariants = ['split', 'centered', 'editorial', 'fullBleedMedia'] as const;

// ─── 2. USP Strip ───────────────────────────────────────────────────
export const uspStripDataSchema = z.object({
  items: z.array(z.object({
    icon: z.string().optional(),
    title: z.string().min(1),
    text: z.string().min(1),
  })).min(3).max(6),
  layout: z.enum(['inline', 'cards']).default('inline'),
});

// ─── 3. Services Grid ───────────────────────────────────────────────
export const servicesGridDataSchema = z.object({
  headline: z.string().optional(),
  subline: z.string().optional(),
  source: z.enum(['manual', 'collection']),
  manualCards: z.array(z.object({
    title: z.string().min(1),
    text: z.string().optional(),
    icon: z.string().optional(),
    image: mediaRefSchema.optional(),
    link: z.string().optional(),
  })).optional(),
  collectionFilterTags: z.array(z.string()).optional(),
  maxItems: z.number().int().optional(),
  sort: z.enum(['priority', 'date', 'title']).default('priority'),
  ctaBelow: ctaSchema.optional(),
});

// ─── 4. Process Steps ───────────────────────────────────────────────
export const processStepsDataSchema = z.object({
  headline: z.string().min(1),
  steps: z.array(z.object({
    title: z.string().min(1),
    text: z.string().min(1),
    icon: z.string().optional(),
    image: mediaRefSchema.optional(),
  })).min(3).max(7),
  style: z.enum(['timeline', 'cards']).default('timeline'),
});

// ─── 5. Project Gallery ─────────────────────────────────────────────
export const projectGalleryDataSchema = z.object({
  headline: z.string().min(1),
  subline: z.string().optional(),
  source: z.enum(['manual', 'collection']),
  maxItems: z.number().int().optional(),
  layout: z.enum(['masonry', 'carousel', 'grid']).default('grid'),
  showFilters: z.boolean().default(false),
  ctaBelow: ctaSchema.optional(),
});

// ─── 6. Trust / Certifications ──────────────────────────────────────
export const trustDataSchema = z.object({
  headline: z.string().optional(),
  items: z.array(z.object({
    logoMedia: mediaRefSchema.optional(),
    label: z.string().min(1),
    link: z.string().optional(),
  })).min(1),
  note: z.string().optional(),
});

// ─── 7. Testimonials ────────────────────────────────────────────────
export const testimonialsDataSchema = z.object({
  headline: z.string().min(1),
  items: z.array(z.object({
    quote: z.string().min(1),
    name: z.string().min(1),
    context: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    avatarMedia: mediaRefSchema.optional(),
  })).min(1),
  layout: z.enum(['cards', 'slider']).default('cards'),
});

// ─── 8. FAQ ─────────────────────────────────────────────────────────
export const faqDataSchema = z.object({
  headline: z.string().min(1),
  source: z.enum(['manual', 'collection']).default('manual'),
  items: z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
  })).min(3),
  layout: z.enum(['accordion', 'list']).default('accordion'),
  expandFirst: z.boolean().default(true),
});

// ─── 9. CTA Band ────────────────────────────────────────────────────
export const ctaBandDataSchema = z.object({
  headline: z.string().min(1),
  subline: z.string().optional(),
  ctaPrimary: ctaSchema,
  ctaSecondary: ctaSchema.optional(),
  background: z.enum(['surface', 'gradient', 'image']).default('surface'),
  bgImage: mediaRefSchema.optional(),
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
  accentColor: z.string().optional(),
});

// ─── 10. Contact / Anfrage ──────────────────────────────────────────
export const contactDataSchema = z.object({
  headline: z.string().min(1),
  introText: z.string().optional(),
  contactCards: z.array(z.object({
    label: z.string(),
    value: z.string(),
    icon: z.string().optional(),
    link: z.string().optional(),
  })).optional(),
  showOpeningHours: z.boolean().default(true),
  formEnabled: z.boolean().default(true),
  formFields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(['text', 'email', 'tel', 'textarea', 'select', 'file']),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional(),
  })).optional(),
  submitLabel: z.string().optional(),
  successMessage: z.string().optional(),
  routing: z.enum(['platform', 'tenant_smtp']).default('platform'),
  gdprCheckboxText: z.string().min(1),
});

// ─── 11. Map ────────────────────────────────────────────────────────
export const mapDataSchema = z.object({
  provider: z.enum(['embed', 'url']).default('embed'),
  embedUrl: z.string().min(1),
  headline: z.string().optional(),
  height: z.enum(['s', 'm', 'l']).default('m'),
});

// ─── 12. Header Banner ─────────────────────────────────────────────
export const headerBannerDataSchema = z.object({
  items: z.array(z.object({
    text: z.string().min(1),
    link: z.string().optional(),
  })).min(1),
  visibility: z.enum(['showOnPages', 'showEverywhere']).default('showEverywhere'),
  style: z.enum(['neutral', 'info', 'warning']).default('neutral'),
});

// ─── Section type registry ──────────────────────────────────────────
export const sectionTypeEnum = z.enum([
  'hero', 'uspStrip', 'servicesGrid', 'processSteps', 'projectGallery',
  'trust', 'testimonials', 'faq', 'ctaBand', 'contact', 'map', 'headerBanner',
]);

export type SectionType = z.infer<typeof sectionTypeEnum>;

export const sectionDataSchemas = {
  hero: heroDataSchema,
  uspStrip: uspStripDataSchema,
  servicesGrid: servicesGridDataSchema,
  processSteps: processStepsDataSchema,
  projectGallery: projectGalleryDataSchema,
  trust: trustDataSchema,
  testimonials: testimonialsDataSchema,
  faq: faqDataSchema,
  ctaBand: ctaBandDataSchema,
  contact: contactDataSchema,
  map: mapDataSchema,
  headerBanner: headerBannerDataSchema,
} as const;

// ─── Section completion rules ───────────────────────────────────────
export type CompletionStatus = 'complete' | 'partial' | 'empty';

const requiredFieldsBySection: Record<SectionType, string[]> = {
  hero: ['headline', 'subline', 'primaryCta'],
  uspStrip: ['items'],
  servicesGrid: ['source'],
  processSteps: ['headline', 'steps'],
  projectGallery: ['headline', 'source'],
  trust: ['items'],
  testimonials: ['headline', 'items'],
  faq: ['headline', 'items'],
  ctaBand: ['headline', 'ctaPrimary'],
  contact: ['headline', 'gdprCheckboxText'],
  map: ['embedUrl'],
  headerBanner: ['items'],
};

export function computeCompletion(type: SectionType, data: Record<string, unknown>): CompletionStatus {
  const required = requiredFieldsBySection[type] || [];
  const filled = required.filter((f) => {
    const val = data[f];
    if (val === undefined || val === null || val === '') return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  });
  if (filled.length === 0) return 'empty';
  if (filled.length === required.length) return 'complete';
  return 'partial';
}
