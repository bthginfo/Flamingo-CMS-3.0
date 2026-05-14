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
  let tenantId: string;
  try {
    tenantId = await requireTenant();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const host = typeof body.host === 'string' ? body.host.trim() : '';
    const port = Number(body.port) || 587;
    const user = typeof body.user === 'string' ? body.user.trim() : '';
    const pass = typeof body.pass === 'string' ? body.pass : '';
    const from = typeof body.from === 'string' ? body.from.trim() : '';

    // Allow saving empty config (= disable SMTP), but validate if partially filled
    const hasAnyField = host || user || pass || from;
    if (hasAnyField && (!host || !user || !from)) {
      return NextResponse.json({ error: 'Host, Benutzername und Absender sind Pflichtfelder.' }, { status: 400 });
    }

    const smtp = hasAnyField ? { host, port, user, pass, from } : null;
    const db = getDb();
    await db.update(globalSettings).set({ smtp, updatedAt: new Date() }).where(eq(globalSettings.tenantId, tenantId));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 });
  }
}
