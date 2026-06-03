'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Samples the top region of the page (where the nav sits) to determine
 * if the background is dark or light, using canvas pixel analysis.
 * Returns true if the background behind the header is dark.
 */
export function useHeaderContrast(initialDark: boolean): boolean {
  const [isDark, setIsDark] = useState(initialDark);

  const sampleImage = useCallback((img: HTMLImageElement) => {
    try {
      const canvas = document.createElement('canvas');
      // Sample a representative strip at the top (where nav sits)
      const sampleHeight = 80;
      const scale = Math.min(1, 200 / img.naturalWidth);
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(sampleHeight * scale);

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Draw only the top portion of the image
      ctx.drawImage(
        img,
        0, 0, img.naturalWidth, sampleHeight, // source rect
        0, 0, canvas.width, canvas.height     // dest rect
      );

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let totalLuminance = 0;
      const pixelCount = pixels.length / 4;

      for (let i = 0; i < pixels.length; i += 4) {
        // Relative luminance approximation
        totalLuminance += (0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]) / 255;
      }

      const avgLuminance = totalLuminance / pixelCount;
      // Account for typical overlay (most heroes have 50-70% dark overlay)
      // If raw image luminance < 0.6, with overlay it'll definitely be dark
      setIsDark(avgLuminance < 0.65);
    } catch {
      // CORS or other error — stick with initial assumption
    }
  }, []);

  const analyze = useCallback(() => {
    const main = document.querySelector('main');
    if (!main) return;
    const firstSection = main.querySelector('section');
    if (!firstSection) return;

    const img = firstSection.querySelector('img[sizes="100vw"], img[data-nimg]') as HTMLImageElement | null;
    if (img) {
      if (img.complete && img.naturalWidth > 0) {
        sampleImage(img);
      } else {
        img.addEventListener('load', () => sampleImage(img), { once: true });
      }
      return;
    }

    const checkBg = (el: Element): boolean => {
      const bg = getComputedStyle(el).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        const rgb = bg.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const luminance = (0.299 * +rgb[0] + 0.587 * +rgb[1] + 0.114 * +rgb[2]) / 255;
          setIsDark(luminance < 0.5);
          return true;
        }
      }
      return false;
    };

    if (checkBg(firstSection)) return;
    const firstChild = firstSection.firstElementChild;
    if (firstChild) checkBg(firstChild);
  }, [sampleImage]);

  useEffect(() => {
    // Small delay to ensure DOM is rendered
    const timer = setTimeout(analyze, 100);

    // Re-analyze when the hero section changes (e.g. style switch replaces the hero DOM)
    const main = document.querySelector('main');
    const firstSection = main?.querySelector('section');
    if (!firstSection) return () => clearTimeout(timer);

    const observer = new MutationObserver(() => {
      setTimeout(analyze, 150);
    });
    observer.observe(firstSection, { childList: true, subtree: false, attributes: true, attributeFilter: ['class', 'style'] });

    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [analyze]);

  return isDark;
}
