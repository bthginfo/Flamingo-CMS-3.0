'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Clock, MapPin } from 'lucide-react';
import { plain } from '@/lib/strip-html';

type Job = {
  title: string;
  location?: string;
  type?: string;
  schedule?: string;
  text?: string;
  href?: string;
  tags?: string[];
};
type Cta = { label?: string; href?: string };
type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

export function JobListingsSection({ data }: Props) {
  const badge = (data.badge as string) || (data.badgeText as string) || 'Karriere';
  const headline = (data.headline as string) || 'Offene Stellen';
  const subline = (data.subline as string) || '';
  const jobs = (data.jobs as Job[]) || [];
  const benefits = (data.benefits as string[]) || [];
  const emptyText = (data.emptyText as string) || 'Aktuell sind keine Stellen ausgeschrieben — wir freuen uns trotzdem über Ihre Initiativbewerbung.';
  const contactCta = (data.contactCta as Cta) || {};

  return (
    <div>
      <div className="mb-10 max-w-3xl">
        {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
        <h2 className="section-headline text-left" data-edit-path="headline">{headline}</h2>
        {subline && <p className="section-subline mx-0 text-left" data-edit-path="subline">{plain(subline)}</p>}
      </div>

      {benefits.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {benefits.map((b, i) => (
            <span key={i} className="rounded-full border border-[var(--token-badge-border)] bg-[var(--token-badge-bg)] px-4 py-1.5 text-xs font-semibold text-[color:var(--token-badge-text)]" data-edit-collection="benefits" data-edit-index={i}>{b}</span>
          ))}
        </div>
      )}

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job, i) => {
            const meta = [
              job.location && { icon: MapPin, value: job.location, path: 'location' },
              job.type && { icon: Briefcase, value: job.type, path: 'type' },
              job.schedule && { icon: Clock, value: job.schedule, path: 'schedule' },
            ].filter(Boolean) as { icon: React.ElementType; value: string; path: string }[];
            return (
              <motion.a
                key={`${job.title}-${i}`}
                href={job.href || '#kontakt'}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl md:p-7"
                data-edit-collection="jobs" data-edit-index={i}
                data-card
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-[color:var(--token-card-heading,var(--token-heading))] md:text-xl" data-edit-path="title">{job.title}</h3>
                  {meta.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[color:var(--token-card-muted,var(--token-muted))]">
                      {meta.map((m, mi) => (
                        <span key={mi} className="inline-flex items-center gap-1.5"><m.icon size={14} className="text-[color:var(--token-icon)]" /><span data-edit-path={m.path}>{m.value}</span></span>
                      ))}
                    </div>
                  )}
                  {job.text && <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="text">{plain(job.text)}</p>}
                  {(job.tags?.length ?? 0) > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.tags!.map((t, ti) => <span key={ti} className="rounded-full bg-[var(--token-badge-bg)] px-2.5 py-0.5 text-[11px] font-medium text-[color:var(--token-badge-text)]">{t}</span>)}
                    </div>
                  )}
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)] transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight size={18} />
                </span>
              </motion.a>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-10 text-center">
          <p className="mx-auto max-w-xl text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="emptyText">{emptyText}</p>
        </div>
      )}

      {contactCta.label && (
        <div className="mt-10 text-center">
          <a data-edit-link="contactCta" href={contactCta.href || '#kontakt'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-7 py-3.5 font-bold text-[color:var(--token-btn-text)] transition hover:brightness-110">
            <span data-edit-path="label">{contactCta.label}</span>
            <ArrowRight size={17} />
          </a>
        </div>
      )}
    </div>
  );
}
