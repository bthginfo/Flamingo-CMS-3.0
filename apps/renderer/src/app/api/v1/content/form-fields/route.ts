import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';
import { normalizeContactFormFields, validateContactFormFields } from '@/lib/contact-form';

export const GET = withApiHandler(async (_req, auth) => {
  const db = getDb();
  const [row] = await db.select({ formFields: globalSettings.formFields }).from(globalSettings).where(eq(globalSettings.tenantId, auth.tenantId));
  return NextResponse.json({ fields: normalizeContactFormFields(row?.formFields) });
});

export const PUT = withApiHandler(async (req, auth) => {
  const body = await req.json();
  const db = getDb();

  const fields = Array.isArray(body) ? body : body?.fields;
  const validated = validateContactFormFields(fields);
  if (!validated.success) {
    return NextResponse.json({ error: validated.errors[0], errors: validated.errors }, { status: 400 });
  }

  const [existing] = await db.select({ id: globalSettings.id }).from(globalSettings).where(eq(globalSettings.tenantId, auth.tenantId));
  if (existing) {
    await db.update(globalSettings).set({ formFields: validated.fields, updatedAt: new Date() }).where(eq(globalSettings.tenantId, auth.tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId: auth.tenantId, formFields: validated.fields });
  }

  return NextResponse.json({ success: true });
});
