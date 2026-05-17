'use server';

import { createHash, randomBytes } from 'crypto';
import { getDb } from '@/lib/db';
import { tenantApiTokens } from '@flamingo/db';
import { eq, and, desc } from 'drizzle-orm';
import { requireTenant } from '../settings-actions';
import { revalidatePath } from 'next/cache';

export async function getApiToken() {
  const tenantId = await requireTenant();
  const db = getDb();
  const [token] = await db.select({
    id: tenantApiTokens.id,
    label: tenantApiTokens.label,
    createdAt: tenantApiTokens.createdAt,
    expiresAt: tenantApiTokens.expiresAt,
    lastUsedAt: tenantApiTokens.lastUsedAt,
    revoked: tenantApiTokens.revoked,
  }).from(tenantApiTokens)
    .where(and(eq(tenantApiTokens.tenantId, tenantId), eq(tenantApiTokens.revoked, false)))
    .orderBy(desc(tenantApiTokens.createdAt))
    .limit(1);

  return token || null;
}

export async function createApiToken(lifetimeDays: number | null): Promise<{ token: string }> {
  const tenantId = await requireTenant();
  const db = getDb();

  // Revoke any existing active tokens
  await db.update(tenantApiTokens)
    .set({ revoked: true })
    .where(and(eq(tenantApiTokens.tenantId, tenantId), eq(tenantApiTokens.revoked, false)));

  // Generate new token
  const raw = `flm_pat_${randomBytes(32).toString('hex')}`;
  const tokenHash = createHash('sha256').update(raw).digest('hex');

  const expiresAt = lifetimeDays ? new Date(Date.now() + lifetimeDays * 24 * 60 * 60 * 1000) : null;

  await db.insert(tenantApiTokens).values({
    tenantId,
    tokenHash,
    label: 'AI Content Token',
    expiresAt,
  });

  revalidatePath('/admin/ai-api');
  return { token: raw };
}

export async function revokeApiToken() {
  const tenantId = await requireTenant();
  const db = getDb();
  await db.update(tenantApiTokens)
    .set({ revoked: true })
    .where(and(eq(tenantApiTokens.tenantId, tenantId), eq(tenantApiTokens.revoked, false)));
  revalidatePath('/admin/ai-api');
  return { success: true };
}
