import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getWritableSession } from '@/lib/session';
import { globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { protectStoredSecret } from '@/lib/secret-storage';

type StoredSmtp = { host?: string; port?: number; user?: string; pass?: string; from?: string };

async function requireTenant() {
  const session = await getWritableSession();
  if (!session) throw new Error('Unauthorized');
  return session.tenantId;
}

export async function GET() {
  try {
    const tenantId = await requireTenant();
    const db = getDb();
    const [settings] = await db.select({ smtp: globalSettings.smtp }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
    const smtp = settings?.smtp as StoredSmtp | null;
    return NextResponse.json({
      smtp: smtp ? {
        host: smtp.host || '',
        port: smtp.port || 587,
        user: smtp.user || '',
        pass: '',
        from: smtp.from || '',
      } : null,
      hasPassword: Boolean(smtp?.pass),
    });
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

    const db = getDb();
    const [current] = await db.select({ smtp: globalSettings.smtp }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
    const existing = current?.smtp as StoredSmtp | null;

    // Empty password keeps the existing write-only value. Clearing every
    // visible field intentionally disables tenant SMTP.
    const hasVisibleConfig = Boolean(host || user || from);
    const storedPass = pass
      ? protectStoredSecret(pass)
      : hasVisibleConfig
        ? protectStoredSecret(existing?.pass || null)
        : null;
    if (hasVisibleConfig && (!host || !user || !from || !storedPass)) {
      return NextResponse.json({ error: 'Host, Benutzername und Absender sind Pflichtfelder.' }, { status: 400 });
    }

    const smtp = hasVisibleConfig && storedPass ? { host, port, user, pass: storedPass, from } : null;
    await db.update(globalSettings).set({ smtp, updatedAt: new Date() }).where(eq(globalSettings.tenantId, tenantId));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 });
  }
}
