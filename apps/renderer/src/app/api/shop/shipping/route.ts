import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { shippingZones, shippingMethods } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';
import { resolveTenant } from '@/lib/snapshot';

export async function GET(req: NextRequest) {
  const tenantId = await resolveTenant();
  if (!tenantId) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  const country = req.nextUrl.searchParams.get('country') || 'DE';
  const db = getDb();

  const zones = await db.select().from(shippingZones)
    .where(eq(shippingZones.tenantId, tenantId));

  // Find zones matching the country
  const matchingZones = zones.filter(z => {
    const countries = z.countries as string[] | null;
    return !countries || countries.length === 0 || countries.includes(country.toUpperCase());
  });

  if (matchingZones.length === 0) {
    return NextResponse.json({ methods: [] });
  }

  const zoneIds = matchingZones.map(z => z.id);
  const methods = await db.select().from(shippingMethods)
    .where(and(eq(shippingMethods.tenantId, tenantId), eq(shippingMethods.active, true)));

  const filtered = methods.filter(m => zoneIds.includes(m.zoneId));

  return NextResponse.json({
    methods: filtered.map(m => ({
      id: m.id,
      name: m.name,
      priceCents: m.priceCents,
      freeAboveCents: m.freeAboveCents,
      estimatedDays: m.estimatedDays,
    })),
  });
}
