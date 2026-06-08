'use client';

import { motion } from 'framer-motion';
import { Award, CheckCircle2, Quote, Star } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Proof = { label?: string; value?: string; note?: string };
type Review = { quote?: string; name?: string; author?: string; context?: string; meta?: string; rating?: number };
type Logo = { name: string; image?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function ProofWallSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const proofs = ((data.proofs as Proof[]) || (data.stats as Proof[]) || []).filter((proof) => proof?.label || proof?.value);
  const reviews = ((data.reviews as Review[]) || (data.testimonials as Review[]) || []).filter((review) => review?.quote || review?.name || review?.author);
  const logos = ((data.logos as Logo[]) || []).filter((logo) => logo?.name || logo?.image);

  return (
    <div className="relative">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {subline && <p className="section-subline" data-edit-path="subline">{plain(subline)}</p>}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {proofs.map((proof, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-sm" data-edit-collection="proofs" data-edit-index={index}>
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--token-icon)_14%,transparent)] text-[color:var(--token-icon)]"><Award size={19} /></div>
              {proof.value && <div className="text-3xl font-black text-[color:var(--token-stat-value)]" data-edit-path="value">{proof.value}</div>}
              <div className="mt-1 font-semibold text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="label">{plain(proof.label)}</div>
              {proof.note && <div className="mt-2 text-sm leading-6 text-[color:var(--token-muted)]" data-edit-path="note">{plain(proof.note)}</div>}
            </motion.div>
          ))}
        </div>

        <div className="rounded-3xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-5 shadow-xl md:p-7">
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            {reviews.map((review, index) => (
              <article key={index} className="rounded-2xl border border-[var(--token-card-border)] bg-transparent p-5" data-edit-collection="reviews" data-edit-index={index}>
                <Quote className="mb-4 text-[color:var(--token-quote)]" size={24} />
                {review.quote && <p className="text-sm leading-7 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="quote">{plain(review.quote)}</p>}
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="name">{review.name || review.author || ''}</div>
                    {(review.context || review.meta) && <div className="text-xs text-[color:var(--token-muted)]">{review.context || review.meta}</div>}
                  </div>
                  <div className="flex text-[color:var(--token-rating-star)]">{Array.from({ length: review.rating || 5 }).slice(0, 5).map((_, i) => <Star key={i} size={14} fill="currentColor"  data-edit-collection="rating" data-edit-index={i}/>)}</div>
                </div>
              </article>
            ))}
          </div>
          {logos.length > 0 && (
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {logos.map((logo, index) => (
                <div key={index} className="flex min-h-16 items-center justify-center rounded-xl border border-[var(--token-card-border)] px-3 text-center text-xs font-bold uppercase text-[color:var(--token-muted)]" data-edit-collection="logos" data-edit-index={index}>
                  {logo.image ? <img data-edit-image="image" src={logo.image} alt={logo.name} className="max-h-8 max-w-full object-contain" /> : <span className="inline-flex items-center gap-2"><CheckCircle2 size={14} /><span data-edit-path="name">{logo.name}</span></span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
