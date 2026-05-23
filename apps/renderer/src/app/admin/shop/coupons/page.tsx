import { getCoupons } from '../actions';
import { CouponsClient } from './coupons-client';

export default async function CouponsPage() {
  const couponList = await getCoupons();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Gutscheine & Rabattcodes</h1>
      <p className="text-zinc-500 text-sm mb-6">Erstelle und verwalte Rabattcodes für deinen Shop.</p>
      <CouponsClient coupons={couponList} />
    </div>
  );
}
