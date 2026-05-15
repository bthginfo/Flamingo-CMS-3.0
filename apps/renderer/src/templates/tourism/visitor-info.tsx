'use client';

import { motion } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type InfoBlock = { title?: string; text?: string; icon?: string; items?: string[] };

export function VisitorInfoSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Besuch planen', 'Info');
  const introText = (data.introText as string) || '';
  const blocks = asList<InfoBlock>(data.blocks);

  if (styleVariant === 'modern') return <Modern header={header} introText={introText} blocks={blocks} />;
  if (styleVariant === 'bold') return <Bold header={header} introText={introText} blocks={blocks} />;
  return <Classic header={header} introText={introText} blocks={blocks} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; introText: string; blocks: InfoBlock[] };

function Classic({ header, introText, blocks }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <SectionHeader {...header} />
        {introText && <p className="text-[var(--style-text-secondary)]">{introText}</p>}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {blocks.map((block, index) => (
          <motion.article key={`${block.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="rounded-xl bg-[var(--style-card-bg)] p-5 shadow-lg">
            <div className="flex gap-4">
              <DynamicIcon name={block.icon || 'map-pin'} size={20} className="text-green-700" />
              <div>
                <h3 className="font-semibold text-[var(--style-text-primary)]">{block.title || ''}</h3>
                {block.text && <p className="mt-1 text-sm leading-6 text-[var(--style-text-secondary)]">{block.text}</p>}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">{asList<string>(block.items).map((item) => <span key={item} className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-800">{item}</span>)}</div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Modern({ header, introText, blocks }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <SectionHeader {...header} />
        {introText && <p className="font-light text-[var(--style-text-secondary)]">{introText}</p>}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {blocks.map((block, index) => (
          <article key={`${block.title}-${index}`} className="border border-black/10 bg-[var(--style-card-bg)] p-5">
            <div className="flex gap-4">
              <DynamicIcon name={block.icon || 'map-pin'} size={20} className="text-teal-600" />
              <div>
                <h3 className="font-light text-[var(--style-text-primary)]">{block.title || ''}</h3>
                {block.text && <p className="mt-1 text-sm font-light leading-6 text-[var(--style-text-secondary)]">{block.text}</p>}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">{asList<string>(block.items).map((item) => <span key={item} className="border border-black/10 px-3 py-1 text-xs text-[var(--style-text-secondary)]">{item}</span>)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Bold({ header, introText, blocks }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <div className="mb-10 max-w-3xl">
          {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-orange-500">{header.badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase text-[var(--style-text-primary)] sm:text-5xl">{header.headline}</h2>
          {header.subline && <p className="mt-4 text-[var(--style-text-secondary)]">{header.subline}</p>}
        </div>
        {introText && <p className="text-[var(--style-text-secondary)]">{introText}</p>}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {blocks.map((block, index) => (
          <article key={`${block.title}-${index}`} className="border-2 border-[var(--style-text-primary)] bg-[var(--style-card-bg)] p-5 shadow-[4px_4px_0_var(--style-text-primary)]">
            <div className="flex gap-4">
              <DynamicIcon name={block.icon || 'map-pin'} size={20} className="text-orange-500" />
              <div>
                <h3 className="font-black uppercase text-[var(--style-text-primary)]">{block.title || ''}</h3>
                {block.text && <p className="mt-1 text-sm leading-6 text-[var(--style-text-secondary)]">{block.text}</p>}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">{asList<string>(block.items).map((item) => <span key={item} className="border border-orange-500 px-3 py-1 text-xs font-bold uppercase text-orange-500">{item}</span>)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
