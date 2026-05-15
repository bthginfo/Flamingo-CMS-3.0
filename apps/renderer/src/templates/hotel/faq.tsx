'use client';

import { asButton, asList, type SectionProps } from './types';

type FaqItem = { question?: string; answer?: string };

export function HotelFaqSection({ data }: SectionProps) {
  const headline = (data.headline as string) || 'FAQ';
  const subline = (data.subline as string) || '';
  const badgeText = (data.badgeText as string) || 'Fragen';
  const items = asList<FaqItem>(data.items);
  const ctaPrimary = asButton(data.ctaPrimary);

  return (
    <div>
      <Header badgeText={badgeText} headline={headline} subline={subline} />
      <div className="divide-y divide-black/10 rounded-[var(--style-card-radius)] border border-black/10 bg-[var(--style-card-bg)]">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="group p-5">
            <summary className="cursor-pointer font-semibold text-[var(--style-text-primary)]">{item.question || ''}</summary>
            {item.answer && <p className="mt-3 text-sm leading-6 text-[var(--style-text-secondary)]">{item.answer}</p>}
          </details>
        ))}
      </div>
      {ctaPrimary.label && <a href={ctaPrimary.href || '#'} className="mt-8 inline-flex rounded-[var(--style-button-radius)] bg-[var(--style-text-primary)] px-5 py-3 font-semibold text-white">{ctaPrimary.label}</a>}
    </div>
  );
}

function Header({ badgeText, headline, subline }: { badgeText: string; headline: string; subline: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      {badgeText && <p className="text-xs font-bold uppercase tracking-widest text-[var(--style-text-secondary)]">{badgeText}</p>}
      <h2 className="mt-3 text-3xl sm:text-5xl font-[var(--style-heading-weight)] text-[var(--style-text-primary)]">{headline}</h2>
      {subline && <p className="mt-4 text-[var(--style-text-secondary)]">{subline}</p>}
    </div>
  );
}

