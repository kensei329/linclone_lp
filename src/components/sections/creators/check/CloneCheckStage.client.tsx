'use client';

import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useExpandStage } from '@/lib/motion/use-expand-stage';
import type { FillTarget } from '@/components/site/fill/FillAnimator.client';
import { driveFill } from '../_shared/drive-fill';

const TEAL = '#00b0c2';
const NEON = '#7df4ff';
const VIOLET = '#8b55d6';

/** Clip window (all viewports): short, so the night lands before the beats. */
const CLIP: [number, number] = [0.06, 0.3];

/**
 * Stage #2 beats (spec §6.5) on the scrubbed `useExpandStage` timeline:
 *   0.02–0.06  [data-m=preview-note] pops inside the bezel screen
 *   0.06–0.30  clip, cream → night, intro ink → white (hook)
 *   0.24–0.30  [data-self-controls] fade in as the clip nearly fills, so the
 *              clip edge never slices them
 *   0.32–0.92  [data-self-ring] --ring teal → neon → violet (a colour change)
 *   0.36–0.78  the "same voice" caption fills (units, white)
 *   0.40–0.80  [data-wave] --amp 0 → 1
 * Lite: simple reveal (hook) and the ring colour steps instead of scrubbing.
 */
export function CloneCheckStage() {
  const { anchor, scope } = useAnchorScope('[data-stage]');
  useExpandStage(scope, {
    direction: 'expand',
    clip: CLIP,
    extend: (tl, ctx) => {
      const { gsap, scope: root, lite } = ctx;
      const note = root.querySelector<HTMLElement>('[data-stage-bezel] [data-m="preview-note"]');
      if (note) {
        tl.fromTo(note, { autoAlpha: 0, y: 10, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.04, ease: 'back.out(1.8)' }, 0.02);
      }

      const controls = root.querySelectorAll<HTMLElement>('[data-stage-media] [data-self-controls]');
      if (controls.length && !lite) {
        tl.fromTo(controls, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: CLIP[1] - 0.24 }, 0.24);
      }

      const rings = gsap.utils.toArray<HTMLElement>('[data-stage-media] [data-self-ring]', root);
      if (rings.length) {
        if (lite) {
          tl.fromTo(rings, { '--ring': TEAL }, { '--ring': NEON, duration: 0.001 }, 0.5);
          tl.fromTo(rings, { '--ring': NEON }, { '--ring': VIOLET, duration: 0.001, immediateRender: false }, 0.78);
        } else {
          tl.fromTo(rings, { '--ring': TEAL }, { '--ring': NEON, duration: 0.3 }, 0.32);
          tl.fromTo(rings, { '--ring': NEON }, { '--ring': VIOLET, duration: 0.3, immediateRender: false }, 0.62);
        }
      }

      driveFill(ctx, root.querySelector<FillTarget>('#check-fill'), [0.36, 0.78]);

      const waves = gsap.utils.toArray<HTMLElement>('[data-stage-media] [data-wave]', root);
      if (waves.length) tl.fromTo(waves, { '--amp': 0 }, { '--amp': 1, duration: 0.4 }, 0.4);
    },
  });
  return <span ref={anchor} hidden />;
}
