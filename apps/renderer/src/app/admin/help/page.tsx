import { and, eq } from 'drizzle-orm';
import { tenantAddons, tenants } from '@flamingo/db';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';
import { BILLING_ADDON_KEY } from '@/lib/billing-constants';
import { HelpHub, type HelpFeatureState } from './help-hub';

/**
 * Help is intentionally read-only. Demo sessions can render this page because
 * feature availability is read directly instead of calling a writable action.
 */
async function getHelpFeatureState(tenantId: string): Promise<HelpFeatureState> {
  try {
    const [tenantRows, addonRows] = await Promise.all([
      getDb()
        .select({ i18nEnabled: tenants.i18nEnabled })
        .from(tenants)
        .where(eq(tenants.id, tenantId))
        .limit(1),
      getDb()
        .select({ key: tenantAddons.addonKey })
        .from(tenantAddons)
        .where(and(eq(tenantAddons.tenantId, tenantId), eq(tenantAddons.active, true))),
    ]);
    const activeAddons = new Set(addonRows.map(addon => addon.key));
    return {
      shop: activeAddons.has('shop'),
      booking: activeAddons.has('booking'),
      billing: activeAddons.has(BILLING_ADDON_KEY),
      i18n: tenantRows[0]?.i18nEnabled ?? false,
    };
  } catch (error) {
    console.error('[HelpPage] feature availability unavailable', error instanceof Error ? error.message : error);
    return { shop: false, booking: false, billing: false, i18n: false };
  }
}

export default async function HelpPage() {
  const session = await getSession();
  if (!session) return null;
  const features = await getHelpFeatureState(session.tenantId);
  return <HelpHub tenantId={session.tenantId} features={features} />;
}
