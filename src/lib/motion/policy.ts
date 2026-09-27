'use client';

import { useSyncExternalStore } from 'react';

// Motion policy helpers (spec §4.5). Pure hooks; no GSAP.

export const MQ_DESKTOP = '(min-width: 1024px)';
const MQ_REDUCE = '(prefers-reduced-motion: reduce)';

function subscribeMedia(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  };
}
const subscribeReduce = subscribeMedia(MQ_REDUCE);

/** True when the visitor asks for reduced motion. Server snapshot: false. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(MQ_REDUCE).matches,
    () => false,
  );
}

const noopSubscribe = () => () => {};

/** Lite mode is decided once by the head script (`html[data-lite]`). */
export function useLite(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => document.documentElement.hasAttribute('data-lite'),
    () => false,
  );
}

/** LINE, Instagram, Facebook, X, TikTok in-app browsers (set by the head script). */
export function isInAppBrowser(): boolean {
  return typeof document !== 'undefined' && document.documentElement.hasAttribute('data-inapp');
}
