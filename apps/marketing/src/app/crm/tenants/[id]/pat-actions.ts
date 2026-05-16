'use server';

import { getDb } from '@/lib/db';
import { tenantApiTokens } from '@flamingo/db';
import { eq, and, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { randomBytes, createHash } from 'crypto';

export async function generatePatAction(tenantId: string) {
  const db = getDb();

  // Revoke all existing tokens for this tenant
  await db.update(tenantApiTokens)
    .set({ revoked: true })
    .where(eq(tenantApiTokens.tenantId, tenantId));

  // Generate new token
  const rawToken = `flm_pat_${randomBytes(32).toString('hex')}`;
  const tokenHash = createHash('sha256').update(rawToken).digest('hex');

  await db.insert(tenantApiTokens).values({
    tenantId,
    tokenHash,
    label: 'AI Content Token',
  });

  revalidatePath(`/crm/tenants/${tenantId}`);

  // Return cleartext token — only shown once
  return { token: rawToken };
}

export async function revokePatAction(tenantId: string) {
  const db = getDb();
  await db.update(tenantApiTokens)
    .set({ revoked: true })
    .where(eq(tenantApiTokens.tenantId, tenantId));
  revalidatePath(`/crm/tenants/${tenantId}`);
  return { success: true };
}

export async function getActiveToken(tenantId: string) {
  const db = getDb();
  const [token] = await db.select({
    id: tenantApiTokens.id,
    label: tenantApiTokens.label,
    createdAt: tenantApiTokens.createdAt,
    lastUsedAt: tenantApiTokens.lastUsedAt,
  })
  .from(tenantApiTokens)
  .where(and(eq(tenantApiTokens.tenantId, tenantId), eq(tenantApiTokens.revoked, false)))
  .orderBy(desc(tenantApiTokens.createdAt))
  .limit(1);
  return token || null;
}
