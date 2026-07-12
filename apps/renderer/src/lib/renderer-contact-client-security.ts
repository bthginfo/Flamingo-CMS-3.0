const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createRendererContactActionId() {
  return crypto.randomUUID();
}

export type RendererContactActionIdentity = {
  serializedPayload: string;
  idempotencyKey: string;
};

export function createRendererContactActionIdentity(
  payload: unknown,
  previous?: RendererContactActionIdentity | null,
): RendererContactActionIdentity {
  const serializedPayload = JSON.stringify(payload);
  if (previous?.serializedPayload === serializedPayload) return previous;
  return { serializedPayload, idempotencyKey: createRendererContactActionId() };
}

export function rendererContactRequestHeaders(idempotencyKey: string) {
  if (!UUID_PATTERN.test(idempotencyKey)) throw new Error('Invalid contact action id.');
  return {
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey,
  };
}
