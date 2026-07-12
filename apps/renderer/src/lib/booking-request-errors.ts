export type BookingRetryHint = {
  retryWithSameIdempotencyKey?: true;
  retryWithNewIdempotencyKey?: true;
};

type BookingRequestErrorLogger = (message: string, error: unknown) => void;

const BOOKING_VALIDATION_ERRORS: Readonly<Record<string, string>> = {
  DATE_REQUIRED: 'Bitte wählen Sie ein Datum.',
  END_DATE_REQUIRED: 'Bitte wählen Sie ein Enddatum.',
  INVALID_DATE_RANGE: 'Der gewählte Zeitraum ist ungültig.',
  TIME_REQUIRED: 'Bitte wählen Sie eine Uhrzeit.',
  INVALID_TIME_RANGE: 'Der gewählte Termin ist ungültig.',
};

function bookingErrorCode(error: unknown) {
  return error instanceof Error ? error.message : '';
}

/**
 * Convert expected booking-domain errors into stable public responses. Unknown
 * failures are logged server-side, but their message never crosses the public
 * API boundary because database/provider errors can contain implementation
 * details.
 */
export function bookingRequestErrorResponse(
  error: unknown,
  retryHint: BookingRetryHint = {},
  logger: BookingRequestErrorLogger = console.error,
) {
  const code = bookingErrorCode(error);
  const validationMessage = BOOKING_VALIDATION_ERRORS[code];
  if (validationMessage) {
    return Response.json({ error: validationMessage }, { status: 400 });
  }

  if (code === 'BOOKING_CONFLICT') {
    return Response.json({
      error: 'Dieser Zeitraum ist nicht mehr verfügbar.',
      ...retryHint,
    }, { status: 409 });
  }

  logger('[Booking] unexpected request failure', error);
  return Response.json({
    error: 'Die Buchungsanfrage konnte nicht verarbeitet werden.',
    ...retryHint,
  }, { status: 500 });
}
