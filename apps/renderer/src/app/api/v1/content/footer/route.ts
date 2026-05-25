import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { footer } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';

export const PUT = withApiHandler(async (req, auth) => {
  const { columns, legalLinks, cta, locale } = await req.json();
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

  if (locale) {
    // Localized mode
    const currentCols = (existing?.columns || []) as unknown as Record<string, unknown>;
    const currentLegal = (existing?.legalLinks || []) as unknown as Record<string, unknown>;
    const currentCta = (existing?.cta || {}) as Record<string, unknown>;

    const newCols = currentCols._localized
      ? { ...currentCols, [locale]: columns || [] }
      : { _localized: true, [locale]: columns || [], ...(existing ? { _default: existing.columns } : {}) };
    const newLegal = currentLegal._localized
      ? { ...currentLegal, [locale]: legalLinks || [] }
      : { _localized: true, [locale]: legalLinks || [], ...(existing ? { _default: existing.legalLinks } : {}) };
    const newCta = currentCta._localized
      ? { ...currentCta, [locale]: cta || {} }
      : { _localized: true, [locale]: cta || {}, ...(existing ? { _default: existing.cta } : {}) };

    if (existing) {
      await db.update(footer).set({ columns: newCols as any, legalLinks: newLegal as any, cta: newCta as any }).where(eq(footer.tenantId, auth.tenantId));
    } else {
      await db.insert(footer).values({ tenantId: auth.tenantId, columns: newCols as any, legalLinks: newLegal as any, cta: newCta as any });
    }
  } else {
    if (existing) {
      await db.update(footer).set({ columns: columns || [], legalLinks: legalLinks || [], cta: cta || {} }).where(eq(footer.tenantId, auth.tenantId));
    } else {
      await db.insert(footer).values({ tenantId: auth.tenantId, columns: columns || [], legalLinks: legalLinks || [], cta: cta || {} });
    }
  }

  return NextResponse.json({ success: true });
});
