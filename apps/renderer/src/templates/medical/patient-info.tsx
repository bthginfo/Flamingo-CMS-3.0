'use client';

import { motion } from 'framer-motion';
import { baseHeader, IconRows, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';
import { DynamicIcon } from '@/components/ui/icon-map';

type InfoCard = { icon?: string; title?: string; text?: string; items?: string[] };

export function PatientInfoSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Patienteninfo', 'Hinweise');
  const introText = (data.introText as string) || '';
  const cards = asList<InfoCard>(data.cards);

  const props = { header, introText, cards };
  if (styleVariant === 'modern') return <Modern {...props} />;
  if (styleVariant === 'bold') return <Bold {...props} />;
  return <Classic {...props} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; introText: string; cards: InfoCard[] };

function Classic({ header, introText, cards }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
      <div className="lg:sticky lg:top-28">
        <SectionHeader {...header} />
        {introText && <div className="-mt-3 max-w-xl text-[color:var(--token-muted)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card, index) => (
          <article key={`${card.title}-${index}`} className="group rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl" data-edit-collection="cards" data-edit-index={index}>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--token-icon)_13%,transparent)] text-[color:var(--token-icon)]">
                <DynamicIcon editPath="icon" name={card.icon || 'stethoscope'} size={20} />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[color:var(--token-heading)]" data-edit-path="title">{card.title || ''}</h3>
                {card.text && <div className="mt-2 text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: card.text }} />}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">{asList<string>(card.items).map((item) => <span key={item} className="rounded-full bg-[color-mix(in_srgb,var(--token-icon)_10%,transparent)] px-3 py-1 text-xs font-medium text-[color:var(--token-heading)]">{item}</span>)}</div>
          </article>
        ))}
      </div>
    </motion.div>
  );
}

function Modern({ header, introText, cards }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <SectionHeader {...header} />
        {introText && <div className="font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {cards.map((card, index) => (
          <article key={`${card.title || 'item'}-${index}`} className="border border-black/10 bg-[var(--token-card-bg)] p-5" data-edit-collection="cards" data-edit-index={index}>
            <IconRows items={[card]} />
            <div className="mt-4 flex flex-wrap gap-2">{asList<string>(card.items).map((item) => <span key={item} className="border border-black/10 px-3 py-1 text-xs text-[color:var(--token-muted)]">{item}</span>)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Bold({ header, introText, cards }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <div className="mb-10 max-w-3xl">
          {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]" data-edit-path="badgeText">{header.badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase text-[color:var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
          {header.subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: header.subline }} />}
        </div>
        {introText && <div className="text-[color:var(--token-muted)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {cards.map((card, index) => (
          <article key={`${card.title || 'item'}-${index}`} className="border-2 border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-5 shadow-[4px_4px_0_var(--token-card-border)]" data-edit-collection="cards" data-edit-index={index}>
            <IconRows items={[card]} />
            <div className="mt-4 flex flex-wrap gap-2">{asList<string>(card.items).map((item) => <span key={item} className="border border-[var(--token-success)] px-3 py-1 text-xs font-bold uppercase text-[var(--token-success)]">{item}</span>)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
