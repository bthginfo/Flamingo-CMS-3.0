'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EditorActionBar } from '@/app/admin/editor/editor-action-bar';
import { EditorWorkspaceShell } from '@/app/admin/editor/editor-workspace-shell';

function WorkspacePreview({ collection = false }: { collection?: boolean }) {
  const [saved, setSaved] = useState(false);
  return (
    <EditorWorkspaceShell>
      <main className="min-h-screen bg-zinc-100 p-4 sm:p-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">{collection ? 'Collection-Eintrag' : 'Seite'}</p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-900">Redaktioneller Workspace</h1>
          <div className="mt-6 space-y-3">
            {['Editorial Hero', 'Leistungen', 'Referenzen', 'Kontakt'].map((title, index) => (
              <section key={title} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-zinc-900">{title}</p>
                <p className="mt-1 text-xs text-zinc-500">{index + 2}/4 Inhaltsbereiche ausgefüllt</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-medium text-zinc-600">Überschrift<input className="admin-input mt-1" defaultValue={index === 0 ? 'Ein klarer Auftritt für Ihr Unternehmen' : title} /></label>
                  <label className="text-xs font-medium text-zinc-600">Dachzeile<input className="admin-input mt-1" defaultValue="Flamingo CMS" /></label>
                </div>
              </section>
            ))}
            <label data-testid="workspace-last-field" className="block rounded-xl border border-zinc-200 bg-white p-4 text-xs font-medium text-zinc-600">Letztes Feld<textarea className="admin-input mt-1 min-h-28" defaultValue="Dieser Inhalt muss vollständig oberhalb der Aktionsleiste erreichbar bleiben." /></label>
          </div>
        </div>
      </main>
      <EditorActionBar previewOpen={false} saved={saved} saving={false} onTogglePreview={() => {}} onSave={() => setSaved(true)} />
    </EditorWorkspaceShell>
  );
}

const meta = {
  title: 'Admin/Editorial Workspace',
  component: WorkspacePreview,
  parameters: { layout: 'fullscreen', a11y: { test: 'error' } },
} satisfies Meta<typeof WorkspacePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageEditor: Story = {};
export const CollectionEditor: Story = { args: { collection: true } };
