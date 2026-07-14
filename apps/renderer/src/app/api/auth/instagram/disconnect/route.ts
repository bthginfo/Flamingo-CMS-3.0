import { NextResponse } from 'next/server';
import { getWritableSession } from '@/lib/session';
import { disconnectTenant } from '@/lib/instagram/sync';

export const dynamic = 'force-dynamic';

export async function POST() {
  const session = await getWritableSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await disconnectTenant(session.tenantId);
  return NextResponse.json({ ok: true });
}
