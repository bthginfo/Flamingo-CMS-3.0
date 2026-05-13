import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import type { FooterData, BrandData } from '@/lib/tenant-data';

export function SiteFooter({ footer, brand }: { footer: FooterData | null; brand: BrandData }) {
  if (!footer) return null;

  return (
    <footer className="relative bg-brand-dark text-white overflow-hidden">
      {/* Subtle gradient mesh */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-secondary/5 rounded-full blur-[120px]" />
      </div>

      {/* CTA Band */}
      {footer.cta?.label && (
        <div className="max-w-7xl mx-auto px-6 pt-16 relative z-10 mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-primary to-brand-secondary p-12 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
            <div className="relative z-10">
              <Link
                href={footer.cta.href}
                className="group inline-flex items-center gap-2.5 font-display font-semibold px-10 py-5 rounded-full text-lg bg-brand-accent text-gray-900 hover:brightness-110 transition-all duration-300 shadow-lg hover:shadow-glow-accent hover:-translate-y-0.5"
              >
                {footer.cta.label}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Columns */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand column */}
        <div className="md:col-span-1">
          <div className="font-display font-bold text-xl mb-4">{brand.companyName}</div>
          {brand.tagline && (
            <p className="text-sm text-gray-400 leading-relaxed">
              {brand.tagline}
            </p>
          )}
        </div>
        {footer.columns.map((col, i) => (
          <div key={i}>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-gray-300 mb-5">{col.title}</h4>
            <ul className="space-y-3">
              {col.items.map((item, j) => (
                <li key={j}>
                  {item.href ? (
                    <Link href={item.href} className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
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

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-500">
            © {new Date().getFullYear()} {brand.companyName}. Alle Rechte vorbehalten.
          </span>
          <div className="flex items-center gap-6">
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
