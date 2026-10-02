import { mergeNavigationInput } from '@/lib/api-navigation-input';
import { readApiJsonObject } from '@/lib/api-request-body';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { navigation } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';

export const PUT = withApiHandler(async (req, auth) => {
  const body = await readApiJsonObject(req);
  const db = getDb();

  const [existing] = await db.select().from(navigation).where(eq(navigation.tenantId, auth.tenantId));

  const value = mergeNavigationInput(existing, body, {
    enabled: auth.tenant.i18nEnabled,
    locales: [...new Set([auth.tenant.i18nDefaultLocale, ...auth.tenant.i18nLocales.split(',')].map(locale => locale.trim()).filter(Boolean))],
  });
  if (existing) {
    await db.update(navigation).set(value as typeof navigation.$inferInsert).where(eq(navigation.tenantId, auth.tenantId));
  } else {
    await db.insert(navigation).values({ tenantId: auth.tenantId, ...value } as typeof navigation.$inferInsert);
  }

  return NextResponse.json({ success: true });
});
