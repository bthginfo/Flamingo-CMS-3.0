import { NextRequest, NextResponse } from 'next/server';
import { validatePat } from '@/lib/pat-auth';
import { getDb } from '@/lib/db';
import { shippingZones, shippingMethods, tenantAddons } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

async function checkShop(tenantId: string) {
  const db = getDb();
  const [addon] = await db.select({ active: tenantAddons.active }).from(tenantAddons)
    .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.addonKey, 'shop')));
  return addon?.active === true;
}

export async function GET(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await checkShop(auth.tenantId))) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const db = getDb();
  const zones = await db.select().from(shippingZones).where(eq(shippingZones.tenantId, auth.tenantId));
  const methods = await db.select().from(shippingMethods).where(eq(shippingMethods.tenantId, auth.tenantId));

  return NextResponse.json({
    zones: zones.map(z => ({ ...z, methods: methods.filter(m => m.zoneId === z.id) })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await validatePat(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await checkShop(auth.tenantId))) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const body = await req.json();
  const { name, countries, methods: zoneMethods } = body;
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });

  const db = getDb();
  const [zone] = await db.insert(shippingZones).values({
    tenantId: auth.tenantId,
    name,
    countries: countries || [],
  }).returning();

  // Create methods for the zone
  if (Array.isArray(zoneMethods) && zoneMethods.length > 0) {
    for (const m of zoneMethods) {
      await db.insert(shippingMethods).values({
        tenantId: auth.tenantId,
        zoneId: zone.id,
        name: m.name || 'Standard',
        priceCents: m.priceCents ?? 0,
        freeAboveCents: m.freeAboveCents ?? null,
        estimatedDays: m.estimatedDays ?? null,
        active: true,
      });
    }
  }

  return NextResponse.json({ zone }, { status: 201 });
}
