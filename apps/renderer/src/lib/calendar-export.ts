export type CalendarExportEvent = {
  title?: string;
  text?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  allDay?: boolean;
  locationLabel?: string;
  category?: string;
};

export type CalendarExportOptions = {
  calendarName?: string;
  timezone?: string;
  now?: Date;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_TIME = /^\d{2}:\d{2}$/;

export function buildIcsCalendar(events: CalendarExportEvent[], options: CalendarExportOptions = {}): string {
  const timezone = normalizeTimezone(options.timezone);
  const calendarName = options.calendarName?.trim() || 'Veranstaltungen';
  const stamp = formatUtc(options.now || new Date());
  const exportableEvents = events.filter(event => event.title?.trim() && isIsoDate(event.startDate));
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Flamingo CMS//Kalenderexport//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
    `X-WR-TIMEZONE:${timezone}`,
  ];

  lines.push(...timezoneDefinition(timezone));

  exportableEvents.forEach((event, index) => {
    const startDate = event.startDate as string;
    const isAllDay = event.allDay === true || !isIsoTime(event.startTime);
    const descriptionParts = [htmlToPlainText(event.text || ''), event.category?.trim()].filter(Boolean);

    lines.push('BEGIN:VEVENT', `UID:${eventUid(event, index)}`, `DTSTAMP:${stamp}`);
    if (isAllDay) {
      const inclusiveEnd = isIsoDate(event.endDate) ? event.endDate : startDate;
      lines.push(`DTSTART;VALUE=DATE:${compactDate(startDate)}`);
      lines.push(`DTEND;VALUE=DATE:${compactDate(addDays(inclusiveEnd, 1))}`);
    } else {
      const startTime = event.startTime as string;
      const end = resolveTimedEnd(startDate, startTime, event.endDate, event.endTime);
      if (timezone === 'UTC') {
        lines.push(`DTSTART:${compactLocalDateTime(startDate, startTime)}Z`);
        lines.push(`DTEND:${compactLocalDateTime(end.date, end.time)}Z`);
      } else {
        lines.push(`DTSTART;TZID=${timezone}:${compactLocalDateTime(startDate, startTime)}`);
        lines.push(`DTEND;TZID=${timezone}:${compactLocalDateTime(end.date, end.time)}`);
      }
    }

    lines.push(`SUMMARY:${escapeIcsText(event.title || '')}`);
    if (descriptionParts.length) lines.push(`DESCRIPTION:${escapeIcsText(descriptionParts.join('\n\n'))}`);
    if (event.locationLabel?.trim()) lines.push(`LOCATION:${escapeIcsText(event.locationLabel)}`);
    lines.push('STATUS:CONFIRMED', 'TRANSP:OPAQUE', 'END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return `${lines.map(foldIcsLine).join('\r\n')}\r\n`;
}

export function isCalendarDate(value?: string): value is string {
  return isIsoDate(value);
}

export function normalizeCalendarFilename(value?: string): string {
  const raw = (value || 'veranstaltungen.ics').trim();
  const withoutExtension = raw.toLowerCase().endsWith('.ics') ? raw.slice(0, -4) : raw;
  const stem = withoutExtension
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'veranstaltungen';
  return `${stem}.ics`;
}

function normalizeTimezone(value?: string): string {
  const timezone = value?.trim() || 'Europe/Berlin';
  return /^[A-Za-z0-9_+\-/]+$/.test(timezone) ? timezone : 'Europe/Berlin';
}

function timezoneDefinition(timezone: string): string[] {
  if (!['Europe/Berlin', 'Europe/Vienna', 'Europe/Zurich'].includes(timezone)) return [];
  return [
    'BEGIN:VTIMEZONE',
    `TZID:${timezone}`,
    `X-LIC-LOCATION:${timezone}`,
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0200',
    'TZNAME:CEST',
    'DTSTART:19700329T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0100',
    'TZNAME:CET',
    'DTSTART:19701025T030000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
  ];
}

function isIsoDate(value?: string): value is string {
  if (!value || !ISO_DATE.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function isIsoTime(value?: string): value is string {
  if (!value || !ISO_TIME.test(value)) return false;
  const [hour, minute] = value.split(':').map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

function compactDate(value: string): string {
  return value.replaceAll('-', '');
}

function compactLocalDateTime(date: string, time: string): string {
  return `${compactDate(date)}T${time.replace(':', '')}00`;
}

function addDays(value: string, days: number): string {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

function resolveTimedEnd(startDate: string, startTime: string, endDate?: string, endTime?: string): { date: string; time: string } {
  if (isIsoDate(endDate) && isIsoTime(endTime)) return { date: endDate, time: endTime };
  if (isIsoTime(endTime)) return { date: startDate, time: endTime };
  const [year, month, day] = startDate.split('-').map(Number);
  const [hour, minute] = startTime.split(':').map(Number);
  const end = new Date(Date.UTC(year, month - 1, day, hour, minute + 120));
  return {
    date: `${end.getUTCFullYear()}-${String(end.getUTCMonth() + 1).padStart(2, '0')}-${String(end.getUTCDate()).padStart(2, '0')}`,
    time: `${String(end.getUTCHours()).padStart(2, '0')}:${String(end.getUTCMinutes()).padStart(2, '0')}`,
  };
}

function formatUtc(value: Date): string {
  return value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function eventUid(event: CalendarExportEvent, index: number): string {
  const source = [event.title, event.startDate, event.startTime, event.locationLabel, index].join('|');
  let hash = 2166136261;
  for (let i = 0; i < source.length; i += 1) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `${(hash >>> 0).toString(16)}-${compactDate(event.startDate || '0000-00-00')}@flamingo-calendar`;
}

function htmlToPlainText(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

function foldIcsLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let current = '';
  for (const character of line) {
    if (encoder.encode(current + character).length > 75) {
      parts.push(current);
      current = ` ${character}`;
    } else {
      current += character;
    }
  }
  if (current) parts.push(current);
  return parts.join('\r\n');
}
