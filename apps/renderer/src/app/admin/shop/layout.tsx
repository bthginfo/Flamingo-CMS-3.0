import type { ReactNode } from 'react';
import { isShopActive } from './actions';
import { ShopPaywall } from './paywall';

/**
 * Protect every shop-admin subroute with the same entitlement UX. Individual
 * server actions still enforce the add-on separately; this layout prevents a
 * direct URL from ending in a confusing empty screen or server error.
 */
export default async function ShopAdminLayout({ children }: { children: ReactNode }) {
  const active = await isShopActive();
  return active ? children : <ShopPaywall />;
}
