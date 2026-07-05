'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

type RowLink = { label?: string; href?: string };
type Row = {
  eyebrow?: string;
  headline: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  links?: RowLink[];
};
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

/**
 * ZigzagShowcase — editorial alternating image/text rows. Each row: small
 * uppercase eyebrow, large heading, rich text and up to two arrow links next
 * to a rounded photo; sides alternate automatically (overridable per row via
 * the section-level `startRight`).
 */
export function ZigzagShowcaseSection({ data }: Props) {
  const rows = (data.rows as Row[]) || [];
  const startRight = data.startRight === true;
  if (!rows.length) return null;

  return (
    <div className="space-y-20 md:space-y-28">
      {rows.map((row, i) => {
        const imageRight = (i % 2 === 0) !== startRight;
        return (
          <div key={`${row.headline}-${i}`} className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16`} data-edit-collection="rows" data-edit-index={i}>
            <motion.div
              initial={{ opacity: 0, x: imageRight ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55 }}
              className={imageRight ? 'lg:order-1' : 'lg:order-2'}
            >
              {row.eyebrow && <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--token-eyebrow)]" data-edit-path="eyebrow">{row.eyebrow}</p>}
              <h2 className="mt-3 text-3xl font-bold leading-tight text-[color:var(--token-heading)] md:text-4xl" data-edit-path="headline">{row.headline}</h2>
              {row.text && <div className="mt-5 max-w-xl leading-7 text-[color:var(--token-body)] rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: row.text }} />}
              {(row.links?.length ?? 0) > 0 && (
                <div className="mt-6 flex flex-col gap-2.5">
                  {row.links!.slice(0, 2).map((link, li) => link.label && (
                    <a key={li} href={link.href || '#'} className="group inline-flex w-fit items-center gap-2 font-semibold text-[color:var(--token-icon)] transition-colors hover:text-[color:var(--token-heading)]">
                      <span data-edit-path="label">{link.label}</span>
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
            {row.image && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className={`relative ${imageRight ? 'lg:order-2' : 'lg:order-1'}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
                  <img data-edit-image="image" src={row.image} alt={row.imageAlt || row.headline} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]" loading={i > 0 ? 'lazy' : undefined} />
                </div>
                <div aria-hidden className={`absolute -z-10 h-full w-full rounded-3xl bg-[var(--token-badge-bg)] ${imageRight ? '-right-4 -bottom-4' : '-left-4 -bottom-4'}`} />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
