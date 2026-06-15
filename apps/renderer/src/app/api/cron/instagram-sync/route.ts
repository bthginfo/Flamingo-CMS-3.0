import { NextRequest, NextResponse } from 'next/server';
import { syncAll } from '@/lib/instagram/sync';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Vercel Cron entrypoint. Vercel signs cron invocations with a Bearer token
 * derived from CRON_SECRET. We accept either the standard CRON_SECRET or no
 * secret (some plans only allow same-deployment invocations).
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  const result = await syncAll();
  return NextResponse.json({ ok: true, ...result, ranAt: new Date().toISOString() });
}
