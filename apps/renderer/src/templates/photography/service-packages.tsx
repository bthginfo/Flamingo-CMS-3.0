'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

type Package = {
  name: string;
  title?: string;
  price?: string;
  priceNote?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  cta?: { label?: string; href?: string };
};

export function ServicePackagesSection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Pakete';
  const headline = (data.headline as string) || 'Leistungen & Pakete';
  const subline = (data.subline as string) || '';
  const packages = ((data.packages as Package[]) || []).map((pkg) => ({
    ...pkg,
    name: pkg.name || pkg.title || '',
    ctaLabel: pkg.ctaLabel || pkg.cta?.label || '',
    ctaHref: pkg.ctaHref || pkg.cta?.href || '',
  }));
  const note = (data.note as string) || '';

  const gridCols = packages.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : packages.length >= 3 ? 'md:grid-cols-3' : 'max-w-lg mx-auto';

  return (
    <section className="py-12 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        <div className={`grid gap-8 ${gridCols}`}>
          {packages.map((pkg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative rounded-2xl p-5 md:p-8 ${pkg.highlighted ? 'bg-[var(--token-btn-bg)] text-[color:var(--token-on-dark-heading)] shadow-xl ring-2 ring-brand-primary/20 md:scale-[1.02]' : 'bg-[var(--token-card-bg)] shadow-sm border border-[color:var(--token-card-border)]'}`} data-edit-collection="packages" data-edit-index={i}>
              {pkg.highlighted && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--token-badge-bg)] text-[color:var(--token-on-dark-heading)] text-xs font-bold px-3 py-1 rounded-full">Beliebt</span>}
              <h3 className={`text-xl font-bold ${pkg.highlighted ? 'text-[color:var(--token-on-dark-heading)]' : 'text-[color:var(--token-heading)]'}`} data-edit-path="name">{pkg.name}</h3>
              {pkg.price && (
                <div className="mt-3">
                  <span className={`text-2xl md:text-3xl font-bold ${pkg.highlighted ? 'text-[color:var(--token-price)]' : 'text-[color:var(--token-price)]'}`} data-edit-path="price">{pkg.price}</span>
                  {pkg.priceNote && <span className={`text-sm ml-1 ${pkg.highlighted ? 'text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_70%,transparent)]' : 'text-[color:var(--token-muted)]'}`}>{pkg.priceNote}</span>}
                </div>
              )}
              {pkg.description && <div className={`mt-3 text-sm ${pkg.highlighted ? 'text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_80%,transparent)]' : 'text-[color:var(--token-muted)]'}`} data-edit-rich="description" dangerouslySetInnerHTML={{ __html: pkg.description }} />}
              <ul className="mt-6 space-y-3">
                {pkg.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" data-edit-collection="features" data-edit-index={j}>
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${pkg.highlighted ? 'text-[color:var(--token-check)]' : 'text-[color:var(--token-check)]'}`} />
                    <span className={pkg.highlighted ? 'text-[color:color-mix(in_srgb,var(--token-on-dark-heading)_90%,transparent)]' : 'text-[color:var(--token-muted)]'}>{f}</span>
                  </li>
                ))}
              </ul>
              {pkg.ctaHref && (
                <a href={pkg.ctaHref} className={`mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors w-full justify-center ${pkg.highlighted ? 'bg-[var(--token-card-bg)] text-[color:var(--token-icon)] hover:bg-[var(--token-section-bg-alt)]' : 'bg-[var(--token-btn-bg)] text-[color:var(--token-on-dark-heading)] hover:bg-[var(--token-section-bg-alt)]'}`}>
                  <span data-edit-path="ctaLabel">{pkg.ctaLabel || 'Anfragen'}</span> <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
        {note && <p className="text-center text-[color:var(--token-muted)] text-sm mt-10 italic" data-edit-path="note">{note}</p>}
      </div>
    </section>
  );
}
