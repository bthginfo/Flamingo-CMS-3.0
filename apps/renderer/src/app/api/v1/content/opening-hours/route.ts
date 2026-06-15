import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { globalSettings } from '@flamingo/db';
import { eq } from 'drizzle-orm';
import { withApiHandler } from '@/lib/api-utils';

function normalizeOpeningHoursPayload(body: unknown) {
  if (Array.isArray(body)) return body;
  if (!body || typeof body !== 'object') return null;
  const payload = body as Record<string, unknown>;
  if (Array.isArray(payload.hours)) return payload.hours;

  const dayLabels: Array<[string, string]> = [
    ['monday', 'Montag'],
    ['tuesday', 'Dienstag'],
    ['wednesday', 'Mittwoch'],
    ['thursday', 'Donnerstag'],
    ['friday', 'Freitag'],
    ['saturday', 'Samstag'],
    ['sunday', 'Sonntag'],
  ];

  const hours = dayLabels
    .map(([key, label]) => {
      const row = payload[key];
      if (row == null) return null;
      if (typeof row === 'string') return { type: 'regular', day: label, hours: row };
      if (typeof row === 'object') {
        const value = row as Record<string, unknown>;
        const open = typeof value.open === 'string' ? value.open : typeof value.from === 'string' ? value.from : typeof value.start === 'string' ? value.start : '';
        const close = typeof value.close === 'string' ? value.close : typeof value.to === 'string' ? value.to : typeof value.end === 'string' ? value.end : '';
        return {
          type: 'regular',
          day: label,
          hours: value.closed ? '' : [open, close].filter(Boolean).join('-'),
          closed: Boolean(value.closed),
          note: typeof value.note === 'string' ? value.note : '',
        };
      }
      return null;
    })
    .filter(Boolean);

  return hours;
}

export const GET = withApiHandler(async (_req, auth) => {
  const db = getDb();
  const [row] = await db.select({ openingHours: globalSettings.openingHours }).from(globalSettings).where(eq(globalSettings.tenantId, auth.tenantId));
  return NextResponse.json({ hours: row?.openingHours || [] });
});

export const PUT = withApiHandler(async (req, auth) => {
  const body = await req.json();
  const db = getDb();

  const hours = normalizeOpeningHoursPayload(body);
  if (!Array.isArray(hours)) return NextResponse.json({ error: 'hours must be an array' }, { status: 400 });

  const sanitized = hours.map((row) => ({
    type: row?.type === 'special' ? 'special' : 'regular',
    day: typeof row?.day === 'string' ? row.day.trim() : '',
    date: typeof row?.date === 'string' ? row.date.trim() : '',
    hours: typeof row?.hours === 'string' ? row.hours.trim() : '',
    note: typeof row?.note === 'string' ? row.note.trim() : '',
    closed: Boolean(row?.closed),
  })).filter(row => row.type === 'special' ? row.date || row.note : row.day || row.hours || row.note);

  const [existing] = await db.select({ id: globalSettings.id }).from(globalSettings).where(eq(globalSettings.tenantId, auth.tenantId));
  if (existing) {
    await db.update(globalSettings).set({ openingHours: sanitized, updatedAt: new Date() }).where(eq(globalSettings.tenantId, auth.tenantId));
  } else {
    await db.insert(globalSettings).values({ tenantId: auth.tenantId, openingHours: sanitized });
  }

  return NextResponse.json({ success: true });
});
