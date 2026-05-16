import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { pages, pageSections } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug, title, sections } = await req.json();
  if (!slug || !title) return NextResponse.json({ error: 'slug and title required' }, { status: 400 });

  const db = getDb();
  const pageId = crypto.randomUUID();
  const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`;

  await db.insert(pages).values({
    id: pageId,
    tenantId: auth.tenantId,
    slug: normalizedSlug,
    title,
  });

  if (sections && sections.length > 0) {
    await db.insert(pageSections).values(
      sections.map((s: any, i: number) => ({
        id: s.id || crypto.randomUUID(),
        tenantId: auth.tenantId,
        pageId,
        type: s.type,
        data: s.data || {},
        variant: s.variant || null,
        visible: s.visible !== false,
        container: s.container || 'default',
        spacingTop: s.spacingTop || 'm',
        spacingBottom: s.spacingBottom || 'm',
        anchorId: s.anchorId || null,
        sortOrder: i,
      }))
    );
  }

  return NextResponse.json({ success: true, id: pageId, slug: normalizedSlug });
}

export async function GET(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const allPages = await db.select().from(pages).where(eq(pages.tenantId, auth.tenantId));

  return NextResponse.json({ pages: allPages.map(p => ({ id: p.id, slug: p.slug, title: p.title })) });
}
