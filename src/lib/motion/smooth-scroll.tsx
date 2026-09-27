'use client';

import type Lenis from 'lenis';

// STUB (WP0a): final exports per spec §4.5. WP0b lazy-creates Lenis on first
// interaction / idle and wires it to the GSAP ticker; until then scrolling is
// native.

declare global {
  interface Window {
    __lcLenis?: Lenis;
  }
}

/** Mounted once in the (site) layout. */
export function SmoothScroll(): null {
  return null;
}

export function useLenis(): Lenis | null {
  return null;
}

export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = window.__lcLenis;
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView({ behavior: 'smooth' });
}
