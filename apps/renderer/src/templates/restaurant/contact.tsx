'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';

type InfoCard = { icon?: string; label?: string; value?: string };

export function RestaurantContactSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Kontakt';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const introText = (data.introText as string) || '';
  const image = (data.image as string) || '';
  const mapEmbedUrl = (data.mapEmbedUrl as string) || '';
  const formEnabled = (data.formEnabled as boolean) ?? true;
  const namePlaceholder = (data.namePlaceholder as string) || 'Name';
  const emailPlaceholder = (data.emailPlaceholder as string) || 'E-Mail';
  const messagePlaceholder = (data.messagePlaceholder as string) || 'Ihre Nachricht';
  const submitLabel = (data.submitLabel as string) || 'Nachricht senden';
  const infoCards = asList<InfoCard>(data.infoCards);
  const primaryCta = asButton(data.primaryCta);
  const secondaryCta = asButton(data.secondaryCta);

  const props = { headline, subline, badgeText, introText, image, mapEmbedUrl, formEnabled, namePlaceholder, emailPlaceholder, messagePlaceholder, submitLabel, infoCards, primaryCta, secondaryCta };

  if (styleVariant === 'modern') return <Modern {...props} />;
  if (styleVariant === 'bold') return <Bold {...props} />;
  return <Classic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; introText: string; image: string; mapEmbedUrl: string; formEnabled: boolean; namePlaceholder: string; emailPlaceholder: string; messagePlaceholder: string; submitLabel: string; infoCards: InfoCard[]; primaryCta: ButtonValue; secondaryCta: ButtonValue };

