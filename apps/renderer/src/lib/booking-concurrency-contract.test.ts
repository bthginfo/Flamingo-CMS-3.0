import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('instant bookings are protected by an atomic database capacity guard', () => {
  const migration = source('../../../../packages/db/drizzle/0014_booking_overlap_guard.sql');
  const route = source('../app/api/booking/request/route.ts');
  const core = source('./booking-core.ts');

  assert.match(migration, /pg_advisory_xact_lock/);
  assert.match(migration, /overlap_count\s*>=\s*booking_capacity/);
  assert.match(migration, /BEFORE INSERT OR UPDATE/);
  assert.match(migration, /CREATE TRIGGER booking_requests_capacity_guard/);
  assert.match(migration, /ERRCODE = '23P01'/);
  assert.match(route, /isBookingOverlapError\(error\)/);
  assert.match(core, /candidate\?\.code === '23P01'/);
  assert.doesNotMatch(route, /\.transaction\(async/);
});
