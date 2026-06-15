export const DEFAULT_BOOKING_TIMEZONE = 'Europe/Berlin';

export function normalizeTimezone(value?: string | null) {
  const timezone = value?.trim() || DEFAULT_BOOKING_TIMEZONE;
  try {
    new Intl.DateTimeFormat('de-DE', { timeZone: timezone }).format(new Date());
    return timezone;
  } catch {
    return DEFAULT_BOOKING_TIMEZONE;
  }
}

export function zonedDateTimeToUtc(date: string, time: string, timezone: string) {
  return localPartsToUtc(date, time, normalizeTimezone(timezone));
}

export function zonedDayStartToUtc(date: string, timezone: string) {
  return localPartsToUtc(date, '00:00', normalizeTimezone(timezone));
}

export function zonedDayEndToUtc(date: string, timezone: string) {
  return localPartsToUtc(date, '23:59:59.999', normalizeTimezone(timezone));
}

export function getZonedWeekday(date: Date, timezone: string) {
  const parts = zonedParts(date, timezone);
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay();
}

export function getZonedTime(date: Date, timezone: string) {
  const parts = zonedParts(date, timezone);
  return `${pad(parts.hour)}:${pad(parts.minute)}`;
}

export function formatBookingDate(date: Date, timezone?: string | null) {
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: normalizeTimezone(timezone),
  }).format(date);
}

export function getTouchedZonedWeekdays(startsAt: Date, endsAt: Date, timezone: string) {
  const days = new Set<number>();
  const cursorParts = zonedParts(startsAt, timezone);
  let cursor = zonedDayStartToUtc(`${cursorParts.year}-${pad(cursorParts.month)}-${pad(cursorParts.day)}`, timezone);
  const inclusiveEnd = new Date(Math.max(startsAt.getTime(), endsAt.getTime() - 1));
  while (cursor.getTime() <= inclusiveEnd.getTime()) {
    days.add(getZonedWeekday(cursor, timezone));
    cursor = new Date(cursor.getTime() + 26 * 60 * 60 * 1000);
    const parts = zonedParts(cursor, timezone);
    cursor = zonedDayStartToUtc(`${parts.year}-${pad(parts.month)}-${pad(parts.day)}`, timezone);
  }
  return [...days];
}

function localPartsToUtc(date: string, time: string, timezone: string) {
  const [year, month, day] = date.split('-').map(Number);
  const [hour = 0, minute = 0, secondRaw = 0] = time.split(':').map(Number);
  const second = Math.floor(secondRaw);
  const millisecond = time.includes('.') ? Number(`0.${time.split('.')[1]}`) * 1000 : 0;
  let utc = new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond));
  for (let i = 0; i < 3; i += 1) {
    const parts = zonedParts(utc, timezone);
    const currentAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);
    utc = new Date(utc.getTime() + targetAsUtc - currentAsUtc);
  }
  return utc;
}

function zonedParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: normalizeTimezone(timezone),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find(part => part.type === type)?.value || 0);
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
  };
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}
