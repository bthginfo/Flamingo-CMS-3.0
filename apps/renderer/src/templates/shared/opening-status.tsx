'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type DayRow = { day: string; hours?: string; closed?: boolean; note?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

const DAY_NAMES = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

/** Parse "09:00 – 18:00" / "09:00-18:00" (also "09:00–13:00, 14:00–18:00"). */
function parseRanges(hours: string): [number, number][] {
  const ranges: [number, number][] = [];
  for (const m of hours.matchAll(/(\d{1,2})[:.](\d{2})\s*[–\-—bis]+\s*(\d{1,2})[:.](\d{2})/g)) {
    ranges.push([Number(m[1]) * 60 + Number(m[2]), Number(m[3]) * 60 + Number(m[4])]);
  }
  return ranges;
}

export function OpeningStatusSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || 'Öffnungszeiten';
  const headline = (data.headline as string) || 'Wann Sie uns erreichen';
  const subline = (data.subline as string) || '';
  const days = (data.days as DayRow[]) || [];
  const address = (data.address as string) || '';
  const phone = (data.phone as string) || '';
  const openLabel = (data.openLabel as string) || 'Jetzt geöffnet';
  const closedLabel = (data.closedLabel as string) || 'Derzeit geschlossen';
  const note = (data.note as string) || '';

  // Client-only clock so SSR and hydration agree (status appears after mount).
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const todayName = now ? DAY_NAMES[now.getDay()] : null;
  const todayRow = todayName ? days.find(d => d.day.toLowerCase().startsWith(todayName.toLowerCase().slice(0, 2))) : undefined;
  let isOpen = false;
  if (now && todayRow && !todayRow.closed && todayRow.hours) {
    const minutes = now.getHours() * 60 + now.getMinutes();
    isOpen = parseRanges(todayRow.hours).some(([from, to]) => minutes >= from && minutes < to);
  }
  if (!days.length) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
      <div>
        <span className="section-badge" data-edit-path="badge">{badge}</span>
        <h2 className="section-headline text-left" data-edit-path="headline">{headline}</h2>
        {subline && <p className="section-subline mx-0 max-w-xl text-left" data-edit-path="subline">{plain(subline)}</p>}
        <div className="mt-6 space-y-3">
          {address && <p className="flex items-start gap-3 text-[color:var(--token-body)]"><MapPin size={18} className="mt-0.5 shrink-0 text-[color:var(--token-icon)]" /><span data-edit-path="address">{address}</span></p>}
          {phone && <p className="flex items-start gap-3 text-[color:var(--token-body)]"><Phone size={18} className="mt-0.5 shrink-0 text-[color:var(--token-icon)]" /><a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="hover:underline" data-edit-path="phone">{phone}</a></p>}
          {note && <p className="text-sm text-[color:var(--token-muted)]" data-edit-path="note">{plain(note)}</p>}
        </div>
      </div>

      <motion.aside initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-xl">
        {now && (
          <div className={`mb-5 inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-bold ${isOpen ? 'bg-[color-mix(in_srgb,var(--token-success)_14%,transparent)] text-[color:var(--token-success)]' : 'bg-[var(--token-badge-bg)] text-[color:var(--token-badge-text)]'}`}>
            <span className={`relative flex h-2.5 w-2.5 ${isOpen ? '' : 'opacity-60'}`}>
              {isOpen && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--token-success)] opacity-60" />}
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isOpen ? 'bg-[var(--token-success)]' : 'bg-[var(--token-danger)]'}`} />
            </span>
            {isOpen ? openLabel : closedLabel}
          </div>
        )}
        <ul className="divide-y divide-[var(--token-card-border)]">
          {days.map((d, i) => {
            const isToday = todayName ? d.day.toLowerCase().startsWith(todayName.toLowerCase().slice(0, 2)) : false;
            return (
              <li key={`${d.day}-${i}`} className={`flex items-baseline justify-between gap-4 py-2.5 text-sm ${isToday ? 'font-bold text-[color:var(--token-card-heading,var(--token-heading))]' : 'text-[color:var(--token-card-body,var(--token-body))]'}`} data-edit-collection="days" data-edit-index={i}>
                <span className="flex items-center gap-2" data-edit-path="day">{isToday && <Clock size={13} className="text-[color:var(--token-icon)]" />}{d.day}</span>
                <span className="tabular-nums" data-edit-path="hours">{d.closed ? 'geschlossen' : (d.hours || '—')}{d.note ? ` · ${d.note}` : ''}</span>
              </li>
            );
          })}
        </ul>
      </motion.aside>
    </div>
  );
}
