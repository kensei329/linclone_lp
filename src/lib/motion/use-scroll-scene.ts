'use client';

import type { RefObject } from 'react';
import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

// STUB (WP0a): final signature per spec §4.5. WP0b implements the
// IntersectionObserver → loadMotion() → gsap.context/matchMedia pipeline.

export type SceneCtx = {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
  scope: HTMLElement;
  q: (sel: string) => HTMLElement[];
  isDesktop: boolean;
  lite: boolean;
  belowFold: boolean;
};

export type ScrollSceneOptions = {
  /** default '100% 0px' */
  rootMargin?: string;
  /** default 'run' (ctx.lite = true) */
  lite?: 'run' | 'skip';
};

export function useScrollScene(
  scope: RefObject<HTMLElement | null>,
  setup: (ctx: SceneCtx) => void | (() => void),
  opts?: ScrollSceneOptions,
): void {
  void scope;
  void setup;
  void opts;
}
