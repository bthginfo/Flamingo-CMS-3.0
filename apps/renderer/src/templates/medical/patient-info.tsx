'use client';

import { motion } from 'framer-motion';
import { baseHeader, IconRows, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

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
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <SectionHeader {...header} />
        {introText && <div className="text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {cards.map((card, index) => (
          <article key={`$<span data-edit-path="title">{card.title}</span>-${index}`} className="rounded-xl bg-[var(--token-card-bg)] p-5 shadow-lg" data-edit-collection="cards" data-edit-index={index}>
            <IconRows items={[card]} />
            <div className="mt-4 flex flex-wrap gap-2">{asList<string>(card.items).map((item) => <span key={item} className="rounded-full bg-teal-50 px-3 py-1 text-xs text-teal-800">{item}</span>)}</div>
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
        {introText && <div className="font-light text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {cards.map((card, index) => (
          <article key={`$<span data-edit-path="title">{card.title}</span>-${index}`} className="border border-black/10 bg-[var(--token-card-bg)] p-5" data-edit-collection="cards" data-edit-index={index}>
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
          {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-teal-400" data-edit-path="badgeText">{header.badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase text-[color:var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
          {header.subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
        </div>
        {introText && <div className="text-[color:var(--token-muted)] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {cards.map((card, index) => (
          <article key={`$<span data-edit-path="title">{card.title}</span>-${index}`} className="border-2 border-[#111827] bg-[var(--token-card-bg)] p-5 shadow-[4px_4px_0_#111827]" data-edit-collection="cards" data-edit-index={index}>
            <IconRows items={[card]} />
            <div className="mt-4 flex flex-wrap gap-2">{asList<string>(card.items).map((item) => <span key={item} className="border border-teal-400 px-3 py-1 text-xs font-bold uppercase text-teal-600">{item}</span>)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
