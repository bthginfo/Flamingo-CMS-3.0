import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { bookingRequestErrorResponse } from './booking-request-errors';

const bookingRouteSource = readFileSync(
  new URL('../app/api/booking/request/route.ts', import.meta.url),
  'utf8',
);

test('booking validation codes become localized HTTP 400 responses', async () => {
  const cases = [
    ['DATE_REQUIRED', 'Bitte wählen Sie ein Datum.'],
    ['END_DATE_REQUIRED', 'Bitte wählen Sie ein Enddatum.'],
    ['INVALID_DATE_RANGE', 'Der gewählte Zeitraum ist ungültig.'],
    ['TIME_REQUIRED', 'Bitte wählen Sie eine Uhrzeit.'],
    ['INVALID_TIME_RANGE', 'Der gewählte Termin ist ungültig.'],
  ] as const;

  for (const [code, publicMessage] of cases) {
    let logged = false;
    const response = bookingRequestErrorResponse(new Error(code), {}, () => { logged = true; });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: publicMessage });
    assert.equal(logged, false, `${code} must not be logged as an unexpected failure`);
  }
});

test('booking overlap becomes HTTP 409 and preserves the safe retry instruction', async () => {
  const response = bookingRequestErrorResponse(
    new Error('BOOKING_CONFLICT'),
    { retryWithNewIdempotencyKey: true },
    () => assert.fail('expected conflicts must not be logged as unexpected'),
  );

  assert.equal(response.status, 409);
  assert.deepEqual(await response.json(), {
    error: 'Dieser Zeitraum ist nicht mehr verfügbar.',
    retryWithNewIdempotencyKey: true,
  });
});

test('unexpected booking failures are logged but never exposed to the client', async () => {
  const internal = new Error('relation "booking_secrets" does not exist; password=super-secret');
  const logged: Array<{ message: string; error: unknown }> = [];
  const response = bookingRequestErrorResponse(
    internal,
    { retryWithSameIdempotencyKey: true },
    (message, error) => logged.push({ message, error }),
  );
  const body = await response.json();

  assert.equal(response.status, 500);
  assert.deepEqual(body, {
    error: 'Die Buchungsanfrage konnte nicht verarbeitet werden.',
    retryWithSameIdempotencyKey: true,
  });
  assert.doesNotMatch(JSON.stringify(body), /booking_secrets|password|super-secret/i);
  assert.deepEqual(logged, [{ message: '[Booking] unexpected request failure', error: internal }]);
});

test('the public booking route delegates catch responses to the safe mapper', () => {
  assert.match(bookingRouteSource, /bookingRequestErrorResponse\(error, retryHint\)/);
  assert.doesNotMatch(bookingRouteSource, /error:\s*message/);
});
