'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type Props = { data: Record<string, unknown>; variant?: string | null; styleVariant?: string };

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  // Already an embed URL
  if (url.includes('/embed/') || url.includes('player.vimeo.com')) return url;
  return null;
}

export function VideoEmbedSection({ data }: Props) {
  const badge = (data.badge as string) || '';
  const headline = (data.headline as string) || '';
  const text = (data.text as string) || '';
  const videoUrl = (data.videoUrl as string) || '';
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        {badge && <span className="section-badge" data-edit-path="badge">{badge}</span>}
        {headline && <h2 className="section-headline" data-edit-path="headline">{headline}</h2>}
        {text && <div className="section-subline max-w-3xl mx-auto rt-content" data-edit-rich="text" dangerouslySetInnerHTML={{ __html: text }} />}
      </motion.div>

      {embedUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-lg"
        >
          <iframe
            src={embedUrl}
            title={headline || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </motion.div>
      )}

      {!embedUrl && videoUrl && (
        <p className="text-center text-sm text-zinc-400">Ungültiger Video-Link. Bitte einen YouTube- oder Vimeo-Link einfügen.</p>
      )}
    </div>
  );
}
