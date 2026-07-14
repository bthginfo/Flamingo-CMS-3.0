import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const PREFIX = 'enc:v1:';

function encryptionKey() {
  const root = [
    process.env.CRM_CONFIG_ENCRYPTION_KEY,
    process.env.CONFIG_ENCRYPTION_KEY,
    process.env.CRM_JWT_SECRET,
    process.env.ADMIN_JWT_SECRET,
  ].map(value => value?.trim()).find(value => value && value.length >= 32);
  if (!root) throw new Error('A strong CRM configuration-encryption key is required.');
  return createHash('sha256').update('flamingo:crm-config:v1\0').update(root).digest();
}

export function isProtectedCrmSecret(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(PREFIX);
}

export function protectCrmSecret(value: string | null | undefined): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  if (isProtectedCrmSecret(value)) return value;
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${iv.toString('base64url')}.${tag.toString('base64url')}.${ciphertext.toString('base64url')}`;
}

export function revealCrmSecret(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!isProtectedCrmSecret(value)) return value;
  const payload = value.slice(PREFIX.length).split('.');
  if (payload.length !== 3) return null;
  try {
    const [iv, tag, ciphertext] = payload.map(part => Buffer.from(part, 'base64url'));
    const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}
