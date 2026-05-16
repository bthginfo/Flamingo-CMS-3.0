import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { items, cta } = await req.json();
  const db = getDb();

  await db.update(tenants).set({ navItems: items, navCta: cta || null }).where(eq(tenants.id, auth.tenantId));

  return NextResponse.json({ success: true });
}
