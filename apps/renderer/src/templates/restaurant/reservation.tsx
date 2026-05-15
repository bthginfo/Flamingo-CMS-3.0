'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { CalendarDays, Phone } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

export function ReservationSection({ data, styleVariant }: SectionProps) {
  const headline = (data.headline as string) || 'Tisch reservieren';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Reservierung';
  const introText = (data.introText as string) || '';
  const formEnabled = (data.formEnabled as boolean) ?? true;
  const submitLabel = (data.submitLabel as string) || 'Anfrage senden';
  const phoneCta = asButton(data.phoneCta);
  const externalBookingCta = asButton(data.externalBookingCta);
  const partySizeOptions = asList<string>(data.partySizeOptions);
  const timeHint = (data.timeHint as string) || '';
  const policyText = (data.policyText as string) || '';
  const image = (data.image as string) || '';
  const isBold = styleVariant === 'bold';

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`grid gap-8 lg:grid-cols-[1fr_0.8fr] ${isBold ? 'bg-[var(--style-text-primary)] text-white p-6 sm:p-10' : ''}`}>
      <div className="space-y-6">
        {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
        <h2 className={`text-3xl sm:text-5xl font-[var(--style-heading-weight)] ${isBold ? 'text-white' : 'text-[var(--style-text-primary)]'}`}>{headline}</h2>
        {subline && <p className={`text-lg ${isBold ? 'text-white/70' : 'text-[var(--style-text-secondary)]'}`}>{subline}</p>}
        {introText && <p className={`leading-7 ${isBold ? 'text-white/65' : 'text-[var(--style-text-secondary)]'}`}>{introText}</p>}
        <div className="flex flex-wrap gap-3">
          {externalBookingCta.label && <a href={externalBookingCta.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white"><CalendarDays size={17} />{externalBookingCta.label}</a>}
          {phoneCta.label && <a href={phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-[var(--style-button-radius)] border border-current/20 px-5 py-3 font-semibold"><Phone size={17} />{phoneCta.label}</a>}
        </div>
        {timeHint && <p className="text-sm opacity-70">{timeHint}</p>}
        {policyText && <p className="text-xs opacity-55">{policyText}</p>}
      </div>
      <div className="rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)] p-5 shadow-[var(--style-card-shadow)]">
        {image && <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[var(--style-radius-md)]"><Image src={image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {formEnabled && (
          <form className="grid gap-3">
            <input className="admin-input" placeholder={(partySizeOptions[0] as string) || 'Name'} readOnly />
            <input className="admin-input" placeholder={(partySizeOptions[1] as string) || 'Personen'} readOnly />
            <input className="admin-input" placeholder={(partySizeOptions[2] as string) || 'Datum und Uhrzeit'} readOnly />
            <button type="button" className="rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{submitLabel}</button>
          </form>
        )}
      </div>
    </motion.div>
  );
}

