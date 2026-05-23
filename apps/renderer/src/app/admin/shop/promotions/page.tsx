import { getPromotions } from '../actions';
import { PromotionsClient } from './promotions-client';
import { ShopBackLink } from '../shop-back-link';

export default async function PromotionsPage() {
  const promoList = await getPromotions();
  return (
    <div>
      <ShopBackLink />
      <h1 className="text-2xl font-bold mb-1">Rabattaktionen</h1>
      <p className="text-zinc-500 text-sm mb-6">Automatische Rabatte die ohne Code greifen — basierend auf Bestellwert, Menge oder Bedingungen.</p>
      <PromotionsClient promotions={promoList} />
    </div>
  );
}
