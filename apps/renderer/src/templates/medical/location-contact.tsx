'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';
import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';

type InfoCard = { icon?: string; label?: string; value?: string };

export function MedicalLocationContactSection({ data, styleVariant }: SectionProps) {
  const header = baseHeader(data, 'Kontakt & Standort', 'Kontakt');
  const introText = (data.introText as string) || '';
  const image = (data.image as string) || '';
  const mapEmbedUrl = (data.mapEmbedUrl as string) || '';
  const formEnabled = (data.formEnabled as boolean) ?? true;
  const submitLabel = (data.submitLabel as string) || 'Anfrage senden';
  const formFields = data.formFields as FormFieldDef[] | undefined;
  const infoCards = asList<InfoCard>(data.infoCards);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);

  const props = { header, introText, image, mapEmbedUrl, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta };
  if (styleVariant === 'modern') return <Modern {...props} />;
  if (styleVariant === 'bold') return <Bold {...props} />;
  return <Classic {...props} />;
}

type Props = { header: { headline: string; subline: string; badgeText: string }; introText: string; image: string; mapEmbedUrl: string; formEnabled: boolean; submitLabel: string; formFields?: FormFieldDef[]; infoCards: InfoCard[]; primaryCta: { label?: string; href?: string }; secondaryCta: { label?: string; href?: string } };

function Classic({ header, introText, image, mapEmbedUrl, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid gap-10 lg:grid-cols-2">
      <div>
        <SectionHeader {...header} />
        {introText && <div className="text-[var(--token-body, var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563))))] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <div key={`${card.label}-${index}`} className="flex gap-4 border-t border-[var(--token-card-border, var(--token-card-border, var(--style-border-color,rgba(0,0,0,.1))))] pt-4">
              <DynamicIcon name={card.icon || 'mail'} size={20} className="shrink-0 text-[var(--token-icon, var(--token-icon, var(--style-icon-color,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))]" />
              <div className="min-w-0 flex-1"><p className="text-xs text-[var(--token-muted, var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#4b5563))))]">{card.label || ''}</p><p className="break-words font-semibold text-[var(--token-heading, var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827))))]">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3"><CtaButton cta={primaryCta} /><CtaButton cta={secondaryCta} /></div>
      </div>
      <div className="rounded-xl bg-[var(--token-card-bg, var(--token-card-bg, var(--style-card-bg,#fff)))] p-5 shadow-lg">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe src={mapEmbedUrl} className="mb-5 h-56 w-full rounded-xl" loading="lazy" />}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </div>
    </motion.div>
  );
}

function Modern({ header, introText, image, mapEmbedUrl, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <SectionHeader {...header} />
        {introText && <div className="font-light text-[var(--token-body, var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563))))] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <div key={`${card.label}-${index}`} className="flex gap-4 border-t border-[var(--token-card-border, var(--token-card-border, var(--style-border-color,rgba(0,0,0,.1))))] pt-4">
              <DynamicIcon name={card.icon || 'mail'} size={20} className="shrink-0 text-[var(--token-icon, var(--token-icon, var(--style-icon-color,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))]" />
              <div className="min-w-0 flex-1"><p className="text-xs font-light text-[var(--token-muted, var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#4b5563))))]">{card.label || ''}</p><p className="break-words font-light text-[var(--token-heading, var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827))))]">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-btn-bg, var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))] bg-[var(--token-btn-bg, var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))] px-5 py-3 font-semibold text-[var(--token-btn-text, var(--token-btn-text, var(--brand-btn-text,#fff)))]">{primaryCta.label}<ArrowRight size={16} /></a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-lg border border-[var(--token-card-border, var(--token-card-border, var(--style-border-color,rgba(0,0,0,.15))))] px-5 py-3 font-light text-[var(--token-heading, var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827))))]">{secondaryCta.label}</a>}
        </div>
      </div>
      <div className="border border-[var(--token-card-border, var(--token-card-border, var(--style-border-color,rgba(0,0,0,.1))))] bg-[var(--token-card-bg, var(--token-card-bg, var(--style-card-bg,#fff)))] p-5">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe src={mapEmbedUrl} className="mb-5 h-56 w-full" loading="lazy" />}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </div>
    </div>
  );
}

function Bold({ header, introText, image, mapEmbedUrl, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-10 max-w-3xl">
          {header.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--token-badge-text, var(--token-badge-text, var(--style-badge-text,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))]">{header.badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase text-[var(--token-heading, var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827))))] sm:text-3xl md:text-5xl">{header.headline}</h2>
          {header.subline && <div className="mt-4 text-[var(--token-body, var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563))))] rt-content" dangerouslySetInnerHTML={{ __html: header.subline }} />}
        </div>
        {introText && <div className="text-[var(--token-body, var(--token-body, var(--style-body-color,var(--style-text-secondary,#4b5563))))] rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
        <div className="mt-6 grid gap-3">
          {infoCards.map((card, index) => (
            <div key={`${card.label}-${index}`} className="flex gap-4 border-t-2 border-[var(--token-card-border, var(--token-card-border, var(--style-border-color,var(--style-text-primary,#111827))))] pt-4">
              <DynamicIcon name={card.icon || 'mail'} size={20} className="shrink-0 text-[var(--token-icon, var(--token-icon, var(--style-icon-color,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))]" />
              <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase text-[var(--token-muted, var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#4b5563))))]">{card.label || ''}</p><p className="break-words font-black text-[var(--token-heading, var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827))))]">{card.value || ''}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-btn-bg, var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))] bg-[var(--token-btn-bg, var(--token-btn-bg, var(--brand-btn-bg,var(--style-accent-color,var(--token-icon, var(--brand-primary))))))] px-5 py-3 font-black uppercase text-[var(--token-btn-text, var(--token-btn-text, var(--brand-btn-text,#fff)))]">{primaryCta.label}<ArrowRight size={16} /></a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 border-2 border-[var(--token-card-border, var(--token-card-border, var(--style-border-color,var(--style-text-primary,#111827))))] px-5 py-3 font-black uppercase text-[var(--token-heading, var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827))))] shadow-[4px_4px_0_var(--token-card-border, var(--token-card-border, var(--style-border-color,var(--style-text-primary,#111827))))]">{secondaryCta.label}</a>}
        </div>
      </div>
      <div className="border-2 border-[var(--token-card-border, var(--token-card-border, var(--style-border-color,var(--style-text-primary,#111827))))] bg-[var(--token-card-bg, var(--token-card-bg, var(--style-card-bg,#fff)))] p-5 shadow-[4px_4px_0_var(--token-card-border, var(--token-card-border, var(--style-border-color,var(--style-text-primary,#111827))))]">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe src={mapEmbedUrl} className="mb-5 h-56 w-full" loading="lazy" />}
        {formEnabled && <DynamicContactForm fields={formFields} submitLabel={submitLabel} />}
      </div>
    </div>
  );
}
