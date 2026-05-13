'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail } from 'lucide-react';
import type { NavItem, BrandData, ContactData } from '@/lib/tenant-data';

export function SiteHeader({ navItems, brand, contact }: { navItems: NavItem[]; brand: BrandData; contact: ContactData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-brand-dark text-white/80 text-xs py-2">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {contact.phone && <span className="flex items-center gap-1.5"><Phone size={12} />{contact.phone}</span>}
            {contact.email && <span className="flex items-center gap-1.5 hidden sm:flex"><Mail size={12} />{contact.email}</span>}
          </div>
          <span className="hidden sm:inline font-medium">{brand.tagline}</span>
        </div>
      </div>
      {/* Main nav */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-18">
          <Link href="/" className="font-display font-bold text-xl tracking-tight" style={{ color: brand.primaryColor }}>
            {brand.companyName || 'Firmenname'}
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, i) => (
              <Link key={i} href={item.href} className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors duration-200">
                {item.label}
              </Link>
            ))}
            <Link href="/kontakt" className="btn-primary text-sm !py-2.5 !px-5">
              Termin vereinbaren
            </Link>
          </nav>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-700">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
              {navItems.map((item, i) => (
                <Link key={i} href={item.href} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-700 py-2 hover:text-brand-primary transition">
                  {item.label}
                </Link>
              ))}
              <Link href="/kontakt" onClick={() => setMobileOpen(false)} className="btn-primary text-sm text-center mt-2">
                Termin vereinbaren
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
