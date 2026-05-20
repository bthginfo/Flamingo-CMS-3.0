/**
 * Tenant provisioning: creates all necessary DB records for a new tenant.
 */
import { getDb } from './db';
import { tenants, tenantDomains, adminSecrets, globalSettings, navigation, footer, pages, pageSections, publishedSnapshots } from '@flamingo/db';
import { hashPassword } from '@flamingo/auth';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { addDomainToRenderer, createStandaloneProject, addDomainToProject, triggerProjectDeployment } from './vercel';

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
  deploymentMode?: 'shared' | 'standalone';
};

export type ProvisionResult = {
  tenantId: string;
  slug: string;
  domain?: string;
  domainConfigured?: boolean;
  adminUrl: string;
  rendererUrl: string;
  warning?: string;
};

type DefaultPage = {
  title: string;
  slug: string;
  sortOrder: number;
  sections: Array<{
    type: string;
    data: Record<string, unknown>;
    sortOrder?: number;
    container?: string;
    spacingTop?: string;
    spacingBottom?: string;
    anchorId?: string;
  }>;
};

type ProvisioningDefaults = {
  brand: { primaryColor: string; secondaryColor: string; accentColor: string };
  navigationItems: Array<{ label: string; href: string; type: string }>;
  navigationCta: { label: string; href: string };
  footerColumns: Array<{ title: string; items: Array<{ text: string; href?: string }> }>;
  footerCta: { label: string; href: string };
  pages: DefaultPage[];
};

export async function provisionTenant(input: ProvisionInput): Promise<ProvisionResult> {
  const db = getDb();
  const defaults = getProvisioningDefaults(input);

  // Clean up zombie tenant from a previous failed attempt (stuck in 'provisioning')
  const [existing] = await db.select().from(tenants).where(eq(tenants.slug, input.slug)).limit(1);
  if (existing) {
    if (existing.status === 'provisioning') {
      // Safe to delete — was never fully provisioned
      await db.delete(tenants).where(eq(tenants.id, existing.id));
    } else {
      throw new Error(`Ein Tenant mit dem Slug "${input.slug}" existiert bereits.`);
    }
  }

  // 1. Create tenant
  const deploymentMode = input.deploymentMode || 'shared';
  const [tenant] = await db.insert(tenants).values({
    name: input.name,
    slug: input.slug,
    industry: input.industry,
    activeStyle: 'classic',
    status: 'provisioning',
    deploymentMode,
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
      primaryColor: input.primaryColor || defaults.brand.primaryColor,
      secondaryColor: input.secondaryColor || defaults.brand.secondaryColor,
      accentColor: input.accentColor || defaults.brand.accentColor,
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
    items: defaults.navigationItems,
    cta: defaults.navigationCta,
  });

  // 5. Default footer
  await db.insert(footer).values({
    tenantId,
    columns: defaults.footerColumns,
    legalLinks: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
    cta: defaults.footerCta,
  });

  // 6. Default pages + sections
  for (const pageDefinition of defaults.pages) {
    const [page] = await db.insert(pages).values({
      tenantId,
      title: pageDefinition.title,
      slug: pageDefinition.slug,
      type: 'free',
      status: 'published',
      visible: true,
      sortOrder: pageDefinition.sortOrder,
    }).returning();

    await db.insert(pageSections).values(pageDefinition.sections.map((section, index) => ({
      tenantId,
      pageId: page.id,
      type: section.type,
      sortOrder: section.sortOrder ?? index,
      visible: true,
      data: section.data,
      container: section.container,
      spacingTop: section.spacingTop,
      spacingBottom: section.spacingBottom,
      anchorId: section.anchorId,
    })));
  }

  // 7. Publish initial snapshot
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

  // 8. Domain provisioning
  let domainConfigured = false;
  let vercelProjectId: string | undefined;
  let standaloneError: string | undefined;

  if (deploymentMode === 'standalone') {
    // Create a dedicated Vercel project for this tenant
    try {
      const standaloneResult = await createStandaloneProject(input.slug, tenantId);
      vercelProjectId = standaloneResult.projectId;
    } catch (err) {
      standaloneError = err instanceof Error ? err.message : 'Unbekannter Fehler';
      console.error('Standalone project creation failed:', standaloneError);
    }

    // Store the Vercel test domain as preview
    const vercelDomain = vercelProjectId
      ? `flamingo-${input.slug}.vercel.app`
      : undefined;

    if (vercelDomain) {
      await db.insert(tenantDomains).values({
        tenantId,
        domain: vercelDomain,
        type: 'preview',
        verified: true,
      });
      domainConfigured = true;

      // Deployment is now triggered inside createStandaloneProject after all env vars are set
      console.log(`  ✅ Standalone project: flamingo-${input.slug}`);
    }

    // Optional: add custom domain if provided
    if (input.domain && vercelProjectId) {
      await db.insert(tenantDomains).values({
        tenantId,
        domain: input.domain,
        type: 'primary',
        verified: false,
      });
      try {
        const customResult = await addDomainToProject(vercelProjectId, input.domain);
        if (customResult.verified) {
          await db.update(tenantDomains)
            .set({ verified: true })
            .where(eq(tenantDomains.domain, input.domain));
        }
      } catch (err) {
        console.error('Custom domain provisioning failed:', err);
      }
    }
  } else {
    // Shared mode: use shared renderer with slug-based routing
    // Only add custom domain if explicitly provided
    if (input.domain) {
      await db.insert(tenantDomains).values({
        tenantId,
        domain: input.domain,
        type: 'primary',
        verified: false,
      });

      try {
        const result = await addDomainToRenderer(input.domain);
        if (result.verified) {
          await db.update(tenantDomains)
            .set({ verified: true })
            .where(eq(tenantDomains.domain, input.domain));
        }
        domainConfigured = result.configured;
      } catch (err) {
        console.error('Custom domain provisioning failed:', err);
      }
    }
    domainConfigured = true;
  }

  // 9. Activate tenant
  const updateData: Record<string, unknown> = { status: 'active', updatedAt: new Date() };
  if (vercelProjectId) updateData.vercelProjectId = vercelProjectId;

  await db.update(tenants)
    .set(updateData as any)
    .where(eq(tenants.id, tenantId));

  const standaloneUrl = vercelProjectId ? `https://flamingo-${input.slug}.vercel.app` : undefined;

  const rendererBaseUrl = process.env.RENDERER_URL || 'https://flamingo-renderer.vercel.app';
  const sharedUrl = input.domain ? `https://${input.domain}` : `${rendererBaseUrl}/${input.slug}`;

  return {
    tenantId,
    slug: input.slug,
    domain: input.domain,
    domainConfigured,
    adminUrl: standaloneUrl ? `${standaloneUrl}/admin` : `${rendererBaseUrl}/${input.slug}/admin`,
    rendererUrl: standaloneUrl || sharedUrl,
    warning: standaloneError ? `Standalone-Projekt Fehler: ${standaloneError}` : undefined,
  };
}

