import Link from 'next/link';
import type { NavItem, BrandData, ContactData } from '@/lib/tenant-data';

export function SiteHeader({ navItems, brand, contact }: { navItems: NavItem[]; brand: BrandData; contact: ContactData }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
      {/* Top bar */}
      <div className="bg-gray-900 text-white text-xs py-1.5">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <span>{contact.phone && `📞 ${contact.phone}`}{contact.email && ` · ✉️ ${contact.email}`}</span>
          <span className="hidden sm:inline">{brand.tagline}</span>
        </div>
      </div>
      {/* Main nav */}
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-xl" style={{ color: brand.primaryColor }}>
          {brand.companyName || 'Firmenname'}
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item, i) => (
            <Link key={i} href={item.href} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">
              {item.label}
            </Link>
          ))}
          <Link href="/kontakt" className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition" style={{ backgroundColor: brand.accentColor || '#f39c12' }}>
            Termin vereinbaren
          </Link>
        </nav>
      </div>
    </header>
  );
}
