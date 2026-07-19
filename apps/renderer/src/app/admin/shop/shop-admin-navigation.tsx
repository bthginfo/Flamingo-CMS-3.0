'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Boxes,
  ChevronDown,
  FileText,
  FolderOpen,
  Import,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Truck,
} from 'lucide-react';

const PRIMARY_LINKS = [
  { href: '/admin/shop', label: 'Übersicht', icon: LayoutDashboard, exact: true },
  { href: '/admin/shop/products', label: 'Produkte', icon: Package },
  { href: '/admin/shop/orders', label: 'Bestellungen', icon: ShoppingCart },
  { href: '/admin/shop/shipping', label: 'Versand', icon: Truck },
  { href: '/admin/shop/coupons', label: 'Rabatte', icon: Tag },
  { href: '/admin/shop/settings', label: 'Einstellungen', icon: Settings },
] as const;

const SECONDARY_LINKS = [
  { href: '/admin/shop/categories', label: 'Kategorien', icon: FolderOpen },
  { href: '/admin/shop/invoices', label: 'Rechnungen', icon: FileText },
  { href: '/admin/shop/import', label: 'CSV-Import', icon: Import },
] as const;

export function ShopAdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const secondaryActive = SECONDARY_LINKS.some(link => pathname.startsWith(link.href));
  const allLinks = [...PRIMARY_LINKS, ...SECONDARY_LINKS];
  const selectedHref = [...allLinks].reverse().find(link => ('exact' in link && link.exact ? pathname === link.href : pathname.startsWith(link.href)))?.href || '/admin/shop';

  return (
    <header className="border-b border-zinc-200 pb-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <Link href="/admin/shop" className="group inline-flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><Boxes className="size-5" /></span>
          <span>
            <span className="block text-sm font-semibold text-zinc-950">Online-Shop</span>
            <span className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500"><span className="size-1.5 rounded-full bg-emerald-500" /> Modul aktiv</span>
          </span>
        </Link>
        <Link href="/admin/functions" className="hidden text-xs font-medium text-zinc-500 hover:text-zinc-900 sm:block">Alle Funktionen</Link>
      </div>

      <label className="block sm:hidden">
        <span className="sr-only">Shop-Bereich auswählen</span>
        <select value={selectedHref} onChange={event => router.push(event.target.value)} className="admin-input min-h-11 w-full bg-white">
          {allLinks.map(link => <option key={link.href} value={link.href}>{link.label}</option>)}
        </select>
      </label>
      <nav aria-label="Shop-Navigation" className="hidden items-center gap-1 sm:flex">
        {PRIMARY_LINKS.map(link => {
          const active = 'exact' in link && link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${active ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'}`}
            >
              <Icon className="size-4" /> {link.label}
            </Link>
          );
        })}
        <details className="group relative shrink-0">
          <summary className={`flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 [&::-webkit-details-marker]:hidden ${secondaryActive ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'}`}>
            Mehr <ChevronDown className="size-4 transition group-open:rotate-180" />
          </summary>
          <div className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl">
            {SECONDARY_LINKS.map(link => {
              const Icon = link.icon;
              const active = pathname.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium ${active ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950'}`}>
                  <Icon className="size-4" /> {link.label}
                </Link>
              );
            })}
          </div>
        </details>
      </nav>
    </header>
  );
}
