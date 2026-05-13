import Link from 'next/link';
import type { FooterData, BrandData } from '@/lib/tenant-data';

export function SiteFooter({ footer, brand }: { footer: FooterData | null; brand: BrandData }) {
  if (!footer) return null;

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      {/* CTA Band */}
      {footer.cta?.label && (
        <div className="max-w-6xl mx-auto px-4 mb-12">
          <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: brand.primaryColor || '#1a5276' }}>
            <Link href={footer.cta.href} className="inline-block font-semibold px-8 py-3 rounded-lg text-lg transition hover:opacity-90" style={{ backgroundColor: brand.accentColor || '#f39c12', color: '#1a1a1a' }}>
              {footer.cta.label}
            </Link>
          </div>
        </div>
      )}

      {/* Columns */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        {footer.columns.map((col, i) => (
          <div key={i}>
            <h4 className="font-semibold text-lg mb-4">{col.title}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {col.items.map((item, j) => (
                <li key={j}>
                  {item.href ? (
                    <Link href={item.href} className="hover:text-white transition">{item.text}</Link>
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
      <div className="max-w-6xl mx-auto px-4 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <span>© {new Date().getFullYear()} {brand.companyName}. Alle Rechte vorbehalten.</span>
        <div className="flex gap-4">
          {footer.legalLinks.map((link, i) => (
            <Link key={i} href={link.href} className="hover:text-white transition">{link.label}</Link>
          ))}
          <span className="text-gray-600">Powered by <span className="text-gray-400">Flamingo</span></span>
        </div>
      </div>
    </footer>
  );
}
