'use client';

import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

type Options<TContainer extends HTMLElement, TInitial extends HTMLElement> = {
  active: boolean;
  containerRef: RefObject<TContainer | null>;
  initialFocusRef?: RefObject<TInitial | null>;
  onEscape: () => void;
};

export function useModalFocusTrap<TContainer extends HTMLElement, TInitial extends HTMLElement>({
  active,
  containerRef,
  initialFocusRef,
  onEscape,
}: Options<TContainer, TInitial>) {
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusInitial = () => {
      const target = initialFocusRef?.current
        ?? container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        ?? container;
      target.focus();
    };
    const animationFrame = window.requestAnimationFrame(focusInitial);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscapeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter(element => !element.hasAttribute('disabled') && element.getClientRects().length > 0);
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;
      if (event.shiftKey && (activeElement === first || !container.contains(activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (activeElement === last || !container.contains(activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus();
    };
  }, [active, containerRef, initialFocusRef]);
}
