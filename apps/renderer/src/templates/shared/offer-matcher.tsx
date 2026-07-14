'use client';

import { useId, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RefreshCw, Sparkles } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/icon-map';
import { buildLeadContextHref, persistLeadContext, type LeadContext } from '@/lib/lead-context';
import {
  buildOfferMatcherSummary,
  getOfferMatcherResult,
  normalizeOfferMatcherData,
  safeOfferMatcherHref,
  type OfferMatcherSelections,
} from '@/lib/offer-matcher';
import { plain } from '@/lib/strip-html';
import { CardSurface, PremiumSectionHeader } from './section-primitives';

type Props = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

export function OfferMatcherSection({ data }: Props) {
  const config = useMemo(() => normalizeOfferMatcherData(data), [data]);
  const sectionId = useId().replace(/:/g, '');
  const questionHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<OfferMatcherSelections>({});
  const [resultVisible, setResultVisible] = useState(false);
  const badge = valueText(data.badge) || valueText(data.badgeText);
  const headline = valueText(data.headline) || 'Welches Angebot passt zu Ihnen?';
  const subline = valueText(data.subline);
  const nextLabel = valueText(data.nextLabel) || 'Weiter';
  const backLabel = valueText(data.backLabel) || 'Zurück';
  const resultLabel = valueText(data.resultLabel) || 'Empfehlung anzeigen';
  const restartLabel = valueText(data.restartLabel) || 'Neu starten';
  const panelTitle = valueText(data.panelTitle) || 'Ihr Angebotsprofil';
  const panelHint = valueText(data.panelHint) || 'Mit jeder Antwort wird die Empfehlung präziser.';
  const helperText = valueText(data.helperText);
  const privacyText = valueText(data.privacyText);
  const progressLabel = valueText(data.progressLabel) || 'beantwortet';
  const questionLabel = valueText(data.questionLabel) || 'Frage';

  if (!config) {
    const fallbackCta = actionValue(data.fallbackCta) || { label: 'Persönlich beraten lassen', href: '/kontakt' };
    return (
      <div className="relative">
        <PremiumSectionHeader eyebrow={badge} headline={headline} subline={plain(subline)} eyebrowPath="badge" richSubline={false} className="max-w-4xl" />
        <CardSurface className="mx-auto max-w-3xl p-6 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--token-section-bg-alt)] text-[color:var(--token-icon)]">
            <Sparkles aria-hidden="true" size={22} />
          </div>
          <h3 className="mt-5 text-2xl font-semibold text-[color:var(--token-card-heading,var(--token-heading))]">Wir finden den passenden Weg gemeinsam.</h3>
          <p className="mt-3 max-w-2xl leading-7 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="fallbackText">
            {valueText(data.fallbackText) || 'Der Angebots-Finder ist noch nicht vollständig eingerichtet. Eine persönliche Empfehlung erhalten Sie trotzdem direkt von uns.'}
          </p>
          <a href={fallbackCta.href} data-edit-link="fallbackCta" className="cms-button cms-button--primary mt-6">
            <span data-edit-path="label">{fallbackCta.label}</span>
            <ArrowRight aria-hidden="true" size={17} className="cms-button-icon" />
          </a>
        </CardSurface>
      </div>
    );
  }

  const question = config.questions[Math.min(currentIndex, config.questions.length - 1)];
  const questions = config.questions;
  const questionCount = questions.length;
  const selectedOptionId = selections[question.id];
  const answeredCount = questions.filter((entry) => Boolean(selections[entry.id])).length;
  const progress = Math.round((answeredCount / questionCount) * 100);
  const result = getOfferMatcherResult(config, selections);

  function focusQuestion() {
    window.requestAnimationFrame(() => questionHeadingRef.current?.focus());
  }

  function moveToQuestion(index: number) {
    const target = Math.max(0, Math.min(questionCount - 1, index));
    const previousComplete = questions.slice(0, target).every((entry) => Boolean(selections[entry.id]));
    if (!previousComplete) return;
    setResultVisible(false);
    setCurrentIndex(target);
    focusQuestion();
  }

  function choose(optionId: string) {
    setResultVisible(false);
    setSelections((current) => ({ ...current, [question.id]: optionId }));
  }

  function next() {
    if (!selectedOptionId) return;
    if (currentIndex < questionCount - 1) {
      setCurrentIndex((index) => index + 1);
      focusQuestion();
      return;
    }
    setResultVisible(true);
    window.requestAnimationFrame(() => resultHeadingRef.current?.focus());
  }

  function restart() {
    setSelections({});
    setResultVisible(false);
    setCurrentIndex(0);
    focusQuestion();
  }

  const resultSummary = result ? buildOfferMatcherSummary(config, selections, result) : '';
  const leadContext: LeadContext = { source: 'offerMatcher', summary: resultSummary };
  const resultHref = result?.offer.primaryCta
    ? buildLeadContextHref(result.offer.primaryCta.href, leadContext)
    : '';
  const secondaryResultHref = result?.offer.secondaryCta
    ? buildLeadContextHref(result.offer.secondaryCta.href, leadContext)
    : '';

  return (
    <div className="relative">
      <PremiumSectionHeader
        eyebrow={badge}
        headline={headline}
        subline={plain(subline)}
        eyebrowPath="badge"
        richSubline={false}
        className="max-w-4xl"
      />
      {helperText && <p className="-mt-4 mb-8 max-w-3xl text-sm leading-6 text-[color:var(--token-muted)]" data-edit-path="helperText">{helperText}</p>}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(19rem,0.88fr)] lg:gap-10">
        <div className="min-w-0">
          <nav aria-label="Fragenfortschritt" className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-4 text-xs font-semibold text-[color:var(--token-muted)]">
              <span>{answeredCount} von {config.questions.length} {progressLabel}</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--token-section-bg-alt)]" aria-hidden="true">
              <span
                className="block h-full rounded-full bg-[var(--token-btn-bg)] transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
            <ol className="mt-4 flex flex-wrap gap-2">
              {config.questions.map((entry, index) => {
                const answered = Boolean(selections[entry.id]);
                const active = index === currentIndex && !resultVisible;
                const reachable = config.questions.slice(0, index).every((item) => Boolean(selections[item.id]));
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      disabled={!reachable}
                      aria-current={active ? 'step' : undefined}
                      aria-label={`Frage ${index + 1}${answered ? ', beantwortet' : ''}`}
                      onClick={() => moveToQuestion(index)}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-xs font-bold outline-none transition-[background-color,border-color,color] focus-visible:ring-2 focus-visible:ring-[var(--token-btn-bg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--token-section-bg)] disabled:cursor-not-allowed disabled:opacity-45 ${active || answered
                        ? 'border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]'
                        : 'border-[var(--token-card-border)] bg-[var(--token-card-bg)] text-[color:var(--token-card-muted,var(--token-muted))]'}`}
                    >
                      {answered && !active ? <Check aria-hidden="true" size={15} /> : String(index + 1).padStart(2, '0')}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <CardSurface className="overflow-hidden p-5 sm:p-7 md:p-9">
            <div data-edit-collection="questions" data-edit-index={currentIndex}>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[color:var(--token-label)]">
                {questionLabel} {currentIndex + 1} von {config.questions.length}
              </p>
              <h3
                ref={questionHeadingRef}
                id={`${sectionId}-question-${currentIndex}`}
                tabIndex={-1}
                data-edit-path="label"
                className="mt-3 max-w-2xl text-2xl font-semibold tracking-[var(--token-heading-tracking,-0.02em)] text-[color:var(--token-card-heading,var(--token-heading))] outline-none sm:text-3xl"
              >
                {question.label}
              </h3>
              {question.description && (
                <p data-edit-path="description" className="mt-3 max-w-2xl leading-7 text-[color:var(--token-card-body,var(--token-body))]">
                  {plain(question.description)}
                </p>
              )}

              <fieldset className="mt-7" aria-labelledby={`${sectionId}-question-${currentIndex}`}>
                <legend className="sr-only">Eine Antwort auswählen</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {question.options.map((option, optionIndex) => {
                    const active = option.id === selectedOptionId;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => choose(option.id)}
                        className={`group relative flex min-h-24 w-full items-start gap-3 rounded-[var(--token-card-radius)] border p-4 text-left outline-none transition-[border-color,background-color,box-shadow,transform] duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-[var(--token-btn-bg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--token-card-bg)] ${active
                          ? 'border-[color:color-mix(in_srgb,var(--token-btn-bg)_58%,var(--token-card-border))] bg-[color:color-mix(in_srgb,var(--token-btn-bg)_8%,var(--token-card-bg))] shadow-[0_12px_32px_var(--token-shadow)]'
                          : 'border-[var(--token-card-border)] bg-[var(--token-section-bg)] hover:-translate-y-0.5 hover:border-[color:color-mix(in_srgb,var(--token-btn-bg)_34%,var(--token-card-border))]'}`}
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${active
                          ? 'border-[color:color-mix(in_srgb,var(--token-check)_50%,var(--token-card-border))] bg-[color:color-mix(in_srgb,var(--token-check)_10%,var(--token-card-bg))] text-[color:var(--token-check)]'
                          : 'border-[var(--token-card-border)] bg-[var(--token-section-bg-alt)] text-[color:var(--token-card-icon)]'}`}
                        >
                          {active ? <Check aria-hidden="true" size={18} /> : option.icon ? <DynamicIcon aria-hidden="true" name={option.icon} size={18} /> : <span className="text-xs font-bold">{String(optionIndex + 1).padStart(2, '0')}</span>}
                        </span>
                        <span className="min-w-0 pt-0.5">
                          <span className="block font-semibold leading-5 text-[color:var(--token-card-heading,var(--token-heading))]">{option.label}</span>
                          {option.description && <span className="mt-1.5 block text-sm leading-5 text-[color:var(--token-card-muted,var(--token-muted))]">{plain(option.description)}</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--token-divider)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              {currentIndex > 0 ? (
                <button type="button" onClick={() => moveToQuestion(currentIndex - 1)} className="cms-button cms-button--secondary w-full sm:w-auto">
                  <ArrowLeft aria-hidden="true" size={17} className="cms-button-icon" />
                  {backLabel}
                </button>
              ) : <span />}
              <button type="button" disabled={!selectedOptionId} onClick={next} className="cms-button cms-button--primary w-full disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto">
                {currentIndex === config.questions.length - 1 ? resultLabel : nextLabel}
                <ArrowRight aria-hidden="true" size={17} className="cms-button-icon" />
              </button>
            </div>
          </CardSurface>
        </div>

        <CardSurface as="aside" className="relative overflow-hidden p-6 sm:p-7 lg:sticky lg:top-28" aria-label={panelTitle}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-45 blur-3xl"
            style={{ background: 'color-mix(in srgb, var(--token-accent) 38%, transparent)' }}
          />
          {resultVisible && result ? (
            <div className="relative" data-edit-collection="offers" data-edit-index={config.offers.findIndex((entry) => entry.id === result.offer.id)}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:color-mix(in_srgb,var(--token-accent)_12%,var(--token-card-bg))] text-[color:var(--token-icon)]">
                <Sparkles aria-hidden="true" size={22} />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--token-eyebrow)]" data-edit-path="eyebrow">
                {result.offer.eyebrow || 'Unsere Empfehlung'}
              </p>
              <h3 ref={resultHeadingRef} tabIndex={-1} data-edit-path="title" className="mt-2 text-3xl font-semibold tracking-[var(--token-heading-tracking,-0.03em)] text-[color:var(--token-card-heading,var(--token-heading))] outline-none">
                {result.offer.title}
              </h3>
              {result.offer.priceLabel && <p className="mt-3 text-lg font-bold text-[color:var(--token-price)]" data-edit-path="priceLabel">{result.offer.priceLabel}</p>}
              {result.offer.description && <p className="mt-4 leading-7 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="description">{plain(result.offer.description)}</p>}
              <div className="mt-5 rounded-[calc(var(--token-card-radius)*0.75)] border border-[var(--token-card-border)] bg-[var(--token-section-bg-alt)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--token-card-muted,var(--token-muted))]">Warum das passt</p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="reason">
                  {result.offer.reason || (result.matchedAnswers > 0
                    ? `${result.matchedAnswers} von ${config.questions.length} Antworten sprechen besonders für dieses Angebot.`
                    : 'Dieses Angebot ist als beste allgemeine Empfehlung hinterlegt.')}
                </p>
              </div>
              {result.offer.features.length > 0 && (
                <ul className="mt-6 space-y-3">
                  {result.offer.features.map((feature, index) => (
                    <li key={`${feature}-${index}`} className="flex gap-3 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))]">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--token-check)_12%,var(--token-card-bg))] text-[color:var(--token-check)]"><Check aria-hidden="true" size={13} /></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
              {(result.offer.primaryCta || result.offer.secondaryCta) && (
                <div className="mt-7 grid gap-2">
                  {result.offer.primaryCta && (
                    <a href={resultHref} data-edit-link="primaryCta" onClick={() => persistLeadContext(leadContext)} className="cms-button cms-button--primary w-full justify-center">
                      <span data-edit-path="label">{result.offer.primaryCta.label}</span>
                      <ArrowRight aria-hidden="true" size={17} className="cms-button-icon" />
                    </a>
                  )}
                  {result.offer.secondaryCta && (
                    <a href={secondaryResultHref} data-edit-link="secondaryCta" onClick={() => persistLeadContext(leadContext)} className="cms-button cms-button--secondary w-full justify-center">
                      <span data-edit-path="label">{result.offer.secondaryCta.label}</span>
                    </a>
                  )}
                </div>
              )}
              <button type="button" onClick={restart} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--token-button-radius)] text-sm font-semibold text-[color:var(--token-link)] outline-none hover:text-[color:var(--token-link-hover)] focus-visible:ring-2 focus-visible:ring-[var(--token-btn-bg)]">
                <RefreshCw aria-hidden="true" size={15} />
                {restartLabel}
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--token-card-border)] bg-[var(--token-section-bg-alt)] text-[color:var(--token-icon)]">
                  <Sparkles aria-hidden="true" size={21} />
                  <span aria-hidden="true" className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[var(--token-accent)] ring-4 ring-[var(--token-card-bg)]" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[color:var(--token-label)]">Live-Matching</p>
                  <h3 className="mt-1 font-semibold text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="panelTitle">{panelTitle}</h3>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-[color:var(--token-card-muted,var(--token-muted))]" data-edit-path="panelHint">{panelHint}</p>
              <dl className="mt-6 space-y-4 border-t border-[var(--token-divider)] pt-5">
                {config.questions.map((entry, index) => {
                  const option = entry.options.find((item) => item.id === selections[entry.id]);
                  return (
                    <div key={entry.id} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3">
                      <dt className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-bold ${option
                        ? 'border-[var(--token-check)] bg-[color:color-mix(in_srgb,var(--token-check)_10%,var(--token-card-bg))] text-[color:var(--token-check)]'
                        : 'border-[var(--token-card-border)] text-[color:var(--token-card-muted,var(--token-muted))]'}`}
                      >
                        {option ? <Check aria-hidden="true" size={13} /> : index + 1}
                      </dt>
                      <dd className="min-w-0 pt-0.5">
                        <span className="block truncate text-xs font-semibold text-[color:var(--token-card-muted,var(--token-muted))]">{entry.label}</span>
                        <span className="mt-0.5 block text-sm font-semibold text-[color:var(--token-card-heading,var(--token-heading))]">{option?.label || 'Noch offen'}</span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          )}
        </CardSurface>
      </div>

      {privacyText && <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-[color:var(--token-muted)]" data-edit-path="privacyText">{privacyText}</p>}

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {resultVisible && result ? `Empfehlung: ${result.offer.title}` : `${answeredCount} von ${config.questions.length} Fragen beantwortet`}
      </p>
    </div>
  );
}

function valueText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function actionValue(value: unknown): { label: string; href: string } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const action = value as Record<string, unknown>;
  const label = valueText(action.label);
  const href = safeOfferMatcherHref(action.href);
  return label && href ? { label, href } : null;
}
