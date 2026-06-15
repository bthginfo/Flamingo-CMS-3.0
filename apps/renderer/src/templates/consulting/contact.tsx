'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DynamicIcon } from '@/components/ui/icon-map';
import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ConsultingContactSection({ data }: Props) {
  const headline = (data.headline as string) || 'Kontakt aufnehmen';
  const subline = (data.subline as string) || '';
  const phone = (data.phone as string) || '';
  const email = (data.email as string) || '';
  const address = (data.address as string) || '';
  const hours = (data.hours as string[]) || [];
  const introText = (data.introText as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const formEnabled = data.formEnabled !== false;
  const submitLabel = (data.submitLabel as string) || 'Erstberatung anfragen';
  const formFields = data.formFields as FormFieldDef[] | undefined;
  const infoCards = data.infoCards as { icon: string; label: string; value: string }[] | undefined;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Build contact items from either infoCards or legacy fields
  const contactItems = infoCards && infoCards.length > 0
    ? infoCards
    : [
        ...(phone ? [{ icon: 'phone', label: 'Telefon', value: phone }] : []),
        ...(email ? [{ icon: 'mail', label: 'E-Mail', value: email }] : []),
        ...(address ? [{ icon: 'map-pin', label: 'Adresse', value: address }] : []),
        ...(hours.length > 0 ? [{ icon: 'clock', label: 'Sprechzeiten', value: hours.join(', ') }] : []),
      ];

  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
        {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-icon)] mb-3" data-edit-path="badgeText">{badgeText}</p>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline" data-edit-path="subline">{plain(subline)}</p>}
        {introText && <div className="text-[color:var(--token-muted)] mt-4 rt-content max-w-2xl mx-auto" data-edit-rich="introText" dangerouslySetInnerHTML={{ __html: introText }} />}
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }} className="space-y-4">
          {contactItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-[color:var(--token-card-border)] hover:border-[color-mix(in_srgb,var(--token-card-border)_30%,transparent)] transition-colors" data-edit-collection="contactItems" data-edit-index={i}>
              <div className="w-10 h-10 rounded-lg bg-[color-mix(in_srgb,var(--token-btn-bg)_10%,transparent)] flex items-center justify-center text-[color:var(--token-icon)]">
                <DynamicIcon editPath="icon" name={item.icon} size={20} />
              </div>
              <div>
                <div className="text-xs text-[color:var(--token-body)] uppercase tracking-wider" data-edit-path="label">{item.label}</div>
                <div className="text-[color:var(--token-heading)] font-medium" data-edit-path="value">{item.value}</div>
              </div>
            </div>
          ))}
        </motion.div>
        {formEnabled && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }}>
            <DynamicContactForm
              fields={formFields}
              submitLabel={submitLabel}
              className="bg-[var(--token-section-bg-alt)] rounded-xl p-8 border border-[color:var(--token-card-border)] space-y-4"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
