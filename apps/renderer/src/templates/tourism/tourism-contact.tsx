'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { baseHeader, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';
import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';

type InfoCard = { icon?: string; label?: string; value?: string };

export function TourismContactSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Kontakt', 'Tourismusbuero');
  const introText = (data.introText as string) || '';
  const image = (data.image as string) || '';
  const formEnabled = (data.formEnabled as boolean) ?? true;
  const submitLabel = (data.submitLabel as string) || 'Anfrage senden';
  const formFields = data.formFields as FormFieldDef[] | undefined;
  const infoCards = asList<InfoCard>(data.infoCards);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);

  const p = { header, introText, image, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta };
  if (styleVariant === 'modern') return <Modern {...p} />;
  if (styleVariant === 'bold') return <Bold {...p} />;
  return <Classic {...p} />;
}

type Props = {
  header: { headline: string; subline: string; badgeText: string }; introText: string; image: string;
  formEnabled: boolean; submitLabel: string; formFields?: FormFieldDef[];
  infoCards: InfoCard[]; primaryCta: { label?: string; href?: string }; secondaryCta: { label?: string; href?: string };
};

function Classic({ header, introText, image, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <SectionHeader {...header} />
        {introText && <div className="text-[var(--token-body)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <div key={`$<span data-edit-path="label">{card.label}</span>-${index}`} className="flex gap-4 border-t border-[var(--token-card-border)] pt-4" data-edit-collection="infoCards" data-edit-index={index}>
              <DynamicIcon name={card.icon || 'mail'} size={20} className="text-[var(--token-icon)]" />
              <div><p className="text-xs text-[var(--token-muted)]" data-edit-path="label">{card.label || ''}</p><p className="font-semibold text-[var(--token-heading)]" data-edit-path="value">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{primaryCta.label}</span><ArrowRight size={16} /></a>}
          {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--token-card-border)] px-5 py-3 font-semibold text-[var(--token-body)]" data-edit-path="label">{secondaryCta.label}</a>}
        </div>
      </motion.div>
      <div className="rounded-xl bg-[var(--token-card-bg)] p-5 shadow-lg">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl"><Image data-edit-image="image" src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </div>
    </div>
  );
}

function Modern({ header, introText, image, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <SectionHeader {...header} />
        {introText && <div className="font-light text-[var(--token-body)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <div key={`$<span data-edit-path="label">{card.label}</span>-${index}`} className="flex gap-4 border-t border-[var(--token-card-border)] pt-4" data-edit-collection="infoCards" data-edit-index={index}>
              <DynamicIcon name={card.icon || 'mail'} size={20} className="text-[var(--token-icon)]" />
              <div><p className="text-xs font-light text-[var(--token-muted)]" data-edit-path="label">{card.label || ''}</p><p className="font-light text-[var(--token-heading)]" data-edit-path="value">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[var(--token-btn-text)]"><span data-edit-path="label">{primaryCta.label}</span><ArrowRight size={16} /></a>}
          {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-card-border)] px-5 py-3 font-semibold text-[var(--token-body)]" data-edit-path="label">{secondaryCta.label}</a>}
        </div>
      </div>
      <div className="border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-5">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image data-edit-image="image" src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </div>
    </div>
  );
}

function Bold({ header, introText, image, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-10 max-w-3xl">
          {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text)]" data-edit-path="badgeText">{header.badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase text-[var(--token-heading)] sm:text-3xl md:text-5xl" data-edit-path="headline">{header.headline}</h2>
          {header.subline && <div className="mt-4 text-[var(--token-body)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: header.subline }} />}
        </div>
        {introText && <div className="text-[var(--token-body)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <div key={`$<span data-edit-path="label">{card.label}</span>-${index}`} className="flex gap-4 border-t-2 border-[var(--token-card-border)] pt-4" data-edit-collection="infoCards" data-edit-index={index}>
              <DynamicIcon name={card.icon || 'mail'} size={20} className="text-[var(--token-icon)]" />
              <div><p className="text-xs font-bold uppercase text-[var(--token-muted)]" data-edit-path="label">{card.label || ''}</p><p className="font-black text-[var(--token-heading)]" data-edit-path="value">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] px-5 py-3 font-black uppercase text-[var(--token-btn-text)]"><span data-edit-path="label">{primaryCta.label}</span><ArrowRight size={16} /></a>}
          {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-card-border)] px-5 py-3 font-black uppercase text-[var(--token-body)]" data-edit-path="label">{secondaryCta.label}</a>}
        </div>
      </div>
      <div className="border-2 border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-5 shadow-[4px_4px_0_var(--token-card-border)]">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image data-edit-image="image" src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </div>
    </div>
  );
}
