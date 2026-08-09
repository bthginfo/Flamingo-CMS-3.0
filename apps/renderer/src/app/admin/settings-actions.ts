'use server';

import { getDb } from '@/lib/db';
import { getSession, getWritableSession } from '@/lib/session';
import { globalSettings, navigation, footer, tenants } from '@flamingo/db';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { normalizeFooterVariant } from '@/lib/footer-variants';
import { isValidColorString, validateBrandPayload } from '@/lib/color-validation';
import { EDITABLE_BACKGROUND_DESIGN_KEYS } from '@/lib/design-vars';
import { revalidateTenantPublicData } from '@/lib/tenant-cache-invalidation';

type OpeningHoursRow = { day?: string; hours?: string; note?: string; closed?: boolean; type?: 'regular' | 'special'; date?: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function invalidBrandColorMessage(data: Record<string, unknown>): string | null {
  const issue = validateBrandPayload(data).find((candidate) => candidate.severity === 'error');
  return issue ? 'Eine Farbe hat kein gültiges Format. Bitte Hex, rgb() oder rgba() verwenden.' : null;
}

function sanitizeDesignPayload(data: unknown): { value?: Record<string, string>; error?: string } {
  if (!isRecord(data)) return { error: 'Die Design-Daten sind ungültig.' };

  const value: Record<string, string> = {};
  for (const key of EDITABLE_BACKGROUND_DESIGN_KEYS) {
    const raw = data[key];
    if (raw === undefined || raw === null || raw === '') continue;
    if (typeof raw !== 'string' || !isValidColorString(raw.trim())) {
      return { error: 'Eine Hintergrund- oder Textfarbe hat kein gültiges Format.' };
    }
    value[key] = raw.trim();
  }
  return { value };
}

export async function requireTenant() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session.tenantId;
}

