'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ImageUploadField } from '@/components/image-upload-field';

const previewImage = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221200%22 height=%22675%22%3E%3Crect width=%221200%22 height=%22675%22 fill=%22%23e4e4e7%22/%3E%3Ccircle cx=%22600%22 cy=%22320%22 r=%22150%22 fill=%22%2393c5fd%22/%3E%3C/svg%3E';

function MediaFieldPreview() {
  const [value, setValue] = useState(previewImage);
  const [position, setPosition] = useState('center');
  return (
    <main className="min-h-screen bg-zinc-100 p-4 sm:p-8">
      <div className="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h1 className="text-lg font-semibold text-zinc-900">Hauptbild</h1>
        <p className="mb-5 mt-1 text-xs text-zinc-500">Vorschau, Fokuspunkt und Mediathek ohne Server- oder Datenbankabhängigkeit.</p>
        <ImageUploadField label="Hauptbild" value={value} onChange={setValue} position={position} onPositionChange={setPosition} loadLibrary={async () => []} />
      </div>
    </main>
  );
}

const meta = {
  title: 'Admin/Media Field',
  component: MediaFieldPreview,
  parameters: { layout: 'fullscreen', a11y: { test: 'error' } },
} satisfies Meta<typeof MediaFieldPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PreviewAndFocalPoint: Story = {};
export const LibraryModal: Story = {
  play: async ({ canvasElement }) => {
    const button = Array.from(canvasElement.querySelectorAll('button')).find((candidate) => candidate.textContent?.includes('Mediathek'));
    if (!button) throw new Error('Mediathek-Schaltfläche fehlt.');
    button.click();
    await new Promise((resolve) => window.setTimeout(resolve, 50));
    if (!document.querySelector('[role="dialog"][aria-modal="true"]')) throw new Error('Mediathek-Dialog wurde nicht geöffnet.');
  },
};
