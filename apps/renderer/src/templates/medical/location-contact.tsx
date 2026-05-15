'use client';

import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';
import { baseHeader, CtaButton, SectionHeader, asButton, asList } from './shared';
import type { SectionProps } from './types';

type InfoCard = { icon?: string; label?: string; value?: string };

export function MedicalLocationContactSection({ data }: SectionProps) {
  const header = baseHeader(data, 'Kontakt & Standort', 'Kontakt');
  const introText = (data.introText as string) || '';
  const image = (data.image as string) || '';
  const mapEmbedUrl = (data.mapEmbedUrl as string) || '';
  const formEnabled = (data.formEnabled as boolean) ?? true;
  const namePlaceholder = (data.namePlaceholder as string) || 'Name';
  const emailPlaceholder = (data.emailPlaceholder as string) || 'E-Mail';
  const messagePlaceholder = (data.messagePlaceholder as string) || 'Nachricht';
  const submitLabel = (data.submitLabel as string) || 'Anfrage senden';
  const infoCards = asList<InfoCard>(data.infoCards);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);
  return <div className="grid gap-10 lg:grid-cols-2"><div><SectionHeader {...header} />{introText && <p className="text-[var(--style-text-secondary)]">{introText}</p>}<div className="mt-6 grid gap-3">{infoCards.map((card, index) => <div key={`${card.label}-${index}`} className="flex gap-4 border-t border-black/10 pt-4"><DynamicIcon name={card.icon || 'mail'} size={20} /><div><p className="text-xs text-[var(--style-text-secondary)]">{card.label || ''}</p><p className="font-semibold text-[var(--style-text-primary)]">{card.value || ''}</p></div></div>)}</div><div className="mt-8 flex flex-wrap gap-3"><CtaButton cta={primaryCta} /><CtaButton cta={secondaryCta} /></div></div><div className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-5 shadow-[var(--style-card-shadow)]">{image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-[var(--style-radius-md)]"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}{mapEmbedUrl && <iframe src={mapEmbedUrl} className="mb-5 h-56 w-full rounded-[var(--style-radius-md)]" loading="lazy" />}{formEnabled && <form className="grid gap-3"><input className="admin-input" placeholder={namePlaceholder} readOnly /><input className="admin-input" placeholder={emailPlaceholder} readOnly /><textarea className="admin-input" placeholder={messagePlaceholder} readOnly /><button type="button" className="rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{submitLabel}</button></form>}</div></div>;
}
