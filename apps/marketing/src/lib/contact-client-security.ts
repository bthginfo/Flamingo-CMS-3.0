const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type ContactActionIdentity = {
  serializedPayload: string;
  idempotencyKey: string;
};

export function createContactActionIdentity(
  payload: unknown,
  previous?: ContactActionIdentity | null,
): ContactActionIdentity {
  const serializedPayload = JSON.stringify(payload);
  if (previous?.serializedPayload === serializedPayload) return previous;
  return { serializedPayload, idempotencyKey: crypto.randomUUID() };
}

export function contactRequestHeaders(idempotencyKey: string) {
  if (!UUID_PATTERN.test(idempotencyKey)) throw new Error('Invalid contact action id.');
  return {
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey,
  };
}
