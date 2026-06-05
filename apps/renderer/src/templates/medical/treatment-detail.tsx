'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type Treatment = { title?: string; text?: string; image?: string; durationLabel?: string; requirementLabel?: string; noticeText?: string; steps?: string[]; cta?: { label?: string; href?: string } };

export function TreatmentDetailSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Behandlungen im Detail', 'Ablauf');
  const treatments = asList<Treatment>(data.treatments);

  if (styleVariant === 'modern') return <Modern header={header} treatments={treatments} />;
  if (styleVariant === 'bold') return <Bold header={header} treatments={treatments} />;
  return <Classic header={header} treatments={treatments} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; treatments: Treatment[] };

function Classic({ header, treatments }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-6 md:grid-cols-2">
        {treatments.map((item, index) => (
          <article key={`${item.title}-${index}`} className="group overflow-hidden rounded-xl bg-[var(--token-card-bg)] shadow-lg" data-edit-collection="treatments" data-edit-index={index}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="50vw" /></div>}
            <div className="p-5">
              {(item.durationLabel || item.requirementLabel) && <p className="text-xs font-bold uppercase tracking-widest text-[var(--token-badge-text)]">{[item.durationLabel, item.requirementLabel].filter(Boolean).join(' / ')}</p>}
              <h3 className="mt-2 text-xl font-bold text-[var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.steps && item.steps.length > 0 && <p className="mt-2 text-xs text-[var(--token-muted)]">{item.steps.join(' / ')}</p>}
              {item.noticeText && <p className="mt-2 text-xs italic text-[var(--token-muted)]">{item.noticeText}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-4 py-2 text-sm font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{item.cta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}

function Modern({ header, treatments }: Props) {
  return (
    <div>
      <SectionHeader {...header} />
      <div className="grid gap-6 md:grid-cols-2">
        {treatments.map((item, index) => (
          <article key={`${item.title}-${index}`} className="group overflow-hidden border border-[var(--token-card-border)] bg-[var(--token-card-bg)]" data-edit-collection="treatments" data-edit-index={index}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="50vw" /></div>}
            <div className="p-5">
              {(item.durationLabel || item.requirementLabel) && <p className="text-xs font-light uppercase tracking-widest text-[var(--token-badge-text)]">{[item.durationLabel, item.requirementLabel].filter(Boolean).join(' / ')}</p>}
              <h3 className="mt-2 text-xl font-light text-[var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 whitespace-pre-line text-sm font-light leading-6 text-[var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.steps && item.steps.length > 0 && <p className="mt-2 text-xs font-light text-[var(--token-muted)]">{item.steps.join(' / ')}</p>}
              {item.noticeText && <p className="mt-2 text-xs font-light italic text-[var(--token-muted)]">{item.noticeText}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-4 py-2 text-sm font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{item.cta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Bold({ header, treatments }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]" data-edit-path="badgeText">{header.badgeText}</p>}
        <h2 className="mt-3 text-3xl font-black uppercase text-[var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
        {header.subline && <div className="mt-4 text-[var(--token-body)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: header.subline }} />}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {treatments.map((item, index) => (
          <article key={`$<span data-edit-path="title">{item.title}</span>-${index}`} className="group overflow-hidden border-2 border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[4px_4px_0_var(--token-card-border)]" data-edit-collection="treatments" data-edit-index={index}>
            {item.image && <div className="relative aspect-[4/3] overflow-hidden"><Image data-edit-image="image" src={item.image} alt={item.title || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="50vw" /></div>}
            <div className="p-5">
              {(item.durationLabel || item.requirementLabel) && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]">{[item.durationLabel, item.requirementLabel].filter(Boolean).join(' / ')}</p>}
              <h3 className="mt-2 text-xl font-black uppercase text-[var(--token-heading)]" data-edit-path="title">{item.title || ''}</h3>
              {item.text && <div className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: item.text }} />}
              {item.steps && item.steps.length > 0 && <p className="mt-2 text-xs text-[var(--token-muted)]">{item.steps.join(' / ')}</p>}
              {item.noticeText && <p className="mt-2 text-xs text-[var(--token-muted)]">{item.noticeText}</p>}
              {item.cta?.label && <a href={item.cta.href || '#'} className="mt-5 inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-4 py-2 text-sm font-black uppercase text-[var(--token-btn-text)]"><span data-edit-path="label">{item.cta.label}</span><ArrowRight size={14} /></a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
