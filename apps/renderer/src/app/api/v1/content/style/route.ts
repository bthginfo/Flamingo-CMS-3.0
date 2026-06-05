import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';

const VALID_STYLES = ['classic'];

export const PUT = withApiHandler(async (req, auth) => {
  const body = await req.json();
  const style = 'classic';

  if (body.style && !VALID_STYLES.includes(body.style)) {
    return NextResponse.json({ error: `Invalid style. Must be one of: ${VALID_STYLES.join(', ')}` }, { status: 400 });
  }

  const db = getDb();
  await db.update(tenants).set({ activeStyle: style }).where(eq(tenants.id, auth.tenantId));

  return NextResponse.json({ success: true, style });
});
