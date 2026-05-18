'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

/**
 * Enhanced Image component with automatic blur-up loading effect.
 * Uses a CSS blur that fades out once the image loads.
 * No external blur hash needed — pure CSS technique.
 */
export function BlurImage({ className = '', style, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
      className={`${className} transition-all duration-700 ${loaded ? '' : 'scale-[1.02] blur-sm'}`}
      style={style}
      onLoad={(e) => {
        setLoaded(true);
        if (typeof onLoad === 'function') onLoad(e);
      }}
    />
  );
}
