import { isShopActive } from './actions';
import { ShopPaywall } from './paywall';
import { ShopDashboard } from './dashboard';

export default async function ShopPage() {
  const active = await isShopActive();

  if (!active) {
    return <ShopPaywall />;
  }

  return <ShopDashboard />;
}
