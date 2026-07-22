import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getWritableSession } from '@/lib/session';
import { globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { protectStoredSecret } from '@/lib/secret-storage';
import { getPlatformSmtp } from '@/lib/smtp';
import {
  isTrustedRendererContactOrigin,
  readBoundedRendererContactJson,
  RendererContactBodyInvalidError,
  RendererContactBodyTooLargeError,
} from '@/lib/renderer-contact-security';

type StoredSmtp = { host?: string; port?: number; user?: string; pass?: string; from?: string };
const SMTP_SETTINGS_MAX_BYTES = 16 * 1024;

async function requireTenant() {
  const session = await getWritableSession();
  if (!session) throw new Error('Unauthorized');
  return session.tenantId;
}

export async function GET() {
  try {
    const tenantId = await requireTenant();
    const db = getDb();
    const [[settings], platformSmtp] = await Promise.all([
      db.select({ smtp: globalSettings.smtp }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1),
      getPlatformSmtp().catch(() => null),
    ]);
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
      platformSmtpReady: Boolean(platformSmtp),
      platformSmtpFrom: platformSmtp?.from || null,
    }, { headers: { 'Cache-Control': 'no-store' } });
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
    if (req.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json') {
      return NextResponse.json({ error: 'Content-Type wird nicht unterstützt.' }, { status: 415 });
    }
    if (!isTrustedRendererContactOrigin(req)) {
      return NextResponse.json({ error: 'Ungültiger Request-Ursprung.' }, { status: 403 });
    }
    const body = await readBoundedRendererContactJson(req, SMTP_SETTINGS_MAX_BYTES) as Record<string, unknown>;
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
  } catch (error) {
    if (error instanceof RendererContactBodyTooLargeError) return NextResponse.json({ error: 'Die Anfrage ist zu groß.' }, { status: 413 });
    if (error instanceof RendererContactBodyInvalidError) return NextResponse.json({ error: 'Ungültige Eingabe.' }, { status: 400 });
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 });
  }
}
