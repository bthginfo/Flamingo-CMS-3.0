'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = { data: Record<string, unknown>; variant?: string | null };

const inputClass = 'w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all duration-300 hover:border-gray-300';

export function ContactSection({ data }: Props) {
  const headline = (data.headline as string) || 'Kontakt';
  const introText = (data.introText as string) || '';
  const formEnabled = data.formEnabled !== false;
  const submitLabel = (data.submitLabel as string) || 'Nachricht senden';
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const infoCards = [
    { icon: Phone, label: 'Telefon', value: 'Jetzt anrufen', color: 'from-blue-500/10 to-blue-600/5' },
    { icon: Mail, label: 'E-Mail', value: 'Schreiben Sie uns', color: 'from-emerald-500/10 to-emerald-600/5' },
    { icon: MapPin, label: 'Standort', value: 'München & Umgebung', color: 'from-orange-500/10 to-orange-600/5' },
    { icon: Clock, label: 'Öffnungszeiten', value: 'Mo\u2013Fr 7:00\u201318:00', color: 'from-purple-500/10 to-purple-600/5' },
  ];

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="section-badge">
          <Mail size={14} />
          <span>Kontakt aufnehmen</span>
        </div>
        <h2 className="section-headline">{headline}</h2>
        {introText && <p className="section-subline">{introText}</p>}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
        {/* Info cards */}
        <div className="lg:col-span-2 space-y-4">
          {infoCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-brand-primary transition-transform group-hover:scale-110', card.color)}>
                <card.icon size={20} />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">{card.label}</div>
                <div className="text-sm font-semibold text-gray-900">{card.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        {formEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 sm:p-10 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input type="text" placeholder="Ihr Name" required className={inputClass} />
                <input type="email" placeholder="E-Mail Adresse" required className={inputClass} />
              </div>
              <input type="tel" placeholder="Telefon (optional)" className={inputClass} />
              <textarea placeholder="Wie können wir Ihnen helfen?" rows={5} required className={cn(inputClass, 'resize-none')} />
              <button
                type="submit"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-brand-primary px-8 py-4 font-semibold text-white transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Send size={16} />
                  {submitLabel}
                </span>
                <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.15),transparent)] bg-[length:200%_100%]" />
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
