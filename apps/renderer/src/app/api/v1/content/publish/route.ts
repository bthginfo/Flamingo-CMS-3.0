import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { publishedSnapshots, pages, pageSections, tenants, globalSettings, navigation, footer } from '@flamingo/db';
import { eq, asc } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, auth.tenantId));
  const [settings] = await db.select().from(globalSettings).where(eq(globalSettings.tenantId, auth.tenantId));
  const [nav] = await db.select().from(navigation).where(eq(navigation.tenantId, auth.tenantId));
  const [foot] = await db.select().from(footer).where(eq(footer.tenantId, auth.tenantId));
  const allPages = await db.select().from(pages).where(eq(pages.tenantId, auth.tenantId));
  const allSections = await db.select().from(pageSections).where(eq(pageSections.tenantId, auth.tenantId)).orderBy(asc(pageSections.sortOrder));

  const snapshotData = {
    tenant: {
      name: tenant.name,
      industry: tenant.industry,
      activeStyle: tenant.activeStyle,
      brand: settings?.brand || {},
      contact: settings?.contact || {},
      socialLinks: settings?.socialLinks || {},
      navItems: nav?.items || [],
      navCta: nav?.cta || {},
      footerColumns: foot?.columns || [],
      footerLegalLinks: foot?.legalLinks || [],
      footerCta: foot?.cta || {},
    },
    pages: allPages.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      sections: allSections.filter(s => s.pageId === p.id).map(s => ({ id: s.id, type: s.type, data: s.data, variant: s.variant, visible: s.visible, container: s.container, spacingTop: s.spacingTop, spacingBottom: s.spacingBottom, anchorId: s.anchorId })),
    })),
  };

  await db.insert(publishedSnapshots).values({
    id: crypto.randomUUID(),
    tenantId: auth.tenantId,
    version: Date.now(),
    snapshot: snapshotData,
    checksum: crypto.createHash('md5').update(JSON.stringify(snapshotData)).digest('hex'),
    createdBy: 'api',
    isActive: true,
  });

  return NextResponse.json({ success: true, message: 'Published successfully' });
}
