import { createHmac, randomBytes } from 'node:crypto';

/**
 * Signed OAuth state payload — opaque to the user, tamper-proof.
 * Carries: tenantId, sectionId, pageId, returnTo, nonce, ts.
 */
export type IgState = {
  tenantId: string;
  sectionId: string;
  pageId: string;
  returnTo: string;
  nonce: string;
  ts: number;
};

function getSecret(): string {
  const s = process.env.META_APP_SECRET;
  if (!s) throw new Error('META_APP_SECRET not set');
  return s;
}

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

export function signState(input: Omit<IgState, 'nonce' | 'ts'>): string {
  const payload: IgState = { ...input, nonce: randomBytes(8).toString('hex'), ts: Date.now() };
  const body = b64url(Buffer.from(JSON.stringify(payload), 'utf8'));
  const sig = b64url(createHmac('sha256', getSecret()).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyState(raw: string, maxAgeMs = 10 * 60 * 1000): IgState | null {
  if (!raw || typeof raw !== 'string' || !raw.includes('.')) return null;
  const [body, sig] = raw.split('.');
  if (!body || !sig) return null;
  const expected = b64url(createHmac('sha256', getSecret()).update(body).digest());
  if (expected !== sig) return null;
  try {
    const parsed = JSON.parse(fromB64url(body).toString('utf8')) as IgState;
    if (!parsed.tenantId || !parsed.ts) return null;
    if (Date.now() - parsed.ts > maxAgeMs) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Verify Meta's signed_request payload (deauthorize / data-deletion webhooks).
 * Returns the decoded payload or null if the signature is invalid.
 * https://developers.facebook.com/docs/facebook-login/guides/data-deletion-request
 */
export function verifySignedRequest(signedRequest: string): { user_id?: string; algorithm?: string } | null {
  if (!signedRequest || !signedRequest.includes('.')) return null;
  const [encodedSig, payload] = signedRequest.split('.');
  if (!encodedSig || !payload) return null;
  const expected = createHmac('sha256', getSecret()).update(payload).digest();
  const actual = fromB64url(encodedSig);
  if (expected.length !== actual.length) return null;
  // constant-time compare
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ actual[i];
  if (diff !== 0) return null;
  try {
    return JSON.parse(fromB64url(payload).toString('utf8'));
  } catch {
    return null;
  }
}
