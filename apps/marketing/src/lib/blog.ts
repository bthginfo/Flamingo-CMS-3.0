import { getDb } from '@/lib/db';
import { crmBlogPosts } from '@flamingo/db';
import { and, desc, eq } from 'drizzle-orm';

export type BlogPost = typeof crmBlogPosts.$inferSelect;
export type BlogPostInput = typeof crmBlogPosts.$inferInsert;

export const BLOG_SCHEMA_MISSING_MESSAGE = 'Die CRM-Blogtabelle ist in der Datenbank noch nicht angelegt.';

export function isMissingBlogSchemaError(error: unknown) {
  const maybeError = error as { code?: string; message?: string } | null;
  const message = maybeError?.message || '';
  return maybeError?.code === '42P01'
    || maybeError?.code === '42704'
    || message.includes('crm_blog_posts')
    || message.includes('crm_blog_post_status');
}

export function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

export function excerptFrom(text: string, length = 155) {
  const clean = text.replace(/[#*_`>-]/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length - 1).trim()}…`;
}

export function readingMinutesFor(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function splitTags(tagsText: string) {
  return tagsText.split(',').map(tag => tag.trim()).filter(Boolean).slice(0, 12);
}

export async function getPublishedBlogPosts(limit?: number): Promise<BlogPost[]> {
  if (!process.env.DATABASE_URL) return [];
  const db = getDb();
  try {
    const rows = await db
      .select()
      .from(crmBlogPosts)
      .where(eq(crmBlogPosts.status, 'published'))
      .orderBy(desc(crmBlogPosts.publishedAt), desc(crmBlogPosts.createdAt));
    return typeof limit === 'number' ? rows.slice(0, limit) : rows;
  } catch (error) {
    if (isMissingBlogSchemaError(error)) return [];
    throw error;
  }
}

export async function getPublishedBlogPost(slug: string): Promise<BlogPost | null> {
  if (!process.env.DATABASE_URL) return null;
  const db = getDb();
  try {
    const [post] = await db
      .select()
      .from(crmBlogPosts)
      .where(and(eq(crmBlogPosts.slug, slug), eq(crmBlogPosts.status, 'published')))
      .limit(1);
    return post || null;
  } catch (error) {
    if (isMissingBlogSchemaError(error)) return null;
    throw error;
  }
}
