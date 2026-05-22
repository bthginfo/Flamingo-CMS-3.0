'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function RealestateContactSection({ data }: Props) {
  const headline = (data.headline as string) || 'Kontakt aufnehmen';
  const subline = (data.subline as string) || '';
  const phone = (data.phone as string) || '';
  const email = (data.email as string) || '';
  const address = (data.address as string) || '';
  const hours = (data.hours as string) || '';
  const introText = (data.introText as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const formEnabled = data.formEnabled !== false;
  const submitLabel = (data.submitLabel as string) || 'Nachricht senden';
  const formFields = data.formFields as FormFieldDef[] | undefined;
  const infoCards = data.infoCards as { icon: string; label: string; value: string }[] | undefined;

  // Build contact items from either infoCards or legacy fields
  const contactItems = infoCards && infoCards.length > 0
    ? infoCards
    : [
        ...(phone ? [{ icon: 'phone', label: 'Telefon', value: phone }] : []),
        ...(email ? [{ icon: 'mail', label: 'E-Mail', value: email }] : []),
        ...(address ? [{ icon: 'map-pin', label: 'Adresse', value: address }] : []),
        ...(hours ? [{ icon: 'clock', label: 'Öffnungszeiten', value: hours }] : []),
      ];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className={formEnabled ? 'grid lg:grid-cols-2 gap-12' : ''}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
            {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-3">{badgeText}</p>}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{headline}</h2>
            {subline && <p className="text-lg text-gray-600 mt-4">{subline}</p>}
            {introText && <div className="text-gray-600 mt-4 rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}

            <div className="mt-8 space-y-4">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary">
                    <DynamicIcon name={item.icon} size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</div>
                    <div className="text-sm font-medium text-gray-900">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {formEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <DynamicContactForm
                fields={formFields}
                submitLabel={submitLabel}
                className="bg-gray-50 rounded-xl p-8 border border-gray-100 space-y-4"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
