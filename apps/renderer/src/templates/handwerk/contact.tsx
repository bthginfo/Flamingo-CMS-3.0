'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { cn } from '@/lib/utils';
import { DynamicContactForm, type FormFieldDef } from '@/components/dynamic-contact-form';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function ContactSection({ data }: Props) {
  const headline = (data.headline as string) || 'Kontakt';
  const introText = (data.introText as string) || '';
  const badgeText = (data.badgeText as string) || '';
  const formEnabled = data.formEnabled !== false;
  const submitLabel = (data.submitLabel as string) || 'Nachricht senden';
  const formFields = data.formFields as FormFieldDef[] | undefined;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

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
        className="text-center mb-10 md:mb-16"
      >
        {badgeText && (
          <div className="section-badge">
            <Mail size={14} />
            <span>{badgeText}</span>
          </div>
        )}
        <h2 className="section-headline">{headline}</h2>
        {introText && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: introText }} />}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-8 lg:gap-16">
        {/* Info cards */}
        <div className="lg:col-span-2 space-y-4">
          {infoCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--token-card-bg,var(--token-card-bg, var(--style-card-bg,#fff)))] border border-[var(--token-card-border,var(--token-card-border, var(--style-border-color,rgba(0,0,0,.08))))] shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <div className={cn('w-12 h-12 rounded-xl bg-[color-mix(in_srgb,var(--token-icon,var(--token-icon, var(--style-icon-color,var(--style-accent-color,var(--brand-primary)))))_12%,transparent)] flex items-center justify-center text-[var(--token-icon,var(--token-icon, var(--style-icon-color,var(--style-accent-color,var(--brand-primary)))))] transition-transform group-hover:scale-110')}>
                <DynamicIcon name={card.icon} size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-[var(--token-muted,var(--token-muted, var(--style-text-muted,var(--style-text-secondary,#64748b))))] uppercase tracking-wider font-medium">{card.label}</div>
                <div className="text-sm font-semibold text-[var(--token-heading,var(--token-heading, var(--style-heading-color,var(--style-text-primary,#111827))))] break-words">{card.value}</div>
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
            <DynamicContactForm
              fields={formFields}
              submitLabel={submitLabel}
              className="bg-[var(--token-card-bg,var(--token-card-bg, var(--style-card-bg,#fff)))] rounded-3xl border border-[var(--token-card-border,var(--token-card-border, var(--style-border-color,rgba(0,0,0,.08))))] shadow-lg p-8 sm:p-10 space-y-5"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
