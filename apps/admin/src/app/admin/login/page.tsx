'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { loginAction } from './actions';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {});
  const router = useRouter();

  useEffect(() => {
    if (state && !state.error && !isPending && state !== null && Object.keys(state).length === 0) {
      // Check if this is after a successful login (empty object returned, no error)
      // Only redirect if we've actually submitted (not initial state)
      router.push('/admin');
    }
  }, [state, isPending, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-admin-accent text-white text-xl font-bold mb-4">
            F
          </div>
          <h1 className="text-xl font-semibold text-zinc-900">Flamingo CMS</h1>
          <p className="text-sm text-zinc-500 mt-1">Admin-Bereich</p>
        </div>

        <form action={formAction} className="admin-card p-6 space-y-4">
          <div>
            <label htmlFor="password" className="admin-label">Passwort</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              className="admin-input"
              placeholder="Admin-Passwort eingeben"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>
          )}

          <button type="submit" disabled={isPending} className="admin-btn-primary w-full">
            {isPending ? 'Wird geprüft…' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  );
}
