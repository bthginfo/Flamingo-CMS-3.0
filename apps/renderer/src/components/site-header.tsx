'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Phone, Mail, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem, BrandData, ContactData } from '@/lib/tenant-data';

export function SiteHeader({ navItems, brand, contact }: { navItems: NavItem[]; brand: BrandData; contact: ContactData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 50);
    setHidden(latest > 300 && latest > previous);
  });

  return (
    <>
      {/* Top bar — fixed, disappears on scroll */}
      <motion.div
        animate={{ y: scrolled ? -40 : 0, opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[60] bg-brand-dark text-white/80 text-xs py-2.5"
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-5">
            {contact.phone && (
              <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone size={12} className="text-brand-accent" />{contact.phone}
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors hidden sm:flex">
                <Mail size={12} className="text-brand-accent" />{contact.email}
              </a>
            )}
          </div>
          <span className="hidden sm:inline font-medium text-white/60">{brand.tagline}</span>
        </div>
      </motion.div>

      {/* Main nav — becomes glassmorphism on scroll */}
      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'top-0' : 'top-10',
        )}
      >
        <div className={cn(
          'transition-all duration-500',
          scrolled
            ? 'bg-white/80 backdrop-blur-2xl shadow-lg border-b border-gray-100/50'
            : 'bg-transparent',
        )}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[72px]">
            <Link href="/" className="font-display font-bold text-xl tracking-tight transition-colors duration-300" style={{ color: scrolled ? brand.primaryColor : 'white' }}>
              {brand.companyName || 'Firmenname'}
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className={cn(
                    'text-[13px] font-medium tracking-wide uppercase transition-colors duration-300 hover:text-brand-accent',
                    scrolled ? 'text-gray-600' : 'text-white/80',
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/kontakt"
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300',
                  scrolled
                    ? 'bg-brand-primary text-white hover:bg-brand-dark shadow-md hover:shadow-lg'
                    : 'bg-white/10 text-white border border-white/25 hover:bg-white/20 backdrop-blur-sm',
                )}
              >
                Termin vereinbaren
                <ArrowRight size={14} />
              </Link>
            </nav>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'md:hidden p-2 rounded-lg transition-colors',
                scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10',
              )}
            >
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
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-gray-100 overflow-hidden shadow-xl"
            >
              <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 hover:text-brand-primary transition-all"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/kontakt"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary text-sm text-center mt-3 !rounded-full"
                >
                  Termin vereinbaren
                  <ArrowRight size={14} />
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for top bar */}
      <div className="h-10" />
    </>
  );
}
