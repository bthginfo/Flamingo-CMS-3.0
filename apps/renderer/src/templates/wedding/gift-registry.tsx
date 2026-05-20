'use client';

import { motion } from 'framer-motion';
import { Gift, ExternalLink } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingGiftRegistrySection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Geschenke';
  const headline = (data.headline as string) || 'Geschenkideen';
  const subline = (data.subline as string) || '';
  const text = (data.text as string) || (data.freeText as string) || '';
  const rawItems = (data.items || data.gifts) as Array<Record<string, string>> | undefined;
  const items = (rawItems || []).map(g => ({ title: g.title || g.name || '', description: g.description || g.price || '', link: g.link, image: g.image }));
  const bankDetails = (data.bankDetails || data.bankInfo) as { holder?: string; iban?: string; bic?: string; note?: string } | undefined;
  const isBold = styleVariant === 'bold';
  const isModern = styleVariant === 'modern';

  if (isModern) {
    return (
      <section className="py-24 md:py-36 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">{badge}</p>
          <h2 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.15em] text-gray-900 mb-8 break-words">{headline}</h2>
          {text && <div className="text-gray-500 leading-relaxed mb-16 max-w-2xl rt-content" dangerouslySetInnerHTML={{ __html: text }} />}
          {items.length > 0 && (
            <div className="space-y-6 mb-16">
              {items.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-baseline justify-between border-t border-gray-200 pt-4">
                  <div>
                    <h3 className="font-light text-gray-900">{item.title}</h3>
                    {item.description && <p className="text-gray-400 text-sm mt-1">{item.description}</p>}
                  </div>
                  {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-900 border-b border-gray-900 hover:opacity-70">Link →</a>}
                </motion.div>
              ))}
            </div>
          )}
          {bankDetails && (
            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-4">Bankverbindung</p>
              <div className="text-gray-600 text-sm space-y-1">
                {bankDetails.holder && <p>{bankDetails.holder}</p>}
                {bankDetails.iban && <p>{bankDetails.iban}</p>}
                {bankDetails.bic && <p>{bankDetails.bic}</p>}
                {bankDetails.note && <p className="mt-3 text-gray-400 italic">{bankDetails.note}</p>}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (isBold) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block bg-brand-accent text-black text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 mb-4">{badge}</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-6 break-words">{headline}</h2>
          {text && <div className="text-white/60 text-lg mb-12 max-w-2xl rt-content" dangerouslySetInnerHTML={{ __html: text }} />}
          {items.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {items.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border border-white/10 p-6 flex items-start gap-4">
                  <Gift className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{item.title}</h3>
                    {item.description && <p className="text-white/50 text-sm mt-1">{item.description}</p>}
                    {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-accent text-sm font-bold mt-2 hover:opacity-70"><ExternalLink className="w-3 h-3" />Ansehen</a>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {bankDetails && (
            <div className="border border-white/10 p-8">
              <p className="text-brand-accent font-bold mb-4">Bankverbindung</p>
              <div className="text-white/70 text-sm space-y-1">
                {bankDetails.holder && <p>Kontoinhaber: {bankDetails.holder}</p>}
                {bankDetails.iban && <p>IBAN: {bankDetails.iban}</p>}
                {bankDetails.bic && <p>BIC: {bankDetails.bic}</p>}
                {bankDetails.note && <p className="mt-3 text-white/50 italic">{bankDetails.note}</p>}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

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
