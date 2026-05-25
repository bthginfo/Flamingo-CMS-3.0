import { getShopSettings, ensureShopPages } from '../actions';
import { ShopSettingsForm } from './settings-form';
import { ShopBackLink } from '../shop-back-link';
import { getSession } from '@/lib/session';

export default async function ShopSettingsPage() {
  const session = await getSession();
  if (session) await ensureShopPages(session.tenantId);
  const settings = await getShopSettings();
  return (
    <div>
      <ShopBackLink />
      <h1 className="text-2xl font-bold mb-1">Shop-Einstellungen</h1>
      <p className="text-zinc-500 text-sm mb-6">Zahlungsarten, Versand, Steuern und allgemeine Konfiguration.</p>
      <ShopSettingsForm initial={settings ? { ...settings, paymentMethods: settings.paymentMethods || [] } : undefined} />
    </div>
  );
}
