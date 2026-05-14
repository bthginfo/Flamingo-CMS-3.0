'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { cn } from '@/lib/utils';

type Props = { data: Record<string, unknown>; variant?: string | null };

const inputClass = 'w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all duration-300 hover:border-gray-300';

export function ContactSection({ data }: Props) {
  const headline = (data.headline as string) || 'Kontakt';
  const introText = (data.introText as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const formEnabled = data.formEnabled !== false;
  const submitLabel = (data.submitLabel as string) || 'Nachricht senden';
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const infoCards = (data.infoCards as { icon: string; label: string; value: string }[]) || [
    { icon: 'phone', label: 'Telefon', value: '' },
    { icon: 'mail', label: 'E-Mail', value: '' },
    { icon: 'map-pin', label: 'Standort', value: '' },
    { icon: 'clock', label: 'Öffnungszeiten', value: '' },
  ];

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        {badgeText && (
          <div className="section-badge">
            <Mail size={14} />
            <span>{badgeText}</span>
          </div>
        )}
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
              <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center text-brand-primary transition-transform group-hover:scale-110')}>
                <DynamicIcon name={card.icon} size={20} />
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
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setStatus('loading');
                const form = e.currentTarget;
                const fd = new FormData(form);
                try {
                  const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: fd.get('name'),
                      email: fd.get('email'),
                      phone: fd.get('phone') || null,
                      message: fd.get('message'),
                      page: window.location.pathname,
                    }),
                  });
                  if (res.ok) {
                    setStatus('success');
                    form.reset();
                  } else {
                    const data = await res.json();
                    setError(data.error || 'Fehler beim Senden.');
                    setStatus('error');
                  }
                } catch {
                  setError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
                  setStatus('error');
                }
              }}
              className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 sm:p-10 space-y-5"
            >
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <CheckCircle className="text-green-500" size={48} />
                  <p className="text-lg font-semibold text-gray-900">Vielen Dank!</p>
                  <p className="text-sm text-gray-500">Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns zeitnah.</p>
                  <button type="button" onClick={() => setStatus('idle')} className="text-sm text-brand-primary hover:underline mt-2">Neue Nachricht senden</button>
                </div>
              ) : (
                <>
                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input name="name" type="text" placeholder="Ihr Name" required className={inputClass} />
                    <input name="email" type="email" placeholder="E-Mail Adresse" required className={inputClass} />
                  </div>
                  <input name="phone" type="tel" placeholder="Telefon (optional)" className={inputClass} />
                  <textarea name="message" placeholder="Wie können wir Ihnen helfen?" rows={5} required className={cn(inputClass, 'resize-none')} />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-brand-primary px-8 py-4 font-semibold text-white transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Send size={16} />
                      {status === 'loading' ? 'Wird gesendet…' : submitLabel}
                    </span>
                    <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.15),transparent)] bg-[length:200%_100%]" />
                  </button>
                </>
              )}
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
