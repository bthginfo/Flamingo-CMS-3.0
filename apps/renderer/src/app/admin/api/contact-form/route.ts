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
    const [settings] = await db
      .select({ formFields: globalSettings.formFields, autoResponse: globalSettings.autoResponse })
      .from(globalSettings)
      .where(eq(globalSettings.tenantId, tenantId))
      .limit(1);
    return NextResponse.json({
      formFields: settings?.formFields ?? null,
      autoResponse: settings?.autoResponse ?? null,
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
    const { formFields, autoResponse } = body;

    // Validate formFields
    if (formFields && !Array.isArray(formFields)) {
      return NextResponse.json({ error: 'Ungültige Formularfelder.' }, { status: 400 });
    }

    const db = getDb();
    await db.update(globalSettings).set({
      formFields: formFields || null,
      autoResponse: autoResponse || null,
      updatedAt: new Date(),
    }).where(eq(globalSettings.tenantId, tenantId));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 });
  }
}
