'use client';

import { motion } from 'framer-motion';
import { Gift, ExternalLink } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingGiftRegistrySection({ data }: Props) {
  const badge = (data.badge as string) || 'Geschenke';
  const headline = (data.headline as string) || 'Geschenkideen';
  const subline = (data.subline as string) || '';
  const text = (data.text as string) || '';
  const items = (data.items as Array<{ title: string; description?: string; link?: string; image?: string }>) || [];
  const bankDetails = data.bankDetails as { holder?: string; iban?: string; bic?: string; note?: string } | undefined;

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-brand-primary/[0.02]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge">{badge}</span>
          <h2 className="section-headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {text && <div className="text-gray-600 text-lg text-center mb-12 max-w-2xl mx-auto rt-content" dangerouslySetInnerHTML={{ __html: text }} />}
        {items.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {items.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4 text-brand-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  {item.description && <div className="text-gray-600 text-sm mt-1 rt-content" dangerouslySetInnerHTML={{ __html: item.description }} />}
                  {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-primary text-sm font-medium mt-2 hover:underline"><ExternalLink className="w-3 h-3" />Ansehen</a>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {bankDetails && (
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-900 font-semibold mb-4">Bankverbindung</p>
            <div className="text-gray-600 text-sm space-y-1">
              {bankDetails.holder && <p>Kontoinhaber: {bankDetails.holder}</p>}
              {bankDetails.iban && <p>IBAN: {bankDetails.iban}</p>}
              {bankDetails.bic && <p>BIC: {bankDetails.bic}</p>}
              {bankDetails.note && <p className="mt-3 text-gray-500 italic">{bankDetails.note}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
