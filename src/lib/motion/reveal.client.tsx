'use client';

import { useRef, type ReactNode } from 'react';
import { useScrollScene } from './use-scroll-scene';
import { REVEAL_FROM } from './tokens';

/** After init, anything still pending above the fold is shown regardless (ms). */
const FAILSAFE_MS = 3000;
/**
 * A viewport this tall is a full-page render (a crawler or capture tool that
 * stretches the viewport instead of scrolling), not a person: show everything.
 */
const TALL_VIEWPORT = 2400;

/**
 * Batch reveal for below-fold groups (spec §4.5). Items are the wrapper's
 * children unless `selector` is given. Only items below the fold at init get
 * the from-state, so server HTML (and no-JS) always shows everything.
 *
 * The from-state is opacity + transform only (never `visibility`), so pending
 * items stay in the tab order and accessibility tree. A focused pending item,
 * and any pending item that ends up above the fold without a scroll (refresh,
 * resize), is shown at once; a stretched full-page viewport shows them all.
 */
export function RevealGroup({ selector, stagger = 0.06, children }: { selector?: string; stagger?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollScene(ref, ({ gsap, ScrollTrigger, scope }) => {
    const items = selector ? gsap.utils.toArray<HTMLElement>(selector, scope) : (Array.from(scope.children) as HTMLElement[]);
    const vh = window.innerHeight;
    if (vh > TALL_VIEWPORT) return;
    const pending = new Set(items.filter((el) => el.getBoundingClientRect().top > vh));
    if (!pending.size) return;
    gsap.set([...pending], REVEAL_FROM);

    const settle = (els: HTMLElement[]) => {
      els.forEach((el) => pending.delete(el));
      return els;
    };
    const showNow = (els: HTMLElement[]) => {
      if (!els.length) return;
      gsap.killTweensOf(els);
      gsap.set(settle(els), { clearProps: 'transform,opacity' });
    };
    const showAboveFold = () =>
      showNow(window.innerHeight > TALL_VIEWPORT ? [...pending] : [...pending].filter((el) => el.getBoundingClientRect().top < window.innerHeight));

    ScrollTrigger.batch([...pending], {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => {
        const els = settle((batch as HTMLElement[]).filter((el) => el.isConnected));
        if (els.length) gsap.to(els, { y: 0, scale: 1, opacity: 1, stagger, overwrite: true, clearProps: 'transform,opacity' });
      },
    });

    const onFocus = (e: FocusEvent) => {
      const hit = [...pending].find((el) => el.contains(e.target as Node));
      if (hit) showNow([hit]);
    };
    scope.addEventListener('focusin', onFocus, true);
    ScrollTrigger.addEventListener('refresh', showAboveFold);
    window.addEventListener('resize', showAboveFold);
    const failsafe = window.setTimeout(showAboveFold, FAILSAFE_MS);

    return () => {
      scope.removeEventListener('focusin', onFocus, true);
      ScrollTrigger.removeEventListener('refresh', showAboveFold);
      window.removeEventListener('resize', showAboveFold);
      window.clearTimeout(failsafe);
    };
  });
  return (
    <div ref={ref} data-reveal-group="">
      {children}
    </div>
  );
}
