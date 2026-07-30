'use client';

import { useId, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardCheck,
  ShieldCheck,
} from 'lucide-react';
import { DynamicContactForm } from '@/components/dynamic-contact-form';
import { DynamicIcon } from '@/components/ui/icon-map';
import type { ContactFormFieldDefinition } from '@/lib/contact-form';
import { persistLeadContext, type LeadContext } from '@/lib/lead-context';
import {
  buildSmartInquirySummary,
  isSmartInquiryScopeComplete,
  normalizeSmartInquiryChoices,
  type SmartInquiryChoice,
  type SmartInquiryGroup,
  type SmartInquirySelections,
} from '@/lib/smart-inquiry';
import { plain } from '@/lib/strip-html';
import { CardSurface, PremiumSectionHeader } from './section-primitives';

type Props = {
  data: Record<string, unknown>;
  variant?: string | null;
  styleVariant?: string;
};

const FALLBACK_GOAL: SmartInquiryChoice = {
  label: 'Individuelle Anfrage',
  description: 'Beschreiben Sie Ihr Vorhaben im nächsten Schritt genauer.',
  icon: 'message-square-text',
};

const STEP_LABELS = ['Ziel', 'Rahmen', 'Kontakt'] as const;

export function SmartInquirySection({ data }: Props) {
  const sectionId = useId().replace(/:/g, '');
  const headingRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<SmartInquirySelections>({});

  const badge = textValue(data.badge);
  const headline = textValue(data.headline) || 'Worum geht es bei Ihrem Vorhaben?';
  const subline = textValue(data.subline);
  const trustNote = textValue(data.trustNote);
  const summaryTitle = textValue(data.summaryTitle) || 'Ihre Anfrage';
  const summaryEmptyText = textValue(data.summaryEmptyText) || 'Ihre Auswahl erscheint hier Schritt für Schritt.';
  const nextLabel = textValue(data.nextLabel) || 'Weiter';
  const backLabel = textValue(data.backLabel) || 'Zurück';
  const submitLabel = textValue(data.submitLabel) || 'Anfrage senden';

  const rawGoals = normalizeSmartInquiryChoices(data.goals);
  const scopeOptions = normalizeSmartInquiryChoices(data.scopeOptions);
  const timingOptions = normalizeSmartInquiryChoices(data.timingOptions);
  const budgetOptions = normalizeSmartInquiryChoices(data.budgetOptions);
  const hasQualifyingOptions = scopeOptions.length + timingOptions.length + budgetOptions.length > 0;
  const hasRenderableContent = rawGoals.length > 0 || hasQualifyingOptions;
  const usingFallbackGoal = rawGoals.length === 0 && hasQualifyingOptions;
  const goals = rawGoals.length > 0 ? rawGoals : usingFallbackGoal ? [FALLBACK_GOAL] : [];

  const groups = useMemo<SmartInquiryGroup[]>(() => [
    { key: 'scope', label: textValue(data.scopeLabel) || 'Gewünschter Umfang', options: scopeOptions },
    { key: 'timing', label: textValue(data.timingLabel) || 'Gewünschter Start', options: timingOptions },
    { key: 'budget', label: textValue(data.budgetLabel) || 'Budgetrahmen', options: budgetOptions },
  ].filter((group) => group.options.length > 0) as SmartInquiryGroup[], [
    budgetOptions,
    data.budgetLabel,
    data.scopeLabel,
    data.timingLabel,
    scopeOptions,
    timingOptions,
  ]);

  const goalComplete = goals.some((goal) => goal.label === selections.goal);
  const scopeComplete = isSmartInquiryScopeComplete(groups, selections);
  const contactReachable = goalComplete && scopeComplete;
  const summary = buildSmartInquirySummary(selections, {
    scope: groups.find((group) => group.key === 'scope')?.label,
    timing: groups.find((group) => group.key === 'timing')?.label,
    budget: groups.find((group) => group.key === 'budget')?.label,
  });
  const leadContext = useMemo<LeadContext>(() => ({
    source: 'smartInquiry',
    summary: summary || 'Individuelle Anfrage',
  }), [summary]);

  function isReachable(target: number) {
    if (target === 0) return true;
    if (target === 1) return goalComplete;
    return contactReachable;
  }

  function moveToStep(target: number) {
    if (target < 0 || target > 2 || !isReachable(target)) return;
    if (target === 2) persistLeadContext(leadContext);
    setStep(target);
    window.requestAnimationFrame(() => headingRefs.current[target]?.focus());
  }

  function selectChoice(key: keyof SmartInquirySelections, value: string) {
    setSelections((current) => ({ ...current, [key]: value }));
  }

  if (!hasRenderableContent) return null;

  const completedCount = [goalComplete, scopeComplete && groups.length > 0].filter(Boolean).length;

  return (
    <section className="relative">
      <PremiumSectionHeader
        eyebrow={badge}
        headline={headline}
        subline={plain(subline)}
        eyebrowPath="badge"
        richSubline={false}
        className="max-w-4xl"
      />
      {trustNote && (
        <div className="-mt-8 mb-8 flex items-center gap-2 text-sm text-[color:var(--token-muted)] md:-mt-10 md:mb-10">
          <ShieldCheck aria-hidden="true" size={17} className="shrink-0 text-[color:var(--token-icon)]" />
          <span data-edit-path="trustNote">{plain(trustNote)}</span>
        </div>
      )}

      <nav aria-label="Anfrageschritte" className="relative mb-8 md:mb-10">
        <div className="absolute left-[16.66%] right-[16.66%] top-[1.35rem] h-px bg-[var(--token-divider)]" aria-hidden="true">
          <span
            className="block h-full bg-[var(--token-btn-bg)] transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${step * 50}%` }}
          />
        </div>
        <ol className="relative grid grid-cols-3 gap-2">
          {STEP_LABELS.map((label, index) => {
            const completed = index === 0 ? goalComplete : index === 1 ? scopeComplete && groups.length > 0 : false;
            const reachable = isReachable(index);
            const current = step === index;
            const detail = index === 0
              ? selections.goal
              : index === 1 && groups.length > 0
                ? `${groups.filter((group) => selections[group.key]).length}/${groups.length} Angaben`
                : index === 2 && contactReachable
                  ? 'Bereit'
                  : '';
            const status = current ? 'Aktueller Schritt' : completed ? 'Abgeschlossen' : reachable ? 'Erreichbar' : 'Noch nicht erreichbar';

            return (
              <li key={label} className="min-w-0 text-center">
                <button
                  type="button"
                  onClick={() => moveToStep(index)}
                  disabled={!reachable}
                  aria-current={current ? 'step' : undefined}
                  aria-label={`Schritt ${index + 1}: ${label}. ${status}.`}
                  className="group mx-auto flex min-h-11 w-full min-w-11 flex-col items-center rounded-xl px-1 text-[color:var(--token-muted)] outline-none disabled:cursor-not-allowed disabled:opacity-55 focus-visible:ring-2 focus-visible:ring-[var(--token-btn-bg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--token-section-bg)]"
                >
                  <span className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border text-sm font-bold transition-[background-color,border-color,color,transform] duration-200 motion-reduce:transition-none ${current || completed
                    ? 'border-[var(--token-btn-bg)] bg-[var(--token-btn-bg)] text-[color:var(--token-btn-text)]'
                    : 'border-[var(--token-card-border)] bg-[var(--token-card-bg)] text-[color:var(--token-card-muted,var(--token-muted))]'}`}
                  >
                    {completed && !current ? <Check aria-hidden="true" size={17} /> : index + 1}
                  </span>
                  <span className={`mt-2 text-xs font-semibold md:text-sm ${current ? 'text-[color:var(--token-heading)]' : 'text-[color:var(--token-muted)]'}`}>{label}</span>
                  {detail && <span className="mt-0.5 hidden max-w-full truncate text-[11px] text-[color:var(--token-muted)] sm:block">{detail}</span>}
                  <span className="sr-only">{status}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:gap-10">
        <div className="min-w-0">
          <details className="cms-card mb-5 lg:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-[color:var(--token-card-heading,var(--token-heading))] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--token-btn-bg)]">
              <span className="flex min-w-0 items-center gap-2">
                <ClipboardCheck aria-hidden="true" size={17} className="shrink-0 text-[color:var(--token-card-icon)]" />
                <span className="truncate">{summaryTitle}</span>
                {completedCount > 0 && <span className="text-[color:var(--token-card-muted,var(--token-muted))]">· {completedCount} erledigt</span>}
              </span>
              <ChevronDown aria-hidden="true" size={16} className="shrink-0" />
            </summary>
            <div className="border-t border-[var(--token-card-border)] px-4 py-4">
              <SummaryRows groups={groups} selections={selections} emptyText={summaryEmptyText} />
            </div>
          </details>

          <div className="min-h-[28rem]">
            {step === 0 && (
              <div role="group" aria-labelledby={`${sectionId}-step-1`}>
                <StepHeading
                  ref={(node) => { headingRefs.current[0] = node; }}
                  id={`${sectionId}-step-1`}
                  kicker="Schritt 1 von 3"
                  title="Was möchten Sie erreichen?"
                  text="Wählen Sie das Ziel, das Ihrem Vorhaben am nächsten kommt."
                />
                <fieldset className="mt-7">
                  <legend className="sr-only">Ziel auswählen</legend>
                  <ChoiceGrid
                    collection="goals"
                    options={goals}
                    selected={selections.goal}
                    editable={!usingFallbackGoal}
                    onSelect={(value) => selectChoice('goal', value)}
                  />
                </fieldset>
                <StepControls
                  nextLabel={nextLabel}
                  nextDisabled={!goalComplete}
                  onNext={() => moveToStep(1)}
                />
              </div>
            )}

            {step === 1 && (
              <div role="group" aria-labelledby={`${sectionId}-step-2`}>
                <StepHeading
                  ref={(node) => { headingRefs.current[1] = node; }}
                  id={`${sectionId}-step-2`}
                  kicker="Schritt 2 von 3"
                  title="Welcher Rahmen passt?"
                  text="Drei kurze Angaben helfen uns, Ihre Anfrage passend einzuordnen."
                />
                {groups.length > 0 ? (
                  <div className="mt-7 space-y-8">
                    {groups.map((group) => (
                      <fieldset key={group.key}>
                        <legend className="mb-3 text-sm font-semibold text-[color:var(--token-heading)]" data-edit-path={`${group.key}Label`}>
                          {group.label}
                        </legend>
                        <ChoiceGrid
                          collection={`${group.key}Options`}
                          options={group.options}
                          selected={selections[group.key]}
                          compact
                          onSelect={(value) => selectChoice(group.key, value)}
                        />
                      </fieldset>
                    ))}
                  </div>
                ) : (
                  <CardSurface className="mt-7 p-5 text-sm leading-6 text-[color:var(--token-card-body,var(--token-body))]">
                    Ihr Ziel ist bereits eindeutig. Sie können direkt Ihre Kontaktdaten ergänzen.
                  </CardSurface>
                )}
                <StepControls
                  backLabel={backLabel}
                  nextLabel={nextLabel}
                  nextDisabled={!scopeComplete}
                  onBack={() => moveToStep(0)}
                  onNext={() => moveToStep(2)}
                />
              </div>
            )}

            {step === 2 && (
              <div role="group" aria-labelledby={`${sectionId}-step-3`}>
                <StepHeading
                  ref={(node) => { headingRefs.current[2] = node; }}
                  id={`${sectionId}-step-3`}
                  kicker="Schritt 3 von 3"
                  title="Wie dürfen wir Sie erreichen?"
                  text="Ihre Auswahl ist vorbereitet. Ergänzen Sie nur noch Ihre Kontaktdaten."
                />
                <CardSurface className="mt-7 p-5 sm:p-7" interactive>
                  <DynamicContactForm
                    fields={Array.isArray(data.fields) ? data.fields as ContactFormFieldDefinition[] : undefined}
                    submitLabel={submitLabel}
                    leadContext={leadContext}
                  />
                </CardSurface>
                <StepControls backLabel={backLabel} onBack={() => moveToStep(1)} />
              </div>
            )}
          </div>
        </div>

        <CardSurface as="aside" className="hidden p-6 lg:sticky lg:top-28 lg:block" aria-label={summaryTitle}>
          <div className="flex items-center gap-3 border-b border-[var(--token-card-border)] pb-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:color-mix(in_srgb,var(--token-icon)_10%,var(--token-card-bg))] text-[color:var(--token-card-icon)]">
              <ClipboardCheck aria-hidden="true" size={19} />
            </span>
            <div className="min-w-0">
              <span className="block text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--token-card-muted,var(--token-muted))]">Live-Brief</span>
              <h3 className="mt-1 font-semibold text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="summaryTitle">{summaryTitle}</h3>
            </div>
          </div>
          <div className="py-5">
            <SummaryRows groups={groups} selections={selections} emptyText={summaryEmptyText} />
          </div>
          <div className="flex gap-3 border-t border-[var(--token-card-border)] pt-5 text-xs leading-5 text-[color:var(--token-card-muted,var(--token-muted))]">
            <ShieldCheck aria-hidden="true" size={16} className="mt-0.5 shrink-0 text-[color:var(--token-card-icon)]" />
            <span>{trustNote ? plain(trustNote) : 'Ihre Angaben werden nur zur Bearbeitung dieser Anfrage verwendet.'}</span>
          </div>
        </CardSurface>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {summary || summaryEmptyText}
      </p>
    </section>
  );
}

function ChoiceGrid({
  collection,
  options,
  selected,
  editable = true,
  compact = false,
  onSelect,
}: {
  collection: string;
  options: SmartInquiryChoice[];
  selected?: string;
  editable?: boolean;
  compact?: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <div className={`grid gap-3 ${compact ? 'sm:grid-cols-2' : 'md:grid-cols-2'}`}>
      {options.map((option, index) => {
        const active = selected === option.label;
        return (
          <button
            key={`${option.label}-${index}`}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(option.label)}
            data-edit-collection={editable ? collection : undefined}
            data-edit-index={editable ? index : undefined}
            data-card
            className={`group relative flex min-h-16 w-full items-start gap-3 rounded-[var(--token-card-radius)] border p-4 text-left outline-none transition-[border-color,background-color,box-shadow,transform] duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-[var(--token-btn-bg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--token-section-bg)] ${active
              ? 'border-[color:color-mix(in_srgb,var(--token-btn-bg)_56%,var(--token-card-border))] bg-[color:color-mix(in_srgb,var(--token-btn-bg)_8%,var(--token-card-bg))] shadow-[0_10px_30px_var(--token-shadow)]'
              : 'border-[var(--token-card-border)] bg-[var(--token-card-bg)] hover:border-[color:color-mix(in_srgb,var(--token-btn-bg)_34%,var(--token-card-border))]'}`}
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200 motion-reduce:transition-none ${active
              ? 'border-[color:color-mix(in_srgb,var(--token-check)_52%,var(--token-card-border))] bg-[color:color-mix(in_srgb,var(--token-check)_10%,var(--token-card-bg))] text-[color:var(--token-check)]'
              : 'border-[var(--token-card-border)] bg-[var(--token-section-bg-alt)] text-[color:var(--token-card-icon)]'}`}
            >
              {active ? (
                <Check aria-hidden="true" size={18} />
              ) : option.icon ? (
                <DynamicIcon aria-hidden="true" editPath={editable ? 'icon' : undefined} name={option.icon} size={18} />
              ) : (
                <span aria-hidden="true" className="text-xs font-bold tabular-nums">{String(index + 1).padStart(2, '0')}</span>
              )}
            </span>
            <span className="min-w-0 pt-0.5">
              <span className="block font-semibold leading-5 text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path={editable ? 'label' : undefined}>{option.label}</span>
              {option.description && (
                <span className="mt-1.5 block text-sm leading-5 text-[color:var(--token-card-muted,var(--token-muted))]" data-edit-path={editable ? 'description' : undefined}>
                  {plain(option.description)}
                </span>
              )}
            </span>
            <span className="sr-only">{active ? 'Ausgewählt' : 'Nicht ausgewählt'}</span>
          </button>
        );
      })}
    </div>
  );
}

