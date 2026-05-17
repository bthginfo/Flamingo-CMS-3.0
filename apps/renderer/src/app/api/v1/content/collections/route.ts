import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { collections, collectionItems } from '@flamingo/db';
import { eq, and, asc } from 'drizzle-orm';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const cols = await db.select().from(collections).where(eq(collections.tenantId, auth.tenantId)).orderBy(asc(collections.key));
  
  const items = await db.select({
    id: collectionItems.id, collectionId: collectionItems.collectionId,
    title: collectionItems.title, slug: collectionItems.slug, published: collectionItems.published,
  }).from(collectionItems).where(eq(collectionItems.tenantId, auth.tenantId));

  return NextResponse.json(cols.map(c => ({
    id: c.id,
    key: c.key,
    label: c.label,
    items: items.filter(i => i.collectionId === c.id),
  })));
}

export async function POST(req: NextRequest) {
  try {
    const auth = await validatePat(req.headers.get('authorization'));
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { key, label, schema: colSchema, settings } = body;
    if (!key || !label) return NextResponse.json({ error: 'key and label required' }, { status: 400 });

    if (!/^[a-z0-9-]+$/.test(key)) {
      return NextResponse.json({ error: 'key must be lowercase alphanumeric with hyphens only' }, { status: 400 });
    }

    const db = getDb();

    const [existing] = await db.select({ id: collections.id }).from(collections)
      .where(and(eq(collections.tenantId, auth.tenantId), eq(collections.key, key)));
    if (existing) {
      return NextResponse.json({ id: existing.id, key }, { status: 200 });
    }

    const id = crypto.randomUUID();
    await db.insert(collections).values({
      id,
      tenantId: auth.tenantId,
      key,
      label,
      schema: colSchema || {},
      settings: settings || {},
    });

    return NextResponse.json({ id, key }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('POST /collections error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
