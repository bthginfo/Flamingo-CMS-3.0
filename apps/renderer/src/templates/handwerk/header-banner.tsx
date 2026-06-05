'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { plain } from '@/lib/strip-html';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function HeaderBannerSection({ data }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const items = (data.items as { text: string; link?: string }[]) || [];
  const style = (data.style as string) || 'neutral';

  if (dismissed || items.length === 0) return null;

  const bgClass = style === 'warning' ? 'bg-amber-500 text-amber-950'
    : style === 'info' ? 'bg-blue-600 text-white'
    : 'bg-[var(--token-section-bg-alt,var(--brand-dark,#0d2137))] text-white/80';

  return (
    <div className={`relative ${bgClass} text-xs py-2 text-center`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-6">
        {items.map((item, i) => (
          <span key={i} data-edit-collection="items" data-edit-index={i}>
            {item.link ? (
              <a href={item.link} className="hover:underline font-medium" data-edit-path="text">{plain(item.text)}</a>
            ) : (
              <span className="rt-content" dangerouslySetInnerHTML={{ __html: item.text }} />
            )}
          </span>
        ))}
      </div>
      <button onClick={() => setDismissed(true)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}
