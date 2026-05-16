'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { baseHeader, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type InfoCard = { icon?: string; label?: string; value?: string };

export function TourismContactSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Kontakt', 'Tourismusbuero');
  const introText = (data.introText as string) || '';
  const image = (data.image as string) || '';
  const formEnabled = (data.formEnabled as boolean) ?? true;
  const namePlaceholder = (data.namePlaceholder as string) || 'Name';
  const emailPlaceholder = (data.emailPlaceholder as string) || 'E-Mail';
  const messagePlaceholder = (data.messagePlaceholder as string) || 'Nachricht';
  const submitLabel = (data.submitLabel as string) || 'Anfrage senden';
  const infoCards = asList<InfoCard>(data.infoCards);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);

  const p = { header, introText, image, formEnabled, namePlaceholder, emailPlaceholder, messagePlaceholder, submitLabel, infoCards, primaryCta, secondaryCta };
  if (styleVariant === 'modern') return <Modern {...p} />;
  if (styleVariant === 'bold') return <Bold {...p} />;
  return <Classic {...p} />;
}

type Props = {
  header: { headline: string; subline: string; badgeText: string }; introText: string; image: string;
  formEnabled: boolean; namePlaceholder: string; emailPlaceholder: string; messagePlaceholder: string;
  submitLabel: string; infoCards: InfoCard[]; primaryCta: { label?: string; href?: string }; secondaryCta: { label?: string; href?: string };
};

function Classic({ header, introText, image, formEnabled, namePlaceholder, emailPlaceholder, messagePlaceholder, submitLabel, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <SectionHeader {...header} />
        {introText && <p className="text-gray-600">{introText}</p>}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <div key={`${card.label}-${index}`} className="flex gap-4 border-t border-black/10 pt-4">
              <DynamicIcon name={card.icon || 'mail'} size={20} className="text-green-700" />
              <div><p className="text-xs text-gray-600">{card.label || ''}</p><p className="font-semibold text-gray-900">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-3 font-semibold text-white">{primaryCta.label}<ArrowRight size={16} /></a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-3 font-semibold text-gray-900">{secondaryCta.label}</a>}
        </div>
      </motion.div>
      <div className="rounded-xl bg-white p-5 shadow-lg">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {formEnabled && <form className="grid gap-3"><input className="admin-input" placeholder={namePlaceholder} readOnly /><input className="admin-input" placeholder={emailPlaceholder} readOnly /><textarea className="admin-input" placeholder={messagePlaceholder} readOnly /><button type="button" className="rounded-full bg-green-700 px-5 py-3 font-semibold text-white">{submitLabel}</button></form>}
      </div>
    </div>
  );
}

function Modern({ header, introText, image, formEnabled, namePlaceholder, emailPlaceholder, messagePlaceholder, submitLabel, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <SectionHeader {...header} />
        {introText && <p className="font-light text-gray-600">{introText}</p>}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <div key={`${card.label}-${index}`} className="flex gap-4 border-t border-black/10 pt-4">
              <DynamicIcon name={card.icon || 'mail'} size={20} className="text-teal-600" />
              <div><p className="text-xs font-light text-gray-600">{card.label || ''}</p><p className="font-light text-gray-900">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-teal-600 bg-teal-600 px-5 py-3 font-semibold text-white">{primaryCta.label}<ArrowRight size={16} /></a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-black/15 px-5 py-3 font-semibold text-gray-900">{secondaryCta.label}</a>}
        </div>
      </div>
      <div className="border border-black/10 bg-white p-5">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {formEnabled && <form className="grid gap-3"><input className="admin-input" placeholder={namePlaceholder} readOnly /><input className="admin-input" placeholder={emailPlaceholder} readOnly /><textarea className="admin-input" placeholder={messagePlaceholder} readOnly /><button type="button" className="rounded-lg border border-teal-600 bg-teal-600 px-5 py-3 font-semibold text-white">{submitLabel}</button></form>}
      </div>
    </div>
  );
}

function Bold({ header, introText, image, formEnabled, namePlaceholder, emailPlaceholder, messagePlaceholder, submitLabel, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-10 max-w-3xl">
          {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-orange-500">{header.badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase text-gray-900 sm:text-3xl md:text-5xl">{header.headline}</h2>
          {header.subline && <p className="mt-4 text-gray-600">{header.subline}</p>}
        </div>
        {introText && <p className="text-gray-600">{introText}</p>}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <div key={`${card.label}-${index}`} className="flex gap-4 border-t-2 border-[#111827] pt-4">
              <DynamicIcon name={card.icon || 'mail'} size={20} className="text-orange-500" />
              <div><p className="text-xs font-bold uppercase text-gray-600">{card.label || ''}</p><p className="font-black text-gray-900">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-orange-500 bg-orange-500 px-5 py-3 font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.orange.700)]">{primaryCta.label}<ArrowRight size={16} /></a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[#111827] px-5 py-3 font-black uppercase text-gray-900 shadow-[4px_4px_0_#111827]">{secondaryCta.label}</a>}
        </div>
      </div>
      <div className="border-2 border-[#111827] bg-white p-5 shadow-[4px_4px_0_#111827]">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {formEnabled && <form className="grid gap-3"><input className="admin-input" placeholder={namePlaceholder} readOnly /><input className="admin-input" placeholder={emailPlaceholder} readOnly /><textarea className="admin-input" placeholder={messagePlaceholder} readOnly /><button type="button" className="border-2 border-orange-500 bg-orange-500 px-5 py-3 font-black uppercase text-gray-950 shadow-[4px_4px_0_theme(colors.orange.700)]">{submitLabel}</button></form>}
      </div>
    </div>
  );
}
