import assert from 'node:assert/strict';
import test from 'node:test';
import { buildIcsCalendar, normalizeCalendarFilename } from './calendar-export';

test('exports timed events with timezone, default duration and escaped location', () => {
  const calendar = buildIcsCalendar([{
    title: 'Kreuzantrittskneipe',
    text: '<p>Traditioneller Auftakt in das neue Semester.</p>',
    startDate: '2026-04-11',
    startTime: '20:00',
    locationLabel: 'In der Meielache 42, Mainz',
  }], { calendarName: 'Semesterprogramm', timezone: 'Europe/Berlin', now: new Date('2026-01-01T00:00:00Z') });

  assert.match(calendar, /DTSTART;TZID=Europe\/Berlin:20260411T200000/);
  assert.match(calendar, /DTEND;TZID=Europe\/Berlin:20260411T220000/);
  assert.match(calendar, /BEGIN:VTIMEZONE\r\nTZID:Europe\/Berlin/);
  assert.match(calendar, /LOCATION:In der Meielache 42\\, Mainz/);
  assert.match(calendar, /DESCRIPTION:Traditioneller Auftakt in das neue Semester\./);
  assert.ok(calendar.endsWith('\r\n'));
});

test('exports UTC times without a TZID parameter', () => {
  const calendar = buildIcsCalendar([{
    title: 'Online-Termin', startDate: '2026-04-11', startTime: '18:30', endTime: '19:15',
  }], { timezone: 'UTC', now: new Date('2026-01-01T00:00:00Z') });
  assert.match(calendar, /DTSTART:20260411T183000Z/);
  assert.match(calendar, /DTEND:20260411T191500Z/);
  assert.doesNotMatch(calendar, /BEGIN:VTIMEZONE/);
});

test('exports inclusive all-day ranges using an exclusive ICS end date', () => {
  const calendar = buildIcsCalendar([{
    title: '153. Stiftungsfest', startDate: '2026-05-08', endDate: '2026-05-10', allDay: true,
  }], { now: new Date('2026-01-01T00:00:00Z') });
  assert.match(calendar, /DTSTART;VALUE=DATE:20260508/);
  assert.match(calendar, /DTEND;VALUE=DATE:20260511/);
});

test('omits events without a valid structured start date', () => {
  const calendar = buildIcsCalendar([
    { title: 'Nur sichtbares Datum', startDate: '11. April 2026' },
    { title: 'Valider Termin', startDate: '2026-04-11', allDay: true },
  ], { now: new Date('2026-01-01T00:00:00Z') });
  assert.doesNotMatch(calendar, /Nur sichtbares Datum/);
  assert.match(calendar, /Valider Termin/);
});

test('normalizes safe ICS filenames', () => {
  assert.equal(normalizeCalendarFilename('Semesterprogramm 2026'), 'Semesterprogramm-2026.ics');
  assert.equal(normalizeCalendarFilename('termine?.ics'), 'termine.ics');
});
