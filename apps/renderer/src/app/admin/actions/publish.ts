'use server';

import { getWritableSession } from '@/lib/session';
import { getDb } from '@/lib/db';
import { getDraftSnapshot } from '@/lib/snapshot';
import { checksumPublishedSnapshot, publishSnapshotAtomically, rollbackSnapshotAtomically } from '@/lib/publish-snapshot';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export type PublishRepairItem = {
  severity?: string;
  code?: string;
  location?: string;
  message?: string;
  repair?: unknown;
};

export type PublishResult = {
  success?: true;
  error?: string;
  code?: string;
  version?: number;
  unchanged?: true;
  summary?: Record<string, number>;
  repairQueue?: PublishRepairItem[];
  advisoryQueue?: PublishRepairItem[];
};
function normalizeSnapshotForJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (_key, input) => {
    if (typeof input === 'bigint') return input.toString();
    if (input instanceof Date) return input.toISOString();
    return input;
  })) as T;
}

async function requireSession() {
  const session = await getWritableSession();
  if (!session) redirect('/admin/login');
  return session;
}

function revalidateTenant(tenantId: string) {
  revalidateTag(`tenant-${tenantId}`);
  revalidatePath('/', 'layout');
}

/**
 * Publish (Draft/Publish B):
 *  1) Serialize the full draft snapshot from pages/page_sections/collections.
 *  2) Promote draft pages and activate the new published snapshot atomically.
 *  3) Append publish_history in the same transaction.
 *  4) Bust caches after the DB state is consistent.
 */
export async function publishAction(): Promise<PublishResult> {
  try {
    const session = await requireSession();
    const cookieStore = await cookies();
    if (cookieStore.get('flamingo_public_demo')?.value === session.tenantId) {
      return { error: 'Veröffentlichung ist im Demo-Modus deaktiviert.' };
    }

    const db = getDb();
    const tenantId = session.tenantId;

    const snapshot = await getDraftSnapshot(tenantId);
    if (!snapshot) return { error: 'Keine Inhalte zum Veröffentlichen gefunden.' };

    const publishInput = {
      tenantId,
      snapshot: normalizeSnapshotForJson(snapshot),
      checksum: checksumPublishedSnapshot(snapshot),
      createdBy: 'admin',
      publishDraftPages: true,
    };

    const result = await publishSnapshotAtomically(db, publishInput);

    revalidateTenant(tenantId);

    const revalidateSecret = process.env.REVALIDATE_SECRET;
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3002';
    if (revalidateSecret) {
      try {
        await fetch(`${baseUrl}/api/revalidate`, {
          method: 'POST',
          headers: { 'x-revalidate-secret': revalidateSecret },
        });
      } catch {
        // Best-effort
      }
    }

    return { success: true, version: result.version, unchanged: result.unchanged || undefined };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Publish-Fehler';
    console.error('[publishAction] failed:', message);
    return {
      error: 'Veröffentlichen fehlgeschlagen. Bitte erneut versuchen oder den Support kontaktieren.',
      code: 'PUBLISH_INTERNAL_ERROR',
    };
  }
}

/**
 * Roll back to the most recent prior snapshot.
 */
export async function rollbackPublishAction(): Promise<PublishResult> {
  const session = await requireSession();
  const cookieStore = await cookies();
  if (cookieStore.get('flamingo_public_demo')?.value === session.tenantId) {
    return { error: 'Rollback ist im Demo-Modus deaktiviert.' };
  }

  const db = getDb();
  const tenantId = session.tenantId;

  const result = await rollbackSnapshotAtomically(db, tenantId);
  if ('error' in result) {
    return {
      error: result.error === 'no-active-snapshot'
        ? 'Kein aktiver Snapshot vorhanden.'
        : 'Kein vorheriger Snapshot vorhanden.',
    };
  }

  revalidateTenant(tenantId);
  return { success: true, version: result.version };
}
