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
  /**
   * Section beats, positioned by progress (timeline duration = 1). May return
   * a cleanup, run whenever the scene is torn down (unmount, breakpoint or
   * reduced-motion change) before the hook's own cleanup.
   */
  extend?: (tl: gsap.core.Timeline, ctx: SceneCtx) => void | (() => void);
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

    // Header surface: an expand stage that starts on a light surface (cream /
    // lavender) reads as light until the background crossfade's midpoint, then
    // as its end surface. HeaderBehavior watches `data-surface` changes.
    const startLight = root.dataset.surfaceStart === 'cream' || root.dataset.surfaceStart === 'lavender';
    const endSurface = root.dataset.surfaceEnd === 'studio' ? 'light' : 'dark';
    const surfaceSwitch = expand && introWin && startLight && endSurface === 'dark' ? (introWin[0] + introWin[1]) / 2 : null;
    const syncSurface = (p: number) => {
      if (surfaceSwitch === null) return;
      const surf = p < surfaceSwitch ? 'light' : 'dark';
      if (root.dataset.surface !== surf) root.dataset.surface = surf;
    };

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: opts.scrub ?? 0.5,
        invalidateOnRefresh: true,
        onToggle: (self) => emit(self.isActive),
        onUpdate: (self) => syncSurface(self.progress),
        onRefresh: (self) => syncSurface(self.progress),
      },
    });
    tl.to({}, { duration: 1 }, 0); // fixes the timeline length at 1

    if (lite) {
      // Simple reveal instead of clip-path repaints, sequenced so the two
      // screens never sit half-transparent on top of each other.
      if (expand) {
        gsap.set(media, { clipPath: 'none' });
        if (bezel) tl.fromTo(bezel, { autoAlpha: 1 }, { autoAlpha: 0, duration: span * 0.45 }, c0);
        tl.fromTo(media, { autoAlpha: 0, scale: 1.05 }, { autoAlpha: 1, scale: 1, duration: span * 0.55 }, c0 + span * 0.45);
      } else if (bezel) {
        // Collapse: the media keeps its CSS final clip (the phone rect) and
        // stays visible; only the bezel arrives around it.
        tl.fromTo(bezel, { autoAlpha: 0 }, { autoAlpha: 1, duration: span * 0.5 }, c0 + span * 0.5);
      }
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

    const extCleanup = opts.extend?.(tl, ctx);

    // Refreshes re-render scrubbed timelines with callbacks suppressed:
    // re-run the timeline's onUpdate (section beats derived from progress).
    const resync = () => {
      const cb = tl.eventCallback('onUpdate') as ((...args: unknown[]) => void) | undefined;
      cb?.call(tl);
    };
    ctx.ScrollTrigger.addEventListener('refresh', resync);

    void document.fonts?.ready.then(requestRefresh);
    return () => {
      ctx.ScrollTrigger.removeEventListener('refresh', resync);
      if (typeof extCleanup === 'function') extCleanup();
      ro?.disconnect();
      root.style.removeProperty('--intro-h');
      if (surfaceSwitch !== null) root.dataset.surface = endSurface;
    };
  });
}
