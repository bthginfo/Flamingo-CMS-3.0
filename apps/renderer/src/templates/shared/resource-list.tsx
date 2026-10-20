import { ArrowDownToLine, ArrowUpRight } from 'lucide-react';
import { safeContentUrl } from '@/lib/safe-content-url';
import { copy, nativeId, sourceRows } from './perspective-utils';

type Resource = { title?: string; description?: string; href?: string; format?: string; actionLabel?: string };
type ResourceGroup = { id?: string; title?: string; items?: Resource[] };
type Props = { data: Record<string, unknown> };

export function ResourceListSection({ data }: Props) {
  const headline = copy(data.headline);
  const intro = copy(data.intro);
  const note = copy(data.note);
  const groups = sourceRows<ResourceGroup>(data.groups);
  const GroupHeading = headline ? 'h3' : 'h2';
  if (!headline && !intro && !groups.length && !note) return null;
  return <div className={`bg-[var(--token-section-bg)] ${headline ? 'py-14 md:py-20' : 'pb-14 pt-5 md:pb-20 md:pt-8'}`} data-resource-list=""><div className="mx-auto max-w-[1512px] px-6 sm:px-10 lg:px-16">
    {(headline || intro) && <header className="mb-10 grid items-end gap-6 lg:mb-14 lg:grid-cols-[1.25fr_1fr] lg:gap-24">{headline && <h2 data-edit-path="headline" className="font-display max-w-[20ch] whitespace-pre-line text-[clamp(2.5rem,4.6vw,5.25rem)] font-semibold leading-[1.08] tracking-[-.03em] text-[color:var(--token-heading)] [text-wrap:balance]">{headline}</h2>}{intro && <p data-edit-path="intro" className="max-w-[57ch] text-[1.075rem] leading-[1.8] text-[color:var(--token-body)]">{intro}</p>}</header>}
    <div className="border-t border-[var(--token-divider)]">{groups.map(({ item: group, sourceIndex: groupIndex }) => <section id={nativeId(group.id)} key={groupIndex} data-edit-collection="groups" data-edit-index={groupIndex} className="grid scroll-mt-28 gap-x-14 border-b border-[var(--token-divider)] py-8 lg:grid-cols-[.6fr_1.6fr] lg:py-10 xl:gap-x-24">
      {group.title && <GroupHeading data-edit-path="title" className="mb-5 max-w-[24ch] text-xl font-semibold leading-[1.4] tracking-[-.015em] text-[color:var(--token-heading)] lg:mb-0">{group.title}</GroupHeading>}
      <ul className={`min-w-0 ${group.title ? '' : 'lg:col-span-2'}`}>{sourceRows<Resource>(group.items).map(({ item, sourceIndex }) => {
        const href = safeContentUrl(copy(item.href));
        const pdf = copy(item.format).toLowerCase() === 'pdf';
        const Icon = pdf ? ArrowDownToLine : ArrowUpRight;
        return <li key={sourceIndex} data-edit-collection="items" data-edit-index={sourceIndex} className="border-b border-[var(--token-divider)] py-5 first:pt-0 last:border-0 last:pb-0">
          <div className="grid gap-x-10 gap-y-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div><p className="text-[1.17rem] font-semibold leading-[1.5] text-[color:var(--token-heading)]" data-edit-path="title">{item.title}</p>{item.description && <p data-edit-path="description" className="mt-2 max-w-[65ch] text-[.98rem] leading-[1.8] text-[color:var(--token-body)]">{item.description}</p>}</div>
            <div className="flex items-center gap-4 self-start sm:justify-end">{item.format && <span data-edit-path="format" className="text-xs font-medium uppercase tracking-[.035em] text-[color:var(--token-muted)]">{item.format}</span>}{href && <a href={href} className="group inline-flex min-h-11 items-center gap-2.5 py-2 text-sm font-semibold text-[color:var(--token-link)] underline-offset-4 hover:text-[color:var(--token-link-hover)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current" aria-label={`${copy(item.actionLabel) || (pdf ? 'Herunterladen' : 'Öffnen')}: ${copy(item.title)}`}><span data-edit-path="actionLabel">{item.actionLabel || (pdf ? 'Herunterladen' : 'Öffnen')}</span><span data-edit-link="href"><Icon aria-hidden="true" size={18} strokeWidth={1.6} className="shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5" /></span></a>}</div>
          </div>
        </li>;
      })}</ul>
    </section>)}</div>
    {note && <p data-edit-path="note" className="mt-7 max-w-[84ch] text-sm leading-7 text-[color:var(--token-muted)]">{note}</p>}
  </div></div>;
}
