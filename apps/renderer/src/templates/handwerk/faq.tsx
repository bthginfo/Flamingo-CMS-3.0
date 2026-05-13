'use client';

import { useState } from 'react';

type Props = { data: Record<string, unknown>; variant?: string | null };

export function FaqSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const items = (data.items as { question: string; answer: string }[]) || [];
  const expandFirst = data.expandFirst !== false;

  return (
    <div>
      {headline && <h2 className="text-3xl font-bold text-center mb-8">{headline}</h2>}
      <div className="max-w-3xl mx-auto space-y-3">
        {items.map((item, i) => (
          <FaqItem key={i} question={item.question} answer={item.answer} defaultOpen={expandFirst && i === 0} />
        ))}
      </div>
    </div>
  );
}

function FaqItem({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-6 py-4 font-semibold flex justify-between items-center hover:bg-gray-50">
        {question}
        <span className="text-gray-400">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-6 pb-4 text-gray-600">{answer}</div>}
    </div>
  );
}
