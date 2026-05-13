import { getDb } from '@/lib/db';
import { navigation, footer, globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';

export type NavItem = { label: string; href: string; type?: string };
export type FooterColumn = { title: string; items: { text: string; href?: string }[] };
export type FooterData = { columns: FooterColumn[]; legalLinks: { label: string; href: string }[]; cta?: { label: string; href: string } };
export type BrandData = { companyName?: string; tagline?: string; primaryColor?: string; secondaryColor?: string; accentColor?: string };
export type ContactData = { phone?: string; email?: string; address?: string };

export async function getTenantNav(tenantId: string): Promise<NavItem[]> {
  const db = getDb();
  const [nav] = await db.select().from(navigation).where(eq(navigation.tenantId, tenantId)).limit(1);
  return (nav?.items as NavItem[]) || [];
}

export async function getTenantFooter(tenantId: string): Promise<FooterData | null> {
  const db = getDb();
  const [f] = await db.select().from(footer).where(eq(footer.tenantId, tenantId)).limit(1);
  if (!f) return null;
  return { columns: f.columns as FooterColumn[], legalLinks: f.legalLinks as { label: string; href: string }[], cta: f.cta as { label: string; href: string } | undefined };
}

export async function getTenantBrand(tenantId: string): Promise<{ brand: BrandData; contact: ContactData }> {
  const db = getDb();
  const [s] = await db.select().from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
  return { brand: (s?.brand as BrandData) || {}, contact: (s?.contact as ContactData) || {} };
}
