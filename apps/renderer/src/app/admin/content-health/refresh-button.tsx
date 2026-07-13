'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function RefreshContentHealthButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      className="admin-btn-secondary min-h-10"
      disabled={pending}
      onClick={() => {
        setPending(true);
        router.refresh();
        window.setTimeout(() => setPending(false), 700);
      }}
    >
      <RefreshCw size={16} className={pending ? 'animate-spin' : ''} />
      {pending ? 'Prüft…' : 'Neu prüfen'}
    </button>
  );
}
