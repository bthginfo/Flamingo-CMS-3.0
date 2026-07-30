'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';
import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';
import { ConsentGate } from '@/components/consent-gate';
import { safeMapEmbedUrl } from '@/lib/safe-embed-url';

type InfoCard = { icon?: string; label?: string; value?: string };

export function MedicalLocationContactSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Kontakt & Standort', 'Kontakt');
  const introText = (data.introText as string) || '';
  const image = (data.image as string) || '';
  const mapEmbedUrl = safeMapEmbedUrl(data.mapEmbedUrl);
  const formEnabled = (data.formEnabled as boolean) ?? true;
  const submitLabel = (data.submitLabel as string) || 'Anfrage senden';
  const formFields = data.formFields as FormFieldDef[] | undefined;
  const infoCards = asList<InfoCard>(data.infoCards);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);

  const props = { header, introText, image, mapEmbedUrl, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta };
  return <Classic {...props} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; introText: string; image: string; mapEmbedUrl: string; formEnabled: boolean; submitLabel: string; formFields?: FormFieldDef[]; infoCards: InfoCard[]; primaryCta: { label?: string; href?: string }; secondaryCta: { label?: string; href?: string } };

function Classic({ header, introText, image, mapEmbedUrl, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-10 lg:grid-cols-2">
      <div>
        <SectionHeader {...header} />
        {introText && <div className="text-[color:var(--token-body)] rt-content" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <div key={`${card.label || 'item'}-${index}`} className="flex items-center gap-4 rounded-2xl border border-[var(--token-card-border)] bg-[color:color-mix(in_srgb,var(--token-card-bg,#fff)_78%,var(--token-section-bg-alt,#f8fafc))] px-4 py-3 shadow-sm" data-card data-edit-collection="infoCards" data-edit-index={index}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--token-badge-bg)] text-[color:var(--token-badge-text)]"><DynamicIcon editPath="icon" name={card.icon || 'mail'} size={18} /></div>
              <div className="min-w-0 flex-1"><p className="text-xs text-[color:var(--token-muted)]" data-edit-path="label">{card.label || ''}</p><p className="break-words font-semibold text-[color:var(--token-heading)]" data-edit-path="value">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3"><CtaButton cta={primaryCta} /><CtaButton cta={secondaryCta} /></div>
      </div>
      <div className="rounded-xl bg-[var(--token-card-bg)] p-5 shadow-lg">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl"><Image data-edit-image="image" src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && (
          <ConsentGate provider="Google Maps" className="mb-5 h-56 w-full overflow-hidden rounded-xl">
            <iframe src={mapEmbedUrl} title="Standort" className="h-full w-full border-0" loading="lazy" />
          </ConsentGate>
        )}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </div>
    </motion.div>
  );
}

