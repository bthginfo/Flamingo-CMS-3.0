import { NextRequest, NextResponse } from 'next/server';
import { runDueBillingRecurringSchedules } from '@/app/admin/billing/actions';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    const result = await runDueBillingRecurringSchedules(request.headers.get('authorization'), new Date(), 50);
    return NextResponse.json({ ok: true, ...result, ranAt: new Date().toISOString() });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Recurring billing run failed.' }, { status: 500 });
  }
}
