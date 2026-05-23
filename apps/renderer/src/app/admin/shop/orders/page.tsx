import { getOrders } from '../actions';
import { OrdersClient } from './orders-client';

export default async function OrdersPage() {
  const orderList = await getOrders();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Bestellungen</h1>
      <p className="text-zinc-500 text-sm mb-6">Alle Bestellungen deines Shops.</p>
      <OrdersClient orders={orderList} />
    </div>
  );
}
