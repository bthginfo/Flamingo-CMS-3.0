'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { globalSettings, navigation, footer, tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

type OpeningHoursRow = { day?: string; hours?: string; note?: string; closed?: boolean; type?: 'regular' | 'special'; date?: string };

export async function requireTenant() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session.tenantId;
}

// ─── Brand ────────────────────────────────────────────────────────────

export async function getBrandSettings() {
  const tenantId = await requireTenant();
  const db = getDb();
  const [row] = await db.select().from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  return {
    brand: (row?.brand as Record<string, string>) || {},
    socialLinks: (row?.socialLinks as Record<string, string>) || {},
  };
}

export async function saveBrandSettings(data: Record<string, unknown>) {
  const tenantId = await requireTenant();
  const db = getDb();

  // Check if row exists
  const [existing] = await db.select({ id: globalSettings.id, brand: globalSettings.brand }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  const existingBrand = (existing?.brand as Record<string, unknown>) || {};
  const nextBrand = { ...data };
  if (existingBrand.localSeo && !nextBrand.localSeo) nextBrand.localSeo = existingBrand.localSeo;

  if (existing) {
    await db.update(globalSettings)
      .set({ brand: nextBrand, updatedAt: new Date() })
      .where(eq(globalSettings.tenantId, tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId, brand: nextBrand });
  }


  revalidatePath('/admin/brand');
  revalidatePath('/', 'layout');
  revalidatePath('/', 'page');
  return { success: true };
}

// ─── Contact ──────────────────────────────────────────────────────────

export async function getContactSettings() {
  const tenantId = await requireTenant();
  const db = getDb();
  const [row] = await db.select().from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  return {
    contact: (row?.contact as { phone?: string; email?: string; address?: string }) || {},
    openingHours: (row?.openingHours as OpeningHoursRow[]) || [],
    socialLinks: (row?.socialLinks as Record<string, string>) || {},
  };
}

export async function saveContactSettings(data: { phone: string; email: string; address: string; whatsapp?: string; whatsappEnabled?: boolean; whatsappColor?: string }) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [existing] = await db.select({ id: globalSettings.id }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  if (existing) {
    await db.update(globalSettings).set({ contact: data, updatedAt: new Date() }).where(eq(globalSettings.tenantId, tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId, contact: data });
  }
  revalidatePath('/admin/contact');
  return { success: true };
}

export async function saveOpeningHours(hours: OpeningHoursRow[]) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [existing] = await db.select({ id: globalSettings.id }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  if (existing) {
    await db.update(globalSettings).set({ openingHours: hours, updatedAt: new Date() }).where(eq(globalSettings.tenantId, tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId, openingHours: hours });
  }
  revalidatePath('/admin/contact');
  return { success: true };
}

export async function saveSocialLinks(links: Record<string, string>) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [existing] = await db.select({ id: globalSettings.id }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  if (existing) {
    await db.update(globalSettings).set({ socialLinks: links, updatedAt: new Date() }).where(eq(globalSettings.tenantId, tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId, socialLinks: links });
  }
  revalidatePath('/admin/social');
  return { success: true };
}

// ─── Navigation ───────────────────────────────────────────────────────

export async function getNavigationSettings() {
  const tenantId = await requireTenant();
  const db = getDb();
  const [row] = await db.select().from(navigation).where(eq(navigation.tenantId, tenantId)).limit(1);
  const rawItems = row?.items as any;
  const rawCta = row?.cta as any;
  // If _localized structure, return the whole thing for locale-aware editing
  if (rawItems?._localized) {
    return { items: rawItems, cta: rawCta, _localized: true as const };
  }
  return {
    items: (rawItems as { label: string; href: string; type?: string }[]) || [],
    cta: (rawCta as { label: string; href: string } | null) || null,
  };
}

export async function saveNavigationSettings(items: { label: string; href: string; type?: string }[], cta?: { label: string; href: string; scriptProvider?: string; scriptConfig?: Record<string, string>; buttonColor?: string; buttonTextColor?: string; topBar?: { enabled?: boolean; text?: string; linkLabel?: string; linkHref?: string; bgColor?: string; textColor?: string } } | null, locale?: string) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [existing] = await db.select().from(navigation).where(eq(navigation.tenantId, tenantId)).limit(1);

  let finalItems: any = items;
  let finalCta: any = cta || {};

  if (locale) {
    // Merge into _localized structure
    const currentItems = (existing?.items as any) || {};
    const currentCta = (existing?.cta as any) || {};
    if (currentItems._localized) {
      finalItems = { ...currentItems, [locale]: items };
      finalCta = { ...currentCta, [locale]: cta || null };
    } else {
      // Migrate: existing flat becomes _default
      finalItems = { _localized: true, _default: currentItems._localized ? undefined : (Array.isArray(currentItems) ? currentItems : []), [locale]: items };
      finalCta = { _localized: true, _default: currentCta._localized ? undefined : currentCta, [locale]: cta || null };
      // If no _default needed (first locale IS the default), keep clean
      if (!Array.isArray(currentItems) || currentItems.length === 0) {
        finalItems = { _localized: true, [locale]: items };
        finalCta = { _localized: true, [locale]: cta || null };
      } else {
        finalItems = { _localized: true, _default: currentItems, [locale]: items };
        finalCta = { _localized: true, _default: currentCta, [locale]: cta || null };
      }
    }
  }

  if (existing) {
    await db.update(navigation).set({ items: finalItems, cta: finalCta, updatedAt: new Date() }).where(eq(navigation.tenantId, tenantId));
  } else {
    await db.insert(navigation).values({ tenantId, items: finalItems, cta: finalCta });
  }
  revalidatePath('/admin/navigation');
  return { success: true };
}

