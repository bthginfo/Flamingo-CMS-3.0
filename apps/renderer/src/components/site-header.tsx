'use client';

import { useState, useEffect, useRef } from 'react';
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
import { useModalFocusTrap } from '@/hooks/use-modal-focus-trap';

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

function MobileTopBarContact({ contact }: { contact: ContactData }) {
  const email = contact.email?.trim();
  const phone = contact.phone?.trim();
  const value = email || phone;

  if (!value) return null;

  const href = email ? `mailto:${email}` : `tel:${phone}`;
  const Icon = email ? Mail : Phone;

  return (
    <a
      data-site-header-mobile-contact
      href={href}
      className="flex min-h-10 min-w-0 flex-1 items-center gap-2 py-2 text-[12px] leading-4 opacity-90 transition-opacity hover:opacity-100 sm:hidden"
    >
      <Icon size={13} className="shrink-0 text-brand-accent" aria-hidden="true" />
      <span className="min-w-0 whitespace-normal [overflow-wrap:anywhere]">{value}</span>
    </a>
  );
}

export function SiteHeader({ navItems, brand, contact, darkBg = true, cta, homeHref = '/', i18n, showTopBar = true, forceDarkNav = false, linkPrefix = '', topBar }: { navItems: NavItem[]; brand: BrandData; contact: ContactData; darkBg?: boolean; cta?: NavCta | null; homeHref?: string; i18n?: { locales: string[]; currentLocale: string; defaultLocale: string; style?: string }; showTopBar?: boolean; forceDarkNav?: boolean; linkPrefix?: string; topBar?: TopBarConfig }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [topBarHeight, setTopBarHeight] = useState(40);
  const topBarRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuCloseRef = useRef<HTMLButtonElement>(null);
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const measuredHeroDark = useHeaderContrast(darkBg);
  const isHeroDark = forceDarkNav ? true : measuredHeroDark;

  useModalFocusTrap({
    active: mobileOpen,
    containerRef: mobileMenuRef,
    initialFocusRef: mobileMenuCloseRef,
    onEscape: () => setMobileOpen(false),
  });

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
  const topBarOffset = topBarEnabled ? topBarHeight : 0;
  const topBarHidden = scrolled || mobileOpen;
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
  const denseDesktopNav = navItems.length > 6;

  useEffect(() => {
    if (!topBarEnabled || !topBarRef.current) return;

    const element = topBarRef.current;
    const updateHeight = () => {
      const measuredHeight = Math.max(40, Math.ceil(element.getBoundingClientRect().height));
      setTopBarHeight((currentHeight) => currentHeight === measuredHeight ? currentHeight : measuredHeight);
    };

    updateHeight();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, [contact.email, contact.phone, topBarEnabled, topBarLinkLabel, topBarText]);

  return (
    <>
      {/* Top bar */}
      {topBarEnabled && <motion.div
        ref={topBarRef}
        animate={{ y: topBarHidden ? -topBarOffset : 0, opacity: topBarHidden ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 right-0 top-0 z-[60] min-h-10 text-xs text-white/80"
        style={{ backgroundColor: topBarBgColor, color: topBarTextColor }}
      >
        {topBarText ? (
          <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
            <MobileTopBarContact contact={contact} />
            <div className="hidden min-w-0 items-center gap-5 sm:flex">
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
            <div className={cn('min-w-0 flex-1 items-center justify-between gap-3 sm:flex sm:flex-none sm:justify-start', (contact.email || contact.phone) ? 'hidden' : 'flex')}>
              <span className="min-w-0 whitespace-normal font-medium [overflow-wrap:anywhere] sm:whitespace-nowrap">{topBarText}</span>
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
          <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-between px-4 sm:px-6">
            <MobileTopBarContact contact={contact} />
            <div className="hidden items-center gap-5 sm:flex">
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 hover:opacity-100 opacity-90 transition-opacity">
                  <Phone size={12} className="text-brand-accent" />{contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 opacity-90 transition-opacity hover:opacity-100">
                  <Mail size={12} className="shrink-0 text-brand-accent" />{contact.email}
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
        className="fixed left-0 right-0 z-50 transition-all duration-500"
        style={{ top: scrolled || !topBarEnabled ? 0 : topBarOffset }}
      >
        <div className={cn(
          'transition-all duration-500',
          scrolled
            ? 'backdrop-blur-2xl shadow-lg border-b border-gray-100/50'
            : isHeroDark ? 'bg-gradient-to-b from-black/70 via-black/30 to-transparent' : 'backdrop-blur-sm shadow-sm',
        )}
        style={(scrolled || (!isHeroDark)) ? { backgroundColor: brand.navBgColor || 'rgba(255,255,255,0.8)' } : undefined}
        >
          <div className="mx-auto flex h-[72px] max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link href={prefixInternalHref(homeHref, linkPrefix) as string} className="flex min-w-0 shrink-0 items-center gap-2 font-display text-xl font-bold tracking-tight transition-colors duration-300" style={{ color: (scrolled || (!isHeroDark)) ? (brand.navBrandColor || brand.primaryColor) : 'white' }}>
              {(brand.logoDisplay !== 'name' && brand.logoUrl) && (
                brand.navLogoColor ? (
                  <span
                    className="inline-block h-9 w-[118px] lg:w-[132px] 2xl:w-[140px]"
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
                  <Image src={brand.logoUrl} alt={brand.companyName || 'Logo'} width={140} height={40} className="h-9 w-auto max-w-[118px] object-contain lg:max-w-[132px] 2xl:max-w-[140px]" />
                )
              )}
              {(brand.logoDisplay === 'logoAndName' || brand.logoDisplay === 'name' || !brand.logoUrl) && (
                <span>{brand.companyName || 'Firmenname'}</span>
              )}
              {(brand.logoDisplay !== 'logoAndName' && brand.logoDisplay !== 'name' && brand.logoUrl) && (
                <span className="sr-only">{brand.companyName || 'Startseite'}</span>
              )}
            </Link>

            <nav
              className={cn(
                'hidden min-w-0 flex-1 items-center justify-end',
                denseDesktopNav ? '2xl:flex gap-4' : 'xl:flex gap-4 2xl:gap-6',
              )}
            >
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  href={prefixInternalHref(item.href, linkPrefix) as string}
                  className={cn(
                    'whitespace-nowrap font-semibold tracking-wide uppercase transition-colors duration-300 hover:text-[var(--nav-link-hover)]',
                    denseDesktopNav ? 'text-[11px]' : 'text-[12px] 2xl:text-[13px]',
                    (!scrolled && isHeroDark && !brand.navLinkColor) ? 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]' : '',
                  )}
                  style={{ color: navLinkColorDesktop, ['--nav-link-hover' as string]: navLinkHoverColor }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="shrink-0">
                <NavCtaButton cta={ctaData} scrolled={scrolled} isHeroDark={isHeroDark} linkPrefix={linkPrefix} />
              </div>
              {i18n && i18n.locales.length > 1 && (
                <LanguageSwitcher locales={i18n.locales} currentLocale={i18n.currentLocale} defaultLocale={i18n.defaultLocale} style={(i18n.style as 'dropdown' | 'inline') || 'dropdown'} />
              )}
            </nav>

            <button
              ref={mobileMenuTriggerRef}
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
              aria-expanded={mobileOpen}
              aria-controls="site-mobile-menu"
              aria-haspopup="dialog"
              className={cn('rounded-lg p-2 transition-colors', denseDesktopNav ? '2xl:hidden' : 'xl:hidden')}
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
              ref={mobileMenuRef}
              id="site-mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Hauptmenü"
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={cn('fixed inset-0 z-[70] flex flex-col', denseDesktopNav ? '2xl:hidden' : 'xl:hidden')}
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
                  {(brand.logoDisplay !== 'logoAndName' && brand.logoDisplay !== 'name' && brand.logoUrl) && (
                    <span className="sr-only">{brand.companyName || 'Startseite'}</span>
                  )}
                </Link>
                <button ref={mobileMenuCloseRef} type="button" aria-label="Menü schließen" onClick={() => setMobileOpen(false)} className="p-2 rounded-lg transition-colors" style={{ color: navLinkColorMobile }} onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = mobileHoverBg; }} onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = 'transparent'; }}>
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
                {i18n && i18n.locales.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navItems.length * 0.05 + 0.15 }}
                    className="mt-6"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LanguageSwitcher locales={i18n.locales} currentLocale={i18n.currentLocale} defaultLocale={i18n.defaultLocale} style="inline" />
                  </motion.div>
                )}
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

      {topBarEnabled && <div aria-hidden="true" style={{ height: topBarOffset }} />}
    </>
  );
}
