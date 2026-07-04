'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function CtaSplitSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || '';
  const headline = (data.headline as string) || '';
  const text = (data.text as string) || (data.subline as string) || '';
  const image = (data.image as string) || '';
  const checklist = (data.checklist as string[]) || [];
  const primaryCta = (data.primaryCta as Cta) || {};
  const secondaryCta = (data.secondaryCta as Cta) || {};
  const note = (data.note as string) || '';
  const reversed = data.reversed === true;
  if (!headline) return null;

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-xl">
      <div className={`grid lg:grid-cols-2 ${reversed ? 'lg:[direction:rtl]' : ''}`}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col justify-center p-8 md:p-14 [direction:ltr]">
          {badge && <span className="mb-4 w-fit rounded-full border border-[var(--token-badge-border)] bg-[var(--token-badge-bg)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badge">{badge}</span>}
          <h2 className="text-3xl font-bold leading-tight text-[color:var(--token-card-heading,var(--token-heading))] md:text-4xl" data-edit-path="headline">{headline}</h2>
          {text && <div className="mt-4 max-w-xl leading-7 text-[color:var(--token-card-body,var(--token-body))] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: text }} />}
          {checklist.length > 0 && (
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[color:var(--token-card-body,var(--token-body))]" data-edit-collection="checklist" data-edit-index={i}>
                  <Check size={17} className="mt-0.5 shrink-0 text-[color:var(--token-check)]" />{item}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {primaryCta.label && (
              <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="group inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-7 py-3.5 font-bold text-[color:var(--token-btn-text)] shadow-lg transition hover:-translate-y-0.5 hover:brightness-110">
                <span data-edit-path="label">{primaryCta.label}</span>
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </a>
            )}
            {secondaryCta.label && (
              <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--token-card-border)] px-7 py-3.5 font-semibold text-[color:var(--token-card-heading,var(--token-heading))] transition hover:bg-[var(--token-badge-bg)]">
                <span data-edit-path="label">{secondaryCta.label}</span>
              </a>
            )}
          </div>
          {note && <p className="mt-4 text-xs text-[color:var(--token-card-muted,var(--token-muted))]" data-edit-path="note">{plain(note)}</p>}
        </motion.div>
        {image && (
          <div className="relative min-h-[300px] lg:min-h-[460px] [direction:ltr]">
            <img data-edit-image="image" src={image} alt={headline} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
