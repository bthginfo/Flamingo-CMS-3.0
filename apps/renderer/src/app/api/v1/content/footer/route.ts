import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { footer } from '@flamingo/db';
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { columns, legalLinks, cta } = await req.json();
  const db = getDb();

  const [existing] = await db.select().from(footer).where(eq(footer.tenantId, auth.tenantId));
  if (existing) {
    await db.update(footer).set({ columns: columns || [], legalLinks: legalLinks || [], cta: cta || {} }).where(eq(footer.tenantId, auth.tenantId));
  } else {
    await db.insert(footer).values({ tenantId: auth.tenantId, columns: columns || [], legalLinks: legalLinks || [], cta: cta || {} });
  }

  return NextResponse.json({ success: true });
}
