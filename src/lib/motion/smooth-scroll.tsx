'use client';

import { useEffect, useSyncExternalStore } from 'react';
import type Lenis from 'lenis';
import { loadMotion } from './load';

// Lenis smooth scroll (spec §4.5). Created lazily on the first interaction or
// on idle, so neither Lenis nor GSAP is in the initial JS. Never created under
// reduced motion or lite mode (native scroll then).

declare global {
  interface Window {
    __lcLenis?: Lenis;
  }
}

let current: Lenis | null = null;
const subscribers = new Set<() => void>();
function setCurrent(l: Lenis | null) {
  current = l;
  if (l) window.__lcLenis = l;
  else delete window.__lcLenis;
  subscribers.forEach((fn) => fn());
}
const subscribe = (fn: () => void) => {
  subscribers.add(fn);
  return () => void subscribers.delete(fn);
};

const START_EVENTS = ['wheel', 'pointerdown', 'keydown', 'touchstart'] as const;

/** Mounted once in the (site) layout. */
export function SmoothScroll(): null {
  useEffect(() => {
    const html = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || html.hasAttribute('data-lite')) return;

    let disposed = false;
    let started = false;
    let teardown: (() => void) | undefined;
    const ric = 'requestIdleCallback' in window;
    const cancelIdle = () => {
      if (ric) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };

    const start = () => {
      if (started) return;
      started = true;
      START_EVENTS.forEach((t) => window.removeEventListener(t, start));
      cancelIdle();
      void Promise.all([import('lenis'), loadMotion()]).then(([{ default: LenisCtor }, { gsap, ScrollTrigger }]) => {
        if (disposed) return;
        const lenis = new LenisCtor({
          autoRaf: false,
          lerp: 0.1,
          smoothWheel: true,
          syncTouch: false,
          anchors: { offset: -72 },
          stopInertiaOnNavigate: true,
        });
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        setCurrent(lenis);
        teardown = () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
          setCurrent(null);
        };
      });
    };

    START_EVENTS.forEach((t) => window.addEventListener(t, start, { passive: true, once: true }));
    const idle = ric ? window.requestIdleCallback(start, { timeout: 2500 }) : window.setTimeout(start, 2500);

    return () => {
      disposed = true;
      START_EVENTS.forEach((t) => window.removeEventListener(t, start));
      cancelIdle();
      teardown?.();
    };
  }, []);
  return null;
}

/** The live Lenis instance, or null (not yet created, reduced motion, lite). */
export function useLenis(): Lenis | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}

/** Scrolls to an element id through Lenis when present, natively otherwise. */
export function scrollToId(id: string): void {
  const el = document.getElementById(id.replace(/^#/, ''));
  if (!el) return;
  const lenis = window.__lcLenis;
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
