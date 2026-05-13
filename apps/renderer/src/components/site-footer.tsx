import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { FooterData, BrandData } from '@/lib/tenant-data';

export function SiteFooter({ footer, brand }: { footer: FooterData | null; brand: BrandData }) {
  if (!footer) return null;

  return (
    <footer className="bg-brand-dark text-white">
      {/* CTA Band */}
      {footer.cta?.label && (
        <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-10 mb-16">
          <div className="rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary p-10 text-center shadow-2xl">
            <Link href={footer.cta.href} className="inline-flex items-center gap-2 font-display font-semibold px-8 py-4 rounded-xl text-lg bg-brand-accent text-gray-900 hover:brightness-110 transition shadow-lg">
              {footer.cta.label}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}

      {/* Columns */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {footer.columns.map((col, i) => (
          <div key={i}>
            <h4 className="font-display font-semibold text-lg mb-5">{col.title}</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {col.items.map((item, j) => (
                <li key={j}>
                  {item.href ? (
                    <Link href={item.href} className="hover:text-white transition-colors duration-200">{item.text}</Link>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} {brand.companyName}. Alle Rechte vorbehalten.</span>
          <div className="flex items-center gap-4">
            {footer.legalLinks.map((link, i) => (
              <Link key={i} href={link.href} className="hover:text-white transition-colors duration-200">{link.label}</Link>
            ))}
            <span className="text-gray-600">Powered by <span className="text-brand-accent font-medium">Flamingo</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
