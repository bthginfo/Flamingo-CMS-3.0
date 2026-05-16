'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { CalendarDays, Phone } from 'lucide-react';
import { asButton, asList, type SectionProps } from './types';

type ReservationViewProps = {
  headline: string;
  subline: string;
  badgeText: string;
  introText: string;
  formEnabled: boolean;
  submitLabel: string;
  phoneCta: { label?: string; href?: string };
  externalBookingCta: { label?: string; href?: string };
  partySizeOptions: string[];
  timeHint: string;
  policyText: string;
  image: string;
};

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

  const props: ReservationViewProps = { headline, subline, badgeText, introText, formEnabled, submitLabel, phoneCta, externalBookingCta, partySizeOptions, timeHint, policyText, image };

  if (styleVariant === 'bold') return <ReservationBold {...props} />;
  if (styleVariant === 'modern') return <ReservationModern {...props} />;
  return <ReservationClassic {...props} />;
}

function ReservationClassic(props: ReservationViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
      <div className="space-y-6">
        {props.badgeText && <p className="inline-block rounded-full bg-brand-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-accent">{props.badgeText}</p>}
        <h2 className="text-3xl sm:text-5xl font-[700] text-gray-900">{props.headline}</h2>
        {props.subline && <p className="text-lg text-gray-500">{props.subline}</p>}
        {props.introText && <p className="leading-7 text-gray-500">{props.introText}</p>}
        <div className="flex flex-wrap gap-3">
          {props.externalBookingCta.label && <a href={props.externalBookingCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 font-semibold text-white shadow-md"><CalendarDays size={17} />{props.externalBookingCta.label}</a>}
          {props.phoneCta.label && <a href={props.phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 font-semibold text-gray-900"><Phone size={17} />{props.phoneCta.label}</a>}
        </div>
        {props.timeHint && <p className="text-sm text-gray-500">{props.timeHint}</p>}
        {props.policyText && <p className="text-xs text-gray-500 opacity-70">{props.policyText}</p>}
      </div>
      <div className="overflow-hidden rounded-xl border border-black/10 bg-white p-5 shadow-lg">
        {props.image && <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-xl"><Image src={props.image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {props.formEnabled && (
          <form className="grid gap-3">
            <input className="admin-input" placeholder={(props.partySizeOptions[0] as string) || 'Name'} readOnly />
            <input className="admin-input" placeholder={(props.partySizeOptions[1] as string) || 'Personen'} readOnly />
            <input className="admin-input" placeholder={(props.partySizeOptions[2] as string) || 'Datum und Uhrzeit'} readOnly />
            <button type="button" className="rounded-full bg-brand-primary px-5 py-3 font-semibold text-white shadow-md">{props.submitLabel}</button>
          </form>
        )}
      </div>
    </motion.div>
  );
}

function ReservationModern(props: ReservationViewProps) {
  return (
    <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr]">
      <div className="space-y-6">
        {props.badgeText && <p className="text-xs font-light uppercase tracking-[0.2em] text-gray-500">{props.badgeText}</p>}
        <h2 className="text-3xl font-light text-gray-900 sm:text-5xl">{props.headline}</h2>
        <div className="h-px w-16 bg-brand-accent" />
        {props.subline && <p className="font-light leading-relaxed text-gray-500">{props.subline}</p>}
        {props.introText && <p className="font-light leading-7 text-gray-500">{props.introText}</p>}
        <div className="flex flex-wrap gap-4">
          {props.externalBookingCta.label && <a href={props.externalBookingCta.href || '#'} className="inline-flex items-center gap-2 border-b-2 border-[#111827] pb-1 font-medium text-gray-900"><CalendarDays size={17} />{props.externalBookingCta.label}</a>}
          {props.phoneCta.label && <a href={props.phoneCta.href || '#'} className="inline-flex items-center gap-2 font-light text-gray-500"><Phone size={17} />{props.phoneCta.label}</a>}
        </div>
        {props.timeHint && <p className="text-sm font-light text-gray-500">{props.timeHint}</p>}
        {props.policyText && <p className="text-xs font-light text-gray-500">{props.policyText}</p>}
      </div>
      <div className="border border-black/5 p-6">
        {props.image && <div className="relative mb-6 aspect-[4/3] overflow-hidden border border-black/5"><Image src={props.image} alt="" fill className="object-cover" sizes="50vw" /></div>}
        {props.formEnabled && (
          <form className="grid gap-4">
            <input className="admin-input" placeholder={(props.partySizeOptions[0] as string) || 'Name'} readOnly />
            <input className="admin-input" placeholder={(props.partySizeOptions[1] as string) || 'Personen'} readOnly />
            <input className="admin-input" placeholder={(props.partySizeOptions[2] as string) || 'Datum und Uhrzeit'} readOnly />
            <button type="button" className="border-b-2 border-[#111827] bg-transparent py-3 font-medium text-gray-900">{props.submitLabel}</button>
          </form>
        )}
      </div>
    </div>
  );
}

function ReservationBold(props: ReservationViewProps) {
  return (
    <div className="bg-[#111827] p-6 text-white sm:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          {props.badgeText && <p className="inline-block bg-brand-accent px-3 py-1 text-xs font-black uppercase tracking-widest text-gray-900">{props.badgeText}</p>}
          <h2 className="text-3xl font-black uppercase sm:text-5xl">{props.headline}</h2>
          <div className="h-1.5 w-20 bg-brand-accent" />
          {props.subline && <p className="text-lg text-white/70">{props.subline}</p>}
          {props.introText && <p className="leading-7 text-white/65">{props.introText}</p>}
          <div className="flex flex-wrap gap-3">
            {props.externalBookingCta.label && <a href={props.externalBookingCta.href || '#'} className="inline-flex items-center gap-2 rounded-none border-2 border-white bg-white px-6 py-3 font-black uppercase text-gray-900 shadow-[4px_4px_0_rgba(255,255,255,0.3)]"><CalendarDays size={17} />{props.externalBookingCta.label}</a>}
            {props.phoneCta.label && <a href={props.phoneCta.href || '#'} className="inline-flex items-center gap-2 rounded-none border-2 border-white/40 px-6 py-3 font-bold uppercase"><Phone size={17} />{props.phoneCta.label}</a>}
          </div>
          {props.timeHint && <p className="text-sm text-white/50">{props.timeHint}</p>}
          {props.policyText && <p className="text-xs text-white/40">{props.policyText}</p>}
        </div>
        <div className="border-2 border-white/20 p-5 shadow-[4px_4px_0_rgba(255,255,255,0.15)]">
          {props.image && <div className="relative mb-5 aspect-[4/3] overflow-hidden border-2 border-white/20"><Image src={props.image} alt="" fill className="object-cover" sizes="50vw" /></div>}
          {props.formEnabled && (
            <form className="grid gap-3">
              <input className="admin-input" placeholder={(props.partySizeOptions[0] as string) || 'Name'} readOnly />
              <input className="admin-input" placeholder={(props.partySizeOptions[1] as string) || 'Personen'} readOnly />
              <input className="admin-input" placeholder={(props.partySizeOptions[2] as string) || 'Datum und Uhrzeit'} readOnly />
              <button type="button" className="rounded-none border-2 border-white bg-white px-5 py-3 font-black uppercase text-gray-900">{props.submitLabel}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