function getProvisioningDefaults(input: ProvisionInput): ProvisioningDefaults {
  if (input.industry === 'medical') return getMedicalProvisioningDefaults(input);
  if (input.industry === 'salon') return getSalonProvisioningDefaults(input);
  if (input.industry === 'tourism') return getTourismProvisioningDefaults(input);
  if (input.industry === 'hotel') return getHotelProvisioningDefaults(input);
  if (input.industry === 'restaurant') return getRestaurantProvisioningDefaults(input);
  return getGenericProvisioningDefaults(input);
}

function getGenericProvisioningDefaults(input: ProvisionInput): ProvisioningDefaults {
  const contactItems = [
    ...(input.phone ? [{ text: input.phone, href: `tel:${input.phone.replace(/[^+\d]/g, '')}` }] : []),
    ...(input.email ? [{ text: input.email, href: `mailto:${input.email}` }] : []),
    ...(input.address ? [{ text: input.address }] : []),
  ];

  return {
    brand: { primaryColor: '#1a5276', secondaryColor: '#2e86c1', accentColor: '#f39c12' },
    navigationItems: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Kontakt', href: '/kontakt', type: 'link' },
    ],
    navigationCta: { label: 'Kontakt', href: '/kontakt' },
    footerColumns: [{ title: 'Kontakt', items: contactItems }],
    footerCta: { label: 'Kontakt aufnehmen', href: '/kontakt' },
    pages: [
      {
        title: 'Startseite',
        slug: 'startseite',
        sortOrder: 0,
        sections: [{
          type: 'hero',
          data: {
            headline: `Willkommen bei ${input.companyName}`,
            subline: input.tagline || 'Wir freuen uns auf Sie.',
            primaryCta: { label: 'Kontakt', href: '/kontakt' },
          },
        }],
      },
      {
        title: 'Kontakt',
        slug: 'kontakt',
        sortOrder: 1,
        sections: [{
          type: 'contact',
          data: {
            headline: 'Kontakt aufnehmen',
            formEnabled: true,
          },
        }],
      },
    ] satisfies DefaultPage[],
  };
}


function getMinimalPages(company: string, tagline: string | undefined, ctaHref: string, ctaLabel: string): DefaultPage[] {
  return [
    {
      title: 'Startseite',
      slug: 'startseite',
      sortOrder: 0,
      sections: [{
        type: 'hero',
        data: {
          headline: company,
          subline: tagline || '',
          primaryCta: { label: ctaLabel, href: ctaHref },
        },
      }],
    },
    {
      title: 'Kontakt',
      slug: 'kontakt',
      sortOrder: 1,
      sections: [{
        type: 'contact',
        data: {
          headline: 'Kontakt aufnehmen',
          formEnabled: true,
        },
      }],
    },
  ] satisfies DefaultPage[];
}

