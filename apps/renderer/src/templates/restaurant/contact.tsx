'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { DynamicIcon } from '@/components/ui/icon-map';
import { asButton, asList, type SectionProps, type ButtonValue } from './types';
import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';

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

  if (styleVariant === 'modern') return <Modern {...props} />;
  if (styleVariant === 'bold') return <Bold {...props} />;
  return <Classic {...props} />;
}

type Props = { headline: string; subline: string; badgeText: string; introText: string; image: string; mapEmbedUrl: string; formEnabled: boolean; submitLabel: string; formFields?: FormFieldDef[]; infoCards: InfoCard[]; primaryCta: ButtonValue; secondaryCta: ButtonValue };

function InfoCards({ cards }: { cards: InfoCard[] }) {
  return (
    <div className="grid gap-3">
      {cards.map((card, i) => (
        <div key={`${card.label}-${i}`} className="flex gap-4 border-t border-[var(--brand-primary)]/20 pt-4">
          <DynamicIcon name={card.icon || 'mail'} size={20} className="text-brand-accent" />
          <div>
            <p className="text-xs text-gray-600">{card.label || ''}</p>
            <p className="font-semibold text-gray-900">{card.value || ''}</p>
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
          {p.badgeText && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs font-bold uppercase tracking-widest text-gray-600">{p.badgeText}</motion.p>}
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-3 text-3xl sm:text-3xl md:text-5xl font-[700] text-gray-900">{p.headline}</motion.h2>
          {p.subline && <div className="mt-4 text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: p.subline }} />}
        </div>
        {p.introText && <p className="text-gray-600">{p.introText}</p>}
        <div className="mt-6"><InfoCards cards={p.infoCards} /></div>
        <div className="mt-8 flex flex-wrap gap-3">
          {p.primaryCta.label && <a href={p.primaryCta.href || '#'} className="inline-flex rounded-full bg-[#111827] px-5 py-3 font-semibold text-white shadow-md">{p.primaryCta.label}</a>}
          {p.secondaryCta.label && <a href={p.secondaryCta.href || '#'} className="inline-flex rounded-full border border-[var(--brand-primary)]/30 px-5 py-3 font-semibold text-gray-900">{p.secondaryCta.label}</a>}
        </div>
      </div>
      <div className="rounded-xl border border-[var(--brand-primary)]/20 bg-white p-5 shadow-md">
        {p.image && <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl"><Image src={p.image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {p.mapEmbedUrl && <iframe src={p.mapEmbedUrl} title="Standort" className="mb-5 h-56 w-full rounded-xl" loading="lazy" />}
        {p.formEnabled && <DynamicContactForm fields={p.formFields} submitLabel={p.submitLabel} />}
      </div>
    </div>
  );
}

function Modern(p: Props) {
  return (
    <div className="grid gap-16 lg:grid-cols-2">
      <div>
        <div className="mb-14 max-w-3xl">
          {p.badgeText && <p className="text-xs font-light uppercase tracking-[0.3em] text-gray-600">{p.badgeText}</p>}
          <h2 className="mt-4 text-3xl font-light sm:text-3xl md:text-5xl text-gray-900">{p.headline}</h2>
          {p.subline && <div className="mt-4 font-light text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: p.subline }} />}
        </div>
        {p.introText && <p className="font-light text-gray-600">{p.introText}</p>}
        <div className="mt-6">{p.infoCards.map((c, i) => <div key={`${c.label}-${i}`} className="flex gap-4 border-t border-black/10 pt-4"><DynamicIcon name={c.icon || 'mail'} size={18} className="shrink-0 text-brand-accent" /><div className="min-w-0 flex-1"><p className="text-xs font-light text-gray-600">{c.label || ''}</p><p className="break-words font-light text-gray-900">{c.value || ''}</p></div></div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          {p.primaryCta.label && <a href={p.primaryCta.href || '#'} className="inline-flex border border-[#111827] px-6 py-3 font-light text-gray-900">{p.primaryCta.label}</a>}
          {p.secondaryCta.label && <a href={p.secondaryCta.href || '#'} className="inline-flex px-6 py-3 font-light text-gray-600">{p.secondaryCta.label}</a>}
        </div>
      </div>
      <div className="border border-black/10 p-5">
        {p.image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={p.image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {p.mapEmbedUrl && <iframe src={p.mapEmbedUrl} title="Standort" className="mb-5 h-56 w-full" loading="lazy" />}
        {p.formEnabled && <DynamicContactForm fields={p.formFields} submitLabel={p.submitLabel} />}
      </div>
    </div>
  );
}

function Bold(p: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-10 max-w-3xl">
          {p.badgeText && <p className="text-xs font-black uppercase tracking-widest text-brand-accent">{p.badgeText}</p>}
          <h2 className="mt-3 text-3xl font-black uppercase sm:text-3xl md:text-5xl text-gray-900">{p.headline}</h2>
          {p.subline && <div className="mt-4 font-bold text-gray-600 rt-content" dangerouslySetInnerHTML={{ __html: p.subline }} />}
        </div>
        {p.introText && <p className="font-bold text-gray-600">{p.introText}</p>}
        <div className="mt-6">{p.infoCards.map((c, i) => <div key={`${c.label}-${i}`} className="flex gap-4 border-t-2 border-[#111827] pt-4"><DynamicIcon name={c.icon || 'mail'} size={20} className="shrink-0 text-brand-accent" /><div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase text-gray-600">{c.label || ''}</p><p className="break-words font-black text-gray-900">{c.value || ''}</p></div></div>)}</div>
        <div className="mt-8 flex flex-wrap gap-3">
          {p.primaryCta.label && <a href={p.primaryCta.href || '#'} className="inline-flex bg-brand-accent px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_rgba(0,0,0,0.8)]">{p.primaryCta.label}</a>}
          {p.secondaryCta.label && <a href={p.secondaryCta.href || '#'} className="inline-flex border-2 border-[#111827] px-6 py-3 font-black uppercase text-gray-900 shadow-[4px_4px_0_var(--brand-accent)]">{p.secondaryCta.label}</a>}
        </div>
      </div>
      <div className="bg-white p-5 shadow-[6px_6px_0_var(--brand-accent)]">
        {p.image && <div className="relative mb-5 aspect-[16/10] overflow-hidden"><Image src={p.image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {p.mapEmbedUrl && <iframe src={p.mapEmbedUrl} title="Standort" className="mb-5 h-56 w-full" loading="lazy" />}
        {p.formEnabled && <DynamicContactForm fields={p.formFields} submitLabel={p.submitLabel} />}
      </div>
    </div>
  );
}
