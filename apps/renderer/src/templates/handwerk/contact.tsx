'use client';

import { AnimateOnScroll, StaggerOnScroll, fadeUp } from '@/components/animate';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null };

const inputClass = 'w-full bg-surface border border-gray-200 rounded-xl px-5 py-3.5 text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all duration-200';

export function ContactSection({ data }: Props) {
  const headline = (data.headline as string) || 'Kontakt';
  const introText = (data.introText as string) || '';
  const formEnabled = data.formEnabled !== false;
  const submitLabel = (data.submitLabel as string) || 'Absenden';

  const infoCards = [
    { icon: Phone, label: 'Telefon', value: 'Aus den Seitendaten' },
    { icon: Mail, label: 'E-Mail', value: 'Aus den Seitendaten' },
    { icon: MapPin, label: 'Adresse', value: 'Aus den Seitendaten' },
    { icon: Clock, label: 'Öffnungszeiten', value: 'Mo–Fr 7:00–18:00' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
      <div className="lg:col-span-2">
        <AnimateOnScroll>
          <h2 className="section-headline !text-left">{headline}</h2>
          {introText && <p className="text-gray-500 leading-relaxed mb-8">{introText}</p>}
        </AnimateOnScroll>
        <StaggerOnScroll className="space-y-4">
          {infoCards.map((card, i) => (
            <AnimateOnScroll key={i} variants={fadeUp}>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <card.icon size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">{card.label}</div>
                  <div className="text-sm font-medium">{card.value}</div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </StaggerOnScroll>
      </div>
      {formEnabled && (
        <AnimateOnScroll className="lg:col-span-3">
          <form className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input type="text" placeholder="Name" required className={inputClass} />
              <input type="email" placeholder="E-Mail" required className={inputClass} />
            </div>
            <input type="tel" placeholder="Telefon (optional)" className={inputClass} />
            <textarea placeholder="Ihre Nachricht" rows={5} required className={inputClass + ' resize-none'} />
            <button type="submit" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
              <Send size={16} />
              {submitLabel}
            </button>
          </form>
        </AnimateOnScroll>
      )}
    </div>
  );
}
