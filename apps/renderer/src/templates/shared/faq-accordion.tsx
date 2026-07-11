import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FaqAccordionItem = {
  question?: string;
  answer?: string;
};

/**
 * Native details/summary keeps FAQ content semantic, keyboard-accessible and
 * stable in SSR. The prior Radix IDs diverged during hydration in long,
 * tenant-driven section trees.
 */
export function FaqAccordion({
  items,
  defaultOpenFirst = true,
  variant = 'cards',
  className,
}: {
  items: FaqAccordionItem[];
  defaultOpenFirst?: boolean;
  variant?: 'cards' | 'divided' | 'minimal';
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <div className={cn('cms-accordion', `cms-accordion--${variant}`, className)}>
      {items.map((item, index) => (
        <details
          key={`${item.question || 'faq'}-${index}`}
          open={defaultOpenFirst && index === 0}
          className="cms-accordion-item"
          data-edit-collection="items"
          data-edit-index={index}
        >
          <summary className="cms-accordion-trigger">
            <span data-edit-path="question">{item.question || ''}</span>
            <ChevronDown aria-hidden="true" className="cms-accordion-chevron" size={19} />
          </summary>
          <div className="cms-accordion-content">
            {item.answer && (
              <div
                className="cms-accordion-answer rt-content"
                data-edit-rich="answer"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
