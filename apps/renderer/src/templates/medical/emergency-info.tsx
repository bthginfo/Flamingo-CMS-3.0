'use client';

import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type EmergencyItem = { title?: string; text?: string; phoneLabel?: string; phoneHref?: string };

export function EmergencyInfoSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Notfallhinweise', 'Akut');
  const introText = (data.introText as string) || '';
  const items = asList<EmergencyItem>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { header, introText, items, ctaPrimary };
  if (styleVariant === 'modern') return <Modern {...props} />;
  if (styleVariant === 'bold') return <Bold {...props} />;
  return <Classic {...props} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; introText: string; items: EmergencyItem[]; ctaPrimary: { label?: string; href?: string } };

function Classic({ header, introText, items, ctaPrimary }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-lg sm:p-8">
      <SectionHeader {...header} />
      {introText && <p className="max-w-3xl text-sm leading-6 text-red-900/80">{introText}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border-t border-red-200 pt-4">
            <AlertCircle size={18} className="text-red-700" />
            <h3 className="mt-2 font-bold text-red-950">{item.title || ''}</h3>
            {item.text && <p className="mt-2 text-sm leading-6 text-red-900/75">{item.text}</p>}
            {item.phoneLabel && <a href={item.phoneHref || '#'} className="mt-3 inline-flex font-semibold text-red-950">{item.phoneLabel}</a>}
          </article>
        ))}
      </div>
      <div className="mt-6"><CtaButton cta={ctaPrimary} /></div>
    </motion.div>
  );
}

function Modern({ header, introText, items, ctaPrimary }: Props) {
  return (
    <div className="border border-red-200 bg-red-50/50 p-6 sm:p-8">
      <SectionHeader {...header} />
      {introText && <p className="max-w-3xl text-sm font-light leading-6 text-red-900/80">{introText}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border-t border-red-200 pt-4">
            <AlertCircle size={18} className="text-red-600" />
            <h3 className="mt-2 font-light text-red-950">{item.title || ''}</h3>
            {item.text && <p className="mt-2 text-sm font-light leading-6 text-red-900/75">{item.text}</p>}
            {item.phoneLabel && <a href={item.phoneHref || '#'} className="mt-3 inline-flex font-semibold text-red-700">{item.phoneLabel}</a>}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-6"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] border border-red-600 bg-red-600 px-5 py-3 font-semibold text-white">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}

function Bold({ header, introText, items, ctaPrimary }: Props) {
  return (
    <div className="border-2 border-red-500 bg-gray-950 p-6 shadow-[4px_4px_0_theme(colors.red.700)] sm:p-8">
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-red-400">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-white sm:text-5xl">{header.headline}</h2>
        {header.subline && <p className="mt-4 text-white/70">{header.subline}</p>}
      </div>
      {introText && <p className="max-w-3xl text-sm leading-6 text-white/70">{introText}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="border-t border-red-500/40 pt-4">
            <AlertCircle size={18} className="text-red-400" />
            <h3 className="mt-2 font-black uppercase text-white">{item.title || ''}</h3>
            {item.text && <p className="mt-2 text-sm leading-6 text-white/70">{item.text}</p>}
            {item.phoneLabel && <a href={item.phoneHref || '#'} className="mt-3 inline-flex font-black uppercase text-red-400">{item.phoneLabel}</a>}
          </article>
        ))}
      </div>
      {ctaPrimary.label && <div className="mt-6"><a href={ctaPrimary.href || '#'} className="inline-flex items-center gap-2 border-2 border-red-500 bg-red-500 px-5 py-3 font-black uppercase text-white shadow-[4px_4px_0_theme(colors.red.800)]">{ctaPrimary.label}<ArrowRight size={16} /></a></div>}
    </div>
  );
}
