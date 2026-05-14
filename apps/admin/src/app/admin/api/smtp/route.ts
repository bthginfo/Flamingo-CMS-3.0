import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';

async function requireTenant() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session.tenantId;
}

export async function GET() {
  try {
    const tenantId = await requireTenant();
    const db = getDb();
    const [settings] = await db.select({ smtp: globalSettings.smtp }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
    return NextResponse.json({ smtp: settings?.smtp ?? null });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = await requireTenant();
    const body = await req.json();
    const { host, port, user, pass, from } = body;
    const db = getDb();
    await db.update(globalSettings).set({ smtp: { host, port: Number(port) || 587, user, pass, from }, updatedAt: new Date() }).where(eq(globalSettings.tenantId, tenantId));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
