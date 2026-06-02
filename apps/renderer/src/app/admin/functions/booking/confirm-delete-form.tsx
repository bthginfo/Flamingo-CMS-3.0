'use client';

import { useState, useTransition } from 'react';
import { Trash2, X } from 'lucide-react';

type ConfirmDeleteFormProps = {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label: string;
  title: string;
  message: string;
};

export function ConfirmDeleteForm({ action, id, label, title, message }: ConfirmDeleteFormProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    const formData = new FormData();
    formData.set('id', id);
    startTransition(async () => {
      await action(formData);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600"
        title={label}
        aria-label={label}
      >
        <Trash2 size={16} />
      </button>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{message}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                aria-label="Dialog schließen"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="admin-btn-secondary">
                Abbrechen
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={pending}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {pending ? 'Wird gelöscht...' : 'Ja, löschen'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
