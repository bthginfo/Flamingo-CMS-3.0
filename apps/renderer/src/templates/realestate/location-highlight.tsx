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
    <section ref={ref} className="py-20 md:py-28 bg-[var(--token-section-bg-alt)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}>
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--token-heading)]" data-edit-path="headline">{headline}</h2>
            {subline && <p className="text-lg text-[color:var(--token-muted)] mt-4" data-edit-path="subline">{plain(subline)}</p>}
            {description && <p className="text-[color:var(--token-muted)] mt-4 leading-relaxed" data-edit-path="description">{plain(description)}</p>}

            {pois.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3 mt-8">
                {pois.map((poi, i) => {
                  const Icon = ICON_MAP[poi.icon || 'default'] || ICON_MAP.default;
                  return (
                    <div key={i} className="flex items-center gap-3 bg-[var(--token-card-bg)] p-3 rounded-lg border border-[color:var(--token-card-border)]">
                      <Icon size={18} className="text-[color:var(--token-icon)] shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-[color:var(--token-heading)]" data-edit-path="label">{poi.label}</p>
                        <p className="text-xs text-[color:var(--token-muted)]">{poi.distance}</p>
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
              <img data-edit-image="image" src={image} alt={headline} className="w-full h-full object-cover" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
