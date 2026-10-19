'use client';

import { useRef, useState, useEffect, useCallback, type CSSProperties, type KeyboardEvent } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PremiumSectionHeader } from '@/templates/shared/section-primitives';

type GalleryImage = { src: string; alt?: string; caption?: string; width?: number; height?: number };
type Props = { data: Record<string, unknown>; variant?: string | null };

// The production light-section rules also reach this dialog through its ancestor.
const inverseCardForegroundTokens = {
  '--token-card-heading': 'var(--token-on-dark-heading)',
  '--token-card-body': 'var(--token-on-dark-body)',
  '--token-card-muted': 'var(--token-on-dark-muted)',
} as CSSProperties;

export function GalleryGridSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const images = ((data.images as GalleryImage[]) || []).filter(image => image.src);
  const columns = Math.max(1, Math.min(4, Number(data.columns) || 3));
  const [lightbox, setLightbox] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useCallback((dir: 1 | -1) => {
    setLightbox(prev => prev !== null ? (prev + dir + images.length) % images.length : null);
  }, [images.length]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || lightbox === null) return;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [lightbox]);

  function close() {
    dialogRef.current?.close();
    setLightbox(null);
  }
  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'ArrowRight') navigate(1);
    if (event.key === 'ArrowLeft') navigate(-1);
  }

  if (!images.length) return null;
  const columnClass = columns === 1 ? 'columns-1' : columns === 2 ? 'columns-1 sm:columns-2' : columns === 4 ? 'columns-1 sm:columns-2 lg:columns-4' : 'columns-1 sm:columns-2 lg:columns-3';
  const active = lightbox === null ? null : images[lightbox];

  return <div>
    <PremiumSectionHeader headline={headline} subline={subline} />
    <div className={`${columnClass} gap-5 md:gap-7`}>
      {images.map((image, index) => <figure key={`${image.src}-${index}`} className="mb-6 break-inside-avoid" data-edit-collection="images" data-edit-index={index}>
        <button type="button" onClick={() => setLightbox(index)} aria-label={`${image.alt || image.caption || 'Bild'} vergrößern`} className="group block w-full overflow-hidden rounded-[var(--token-card-radius)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--token-icon)]">
          <img data-edit-image="src" src={image.src} alt={image.alt || ''} width={image.width || undefined} height={image.height || undefined} loading="lazy" className="block h-auto max-h-[620px] w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]" />
        </button>
        {image.caption && <figcaption className="pt-3 text-sm leading-6 text-[color:var(--token-body)]" data-edit-path="caption">{image.caption}</figcaption>}
      </figure>)}
    </div>
    <dialog data-color-context="dark" style={inverseCardForegroundTokens} ref={dialogRef} aria-label="Bildansicht" onClose={() => setLightbox(null)} onKeyDown={onKeyDown} onClick={event => { if (event.target === event.currentTarget) close(); }} className="fixed inset-0 m-auto h-full max-h-none w-full max-w-none bg-black/95 p-5 text-[color:var(--token-on-dark-heading)] backdrop:bg-black/70">
      {active && <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center">
        <button type="button" onClick={close} aria-label="Bildansicht schließen" autoFocus className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-black/60 text-[color:var(--token-on-dark-heading)] outline-offset-4 hover:bg-white/20 focus-visible:outline focus-visible:outline-2"><X size={24} /></button>
        <img src={active.src} alt={active.alt || ''} className="max-h-[77vh] max-w-full object-contain" />
        <div className="mt-5 flex max-w-full items-center justify-center gap-6">
          {images.length > 1 && <button type="button" aria-label="Vorheriges Bild" onClick={() => navigate(-1)} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--token-card-border)] bg-black/60 text-[color:var(--token-on-dark-heading)] hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"><ChevronLeft size={24} /></button>}
          <div className="text-center text-sm leading-6 text-[color:var(--token-on-dark-body)]">{active.caption && <p className="text-[color:var(--token-on-dark-body)]">{active.caption}</p>}<p className="tabular-nums text-[color:var(--token-on-dark-muted)]">{(lightbox || 0) + 1} / {images.length}</p></div>
          {images.length > 1 && <button type="button" aria-label="Nächstes Bild" onClick={() => navigate(1)} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--token-card-border)] bg-black/60 text-[color:var(--token-on-dark-heading)] hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"><ChevronRight size={24} /></button>}
        </div>
      </div>}
    </dialog>
  </div>;
}
