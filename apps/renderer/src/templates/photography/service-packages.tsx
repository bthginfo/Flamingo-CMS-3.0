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

export function ServicePackagesSection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Pakete';
  const headline = (data.headline as string) || 'Leistungen & Pakete';
  const subline = (data.subline as string) || '';
  const packages = (data.packages as Package[]) || [];
  const note = (data.note as string) || '';
  const isBold = styleVariant === 'bold';
  const isModern = styleVariant === 'modern';

  const gridCols = packages.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : packages.length >= 3 ? 'md:grid-cols-3' : 'max-w-lg mx-auto';

  if (isModern) {
    return (
      <section className="py-24 md:py-36 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--token-body)] mb-4" data-edit-path="badge">{badge}</p>
          <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-[color:var(--token-heading)] mb-16 break-words" data-edit-path="headline">{headline}</h2>
          <div className={`grid gap-8 ${gridCols}`}>
            {packages.map((pkg, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className={`border-t ${pkg.highlighted ? 'border-[color:var(--token-card-border)]' : 'border-[color:var(--token-card-border)]'} pt-8`} data-edit-collection="packages" data-edit-index={i}>
                <h3 className="text-lg font-light text-[color:var(--token-heading)]" data-edit-path="name">{pkg.name}</h3>
                {pkg.price && <p className="text-2xl font-extralight text-[color:var(--token-heading)] mt-2"><span data-edit-path="price">{pkg.price}</span>{pkg.priceNote && <span className="text-sm text-[color:var(--token-body)] ml-1">{pkg.priceNote}</span>}</p>}
                {pkg.description && <div className="text-[color:var(--token-body)] text-sm mt-3" dangerouslySetInnerHTML={{ __html: pkg.description }} />}
                <ul className="mt-6 space-y-2">
                  {pkg.features.map((f, j) => <li key={j} className="text-[color:var(--token-muted)] text-sm" data-edit-collection="features" data-edit-index={j}>— {f}</li>)}
                </ul>
                {pkg.ctaHref && <a href={pkg.ctaHref} className="inline-block mt-6 text-sm text-[color:var(--token-heading)] border-b border-[color:var(--token-card-border)] hover:opacity-70"><span data-edit-path="ctaLabel">{pkg.ctaLabel || 'Anfragen'}</span> →</a>}
              </motion.div>
            ))}
          </div>
          {note && <p className="text-[color:var(--token-body)] text-sm mt-12" data-edit-path="note">{note}</p>}
        </div>
      </section>
    );
  }

  if (isBold) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg-alt)] text-[color:var(--token-on-dark-heading)]">
        <div className="max-w-6xl mx-auto">
          <span className="inline-block bg-[var(--token-badge-bg)] text-[color:var(--token-heading)] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4" data-edit-path="badge">{badge}</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-12 break-words" data-edit-path="headline">{headline}</h2>
          <div className={`grid gap-4 ${gridCols}`}>
            {packages.map((pkg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`relative p-6 md:p-8 border ${pkg.highlighted ? 'border-[var(--token-card-border)]' : 'border-[color:var(--token-card-border)/10]'}`} data-edit-collection="packages" data-edit-index={i}>
                {pkg.highlighted && <span className="absolute -top-3 left-6 bg-[var(--token-badge-bg)] text-[color:var(--token-heading)] text-[10px] font-bold px-3 py-1">BELIEBT</span>}
                <h3 className="text-xl font-bold text-[color:var(--token-on-dark-heading)]" data-edit-path="name">{pkg.name}</h3>
                {pkg.price && <p className="text-3xl font-black text-[color:var(--token-eyebrow)] mt-3"><span data-edit-path="price">{pkg.price}</span>{pkg.priceNote && <span className="text-sm text-[color:var(--token-on-dark-heading)/70] ml-1">{pkg.priceNote}</span>}</p>}
                {pkg.description && <div className="text-[color:var(--token-on-dark-heading)/80] text-sm mt-3" dangerouslySetInnerHTML={{ __html: pkg.description }} />}
                <ul className="mt-6 space-y-2">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm" data-edit-collection="features" data-edit-index={j}>
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-[color:var(--token-eyebrow)]" />
                      <span className="text-[color:var(--token-on-dark-heading)/80]">{f}</span>
                    </li>
                  ))}
                </ul>
                {pkg.ctaHref && <a href={pkg.ctaHref} className={`mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider w-full justify-center ${pkg.highlighted ? 'bg-[var(--token-badge-bg)] text-[color:var(--token-heading)]' : 'border border-[color:var(--token-card-border)/20] text-[color:var(--token-on-dark-heading)] hover:bg-[var(--token-card-bg)/5]'}`}><span data-edit-path="ctaLabel">{pkg.ctaLabel || 'Anfragen'}</span> <ArrowRight className="w-4 h-4" /></a>}
              </motion.div>
            ))}
          </div>
          {note && <p className="text-[color:var(--token-on-dark-heading)/40] text-sm mt-10 italic" data-edit-path="note">{note}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-24 px-4 md:px-6 bg-[var(--token-btn-bg)]/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        <div className={`grid gap-8 ${gridCols}`}>
          {packages.map((pkg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative rounded-2xl p-5 md:p-8 ${pkg.highlighted ? 'bg-[var(--token-btn-bg)] text-[color:var(--token-on-dark-heading)] shadow-xl ring-2 ring-brand-primary/20 md:scale-[1.02]' : 'bg-[var(--token-card-bg)] shadow-sm border border-[color:var(--token-card-border)]'}`} data-edit-collection="packages" data-edit-index={i}>
              {pkg.highlighted && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--token-badge-bg)] text-[color:var(--token-on-dark-heading)] text-xs font-bold px-3 py-1 rounded-full">Beliebt</span>}
              <h3 className={`text-xl font-bold ${pkg.highlighted ? 'text-[color:var(--token-on-dark-heading)]' : 'text-[color:var(--token-heading)]'}`} data-edit-path="name">{pkg.name}</h3>
              {pkg.price && (
                <div className="mt-3">
                  <span className={`text-2xl md:text-3xl font-bold ${pkg.highlighted ? 'text-[color:var(--token-on-dark-heading)]' : 'text-[color:var(--token-icon)]'}`} data-edit-path="price">{pkg.price}</span>
                  {pkg.priceNote && <span className={`text-sm ml-1 ${pkg.highlighted ? 'text-[color:var(--token-on-dark-heading)/70]' : 'text-[color:var(--token-muted)]'}`}>{pkg.priceNote}</span>}
                </div>
              )}
              {pkg.description && <div className={`mt-3 text-sm ${pkg.highlighted ? 'text-[color:var(--token-on-dark-heading)/80]' : 'text-[color:var(--token-muted)]'}`} dangerouslySetInnerHTML={{ __html: pkg.description }} />}
              <ul className="mt-6 space-y-3">
                {pkg.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" data-edit-collection="features" data-edit-index={j}>
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${pkg.highlighted ? 'text-[color:var(--token-eyebrow)]' : 'text-[color:var(--token-icon)]'}`} />
                    <span className={pkg.highlighted ? 'text-[color:var(--token-on-dark-heading)/90]' : 'text-[color:var(--token-muted)]'}>{f}</span>
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
