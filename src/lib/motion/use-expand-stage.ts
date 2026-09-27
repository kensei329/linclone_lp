'use client';

import type { RefObject } from 'react';
import type { gsap } from 'gsap';
import type { SceneCtx } from './use-scroll-scene';

// STUB (WP0a): final signature per spec §4.4. WP0b implements the clip /
// bezel / intro timeline. The SSR final state already renders without it.

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

export function useExpandStage(scope: RefObject<HTMLElement | null>, opts: ExpandStageOptions): void {
  void scope;
  void opts;
}