async function requireWritableTenant() {
  const session = await getWritableSession();
  if (!session) throw new Error('Diese Demo-Sitzung ist schreibgeschützt.');
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
  const tenantId = await requireWritableTenant();
  const db = getDb();

  try {
    if (!isRecord(data)) {
      return { success: false as const, error: 'Die Marken-Daten sind ungültig.' };
    }
    const colorError = invalidBrandColorMessage(data);
    if (colorError) return { success: false as const, error: colorError };

    await db.insert(globalSettings)
      .values({ tenantId, brand: data })
      .onConflictDoUpdate({
        target: globalSettings.tenantId,
        set: {
          // Merge in the database so tenant-specific, forward-compatible
          // brand fields survive while empty strings still reset a field.
          brand: sql`coalesce(${globalSettings.brand}, '{}'::jsonb) || excluded.brand`,
          updatedAt: new Date(),
        },
      });

    revalidatePath('/admin/brand');
    revalidateTenantPublicData(tenantId);
    return { success: true as const };
  } catch (error) {
    console.error('[settings] Failed to save brand settings', { tenantId, error });
    return {
      success: false as const,
      error: 'Marke konnte nicht gespeichert werden. Bitte erneut versuchen.',
    };
  }
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
  const tenantId = await requireWritableTenant();
  const db = getDb();
  const [existing] = await db.select({ id: globalSettings.id }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  if (existing) {
    await db.update(globalSettings).set({ contact: data, updatedAt: new Date() }).where(eq(globalSettings.tenantId, tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId, contact: data });
  }
  revalidatePath('/admin/contact');
  revalidateTenantPublicData(tenantId);
  return { success: true };
}

export async function saveOpeningHours(hours: OpeningHoursRow[]) {
  const tenantId = await requireWritableTenant();
  const db = getDb();
  const [existing] = await db.select({ id: globalSettings.id }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  if (existing) {
    await db.update(globalSettings).set({ openingHours: hours, updatedAt: new Date() }).where(eq(globalSettings.tenantId, tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId, openingHours: hours });
  }
  revalidatePath('/admin/contact');
  revalidateTenantPublicData(tenantId);
  return { success: true };
}

export async function saveSocialLinks(links: Record<string, string>) {
  const tenantId = await requireWritableTenant();
  const db = getDb();
  const [existing] = await db.select({ id: globalSettings.id }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  if (existing) {
    await db.update(globalSettings).set({ socialLinks: links, updatedAt: new Date() }).where(eq(globalSettings.tenantId, tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId, socialLinks: links });
  }
  revalidatePath('/admin/social');
  revalidateTenantPublicData(tenantId);
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
  const tenantId = await requireWritableTenant();
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
  revalidateTenantPublicData(tenantId);
  return { success: true };
}

// ─── Footer ──────────────────────────────────────────────────────────

export async function getFooterSettings() {
  const tenantId = await requireTenant();
  const db = getDb();
  const [row] = await db.select().from(footer).where(eq(footer.tenantId, tenantId)).limit(1);
  const rawColumns = row?.columns as any;
  const rawLegalLinks = row?.legalLinks as any;
  const rawCta = row?.cta as any;
  if (rawColumns?._localized) {
    return { columns: rawColumns, legalLinks: rawLegalLinks, cta: rawCta || {}, variant: normalizeFooterVariant(rawCta?.variant), _localized: true as const };
  }
  return {
    columns: (rawColumns as { title: string; items: { text: string; href?: string }[] }[]) || [],
    legalLinks: (rawLegalLinks as { label: string; href: string }[]) || [],
    cta: rawCta || {},
    variant: normalizeFooterVariant(rawCta?.variant),
  };
}

function mergeFooterCta(current: unknown, next: unknown) {
  const currentObj = current && typeof current === 'object' && !Array.isArray(current) ? current as Record<string, unknown> : {};
  const nextObj = next && typeof next === 'object' && !Array.isArray(next) ? next as Record<string, unknown> : {};
  return {
    ...currentObj,
    ...nextObj,
    variant: normalizeFooterVariant(nextObj.variant ?? currentObj.variant),
  };
}

export async function saveFooterSettings(data: {
  columns: { title: string; items: { text: string; href?: string }[] }[];
  legalLinks: { label: string; href: string }[];
  cta?: { label?: string; href?: string; variant?: string } | null;
}, locale?: string) {
  const tenantId = await requireWritableTenant();
  const db = getDb();
  const [existing] = await db.select().from(footer).where(eq(footer.tenantId, tenantId)).limit(1);

  let finalColumns: any = data.columns;
  let finalLegalLinks: any = data.legalLinks;
  const finalCta = data.cta === undefined ? ((existing?.cta as any) || {}) : mergeFooterCta(existing?.cta, data.cta);

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
    await db.update(footer).set({ columns: finalColumns, legalLinks: finalLegalLinks, cta: finalCta, updatedAt: new Date() }).where(eq(footer.tenantId, tenantId));
  } else {
    await db.insert(footer).values({ tenantId, columns: finalColumns, legalLinks: finalLegalLinks, cta: finalCta });
  }
  revalidatePath('/admin/navigation');
  revalidateTenantPublicData(tenantId);
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
  const tenantId = await requireWritableTenant();
  const db = getDb();
  await db.update(tenants).set({ activeStyle: 'classic', updatedAt: new Date() }).where(eq(tenants.id, tenantId));
  revalidatePath('/admin/design');
  revalidateTenantPublicData(tenantId);
  return { success: true };
}

// ─── Design (Background & Text Colors) ───────────────────────────────

export async function getDesignSettings(): Promise<Record<string, unknown>> {
  const tenantId = await requireTenant();
  const db = getDb();
  const [row] = await db.select().from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  return row?.design && typeof row.design === 'object' && !Array.isArray(row.design)
    ? row.design as Record<string, unknown>
    : {};
}

export async function saveDesignSettings(data: Record<string, string>) {
  const tenantId = await requireWritableTenant();
  const db = getDb();
  try {
    const normalized = sanitizeDesignPayload(data);
    if (normalized.error || !normalized.value) {
      return { success: false as const, error: normalized.error || 'Die Design-Daten sind ungültig.' };
    }
    await db.insert(globalSettings)
      .values({ tenantId, design: normalized.value })
      .onConflictDoUpdate({
        target: globalSettings.tenantId,
        set: {
          // BackgroundForm owns only these keys. Clear its previous values
          // (including reset fields), then merge the submitted patch while
          // preserving unrelated/forward-compatible design metadata.
          design: sql`(coalesce(${globalSettings.design}, '{}'::jsonb) - ARRAY['sectionBg','sectionBgAlt','cardBg','bgSubtle','textOnSectionBg','textOnSectionBgAlt','textOnCardBg','textOnBgSubtle']::text[]) || excluded.design`,
          updatedAt: new Date(),
        },
      });
    revalidatePath('/admin/brand');
    revalidateTenantPublicData(tenantId);
    return { success: true as const };
  } catch (error) {
    console.error('[settings] Failed to save design settings', { tenantId, error });
    return {
      success: false as const,
      error: 'Design konnte nicht gespeichert werden. Bitte erneut versuchen.',
    };
  }
}
