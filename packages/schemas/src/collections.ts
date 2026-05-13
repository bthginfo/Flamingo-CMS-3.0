import { z } from 'zod';
import { mediaRefSchema } from './sections.js';

// ─── Services (Leistungen) ──────────────────────────────────────────
export const serviceItemSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().min(1),
  body: z.string().min(1),
  featuredImage: mediaRefSchema,
  gallery: z.array(mediaRefSchema).optional(),
  priceHint: z.string().optional(),
  durationHint: z.string().optional(),
  ctaLabel: z.string().default('Angebot anfragen'),
  ctaLink: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priority: z.number().int().default(0),
  published: z.boolean().default(false),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(170).optional(),
  ogImage: z.string().optional(),
  canonical: z.string().optional(),
  noindex: z.boolean().default(false),
});

// ─── Projects (Referenzen) ──────────────────────────────────────────
export const projectItemSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  caseType: z.enum(['Privat', 'Gewerbe', 'Öffentlich']).optional(),
  location: z.string().optional(),
  year: z.string().optional(),
  scope: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().min(1),
  results: z.array(z.string()).optional(),
  beforeAfter: z.object({ before: mediaRefSchema, after: mediaRefSchema }).optional(),
  gallery: z.array(mediaRefSchema).optional(),
  testimonialQuote: z.string().optional(),
  published: z.boolean().default(false),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(170).optional(),
  ogImage: z.string().optional(),
  canonical: z.string().optional(),
  noindex: z.boolean().default(false),
});

// ─── Team ───────────────────────────────────────────────────────────
export const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  bio: z.string().optional(),
  photo: mediaRefSchema.optional(),
  certifications: z.array(z.string()).optional(),
  priority: z.number().int().default(0),
  published: z.boolean().default(false),
});

// ─── News ───────────────────────────────────────────────────────────
export const newsItemSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImage: mediaRefSchema.optional(),
  date: z.string(),
  author: z.string().optional(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(170).optional(),
  ogImage: z.string().optional(),
  canonical: z.string().optional(),
  noindex: z.boolean().default(false),
});

// ─── Collection key registry ────────────────────────────────────────
export const collectionKeyEnum = z.enum(['services', 'projects', 'team', 'news']);
export type CollectionKey = z.infer<typeof collectionKeyEnum>;

export const collectionItemSchemas = {
  services: serviceItemSchema,
  projects: projectItemSchema,
  team: teamMemberSchema,
  news: newsItemSchema,
} as const;
