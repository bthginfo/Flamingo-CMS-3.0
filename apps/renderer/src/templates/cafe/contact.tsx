'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function CafeContactSection({ data }: Props) {
  const headline = (data.headline as string) || 'Schreib uns';
  const subline = (data.subline as string) || '';
  const phone = (data.phone as string) || '';
  const email = (data.email as string) || '';
  const address = (data.address as string) || '';

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{headline}</h2>
          {subline && <p className="text-gray-600 mt-3">{subline}</p>}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 mt-10"
        >
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-2 px-5 py-3 bg-stone-100 rounded-full text-sm font-medium text-gray-700 hover:bg-stone-200 transition-colors">
              <Phone size={16} className="text-brand-primary" />{phone}
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-2 px-5 py-3 bg-stone-100 rounded-full text-sm font-medium text-gray-700 hover:bg-stone-200 transition-colors">
              <Mail size={16} className="text-brand-primary" />{email}
            </a>
          )}
          {address && (
            <span className="flex items-center gap-2 px-5 py-3 bg-stone-100 rounded-full text-sm font-medium text-gray-700">
              <MapPin size={16} className="text-brand-primary" />{address}
            </span>
          )}
        </motion.div>
      </div>
    </section>
  );
}
