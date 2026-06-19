'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Phone, Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Script from 'next/script';
import { cn } from '@/lib/utils';
import { useHeaderContrast } from '@/hooks/use-header-contrast';
import { LanguageSwitcher } from './language-switcher';
import { getNavScriptProvider } from '@/lib/embed-providers';
import type { NavItem, NavCta, BrandData, ContactData, TopBarConfig } from '@/lib/tenant-data';
import { prefixInternalHref } from '@/lib/link-prefix';

function NavCtaButton({ cta, scrolled, isHeroDark, linkPrefix, className }: { cta: NavCta; scrolled: boolean; isHeroDark: boolean; linkPrefix: string; className?: string }) {
  const scriptProvider = cta.scriptProvider ? getNavScriptProvider(cta.scriptProvider) : null;

  if (scriptProvider && cta.scriptConfig) {
    const scriptUrl = scriptProvider.buildScriptUrl(cta.scriptConfig);
    const triggerFn = scriptProvider.triggerFunction;
    const btnStyle: React.CSSProperties = {};
    if (cta.buttonColor) btnStyle.backgroundColor = cta.buttonColor;
    if (cta.buttonTextColor) btnStyle.color = cta.buttonTextColor;

    return (
      <>
        {scriptUrl && <Script src={scriptUrl} strategy="lazyOnload" />}
        <button
          onClick={() => { if (typeof window !== 'undefined' && (window as any)[triggerFn]) (window as any)[triggerFn](); }}
          className={className || cn(
            'inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300',
            !cta.buttonColor && ((scrolled || (!isHeroDark))
              ? 'bg-brand-primary text-white hover:bg-brand-dark shadow-md hover:shadow-lg'
              : 'bg-white/10 text-white border border-white/25 hover:bg-white/20 backdrop-blur-sm'),
          )}
          style={btnStyle}
        >
          {cta.label || scriptProvider.defaultLabel}
          <ArrowRight size={14} />
        </button>
      </>
    );
  }

  // Default: link-based CTA
  return (
    <Link
      href={prefixInternalHref(cta.href || '/kontakt', linkPrefix) as string}
      {...((cta.href?.startsWith('http')) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={className || cn(
        'inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300',
        (scrolled || (!isHeroDark))
          ? 'bg-brand-primary text-white hover:bg-brand-dark shadow-md hover:shadow-lg'
          : 'bg-white/10 text-white border border-white/25 hover:bg-white/20 backdrop-blur-sm',
      )}
      style={cta.buttonColor ? { backgroundColor: cta.buttonColor, color: cta.buttonTextColor || '#fff' } : undefined}
    >
      {cta.label || 'Termin vereinbaren'}
      <ArrowRight size={14} />
    </Link>
  );
}

function parseColorChannels(color?: string | null): [number, number, number] | null {
  if (!color) return null;
  const value = color.trim();
  if (/^#[0-9a-f]{3}$/i.test(value)) {
    const [, r, g, b] = value;
    return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)];
  }
  if (/^#[0-9a-f]{6}$/i.test(value)) {
    return [parseInt(value.slice(1, 3), 16), parseInt(value.slice(3, 5), 16), parseInt(value.slice(5, 7), 16)];
  }
  const rgb = value.match(/rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return null;
}

function isDarkColor(color?: string | null) {
  const channels = parseColorChannels(color);
  if (!channels) return false;
  const [r, g, b] = channels.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 0.45;
}

export function SiteHeader({ navItems, brand, contact, darkBg = true, cta, homeHref = '/', i18n, showTopBar = true, forceDarkNav = false, linkPrefix = '', topBar }: { navItems: NavItem[]; brand: BrandData; contact: ContactData; darkBg?: boolean; cta?: NavCta | null; homeHref?: string; i18n?: { locales: string[]; currentLocale: string; defaultLocale: string; style?: string }; showTopBar?: boolean; forceDarkNav?: boolean; linkPrefix?: string; topBar?: TopBarConfig }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const measuredHeroDark = useHeaderContrast(darkBg);
  const isHeroDark = forceDarkNav ? true : measuredHeroDark;

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 50);
    setHidden(latest > 300 && latest > previous);
  });

  const ctaData: NavCta = cta || { label: 'Termin vereinbaren', href: '/kontakt' };
  const topBarConfig: TopBarConfig = {
    enabled: topBar?.enabled ?? true,
    text: topBar?.text || '',
    linkLabel: topBar?.linkLabel || '',
    linkHref: topBar?.linkHref || '',
    bgColor: topBar?.bgColor || '',
    textColor: topBar?.textColor || '',
  };
  const topBarEnabled = showTopBar && topBarConfig.enabled !== false;
  const topBarText = (topBarConfig.text || '').trim();
  const topBarTextColor = (topBarConfig.textColor || '').trim() || '#ffffff';
  const topBarBgColor = (topBarConfig.bgColor || '').trim() || 'var(--brand-topbar, var(--brand-dark))';
  const topBarLinkLabel = (topBarConfig.linkLabel || '').trim();
  const topBarLinkHref = (topBarConfig.linkHref || '').trim();
  const navLinkColorDesktop = brand.navLinkColor || ((scrolled || (!isHeroDark)) ? '#4b5563' : '#ffffff');
  const navLinkHoverColor = brand.linkHoverColor || brand.accentColor || 'var(--brand-accent)';
  const activeNavBg = brand.navBgColor || 'rgba(255,255,255,0.8)';
  const navSurfaceIsDark = !scrolled && darkBg ? true : ((scrolled || (!isHeroDark)) ? isDarkColor(activeNavBg) : isHeroDark);
  const mobileToggleColor = navSurfaceIsDark ? '#ffffff' : '#111827';
  const mobileToggleHoverBg = navSurfaceIsDark ? 'rgba(255,255,255,0.12)' : 'rgba(17,24,39,0.08)';
  const mobileNavBg = (brand.navBgColor || '').trim() || '#ffffff';
  const mobileNavIsDark = isDarkColor(mobileNavBg);
  const navLinkColorMobile = brand.navLinkColor || (mobileNavIsDark ? '#ffffff' : '#1f2937');
  const mobileMutedColor = mobileNavIsDark ? 'rgba(255,255,255,0.72)' : '#6b7280';
  const mobileBorderColor = mobileNavIsDark ? 'rgba(255,255,255,0.12)' : 'rgba(17,24,39,0.08)';
  const mobileHoverBg = mobileNavIsDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,24,39,0.06)';
  const mobileBrandColor = brand.navBrandColor || (mobileNavIsDark ? navLinkColorMobile : brand.primaryColor);

  return (
    <>
      {/* Top bar */}
      {topBarEnabled && <motion.div
        animate={{ y: scrolled || mobileOpen ? -40 : 0, opacity: scrolled || mobileOpen ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[60] text-white/80 text-xs py-2.5"
        style={{ backgroundColor: topBarBgColor, color: topBarTextColor }}
      >
        {topBarText ? (
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-5 min-w-0">
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 hover:opacity-100 opacity-90 transition-opacity">
                  <Phone size={12} className="text-brand-accent" />{contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="hidden sm:flex items-center gap-1.5 hover:opacity-100 opacity-90 transition-opacity truncate max-w-[240px]">
                  <Mail size={12} className="text-brand-accent shrink-0" /><span className="truncate">{contact.email}</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-medium truncate">{topBarText}</span>
              {topBarLinkLabel && topBarLinkHref && (
                <Link
                  href={prefixInternalHref(topBarLinkHref, linkPrefix) as string}
                  {...(topBarLinkHref.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="underline underline-offset-4 opacity-90 hover:opacity-100 whitespace-nowrap"
                >
                  {topBarLinkLabel}
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center gap-5">
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 hover:opacity-100 opacity-90 transition-opacity">
                  <Phone size={12} className="text-brand-accent" />{contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:opacity-100 opacity-90 transition-opacity truncate max-w-[180px] sm:max-w-none">
                  <Mail size={12} className="text-brand-accent shrink-0" /><span className="truncate">{contact.email}</span>
                </a>
              )}
            </div>
            <span className="hidden sm:inline font-medium opacity-80">{brand.tagline}</span>
          </div>
        )}
      </motion.div>}

      {/* Main nav */}
      <motion.header
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-500',
          scrolled || !topBarEnabled ? 'top-0' : 'top-10',
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
                    'text-[13px] font-medium tracking-wide uppercase transition-colors duration-300 hover:text-[var(--nav-link-hover)]',
                    (!scrolled && isHeroDark && !brand.navLinkColor) ? 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]' : '',
                  )}
                  style={{ color: navLinkColorDesktop, ['--nav-link-hover' as string]: navLinkHoverColor }}
                >
                  {item.label}
                </Link>
              ))}
              <NavCtaButton cta={ctaData} scrolled={scrolled} isHeroDark={isHeroDark} linkPrefix={linkPrefix} />
              {i18n && i18n.locales.length > 1 && (
                <LanguageSwitcher locales={i18n.locales} currentLocale={i18n.currentLocale} defaultLocale={i18n.defaultLocale} style={(i18n.style as 'dropdown' | 'inline') || 'dropdown'} />
              )}
            </nav>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: mobileToggleColor }}
              onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = mobileToggleHoverBg; }}
              onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[70] flex flex-col md:hidden"
              style={{ backgroundColor: mobileNavBg, color: navLinkColorMobile }}
            >
              <div className="flex items-center justify-between h-[72px] px-6 border-b" style={{ borderColor: mobileBorderColor }}>
                <Link href={prefixInternalHref(homeHref, linkPrefix) as string} className="flex items-center gap-2 font-display font-bold text-xl tracking-tight" style={{ color: mobileBrandColor }}>
                  {(brand.logoDisplay !== 'name' && brand.logoUrl) && (
                    <Image src={brand.logoUrl} alt={brand.companyName || 'Logo'} width={140} height={40} className="h-9 w-auto object-contain" />
                  )}
                  {(brand.logoDisplay === 'logoAndName' || brand.logoDisplay === 'name' || !brand.logoUrl) && (
                    <span>{brand.companyName || 'Firmenname'}</span>
                  )}
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg transition-colors" style={{ color: navLinkColorMobile }} onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = mobileHoverBg; }} onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = 'transparent'; }}>
                  <X size={24} />
                </button>
              </div>

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
                      className="block text-2xl font-semibold py-3 hover:text-[var(--nav-link-hover)] transition-colors"
                      style={{ color: navLinkColorMobile, ['--nav-link-hover' as string]: navLinkHoverColor }}
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
                  <NavCtaButton
                    cta={ctaData}
                    scrolled={true}
                    isHeroDark={false}
                    linkPrefix={linkPrefix}
                    className="inline-flex items-center justify-center gap-2 w-full text-center bg-brand-primary text-white font-semibold py-4 rounded-full text-lg hover:bg-brand-dark transition"
                  />
                </motion.div>
              </nav>

              <div className="px-8 pb-8 flex flex-col gap-2 text-sm" style={{ color: mobileMutedColor }}>
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <Phone size={14} /> {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <Mail size={14} /> {contact.email}
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {topBarEnabled && <div className="h-10" />}
    </>
  );
}
