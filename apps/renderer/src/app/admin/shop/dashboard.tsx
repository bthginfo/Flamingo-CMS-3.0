import Link from 'next/link';
import { getProducts, getOrders, getCategories } from './actions';
import { Package, ShoppingCart, FolderOpen, Settings, Tag, Truck, Receipt, Percent } from 'lucide-react';

export async function ShopDashboard() {
  const [productList, orderList, categoryList] = await Promise.all([
    getProducts(), getOrders(), getCategories(),
  ]);

  const activeProducts = productList.filter(p => p.status === 'active').length;
  const pendingOrders = orderList.filter(o => o.status === 'pending' || o.status === 'paid').length;

  const cards = [
    { label: 'Produkte', value: productList.length, sub: `${activeProducts} aktiv`, href: '/admin/shop/products', icon: Package },
    { label: 'Bestellungen', value: orderList.length, sub: `${pendingOrders} offen`, href: '/admin/shop/orders', icon: ShoppingCart },
    { label: 'Kategorien', value: categoryList.length, sub: '', href: '/admin/shop/categories', icon: FolderOpen },
  ];

  const navLinks = [
    { label: 'Produkte', href: '/admin/shop/products', icon: Package },
    { label: 'Kategorien', href: '/admin/shop/categories', icon: FolderOpen },
    { label: 'Bestellungen', href: '/admin/shop/orders', icon: ShoppingCart },
    { label: 'Rabatte & Coupons', href: '/admin/shop/coupons', icon: Tag },
    { label: 'Rabattaktionen', href: '/admin/shop/promotions', icon: Percent },
    { label: 'Versand', href: '/admin/shop/shipping', icon: Truck },
    { label: 'Rechnungen', href: '/admin/shop/invoices', icon: Receipt },
    { label: 'Einstellungen', href: '/admin/shop/settings', icon: Settings },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Shop</h1>
      <p className="text-zinc-500 text-sm mb-6">Verwalte Produkte, Bestellungen und Einstellungen.</p>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-pink-300 transition group">
            <div className="flex items-center gap-3 mb-2">
              <c.icon size={20} className="text-zinc-400 group-hover:text-pink-500 transition" />
              <span className="text-sm font-medium text-zinc-600">{c.label}</span>
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
            {c.sub && <p className="text-xs text-zinc-400 mt-0.5">{c.sub}</p>}
          </Link>
        ))}
      </div>

      {/* Navigation grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-zinc-200 hover:border-pink-300 transition text-center">
            <link.icon size={24} className="text-zinc-500" />
            <span className="text-sm font-medium">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
