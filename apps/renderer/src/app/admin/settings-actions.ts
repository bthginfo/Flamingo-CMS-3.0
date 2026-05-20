'use server';

import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { globalSettings, navigation, footer, tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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
  const [existing] = await db.select({ id: globalSettings.id }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);

  console.log('[saveBrandSettings] tenantId:', tenantId, 'existing:', !!existing, 'primaryColor:', data.primaryColor);

  if (existing) {
    await db.update(globalSettings)
      .set({ brand: data, updatedAt: new Date() })
      .where(eq(globalSettings.tenantId, tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId, brand: data });
  }

  // Verify the write
  const [verify] = await db.select({ brand: globalSettings.brand }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  const savedPrimary = (verify?.brand as Record<string, unknown>)?.primaryColor;
  console.log('[saveBrandSettings] VERIFY after write:', savedPrimary);

  revalidatePath('/admin/brand');
  revalidatePath('/', 'layout');
  revalidatePath('/', 'page');
  return { success: true, verified: savedPrimary === data.primaryColor };
}

// ─── Contact ──────────────────────────────────────────────────────────

export async function getContactSettings() {
  const tenantId = await requireTenant();
  const db = getDb();
  const [row] = await db.select().from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  return {
    contact: (row?.contact as { phone?: string; email?: string; address?: string }) || {},
    openingHours: (row?.openingHours as { day: string; hours: string }[]) || [],
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

export async function saveOpeningHours(hours: { day: string; hours: string }[]) {
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
  return {
    items: (row?.items as { label: string; href: string; type?: string }[]) || [],
    cta: (row?.cta as { label: string; href: string } | null) || null,
  };
}

export async function saveNavigationSettings(items: { label: string; href: string; type?: string }[], cta?: { label: string; href: string } | null) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [existing] = await db.select().from(navigation).where(eq(navigation.tenantId, tenantId)).limit(1);
  if (existing) {
    await db.update(navigation).set({ items, cta: cta || {}, updatedAt: new Date() }).where(eq(navigation.tenantId, tenantId));
  } else {
    await db.insert(navigation).values({ tenantId, items, cta: cta || {} });
  }
  revalidatePath('/admin/navigation');
  return { success: true };
}

// ─── Footer ──────────────────────────────────────────────────────────

export async function getFooterSettings() {
  const tenantId = await requireTenant();
  const db = getDb();
  const [row] = await db.select().from(footer).where(eq(footer.tenantId, tenantId)).limit(1);
  return {
    columns: (row?.columns as { title: string; items: { text: string; href?: string }[] }[]) || [],
    legalLinks: (row?.legalLinks as { label: string; href: string }[]) || [],
  };
}

export async function saveFooterSettings(data: {
  columns: { title: string; items: { text: string; href?: string }[] }[];
  legalLinks: { label: string; href: string }[];
}) {
  const tenantId = await requireTenant();
  const db = getDb();
  const [existing] = await db.select().from(footer).where(eq(footer.tenantId, tenantId)).limit(1);
  if (existing) {
    await db.update(footer).set({ columns: data.columns, legalLinks: data.legalLinks, updatedAt: new Date() }).where(eq(footer.tenantId, tenantId));
  } else {
    await db.insert(footer).values({ tenantId, columns: data.columns, legalLinks: data.legalLinks });
  }
  revalidatePath('/admin/navigation');
  return { success: true };
}

// ─── Style ────────────────────────────────────────────────────────────

export async function getTenantInfo() {
  const tenantId = await requireTenant();
  const db = getDb();
  const [t] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  return { industry: t?.industry ?? 'handwerk', activeStyle: t?.activeStyle ?? 'classic' };
}

export async function saveActiveStyle(style: string) {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.update(tenants).set({ activeStyle: style, updatedAt: new Date() }).where(eq(tenants.id, tenantId));
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
