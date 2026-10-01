import { getDb } from '@/lib/db';
import { crmBlogPosts } from '@flamingo/db';
import { and, desc, eq, getTableColumns } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

export type BlogPost = typeof crmBlogPosts.$inferSelect;
export type BlogPostInput = typeof crmBlogPosts.$inferInsert;
export type BlogPostSummary = Omit<BlogPost, 'content'>;
export const PUBLIC_BLOG_CACHE_TAG = 'public-blog';

// Next's persistent cache serializes dates. Restore the public Date contract
// before returning cached rows to metadata and JSON-LD consumers.
export function restoreBlogDates<T extends Pick<BlogPost, 'createdAt' | 'updatedAt' | 'publishedAt'>>(post: T): T {
  return { ...post, createdAt: new Date(post.createdAt), updatedAt: new Date(post.updatedAt),
    publishedAt: post.publishedAt ? new Date(post.publishedAt) : null };
}

export function normalizeBlogListLimit(limit?: number): number | undefined {
  if (limit === undefined) return undefined;
  if (!Number.isFinite(limit)) throw new RangeError('Blog limit must be finite');
  return Math.max(0, Math.floor(limit));
}

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

export async function getPublishedBlogPosts(limit?: number): Promise<BlogPostSummary[]> {
  if (!process.env.DATABASE_URL) return [];
  const rowLimit = normalizeBlogListLimit(limit);
  try {
    const rows = await unstable_cache(async () => {
      const { content: _content, ...summaryColumns } = getTableColumns(crmBlogPosts);
      const query = getDb()
        .select(summaryColumns)
        .from(crmBlogPosts)
        .where(eq(crmBlogPosts.status, 'published'))
        .orderBy(desc(crmBlogPosts.publishedAt), desc(crmBlogPosts.createdAt));
      return rowLimit !== undefined ? query.limit(rowLimit) : query;
    }, ['published-blog-list-v1', String(rowLimit ?? 'all')],
    { revalidate: 3600, tags: [PUBLIC_BLOG_CACHE_TAG] })();
    return rows.map(restoreBlogDates);
  } catch (error) {
    if (isMissingBlogSchemaError(error)) return [];
    throw error;
  }
}

export const getPublishedBlogPost = cache(async (slug: string): Promise<BlogPost | null> => {
  if (!process.env.DATABASE_URL) return null;
  try {
    const post = await unstable_cache(async () => {
      const [row] = await getDb()
        .select()
        .from(crmBlogPosts)
        .where(and(eq(crmBlogPosts.slug, slug), eq(crmBlogPosts.status, 'published')))
        .limit(1);
      return row || null;
    }, ['published-blog-post-v1', slug], { revalidate: 3600, tags: [PUBLIC_BLOG_CACHE_TAG] })();
    return post ? restoreBlogDates(post) : null;
  } catch (error) {
    if (isMissingBlogSchemaError(error)) return null;
    throw error;
  }
});
