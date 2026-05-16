import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { pages } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  const updates: Record<string, unknown> = {};
  if (body.title) updates.title = body.title;
  if (body.slug) updates.slug = body.slug.startsWith('/') ? body.slug : `/${body.slug}`;
  if (body.sections) {
    updates.sections = body.sections.map((s: any) => ({
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
  }

  if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  await db.update(pages).set(updates).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)));

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const db = getDb();

  await db.delete(pages).where(and(eq(pages.id, id), eq(pages.tenantId, auth.tenantId)));

  return NextResponse.json({ success: true });
}
