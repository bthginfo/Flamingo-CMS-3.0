import { getShippingZones } from '../actions';
import { ShippingClient } from './shipping-client';
import { ShopBackLink } from '../shop-back-link';

export default async function ShippingPage() {
  const zones = await getShippingZones();
  return (
    <div>
      <ShopBackLink />
      <h1 className="text-2xl font-bold mb-1">Versand</h1>
      <p className="text-zinc-500 text-sm mb-6">Versandzonen und Versandmethoden konfigurieren.</p>
      <ShippingClient zones={zones} />
    </div>
  );
}
