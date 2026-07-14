'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps } from './types';
import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';
import { ConsentGate } from '@/components/consent-gate';
import { safeMapEmbedUrl } from '@/lib/safe-embed-url';

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
  const mapEmbedUrl = safeMapEmbedUrl(data.mapEmbedUrl);

  const props = { headline, subline, badgeText, introText, submitLabel, formEnabled, formFields, infoCards, contactCta, routeCta, image, mapEmbedUrl };

  return <ContactClassic {...props} />;
}

type Props = {
  headline: string; subline: string; badgeText: string; introText: string;
  submitLabel: string; formEnabled: boolean; formFields?: FormFieldDef[];
  infoCards: InfoCard[]; contactCta: { label?: string; href?: string };
  routeCta: { label?: string; href?: string }; image: string; mapEmbedUrl?: string;
};

/* --- CLASSIC --- */
function ContactClassic({ headline, subline, badgeText, introText, submitLabel, formEnabled, formFields, infoCards, contactCta, routeCta, image, mapEmbedUrl }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-6 max-w-3xl">
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]"><Star size={12} className="text-[color:var(--token-rating-star)]" /><span data-edit-path="badgeText">{badgeText}</span></motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</motion.h2>
          {subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {introText && <div className="text-[color:var(--token-muted)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <motion.div key={`${card.label || 'item'}-${index}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-4 border-t border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] pt-4" data-edit-collection="infoCards" data-edit-index={index}>
              <div className="text-[color:var(--token-icon)]"><DynamicIcon editPath="icon" name={card.icon || 'mail'} size={20} /></div>
              <div><p className="text-xs text-[color:var(--token-muted)]" data-edit-path="label">{card.label || ''}</p><p className="font-semibold text-[color:var(--token-heading)]" data-edit-path="value">{card.value || ''}</p></div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {contactCta.label && <a data-edit-link="contactCta" href={contactCta.href || '#'} className="rounded-xl bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-md" data-edit-path="label">{contactCta.label}</a>}
          {routeCta.label && <a data-edit-link="routeCta" href={routeCta.href || '#'} className="rounded-xl border border-black/15 px-5 py-3 font-semibold text-[color:var(--token-heading)]" data-edit-path="label">{routeCta.label}</a>}
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] p-5 shadow-lg">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl"><Image data-edit-image="image" src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {!image && mapEmbedUrl && (
          <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl">
            <ConsentGate provider="Google Maps" className="h-full w-full">
              <iframe src={mapEmbedUrl} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Standort" allowFullScreen />
            </ConsentGate>
          </div>
        )}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </motion.div>
    </div>
  );
}

