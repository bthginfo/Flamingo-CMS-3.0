import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession, getWritableSession } from '@/lib/session';
import { globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { normalizeContactFormFields, validateContactAutoResponse, validateContactFormFields } from '@/lib/contact-form';

async function requireTenant() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session.tenantId;
}

async function requireWritableTenant() {
  const session = await getWritableSession();
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
      formFields: normalizeContactFormFields(settings?.formFields),
      autoResponse: settings?.autoResponse ?? null,
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  let tenantId: string;
  try {
    tenantId = await requireWritableTenant();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { formFields, autoResponse } = body as { formFields?: unknown; autoResponse?: unknown };
    const validatedFields = validateContactFormFields(formFields);
    if (!validatedFields.success) {
      return NextResponse.json({ error: validatedFields.errors[0], errors: validatedFields.errors }, { status: 400 });
    }
    const validatedAutoResponse = validateContactAutoResponse(autoResponse);
    if (!validatedAutoResponse.success) {
      return NextResponse.json({ error: validatedAutoResponse.error }, { status: 400 });
    }

    const db = getDb();
    const [existing] = await db.select({ id: globalSettings.id }).from(globalSettings).where(eq(globalSettings.tenantId, tenantId)).limit(1);
    if (existing) {
      await db.update(globalSettings).set({
        formFields: validatedFields.fields,
        autoResponse: validatedAutoResponse.value,
        updatedAt: new Date(),
      }).where(eq(globalSettings.tenantId, tenantId));
    } else {
      await db.insert(globalSettings).values({
        tenantId,
        formFields: validatedFields.fields,
        autoResponse: validatedAutoResponse.value,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 });
  }
}
