'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getProvider } from '@/lib/embed-providers';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

/** Sanitize standard embed code — only allow iframe tags */
function sanitizeEmbedCode(html: string): string | null {
  if (!html) return null;
  const match = html.match(/<iframe\s[^>]*src=["']([^"']+)["'][^>]*>[\s\S]*?<\/iframe>/i)
    || html.match(/<iframe\s[^>]*src=["']([^"']+)["'][^>]*\/>/i);
  if (!match) return null;
  // Return only a safe iframe with the extracted src
  return match[1];
}

export function EmbedSection({ data }: Props) {
  const headline = (data.headline as string) || '';
  const subline = (data.subline as string) || '';
  const mode = (data.mode as string) || 'preset';
  const provider = (data.provider as string) || '';
  const config = (data.config as Record<string, string>) || {};
  const embedCode = (data.embedCode as string) || '';
  const height = (data.height as number) || 500;
  const maxWidth = (data.maxWidth as string) || '100%';

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Determine iframe URL
  let iframeSrc: string | null = null;
  let iframeTitle = 'Embed';

  if (mode === 'preset' && provider) {
    const p = getProvider(provider);
    if (p) {
      iframeSrc = p.buildUrl(config);
      iframeTitle = p.label;
    }
  } else if (mode === 'standard' && embedCode) {
    iframeSrc = sanitizeEmbedCode(embedCode);
    iframeTitle = 'External Embed';
  }

  return (
    <div ref={ref}>
      {(headline || subline) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          {headline && <h2 className="section-headline">{headline}</h2>}
          {subline && <div className="section-subline max-w-3xl mx-auto rt-content" dangerouslySetInnerHTML={{ __html: subline }} />}
        </motion.div>
      )}

      {iframeSrc ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full mx-auto rounded-xl overflow-hidden shadow-lg"
          style={{ maxWidth, height: `${height}px` }}
        >
          <iframe
            src={iframeSrc}
            title={iframeTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; payment"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
          />
        </motion.div>
      ) : (
        <p className="text-center text-sm text-zinc-400">Kein Embed konfiguriert. Bitte im Editor einen Anbieter auswählen oder Embed-Code einfügen.</p>
      )}
    </div>
  );
}
