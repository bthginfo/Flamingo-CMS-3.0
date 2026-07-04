'use client';

import { motion } from 'framer-motion';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';
import { DynamicIcon } from '@/components/ui/icon-map';

type InfoCard = { icon?: string; title?: string; text?: string; items?: string[] };

export function PatientInfoSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Patienteninfo', 'Hinweise');
  const introText = (data.introText as string) || '';
  const cards = asList<InfoCard>(data.cards);

  const props = { header, introText, cards };
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

