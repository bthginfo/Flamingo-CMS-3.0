/**
 * Tenant provisioning: creates all necessary DB records for a new tenant.
 */
import { getDb } from './db';
import { tenants, tenantDomains, adminSecrets, globalSettings, navigation, footer, pages, pageSections, publishedSnapshots } from '@flamingo/db';
import { hashPassword } from '@flamingo/auth';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { addDomainToRenderer } from './vercel';

export type ProvisionInput = {
  name: string;
  slug: string;
  industry: 'tradesman' | 'restaurant' | 'salon' | 'hotel' | 'tourism' | 'consulting' | 'medical' | 'fitness' | 'wedding' | 'cafe' | 'bar';
  domain?: string;
  password: string;
  companyName: string;
  tagline?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type ProvisionResult = {
  tenantId: string;
  slug: string;
  domain?: string;
  domainConfigured?: boolean;
  adminUrl: string;
  rendererUrl: string;
};

export async function provisionTenant(input: ProvisionInput): Promise<ProvisionResult> {
  const db = getDb();

  // 1. Create tenant
  const [tenant] = await db.insert(tenants).values({
    name: input.name,
    slug: input.slug,
    industry: input.industry,
    activeStyle: 'classic',
    status: 'provisioning',
  }).returning();

  const tenantId = tenant.id;

  // 2. Admin secret
  const passwordHash = await hashPassword(input.password);
  await db.insert(adminSecrets).values({ tenantId, passwordHash });

  // 3. Global settings
  await db.insert(globalSettings).values({
    tenantId,
    brand: {
      companyName: input.companyName,
      tagline: input.tagline || '',
      primaryColor: input.primaryColor || '#1a5276',
      secondaryColor: input.secondaryColor || '#2e86c1',
      accentColor: input.accentColor || '#f39c12',
    },
    contact: {
      phone: input.phone || '',
      email: input.email || '',
      address: input.address || '',
    },
  });

  // 4. Default navigation
  await db.insert(navigation).values({
    tenantId,
    items: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Kontakt', href: '/kontakt', type: 'link' },
    ],
  });

  // 5. Default footer
  await db.insert(footer).values({
    tenantId,
    columns: [
      {
        title: 'Kontakt',
        items: [
          ...(input.phone ? [{ text: input.phone, href: `tel:${input.phone.replace(/[^+\d]/g, '')}` }] : []),
          ...(input.email ? [{ text: input.email, href: `mailto:${input.email}` }] : []),
          ...(input.address ? [{ text: input.address }] : []),
        ],
      },
    ],
    legalLinks: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
  });

  // 6. Default homepage
  const [homePage] = await db.insert(pages).values({
    tenantId,
    title: 'Startseite',
    slug: 'startseite',
    type: 'free',
    status: 'published',
    visible: true,
    sortOrder: 0,
  }).returning();

  await db.insert(pageSections).values({
    tenantId,
    pageId: homePage.id,
    type: 'hero',
    sortOrder: 0,
    visible: true,
    data: {
      headline: `Willkommen bei ${input.companyName}`,
      subline: input.tagline || 'Wir freuen uns auf Sie.',
      primaryCta: { label: 'Kontakt', href: '/kontakt' },
    },
  });

  // 7. Contact page
  const [contactPage] = await db.insert(pages).values({
    tenantId,
    title: 'Kontakt',
    slug: 'kontakt',
    type: 'free',
    status: 'published',
    visible: true,
    sortOrder: 1,
  }).returning();

  await db.insert(pageSections).values({
    tenantId,
    pageId: contactPage.id,
    type: 'contact',
    sortOrder: 0,
    visible: true,
    data: {
      headline: 'Kontakt aufnehmen',
      formEnabled: true,
    },
  });

  // 8. Publish initial snapshot
  const allPages = await db.select().from(pages).where(eq(pages.tenantId, tenantId));
  const allSections = await db.select().from(pageSections).where(eq(pageSections.tenantId, tenantId));
  const snapshot = {
    pages: allPages.map(p => ({
      ...p,
      sections: allSections.filter(s => s.pageId === p.id).sort((a, b) => a.sortOrder - b.sortOrder),
    })),
    collections: [],
    generatedAt: new Date().toISOString(),
  };
  const snapshotJson = JSON.stringify(snapshot);
  const checksum = crypto.createHash('sha256').update(snapshotJson).digest('hex');

  await db.insert(publishedSnapshots).values({
    tenantId,
    version: 1,
    snapshot: snapshot as unknown as Record<string, unknown>,
    checksum,
    isActive: true,
    createdBy: 'provisioning',
  });

  // 9. Domain provisioning (if provided)
  let domainConfigured = false;
  if (input.domain) {
    await db.insert(tenantDomains).values({
      tenantId,
      domain: input.domain,
      type: 'primary',
      verified: false,
    });

    try {
      const result = await addDomainToRenderer(input.domain);
      domainConfigured = result.configured;
      if (result.verified) {
        await db.update(tenantDomains)
          .set({ verified: true })
          .where(eq(tenantDomains.tenantId, tenantId));
      }
    } catch (err) {
      console.error('Domain provisioning failed:', err);
    }
  }

  // 10. Activate tenant
  await db.update(tenants)
    .set({ status: 'active', updatedAt: new Date() })
    .where(eq(tenants.id, tenantId));

  const baseRendererDomain = process.env.RENDERER_BASE_DOMAIN || 'flamingomedia.online';

  return {
    tenantId,
    slug: input.slug,
    domain: input.domain,
    domainConfigured,
    adminUrl: `${process.env.NEXT_PUBLIC_ADMIN_URL || 'https://admin.flamingomedia.online'}/admin`,
    rendererUrl: input.domain ? `https://${input.domain}` : `https://${input.slug}.${baseRendererDomain}`,
  };
}
