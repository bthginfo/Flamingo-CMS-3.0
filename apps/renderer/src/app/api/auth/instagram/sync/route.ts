import { NextResponse } from 'next/server';
import { getWritableSession } from '@/lib/session';
import { syncTenant } from '@/lib/instagram/sync';

export const dynamic = 'force-dynamic';

export async function POST() {
  const session = await getWritableSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const result = await syncTenant(session.tenantId);
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  return NextResponse.json(result);
}
