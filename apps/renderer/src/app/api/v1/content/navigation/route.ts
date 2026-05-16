import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { navigation } from '@flamingo/db';
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { items, cta } = await req.json();
  const db = getDb();

  const [existing] = await db.select().from(navigation).where(eq(navigation.tenantId, auth.tenantId));
  if (existing) {
    await db.update(navigation).set({ items: items || [], cta: cta || {} }).where(eq(navigation.tenantId, auth.tenantId));
  } else {
    await db.insert(navigation).values({ tenantId: auth.tenantId, items: items || [], cta: cta || {} });
  }

  return NextResponse.json({ success: true });
}
