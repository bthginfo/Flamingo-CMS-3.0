'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';

type InfoCard = { icon?: string; label?: string; value?: string };

export function HotelContactSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Kontakt';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Anfrage';
  const introText = (data.introText as string) || '';
  const namePlaceholder = (data.namePlaceholder as string) || 'Name';
  const emailPlaceholder = (data.emailPlaceholder as string) || 'E-Mail';
  const messagePlaceholder = (data.messagePlaceholder as string) || 'Nachricht';
  const submitLabel = (data.submitLabel as string) || 'Anfrage senden';
  const formEnabled = (data.formEnabled as boolean) ?? true;
  const infoCards = asList<InfoCard>(data.infoCards);
  const contactCta = asButton(data.contactCta);
  const routeCta = asButton(data.routeCta);
  const image = (data.image as string) || '';

  const props = { headline, subline, badgeText, introText, namePlaceholder, emailPlaceholder, messagePlaceholder, submitLabel, formEnabled, infoCards, contactCta, routeCta, image };

  if (styleVariant === 'modern') return <ContactModern {...props} />;
  if (styleVariant === 'bold') return <ContactBold {...props} />;
  return <ContactClassic {...props} />;
}

type Props = {
  headline: string; subline: string; badgeText: string; introText: string;
  namePlaceholder: string; emailPlaceholder: string; messagePlaceholder: string; submitLabel: string;
  formEnabled: boolean; infoCards: InfoCard[]; contactCta: { label?: string; href?: string };
  routeCta: { label?: string; href?: string }; image: string;
};

/* --- CLASSIC --- */
function ContactClassic({ headline, subline, badgeText, introText, namePlaceholder, emailPlaceholder, messagePlaceholder, submitLabel, formEnabled, infoCards, contactCta, routeCta, image }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-6 max-w-3xl">
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600"><Star size={12} className="text-brand-primary" />{badgeText}</motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-gray-900">{headline}</motion.h2>
          {subline && <p className="mt-4 text-gray-600">{subline}</p>}
        </div>
        {introText && <p className="text-gray-600">{introText}</p>}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <motion.div key={`${card.label}-${index}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-4 border-t border-[var(--brand-primary)]/20 pt-4">
              <div className="text-brand-primary"><DynamicIcon name={card.icon || 'mail'} size={20} /></div>
              <div><p className="text-xs text-gray-600">{card.label || ''}</p><p className="font-semibold text-gray-900">{card.value || ''}</p></div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {contactCta.label && <a href={contactCta.href || '#'} className="rounded-xl bg-[#111827] px-5 py-3 font-semibold text-white shadow-md">{contactCta.label}</a>}
          {routeCta.label && <a href={routeCta.href || '#'} className="rounded-xl border border-black/15 px-5 py-3 font-semibold text-gray-900">{routeCta.label}</a>}
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-[var(--brand-primary)]/20 bg-white p-5 shadow-lg">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {formEnabled && <form className="grid gap-3"><input className="admin-input" placeholder={namePlaceholder} readOnly /><input className="admin-input" placeholder={emailPlaceholder} readOnly /><textarea className="admin-input" placeholder={messagePlaceholder} readOnly /><button type="button" className="rounded-xl bg-[#111827] px-5 py-3 font-semibold text-white shadow-md">{submitLabel}</button></form>}
      </motion.div>
    </div>
  );
}

/* --- MODERN --- */
function ContactModern({ headline, subline, badgeText, introText, namePlaceholder, emailPlaceholder, messagePlaceholder, submitLabel, formEnabled, infoCards, contactCta, routeCta, image }: Props) {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <div className="mb-8 max-w-3xl">
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-gray-600">{badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-gray-900">{headline}</h2>
          {subline && <p className="mt-4 font-light text-gray-600">{subline}</p>}
        </div>
        {introText && <p className="font-light text-gray-600">{introText}</p>}
        <div className="mt-8 grid gap-4">
          {infoCards.map((card, index) => (
            <div key={`${card.label}-${index}`} className="flex gap-4 border-t border-black/10 pt-4">
              <DynamicIcon name={card.icon || 'mail'} size={18} className="text-gray-600" />
              <div><p className="text-xs font-light text-gray-600">{card.label || ''}</p><p className="font-light text-gray-900">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          {contactCta.label && <a href={contactCta.href || '#'} className="font-light text-gray-900 underline underline-offset-4">{contactCta.label}</a>}
          {routeCta.label && <a href={routeCta.href || '#'} className="font-light text-gray-600 underline underline-offset-4">{routeCta.label}</a>}
        </div>
      </div>
      <div className="border border-black/10 bg-white p-8">
        {image && <div className="relative mb-6 aspect-[16/10] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {formEnabled && <form className="grid gap-4"><input className="admin-input" placeholder={namePlaceholder} readOnly /><input className="admin-input" placeholder={emailPlaceholder} readOnly /><textarea className="admin-input" placeholder={messagePlaceholder} readOnly /><button type="button" className="font-light text-gray-900 underline underline-offset-4">{submitLabel}</button></form>}
      </div>
    </div>
  );
}

/* --- BOLD --- */
function ContactBold({ headline, subline, badgeText, introText, namePlaceholder, emailPlaceholder, messagePlaceholder, submitLabel, formEnabled, infoCards, contactCta, routeCta, image }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-6 max-w-3xl">
          {badgeText && <p className="inline-block bg-brand-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-primary">{badgeText}</p>}
          <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase text-gray-900">{headline}</h2>
          {subline && <p className="mt-4 text-gray-600">{subline}</p>}
        </div>
        {introText && <p className="text-gray-600">{introText}</p>}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <div key={`${card.label}-${index}`} className="flex gap-4 border-t-2 border-[#111827] pt-4">
              <div className="text-brand-primary"><DynamicIcon name={card.icon || 'mail'} size={20} /></div>
              <div><p className="text-xs font-bold uppercase text-gray-600">{card.label || ''}</p><p className="font-black text-gray-900">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {contactCta.label && <a href={contactCta.href || '#'} className="border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-white shadow-[4px_4px_0_var(--brand-primary)]">{contactCta.label}</a>}
          {routeCta.label && <a href={routeCta.href || '#'} className="border-2 border-[#111827] px-5 py-3 font-black uppercase text-gray-900">{routeCta.label}</a>}
        </div>
      </div>
      <div className="border-2 border-[#111827] bg-white p-5 shadow-[4px_4px_0_#111827]">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {formEnabled && <form className="grid gap-3"><input className="admin-input" placeholder={namePlaceholder} readOnly /><input className="admin-input" placeholder={emailPlaceholder} readOnly /><textarea className="admin-input" placeholder={messagePlaceholder} readOnly /><button type="button" className="border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-white shadow-[4px_4px_0_var(--brand-primary)]">{submitLabel}</button></form>}
      </div>
    </div>
  );
}
