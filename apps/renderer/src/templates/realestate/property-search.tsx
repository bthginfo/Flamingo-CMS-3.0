'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function PropertySearchSection({ data }: Props) {
  const headline = (data.headline as string) || 'Ihre Traumimmobilie finden';
  const categories = (data.categories as string[]) || ['Kaufen', 'Mieten'];
  const bgColor = (data.bgColor as string) || '';

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [activeCategory, setActiveCategory] = useState(0);

  const [searched, setSearched] = useState(false);

  function handleSearch() {
    setSearched(true);
    // Scroll to property showcase section below
    const section = ref.current as HTMLElement | null;
    if (section) {
      const next = section.nextElementSibling;
      if (next) {
        next.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  return (
    <section ref={ref} className="py-16 md:py-20" style={bgColor ? { backgroundColor: bgColor } : undefined}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{headline}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
        >
          <div className="flex gap-2 mb-6">
            {categories.map((cat, i) => (
              <button key={i} onClick={() => setActiveCategory(i)} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${i === activeCategory ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Ort / PLZ</label>
              <input type="text" placeholder="z.B. Köln, 50667" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Typ</label>
              <div className="relative">
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 appearance-none bg-white cursor-pointer focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-colors">
                  <option>Alle Typen</option>
                  <option>Wohnung</option>
                  <option>Haus</option>
                  <option>Grundstück</option>
                  <option>Gewerbe</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Preis bis</label>
              <div className="relative">
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 appearance-none bg-white cursor-pointer focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-colors">
                  <option>Keine Begrenzung</option>
                  <option>250.000 €</option>
                  <option>500.000 €</option>
                  <option>750.000 €</option>
                  <option>1.000.000 €</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <button onClick={handleSearch} className="mt-6 w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors cursor-pointer">
            <Search size={18} />
            {searched ? 'Ergebnisse unten' : 'Immobilien suchen'}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
