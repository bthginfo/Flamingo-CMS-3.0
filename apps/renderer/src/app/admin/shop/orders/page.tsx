import { getOrders } from '../actions';
import { OrdersClient } from './orders-client';
import { ShopBackLink } from '../shop-back-link';

export default async function OrdersPage({ searchParams }: { searchParams?: Promise<{ order?: string }> }) {
  const params = await (searchParams || Promise.resolve<{ order?: string }>({}));
  const orderList = await getOrders();
  const initialOrderId = orderList.some(order => order.id === params.order) ? params.order : undefined;
  return (
    <div>
      <ShopBackLink />
      <h1 className="text-2xl font-bold mb-1">Bestellungen</h1>
      <p className="text-zinc-500 text-sm mb-6">Alle Bestellungen deines Shops.</p>
      <OrdersClient orders={orderList} initialOrderId={initialOrderId} />
    </div>
  );
}
