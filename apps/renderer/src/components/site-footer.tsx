import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Youtube, Globe, Music } from 'lucide-react';
import type { FooterData, BrandData, ContactData, SocialLinks } from '@/lib/tenant-data';
import { prefixInternalHref } from '@/lib/link-prefix';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram, facebook: Facebook, linkedin: Linkedin, youtube: Youtube, google: Globe, tiktok: Music,
};

/** Returns true if the hex color is "light" (luminance > 0.4) */
function isLightColor(hex: string | undefined): boolean {
  if (!hex || !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) return false;
  const h = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
  const r = parseInt(h.slice(1, 3), 16) / 255;
  const g = parseInt(h.slice(3, 5), 16) / 255;
  const b = parseInt(h.slice(5, 7), 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.4;
}

export function SiteFooter({ footer, brand, contact, socialLinks, linkPrefix = '' }: { footer: FooterData | null; brand: BrandData; contact?: ContactData; socialLinks?: SocialLinks; linkPrefix?: string }) {
  if (!footer) return null;

  const socials = Object.entries(socialLinks || {}).filter(([, url]) => url);
  const footerBg = (brand as Record<string, unknown>).footerColor as string | undefined;
  const lightFooter = isLightColor(footerBg);

  return (
    <footer id="site-footer" className="relative overflow-hidden" style={{ backgroundColor: 'var(--brand-footer, var(--brand-dark))', color: 'var(--brand-footer-text, white)' }}>
      <style dangerouslySetInnerHTML={{ __html: `#site-footer a { color: var(--brand-footer-link, rgb(156 163 175)) } #site-footer a:hover { opacity: 0.8 }` }} />
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
              <Link href={prefixInternalHref(footer.cta.href, linkPrefix) as string} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-accent text-gray-900 font-medium text-sm hover:opacity-90 transition-opacity mb-3">
                {footer.cta.label}
              </Link>
            )}
            {(brand.logoDisplay !== 'name' && brand.logoUrl) && (
              <Image src={brand.logoUrl} alt={brand.companyName || 'Logo'} width={180} height={50} className="h-10 w-auto object-contain brightness-0 invert" />
            )}
            {(brand.logoDisplay === 'logoAndName' || brand.logoDisplay === 'name' || !brand.logoUrl) && (
              <div className="font-display font-bold text-2xl">{brand.companyName}</div>
            )}
            {brand.tagline && (
              <p className="text-sm leading-relaxed max-w-xs opacity-90">{brand.tagline}</p>
            )}
            {/* Contact info */}
            <div className="flex flex-col gap-2.5 pt-2">
              {contact?.address && (
                <span className="text-sm opacity-90 flex items-center gap-2.5">
                  <MapPin size={14} className="text-brand-accent shrink-0" />{contact.address}
                </span>
              )}
              {contact?.phone && (
                <a href={`tel:${contact.phone}`} className="text-sm opacity-90 flex items-center gap-2.5 hover:opacity-100 transition-colors">
                  <Phone size={14} className="text-brand-accent shrink-0" />{contact.phone}
                </a>
              )}
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="text-sm opacity-90 flex items-center gap-2.5 hover:opacity-100 transition-colors">
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
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer" aria-label={platform.charAt(0).toUpperCase() + platform.slice(1)} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${lightFooter ? 'bg-black/[0.08] text-gray-700 hover:bg-brand-accent hover:text-white' : 'bg-white/[0.06] text-white/90 hover:bg-brand-accent hover:text-gray-900'}`}>
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
              .map((col, i) => (
              <div key={i}>
                <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white mb-5">{col.title}</h3>
                <ul className="space-y-3">
                  {(col.items || []).map((item, j) => (
                    <li key={j}>
                      {item.href ? (
                        <Link href={prefixInternalHref(item.href, linkPrefix) as string} className="text-sm opacity-90 hover:opacity-100 hover:translate-x-0.5 inline-block transition-all duration-200">
                          {item.text}
                        </Link>
                      ) : (
                        <span className="text-sm opacity-90">{item.text}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs opacity-80">
            © {new Date().getFullYear()} {brand.companyName}. Alle Rechte vorbehalten.
          </span>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {footer.legalLinks.map((link, i) => (
              <Link key={i} href={prefixInternalHref(link.href, linkPrefix) as string} className="text-xs opacity-80 hover:opacity-100 transition-colors duration-200">
                {link.label}
              </Link>
            ))}
            <span className="text-xs opacity-80 flex items-center gap-1">
              Made with <Heart size={10} className="text-brand-accent fill-brand-accent" /> by <a href="https://www.flamingomedia.online" target="_blank" rel="noopener noreferrer" className="text-brand-accent font-medium hover:underline">Flamingo Media</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
