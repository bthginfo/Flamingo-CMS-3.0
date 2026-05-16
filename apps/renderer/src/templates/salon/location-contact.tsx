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
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-gray-600">{badgeText}</motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-gray-900">{headline}</motion.h2>
          {subline && <p className="mt-4 text-gray-600">{subline}</p>}
        </div>
        {introText && <p className="text-gray-600">{introText}</p>}
        <div className="mt-6 grid gap-3">{infoCards.map((card, i) => <div key={`${card.label}-${i}`} className="flex gap-4 border-t border-[var(--brand-primary)]/20 pt-4"><DynamicIcon name={card.icon || 'mail'} size={20} className="text-brand-accent" /><div><p className="text-xs text-gray-600">{card.label || ''}</p><p className="font-semibold text-gray-900">{card.value || ''}</p></div></div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex rounded-full bg-[#111827] px-5 py-3 font-semibold text-white shadow-md">{primaryCta.label}</a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex rounded-full border border-[var(--brand-primary)]/30 px-5 py-3 font-semibold text-gray-900">{secondaryCta.label}</a>}
        </div>
      </div>
      <div className="rounded-xl border border-[var(--brand-primary)]/20 bg-white p-5 shadow-md">
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
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-gray-600">{badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-gray-900">{headline}</h2>
          {subline && <p className="mt-4 font-light text-gray-600">{subline}</p>}
        </div>
        {introText && <p className="font-light text-gray-600">{introText}</p>}
        <div className="mt-6 grid gap-4">{infoCards.map((card, i) => <div key={`${card.label}-${i}`} className="flex gap-4 border-t border-black/10 pt-4"><DynamicIcon name={card.icon || 'mail'} size={18} className="text-brand-accent" /><div><p className="text-xs font-light text-gray-600">{card.label || ''}</p><p className="font-light text-gray-900">{card.value || ''}</p></div></div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex border border-[#111827] px-6 py-3 font-light text-gray-900">{primaryCta.label}</a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex px-6 py-3 font-light text-gray-600">{secondaryCta.label}</a>}
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
          {badgeText && <p className="text-xs font-black uppercase tracking-widest text-brand-accent">{badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase sm:text-3xl md:text-5xl text-gray-900">{headline}</h2>
          {subline && <p className="mt-4 font-bold text-gray-600">{subline}</p>}
        </div>
        {introText && <p className="font-bold text-gray-600">{introText}</p>}
        <div className="mt-6 grid gap-3">{infoCards.map((card, i) => <div key={`${card.label}-${i}`} className="flex gap-4 border-t-2 border-[#111827] pt-4"><DynamicIcon name={card.icon || 'mail'} size={20} className="text-brand-accent" /><div><p className="text-xs font-bold uppercase text-gray-600">{card.label || ''}</p><p className="font-black text-gray-900">{card.value || ''}</p></div></div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex bg-brand-accent px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{primaryCta.label}</a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex border-2 border-[#111827] px-6 py-3 font-black uppercase text-gray-900 shadow-[4px_4px_0_var(--brand-accent)]">{secondaryCta.label}</a>}
        </div>
      </div>
      <div className="border-2 border-[#111827] bg-[#111] p-5 shadow-[4px_4px_0_var(--brand-accent)]">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe src={mapEmbedUrl} className="mb-5 h-56 w-full" loading="lazy" />}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </div>
    </div>
  );
}