function getMedicalProvisioningDefaults(input: ProvisionInput): ProvisioningDefaults {
  const contactItems = [
    ...(input.phone ? [{ text: input.phone, href: `tel:${input.phone.replace(/[^+\d]/g, '')}` }] : []),
    ...(input.email ? [{ text: input.email, href: `mailto:${input.email}` }] : []),
    ...(input.address ? [{ text: input.address }] : []),
  ];
  return {
    brand: { primaryColor: '#0f4c5c', secondaryColor: '#66a6ad', accentColor: '#2f80ed' },
    navigationItems: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Kontakt', href: '/kontakt', type: 'link' },
    ],
    navigationCta: { label: 'Termin buchen', href: '/kontakt' },
    footerColumns: [{ title: 'Kontakt', items: contactItems }],
    footerCta: { label: 'Termin buchen', href: '/kontakt' },
    pages: getMinimalPages(input.companyName, input.tagline, '/kontakt', 'Termin buchen'),
  };
}

function getSalonProvisioningDefaults(input: ProvisionInput): ProvisioningDefaults {
  const contactItems = [
    ...(input.phone ? [{ text: input.phone, href: `tel:${input.phone.replace(/[^+\d]/g, '')}` }] : []),
    ...(input.email ? [{ text: input.email, href: `mailto:${input.email}` }] : []),
    ...(input.address ? [{ text: input.address }] : []),
  ];
  return {
    brand: { primaryColor: '#7a2c55', secondaryColor: '#e7a5c4', accentColor: '#c2185b' },
    navigationItems: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Kontakt', href: '/kontakt', type: 'link' },
    ],
    navigationCta: { label: 'Termin buchen', href: '/kontakt' },
    footerColumns: [{ title: 'Kontakt', items: contactItems }],
    footerCta: { label: 'Termin buchen', href: '/kontakt' },
    pages: getMinimalPages(input.companyName, input.tagline, '/kontakt', 'Termin buchen'),
  };
}

function getTourismProvisioningDefaults(input: ProvisionInput): ProvisioningDefaults {
  const contactItems = [
    ...(input.phone ? [{ text: input.phone, href: `tel:${input.phone.replace(/[^+\d]/g, '')}` }] : []),
    ...(input.email ? [{ text: input.email, href: `mailto:${input.email}` }] : []),
    ...(input.address ? [{ text: input.address }] : []),
  ];
  return {
    brand: { primaryColor: '#1b5e20', secondaryColor: '#81c784', accentColor: '#ff8f00' },
    navigationItems: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Kontakt', href: '/kontakt', type: 'link' },
    ],
    navigationCta: { label: 'Anfragen', href: '/kontakt' },
    footerColumns: [{ title: 'Kontakt', items: contactItems }],
    footerCta: { label: 'Anfragen', href: '/kontakt' },
    pages: getMinimalPages(input.companyName, input.tagline, '/kontakt', 'Anfragen'),
  };
}

function getHotelProvisioningDefaults(input: ProvisionInput): ProvisioningDefaults {
  const contactItems = [
    ...(input.phone ? [{ text: input.phone, href: `tel:${input.phone.replace(/[^+\d]/g, '')}` }] : []),
    ...(input.email ? [{ text: input.email, href: `mailto:${input.email}` }] : []),
    ...(input.address ? [{ text: input.address }] : []),
  ];
  return {
    brand: { primaryColor: '#1a3550', secondaryColor: '#8fb8d0', accentColor: '#c9a96e' },
    navigationItems: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Kontakt', href: '/kontakt', type: 'link' },
    ],
    navigationCta: { label: 'Buchen', href: '/kontakt' },
    footerColumns: [{ title: 'Kontakt', items: contactItems }],
    footerCta: { label: 'Buchen', href: '/kontakt' },
    pages: getMinimalPages(input.companyName, input.tagline, '/kontakt', 'Buchen'),
  };
}

function getRestaurantProvisioningDefaults(input: ProvisionInput): ProvisioningDefaults {
  const contactItems = [
    ...(input.phone ? [{ text: input.phone, href: `tel:${input.phone.replace(/[^+\d]/g, '')}` }] : []),
    ...(input.email ? [{ text: input.email, href: `mailto:${input.email}` }] : []),
    ...(input.address ? [{ text: input.address }] : []),
  ];
  return {
    brand: { primaryColor: '#2c1810', secondaryColor: '#8b5c3e', accentColor: '#d4a574' },
    navigationItems: [
      { label: 'Startseite', href: '/', type: 'link' },
      { label: 'Kontakt', href: '/kontakt', type: 'link' },
    ],
    navigationCta: { label: 'Reservieren', href: '/kontakt' },
    footerColumns: [{ title: 'Kontakt', items: contactItems }],
    footerCta: { label: 'Reservieren', href: '/kontakt' },
    pages: getMinimalPages(input.companyName, input.tagline, '/kontakt', 'Reservieren'),
  };
}
