import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Youtube, Globe, Music } from 'lucide-react';
import type { FooterData, BrandData, ContactData, SocialLinks } from '@/lib/tenant-data';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram, facebook: Facebook, linkedin: Linkedin, youtube: Youtube, google: Globe, tiktok: Music,
};

export function SiteFooter({ footer, brand, contact, socialLinks }: { footer: FooterData | null; brand: BrandData; contact?: ContactData; socialLinks?: SocialLinks }) {
  if (!footer) return null;

  const socials = Object.entries(socialLinks || {}).filter(([, url]) => url);

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
            {(brand.logoDisplay !== 'name' && brand.logoUrl) && (
              <Image src={brand.logoUrl} alt={brand.companyName || 'Logo'} width={180} height={50} className="h-10 w-auto object-contain brightness-0 invert" />
            )}
            {(brand.logoDisplay === 'logoAndName' || brand.logoDisplay === 'name' || !brand.logoUrl) && (
              <div className="font-display font-bold text-2xl">{brand.companyName}</div>
            )}
            {brand.tagline && (
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{brand.tagline}</p>
            )}
            {/* Contact info */}
            <div className="flex flex-col gap-2.5 pt-2">
              {contact?.address && (
                <span className="text-sm text-gray-400 flex items-center gap-2.5">
                  <MapPin size={14} className="text-brand-accent shrink-0" />{contact.address}
                </span>
              )}
              {contact?.phone && (
                <a href={`tel:${contact.phone}`} className="text-sm text-gray-400 flex items-center gap-2.5 hover:text-white transition-colors">
                  <Phone size={14} className="text-brand-accent shrink-0" />{contact.phone}
                </a>
              )}
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="text-sm text-gray-400 flex items-center gap-2.5 hover:text-white transition-colors">
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
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-gray-400 hover:bg-brand-accent hover:text-gray-900 transition-all duration-300">
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
                <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-white/70 mb-5">{col.title}</h4>
                <ul className="space-y-3">
                  {col.items.map((item, j) => (
                    <li key={j}>
                      {item.href ? (
                        <Link href={item.href} className="text-gray-400 text-sm hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200">
                          {item.text}
                        </Link>
                      ) : (
                        <span className="text-gray-400 text-sm">{item.text}</span>
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
          <span className="text-xs text-gray-500">
            © {new Date().getFullYear()} {brand.companyName}. Alle Rechte vorbehalten.
          </span>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {footer.legalLinks.map((link, i) => (
              <Link key={i} href={link.href} className="text-xs text-gray-500 hover:text-white transition-colors duration-200">
                {link.label}
              </Link>
            ))}
            <span className="text-xs text-gray-600 flex items-center gap-1">
              Made with <Heart size={10} className="text-brand-accent fill-brand-accent" /> by <span className="text-brand-accent font-medium">Flamingo</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
