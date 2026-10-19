import { ArrowUpRight, Phone } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { safeContentUrl } from '@/lib/safe-content-url';
import { ActionGroup, ActionLink } from './section-primitives';

type Action = { label?: string; href?: string };
type ContactRow = { label?: string; value?: string; href?: string };
type Props = { data: Record<string, unknown> };

/** An open correspondence composition: headline, contact margin, then photograph.
 * Every piece of the letterhead and reading rail comes from the section editor. */
export function CorrespondenceHero({ data }: Props) {
  const headline = typeof data.headline === 'string' ? data.headline : '';
  const text = typeof data.text === 'string' ? data.text : '';
  const image = typeof data.imagePrimary === 'string' ? data.imagePrimary : '';
  const compact = data.compact === true;
  const rows = (Array.isArray(data.contactRows) ? data.contactRows : []) as ContactRow[];
  const links = (Array.isArray(data.links) ? data.links : []) as Action[];
  const primary = (data.primaryCta || {}) as Action;
  const secondary = (data.secondaryCta || {}) as Action;

  return <div className="correspondence-hero bg-[var(--token-section-bg)] px-6 text-[color:var(--token-body)] sm:px-10 lg:px-14" style={{ paddingTop: 'calc(var(--opening-header-clearance, 0px) + 2.75rem)' }}>
    <div className="mx-auto max-w-[1320px]">
      <div className={`grid gap-8 border-t border-[var(--token-divider)] pt-7 ${rows.length ? 'lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-16' : ''}`}>
        <div className="pb-2">
          <h1 className={`font-display max-w-[18ch] font-medium leading-[.98] tracking-[-.025em] text-[color:var(--token-heading)] [text-wrap:balance] ${compact ? 'text-[clamp(2.7rem,5.5vw,4.7rem)]' : 'text-[clamp(3.2rem,6.7vw,6rem)]'}`} data-edit-path="headline">{headline}</h1>
          {text && <div className="rt-content mt-6 max-w-[57ch] text-base leading-[1.8] sm:text-lg" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />}
          {(primary.label || secondary.label) && <ActionGroup className="mt-7">
            <ActionLink action={primary} editKey="primaryCta" />
            <ActionLink action={secondary} editKey="secondaryCta" tone="secondary" showArrow={false} />
          </ActionGroup>}
        </div>
        {rows.length > 0 && <address className="grid grid-cols-1 gap-5 border-t border-[var(--token-divider)] pt-6 not-italic sm:grid-cols-2 lg:block lg:border-l lg:border-t-0 lg:pl-7 lg:pt-1">
          {rows.map((row, index) => {
            const href = safeContentUrl(row.href || '');
            return <div key={index} className="lg:mb-7" data-edit-collection="contactRows" data-edit-index={index}>
              {row.label && <p className="mb-1.5 text-xs font-semibold uppercase tracking-[.08em] text-[color:var(--token-muted)]" data-edit-path="label">{row.label}</p>}
              {href ? <a href={href} className="inline-flex min-h-7 items-center gap-2 text-base font-semibold text-[color:var(--token-heading)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-icon)]" data-edit-link="href"><span className="whitespace-pre-line" data-edit-path="value">{row.value}</span>{href.startsWith('tel:') && <Phone size={16} aria-hidden="true" className="shrink-0" />}</a> : <p className="whitespace-pre-line text-sm leading-6" data-edit-path="value">{row.value}</p>}
            </div>;
          })}
        </address>}
      </div>
      {(image || links.length > 0) && <div className={`mt-9 grid gap-0 border-b border-[var(--token-divider)] pb-8 ${image && links.length ? 'lg:grid-cols-[minmax(0,1fr)_310px]' : ''}`}>
        {image && <figure className={`m-0 overflow-hidden bg-[var(--token-section-bg-alt)] ${compact ? 'aspect-[16/5] min-h-[180px] max-h-[280px]' : 'aspect-[2/1] min-h-[210px] max-h-[340px] sm:aspect-[3/1]'}`}>
          <img data-edit-image="imagePrimary" src={image} alt={typeof data.imageAlt === 'string' ? data.imageAlt : ''} loading="eager" fetchPriority="high" className="h-full w-full object-cover" style={{ objectPosition: typeof data.imagePrimaryPosition === 'string' ? data.imagePrimaryPosition : 'center' }} />
        </figure>}
        {links.length > 0 && <nav aria-label={typeof data.linksLabel === 'string' ? data.linksLabel : undefined} className="correspondence-rail border-t border-[var(--token-divider)] lg:border-l lg:border-t-0 lg:pl-7">
          {links.map((link, index) => {
            const href = safeContentUrl(link.href || '');
            return href && link.label ? <a key={index} href={href} className="group flex min-h-[64px] items-center justify-between gap-4 border-b border-[var(--token-divider)] py-4 text-base font-medium text-[color:var(--token-heading)] underline-offset-4 last:border-b-0 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-icon)]" data-edit-collection="links" data-edit-index={index}><span data-edit-path="label">{link.label}</span><ArrowUpRight aria-hidden="true" size={19} className="shrink-0 text-[color:var(--token-icon)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" /></a> : null;
          })}
        </nav>}
      </div>}
      {typeof data.hint === 'string' && data.hint && <p className="max-w-[85ch] py-5 text-sm leading-6 text-[color:var(--token-muted)]" data-edit-path="hint">{data.hint}</p>}
    </div>
  </div>;
}
