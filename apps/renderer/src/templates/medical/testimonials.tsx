'use client';

import { motion } from 'framer-motion';
import { plain } from '@/lib/strip-html';
import { Star } from 'lucide-react';
import { asList, asButton } from './types';
import { SectionHeader, baseHeader } from './shared';
import type { SectionProps, ButtonValue } from './types';

type Testimonial = { quote?: string; name?: string; context?: string; rating?: number; sourceLabel?: string };

export function MedicalTestimonialsSection({ data, styleVariant }: SectionProps) {
  const h = baseHeader(data, 'Patientenstimmen', 'Bewertungen');
  const ratingValue = (data.ratingValue as string) || '';
  const ratingCount = (data.ratingCount as string) || '';
  const items = asList<Testimonial>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { ...h, ratingValue, ratingCount, items, ctaPrimary };

  if (styleVariant === 'modern') return <Mod {...props} />;
  if (styleVariant === 'bold') return <Bold {...props} />;
  return <Classic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; ratingValue: string; ratingCount: string; items: Testimonial[]; ctaPrimary: ButtonValue };

function Stars({ count }: { count: number }) {
  return <div className="flex gap-0.5">{Array.from({ length: count || 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>;
}

function Classic({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader headline={headline} subline={plain(subline)} badgeText={badgeText} />
      {(ratingValue || ratingCount) && <p className="mb-6 text-sm text-[color:var(--token-on-dark-muted,#52525b)]">{[ratingValue, ratingCount].filter(Boolean).join(' · ')}</p>}
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <motion.article key={`${item.name}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="overflow-hidden rounded-xl border border-black/10 bg-[var(--token-card-bg,#ffffff)] p-5 shadow-sm">
            <div className="text-[var(--token-eyebrow, var(--brand-accent)))]"><Stars count={item.rating || 5} /></div>
            {item.quote && <p className="mt-4 text-sm leading-6 text-[color:var(--token-heading,#18181b)]">&ldquo;{plain(item.quote)}&rdquo;</p>}
            <div className="mt-4 border-t border-black/10 pt-3">
              <p className="font-semibold text-[color:var(--token-heading,#18181b)]">{item.name || ''}</p>
              <p className="text-xs text-[color:var(--token-on-dark-muted,#52525b)]">{[item.context, item.sourceLabel].filter(Boolean).join(' · ')}</p>
            </div>
          </motion.article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading,#ffffff)]">{ctaPrimary.label}</a>}
    </div>
  );
}

function Mod({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader headline={headline} subline={plain(subline)} badgeText={badgeText} />
      {(ratingValue || ratingCount) && <p className="mb-8 text-sm font-light text-[color:var(--token-on-dark-muted,#52525b)]">{[ratingValue, ratingCount].filter(Boolean).join(' · ')}</p>}
      <div className="grid gap-8 md:grid-cols-3">
        {items.map((item, i) => (
          <article key={`${item.name}-${i}`} className="border-t border-black/10 pt-6">
            <div className="text-[var(--token-eyebrow, var(--brand-accent)))]"><Stars count={item.rating || 5} /></div>
            {item.quote && <p className="mt-4 text-sm font-light leading-7 text-[color:var(--token-heading,#18181b)]">&ldquo;{plain(item.quote)}&rdquo;</p>}
            <p className="mt-4 font-medium text-[color:var(--token-heading,#18181b)]">{item.name || ''}</p>
            <p className="text-xs font-light text-[color:var(--token-on-dark-muted,#52525b)]">{[item.context, item.sourceLabel].filter(Boolean).join(' · ')}</p>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex items-center gap-2 rounded-lg border border-[#111827] px-5 py-3 font-medium text-[color:var(--token-heading,#18181b)]">{ctaPrimary.label}</a>}
    </div>
  );
}

function Bold({ headline, subline, badgeText, ratingValue, ratingCount, items, ctaPrimary }: Props) {
  return (
    <div>
      <SectionHeader headline={headline} subline={plain(subline)} badgeText={badgeText} />
      {(ratingValue || ratingCount) && <p className="mb-6 text-sm font-bold uppercase text-[color:var(--token-on-dark-muted,#52525b)]">{[ratingValue, ratingCount].filter(Boolean).join(' · ')}</p>}
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <article key={`${item.name}-${i}`} className="border-2 border-[#111827] bg-[var(--token-card-bg,#ffffff)] p-5 shadow-[4px_4px_0_#111827]">
            <div className="text-[var(--token-eyebrow, var(--brand-accent)))]"><Stars count={item.rating || 5} /></div>
            {item.quote && <p className="mt-4 text-sm leading-6 text-[color:var(--token-heading,#18181b)]">&ldquo;{plain(item.quote)}&rdquo;</p>}
            <div className="mt-4 border-t-2 border-[#111827] pt-3">
              <p className="font-black uppercase text-[color:var(--token-heading,#18181b)]">{item.name || ''}</p>
              <p className="text-xs font-bold text-[color:var(--token-on-dark-muted,#52525b)]">{[item.context, item.sourceLabel].filter(Boolean).join(' · ')}</p>
            </div>
          </article>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)] shadow-[4px_4px_0_var(--token-icon, var(--brand-primary))]">{ctaPrimary.label}</a>}
    </div>
  );
}
