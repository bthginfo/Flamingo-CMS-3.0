'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function RealestateContactSection({ data }: Props) {
  const headline = (data.headline as string) || 'Kontakt aufnehmen';
  const subline = (data.subline as string) || '';
  const phone = (data.phone as string) || '';
  const email = (data.email as string) || '';
  const address = (data.address as string) || '';
  const hours = (data.hours as string) || '';

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{headline}</h2>
            {subline && <p className="text-lg text-gray-600 mt-4">{subline}</p>}

            <div className="mt-8 space-y-4">
              {phone && (
                <a href={`tel:${phone}`} className="flex items-center gap-3 text-gray-700 hover:text-brand-primary transition-colors">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center"><Phone size={18} className="text-brand-primary" /></div>
                  {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-3 text-gray-700 hover:text-brand-primary transition-colors">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center"><Mail size={18} className="text-brand-primary" /></div>
                  {email}
                </a>
              )}
              {address && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center"><MapPin size={18} className="text-brand-primary" /></div>
                  {address}
                </div>
              )}
              {hours && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center"><Clock size={18} className="text-brand-primary" /></div>
                  {hours}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-xl p-8 border border-gray-100"
          >
            <h3 className="font-semibold text-gray-900 mb-6">Rückruf anfordern</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Ihr Name" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm" readOnly />
              <input type="email" placeholder="E-Mail-Adresse" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm" readOnly />
              <input type="tel" placeholder="Telefonnummer" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm" readOnly />
              <textarea placeholder="Ihre Nachricht" rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none" readOnly />
              <button className="w-full py-3.5 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors">
                Nachricht senden
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
