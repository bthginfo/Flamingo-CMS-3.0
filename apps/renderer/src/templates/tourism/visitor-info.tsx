'use client';

import { motion } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { baseHeader, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';
import { plain } from '@/lib/strip-html';

type InfoBlock = { title?: string; text?: string; icon?: string; items?: string[] };

export function VisitorInfoSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Besuch planen', 'Info');
  const introText = (data.introText as string) || '';
  const blocks = asList<InfoBlock>(data.blocks);

  return <Classic header={header} introText={plain(introText)} blocks={blocks} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; introText: string; blocks: InfoBlock[] };

function Classic({ header, introText, blocks }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <SectionHeader {...header} />
        {introText && <div className="text-[color:var(--token-body)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {blocks.map((block, index) => (
          <motion.article key={`${block.title || 'item'}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="rounded-xl bg-[var(--token-card-bg)] p-5 shadow-lg" data-edit-collection="blocks" data-edit-index={index}>
            <div className="flex gap-4">
              <DynamicIcon editPath="icon" name={block.icon || 'map-pin'} size={20} className="text-[color:var(--token-icon)]" />
              <div>
                <h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{block.title || ''}</h3>
                {block.text && <div className="mt-1 text-sm leading-6 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: block.text }} />}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">{asList<string>(block.items).map((item) => <span key={item} className="rounded-full bg-[var(--token-badge-bg)] px-3 py-1 text-xs text-[color:var(--token-badge-text)]">{item}</span>)}</div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

