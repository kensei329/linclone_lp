'use client';

import type { RefObject } from 'react';
import type { gsap } from 'gsap';
import { requestRefresh } from './load';
import { useScrollScene, type SceneCtx } from './use-scroll-scene';

export type ExpandStageOptions = {
  direction: 'expand' | 'collapse';
  /** progress window for the clip, e.g. [0.06, 0.40] */
  clip: [number, number];
  /** default 0.5 */
  scrub?: number;
  /** default [0.06, 0.30]; false keeps colours (surfaceEnd 'studio' or already night) */
  introToNight?: [number, number] | false;
  /** section beats, positioned by progress (timeline duration = 1) */
  extend?: (tl: gsap.core.Timeline, ctx: SceneCtx) => void;
};

export type StageEventDetail = { id: string; active: boolean };

const FULL = 'inset(0px 0px 0px 0px round 0px)';

/** `clip-path: inset()` that crops `media` to the phone-screen rect. */
function insetFromRect(phone: DOMRect, media: DOMRect, radius: number): string {
  const t = phone.top - media.top;
  const r = media.right - phone.right;
  const b = media.bottom - phone.bottom;
  const l = phone.left - media.left;
  return `inset(${t}px ${r}px ${b}px ${l}px round ${radius}px)`;
}

/**
 * Scroll-expand (or reverse-collapse) timeline for an `ExpandStage` (spec §4.4).
 * The stage is a CSS sticky child with a reserved svh height: no pin, no
 * pin-spacer. One timeline of duration 1, so positions equal progress.
 */
export function useExpandStage(scope: RefObject<HTMLElement | null>, opts: ExpandStageOptions): void {
  useScrollScene(scope, (ctx) => {
    const { gsap, scope: root, isDesktop, lite } = ctx;
    const one = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel);
    const media = one('[data-stage-media]');
    const inner = one('[data-stage-inner]');
    const phone = one('[data-stage-phone]');
    const bezel = one('[data-stage-bezel]');
    const bgStart = one('[data-stage-bg="start"]');
    const intro = one('[data-stage-intro]');
    if (!media || !phone) return;

    const expand = opts.direction === 'expand';
    const [c0, c1] = opts.clip;
    const span = Math.max(c1 - c0, 0.001);
    const introWin = opts.introToNight === undefined ? ([0.06, 0.3] as [number, number]) : opts.introToNight;

    // Mobile: the phone sits under the intro; keep --intro-h (intro bottom) measured.
    let ro: ResizeObserver | undefined;
    if (intro && !isDesktop) {
      const measure = () => root.style.setProperty('--intro-h', `${Math.ceil(intro.offsetTop + intro.offsetHeight)}px`);
      measure();
      ro = new ResizeObserver(() => {
        measure();
        requestRefresh();
      });
      ro.observe(intro);
    }

    const radius = () => parseFloat(getComputedStyle(root).getPropertyValue('--r')) || (isDesktop ? 44 : 36);
    const atPhone = () => insetFromRect(phone.getBoundingClientRect(), media.getBoundingClientRect(), radius());

    const emit = (active: boolean) =>
      window.dispatchEvent(new CustomEvent<StageEventDetail>('lc:stage', { detail: { id: root.id, active } }));

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: opts.scrub ?? 0.5,
        invalidateOnRefresh: true,
        onToggle: (self) => emit(self.isActive),
      },
    });
    tl.to({}, { duration: 1 }, 0); // fixes the timeline length at 1

    if (lite) {
      // Simple reveal instead of clip-path repaints.
      gsap.set(media, { clipPath: 'none' });
      if (expand) tl.fromTo(media, { autoAlpha: 0, scale: 1.05 }, { autoAlpha: 1, scale: 1, duration: span }, c0);
      else tl.fromTo(media, { autoAlpha: 1 }, { autoAlpha: 0, duration: span }, c0);
      if (bezel) tl.fromTo(bezel, { autoAlpha: expand ? 1 : 0 }, { autoAlpha: expand ? 0 : 1, duration: span }, c0);
    } else {
      tl.fromTo(media, { clipPath: expand ? atPhone : FULL }, { clipPath: expand ? FULL : atPhone, duration: span }, c0);
      if (inner) tl.fromTo(inner, { scale: expand ? 1.15 : 1 }, { scale: expand ? 1 : 0.9, duration: span }, c0);
      if (bezel) {
        if (expand && isDesktop) tl.fromTo(bezel, { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 1.25, duration: span * 0.7 }, c0);
        else if (expand) tl.fromTo(bezel, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.1 }, c0);
        else tl.fromTo(bezel, { autoAlpha: 0, scale: isDesktop ? 1.3 : 1 }, { autoAlpha: 1, scale: 1, duration: span * 0.7 }, c0 + span * 0.3);
      }
    }

    if (expand && introWin) {
      const [i0, i1] = introWin;
      const cs = getComputedStyle(document.documentElement);
      const ink = cs.getPropertyValue('--color-ink').trim() || '#28273b';
      const ink2 = cs.getPropertyValue('--color-ink-2').trim() || '#5b5970';
      if (bgStart) tl.fromTo(bgStart, { opacity: 1 }, { opacity: 0, duration: i1 - i0 }, i0);
      if (intro) {
        tl.fromTo(
          intro,
          { '--intro-fg': ink, '--intro-fg-2': ink2 },
          { '--intro-fg': '#ffffff', '--intro-fg-2': 'rgba(255,255,255,0.78)', duration: i1 - i0 },
          i0,
        );
      }
    }

    opts.extend?.(tl, ctx);

    void document.fonts?.ready.then(requestRefresh);
    return () => {
      ro?.disconnect();
      root.style.removeProperty('--intro-h');
    };
  });
}