function InfoCards({ cards }: { cards: InfoCard[] }) {
  return (
    <div className="grid gap-3">
      {cards.map((card, i) => (
        <div key={`${card.label}-${i}`} className="flex gap-4 border-t border-[var(--style-badge-bg)]/20 pt-4">
          <DynamicIcon name={card.icon || 'mail'} size={20} className="text-[var(--style-accent)]" />
          <div>
            <p className="text-xs text-[var(--style-text-secondary)]">{card.label || ''}</p>
            <p className="font-semibold text-[var(--style-text-primary)]">{card.value || ''}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FormBlock({ formEnabled, namePlaceholder, emailPlaceholder, messagePlaceholder, submitLabel }: Pick<Props, 'formEnabled' | 'namePlaceholder' | 'emailPlaceholder' | 'messagePlaceholder' | 'submitLabel'>) {
  if (!formEnabled) return null;
  return (
    <form className="grid gap-3">
      <input className="admin-input" placeholder={namePlaceholder} readOnly />
      <input className="admin-input" placeholder={emailPlaceholder} readOnly />
      <textarea className="admin-input" rows={4} placeholder={messagePlaceholder} readOnly />
      <button type="button" className="rounded-full bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white shadow-md">{submitLabel}</button>
    </form>
  );
}

function Classic(p: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-10 max-w-3xl">
          {p.badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{p.badgeText}</motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{p.headline}</motion.h2>
          {p.subline && <p className="mt-4 text-[var(--style-text-secondary)]">{p.subline}</p>}
        </div>
        {p.introText && <p className="text-[var(--style-text-secondary)]">{p.introText}</p>}
        <div className="mt-6"><InfoCards cards={p.infoCards} /></div>
        <div className="mt-8 flex flex-wrap gap-3">
          {p.primaryCta.label && <a href={p.primaryCta.href || '#'} className="inline-flex rounded-full bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white shadow-md">{p.primaryCta.label}</a>}
          {p.secondaryCta.label && <a href={p.secondaryCta.href || '#'} className="inline-flex rounded-full border border-[var(--style-badge-bg)]/30 px-5 py-3 font-semibold text-[var(--style-text-primary)]">{p.secondaryCta.label}</a>}
        </div>
      </div>
      <div className="rounded-2xl border border-[var(--style-badge-bg)]/20 bg-[var(--style-card-bg)] p-5 shadow-md">
        {p.image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl"><Image src={p.image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {p.mapEmbedUrl && <iframe src={p.mapEmbedUrl} title="Standort" className="mb-5 h-56 w-full rounded-xl" loading="lazy" />}
        <FormBlock formEnabled={p.formEnabled} namePlaceholder={p.namePlaceholder} emailPlaceholder={p.emailPlaceholder} messagePlaceholder={p.messagePlaceholder} submitLabel={p.submitLabel} />
      </div>
    </div>
  );
}

function Modern(p: Props) {
  return (
    <div className="grid gap-16 lg:grid-cols-2">
      <div>
        <div className="mb-14 max-w-3xl">
          {p.badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-[var(--style-text-secondary)]">{p.badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light sm:text-5xl text-[var(--style-text-primary)]">{p.headline}</h2>
          {p.subline && <p className="mt-4 font-light text-[var(--style-text-secondary)]">{p.subline}</p>}
        </div>
        {p.introText && <p className="font-light text-[var(--style-text-secondary)]">{p.introText}</p>}
        <div className="mt-6">{p.infoCards.map((c, i) => <div key={`${c.label}-${i}`} className="flex gap-4 border-t border-black/10 pt-4"><DynamicIcon name={c.icon || 'mail'} size={18} className="text-[var(--style-accent)]" /><div><p className="text-xs font-light text-[var(--style-text-secondary)]">{c.label || ''}</p><p className="font-light text-[var(--style-text-primary)]">{c.value || ''}</p></div></div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          {p.primaryCta.label && <a href={p.primaryCta.href || '#'} className="inline-flex border border-[var(--style-text-primary)] px-6 py-3 font-light text-[var(--style-text-primary)]">{p.primaryCta.label}</a>}
          {p.secondaryCta.label && <a href={p.secondaryCta.href || '#'} className="inline-flex px-6 py-3 font-light text-[var(--style-text-secondary)]">{p.secondaryCta.label}</a>}
        </div>
      </div>
      <div className="border border-black/10 p-5">
        {p.image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={p.image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {p.mapEmbedUrl && <iframe src={p.mapEmbedUrl} title="Standort" className="mb-5 h-56 w-full" loading="lazy" />}
        {p.formEnabled && <form className="grid gap-3"><input className="admin-input" placeholder={p.namePlaceholder} readOnly /><input className="admin-input" placeholder={p.emailPlaceholder} readOnly /><textarea className="admin-input" rows={4} placeholder={p.messagePlaceholder} readOnly /><button type="button" className="border border-[var(--style-text-primary)] px-5 py-3 font-light text-[var(--style-text-primary)]">{p.submitLabel}</button></form>}
      </div>
    </div>
  );
}

function Bold(p: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-10 max-w-3xl">
          {p.badgeText && <p className="text-xs font-black uppercase tracking-widest text-[var(--style-accent)]">{p.badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl text-[var(--style-text-primary)]">{p.headline}</h2>
          {p.subline && <p className="mt-4 font-bold text-[var(--style-text-secondary)]">{p.subline}</p>}
        </div>
        {p.introText && <p className="font-bold text-[var(--style-text-secondary)]">{p.introText}</p>}
        <div className="mt-6">{p.infoCards.map((c, i) => <div key={`${c.label}-${i}`} className="flex gap-4 border-t-2 border-[var(--style-text-primary)] pt-4"><DynamicIcon name={c.icon || 'mail'} size={20} className="text-[var(--style-accent)]" /><div><p className="text-xs font-bold uppercase text-[var(--style-text-secondary)]">{c.label || ''}</p><p className="font-black text-[var(--style-text-primary)]">{c.value || ''}</p></div></div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          {p.primaryCta.label && <a href={p.primaryCta.href || '#'} className="inline-flex bg-[var(--style-accent)] px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{p.primaryCta.label}</a>}
          {p.secondaryCta.label && <a href={p.secondaryCta.href || '#'} className="inline-flex border-2 border-[var(--style-text-primary)] px-6 py-3 font-black uppercase text-[var(--style-text-primary)] shadow-[4px_4px_0_var(--style-accent)]">{p.secondaryCta.label}</a>}
        </div>
      </div>
      <div className="bg-[var(--style-card-bg)] p-5 shadow-[6px_6px_0_var(--style-accent)]">
        {p.image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={p.image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {p.mapEmbedUrl && <iframe src={p.mapEmbedUrl} title="Standort" className="mb-5 h-56 w-full" loading="lazy" />}
        {p.formEnabled && <form className="grid gap-3"><input className="admin-input" placeholder={p.namePlaceholder} readOnly /><input className="admin-input" placeholder={p.emailPlaceholder} readOnly /><textarea className="admin-input" rows={4} placeholder={p.messagePlaceholder} readOnly /><button type="button" className="bg-[var(--style-accent)] px-5 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{p.submitLabel}</button></form>}
      </div>
    </div>
  );
}
