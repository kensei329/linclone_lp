'use client';

import { useEffect, useRef, type RefObject } from 'react';
import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import { loadMotion, requestRefresh } from './load';
import { MQ_DESKTOP } from './policy';

export type SceneCtx = {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
  scope: HTMLElement;
  q: (sel: string) => HTMLElement[];
  isDesktop: boolean;
  lite: boolean;
  /** true when the scope's top was below the viewport when the page initialised */
  belowFold: boolean;
};

export type ScrollSceneOptions = {
  /** default '100% 0px' (initialise one viewport ahead) */
  rootMargin?: string;
  /** default 'run' (ctx.lite = true); 'skip' does nothing in lite mode */
  lite?: 'run' | 'skip';
};

/**
 * The only way section code touches GSAP (spec §4.5). When the scope comes
 * within `rootMargin`, GSAP is loaded and `setup` runs inside a gsap.context
 * + matchMedia, never under prefers-reduced-motion. Everything is reverted on
 * unmount or when the media conditions change.
 */
export function useScrollScene(
  scope: RefObject<HTMLElement | null>,
  setup: (ctx: SceneCtx) => void | (() => void),
  opts?: ScrollSceneOptions,
): void {
  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  });
  const rootMargin = opts?.rootMargin ?? '100% 0px';
  const litePolicy = opts?.lite ?? 'run';

  useEffect(() => {
    const el = scope.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const lite = document.documentElement.hasAttribute('data-lite');
    if (lite && litePolicy === 'skip') return;

    const belowFold = el.getBoundingClientRect().top > window.innerHeight;
    let disposed = false;
    let ctx: ReturnType<typeof GsapType.context> | undefined;
    let mm: ReturnType<typeof GsapType.matchMedia> | undefined;

    const init = async () => {
      const { gsap, ScrollTrigger } = await loadMotion();
      if (disposed) return;
      ctx = gsap.context(() => {
        mm = gsap.matchMedia();
        // gsap.matchMedia only runs the handler when at least one condition
        // matches, so `any` keeps it running on every viewport.
        mm.add({ isDesktop: MQ_DESKTOP, reduce: '(prefers-reduced-motion: reduce)', any: 'all' }, (c) => {
          const { isDesktop, reduce } = c.conditions as { isDesktop: boolean; reduce: boolean };
          if (reduce) return;
          return setupRef.current({
            gsap,
            ScrollTrigger,
            scope: el,
            q: (sel) => gsap.utils.toArray<HTMLElement>(sel, el),
            isDesktop,
            lite,
            belowFold,
          });
        });
      }, el);
      requestRefresh();
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        void init();
      },
      { rootMargin },
    );
    io.observe(el);

    return () => {
      disposed = true;
      io.disconnect();
      mm?.revert();
      ctx?.revert();
    };
  }, [scope, rootMargin, litePolicy]);
}
