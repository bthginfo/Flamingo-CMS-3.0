'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { plain } from '@/lib/strip-html';
import { buildLeadContextHref, persistLeadContext, type LeadContext } from '@/lib/lead-context';

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
  const selectedService = services[selected];
  const leadContext: LeadContext = {
    source: 'consultationBooking',
    summary: selectedService?.title ? `Beratung: ${selectedService.title}` : 'Individuelle Beratung',
  };
  const leadHref = buildLeadContextHref(cta?.href || '#kontakt', leadContext);

  return (
    <div ref={ref}>
      {(headline || subline) && (
        <div className="text-center mb-10">
          {headline && <h2 className="font-display text-3xl md:text-4xl font-[var(--token-heading-weight,700)] tracking-[var(--token-heading-tracking,-0.02em)] text-[color:var(--token-body)]" data-edit-path="headline">{headline}</h2>}
          {subline && <p className="mt-3 text-[color:var(--token-body)] text-lg max-w-2xl mx-auto" data-edit-path="subline">{plain(subline)}</p>}
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
              className={`w-full text-left flex items-start gap-4 p-5 rounded-[var(--token-card-radius)] border transition-all duration-300 ${
                selected === i
                  ? 'bg-[color-mix(in_srgb,var(--token-icon)_5%,transparent)] border-[color-mix(in_srgb,var(--token-icon)_30%,transparent)] shadow-md'
                  : 'bg-[var(--token-card-bg)] border-[rgba(0,0,0,0.06)] hover:border-[color-mix(in_srgb,var(--token-icon)_20%,transparent)]'
              }`}
             data-edit-collection="services" data-edit-index={i}>
              {service.icon && (
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${selected === i ? 'bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]' : 'bg-[color-mix(in_srgb,var(--token-icon)_10%,var(--token-card-bg,#fff))] text-[color:var(--token-icon)]'} transition-colors`}>
                  <DynamicIcon editPath="icon" name={service.icon} size={20} />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="title">{service.title}</h3>
                {service.description && <p className="text-sm text-[color:var(--token-card-body,var(--token-body))] mt-1" data-edit-path="description">{plain(service.description)}</p>}
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
          <div className="rounded-[var(--token-card-radius)] overflow-hidden bg-[var(--token-card-bg)] shadow-[var(--token-card-shadow,0_4px_20px_rgba(0,0,0,0.06))] border border-[rgba(0,0,0,0.06)]">
            {image && (
              <img data-edit-image="image" src={image} alt={headline} className="w-full aspect-[4/3] object-cover" />
            )}
            <div className="p-6 text-center">
              <p className="text-[color:var(--token-card-body,var(--token-body))] text-sm mb-4">
                {selectedService?.title ? (
                  <>
                    Beratung:{' '}
                    <span data-edit-collection="services" data-edit-index={selected} data-edit-path="title">
                      {selectedService.title}
                    </span>
                  </>
                ) : (
                  'Individuelle Beratung'
                )}
              </p>
              {cta?.label && (
                <a data-edit-link="cta" href={leadHref} onClick={() => persistLeadContext(leadContext)} className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)] font-semibold rounded-[var(--token-button-radius)] hover:brightness-110 transition-all shadow-lg" data-edit-path="label">
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
