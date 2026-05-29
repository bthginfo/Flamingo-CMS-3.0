'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Phone, Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useHeaderContrast } from '@/hooks/use-header-contrast';
import { LanguageSwitcher } from './language-switcher';
import type { NavItem, NavCta, BrandData, ContactData } from '@/lib/tenant-data';
import { prefixInternalHref } from '@/lib/link-prefix';

export function SiteHeader({ navItems, brand, contact, darkBg = true, cta, homeHref = '/', i18n, showTopBar = true, forceDarkNav = false, linkPrefix = '' }: { navItems: NavItem[]; brand: BrandData; contact: ContactData; darkBg?: boolean; cta?: NavCta | null; homeHref?: string; i18n?: { locales: string[]; currentLocale: string; defaultLocale: string; style?: string }; showTopBar?: boolean; forceDarkNav?: boolean; linkPrefix?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const measuredHeroDark = useHeaderContrast(darkBg);
  const isHeroDark = forceDarkNav ? true : measuredHeroDark;

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
      {showTopBar && <motion.div
        animate={{ y: scrolled || mobileOpen ? -40 : 0, opacity: scrolled || mobileOpen ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[60] text-white/80 text-xs py-2.5"
      style={{ backgroundColor: 'var(--brand-topbar, var(--brand-dark))' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-5">
            {contact.phone && (
              <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone size={12} className="text-brand-accent" />{contact.phone}
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors truncate max-w-[180px] sm:max-w-none">
                <Mail size={12} className="text-brand-accent shrink-0" /><span className="truncate">{contact.email}</span>
              </a>
            )}
          </div>
          <span className="hidden sm:inline font-medium text-white/60">{brand.tagline}</span>
        </div>
      </motion.div>}

      {/* Main nav — becomes glassmorphism on scroll */}
      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-500',
          scrolled || !showTopBar ? 'top-0' : 'top-10',
        )}
      >
        <div className={cn(
          'transition-all duration-500',
          scrolled
            ? 'backdrop-blur-2xl shadow-lg border-b border-gray-100/50'
            : isHeroDark ? 'bg-gradient-to-b from-black/70 via-black/30 to-transparent' : 'backdrop-blur-sm shadow-sm',
        )}
        style={(scrolled || (!isHeroDark)) ? { backgroundColor: brand.navBgColor || 'rgba(255,255,255,0.8)' } : undefined}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[72px]">
            <Link href={prefixInternalHref(homeHref, linkPrefix) as string} className="flex items-center gap-2 font-display font-bold text-xl tracking-tight transition-colors duration-300" style={{ color: (scrolled || (!isHeroDark)) ? (brand.navBrandColor || brand.primaryColor) : 'white' }}>
              {(brand.logoDisplay !== 'name' && brand.logoUrl) && (
                brand.navLogoColor ? (
                  <span
                    className="inline-block h-9 w-[140px]"
                    style={{
                      backgroundColor: (scrolled || (!isHeroDark)) ? brand.navLogoColor : 'white',
                      WebkitMaskImage: `url(${brand.logoUrl})`,
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'left center',
                      maskImage: `url(${brand.logoUrl})`,
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'left center',
                    }}
                    aria-hidden="true"
                  />
                ) : (
                  <Image src={brand.logoUrl} alt={brand.companyName || 'Logo'} width={140} height={40} className="h-9 w-auto object-contain" />
                )
              )}
              {(brand.logoDisplay === 'logoAndName' || brand.logoDisplay === 'name' || !brand.logoUrl) && (
                <span>{brand.companyName || 'Firmenname'}</span>
              )}
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  href={prefixInternalHref(item.href, linkPrefix) as string}
                  className={cn(
                    'text-[13px] font-medium tracking-wide uppercase transition-colors duration-300 hover:text-brand-accent',
                    (scrolled || (!isHeroDark)) ? 'text-gray-600' : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]',
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={prefixInternalHref(cta?.href || '/kontakt', linkPrefix) as string}
                {...((cta?.href?.startsWith('http')) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300',
                  (scrolled || (!isHeroDark))
                    ? 'bg-brand-primary text-white hover:bg-brand-dark shadow-md hover:shadow-lg'
                    : 'bg-white/10 text-white border border-white/25 hover:bg-white/20 backdrop-blur-sm',
                )}
              >
                {cta?.label || 'Termin vereinbaren'}
                <ArrowRight size={14} />
              </Link>
              {i18n && i18n.locales.length > 1 && (
                <LanguageSwitcher locales={i18n.locales} currentLocale={i18n.currentLocale} defaultLocale={i18n.defaultLocale} style={(i18n.style as 'dropdown' | 'inline') || 'dropdown'} />
              )}
            </nav>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
              className={cn(
                'md:hidden p-2 rounded-lg transition-colors',
                (scrolled || (!isHeroDark)) ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10',
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
              className="fixed inset-0 z-[70] bg-white flex flex-col md:hidden"
            >
              {/* Close button */}
              <div className="flex items-center justify-between h-[72px] px-6">
                <Link href={prefixInternalHref(homeHref, linkPrefix) as string} className="flex items-center gap-2 font-display font-bold text-xl tracking-tight" style={{ color: brand.navBrandColor || brand.primaryColor }}>
                  {(brand.logoDisplay !== 'name' && brand.logoUrl) && (
                    <Image src={brand.logoUrl} alt={brand.companyName || 'Logo'} width={140} height={40} className="h-9 w-auto object-contain" />
                  )}
                  {(brand.logoDisplay === 'logoAndName' || brand.logoDisplay === 'name' || !brand.logoUrl) && (
                    <span>{brand.companyName || 'Firmenname'}</span>
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
                      href={prefixInternalHref(item.href, linkPrefix) as string}
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
                    href={prefixInternalHref(cta?.href || '/kontakt', linkPrefix) as string}
                    {...((cta?.href?.startsWith('http')) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
      {showTopBar && <div className="h-10" />}
    </>
  );
}
