'use server';

import { getDb } from '@/lib/db';
import {
  BLOG_SCHEMA_MISSING_MESSAGE,
  excerptFrom,
  isMissingBlogSchemaError,
  normalizeSlug,
  readingMinutesFor,
  splitTags,
  type BlogPost,
  type BlogPostInput,
} from '@/lib/blog';
import { crmBlogPosts } from '@flamingo/db';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { sanitizeHtml } from '@/lib/sanitize-html';

export type CrmBlogPost = BlogPost;
type BlogPayload = Omit<BlogPostInput, 'id' | 'createdAt' | 'updatedAt' | 'readingMinutes' | 'tags' | 'publishedAt'> & {
  tagsText?: string;
  publishedAt?: Date | null;
};

function handleBlogSchemaError(error: unknown): never {
  if (isMissingBlogSchemaError(error)) throw new Error(BLOG_SCHEMA_MISSING_MESSAGE);
  throw error;
}

function revalidateBlog(slug?: string) {
  revalidatePath('/crm/blog');
  revalidatePath('/blog');
  revalidatePath('/');
  if (slug) revalidatePath(`/blog/${slug}`);
}

function cleanPayload(data: BlogPayload): Omit<BlogPostInput, 'id' | 'createdAt' | 'updatedAt'> {
  const content = sanitizeHtml(data.content || '');
  const title = data.title?.trim() || 'Unbenannter Beitrag';
  const slug = normalizeSlug(data.slug || title);
  const excerpt = data.excerpt?.trim() || excerptFrom(content || title, 170);
  const metaTitle = data.metaTitle?.trim() || title;
  const metaDescription = data.metaDescription?.trim() || excerptFrom(excerpt || content, 165);
  const status = data.status || 'draft';
  return {
    slug,
    title,
    excerpt,
    content,
    status,
    category: data.category?.trim() || null,
    tags: splitTags(data.tagsText || ''),
    coverImage: data.coverImage?.trim() || null,
    coverAlt: data.coverAlt?.trim() || null,
    authorName: data.authorName?.trim() || 'FlamingoMedia',
    metaTitle: metaTitle.slice(0, 180),
    metaDescription: metaDescription.slice(0, 260),
    ogImage: data.ogImage?.trim() || data.coverImage?.trim() || null,
    canonicalPath: data.canonicalPath?.trim() || `/blog/${slug}`,
    readingMinutes: readingMinutesFor(content),
    publishedAt: status === 'published' ? (data.publishedAt || new Date()) : data.publishedAt || null,
  };
}

export async function getBlogPosts(): Promise<CrmBlogPost[]> {
  const db = getDb();
  try {
    return await db.select().from(crmBlogPosts).orderBy(desc(crmBlogPosts.updatedAt));
  } catch (error) {
    if (isMissingBlogSchemaError(error)) {
      console.warn(`[CRM Blog] ${BLOG_SCHEMA_MISSING_MESSAGE}`);
      return [];
    }
    throw error;
  }
}

export async function createBlogPost(data: BlogPayload): Promise<CrmBlogPost> {
  const db = getDb();
  try {
    const payload = cleanPayload(data);
    const [post] = await db.insert(crmBlogPosts).values(payload).returning();
    revalidateBlog(post.slug);
    return post;
  } catch (error) {
    handleBlogSchemaError(error);
  }
}

export async function updateBlogPost(id: string, data: BlogPayload): Promise<CrmBlogPost> {
  const db = getDb();
  try {
    const current = await db.select().from(crmBlogPosts).where(eq(crmBlogPosts.id, id)).limit(1);
    const payload = cleanPayload({
      ...data,
      publishedAt: data.status === 'published' ? (current[0]?.publishedAt || new Date()) : data.publishedAt || null,
    });
    const [post] = await db.update(crmBlogPosts).set({ ...payload, updatedAt: new Date() }).where(eq(crmBlogPosts.id, id)).returning();
    revalidateBlog(post.slug);
    return post;
  } catch (error) {
    handleBlogSchemaError(error);
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  const db = getDb();
  try {
    await db.delete(crmBlogPosts).where(eq(crmBlogPosts.id, id));
    revalidateBlog();
  } catch (error) {
    handleBlogSchemaError(error);
  }
}
