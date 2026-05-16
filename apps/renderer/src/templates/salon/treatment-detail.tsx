'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { asList, type SectionProps } from './types';

type Treatment = { title?: string; text?: string; image?: string; resultLabel?: string; durationLabel?: string; priceLabel?: string; steps?: string[]; careTips?: string[]; cta?: { label?: string; href?: string } };

export function TreatmentDetailSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Behandlungen im Detail';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Details';
  const treatments = asList<Treatment>(data.treatments);

  const props = { headline, subline, badgeText, treatments };

  if (styleVariant === 'modern') return <TreatmentModern {...props} />;
  if (styleVariant === 'bold') return <TreatmentBold {...props} />;
  return <TreatmentClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; treatments: Treatment[] };

function TreatmentClassic({ headline, subline, badgeText, treatments }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-gray-600">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-5xl font-[700] text-gray-900">{headline}</motion.h2>
        {subline && <p className="mt-4 text-gray-600">{subline}</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {treatments.map((item, i) => (
          <motion.article key={`${item.title}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group overflow-hidden rounded-xl border border-[var(--brand-primary)]/20 bg-white shadow-md">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="50vw" /></div>}
            <div className="p-5">
              {(item.resultLabel || item.durationLabel || item.priceLabel) && <p className="text-xs font-bold uppercase tracking-widest text-gray-600">{[item.resultLabel, item.durationLabel, item.priceLabel].filter(Boolean).join(' / ')}</p>}
              <h3 className="mt-2 text-xl font-bold text-gray-900">{item.title || ''}</h3>
              {item.text && <p className="mt-3 text-sm leading-6 text-gray-600">{item.text}</p>}
              {asList<string>(item.steps).length > 0 && <p className="mt-2 text-sm text-gray-600">{asList<string>(item.steps).join(' / ')}</p>}
              {asList<string>(item.careTips).length > 0 && <p className="mt-2 text-sm text-gray-600">{asList<string>(item.careTips).join(' / ')}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex rounded-full bg-[#111827] px-5 py-2 text-sm font-semibold text-white shadow-md">{item.cta.label}</a>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function TreatmentModern({ headline, subline, badgeText, treatments }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-gray-600">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-5xl text-gray-900">{headline}</h2>
        {subline && <p className="mt-4 font-light text-gray-600">{subline}</p>}
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {treatments.map((item, i) => (
          <article key={`${item.title}-${i}`} className="group">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="mt-4">
              {(item.resultLabel || item.durationLabel || item.priceLabel) && <p className="text-xs font-light uppercase tracking-[0.3em] text-gray-600">{[item.resultLabel, item.durationLabel, item.priceLabel].filter(Boolean).join(' / ')}</p>}
              <h3 className="mt-2 text-xl font-light text-gray-900">{item.title || ''}</h3>
              {item.text && <p className="mt-3 text-sm font-light leading-6 text-gray-600">{item.text}</p>}
              {asList<string>(item.steps).length > 0 && <p className="mt-2 text-sm font-light text-gray-600">{asList<string>(item.steps).join(' / ')}</p>}
              {asList<string>(item.careTips).length > 0 && <p className="mt-2 text-sm font-light text-gray-600">{asList<string>(item.careTips).join(' / ')}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-4 inline-flex border-b border-brand-accent pb-1 text-sm font-light text-gray-900">{item.cta.label}</a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TreatmentBold({ headline, subline, badgeText, treatments }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="text-xs font-black uppercase tracking-widest text-brand-accent">{badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl text-gray-900">{headline}</h2>
        {subline && <p className="mt-4 font-bold text-gray-600">{subline}</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {treatments.map((item, i) => (
          <article key={`${item.title}-${i}`} className="group overflow-hidden border-2 border-[#111827] bg-[#111] shadow-[4px_4px_0_var(--brand-accent)]">
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt={item.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="p-5">
              {(item.resultLabel || item.durationLabel || item.priceLabel) && <span className="inline-block bg-brand-accent px-3 py-1 text-xs font-black uppercase text-white">{[item.resultLabel, item.durationLabel, item.priceLabel].filter(Boolean).join(' / ')}</span>}
              <h3 className="mt-2 text-xl font-black uppercase text-white">{item.title || ''}</h3>
              {item.text && <p className="mt-3 text-sm leading-6 text-white/70">{item.text}</p>}
              {asList<string>(item.steps).length > 0 && <p className="mt-2 text-sm text-white/60">{asList<string>(item.steps).join(' / ')}</p>}
              {asList<string>(item.careTips).length > 0 && <p className="mt-2 text-sm text-white/60">{asList<string>(item.careTips).join(' / ')}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex bg-brand-accent px-5 py-2 text-sm font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{item.cta.label}</a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
