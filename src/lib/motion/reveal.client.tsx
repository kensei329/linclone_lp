'use client';

import { useRef, type ReactNode } from 'react';
import { useScrollScene } from './use-scroll-scene';
import { REVEAL_FROM } from './tokens';

/**
 * Batch reveal for below-fold groups (spec §4.5). Items are the wrapper's
 * children unless `selector` is given. Only items below the fold at init get
 * the from-state, so server HTML (and no-JS) always shows everything.
 */
export function RevealGroup({ selector, stagger = 0.06, children }: { selector?: string; stagger?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollScene(ref, ({ gsap, ScrollTrigger, scope }) => {
    const items = selector ? gsap.utils.toArray<HTMLElement>(selector, scope) : (Array.from(scope.children) as HTMLElement[]);
    const vh = window.innerHeight;
    const pending = items.filter((el) => el.getBoundingClientRect().top > vh);
    if (!pending.length) return;
    gsap.set(pending, REVEAL_FROM);
    ScrollTrigger.batch(pending, {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, { y: 0, scale: 1, autoAlpha: 1, stagger, overwrite: true });
      },
    });
  });
  return (
    <div ref={ref} data-reveal-group="">
      {children}
    </div>
  );
}
