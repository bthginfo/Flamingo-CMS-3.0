'use server';

import { getDb } from '@/lib/db';
import { provisionTenant, type ProvisionInput } from '@/lib/provisioning';
import { leads, tenants } from '@flamingo/db';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireCrmAdmin } from '@/lib/session';
import { isProtectedCrmSecret, protectCrmSecret, revealCrmSecret } from '@/lib/secret-storage';

export type Lead = typeof leads.$inferSelect;
type LeadInsert = typeof leads.$inferInsert;

function revealLeadPassword(lead: Lead): Lead {
  return { ...lead, adminPassword: revealCrmSecret(lead.adminPassword) };
}

async function upgradeLeadPasswords(rows: Lead[]) {
  const legacy = rows.filter(row => row.adminPassword && !isProtectedCrmSecret(row.adminPassword));
  if (!legacy.length) return;
  const db = getDb();
  await Promise.all(legacy.map(row => db.update(leads)
    .set({ adminPassword: protectCrmSecret(row.adminPassword), updatedAt: new Date() })
    .where(eq(leads.id, row.id))));
}

export async function getLeads(): Promise<Lead[]> {
  await requireCrmAdmin();
  const db = getDb();
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
  await upgradeLeadPasswords(rows);
  return rows.map(revealLeadPassword);
}

export async function createLead(data: Omit<LeadInsert, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
  await requireCrmAdmin();
  const db = getDb();
  const [lead] = await db.insert(leads).values({
    ...data,
    adminPassword: protectCrmSecret(data.adminPassword),
  }).returning();
  revalidatePath('/crm/leads');
  return revealLeadPassword(lead);
}

export async function updateLead(id: string, data: Partial<Omit<LeadInsert, 'id' | 'createdAt'>>): Promise<Lead> {
  await requireCrmAdmin();
  const db = getDb();
  const patch = {
    ...data,
    ...(data.adminPassword !== undefined ? { adminPassword: protectCrmSecret(data.adminPassword) } : {}),
    updatedAt: new Date(),
  };
  const [lead] = await db.update(leads).set(patch).where(eq(leads.id, id)).returning();
  revalidatePath('/crm/leads');
  return revealLeadPassword(lead);
}

export async function deleteLead(id: string): Promise<void> {
  await requireCrmAdmin();
  const db = getDb();
  await db.delete(leads).where(eq(leads.id, id));
  revalidatePath('/crm/leads');
}

const INDUSTRY_ALIASES: Array<{ match: RegExp; industry: ProvisionInput['industry'] }> = [
  { match: /fitness|personal\s*training|training|gym|studio/i, industry: 'fitness' },
  { match: /location|event|hochzeit|coworking|raum|venue/i, industry: 'location' },
  { match: /florist|blume|gärtnerei|gaertnerei|blüten|blueten/i, industry: 'florist' },
  { match: /restaurant|gastronomie|wirtshaus|pizzeria|küche|kueche/i, industry: 'restaurant' },
  { match: /cafe|café|kaffee/i, industry: 'cafe' },
  { match: /hotel|pension|apartment/i, industry: 'hotel' },
  { match: /arzt|medizin|praxis|therapie|physio/i, industry: 'medical' },
  { match: /salon|friseur|kosmetik|beauty/i, industry: 'salon' },
  { match: /foto|photography|fotograf/i, industry: 'photography' },
  { match: /tattoo/i, industry: 'tattoo' },
  { match: /shop|ecommerce|handel|retail/i, industry: 'retail' },
  { match: /immobilien|makler|real\s*estate/i, industry: 'realestate' },
  { match: /beratung|consulting|coach/i, industry: 'consulting' },
  { match: /tourismus|reise|tour/i, industry: 'tourism' },
  { match: /hochzeit|wedding/i, industry: 'wedding' },
];

function normalizeIndustry(value?: string | null): ProvisionInput['industry'] {
  const source = value?.trim() || '';
  return INDUSTRY_ALIASES.find(entry => entry.match.test(source))?.industry || 'tradesman';
}

function slugify(value: string) {
  return value
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'lead-demo';
}

function generateLeadPassword() {
  return `flamingo-${Math.random().toString(36).slice(2, 8)}`;
}

async function getUniqueTenantSlug(baseSlug: string) {
  const db = getDb();
  let candidate = baseSlug;
  for (let index = 2; index < 100; index += 1) {
    const [existing] = await db.select({ id: tenants.id }).from(tenants).where(eq(tenants.slug, candidate)).limit(1);
    if (!existing) return candidate;
    candidate = `${baseSlug}-${index}`;
  }
  throw new Error('Kein freier Tenant-Slug gefunden.');
}

export async function createLeadDemoTenant(leadId: string): Promise<{
  success: boolean;
  error?: string;
  lead?: Lead;
  tenant?: { id: string; name: string; slug: string };
  adminUrl?: string;
  rendererUrl?: string;
  password?: string;
}> {
  await requireCrmAdmin();
  const db = getDb();
  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);

  if (!lead) return { success: false, error: 'Lead nicht gefunden.' };
  if (lead.tenantId) return { success: false, error: 'Dieser Lead ist bereits mit einem Tenant verknüpft.' };

  const slug = await getUniqueTenantSlug(slugify(lead.company));
  const password = revealCrmSecret(lead.adminPassword)?.trim() || generateLeadPassword();
  const industry = normalizeIndustry(lead.industry);

  try {
    const result = await provisionTenant({
      name: lead.company,
      slug,
      industry,
      password,
      companyName: lead.company,
      tagline: lead.industry ? `${lead.industry} in ${lead.location || 'Ihrer Region'}` : '',
      email: lead.email || undefined,
      address: lead.location || undefined,
      deploymentMode: 'lead_shared',
    });

    const [updated] = await db.update(leads).set({
      tenantId: result.tenantId,
      adminPassword: protectCrmSecret(password),
      flamingoLink: result.rendererUrl,
      industry: lead.industry || industry,
      updatedAt: new Date(),
    }).where(eq(leads.id, leadId)).returning();

    revalidatePath('/crm/leads');
    revalidatePath('/crm/tenants');

    return {
      success: true,
      lead: revealLeadPassword(updated),
      tenant: { id: result.tenantId, name: lead.company, slug },
      adminUrl: result.adminUrl,
      rendererUrl: result.rendererUrl,
      password,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lead-Demo konnte nicht erstellt werden.',
    };
  }
}
