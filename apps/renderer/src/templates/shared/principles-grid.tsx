'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { plain } from '@/lib/strip-html';

type Principle = { title?: string; text?: string; eyebrow?: string };
type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function PrinciplesGridSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const principles = ((data.principles as Principle[]) || []).filter(item => item.title || item.text);
  const cta = (data.cta as Cta) || {};
  if (!principles.length && !headline) return null;

  return (
    <section className="relative overflow-hidden bg-[var(--token-section-bg)] py-24 md:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18),transparent_32%,rgba(255,255,255,0.10))]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-4xl">
          {badge && <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--token-badge-border)] bg-[var(--token-badge-bg)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--token-badge-text)]"><Sparkles size={14} /><span data-edit-path="badge">{badge}</span></div>}
          {headline && <h2 className="text-4xl font-black leading-none text-[color:var(--token-heading)] md:text-6xl lg:text-7xl" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="mt-6 max-w-3xl text-lg leading-8 text-[color:var(--token-body)]" data-edit-path="subline">{plain(subline)}</p>}
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {principles.map((item, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.05 }}
              className="min-h-[280px] rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] px-8 py-10"
             data-edit-collection="principles" data-edit-index={index}>
              <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--token-card-badge-bg)] text-sm font-black text-[color:var(--token-card-badge-text)]">
                {String(index + 1).padStart(2, '0')}
              </div>
              {item.eyebrow && <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--token-eyebrow)]" data-edit-path="eyebrow">{item.eyebrow}</div>}
              {item.title && <h3 className="text-2xl font-black leading-tight text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{item.title}</h3>}
              {item.text && <p className="mt-4 text-sm leading-7 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="text">{plain(item.text)}</p>}
            </motion.article>
          ))}
        </div>

        {cta.label && (
          <a data-edit-link="cta" href={cta.href || '#'} className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-6 py-3 text-sm font-bold text-[color:var(--token-btn-text)]">
            <span data-edit-path="label">{cta.label}</span><ArrowRight size={16} />
          </a>
        )}
      </div>
    </section>
  );
}
