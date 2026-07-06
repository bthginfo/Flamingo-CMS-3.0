'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, MapPin, Ticket, Trophy } from 'lucide-react';

// ── Sections für Vereine / Sportclubs (Eishockey, Fußball, Handball …). ──────
// Alle Farben laufen über die --token-* Rollen, damit sie im Farbsystem und im
// Editor genauso funktionieren wie die übrigen Sections.

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };
const str = (v: unknown) => (typeof v === 'string' ? v : '');
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

// Initials from a team name (e.g. "EHC Donau Panther" → "EDP", "EV Landshut" → "EL").
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '?';
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.map((w) => w[0]).join('').slice(0, 3).toUpperCase();
}

// Team crest: real logo if provided, otherwise a clean monogram badge — much
// better than a random photo standing in for a logo.
function TeamCrest({ logo, name, editKey }: { logo: string; name: string; editKey: string }) {
  if (logo) {
    return <img data-edit-image={editKey} src={logo} alt={name} className="h-16 w-16 object-contain md:h-20 md:w-20" />;
  }
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--token-badge-bg)] text-lg font-black tracking-tight text-[color:var(--token-badge-text)] ring-1 ring-[var(--token-card-border)] md:h-20 md:w-20 md:text-2xl" aria-hidden>
      {initials(name)}
    </div>
  );
}

// ── NextMatchHero — großer Aufmacher mit dem nächsten Spiel ──────────────────
type MatchCta = { label?: string; href?: string };
export function NextMatchHeroSection({ data }: Props) {
  const eyebrow = str(data.eyebrow) || str(data.badgeText);
  const headline = str(data.headline);
  const competition = str(data.competition);
  const dateLabel = str(data.dateLabel);
  const homeTeam = str(data.homeTeam);
  const awayTeam = str(data.awayTeam);
  const homeLogo = str(data.homeLogo);
  const awayLogo = str(data.awayLogo);
  const venue = str(data.venue);
  const image = str(data.image) || str(data.bgImage);
  const primaryCta = (data.primaryCta as MatchCta) || {};
  const secondaryCta = (data.secondaryCta as MatchCta) || {};
  if (!headline && !homeTeam) return null;

  return (
    <section className="relative overflow-hidden bg-[var(--token-section-bg)] px-4 py-16 md:px-6 md:py-24">
      {image && <div aria-hidden className="absolute inset-0 -z-10"><img data-edit-image="image" src={image} alt="" className="h-full w-full object-cover opacity-25" /><div className="absolute inset-0 bg-[var(--token-section-bg)]/70" /></div>}
      <div className="mx-auto max-w-5xl text-center">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--token-eyebrow)]" data-edit-path="eyebrow">{eyebrow}</p>}
        {headline && <h1 className="mt-3 text-3xl font-extrabold uppercase leading-tight text-[color:var(--token-heading)] md:text-5xl" data-edit-path="headline">{headline}</h1>}
        {competition && <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--token-badge-bg)] px-4 py-1.5 text-sm font-semibold text-[color:var(--token-badge-text)]"><Trophy size={14} />{competition}</p>}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto mt-10 grid max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-3xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] p-6 shadow-xl md:gap-8 md:p-10">
          <div className="flex flex-col items-center gap-3">
            <TeamCrest logo={homeLogo} name={homeTeam} editKey="homeLogo" />
            <span className="text-sm font-bold text-[color:var(--token-heading)] md:text-lg" data-edit-path="homeTeam">{homeTeam}</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-black text-[color:var(--token-accent)] md:text-4xl">:</span>
            <span className="mt-1 block text-[11px] font-bold uppercase tracking-widest text-[color:var(--token-muted)]">vs</span>
            {dateLabel && <span className="mt-2 block text-xs font-medium text-[color:var(--token-muted)] md:text-sm" data-edit-path="dateLabel">{dateLabel}</span>}
          </div>
          <div className="flex flex-col items-center gap-3">
            <TeamCrest logo={awayLogo} name={awayTeam} editKey="awayLogo" />
            <span className="text-sm font-bold text-[color:var(--token-heading)] md:text-lg" data-edit-path="awayTeam">{awayTeam}</span>
          </div>
        </motion.div>

        {venue && <p className="mt-5 inline-flex items-center gap-2 text-sm text-[color:var(--token-muted)]"><MapPin size={15} className="text-[color:var(--token-icon)]" /><span data-edit-path="venue">{venue}</span></p>}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {primaryCta.label && <a data-edit-link="primaryCta" href={primaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full bg-[var(--token-btn-bg)] px-7 py-3.5 font-bold text-[color:var(--token-btn-text)] shadow-lg transition hover:-translate-y-0.5"><Ticket size={17} /><span data-edit-path="label">{primaryCta.label}</span></a>}
          {secondaryCta.label && <a data-edit-link="secondaryCta" href={secondaryCta.href || '#'} className="inline-flex items-center gap-2 rounded-full border border-[var(--token-btn-secondary-border)] px-7 py-3.5 font-semibold text-[color:var(--token-heading)] transition hover:bg-[var(--token-badge-bg)]"><span data-edit-path="label">{secondaryCta.label}</span><ArrowRight size={16} /></a>}
        </div>
      </div>
    </section>
  );
}

