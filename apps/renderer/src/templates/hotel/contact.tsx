'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';
import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';

type InfoCard = { icon?: string; label?: string; value?: string };

export function HotelContactSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Kontakt';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Anfrage';
  const introText = (data.introText as string) || '';
  const submitLabel = (data.submitLabel as string) || 'Anfrage senden';
  const formEnabled = (data.formEnabled as boolean) ?? true;
  const formFields = data.formFields as FormFieldDef[] | undefined;
  const infoCards = asList<InfoCard>(data.infoCards);
  const contactCta = asButton(data.contactCta);
  const routeCta = asButton(data.routeCta);
  const image = (data.image as string) || '';

  const props = { headline, subline, badgeText, introText, submitLabel, formEnabled, formFields, infoCards, contactCta, routeCta, image };

  if (styleVariant === 'modern') return <ContactModern {...props} />;
  if (styleVariant === 'bold') return <ContactBold {...props} />;
  return <ContactClassic {...props} />;
}

type Props = {
  headline: string; subline: string; badgeText: string; introText: string;
  submitLabel: string; formEnabled: boolean; formFields?: FormFieldDef[];
  infoCards: InfoCard[]; contactCta: { label?: string; href?: string };
  routeCta: { label?: string; href?: string }; image: string;
};

/* --- CLASSIC --- */
function ContactClassic({ headline, subline, badgeText, introText, submitLabel, formEnabled, formFields, infoCards, contactCta, routeCta, image }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-6 max-w-3xl">
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-muted)]"><Star size={12} className="text-[color:var(--token-icon)]" /><span data-edit-path="badgeText">{badgeText}</span></motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
          {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {introText && <div className="text-[color:var(--token-muted)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <motion.div key={`$<span data-edit-path="label">{card.label}</span>-${index}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-4 border-t border-[var(--token-icon)]/20 pt-4" data-edit-collection="infoCards" data-edit-index={index}>
              <div className="text-[color:var(--token-icon)]"><DynamicIcon name={card.icon || 'mail'} size={20} /></div>
              <div><p className="text-xs text-[color:var(--token-muted)]" data-edit-path="label">{card.label || ''}</p><p className="font-semibold text-[color:var(--token-heading)]" data-edit-path="value">{card.value || ''}</p></div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {contactCta.label && <a href={contactCta.href || '#'} className="rounded-xl bg-[#111827] px-5 py-3 font-semibold text-[color:var(--token-on-dark-heading)] shadow-md" data-edit-path="label">{contactCta.label}</a>}
          {routeCta.label && <a href={routeCta.href || '#'} className="rounded-xl border border-black/15 px-5 py-3 font-semibold text-[color:var(--token-heading)]" data-edit-path="label">{routeCta.label}</a>}
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-[var(--token-icon)]/20 bg-[var(--token-card-bg)] p-5 shadow-lg">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </motion.div>
    </div>
  );
}

/* --- MODERN --- */
function ContactModern({ headline, subline, badgeText, introText, submitLabel, formEnabled, formFields, infoCards, contactCta, routeCta, image }: Props) {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <div className="mb-8 max-w-3xl">
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[color:var(--token-muted)]" data-edit-path="badgeText">{badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <div className="mt-4 font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {introText && <div className="font-light text-[color:var(--token-muted)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-8 grid gap-4">
          {infoCards.map((card, index) => (
            <div key={`$<span data-edit-path="label">{card.label}</span>-${index}`} className="flex gap-4 border-t border-black/10 pt-4" data-edit-collection="infoCards" data-edit-index={index}>
              <DynamicIcon name={card.icon || 'mail'} size={18} className="text-[color:var(--token-muted)]" />
              <div><p className="text-xs font-light text-[color:var(--token-muted)]" data-edit-path="label">{card.label || ''}</p><p className="font-light text-[color:var(--token-heading)]" data-edit-path="value">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          {contactCta.label && <a href={contactCta.href || '#'} className="font-light text-[color:var(--token-heading)] underline underline-offset-4" data-edit-path="label">{contactCta.label}</a>}
          {routeCta.label && <a href={routeCta.href || '#'} className="font-light text-[color:var(--token-muted)] underline underline-offset-4" data-edit-path="label">{routeCta.label}</a>}
        </div>
      </div>
      <div className="border border-black/10 bg-[var(--token-card-bg)] p-8">
        {image && <div className="relative mb-6 aspect-[16/10] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </div>
    </div>
  );
}

/* --- BOLD --- */
function ContactBold({ headline, subline, badgeText, introText, submitLabel, formEnabled, formFields, infoCards, contactCta, routeCta, image }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-6 max-w-3xl">
          {badgeText && <p className="inline-block bg-[var(--token-btn-bg)/10] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[color:var(--token-icon)]" data-edit-path="badgeText">{badgeText}</p>}
          <h2 className="mt-4 text-3xl sm:text-3xl md:text-5xl font-black uppercase text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
          {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {introText && <div className="text-[color:var(--token-muted)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <div key={`$<span data-edit-path="label">{card.label}</span>-${index}`} className="flex gap-4 border-t-2 border-[#111827] pt-4" data-edit-collection="infoCards" data-edit-index={index}>
              <div className="text-[color:var(--token-icon)]"><DynamicIcon name={card.icon || 'mail'} size={20} /></div>
              <div><p className="text-xs font-bold uppercase text-[color:var(--token-muted)]" data-edit-path="label">{card.label || ''}</p><p className="font-black text-[color:var(--token-heading)]" data-edit-path="value">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {contactCta.label && <a href={contactCta.href || '#'} className="border-2 border-[#111827] bg-[#111827] px-5 py-3 font-black uppercase text-[color:var(--token-on-dark-heading)] shadow-[4px_4px_0_var(--token-icon)]" data-edit-path="label">{contactCta.label}</a>}
          {routeCta.label && <a href={routeCta.href || '#'} className="border-2 border-[#111827] px-5 py-3 font-black uppercase text-[color:var(--token-heading)]" data-edit-path="label">{routeCta.label}</a>}
        </div>
      </div>
      <div className="border-2 border-[#111827] bg-[var(--token-card-bg)] p-5 shadow-[4px_4px_0_#111827]">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </div>
    </div>
  );
}
