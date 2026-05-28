'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <section className="relative overflow-hidden bg-[var(--style-section-bg,#0b0b10)] py-16 text-white md:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_32%,rgba(255,255,255,0.05))]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-4xl">
          {badge && <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--style-badge-text,#ffffff)]"><Sparkles size={14} />{badge}</div>}
          {headline && <h2 className="text-4xl font-black leading-none text-[var(--style-heading-color,#ffffff)] md:text-6xl lg:text-7xl">{headline}</h2>}
          {subline && <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--style-subheading-color,rgba(255,255,255,0.74))]">{subline}</p>}
        </div>

        <div className="mt-12 grid gap-[2px] overflow-hidden rounded-2xl border border-[var(--style-border-color,rgba(255,255,255,0.12))] bg-[var(--style-border-color,rgba(255,255,255,0.12))] md:grid-cols-2 lg:grid-cols-4">
          {principles.map((item, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.05 }}
              className="min-h-[260px] bg-[var(--style-card-bg,#101018)] p-8"
            >
              <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--style-badge-bg,rgba(255,255,255,0.10))] text-sm font-black text-[var(--style-icon-color,var(--brand-primary,#f24171))]">
                {String(index + 1).padStart(2, '0')}
              </div>
              {item.eyebrow && <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--style-accent-color,var(--brand-primary,#f24171))]">{item.eyebrow}</div>}
              {item.title && <h3 className="text-2xl font-black leading-tight text-[var(--style-heading-color,#ffffff)]">{item.title}</h3>}
              {item.text && <p className="mt-4 text-sm leading-7 text-[var(--style-body-color,rgba(255,255,255,0.70))]">{item.text}</p>}
            </motion.article>
          ))}
        </div>

        {cta.label && (
          <a href={cta.href || '#'} className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--brand-btn-bg,#ffffff)] px-6 py-3 text-sm font-bold text-[var(--brand-btn-text,#111111)]">
            {cta.label}<ArrowRight size={16} />
          </a>
        )}
      </div>
    </section>
  );
}
