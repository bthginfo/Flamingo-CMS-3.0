const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createPublicFlowActionId() {
  return crypto.randomUUID();
}

export function publicFlowRequestHeaders(idempotencyKey: string) {
  if (!UUID_PATTERN.test(idempotencyKey)) throw new Error('Invalid public flow action id.');
  return {
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey,
  };
}
