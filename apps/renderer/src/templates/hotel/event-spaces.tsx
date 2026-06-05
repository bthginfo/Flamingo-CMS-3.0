'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';

type Space = { name?: string; description?: string; image?: string; capacityLabel?: string; sizeLabel?: string; seatingOptions?: string[]; features?: string[]; inquiryCta?: { label?: string; href?: string } };
type Step = { title?: string; text?: string; icon?: string };

export function EventSpacesSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Events & Tagungen';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Raeume';
  const spaces = asList<Space>(data.spaces);
  const processHeadline = (data.processHeadline as string) || '';
  const processSteps = asList<Step>(data.processSteps);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, spaces, processHeadline, processSteps, ctaPrimary };

  if (styleVariant === 'modern') return <EventModern {...props} />;
  if (styleVariant === 'bold') return <EventBold {...props} />;
  return <EventClassic {...props} />;
}

type Props = {
  headline: string; subline: string; badgeText: string;
  spaces: Space[]; processHeadline: string; processSteps: Step[];
  ctaPrimary: { label?: string; href?: string };
};

/* --- CLASSIC --- */
function EventClassic({ headline, subline, badgeText, spaces, processHeadline, processSteps, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted,#52525b)]"><Star size={12} className="text-[color:var(--token-icon,var(--brand-primary,#1a5276))]" /><span data-edit-path="badgeText">{badgeText}</span></motion.p>}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</motion.h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {spaces.map((space, index) => (
          <motion.article key={`${space.name}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="overflow-hidden rounded-xl border border-[var(--token-icon, var(--brand-primary))]/20 bg-[var(--token-card-bg,#ffffff)] shadow-md" data-edit-collection="spaces" data-edit-index={index}>
            {space.image && <div className="relative aspect-[4/3]"><Image src={space.image} alt={space.name || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              <h3 className="text-xl font-bold text-[color:var(--token-heading,#18181b)]">{space.name || ''}</h3>
              {space.description && <div className="mt-3 text-sm text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: space.description }} />}
              <p className="mt-3 text-xs text-[color:var(--token-muted,#52525b)]">{[space.capacityLabel, space.sizeLabel].filter(Boolean).join(' / ')}</p>
              {asList<string>(space.seatingOptions).length > 0 && <p className="mt-2 text-xs text-[color:var(--token-muted,#52525b)]">{asList<string>(space.seatingOptions).join(' / ')}</p>}
              {asList<string>(space.features).length > 0 && <p className="mt-2 text-xs text-[color:var(--token-muted,#52525b)]">{asList<string>(space.features).join(' / ')}</p>}
              {space.inquiryCta?.label && <a href={space.inquiryCta.href || '#'} className="mt-4 inline-flex font-semibold text-[color:var(--token-icon,var(--brand-primary,#1a5276))]" data-edit-path="label">{space.inquiryCta.label}</a>}
            </div>
          </motion.article>
        ))}
      </div>
      {processHeadline && <h3 className="mt-10 text-2xl font-bold text-[color:var(--token-heading,#18181b)]">{processHeadline}</h3>}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {processSteps.map((step, index) => (
          <motion.div key={`${step.title}-${index}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="rounded-xl border border-[var(--token-icon, var(--brand-primary))]/20 p-5" data-edit-collection="processSteps" data-edit-index={index}>
            <div className="text-[color:var(--token-icon,var(--brand-primary,#1a5276))]"><DynamicIcon name={step.icon || 'clipboard'} size={22} /></div>
            <h4 className="mt-3 font-semibold text-[color:var(--token-heading,#18181b)]">{step.title || ''}</h4>
            {step.text && <div className="mt-2 text-sm text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: step.text }} />}
          </motion.div>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading,#ffffff)] shadow-lg"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a>}
    </div>
  );
}

/* --- MODERN --- */
function EventModern({ headline, subline, badgeText, spaces, processHeadline, processSteps, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-14 max-w-3xl">
        {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted,#52525b)]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 font-light text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-px border border-black/10 lg:grid-cols-3">
        {spaces.map((space, index) => (
          <article key={`${space.name}-${index}`} className="overflow-hidden border border-black/10 bg-[var(--token-card-bg,#ffffff)]" data-edit-collection="spaces" data-edit-index={index}>
            {space.image && <div className="relative aspect-[4/3]"><Image src={space.image} alt={space.name || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-6">
              <h3 className="text-lg font-light text-[color:var(--token-heading,#18181b)]">{space.name || ''}</h3>
              {space.description && <div className="mt-3 text-sm font-light text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: space.description }} />}
              <p className="mt-3 text-xs font-light text-[color:var(--token-muted,#52525b)]">{[space.capacityLabel, space.sizeLabel].filter(Boolean).join(' / ')}</p>
              {asList<string>(space.seatingOptions).length > 0 && <p className="mt-2 text-xs font-light text-[color:var(--token-muted,#52525b)]">{asList<string>(space.seatingOptions).join(' / ')}</p>}
              {asList<string>(space.features).length > 0 && <p className="mt-2 text-xs font-light text-[color:var(--token-muted,#52525b)]">{asList<string>(space.features).join(' / ')}</p>}
              {space.inquiryCta?.label && <a href={space.inquiryCta.href || '#'} className="mt-4 inline-flex font-light text-[color:var(--token-heading,#18181b)] underline underline-offset-4" data-edit-path="label">{space.inquiryCta.label}</a>}
            </div>
          </article>
        ))}
      </div>
      {processHeadline && <h3 className="mt-12 text-xl font-light text-[color:var(--token-heading,#18181b)]">{processHeadline}</h3>}
      <div className="mt-6 grid gap-px border border-black/10 md:grid-cols-3">
        {processSteps.map((step, index) => (
          <div key={`${step.title}-${index}`} className="border border-black/10 p-6" data-edit-collection="processSteps" data-edit-index={index}>
            <DynamicIcon name={step.icon || 'clipboard'} size={18} className="text-[color:var(--token-muted,#52525b)]" />
            <h4 className="mt-3 font-light text-[color:var(--token-heading,#18181b)]">{step.title || ''}</h4>
            {step.text && <div className="mt-2 text-sm font-light text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: step.text }} />}
          </div>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex items-center gap-2 font-light text-[color:var(--token-heading,#18181b)] underline underline-offset-4"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={14} /></a>}
    </div>
  );
}

/* --- BOLD --- */
function EventBold({ headline, subline, badgeText, spaces, processHeadline, processSteps, ctaPrimary }: Props) {
  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badgeText && <p className="inline-block bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))/10] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[color:var(--token-icon,var(--brand-primary,#1a5276))]" data-edit-path="badgeText">{badgeText}</p>}
        <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase text-[color:var(--token-heading,#18181b)]" data-edit-path="headline">{headline}</h2>
        {subline && <div className="mt-4 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {spaces.map((space, index) => (
          <article key={`${space.name}-${index}`} className="overflow-hidden border-2 border-[#111827] bg-[var(--token-card-bg,#ffffff)] shadow-[4px_4px_0_#111827]" data-edit-collection="spaces" data-edit-index={index}>
            {space.image && <div className="relative aspect-[4/3]"><Image src={space.image} alt={space.name || ''} fill className="object-cover" sizes="33vw" /></div>}
            <div className="p-5">
              <h3 className="text-xl font-black uppercase text-[color:var(--token-heading,#18181b)]">{space.name || ''}</h3>
              {space.description && <div className="mt-3 text-sm text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: space.description }} />}
              <p className="mt-3 text-xs font-bold uppercase text-[color:var(--token-muted,#52525b)]">{[space.capacityLabel, space.sizeLabel].filter(Boolean).join(' / ')}</p>
              {asList<string>(space.seatingOptions).length > 0 && <p className="mt-2 text-xs text-[color:var(--token-muted,#52525b)]">{asList<string>(space.seatingOptions).join(' / ')}</p>}
              {asList<string>(space.features).length > 0 && <p className="mt-2 text-xs text-[color:var(--token-muted,#52525b)]">{asList<string>(space.features).join(' / ')}</p>}
              {space.inquiryCta?.label && <a href={space.inquiryCta.href || '#'} className="mt-4 inline-flex font-black uppercase text-[color:var(--token-icon,var(--brand-primary,#1a5276))]" data-edit-path="label">{space.inquiryCta.label}</a>}
            </div>
          </article>
        ))}
      </div>
      {processHeadline && <h3 className="mt-10 text-2xl font-black uppercase text-[color:var(--token-heading,#18181b)]">{processHeadline}</h3>}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {processSteps.map((step, index) => (
          <div key={`${step.title}-${index}`} className="border-2 border-[#111827] p-5" data-edit-collection="processSteps" data-edit-index={index}>
            <div className="text-[color:var(--token-icon,var(--brand-primary,#1a5276))]"><DynamicIcon name={step.icon || 'clipboard'} size={22} /></div>
            <h4 className="mt-3 font-black uppercase text-[color:var(--token-heading,#18181b)]">{step.title || ''}</h4>
            {step.text && <div className="mt-2 text-sm text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: step.text }} />}
          </div>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)] shadow-[4px_4px_0_var(--token-icon, var(--brand-primary))]"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a>}
    </div>
  );
}
