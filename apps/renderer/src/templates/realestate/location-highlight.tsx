'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Train, GraduationCap, ShoppingBag, TreePine } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type PoiItem = { label: string; distance: string; icon?: string };

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  train: Train,
  school: GraduationCap,
  shopping: ShoppingBag,
  nature: TreePine,
  default: MapPin,
};

export function LocationHighlightSection({ data }: Props) {
  const headline = (data.headline as string) || 'Lage & Umgebung';
  const subline = (data.subline as string) || '';
  const description = (data.description as string) || '';
  const pois = (data.pois as PoiItem[]) || [];
  const image = (data.image as string) || '';

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-[var(--token-section-bg-alt,#fafafa)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}>
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading,#18181b)]">{headline}</h2>
            {subline && <p className="text-lg text-[color:var(--token-muted,#52525b)] mt-4">{plain(subline)}</p>}
            {description && <p className="text-[color:var(--token-muted,#71717a)] mt-4 leading-relaxed">{plain(description)}</p>}

            {pois.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3 mt-8">
                {pois.map((poi, i) => {
                  const Icon = ICON_MAP[poi.icon || 'default'] || ICON_MAP.default;
                  return (
                    <div key={i} className="flex items-center gap-3 bg-[var(--token-card-bg,#ffffff)] p-3 rounded-lg border border-[color:var(--token-card-border,#f4f4f5)]">
                      <Icon size={18} className="text-[color:var(--token-icon,var(--brand-primary,#1a5276))] shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-[color:var(--token-heading,#18181b)]">{poi.label}</p>
                        <p className="text-xs text-[color:var(--token-muted,#71717a)]">{poi.distance}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {image && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg"
            >
              <img src={image} alt={headline} className="w-full h-full object-cover" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
