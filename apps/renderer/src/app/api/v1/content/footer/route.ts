import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { footer } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';

export const PUT = withApiHandler(async (req, auth) => {
  const { columns, legalLinks, cta } = await req.json();
  const db = getDb();

  // Validate columns have items
  if (Array.isArray(columns)) {
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (!col.title) return NextResponse.json({ error: `columns[${i}].title is required` }, { status: 400 });
      if (!Array.isArray(col.items) || col.items.length === 0) {
        return NextResponse.json({ error: `columns[${i}].items must be a non-empty array. Each item needs { text: string, href?: string }` }, { status: 400 });
      }
    }
  }

  const [existing] = await db.select().from(footer).where(eq(footer.tenantId, auth.tenantId));
  if (existing) {
    await db.update(footer).set({ columns: columns || [], legalLinks: legalLinks || [], cta: cta || {} }).where(eq(footer.tenantId, auth.tenantId));
  } else {
    await db.insert(footer).values({ tenantId: auth.tenantId, columns: columns || [], legalLinks: legalLinks || [], cta: cta || {} });
  }

  return NextResponse.json({ success: true });
});
