'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';
import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';

type InfoCard = { icon?: string; label?: string; value?: string };

export function LocationContactSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Kontakt';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Salon';
  const introText = (data.introText as string) || '';
  const image = (data.image as string) || '';
  const mapEmbedUrl = (data.mapEmbedUrl as string) || '';
  const formEnabled = (data.formEnabled as boolean) ?? true;
  const submitLabel = (data.submitLabel as string) || 'Anfrage senden';
  const formFields = data.formFields as FormFieldDef[] | undefined;
  const infoCards = asList<InfoCard>(data.infoCards);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);

  const props = { headline, subline, badgeText, introText, image, mapEmbedUrl, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta };

  if (styleVariant === 'modern') return <ContactModern {...props} />;
  if (styleVariant === 'bold') return <ContactBold {...props} />;
  return <ContactClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; introText: string; image: string; mapEmbedUrl: string; formEnabled: boolean; submitLabel: string; formFields?: FormFieldDef[]; infoCards: InfoCard[]; primaryCta: ButtonValue; secondaryCta: ButtonValue };

function ContactClassic({ headline, subline, badgeText, introText, image, mapEmbedUrl, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-10 max-w-3xl">
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
          {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {introText && <div className="text-[color:var(--token-muted)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-6 grid gap-3">{infoCards.map((card, i) => <div key={`$<span data-edit-path="label">{card.label}</span>-${i}`} className="flex gap-4 border-t border-[var(--token-icon)]/20 pt-4" data-edit-collection="infoCards" data-edit-index={i}><DynamicIcon name={card.icon || 'mail'} size={20} className="text-[color:var(--token-eyebrow)]" /><div><p className="text-xs text-[color:var(--token-muted)]" data-edit-path="label">{card.label || ''}</p><p className="font-semibold text-[color:var(--token-heading)]" data-edit-path="value">{card.value || ''}</p></div></div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex rounded-full bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading)] shadow-md" data-edit-path="label">{primaryCta.label}</a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex rounded-full border border-[var(--token-icon)]/30 px-5 py-3 font-semibold text-[color:var(--token-heading)]" data-edit-path="label">{secondaryCta.label}</a>}
        </div>
      </div>
      <div className="rounded-xl border border-[var(--token-icon)]/20 bg-[var(--token-card-bg)] p-5 shadow-md">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe src={mapEmbedUrl} className="mb-5 h-56 w-full rounded-xl" loading="lazy" />}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </div>
    </div>
  );
}

function ContactModern({ headline, subline, badgeText, introText, image, mapEmbedUrl, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-16 lg:grid-cols-2">
      <div>
        <div className="mb-14 max-w-3xl">
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <div className="mt-4 font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {introText && <div className="font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-6 grid gap-4">{infoCards.map((card, i) => <div key={`$<span data-edit-path="label">{card.label}</span>-${i}`} className="flex gap-4 border-t border-black/10 pt-4" data-edit-collection="infoCards" data-edit-index={i}><DynamicIcon name={card.icon || 'mail'} size={18} className="text-[color:var(--token-eyebrow)]" /><div><p className="text-xs font-light text-[color:var(--token-muted)]" data-edit-path="label">{card.label || ''}</p><p className="font-light text-[color:var(--token-heading)]" data-edit-path="value">{card.value || ''}</p></div></div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex border border-[#111827] px-6 py-3 font-light text-[color:var(--token-heading)]" data-edit-path="label">{primaryCta.label}</a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex px-6 py-3 font-light text-[color:var(--token-muted)]" data-edit-path="label">{secondaryCta.label}</a>}
        </div>
      </div>
      <div className="border border-black/10 p-5">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe src={mapEmbedUrl} className="mb-5 h-56 w-full" loading="lazy" />}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </div>
    </div>
  );
}

function ContactBold({ headline, subline, badgeText, introText, image, mapEmbedUrl, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-10 max-w-3xl">
          {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[color:var(--token-eyebrow)]" data-edit-path="badgeText">{badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <div className="mt-4 font-bold text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {introText && <div className="font-bold text-[color:var(--token-muted)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-6 grid gap-3">{infoCards.map((card, i) => <div key={`$<span data-edit-path="label">{card.label}</span>-${i}`} className="flex gap-4 border-t-2 border-[#111827] pt-4" data-edit-collection="infoCards" data-edit-index={i}><DynamicIcon name={card.icon || 'mail'} size={20} className="text-[color:var(--token-eyebrow)]" /><div><p className="text-xs font-bold uppercase text-[color:var(--token-muted)]" data-edit-path="label">{card.label || ''}</p><p className="font-black text-[color:var(--token-heading)]" data-edit-path="value">{card.value || ''}</p></div></div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex bg-[var(--token-badge-bg)] px-6 py-3 font-black uppercase text-[color:var(--token-on-dark-heading)] shadow-[4px_4px_0_rgba(0,0,0,0.8)]" data-edit-path="label">{primaryCta.label}</a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex border-2 border-[#111827] px-6 py-3 font-black uppercase text-[color:var(--token-heading)] shadow-[4px_4px_0_var(--token-eyebrow)]" data-edit-path="label">{secondaryCta.label}</a>}
        </div>
      </div>
      <div className="border-2 border-[#111827] bg-[#111] p-5 shadow-[4px_4px_0_var(--token-eyebrow)]">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe src={mapEmbedUrl} className="mb-5 h-56 w-full" loading="lazy" />}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </div>
    </div>
  );
}
