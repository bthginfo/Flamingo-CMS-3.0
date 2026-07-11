'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';
import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';
import { plain } from '@/lib/strip-html';
import { ConsentGate } from '@/components/consent-gate';

type InfoCard = { icon?: string; label?: string; value?: string };

export function RestaurantContactSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Kontakt';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const introText = (data.introText as string) || '';
  const image = (data.image as string) || '';
  const mapEmbedUrl = (data.mapEmbedUrl as string) || '';
  const formEnabled = (data.formEnabled as boolean) ?? true;
  const submitLabel = (data.submitLabel as string) || 'Nachricht senden';
  const formFields = data.formFields as FormFieldDef[] | undefined;
  const infoCards = asList<InfoCard>(data.infoCards);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);

  const props = { headline, subline, badgeText, introText, image, mapEmbedUrl, formEnabled, submitLabel, formFields, infoCards, primaryCta, secondaryCta };

  return <Classic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; introText: string; image: string; mapEmbedUrl: string; formEnabled: boolean; submitLabel: string; formFields?: FormFieldDef[]; infoCards: InfoCard[]; primaryCta: ButtonValue; secondaryCta: ButtonValue };

function InfoCards({ cards }: { cards: InfoCard[] }) {
  return (
    <div className="grid gap-3">
      {cards.map((card, i) => (
        <div key={`${card.label}-${i}`} className="flex gap-4 border-t border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] pt-4" data-edit-collection="cards" data-edit-index={i}>
          <DynamicIcon editPath="icon" name={card.icon || 'mail'} size={20} className="text-[color:var(--token-eyebrow)]" />
          <div>
            <p className="text-xs text-[color:var(--token-muted)]" data-edit-path="label">{card.label || ''}</p>
            <p className="font-semibold text-[color:var(--token-heading)]" data-edit-path="value">{card.value || ''}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Classic(p: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-10 max-w-3xl">
          {p.badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{p.badgeText}</motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-[color:var(--token-heading)]" data-edit-path="headline">{p.headline}</motion.h2>
          {p.subline && <div className="mt-4 text-[color:var(--token-muted)] rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: p.subline }} />}
        </div>
        {p.introText && <p className="text-[color:var(--token-muted)]">{plain(p.introText)}</p>}
        <div className="mt-6"><InfoCards cards={p.infoCards} /></div>
        <div className="mt-8 flex flex-wrap gap-3">
          {p.primaryCta.label && <a href={p.primaryCta.href || '#'} className="inline-flex rounded-full bg-[var(--token-btn-bg)] px-5 py-3 font-semibold text-[color:var(--token-btn-text)] shadow-md" data-edit-path="label">{p.primaryCta.label}</a>}
          {p.secondaryCta.label && <a href={p.secondaryCta.href || '#'} className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--token-icon)_30%,transparent)] px-5 py-3 font-semibold text-[color:var(--token-heading)]" data-edit-path="label">{p.secondaryCta.label}</a>}
        </div>
      </div>
      <div className="rounded-xl border border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)] bg-[var(--token-card-bg)] p-5 shadow-md">
        {p.image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl"><Image data-edit-image="image" src={p.image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {p.mapEmbedUrl && (
          <ConsentGate provider="Google Maps" className="mb-5 h-56 w-full overflow-hidden rounded-xl">
            <iframe src={p.mapEmbedUrl} title="Standort" className="h-full w-full border-0" loading="lazy" />
          </ConsentGate>
        )}
        {p.formEnabled && <DynamicContactForm fields={p.formFields} submitLabel={p.submitLabel} />}
      </div>
    </div>
  );
}

