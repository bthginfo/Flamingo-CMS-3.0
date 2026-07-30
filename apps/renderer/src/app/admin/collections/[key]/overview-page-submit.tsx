'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export function OverviewPageSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="admin-btn-primary min-w-[13.5rem] w-full whitespace-nowrap"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          <span>Wird geöffnet …</span>
        </>
      ) : (
        <>
          <span>Übersichtsseite gestalten</span>
          <ArrowRight size={16} aria-hidden="true" />
        </>
      )}
    </button>
  );
}