// ── MatchSchedule — Spielplan als Liste ──────────────────────────────────────
type Match = { dateLabel?: string; competition?: string; homeTeam?: string; awayTeam?: string; venue?: string; result?: string; homeGame?: boolean; ticketHref?: string };
export function MatchScheduleSection({ data }: Props) {
  const badge = str(data.badgeText) || str(data.badge);
  const headline = str(data.headline) || 'Spielplan';
  const subline = str(data.subline);
  const matches = arr<Match>(data.matches);

  return (
    <section className="bg-[var(--token-section-bg)] px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          {badge && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badge}</p>}
          <h2 className="mt-2 text-3xl font-extrabold uppercase text-[color:var(--token-heading)] md:text-4xl" data-edit-path="headline">{headline}</h2>
          {subline && <p className="mt-3 text-[color:var(--token-body)]" data-edit-path="subline">{subline}</p>}
        </div>
        <div className="overflow-hidden rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-sm">
          {matches.map((m, i) => (
            <div key={i} className="grid grid-cols-[3.25rem_1fr_auto] items-center gap-3 border-b border-[var(--token-card-border)] px-4 py-4 transition-colors last:border-b-0 hover:bg-[var(--token-section-bg-alt)] sm:grid-cols-[5.5rem_1fr_5.5rem] sm:px-5" data-edit-collection="matches" data-edit-index={i}>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-sm font-bold text-[color:var(--token-heading)]"><CalendarDays size={13} className="shrink-0 text-[color:var(--token-icon)]" /><span data-edit-path="dateLabel">{m.dateLabel || ''}</span></div>
                {m.competition && <div className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-wide text-[color:var(--token-muted)]" data-edit-path="competition">{m.competition}</div>}
              </div>
              <div className="flex min-w-0 items-center justify-center gap-2 sm:gap-3">
                <span className="min-w-0 flex-1 truncate text-right text-sm font-bold text-[color:var(--token-heading)]" data-edit-path="homeTeam">{m.homeTeam || ''}</span>
                <span className="shrink-0 rounded-md bg-[var(--token-section-bg-alt)] px-2.5 py-1 text-sm font-black tabular-nums text-[color:var(--token-accent)]">{m.result || '–:–'}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-bold text-[color:var(--token-heading)]" data-edit-path="awayTeam">{m.awayTeam || ''}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                {m.homeGame !== undefined && <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${m.homeGame ? 'bg-[color:color-mix(in_srgb,var(--token-accent)_15%,transparent)] text-[color:var(--token-accent)]' : 'text-[color:var(--token-muted)]'}`}>{m.homeGame ? 'Heim' : 'Ausw.'}</span>}
                {m.ticketHref && <a href={m.ticketHref} className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--token-icon)] hover:underline"><Ticket size={12} />Tickets</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── LeagueTable — Tabelle / Standings ────────────────────────────────────────
type TableRow = { rank?: string; team?: string; played?: string; won?: string; drawn?: string; lost?: string; points?: string; highlight?: boolean };
export function LeagueTableSection({ data }: Props) {
  const badge = str(data.badgeText) || str(data.badge);
  const headline = str(data.headline) || 'Tabelle';
  const subline = str(data.subline);
  const rows = arr<TableRow>(data.rows);
  const cols: [keyof TableRow, string][] = [['played', 'Sp'], ['won', 'S'], ['drawn', 'U'], ['lost', 'N'], ['points', 'Pkt']];

  return (
    <section className="bg-[var(--token-section-bg)] px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          {badge && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badge}</p>}
          <h2 className="mt-2 text-3xl font-extrabold uppercase text-[color:var(--token-heading)] md:text-4xl" data-edit-path="headline">{headline}</h2>
          {subline && <p className="mt-3 text-[color:var(--token-body)]" data-edit-path="subline">{subline}</p>}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-sm">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-[var(--token-card-border)] text-[color:var(--token-muted)]">
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Team</th>
                {cols.map(([, label]) => <th key={label} className="px-3 py-3 text-center font-semibold">{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={`border-b border-[var(--token-card-border)] last:border-b-0 ${r.highlight ? 'bg-[var(--token-accent)]/10' : ''}`} data-edit-collection="rows" data-edit-index={i}>
                  <td className={`px-4 py-3 font-bold ${r.highlight ? 'text-[color:var(--token-accent)]' : 'text-[color:var(--token-heading)]'}`}>{r.rank || i + 1}</td>
                  <td className={`px-4 py-3 font-semibold ${r.highlight ? 'text-[color:var(--token-accent)]' : 'text-[color:var(--token-heading)]'}`} data-edit-path="team">{r.team || ''}</td>
                  {cols.map(([key, label]) => <td key={label} className={`px-3 py-3 text-center ${key === 'points' ? 'font-bold text-[color:var(--token-heading)]' : 'text-[color:var(--token-body)]'}`}>{str(r[key])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ── TeamRoster — Kader ───────────────────────────────────────────────────────
type Player = { number?: string; name?: string; position?: string; image?: string; nationality?: string };
export function TeamRosterSection({ data }: Props) {
  const badge = str(data.badgeText) || str(data.badge);
  const headline = str(data.headline) || 'Kader';
  const subline = str(data.subline);
  const players = arr<Player>(data.players);

  return (
    <section className="bg-[var(--token-section-bg)] px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          {badge && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badge}</p>}
          <h2 className="mt-2 text-3xl font-extrabold uppercase text-[color:var(--token-heading)] md:text-4xl" data-edit-path="headline">{headline}</h2>
          {subline && <p className="mt-3 text-[color:var(--token-body)]" data-edit-path="subline">{subline}</p>}
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {players.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 5) * 0.05 }} className="group overflow-hidden rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-sm transition-all duration-300 hover:shadow-xl" data-edit-collection="players" data-edit-index={i}>
              <div className="relative aspect-[3/4] overflow-hidden bg-[color:color-mix(in_srgb,var(--token-heading)_8%,var(--token-section-bg-alt))]">
                {p.image
                  ? <img data-edit-image="image" src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  : <div className="flex h-full w-full items-center justify-center"><span className="text-6xl font-black text-[color:color-mix(in_srgb,var(--token-heading)_16%,transparent)]">{p.number || (p.name ? p.name[0] : '?')}</span></div>}
                {p.number && <span className="absolute right-2 top-2 rounded-md bg-[var(--token-btn-bg)] px-2 py-0.5 text-lg font-black tabular-nums text-[color:var(--token-btn-text)] shadow">{p.number}</span>}
              </div>
              <div className="p-3 text-center">
                <p className="truncate font-bold text-[color:var(--token-heading)]" data-edit-path="name">{p.name || ''}</p>
                <p className="text-xs text-[color:var(--token-muted)]"><span data-edit-path="position">{p.position || ''}</span>{p.nationality ? ` · ${p.nationality}` : ''}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SponsorsWall — Sponsoren nach Stufen ─────────────────────────────────────
type SponsorLogo = { name?: string; image?: string; href?: string };
type SponsorTier = { tierLabel?: string; logos?: SponsorLogo[] };
export function SponsorsWallSection({ data }: Props) {
  const badge = str(data.badgeText) || str(data.badge);
  const headline = str(data.headline) || 'Unsere Partner';
  const subline = str(data.subline);
  const tiers = arr<SponsorTier>(data.tiers);

  return (
    <section className="bg-[var(--token-section-bg)] px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          {badge && <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--token-badge-text)]" data-edit-path="badgeText">{badge}</p>}
          <h2 className="mt-2 text-3xl font-extrabold uppercase text-[color:var(--token-heading)] md:text-4xl" data-edit-path="headline">{headline}</h2>
          {subline && <p className="mt-3 text-[color:var(--token-body)]" data-edit-path="subline">{subline}</p>}
        </div>
        <div className="space-y-10">
          {tiers.map((tier, ti) => (
            <div key={ti} data-edit-collection="tiers" data-edit-index={ti}>
              {tier.tierLabel && <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--token-eyebrow)]" data-edit-path="tierLabel">{tier.tierLabel}</p>}
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                {(tier.logos || []).map((logo, li) => {
                  const inner = logo.image
                    ? <img src={logo.image} alt={logo.name || ''} className="max-h-12 w-auto object-contain opacity-80 transition hover:opacity-100 md:max-h-16" />
                    : <span className="text-lg font-bold text-[color:var(--token-heading)]">{logo.name}</span>;
                  return (
                    <div key={li} className="flex h-20 min-w-[120px] items-center justify-center rounded-xl border border-[var(--token-card-border)] bg-[var(--token-card-bg)] px-6">
                      {logo.href ? <a href={logo.href} target="_blank" rel="noopener noreferrer">{inner}</a> : inner}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
