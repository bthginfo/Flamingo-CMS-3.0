'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';

type Service = {
  icon?: string;
  title: string;
  description?: string;
};

type Props = { data: Record<string, unknown>; variant?: string | null };

export function ConsultationBookingSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const services = (data.services as Service[]) || [];
  const cta = data.cta as { label: string; href: string } | undefined;
  const image = (data.image as string) || '';
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [selected, setSelected] = useState(0);

  return (
    <div ref={ref}>
      {(headline || subline) && (
        <div className="text-center mb-10">
          {headline && <h2 className="font-display text-3xl md:text-4xl font-[var(--style-heading-weight,700)] tracking-[var(--style-heading-tracking,-0.02em)] text-[var(--style-text-primary,#0f172a)]">{headline}</h2>}
          {subline && <p className="mt-3 text-[var(--style-text-secondary,#64748b)] text-lg max-w-2xl mx-auto">{plain(subline)}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Services list */}
        <div className="lg:col-span-3 space-y-3">
          {services.map((service, i) => (
            <motion.button
              key={i}
              onClick={() => setSelected(i)}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`w-full text-left flex items-start gap-4 p-5 rounded-[var(--style-card-radius,1rem)] border transition-all duration-300 ${
                selected === i
                  ? 'bg-[var(--brand-primary,#2563eb)]/5 border-[var(--brand-primary,#2563eb)]/30 shadow-md'
                  : 'bg-[var(--style-card-bg,#fff)] border-[rgba(0,0,0,0.06)] hover:border-[var(--brand-primary,#2563eb)]/20'
              }`}
            >
              {service.icon && (
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${selected === i ? 'bg-[var(--brand-primary,#2563eb)] text-white' : 'bg-gray-100 text-[var(--brand-primary,#2563eb)]'} transition-colors`}>
                  <DynamicIcon name={service.icon} size={20} />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-[var(--style-text-primary,#0f172a)]">{service.title}</h3>
                {service.description && <p className="text-sm text-[var(--style-text-secondary,#64748b)] mt-1">{plain(service.description)}</p>}
              </div>
            </motion.button>
          ))}
        </div>

        {/* CTA / Image side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2 sticky top-8"
        >
          <div className="rounded-[var(--style-card-radius,1rem)] overflow-hidden bg-[var(--style-card-bg,#fff)] shadow-[var(--style-card-shadow,0_4px_20px_rgba(0,0,0,0.06))] border border-[rgba(0,0,0,0.06)]">
            {image && (
              <img src={image} alt={headline} className="w-full aspect-[4/3] object-cover" />
            )}
            <div className="p-6 text-center">
              <p className="text-[var(--style-text-secondary,#64748b)] text-sm mb-4">
                {services[selected]?.title ? `Beratung: ${services[selected].title}` : 'Individuelle Beratung'}
              </p>
              {cta?.label && (
                <a href={cta.href || '#'} className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[var(--brand-primary,#2563eb)] text-white font-semibold rounded-[var(--style-button-radius,0.75rem)] hover:brightness-110 transition-all shadow-lg">
                  {cta.label}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
