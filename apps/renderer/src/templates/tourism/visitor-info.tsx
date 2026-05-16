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
        {introText && <div className="text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {blocks.map((block, index) => (
          <motion.article key={`${block.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="rounded-xl bg-white p-5 shadow-lg">
            <div className="flex gap-4">
              <DynamicIcon name={block.icon || 'map-pin'} size={20} className="text-green-700" />
              <div>
                <h3 className="font-semibold text-gray-900">{block.title || ''}</h3>
                {block.text && <div className="mt-1 text-sm leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: block.text }} />}
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
        {introText && <div className="font-light text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {blocks.map((block, index) => (
          <article key={`${block.title}-${index}`} className="border border-black/10 bg-white p-5">
            <div className="flex gap-4">
              <DynamicIcon name={block.icon || 'map-pin'} size={20} className="text-teal-600" />
              <div>
                <h3 className="font-light text-gray-900">{block.title || ''}</h3>
                {block.text && <div className="mt-1 text-sm font-light leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: block.text }} />}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">{asList<string>(block.items).map((item) => <span key={item} className="border border-black/10 px-3 py-1 text-xs text-gray-600">{item}</span>)}</div>
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
          <h2 className="mt-3 text-3xl font-black uppercase text-gray-900 sm:text-3xl md:text-5xl">{header.headline}</h2>
          {header.subline && <div className="mt-4 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
        </div>
        {introText && <div className="text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {blocks.map((block, index) => (
          <article key={`${block.title}-${index}`} className="border-2 border-[#111827] bg-white p-5 shadow-[4px_4px_0_#111827]">
            <div className="flex gap-4">
              <DynamicIcon name={block.icon || 'map-pin'} size={20} className="text-orange-500" />
              <div>
                <h3 className="font-black uppercase text-gray-900">{block.title || ''}</h3>
                {block.text && <div className="mt-1 text-sm leading-6 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: block.text }} />}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">{asList<string>(block.items).map((item) => <span key={item} className="border border-orange-500 px-3 py-1 text-xs font-bold uppercase text-orange-500">{item}</span>)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
