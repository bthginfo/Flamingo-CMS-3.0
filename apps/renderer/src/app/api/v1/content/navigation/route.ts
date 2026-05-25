import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { navigation } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';

export const PUT = withApiHandler(async (req, auth) => {
  const { items, cta, locale } = await req.json();
  const db = getDb();

  const [existing] = await db.select().from(navigation).where(eq(navigation.tenantId, auth.tenantId));

  if (locale) {
    // Localized mode: store items/cta under locale key
    const currentItems = (existing?.items || []) as unknown as Record<string, unknown>;
    const currentCta = (existing?.cta || {}) as Record<string, unknown>;

    const newItems = currentItems._localized
      ? { ...currentItems, [locale]: items || [] }
      : { _localized: true, [locale]: items || [], ...(existing ? { _default: existing.items } : {}) };
    const newCta = currentCta._localized
      ? { ...currentCta, [locale]: cta || {} }
      : { _localized: true, [locale]: cta || {}, ...(existing ? { _default: existing.cta } : {}) };

    if (existing) {
      await db.update(navigation).set({ items: newItems as any, cta: newCta as any }).where(eq(navigation.tenantId, auth.tenantId));
    } else {
      await db.insert(navigation).values({ tenantId: auth.tenantId, items: newItems as any, cta: newCta as any });
    }
  } else {
    // Default (non-localized) mode
    if (existing) {
      const currentItems = (existing.items || []) as unknown as Record<string, unknown>;
      const currentCta = (existing.cta || {}) as Record<string, unknown>;

      if (currentItems._localized) {
        // Already localized — update _default key
        await db.update(navigation).set({
          items: { ...currentItems, _default: items || [] } as any,
          cta: { ...currentCta, _default: cta || {} } as any,
        }).where(eq(navigation.tenantId, auth.tenantId));
      } else {
        await db.update(navigation).set({ items: items || [], cta: cta || {} }).where(eq(navigation.tenantId, auth.tenantId));
      }
    } else {
      await db.insert(navigation).values({ tenantId: auth.tenantId, items: items || [], cta: cta || {} });
    }
  }

  return NextResponse.json({ success: true });
});
