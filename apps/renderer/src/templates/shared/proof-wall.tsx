import { Award, CheckCircle2, Quote, Star } from 'lucide-react';
import { NumberTicker } from '@/components/ui/fx';
import { plain } from '@/lib/strip-html';
import { CardSurface, PremiumSectionHeader } from './section-primitives';

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
  if (!proofs.length && !reviews.length && !logos.length) return null;

  return (
    <div className="relative">
      <PremiumSectionHeader eyebrow={badge} headline={headline} subline={plain(subline)} eyebrowPath="badge" align="center" richSubline={false} />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        {proofs.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {proofs.map((proof, index) => (
              <CardSurface as="article" key={index} className="p-6" data-edit-collection="proofs" data-edit-index={index}>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--token-icon)_14%,transparent)] text-[color:var(--token-icon)]"><Award aria-hidden="true" size={19} /></div>
                {proof.value && <ProofValue value={proof.value} />}
                <div className="mt-1 font-semibold text-[color:var(--token-card-heading)]" data-edit-path="label">{plain(proof.label)}</div>
                {proof.note && <div className="mt-2 text-sm leading-6 text-[color:var(--token-card-muted)]" data-edit-path="note">{plain(proof.note)}</div>}
              </CardSurface>
            ))}
          </div>
        )}

        {(reviews.length > 0 || logos.length > 0) && (
          <CardSurface className="p-5 md:p-7">
            {reviews.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                {reviews.map((review, index) => (
                  <article
                    key={index}
                    className="rounded-xl border border-[var(--token-card-border)] p-5"
                    style={{ backgroundColor: 'var(--token-card-bg)' }}
                    data-edit-collection="reviews"
                    data-edit-index={index}
                  >
                    <Quote aria-hidden="true" className="mb-4 text-[color:var(--token-quote)]" size={24} />
                    {review.quote && <p className="text-sm leading-7 text-[color:var(--token-card-body)]" data-edit-path="quote">{plain(review.quote)}</p>}
                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div>
                        <div className="font-bold text-[color:var(--token-card-heading)]" data-edit-path="name">{review.name || review.author || ''}</div>
                        {(review.context || review.meta) && <div className="text-xs text-[color:var(--token-card-muted)]">{review.context || review.meta}</div>}
                      </div>
                      <div className="flex" role="img" aria-label={`${Math.min(review.rating || 5, 5)} von 5 Sternen`}>
                        {Array.from({ length: Math.min(review.rating || 5, 5) }).map((_, starIndex) => <Star aria-hidden="true" className="text-[color:var(--token-rating-star)]" key={starIndex} size={14} fill="currentColor" />)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            {logos.length > 0 && (
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {logos.map((logo, index) => (
                  <div key={index} className="flex min-h-16 items-center justify-center rounded-xl border border-[var(--token-card-border)] px-3 text-center text-xs font-bold uppercase tracking-wide text-[color:var(--token-card-muted)]" data-edit-collection="logos" data-edit-index={index}>
                    {logo.image ? <img data-edit-image="image" src={logo.image} alt={logo.name} className="max-h-8 max-w-full object-contain" /> : <span className="inline-flex items-center gap-2"><CheckCircle2 aria-hidden="true" className="text-[color:var(--token-check)]" size={14} /><span data-edit-path="name">{logo.name}</span></span>}
                  </div>
                ))}
              </div>
            )}
          </CardSurface>
        )}
      </div>
    </div>
  );
}

function ProofValue({ value }: { value: string }) {
  const match = String(value).match(/^([\d.,]+)(.*)$/);
  return (
    <div className="text-3xl font-black text-[color:var(--token-stat-value)]" data-edit-path="value">
      {match ? <><NumberTicker value={match[1]} />{match[2]}</> : value}
    </div>
  );
}
