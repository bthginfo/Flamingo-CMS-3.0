'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function CafeContactSection({ data }: Props) {
  const headline = (data.headline as string) || 'Schreib uns';
  const subline = (data.subline as string) || '';
  const introText = (data.introText as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const phone = (data.phone as string) || '';
  const email = (data.email as string) || '';
  const address = (data.address as string) || '';
  const formEnabled = data.formEnabled !== false;
  const submitLabel = (data.submitLabel as string) || 'Nachricht senden';
  const formFields = data.formFields as FormFieldDef[] | undefined;
  const infoCards = data.infoCards as { icon: string; label: string; value: string }[] | undefined;

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  // Build contact items from either infoCards array or legacy phone/email/address fields
  const contactItems = infoCards && infoCards.length > 0
    ? infoCards
    : [
        ...(phone ? [{ icon: 'phone', label: 'Telefon', value: phone }] : []),
        ...(email ? [{ icon: 'mail', label: 'E-Mail', value: email }] : []),
        ...(address ? [{ icon: 'map-pin', label: 'Adresse', value: address }] : []),
      ];

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-icon,var(--brand-primary,#1a5276))] mb-3">{badgeText}</p>}
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading,#18181b)]">{headline}</h2>
          {subline && <p className="text-[color:var(--token-muted,#52525b)] mt-3">{plain(subline)}</p>}
          {introText && <div className="text-[color:var(--token-muted,#52525b)] mt-4 rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
        </motion.div>

        <div className={formEnabled ? 'grid grid-cols-1 lg:grid-cols-5 gap-10' : ''}>
          {/* Info cards */}
          {contactItems.length > 0 && (
            <div className={formEnabled ? 'lg:col-span-2 space-y-4' : 'flex flex-wrap justify-center gap-4'}>
              {contactItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--token-section-bg-alt,#fafafa)] border border-[color:var(--token-card-border,#f4f4f5)]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--token-btn-bg,var(--brand-primary,#1a5276))/10] flex items-center justify-center text-[color:var(--token-icon,var(--brand-primary,#1a5276))]">
                    <DynamicIcon name={item.icon} size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-[color:var(--token-body,#a1a1aa)] uppercase tracking-wider">{item.label}</div>
                    <div className="text-sm font-medium text-[color:var(--token-heading,#18181b)]">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Form */}
          {formEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <DynamicContactForm
                fields={formFields}
                submitLabel={submitLabel}
                className="bg-[var(--token-card-bg,#ffffff)] rounded-2xl border border-[color:var(--token-card-border,#f4f4f5)] shadow-sm p-8 space-y-5"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
