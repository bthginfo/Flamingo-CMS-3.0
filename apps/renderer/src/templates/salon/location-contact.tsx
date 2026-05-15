'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

type InfoCard = { icon?: string; label?: string; value?: string };

export function LocationContactSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Kontakt';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Salon';
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

  const props = { headline, subline, badgeText, introText, image, mapEmbedUrl, formEnabled, namePlaceholder, emailPlaceholder, messagePlaceholder, submitLabel, infoCards, primaryCta, secondaryCta };

  if (styleVariant === 'modern') return <ContactModern {...props} />;
  if (styleVariant === 'bold') return <ContactBold {...props} />;
  return <ContactClassic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; introText: string; image: string; mapEmbedUrl: string; formEnabled: boolean; namePlaceholder: string; emailPlaceholder: string; messagePlaceholder: string; submitLabel: string; infoCards: InfoCard[]; primaryCta: ButtonValue; secondaryCta: ButtonValue };

function ContactClassic({ headline, subline, badgeText, introText, image, mapEmbedUrl, formEnabled, namePlaceholder, emailPlaceholder, messagePlaceholder, submitLabel, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-10 max-w-3xl">
          {badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</motion.h2>
          {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
        </div>
        {introText && <p className="text-[var(--style-text-secondary)]">{introText}</p>}
        <div className="mt-6 grid gap-3">{infoCards.map((card, i) => <div key={`${card.label}-${i}`} className="flex gap-4 border-t border-[var(--style-badge-bg)]/20 pt-4"><DynamicIcon name={card.icon || 'mail'} size={20} className="text-[var(--style-accent)]" /><div><p className="text-xs text-[var(--style-text-secondary)]">{card.label || ''}</p><p className="font-semibold text-[var(--style-text-primary)]">{card.value || ''}</p></div></div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex rounded-full bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white shadow-md">{primaryCta.label}</a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex rounded-full border border-[var(--style-badge-bg)]/30 px-5 py-3 font-semibold text-[var(--style-text-primary)]">{secondaryCta.label}</a>}
        </div>
      </div>
      <div className="rounded-2xl border border-[var(--style-badge-bg)]/20 bg-[var(--style-card-bg)] p-5 shadow-md">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe src={mapEmbedUrl} className="mb-5 h-56 w-full rounded-xl" loading="lazy" />}
        {formEnabled && <form className="grid gap-3"><input className="admin-input" placeholder={namePlaceholder} readOnly /><input className="admin-input" placeholder={emailPlaceholder} readOnly /><textarea className="admin-input" placeholder={messagePlaceholder} readOnly /><button type="button" className="rounded-full bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white shadow-md">{submitLabel}</button></form>}
      </div>
    </div>
  );
}

function ContactModern({ headline, subline, badgeText, introText, image, mapEmbedUrl, formEnabled, namePlaceholder, emailPlaceholder, messagePlaceholder, submitLabel, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-16 lg:grid-cols-2">
      <div>
        <div className="mb-14 max-w-3xl">
          {badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[var(--style-text-secondary)]">{badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
          {subline && <p className="mt-4 font-light text-[var(--style-text-secondary)]">{subline}</p>}
        </div>
        {introText && <p className="font-light text-[var(--style-text-secondary)]">{introText}</p>}
        <div className="mt-6 grid gap-4">{infoCards.map((card, i) => <div key={`${card.label}-${i}`} className="flex gap-4 border-t border-black/10 pt-4"><DynamicIcon name={card.icon || 'mail'} size={18} className="text-[var(--style-accent)]" /><div><p className="text-xs font-light text-[var(--style-text-secondary)]">{card.label || ''}</p><p className="font-light text-[var(--style-text-primary)]">{card.value || ''}</p></div></div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex border border-[var(--style-text-primary)] px-6 py-3 font-light text-[var(--style-text-primary)]">{primaryCta.label}</a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex px-6 py-3 font-light text-[var(--style-text-secondary)]">{secondaryCta.label}</a>}
        </div>
      </div>
      <div className="border border-black/10 p-5">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe src={mapEmbedUrl} className="mb-5 h-56 w-full" loading="lazy" />}
        {formEnabled && <form className="grid gap-3"><input className="admin-input" placeholder={namePlaceholder} readOnly /><input className="admin-input" placeholder={emailPlaceholder} readOnly /><textarea className="admin-input" placeholder={messagePlaceholder} readOnly /><button type="button" className="border border-[var(--style-text-primary)] px-5 py-3 font-light text-[var(--style-text-primary)]">{submitLabel}</button></form>}
      </div>
    </div>
  );
}

function ContactBold({ headline, subline, badgeText, introText, image, mapEmbedUrl, formEnabled, namePlaceholder, emailPlaceholder, messagePlaceholder, submitLabel, infoCards, primaryCta, secondaryCta }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-10 max-w-3xl">
          {badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--style-accent)]">{badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl text-[var(--style-text-primary)]">{headline}</h2>
          {subline && <p className="mt-4 font-bold text-[var(--style-text-secondary)]">{subline}</p>}
        </div>
        {introText && <p className="font-bold text-[var(--style-text-secondary)]">{introText}</p>}
        <div className="mt-6 grid gap-3">{infoCards.map((card, i) => <div key={`${card.label}-${i}`} className="flex gap-4 border-t-2 border-[var(--style-text-primary)] pt-4"><DynamicIcon name={card.icon || 'mail'} size={20} className="text-[var(--style-accent)]" /><div><p className="text-xs font-bold uppercase text-[var(--style-text-secondary)]">{card.label || ''}</p><p className="font-black text-[var(--style-text-primary)]">{card.value || ''}</p></div></div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          {primaryCta.label && <a href={primaryCta.href || '#'} className="inline-flex bg-[var(--style-accent)] px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{primaryCta.label}</a>}
          {secondaryCta.label && <a href={secondaryCta.href || '#'} className="inline-flex border-2 border-[var(--style-text-primary)] px-6 py-3 font-black uppercase text-[var(--style-text-primary)] shadow-[4px_4px_0_var(--style-accent)]">{secondaryCta.label}</a>}
        </div>
      </div>
      <div className="border-2 border-[var(--style-text-primary)] bg-[#111] p-5 shadow-[4px_4px_0_var(--style-accent)]">
        {image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {mapEmbedUrl && <iframe src={mapEmbedUrl} className="mb-5 h-56 w-full" loading="lazy" />}
        {formEnabled && <form className="grid gap-3"><input className="admin-input" placeholder={namePlaceholder} readOnly /><input className="admin-input" placeholder={emailPlaceholder} readOnly /><textarea className="admin-input" placeholder={messagePlaceholder} readOnly /><button type="button" className="bg-[var(--style-accent)] px-5 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{submitLabel}</button></form>}
      </div>
    </div>
  );
}
