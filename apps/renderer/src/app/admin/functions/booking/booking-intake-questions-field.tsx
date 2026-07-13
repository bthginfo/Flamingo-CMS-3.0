'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { StringListField } from '@/components/string-list-field';

type IntakeQuestionDraft = { label: string; required: boolean; options: string[] };

export function BookingIntakeQuestionsField({ initialValue }: { initialValue?: unknown }) {
  const [questions, setQuestions] = useState<IntakeQuestionDraft[]>(() => questionsFromValue(initialValue));

  function update(index: number, patch: Partial<IntakeQuestionDraft>) {
    setQuestions(current => current.map((question, questionIndex) => questionIndex === index ? { ...question, ...patch } : question));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= questions.length) return;
    const next = [...questions];
    [next[index], next[target]] = [next[target], next[index]];
    setQuestions(next);
  }

  return (
    <fieldset className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 md:col-span-2">
      <legend className="px-1 text-xs font-semibold text-zinc-700">Zusatzfragen optional</legend>
      <input type="hidden" name="intakeQuestions" value={serializeQuestions(questions)} />
      {questions.length === 0 ? <p className="px-1 py-2 text-xs text-zinc-400">Noch keine Zusatzfragen hinzugefügt.</p> : (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div key={index} className="rounded-xl border border-zinc-200 bg-white p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-zinc-500">Frage {index + 1}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-25" aria-label={`Frage ${index + 1} nach oben`}><ArrowUp size={14} /></button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === questions.length - 1} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-25" aria-label={`Frage ${index + 1} nach unten`}><ArrowDown size={14} /></button>
                  <button type="button" onClick={() => setQuestions(current => current.filter((_, questionIndex) => questionIndex !== index))} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-red-400 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" aria-label={`Frage ${index + 1} entfernen`}><Trash2 size={14} /></button>
                </div>
              </div>
              <label className="block">
                <span className="admin-label">Frage</span>
                <input className="admin-input" value={question.label} onChange={(event) => update(index, { label: event.target.value })} placeholder="z. B. Gibt es Allergien oder Wünsche?" />
              </label>
              <label className="my-3 flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" checked={question.required} onChange={(event) => update(index, { required: event.target.checked })} /> Pflichtfeld
              </label>
              <StringListField label="Antwortoptionen optional" value={question.options} onChange={(options) => update(index, { options })} placeholder="z. B. Innenbereich" addLabel="Option hinzufügen" emptyText="Ohne Optionen antworten Kund:innen mit Freitext." maxItems={12} />
            </div>
          ))}
        </div>
      )}
      <button type="button" onClick={() => setQuestions(current => [...current, { label: '', required: false, options: [] }])} className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-blue-700 hover:border-blue-200 hover:bg-blue-50">
        <Plus size={14} /> Frage hinzufügen
      </button>
    </fieldset>
  );
}

function questionsFromValue(value: unknown): IntakeQuestionDraft[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(item => {
    if (!item || typeof item !== 'object') return [];
    const question = item as { label?: unknown; required?: unknown; options?: unknown };
    const label = typeof question.label === 'string' ? question.label : '';
    const options = Array.isArray(question.options)
      ? question.options.filter((option): option is string => typeof option === 'string')
      : [];
    return [{ label, required: Boolean(question.required), options }];
  });
}

function serializeQuestions(questions: IntakeQuestionDraft[]) {
  return questions.map(question => {
    const label = cleanPart(question.label);
    const options = question.options.map(option => cleanPart(option).replace(/,/g, ' ')).filter(Boolean);
    return `${label}${question.required ? ' *' : ''}${options.length ? ` | ${options.join(', ')}` : ''}`;
  }).filter(line => line.replace(/[|*,\s]/g, '')).join('\n');
}

function cleanPart(value: string) {
  return value.replace(/[|\r\n]/g, ' ').trim();
}
