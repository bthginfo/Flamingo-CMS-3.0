import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { shippingZones, shippingMethods, shopSettings } from '@flamingo/db';
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

  // Also return available payment methods
  const [settings] = await db.select().from(shopSettings)
    .where(eq(shopSettings.tenantId, tenantId)).limit(1);

  const paymentMethods: string[] = settings?.paymentMethods as string[] || ['prepayment'];
  // Only include methods that have keys configured
  const availablePayments = paymentMethods.filter(m => {
    if (m === 'stripe') return !!settings?.stripeSecretKey;
    if (m === 'paypal') return !!settings?.paypalClientId && !!settings?.paypalSecret;
    if (m === 'pickup') return settings?.pickupEnabled;
    return true; // prepayment always available if listed
  });

  return NextResponse.json({
    methods: filtered.map(m => ({
      id: m.id,
      name: m.name,
      priceCents: m.priceCents,
      freeAboveCents: m.freeAboveCents,
      estimatedDays: m.estimatedDays,
    })),
    paymentMethods: availablePayments,
  });
}
