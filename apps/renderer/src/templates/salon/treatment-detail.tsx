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

  return <TreatmentClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; treatments: Treatment[] };

function TreatmentClassic({ headline, subline, badgeText, treatments }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badgeText}</motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {treatments.map((item, i) => (
          <motion.article key={`${item.title || 'item'}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] shadow-md" data-edit-collection="treatments" data-edit-index={i}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="50vw" /></div>}
            <div className="p-5">
              {(item.resultLabel || item.durationLabel || item.priceLabel) && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]">{[item.resultLabel, item.durationLabel, item.priceLabel].filter(Boolean).join(' / ')}</p>}
              <h3 className="mt-2 text-xl font-bold text-[color:var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {asList<string>(item.steps).length > 0 && <p className="mt-2 text-sm text-[color:var(--token-muted)]">{asList<string>(item.steps).join(' / ')}</p>}
              {asList<string>(item.careTips).length > 0 && <p className="mt-2 text-sm text-[color:var(--token-muted)]">{asList<string>(item.careTips).join(' / ')}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex rounded-full bg-[var(--token-btn-bg)] px-5 py-2 text-sm font-semibold text-[color:var(--token-on-dark-heading)] shadow-md" data-edit-path="label">{item.cta.label}</a>}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

