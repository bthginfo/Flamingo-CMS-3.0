'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getDeterministicWeightedResultId } from '@/lib/offer-matcher';
import { safeContentUrl } from '@/lib/safe-content-url';
import { plain } from '@/lib/strip-html';
import { AdvancedIntro, EmptyVisual } from './advanced-shared';

type Score = { resultId?: string; points?: number };
type Answer = { id?: string; label?: string; description?: string; scores?: Score[]; nextQuestionId?: string; resultId?: string };
type Question = { id?: string; label?: string; description?: string; answers?: Answer[] };
type Result = { id?: string; title?: string; text?: string; image?: string; features?: string[]; cta?: { label?: string; href?: string } };
type Props = { data: Record<string, unknown> };

export function GuidedChoiceSection({ data }: Props) {
  const questions = Array.isArray(data.questions) ? (data.questions as Question[]).filter((item) => item?.id && item?.label) : [];
  const results = Array.isArray(data.results) ? (data.results as Result[]).filter((item) => item?.id && item?.title) : [];
  const mode = data.mode === 'branch' ? 'branch' : 'score';
  const [questionId, setQuestionId] = useState(questions[0]?.id || '');
  const [history, setHistory] = useState<Array<{ questionId: string; answer: Answer }>>([]);
  const [resultId, setResultId] = useState('');
  const reduceMotion = useReducedMotion();
  const question = questions.find((item) => item.id === questionId) || questions[0];
  const result = results.find((item) => item.id === resultId);
  const currentIndex = Math.max(0, questions.findIndex((item) => item.id === question?.id));
  const resultIndex = Math.max(0, results.findIndex((item) => item.id === result?.id));
  const href = safeContentUrl(result?.cta?.href || '');
  const progress = mode === 'score'
    ? (history.length / Math.max(1, questions.length)) * 100
    : Math.min(92, ((history.length + (result ? 1 : 0)) / Math.max(2, questions.length)) * 100);

  const scoreResult = useMemo(() => (answers: Array<{ questionId: string; answer: Answer }>) => {
    const totals = new Map(results.map((item) => [item.id || '', 0]));
    answers.forEach(({ answer }) => {
      answer.scores?.forEach((score) => {
        totals.set(score.resultId || '', (totals.get(score.resultId || '') || 0) + Number(score.points || 0));
      });
    });
    return getDeterministicWeightedResultId(results.map((item) => item.id || ''), Object.fromEntries(totals));
  }, [results]);

  if (!questions.length || !results.length) return null;

  function choose(answer: Answer) {
    if (!question?.id) return;
    const nextHistory = [...history, { questionId: question.id, answer }];
    setHistory(nextHistory);
    if (mode === 'score') {
      const next = questions[currentIndex + 1];
      if (next?.id) setQuestionId(next.id);
      else setResultId(scoreResult(nextHistory));
    } else if (answer.resultId) {
      setResultId(answer.resultId);
    } else if (answer.nextQuestionId) {
      setQuestionId(answer.nextQuestionId);
    }
  }

  function back() {
    if (resultId) {
      setResultId('');
      const last = history.at(-1);
      if (last) {
        setQuestionId(last.questionId);
        setHistory(history.slice(0, -1));
      }
      return;
    }
    const last = history.at(-1);
    if (last) {
      setQuestionId(last.questionId);
      setHistory(history.slice(0, -1));
    }
  }

  function restart() {
    setHistory([]);
    setResultId('');
    setQuestionId(questions[0]?.id || '');
  }

  return (
    <section className="overflow-hidden bg-[var(--token-section-bg)] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <AdvancedIntro badge={String(data.badge || '')} headline={String(data.headline || '')} subline={String(data.subline || '')} />
        <div className="mt-12 overflow-hidden rounded-[var(--token-card-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] shadow-[0_30px_100px_var(--token-shadow)]" data-card>
          <div className="h-1.5 bg-[var(--token-section-bg-alt)]">
            <motion.div className="h-full bg-[var(--token-accent)]" animate={{ width: `${result ? 100 : progress}%` }} />
          </div>
          <div className="grid min-h-[34rem] lg:grid-cols-[.38fr_.62fr]">
            <aside className="border-b border-[var(--token-card-border)] bg-[var(--token-section-bg-alt)] p-6 lg:border-b-0 lg:border-r lg:p-9">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[color:var(--token-eyebrow)]">{result ? 'Ihre Empfehlung' : `Frage ${history.length + 1}`}</p>
              <p className="mt-5 text-5xl font-black tracking-[-.06em] text-[color:var(--token-heading)]">{result ? '✓' : String(history.length + 1).padStart(2, '0')}</p>
              <p className="mt-5 max-w-xs text-sm leading-6 text-[color:var(--token-muted)]">Antworten Sie intuitiv. Ihre Auswahl wird nur für diese Empfehlung verwendet.</p>
              <div className="mt-8 flex gap-2">
                <button type="button" onClick={back} disabled={!history.length && !result} className="inline-flex min-h-10 items-center gap-2 rounded-[var(--token-button-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] px-3 text-xs font-bold text-[color:var(--token-card-heading,var(--token-heading))] disabled:opacity-35">
                  <ArrowLeft size={14} /> Zurück
                </button>
                <button type="button" onClick={restart} className="inline-flex min-h-10 items-center gap-2 rounded-[var(--token-button-radius)] border border-[var(--token-card-border)] bg-[var(--token-card-bg)] px-3 text-xs font-bold text-[color:var(--token-card-heading,var(--token-heading))]">
                  <RotateCcw size={14} /> <span data-edit-path="restartLabel">{String(data.restartLabel || 'Neu starten')}</span>
                </button>
              </div>
            </aside>

            <div className="relative p-6 md:p-9 lg:p-12" aria-live="polite">
              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div
                    key={question?.id}
                    initial={reduceMotion ? false : { opacity: 0, x: 26 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    data-edit-collection="questions"
                    data-edit-index={currentIndex}
                  >
                    <p className="text-xs font-bold uppercase tracking-[.18em] text-[color:var(--token-card-muted,var(--token-muted))]">
                      {mode === 'score' ? `${currentIndex + 1} von ${questions.length}` : 'Passender nächster Schritt'}
                    </p>
                    <h3 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-[-.04em] text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="label">{question?.label}</h3>
                    {question?.description && <p className="mt-3 max-w-2xl text-base leading-7 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="description">{plain(question.description)}</p>}
                    <div className="mt-8 grid gap-3 sm:grid-cols-2" role="group" aria-label={question?.label}>
                      {question?.answers?.map((answer, index) => (
                        <button key={answer.id || index} type="button" onClick={() => choose(answer)} className="group min-h-24 border-l-2 border-[var(--token-divider)] bg-[var(--token-section-bg)] p-5 text-left transition hover:border-[var(--token-accent)] hover:bg-[var(--token-section-bg-alt)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--token-accent)]" data-edit-collection="answers" data-edit-index={index}>
                          <span className="text-base font-black text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="label">{answer.label}</span>
                          {answer.description && <span className="mt-1 block text-sm leading-5 text-[color:var(--token-card-muted,var(--token-muted))]" data-edit-path="description">{plain(answer.description)}</span>}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.article
                    key={result.id}
                    initial={reduceMotion ? false : { opacity: 0, scale: .97, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    className="grid gap-7 md:grid-cols-[.72fr_1fr]"
                    data-edit-collection="results"
                    data-edit-index={resultIndex}
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-[var(--token-card-radius)] bg-[var(--token-section-bg-alt)]">
                      {result.image ? <img src={result.image} alt="" loading="lazy" className="h-full w-full object-cover" data-edit-image="image" /> : <EmptyVisual label="Empfehlung" />}
                    </div>
                    <div className="self-center">
                      <p className="text-xs font-bold uppercase tracking-[.2em] text-[color:var(--token-eyebrow)]">Beste Übereinstimmung</p>
                      <h3 className="mt-4 text-4xl font-black leading-[.98] tracking-[-.05em] text-[color:var(--token-card-heading,var(--token-heading))]" data-edit-path="title">{result.title}</h3>
                      {result.text && <p className="mt-4 text-base leading-7 text-[color:var(--token-card-body,var(--token-body))]" data-edit-path="text">{plain(result.text)}</p>}
                      {Array.isArray(result.features) && (
                        <ul className="mt-5 space-y-2">
                          {result.features.map((feature, index) => (
                            <li key={index} className="flex gap-2 text-sm text-[color:var(--token-card-body,var(--token-body))]">
                              <Check size={16} className="mt-0.5 shrink-0 text-[color:var(--token-check)]" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                      {href && result.cta?.label && (
                        <a href={href} className="mt-7 inline-flex min-h-11 items-center rounded-[var(--token-button-radius)] bg-[var(--token-btn-bg)] px-5 text-sm font-bold text-[color:var(--token-btn-text)]" data-edit-link="cta">
                          <span data-edit-path="cta.label">{result.cta.label}</span>
                        </a>
                      )}
                    </div>
                  </motion.article>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
