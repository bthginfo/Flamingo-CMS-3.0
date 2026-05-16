'use client';

import { motion } from 'framer-motion';

type Props = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

type Gift = { title: string; description?: string; link?: string; image?: string; price?: string; claimed?: boolean };

export function GiftRegistrySection({ data }: Props) {
  const headline = (data.headline as string) || 'Geschenkewünsche';
  const subline = (data.subline as string) || 'Eure Anwesenheit ist uns das größte Geschenk. Wer uns dennoch eine Freude machen möchte:';
  const gifts = (data.gifts as Gift[]) || [];
  const bankInfo = data.bankInfo as { iban?: string; bic?: string; holder?: string; note?: string } | undefined;
  const freeText = (data.freeText as string) || '';

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif">{headline}</h2>
        {subline && <p className="text-gray-600 mt-3 max-w-xl mx-auto">{subline}</p>}
      </div>

      {freeText && (
        <div className="max-w-2xl mx-auto text-center mb-10 text-gray-600 leading-relaxed whitespace-pre-line">
          {freeText}
        </div>
      )}

      {gifts.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {gifts.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`border rounded-xl p-6 ${g.claimed ? 'opacity-50' : ''}`}
            >
              <h3 className="font-semibold text-lg">{g.title}</h3>
              {g.price && <p className="text-rose-500 text-sm mt-1">{g.price}</p>}
              {g.description && <p className="text-gray-600 text-sm mt-2">{g.description}</p>}
              {g.claimed && <span className="inline-block mt-3 text-xs bg-gray-100 px-2 py-1 rounded">Bereits reserviert</span>}
              {g.link && !g.claimed && (
                <a href={g.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm text-rose-500 hover:underline">
                  Zum Geschenk →
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {bankInfo && (
        <div className="max-w-md mx-auto bg-rose-50 rounded-xl p-6 text-center">
          <h3 className="font-semibold mb-3">Bankverbindung</h3>
          {bankInfo.holder && <p className="text-sm text-gray-700">{bankInfo.holder}</p>}
          {bankInfo.iban && <p className="text-sm text-gray-700 font-mono mt-1">{bankInfo.iban}</p>}
          {bankInfo.bic && <p className="text-sm text-gray-500">{bankInfo.bic}</p>}
          {bankInfo.note && <p className="text-sm text-gray-600 mt-2 italic">{bankInfo.note}</p>}
        </div>
      )}
    </div>
  );
}
