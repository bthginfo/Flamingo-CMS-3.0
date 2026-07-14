import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const PREFIX = 'enc:v1:';

function encryptionKey() {
  const root = process.env.CONFIG_ENCRYPTION_KEY?.trim() || process.env.ADMIN_JWT_SECRET?.trim();
  if (!root || root.length < 32) {
    throw new Error('CONFIG_ENCRYPTION_KEY or a strong ADMIN_JWT_SECRET is required.');
  }
  return createHash('sha256').update('flamingo:stored-config:v1\0').update(root).digest();
}

export function isEncryptedSecret(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(PREFIX);
}

/** Encrypt new secrets while accepting already-encrypted values idempotently. */
export function protectStoredSecret(value: string | null | undefined): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  if (isEncryptedSecret(value)) return value;

  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${iv.toString('base64url')}.${tag.toString('base64url')}.${ciphertext.toString('base64url')}`;
}

/** Legacy plaintext remains readable and is upgraded on the next settings save. */
export function revealStoredSecret(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!isEncryptedSecret(value)) return value;

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

type ShopSecrets = {
  stripeSecretKey?: string | null;
  stripeWebhookSecret?: string | null;
  paypalSecret?: string | null;
  sumupApiKey?: string | null;
};

export function revealShopSecrets<T extends ShopSecrets>(settings: T): T {
  return {
    ...settings,
    stripeSecretKey: revealStoredSecret(settings.stripeSecretKey),
    stripeWebhookSecret: revealStoredSecret(settings.stripeWebhookSecret),
    paypalSecret: revealStoredSecret(settings.paypalSecret),
    sumupApiKey: revealStoredSecret(settings.sumupApiKey),
  };
}
