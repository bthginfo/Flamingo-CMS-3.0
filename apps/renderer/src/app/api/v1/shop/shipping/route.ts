import { withApiHandler } from '@/lib/api-utils';
import { readApiJsonObject } from '@/lib/api-request-body';
import { validateShippingInput } from '@/lib/shop-api-input';
import { randomUUID } from 'node:crypto';
import type { BatchItem } from 'drizzle-orm/batch';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { shippingZones, shippingMethods } from '@flamingo/db';
import { eq, and } from 'drizzle-orm';

export const GET = withApiHandler(async (req, auth) => {
  if (!auth.addons.includes('shop')) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const db = getDb();
  const zones = await db.select().from(shippingZones).where(eq(shippingZones.tenantId, auth.tenantId));
  const methods = await db.select().from(shippingMethods).where(eq(shippingMethods.tenantId, auth.tenantId));

  return NextResponse.json({
    zones: zones.map(z => ({ ...z, methods: methods.filter(m => m.zoneId === z.id) })),
  });
});

export const POST = withApiHandler(async (req, auth) => {
  if (!auth.addons.includes('shop')) return NextResponse.json({ error: 'Shop addon not active' }, { status: 403 });

  const body = await readApiJsonObject(req);
  validateShippingInput(body);
  const { name, countries, methods: zoneMethods } = body;
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });

  const db = getDb();
  const zone = {
    id: randomUUID(),
    tenantId: auth.tenantId,
    name,
    countries: countries || [],
  };
  const writes: [BatchItem<'pg'>, ...BatchItem<'pg'>[]] = [db.insert(shippingZones).values(zone).returning()];

  // Create methods for the zone
  if (Array.isArray(zoneMethods) && zoneMethods.length > 0) {
    writes.push(db.insert(shippingMethods).values(zoneMethods.map((m: Record<string, any>) => ({
        tenantId: auth.tenantId,
        zoneId: zone.id,
        name: m.name || 'Standard',
        priceCents: m.priceCents ?? 0,
        freeAboveCents: m.freeAboveCents ?? null,
        estimatedDays: m.estimatedDays ?? null,
        active: true,
      }))));
  }
  const [zones] = await db.batch(writes);
  return NextResponse.json({ zone: (zones as typeof zone[])[0] }, { status: 201 });
});
