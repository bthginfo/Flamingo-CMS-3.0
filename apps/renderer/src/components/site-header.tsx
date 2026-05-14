'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Phone, Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { NavItem, NavCta, BrandData, ContactData } from '@/lib/tenant-data';

export function SiteHeader({ navItems, brand, contact, darkBg = true, cta }: { navItems: NavItem[]; brand: BrandData; contact: ContactData; darkBg?: boolean; cta?: NavCta | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

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
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight transition-colors duration-300" style={{ color: (scrolled || !darkBg) ? brand.primaryColor : 'white' }}>
              {brand.logoUrl ? (
                <Image src={brand.logoUrl} alt={brand.companyName || 'Logo'} width={140} height={40} className="h-9 w-auto object-contain" />
              ) : (
                brand.companyName || 'Firmenname'
              )}
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className={cn(
                    'text-[13px] font-medium tracking-wide uppercase transition-colors duration-300 hover:text-brand-accent',
                    (scrolled || !darkBg) ? 'text-gray-600' : 'text-white/80',
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={cta?.href || '/kontakt'}
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300',
                  (scrolled || !darkBg)
                    ? 'bg-brand-primary text-white hover:bg-brand-dark shadow-md hover:shadow-lg'
                    : 'bg-white/10 text-white border border-white/25 hover:bg-white/20 backdrop-blur-sm',
                )}
              >
                {cta?.label || 'Termin vereinbaren'}
                <ArrowRight size={14} />
              </Link>
            </nav>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'md:hidden p-2 rounded-lg transition-colors',
                (scrolled || !darkBg) ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10',
              )}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu — full-screen overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[55] bg-white flex flex-col md:hidden"
            >
              {/* Close button */}
              <div className="flex items-center justify-between h-[72px] px-6">
                <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight" style={{ color: brand.primaryColor }}>
                  {brand.logoUrl ? (
                    <Image src={brand.logoUrl} alt={brand.companyName || 'Logo'} width={140} height={40} className="h-9 w-auto object-contain" />
                  ) : (
                    brand.companyName || 'Firmenname'
                  )}
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-gray-700 hover:bg-gray-100">
                  <X size={24} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
                {navItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block text-2xl font-semibold text-gray-800 py-3 hover:text-brand-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.05 + 0.1 }}
                  className="mt-6"
                >
                  <Link
                    href={cta?.href || '/kontakt'}
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center gap-2 w-full text-center bg-brand-primary text-white font-semibold py-4 rounded-full text-lg hover:bg-brand-dark transition"
                  >
                    {cta?.label || 'Termin vereinbaren'} <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </nav>

              {/* Contact info at bottom */}
              <div className="px-8 pb-8 flex flex-col gap-2 text-sm text-gray-500">
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-2 hover:text-brand-primary">
                    <Phone size={14} /> {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-brand-primary">
                    <Mail size={14} /> {contact.email}
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for top bar */}
      <div className="h-10" />
    </>
  );
}