// ─── Footer ──────────────────────────────────────────────────────────

export async function getFooterSettings() {
  const tenantId = await requireTenant();
  const db = getDb();
  const [row] = await db.select().from(footer).where(eq(footer.tenantId, tenantId)).limit(1);
  const rawColumns = row?.columns as any;
  const rawLegalLinks = row?.legalLinks as any;
  if (rawColumns?._localized) {
    return { columns: rawColumns, legalLinks: rawLegalLinks, _localized: true as const };
  }
  return {
    columns: (rawColumns as { title: string; items: { text: string; href?: string }[] }[]) || [],
    legalLinks: (rawLegalLinks as { label: string; href: string }[]) || [],
  };
}

export async function saveFooterSettings(data: {
  columns: { title: string; items: { text: string; href?: string }[] }[];
  legalLinks: { label: string; href: string }[];
}, locale?: string) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [existing] = await db.select().from(footer).where(eq(footer.tenantId, tenantId)).limit(1);

  let finalColumns: any = data.columns;
  let finalLegalLinks: any = data.legalLinks;

  if (locale) {
    const currentColumns = (existing?.columns as any) || {};
    const currentLegalLinks = (existing?.legalLinks as any) || {};
    if (currentColumns._localized) {
      finalColumns = { ...currentColumns, [locale]: data.columns };
      finalLegalLinks = { ...currentLegalLinks, [locale]: data.legalLinks };
    } else {
      if (!Array.isArray(currentColumns) || currentColumns.length === 0) {
        finalColumns = { _localized: true, [locale]: data.columns };
        finalLegalLinks = { _localized: true, [locale]: data.legalLinks };
      } else {
        finalColumns = { _localized: true, _default: currentColumns, [locale]: data.columns };
        finalLegalLinks = { _localized: true, _default: currentLegalLinks, [locale]: data.legalLinks };
      }
    }
  }

  if (existing) {
    await db.update(footer).set({ columns: finalColumns, legalLinks: finalLegalLinks, updatedAt: new Date() }).where(eq(footer.tenantId, tenantId));
  } else {
    await db.insert(footer).values({ tenantId, columns: finalColumns, legalLinks: finalLegalLinks });
  }
  revalidatePath('/admin/navigation');
  return { success: true };
}

// ─── Style ────────────────────────────────────────────────────────────

export async function getTenantInfo() {
  const tenantId = await requireTenant();
  const db = getDb();
  const [t] = await db.select({ industry: tenants.industry }).from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  return { industry: t?.industry ?? 'handwerk', activeStyle: 'classic' };
}

export async function saveActiveStyle(_style: string) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.update(tenants).set({ activeStyle: 'classic', updatedAt: new Date() }).where(eq(tenants.id, tenantId));
  revalidatePath('/admin/design');
  return { success: true };
}

// ─── Design (Background & Text Colors) ───────────────────────────────

export async function getDesignSettings(): Promise<Record<string, string>> {
  const tenantId = await requireTenant();
  const db = getDb();
  const [row] = await db.select().from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  return (row?.design as Record<string, string>) || {};
}

export async function saveDesignSettings(data: Record<string, string>) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [existing] = await db.select({ id: globalSettings.id }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  if (existing) {
    await db.update(globalSettings).set({ design: data, updatedAt: new Date() }).where(eq(globalSettings.tenantId, tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId, design: data });
  }
  revalidatePath('/admin/brand');
  return { success: true };
}
