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
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div className="mb-6 max-w-3xl">
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]"><Star size={12} className="text-[color:var(--token-rating-star)]" /><span data-edit-path="badgeText">{badgeText}</span></motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
          {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
          {introText && <div className="mt-6 text-[color:var(--token-muted)] leading-7 rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
          {ctaPrimary.label && <a data-edit-link="ctaPrimary" href={ctaPrimary.href || '#'} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-lg"><span data-edit-path="label">{ctaPrimary.label}</span><ArrowRight size={16} /></a>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {imagePrimary && <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-xl shadow-md"><Image data-edit-image="imagePrimary" src={imagePrimary} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {imageSecondary && <div className="relative aspect-square overflow-hidden rounded-xl shadow-md"><Image data-edit-image="imageSecondary" src={imageSecondary} alt="" fill className="object-cover" sizes="25vw" /></div>}
        </div>
      </div>
      {features.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div key={`${feature.title}-${index}`} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="rounded-2xl border border-[color:var(--token-card-border)] bg-[var(--token-card-bg)] p-5 shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl" data-card data-edit-collection="features" data-edit-index={index}>
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--token-icon)_12%,transparent)] text-[color:var(--token-icon)]"><DynamicIcon editPath="icon" name={feature.icon || 'heart'} size={20} /></div>
              <h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{feature.title || ''}</h3>
              {feature.text && <div className="mt-2 text-sm leading-6 text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: feature.text }} />}
            </motion.div>
          ))}
        </div>
      )}
      {treatments.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {treatments.map((treatment, index) => (
          <motion.article key={`${treatment.title}-${index}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] p-5 shadow-md" data-card data-edit-collection="treatments" data-edit-index={index}>
            {treatment.image && <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl"><Image data-edit-image="image" src={treatment.image} alt={treatment.title || ''} fill className="object-cover" sizes="50vw" /></div>}
            <div className="flex justify-between gap-4"><h3 className="font-bold text-[color:var(--token-heading)]" data-edit-path="title">{treatment.title || ''}</h3><span className="text-sm text-[color:var(--token-price)]" data-edit-path="priceLabel">{treatment.priceLabel || ''}</span></div>
            {treatment.text && <div className="mt-2 text-sm text-[color:var(--token-muted)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: treatment.text }} />}
            {treatment.durationLabel && <p className="mt-2 text-xs text-[color:var(--token-muted)]">{treatment.durationLabel}</p>}
            {treatment.cta?.label && <a href={treatment.cta.href || '#'} className="mt-4 inline-flex font-semibold text-[color:var(--token-link)] hover:text-[color:var(--token-link-hover)]" data-edit-path="label">{treatment.cta.label}</a>}
          </motion.article>
        ))}
        </div>
      )}
    </div>
  );
}

