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

/** Share of the clip window over which the bezel rides the clip edge while it fades. */
const GLUE = 0.35;
/** The intro text's ink→white flip is a step (a zero-duration tween reverts cleanly on scrub-back). */
const STEP = 0;
/** Ease of the intro bg crossfade (GSAP power2 is cubic). */
const BG_EASE = 'power2.in';

type Rgb = [number, number, number];
function parseRgb(c: string | undefined, fallback: Rgb): Rgb {
  const m = c?.match(/rgba?\(([^)]+)\)/);
  if (!m) return fallback;
  const [r, g, b, a = '1'] = m[1].split(/[\s,/]+/).filter(Boolean);
  if (parseFloat(a) === 0) return fallback;
  return [parseFloat(r), parseFloat(g), parseFloat(b)];
}
function luminance([r, g, b]: Rgb): number {
  const f = (v: number) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/**
 * Timeline position where white and ink text have equal contrast on the
 * start→end bg crossfade (start opacity 1 − ease(x)).
 */
function introCrossover(
  [i0, i1]: [number, number],
  ease: (x: number) => number,
  start: HTMLElement | null,
  end: HTMLElement | null,
): number {
  const s = parseRgb(start ? getComputedStyle(start).backgroundColor : undefined, [247, 243, 236]);
  const e = parseRgb(end ? getComputedStyle(end).backgroundColor : undefined, [15, 16, 24]);
  const inkL = luminance([40, 39, 59]);
  for (let k = 0; k <= 200; k++) {
    const x = k / 200;
    const o = 1 - ease(x);
    const bg = luminance([s[0] * o + e[0] * (1 - o), s[1] * o + e[1] * (1 - o), s[2] * o + e[2] * (1 - o)]);
    const white = 1.05 / (bg + 0.05);
    const ink = (bg + 0.05) / (inkL + 0.05);
    if (white >= ink) return i0 + x * (i1 - i0);
  }
  return (i0 + i1) / 2;
}

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

    /**
     * The bezel's box `f` of the way from the phone rect (0) to the media rect
     * (1), in the sticky's coordinates: the same interpolation as the clip, so
     * an eased-in/out bezel stays glued to the clip edge instead of scaling
     * around its own centre (no second phone outline).
     */
    const boxAt = (f: number) => {
      const p = phone.getBoundingClientRect();
      const m = media.getBoundingClientRect();
      const l = p.left - m.left;
      const t = p.top - m.top;
      return {
        left: l * (1 - f),
        top: t * (1 - f),
        width: p.width + (m.width - p.width) * f,
        height: p.height + (m.height - p.height) * f,
        borderRadius: radius() * (1 - f),
      };
    };
    const boxVars = (f: number) => ({
      left: () => boxAt(f).left,
      top: () => boxAt(f).top,
      width: () => boxAt(f).width,
      height: () => boxAt(f).height,
      borderRadius: () => boxAt(f).borderRadius,
    });
    /** the bezel's own screen (ExpandStage's `bezelScreen`) */
    const bezelScreen = bezel ? (Array.from(bezel.children) as HTMLElement[]) : [];

    const emit = (active: boolean) =>
      window.dispatchEvent(new CustomEvent<StageEventDetail>('lc:stage', { detail: { id: root.id, active } }));

    // Intro text over the bg crossfade (expand from a light surface). The bg
    // fades with an ease-in; the text colour flips as a step where white
    // and ink have equal contrast on the blended bg, so the H2 never passes
    // through mid-grey on mid-grey. The header flips at the same point.
    const startLight = root.dataset.surfaceStart === 'cream' || root.dataset.surfaceStart === 'lavender';
    const endSurface = root.dataset.surfaceEnd === 'studio' ? 'light' : 'dark';
    // The night must have arrived before the growing clip reaches the intro
    // text, or the text would straddle a light bg and the dark media at once:
    // the crossfade ends no later than that moment.
    const coverAt = (): number | null => {
      if (!intro || lite) return null;
      const m = media.getBoundingClientRect();
      const r = intro.getBoundingClientRect();
      const ix = { l: r.left - m.left, t: r.top - m.top, r: r.right - m.left, b: r.bottom - m.top };
      for (let k = 0; k <= 50; k++) {
        const f = k / 50;
        const b = boxAt(f);
        if (b.left < ix.r && b.left + b.width > ix.l && b.top < ix.b && b.top + b.height > ix.t) return c0 + f * span;
      }
      return null;
    };
    const win: [number, number] | false = (() => {
      if (!expand || !introWin) return introWin;
      const cover = coverAt();
      return cover === null ? introWin : [introWin[0], Math.max(introWin[0] + 0.06, Math.min(introWin[1], cover))];
    })();
    const crossover = expand && win ? introCrossover(win, gsap.parseEase(BG_EASE), bgStart, one('[data-stage-bg="end"]')) : null;
    const surfaceSwitch = expand && win && startLight && endSurface === 'dark' ? crossover : null;
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
      // Desktop keeps the 1.15 push-in; phones stay near 1 so text in the
      // media never runs past the viewport edge during a fling.
      const push = isDesktop ? 1.15 : 1.04;
      if (inner) tl.fromTo(inner, { scale: expand ? push : 1 }, { scale: expand ? 1 : 0.9, duration: span }, c0);
      if (bezel) {
        const glue = span * GLUE;
        if (expand) {
          // The bezel's own screen goes first, so two UIs never double-expose.
          if (bezelScreen.length) tl.fromTo(bezelScreen, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.015 }, Math.max(0, c0 - 0.015));
          if (isDesktop) {
            tl.fromTo(bezel, { ...boxVars(0), autoAlpha: 1 }, { ...boxVars(GLUE), autoAlpha: 0, duration: glue }, c0);
          } else {
            tl.fromTo(bezel, { autoAlpha: 1 }, { autoAlpha: 0, duration: Math.min(0.1, glue) }, c0);
          }
        } else {
          // Collapse mirrors it: the bezel rides the clip edge in over the
          // clip's last stretch and lands exactly on the phone rect at c1;
          // its screen (if any) appears only once it has arrived.
          tl.fromTo(bezel, { ...boxVars(GLUE), autoAlpha: 0 }, { ...boxVars(0), autoAlpha: 1, duration: glue }, c1 - glue);
          if (bezelScreen.length) tl.fromTo(bezelScreen, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.015 }, c1);
        }
      }
    }

    if (expand && win && crossover !== null) {
      const [i0, i1] = win;
      const cs = getComputedStyle(document.documentElement);
      const ink = cs.getPropertyValue('--color-ink').trim() || '#28273b';
      const ink2 = cs.getPropertyValue('--color-ink-2').trim() || '#5b5970';
      if (bgStart) tl.fromTo(bgStart, { opacity: 1 }, { opacity: 0, duration: i1 - i0, ease: BG_EASE }, i0);
      if (intro) {
        // Secondary text firms up to ink as the bg darkens, flips with the H2,
        // then relaxes to its 78% white once the night has settled.
        const pre = Math.max(0.001, crossover - i0);
        tl.fromTo(intro, { '--intro-fg': ink, '--intro-fg-2': ink2 }, { '--intro-fg': ink, '--intro-fg-2': ink, duration: pre }, i0);
        tl.fromTo(intro, { '--intro-fg': ink, '--intro-fg-2': ink }, { '--intro-fg': '#ffffff', '--intro-fg-2': '#ffffff', duration: STEP, immediateRender: false }, crossover);
        tl.fromTo(
          intro,
          { '--intro-fg-2': '#ffffff' },
          { '--intro-fg-2': 'rgba(255,255,255,0.78)', duration: Math.max(0.001, i1 - crossover), immediateRender: false },
          crossover,
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
