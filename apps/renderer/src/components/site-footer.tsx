import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Youtube, Globe, Music, Undo2 } from 'lucide-react';
import type { FooterData, BrandData, ContactData, SocialLinks } from '@/lib/tenant-data';
import { prefixInternalHref } from '@/lib/link-prefix';
import { getBrandCssVars } from '@/lib/brand-colors';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram, facebook: Facebook, linkedin: Linkedin, youtube: Youtube, google: Globe, tiktok: Music,
};

function legalLinkLabel(label: string | undefined, href: string | undefined): string {
  const explicit = label?.trim();
  if (explicit) return explicit;
  const path = href?.toLocaleLowerCase('de-DE') || '';
  if (path.includes('datenschutz')) return 'Datenschutz';
  if (path.includes('impressum')) return 'Impressum';
  if (path.includes('widerruf')) return 'Widerrufsrecht';
  if (path.includes('agb')) return 'AGB';
  return 'Rechtliche Hinweise';
}

export function SiteFooter({ footer, brand, contact, socialLinks, linkPrefix = '', shopEnabled = false }: { footer: FooterData | null; brand: BrandData; contact?: ContactData; socialLinks?: SocialLinks; linkPrefix?: string; shopEnabled?: boolean }) {
  if (!footer) return null;

  const socials = Object.entries(socialLinks || {}).filter(([, url]) => url);
  const footerVars = getBrandCssVars(brand);
  const lightFooter = footerVars['--brand-footer-text'] === '#000000';

  return (
    <footer id="site-footer" className="relative overflow-hidden" style={{ backgroundColor: 'var(--brand-footer, var(--brand-dark))', color: 'var(--brand-footer-text, white)' }}>
      <style>{`#site-footer a { color: var(--brand-footer-link, var(--brand-footer-text, #fff)) } #site-footer a:hover { text-decoration: underline; text-decoration-thickness: 0.08em; text-underline-offset: 0.25em } #site-footer a[data-footer-button], #site-footer a[data-footer-icon]:hover { color: var(--token-btn-text) } #site-footer a[data-footer-button]:hover, #site-footer a[data-footer-icon]:hover { text-decoration: none }`}</style>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-primary/[0.04] rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-brand-secondary/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10">
        {/* Top: Logo/brand + contact + social */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-white/[0.08]">
          {/* Brand block */}
          <div className="lg:col-span-4 space-y-5">
            {footer.cta?.label && footer.cta?.href && (
              <Link data-footer-button href={prefixInternalHref(footer.cta.href, linkPrefix) as string} className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-2.5 text-sm font-medium text-[color:var(--token-btn-text)] transition-transform hover:-translate-y-0.5">
                {footer.cta.label}
              </Link>
            )}
            {(brand.logoDisplay !== 'name' && brand.logoUrl) && (
              <Image src={brand.logoUrl} alt={brand.companyName || 'Logo'} width={180} height={50} className={`h-10 w-auto object-contain brightness-0 ${lightFooter ? '' : 'invert'}`} />
            )}
            {(brand.logoDisplay === 'logoAndName' || brand.logoDisplay === 'name' || !brand.logoUrl) && (
              <div className="font-display font-bold text-2xl">{brand.companyName}</div>
            )}
            {brand.tagline && (
              <p className="max-w-xs text-sm leading-relaxed">{brand.tagline}</p>
            )}
            {/* Contact info */}
            <div className="flex flex-col gap-2.5 pt-2">
              {contact?.address && (
                <span className="flex items-center gap-2.5 text-sm">
                  <MapPin size={14} className="text-brand-accent shrink-0" />{contact.address}
                </span>
              )}
              {contact?.phone && (
                <a href={`tel:${contact.phone}`} className="flex items-center gap-2.5 text-sm transition-colors">
                  <Phone size={14} className="text-brand-accent shrink-0" />{contact.phone}
                </a>
              )}
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-sm transition-colors">
                  <Mail size={14} className="text-brand-accent shrink-0" />{contact.email}
                </a>
              )}
            </div>
            {/* Social icons */}
            {socials.length > 0 && (
              <div className="flex items-center gap-3 pt-3">
                {socials.map(([platform, url]) => {
                  const Icon = SOCIAL_ICONS[platform];
                  return Icon ? (
                    <a data-footer-icon key={platform} href={url} target="_blank" rel="noopener noreferrer" aria-label={platform.charAt(0).toUpperCase() + platform.slice(1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--brand-footer-text)_8%,transparent)] text-[color:var(--brand-footer-link)] transition-all duration-300 hover:bg-[var(--token-btn-bg)]">
                      <Icon size={16} />
                    </a>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Link columns – skip "Kontakt" column when contact info is already shown in the brand block */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10">
            {footer.columns
              .filter((col) => !(contact && col.title?.toLowerCase() === 'kontakt'))
              .map((col, i) => {
                const rawLinks = (col.items || (col as unknown as { links?: { label?: string; text?: string; href?: string }[] }).links || []) as Array<{ label?: string; text?: string; href?: string }>;
                const links = rawLinks
                  .map((item) => ({
                    text: item.text || item.label || '',
                    href: item.href,
                  }))
                  .filter((item) => item.text);
                return (
              <div key={i}>
                <h3 className="font-display mb-5 text-sm font-semibold uppercase tracking-wider text-[color:var(--brand-footer-text)]">{col.title}</h3>
                <ul className="space-y-3">
                  {links.map((item, j) => (
                    <li key={j}>
                      {item.href ? (
                        <Link href={prefixInternalHref(item.href, linkPrefix) as string} className="inline-block text-sm transition-all duration-200 hover:translate-x-0.5">
                          {item.text}
                        </Link>
                      ) : (
                        <span className="text-sm">{item.text}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
                );
              })}
          </div>
        </div>

        {/* Shop legal: a prominent right-of-withdrawal button is legally required
            on every page of a shop, so it sits above the small legal links. */}
        {shopEnabled && (
          <div className="pt-8 flex justify-center sm:justify-start">
            <Link
              href={prefixInternalHref('/widerrufsbelehrung', linkPrefix) as string}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-brand-accent text-sm font-semibold hover:bg-brand-accent/10 transition-colors"
            >
              <Undo2 size={16} className="text-brand-accent" />
              Widerrufsrecht
            </Link>
          </div>
        )}

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs">
            © {new Date().getFullYear()} {brand.companyName}. Alle Rechte vorbehalten.
          </span>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {footer.legalLinks.map((link, i) => (
              <Link key={i} href={prefixInternalHref(link.href, linkPrefix) as string} className="text-xs hover:underline transition-colors duration-200">
                {legalLinkLabel(link.label, link.href)}
              </Link>
            ))}
            <span className="text-xs flex items-center gap-1">
              Made with <Heart size={10} className="text-brand-accent fill-brand-accent" /> by <a href="https://www.flamingomedia.online" target="_blank" rel="noopener noreferrer" className="text-brand-accent font-medium hover:underline">Flamingo Media</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
