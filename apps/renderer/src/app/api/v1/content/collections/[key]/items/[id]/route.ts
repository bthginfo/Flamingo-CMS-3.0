import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { collectionItems } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ key: string; id: string }> }) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  await db.update(collectionItems).set({
    ...body,
    updatedAt: new Date(),
  }).where(and(eq(collectionItems.id, id), eq(collectionItems.tenantId, auth.tenantId)));

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ key: string; id: string }> }) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const db = getDb();

  await db.delete(collectionItems).where(and(eq(collectionItems.id, id), eq(collectionItems.tenantId, auth.tenantId)));

  return NextResponse.json({ ok: true });
}
