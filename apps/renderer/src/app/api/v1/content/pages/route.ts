import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { pages } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug, title, sections } = await req.json();
  if (!slug || !title) return NextResponse.json({ error: 'slug and title required' }, { status: 400 });

  const db = getDb();
  const id = crypto.randomUUID();

  const normalizedSections = (sections || []).map((s: any, i: number) => ({
    id: s.id || crypto.randomUUID(),
    type: s.type,
    data: s.data || {},
    variant: s.variant || null,
    visible: s.visible !== false,
    container: s.container || 'default',
    spacingTop: s.spacingTop || 'md',
    spacingBottom: s.spacingBottom || 'md',
    anchorId: s.anchorId || null,
  }));

  await db.insert(pages).values({
    id,
    tenantId: auth.tenantId,
    slug: slug.startsWith('/') ? slug : `/${slug}`,
    title,
    sections: normalizedSections,
  });

  return NextResponse.json({ success: true, id, slug });
}

export async function GET(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const allPages = await db.select().from(pages).where(eq(pages.tenantId, auth.tenantId));

  return NextResponse.json({ pages: allPages.map(p => ({ id: p.id, slug: p.slug, title: p.title, sectionCount: (p.sections as any[])?.length || 0 })) });
}
