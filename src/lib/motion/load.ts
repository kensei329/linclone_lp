'use client';

import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

// GSAP is never in the initial bundle: every animator goes through this
// memoised dynamic import (spec §4.5).

export type Motion = { gsap: typeof GsapType; ScrollTrigger: typeof ScrollTriggerType };

let pending: Promise<Motion> | null = null;

export function loadMotion(): Promise<Motion> {
  pending ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
    const { gsap } = g;
    const { ScrollTrigger } = st;
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: 0.42 });
    ScrollTrigger.config({ ignoreMobileResize: true });
    return { gsap, ScrollTrigger };
  });
  return pending;
}

let refreshTimer: ReturnType<typeof setTimeout> | undefined;

/** Debounced ScrollTrigger.refresh() (120ms), for lazy inits and font loads. */
export function requestRefresh(): void {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    void loadMotion().then(({ ScrollTrigger }) => ScrollTrigger.refresh());
  }, 120);
}
