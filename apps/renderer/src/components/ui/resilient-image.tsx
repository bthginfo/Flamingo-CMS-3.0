'use client';

import { useState, type ImgHTMLAttributes } from 'react';
import Image, { type ImageProps } from 'next/image';

type Props = ImgHTMLAttributes<HTMLImageElement> & { fallbackClassName?: string };

export function ResilientImage({ alt = '', className = '', fallbackClassName = '', onError, ...props }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt ? `${alt} – Bild aktuell nicht verfügbar` : undefined}
        aria-hidden={alt ? undefined : true}
        className={`${className} ${fallbackClassName} grid place-items-center bg-[radial-gradient(circle_at_28%_20%,color-mix(in_srgb,var(--token-accent)_18%,transparent),transparent_46%),linear-gradient(145deg,var(--token-section-bg-alt),var(--token-card-bg))]`}
      >
        {alt ? <span className="max-w-48 px-4 text-center text-[10px] font-bold uppercase tracking-[.14em] text-[color:var(--token-muted)]">Bild aktuell nicht verfügbar</span> : null}
      </div>
    );
  }
  return <img {...props} alt={alt} className={className} onError={(event) => { setFailed(true); onError?.(event); }} />;
}

export function ResilientNextImage({ alt = '', className = '', onError, fill, style, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt ? `${alt} – Bild aktuell nicht verfügbar` : undefined}
        aria-hidden={alt ? undefined : true}
        className={`${className} grid place-items-center bg-[radial-gradient(circle_at_28%_20%,color-mix(in_srgb,var(--token-accent)_18%,transparent),transparent_46%),linear-gradient(145deg,var(--token-section-bg-alt),var(--token-card-bg))]`}
        style={fill ? { ...style, position: 'absolute', inset: 0, width: '100%', height: '100%' } : style}
      >
        {alt ? <span className="max-w-48 px-4 text-center text-[10px] font-bold uppercase tracking-[.14em] text-[color:var(--token-muted)]">Bild aktuell nicht verfügbar</span> : null}
      </div>
    );
  }
  return <Image {...props} fill={fill} alt={alt} className={className} style={style} onError={(event) => { setFailed(true); onError?.(event); }} />;
}
