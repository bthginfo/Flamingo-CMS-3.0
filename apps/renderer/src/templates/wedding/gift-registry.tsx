'use client';

import { motion } from 'framer-motion';
import { Gift, ExternalLink } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function WeddingGiftRegistrySection({ data, styleVariant }: Props) {
  const badge = (data.badge as string) || 'Geschenke';
  const headline = (data.headline as string) || 'Geschenkideen';
  const subline = (data.subline as string) || '';
  const text = (data.text as string) || (data.freeText as string) || '';
  const rawItems = (data.items || data.gifts) as Array<Record<string, string>> | undefined;
  const items = (rawItems || []).map(g => ({ title: g.title || g.name || '', description: g.description || g.price || '', link: g.link, image: g.image, claimed: Boolean((g as Record<string, unknown>).claimed) }));
  const bankDetails = (data.bankDetails || data.bankInfo) as { holder?: string; iban?: string; bic?: string; note?: string } | undefined;

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[var(--token-section-bg)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="section-badge" data-edit-path="badge">{badge}</span>
          <h2 className="section-headline" data-edit-path="headline">{headline}</h2>
          {subline && <div className="section-subline rt-content" data-edit-rich="subline" dangerouslySetInnerHTML={{ __html: subline }} />}
        </div>
        {text && <div className="text-[color:var(--token-muted)] text-lg text-center mb-12 max-w-2xl mx-auto rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: text }} />}
        {items.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {items.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 bg-[var(--token-card-bg)] rounded-xl shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl border border-[color:var(--token-card-border)] flex items-start gap-4" data-card data-edit-collection="items" data-edit-index={i}>
                <div className="w-10 h-10 rounded-full bg-[var(--token-badge-bg)] flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4 text-[color:var(--token-icon)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[color:var(--token-heading)]" data-edit-path="title">{item.title}</h3>
                  {item.description && <div className="text-[color:var(--token-muted)] text-sm mt-1 rt-content" data-edit-rich="description" dangerouslySetInnerHTML={{ __html: item.description }} />}
                  {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[color:var(--token-icon)] text-sm font-medium mt-2 hover:underline"><ExternalLink className="w-3 h-3" />Ansehen</a>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {bankDetails && (
          <div className="p-8 bg-[var(--token-card-bg)] rounded-2xl shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl border border-[color:var(--token-card-border)] text-center">
            <p className="text-[color:var(--token-heading)] font-semibold mb-4">Bankverbindung</p>
            <div className="text-[color:var(--token-muted)] text-sm space-y-1">
              {bankDetails.holder && <p>Kontoinhaber: {bankDetails.holder}</p>}
              {bankDetails.iban && <p>IBAN: {bankDetails.iban}</p>}
              {bankDetails.bic && <p>BIC: {bankDetails.bic}</p>}
              {bankDetails.note && <p className="mt-3 text-[color:var(--token-muted)] italic" data-edit-path="note">{bankDetails.note}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
