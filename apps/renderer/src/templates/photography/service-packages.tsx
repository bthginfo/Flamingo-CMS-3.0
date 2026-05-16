'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type Package = {
  name: string;
  price?: string;
  priceNote?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};

export function ServicePackagesSection({ data }: Props) {
  const badge = (data.badge as string) || 'Pakete';
  const headline = (data.headline as string) || 'Leistungen & Pakete';
  const subline = (data.subline as string) || '';
  const packages = (data.packages as Package[]) || [];
  const note = (data.note as string) || '';

  return (
    <section className="py-24 px-6 bg-brand-primary/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-badge">{badge}</span>
          <h2 className="section-headline">{headline}</h2>
          {subline && <p className="section-subline">{subline}</p>}
        </div>

        <div className={`grid gap-8 ${packages.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : packages.length >= 3 ? 'md:grid-cols-3' : 'max-w-lg mx-auto'}`}>
          {packages.map((pkg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative rounded-2xl p-8 ${pkg.highlighted ? 'bg-brand-primary text-white shadow-xl ring-2 ring-brand-primary/20 scale-[1.02]' : 'bg-white shadow-sm border border-gray-100'}`}>
              {pkg.highlighted && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-full">Beliebt</span>}
              <h3 className={`text-xl font-bold ${pkg.highlighted ? 'text-white' : 'text-gray-900'}`}>{pkg.name}</h3>
              {pkg.price && (
                <div className="mt-3">
                  <span className={`text-3xl font-bold ${pkg.highlighted ? 'text-white' : 'text-brand-primary'}`}>{pkg.price}</span>
                  {pkg.priceNote && <span className={`text-sm ml-1 ${pkg.highlighted ? 'text-white/70' : 'text-gray-500'}`}>{pkg.priceNote}</span>}
                </div>
              )}
              {pkg.description && <p className={`mt-3 text-sm ${pkg.highlighted ? 'text-white/80' : 'text-gray-600'}`}>{pkg.description}</p>}
              <ul className="mt-6 space-y-3">
                {pkg.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${pkg.highlighted ? 'text-brand-accent' : 'text-brand-primary'}`} />
                    <span className={pkg.highlighted ? 'text-white/90' : 'text-gray-700'}>{f}</span>
                  </li>
                ))}
              </ul>
              {pkg.ctaHref && (
                <a href={pkg.ctaHref} className={`mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors w-full justify-center ${pkg.highlighted ? 'bg-white text-brand-primary hover:bg-gray-100' : 'bg-brand-primary text-white hover:bg-brand-dark'}`}>
                  {pkg.ctaLabel || 'Anfragen'} <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {note && <p className="text-center text-gray-500 text-sm mt-10 italic">{note}</p>}
      </div>
    </section>
  );
}
