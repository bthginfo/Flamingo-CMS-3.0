'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { baseHeader, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';
import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';
import { ConsentGate } from '@/components/consent-gate';
import { safeMapEmbedUrl } from '@/lib/safe-embed-url';

type InfoCard = { icon?: string; label?: string; value?: string };

export function TourismContactSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Kontakt', 'Tourismusbuero');
  const introText = (data.introText as string) || '';
  const image = (data.image as string) || '';
  const mapEmbedUrl = safeMapEmbedUrl(data.mapEmbedUrl);
  const formEnabled = (data.formEnabled as boolean) ?? true;
  const submitLabel = (data.submitLabel as string) || 'Anfrage senden';
  const formFields = data.formFields as FormFieldDef[] | undefined;
  const infoCards = asList<InfoCard>(data.infoCards);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);

  const p = { header, introText, image, mapEmbedUrl, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta };
  return <Classic {...p} />;
}

type Props = {
  header: { headline: string; subline: string; badgeText: string }; introText: string; image: string; mapEmbedUrl?: string;
  formEnabled: boolean; submitLabel: string; formFields?: FormFieldDef[];
  infoCards: InfoCard[]; primaryCta: { label?: string; href?: string }; secondaryCta: { label?: string; href?: string };
};

function Classic({ header, introText, image, mapEmbedUrl, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <SectionHeader {...header} />
        {introText && <div className="text-[color:var(--token-body)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <div key={`${card.label || 'item'}-${index}`} className="flex gap-4 border-t border-[var(--token-card-border)] pt-4" data-edit-collection="infoCards" data-edit-index={index}>
              <DynamicIcon editPath="icon" name={card.icon || 'mail'} size={20} className="text-[color:var(--token-icon)]" />
              <div><p className="text-xs text-[color:var(--token-muted)]" data-edit-path="label">{card.label || ''}</p><p className="font-semibold text-[color:var(--token-heading)]" data-edit-path="value">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)]"><span data-edit-path="label">{primaryCta.label}</span><ArrowRight size={16} /></a>}
          {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--token-btn-secondary-border)] px-5 py-3 font-semibold text-[color:var(--token-btn-secondary-text)]" data-edit-path="label">{secondaryCta.label}</a>}
        </div>
      </motion.div>
      <div className="rounded-xl bg-[var(--token-card-bg)] p-5 shadow-lg">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl"><Image data-edit-image="image" src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {!image && mapEmbedUrl && (
          <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl">
            <ConsentGate provider="Google Maps" className="h-full w-full">
              <iframe src={mapEmbedUrl} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Standort" allowFullScreen />
            </ConsentGate>
          </div>
        )}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </div>
    </div>
  );
}

