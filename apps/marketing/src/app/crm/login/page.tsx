'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { loginAction } from './actions';

export default function CrmLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {});
  const router = useRouter();

  useEffect(() => {
    if (state && !state.error && !isPending && Object.keys(state).length === 0) {
      router.push('/crm');
    }
  }, [state, isPending, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white text-2xl font-bold mb-4 shadow-lg shadow-indigo-200">
            F
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Flamingo CRM</h1>
          <p className="text-sm text-slate-500 mt-1">Tenant-Management & Provisioning</p>
        </div>

        <form action={formAction} className="crm-card p-6 space-y-4 shadow-sm">
          <div>
            <label htmlFor="password" className="crm-label">Master-Passwort</label>
            <input
              id="password"
              name="password"
              type="password"
              autoFocus
              required
              className="crm-input"
              placeholder="CRM-Passwort eingeben"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>
          )}

          <button type="submit" disabled={isPending} className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50">
            {isPending ? 'Wird geprüft…' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  );
}
