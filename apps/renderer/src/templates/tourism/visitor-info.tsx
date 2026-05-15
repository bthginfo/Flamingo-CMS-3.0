'use client';

import { baseHeader, IconRows, SectionHeader, asList } from './shared';
import type { SectionProps } from './types';

type InfoBlock = { title?: string; text?: string; icon?: string; items?: string[] };

export function VisitorInfoSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Besuch planen', 'Info');
  const introText = (data.introText as string) || '';
  const blocks = asList<InfoBlock>(data.blocks);
  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <SectionHeader {...header} />
        {introText && <p className="text-[var(--style-text-secondary)]">{introText}</p>}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {blocks.map((block, index) => (
          <article key={`${block.title}-${index}`} className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-5 shadow-[var(--style-card-shadow)]">
            <IconRows items={[{ icon: block.icon, title: block.title, text: block.text }]} />
            <div className="mt-4 flex flex-wrap gap-2">{asList<string>(block.items).map((item) => <span key={item} className="rounded-full bg-[var(--style-section-bg-alt)] px-3 py-1 text-xs text-[var(--style-text-secondary)]">{item}</span>)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
