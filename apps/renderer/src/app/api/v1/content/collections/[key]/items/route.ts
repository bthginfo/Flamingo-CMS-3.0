import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { collections, collectionItems } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';
import { normalizeSectionData, normalizeStyleOverrides } from '@/lib/api-utils';

export async function POST(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const auth = await validatePat(req.headers.get('authorization'));
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { key } = await params;
    const db = getDb();

    const [collection] = await db.select().from(collections).where(and(eq(collections.tenantId, auth.tenantId), eq(collections.key, key)));
    if (!collection) return NextResponse.json({ error: 'Collection not found' }, { status: 404 });

    const { title, slug, data, published } = await req.json();
    if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });

    const itemSlug = slug || title.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/(^-|-$)/g, '');
    const id = crypto.randomUUID();

    // Ensure all sections have IDs for DnD support
    const itemData = data || {};
    if (Array.isArray(itemData.sections)) {
      itemData.sections = itemData.sections.map((s: Record<string, unknown>) => ({
        ...s,
        id: s.id || crypto.randomUUID(),
        data: normalizeSectionData(String(s.type || ''), (s.data as Record<string, unknown>) || {}),
        styleOverrides: normalizeStyleOverrides(s.styleOverrides),
      }));
    }

    await db.insert(collectionItems).values({
      id,
      tenantId: auth.tenantId,
      collectionId: collection.id,
      title,
      slug: itemSlug,
      data: itemData,
      published: published ?? false,
    });

    return NextResponse.json({ id, slug: itemSlug }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('POST /collections/:key/items error:', message);
    if (message.includes('unique') || message.includes('duplicate')) {
      return NextResponse.json({ error: 'Item with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
