'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';

type Treatment = { title?: string; text?: string; durationLabel?: string; priceLabel?: string; image?: string; cta?: { label?: string; href?: string } };
type Feature = { icon?: string; title?: string; text?: string };

export function WellnessSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Wellness';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Spa';
  const introText = (data.introText as string) || '';
  const imagePrimary = (data.imagePrimary as string) || '';
  const imageSecondary = (data.imageSecondary as string) || '';
  const treatments = asList<Treatment>(data.treatments);
  const features = asList<Feature>(data.features);
  const ctaPrimary = asButton(data.ctaPrimary);

  const props = { headline, subline, badgeText, introText, imagePrimary, imageSecondary, treatments, features, ctaPrimary };

  if (styleVariant === 'modern') return <WellnessModern {...props} />;
  if (styleVariant === 'bold') return <WellnessBold {...props} />;
  return <WellnessClassic {...props} />;
}

type Props = {
  headline: string; subline: string; badgeText: string; introText: string;
  imagePrimary: string; imageSecondary: string; treatments: Treatment[];
  features: Feature[]; ctaPrimary: { label?: string; href?: string };
};

/* --- CLASSIC --- */
function WellnessClassic({ headline, subline, badgeText, introText, imagePrimary, imageSecondary, treatments, features, ctaPrimary }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-6 max-w-3xl">
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted,#52525b)]"><Star size={12} className="text-[color:var(--token-icon,var(--brand-primary,#1a5276))]" />{badgeText}</motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading,#18181b)]">{headline}</motion.h2>
          {subline && <div className="mt-4 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {introText && <div className="text-[color:var(--token-muted,#52525b)] leading-7 rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-8 grid gap-4">
          {features.map((feature, index) => (
            <motion.div key={`${feature.title}-${index}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-4 border-t border-[var(--token-icon, var(--brand-primary))]/20 pt-4">
              <div className="text-[color:var(--token-icon,var(--brand-primary,#1a5276))]"><DynamicIcon name={feature.icon || 'heart'} size={20} /></div>
              <div><h3 className="font-semibold text-[color:var(--token-heading,#18181b)]">{feature.title || ''}</h3>{feature.text && <div className="text-sm text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: feature.text }} />}</div>
            </motion.div>
          ))}
        </div>
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading,#ffffff)] shadow-lg">{ctaPrimary.label}<ArrowRight size={16} /></a>}
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {imagePrimary && <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-xl shadow-md"><Image src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {imageSecondary && <div className="relative aspect-square overflow-hidden rounded-xl shadow-md"><Image src={imageSecondary} alt="" fill className="object-cover" sizes="25vw" /></div>}
        </div>
        {treatments.map((treatment, index) => (
          <motion.article key={`${treatment.title}-${index}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="rounded-xl border border-[var(--token-icon, var(--brand-primary))]/20 bg-[var(--token-card-bg,#ffffff)] p-5 shadow-md">
            {treatment.image && <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl"><Image src={treatment.image} alt={treatment.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="flex justify-between gap-4"><h3 className="font-bold text-[color:var(--token-heading,#18181b)]">{treatment.title || ''}</h3><span className="text-sm text-[color:var(--token-muted,#52525b)]">{treatment.priceLabel || ''}</span></div>
            {treatment.text && <div className="mt-2 text-sm text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: treatment.text }} />}
            {treatment.durationLabel && <p className="mt-2 text-xs text-[color:var(--token-muted,#52525b)]">{treatment.durationLabel}</p>}
            {treatment.cta?.label && <a href={treatment.cta.href || '#'} className="mt-4 inline-flex font-semibold text-[color:var(--token-icon,var(--brand-primary,#1a5276))]">{treatment.cta.label}</a>}
          </motion.article>
        ))}
      </div>
    </div>
  );
}

/* --- MODERN --- */
function WellnessModern({ headline, subline, badgeText, introText, imagePrimary, imageSecondary, treatments, features, ctaPrimary }: Props) {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <div className="mb-8 max-w-3xl">
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted,#52525b)]">{badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading,#18181b)]">{headline}</h2>
          {subline && <div className="mt-4 font-light text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {introText && <div className="font-light text-[color:var(--token-muted,#52525b)] leading-7 rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-8 grid gap-4">
          {features.map((feature, index) => (
            <div key={`${feature.title}-${index}`} className="flex gap-4 border-t border-black/10 pt-4">
              <DynamicIcon name={feature.icon || 'heart'} size={18} className="text-[color:var(--token-muted,#52525b)]" />
              <div><h3 className="font-light text-[color:var(--token-heading,#18181b)]">{feature.title || ''}</h3>{feature.text && <div className="text-sm font-light text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: feature.text }} />}</div>
            </div>
          ))}
        </div>
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-10 inline-flex items-center gap-2 font-light text-[color:var(--token-heading,#18181b)] underline underline-offset-4">{ctaPrimary.label}<ArrowRight size={14} /></a>}
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-black/10">
          {imagePrimary && <div className="relative col-span-2 aspect-[16/10] overflow-hidden"><Image src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {imageSecondary && <div className="relative aspect-square overflow-hidden border-t border-black/10"><Image src={imageSecondary} alt="" fill className="object-cover" sizes="25vw" /></div>}
        </div>
        {treatments.map((treatment, index) => (
          <article key={`${treatment.title}-${index}`} className="border border-black/10 bg-[var(--token-card-bg,#ffffff)] p-6">
            {treatment.image && <div className="relative mb-5 aspect-[16/9] overflow-hidden"><Image src={treatment.image} alt={treatment.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="flex justify-between gap-4"><h3 className="font-light text-[color:var(--token-heading,#18181b)]">{treatment.title || ''}</h3><span className="text-sm font-light text-[color:var(--token-muted,#52525b)]">{treatment.priceLabel || ''}</span></div>
            {treatment.text && <div className="mt-2 text-sm font-light text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: treatment.text }} />}
            {treatment.durationLabel && <p className="mt-2 text-xs font-light text-[color:var(--token-muted,#52525b)]">{treatment.durationLabel}</p>}
            {treatment.cta?.label && <a href={treatment.cta.href || '#'} className="mt-4 inline-flex font-light text-[color:var(--token-heading,#18181b)] underline underline-offset-4">{treatment.cta.label}</a>}
          </article>
        ))}
      </div>
    </div>
  );
}

/* --- BOLD --- */
function WellnessBold({ headline, subline, badgeText, introText, imagePrimary, imageSecondary, treatments, features, ctaPrimary }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-6 max-w-3xl">
          {badgeText && <p className="inline-block bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))/10] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[color:var(--token-icon,var(--brand-primary,#1a5276))]">{badgeText}</p>}
          <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase text-[color:var(--token-heading,#18181b)]">{headline}</h2>
          {subline && <div className="mt-4 text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {introText && <div className="text-[color:var(--token-muted,#52525b)] leading-7 rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-8 grid gap-4">
          {features.map((feature, index) => (
            <div key={`${feature.title}-${index}`} className="flex gap-4 border-t-2 border-[#111827] pt-4">
              <div className="text-[color:var(--token-icon,var(--brand-primary,#1a5276))]"><DynamicIcon name={feature.icon || 'heart'} size={20} /></div>
              <div><h3 className="font-black uppercase text-[color:var(--token-heading,#18181b)]">{feature.title || ''}</h3>{feature.text && <div className="text-sm text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: feature.text }} />}</div>
            </div>
          ))}
        </div>
        {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-[color:var(--token-on-dark-heading,#ffffff)] shadow-[4px_4px_0_var(--token-icon, var(--brand-primary))]">{ctaPrimary.label}<ArrowRight size={16} /></a>}
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {imagePrimary && <div className="relative col-span-2 aspect-[16/10] overflow-hidden border-2 border-[#111827] shadow-[4px_4px_0_#111827]"><Image src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {imageSecondary && <div className="relative aspect-square overflow-hidden border-2 border-[#111827] shadow-[4px_4px_0_#111827]"><Image src={imageSecondary} alt="" fill className="object-cover" sizes="25vw" /></div>}
        </div>
        {treatments.map((treatment, index) => (
          <article key={`${treatment.title}-${index}`} className="border-2 border-[#111827] bg-[var(--token-card-bg,#ffffff)] p-5 shadow-[4px_4px_0_#111827]">
            {treatment.image && <div className="relative mb-4 aspect-[16/9] overflow-hidden"><Image src={treatment.image} alt={treatment.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="flex justify-between gap-4"><h3 className="font-black uppercase text-[color:var(--token-heading,#18181b)]">{treatment.title || ''}</h3><span className="text-sm font-bold text-[color:var(--token-muted,#52525b)]">{treatment.priceLabel || ''}</span></div>
            {treatment.text && <div className="mt-2 text-sm text-[color:var(--token-muted,#52525b)] rt-content" dangerouslySetInnerHTML={{ __html: treatment.text }} />}
            {treatment.durationLabel && <p className="mt-2 text-xs font-bold text-[color:var(--token-muted,#52525b)]">{treatment.durationLabel}</p>}
            {treatment.cta?.label && <a href={treatment.cta.href || '#'} className="mt-4 inline-flex font-black uppercase text-[color:var(--token-icon,var(--brand-primary,#1a5276))]">{treatment.cta.label}</a>}
          </article>
        ))}
      </div>
    </div>
  );
}