const StepHeading = function StepHeading({
  ref,
  id,
  kicker,
  title,
  text,
}: {
  ref: (node: HTMLHeadingElement | null) => void;
  id: string;
  kicker: string;
  title: string;
  text: string;
}) {
  return (
    <header>
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--token-label)]">{kicker}</span>
      <h3 ref={ref} id={id} tabIndex={-1} className="mt-2 text-2xl font-semibold tracking-[var(--token-heading-tracking,-0.02em)] text-[color:var(--token-heading)] outline-none sm:text-3xl">
        {title}
      </h3>
      <p className="mt-3 max-w-2xl leading-7 text-[color:var(--token-body)]">{text}</p>
    </header>
  );
};

function StepControls({
  backLabel,
  nextLabel,
  nextDisabled,
  onBack,
  onNext,
}: {
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  onBack?: () => void;
  onNext?: () => void;
}) {
  if (!onBack && !onNext) return null;
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--token-divider)] pt-6 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <button type="button" onClick={onBack} className="cms-button cms-button--secondary w-full sm:w-auto">
          <ArrowLeft aria-hidden="true" size={17} className="cms-button-icon" />
          {backLabel || 'Zurück'}
        </button>
      ) : <span />}
      {onNext && (
        <button type="button" onClick={onNext} disabled={nextDisabled} className="cms-button cms-button--primary w-full disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto">
          {nextLabel || 'Weiter'}
          <ArrowRight aria-hidden="true" size={17} className="cms-button-icon" />
        </button>
      )}
    </div>
  );
}

function SummaryRows({
  groups,
  selections,
  emptyText,
}: {
  groups: SmartInquiryGroup[];
  selections: SmartInquirySelections;
  emptyText: string;
}) {
  const rows = [
    { key: 'goal', label: 'Ziel', value: selections.goal },
    ...groups.map((group) => ({ key: group.key, label: group.label, value: selections[group.key] })),
  ];
  const selectedRows = rows.filter((row) => row.value);

  if (selectedRows.length === 0) {
    return <p className="text-sm leading-6 text-[color:var(--token-card-muted,var(--token-muted))]" data-edit-path="summaryEmptyText">{emptyText}</p>;
  }

  return (
    <dl className="space-y-4">
      {selectedRows.map((row) => (
        <div key={row.key} className="grid grid-cols-[6.75rem_minmax(0,1fr)] gap-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--token-card-muted,var(--token-muted))]">{row.label}</dt>
          <dd className="text-sm font-semibold leading-5 text-[color:var(--token-card-heading,var(--token-heading))]">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}
