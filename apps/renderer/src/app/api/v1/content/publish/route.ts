import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { publishedSnapshots, pages, tenants } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();

  // Get tenant + pages
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, auth.tenantId));
  const allPages = await db.select().from(pages).where(eq(pages.tenantId, auth.tenantId));

  // Build snapshot data
  const snapshotData = {
    tenant: {
      name: tenant.name,
      industry: tenant.industry,
      activeStyle: tenant.activeStyle,
      brand: tenant.brand,
      contact: tenant.contact,
      socialLinks: tenant.socialLinks,
      navItems: tenant.navItems,
      navCta: tenant.navCta,
      footerColumns: tenant.footerColumns,
      footerLegalLinks: tenant.footerLegalLinks,
      footerCta: tenant.footerCta,
    },
    pages: allPages.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      sections: p.sections,
    })),
  };

  await db.insert(publishedSnapshots).values({
    id: crypto.randomUUID(),
    tenantId: auth.tenantId,
    data: snapshotData,
    publishedBy: 'api',
  });

  return NextResponse.json({ success: true, message: 'Published successfully' });
}
