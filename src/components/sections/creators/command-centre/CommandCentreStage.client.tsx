'use client';

import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useExpandStage } from '@/lib/motion/use-expand-stage';
import type { FillTarget } from '@/components/site/fill/FillAnimator.client';
import { driveFill } from '../_shared/drive-fill';

/**
 * Stage #1 beats (spec §6.3), positioned by progress on the one scrubbed
 * timeline of `useExpandStage`:
 *   0.06–0.40  clip (hook) + each [data-tile] settles 1.1 → 1, 0.03 apart
 *   0.40–0.70  H2 units fill (dim → ink, accent → Studio gradient)
 *   0.70–0.90  [data-tile-arrow] chips pop, 0.04 apart
 * The intro stays ink (introToNight: false). Reduced motion: the hook never
 * runs, so the server's final bento stays. Lite: the hook's simple reveal.
 */
export function CommandCentreStage() {
  const { anchor, scope } = useAnchorScope('[data-stage]');
  useExpandStage(scope, {
    direction: 'expand',
    clip: [0.06, 0.4],
    introToNight: false,
    extend: (tl, ctx) => {
      const { gsap, scope: root } = ctx;
      const tiles = gsap.utils.toArray<HTMLElement>('[data-stage-media] [data-tile]', root).filter((el) => el.getClientRects().length > 0);
      if (tiles.length) {
        tl.fromTo(tiles, { scale: 1.1, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.2, stagger: 0.03 }, 0.06);
      }

      driveFill(ctx, root.querySelector<FillTarget>('#how-title'), [0.4, 0.7]);

      const arrows = gsap.utils.toArray<HTMLElement>('[data-stage-media] [data-tile-arrow]', root).filter((el) => el.getClientRects().length > 0);
      if (arrows.length) {
        tl.fromTo(
          arrows,
          { scale: 0.4, autoAlpha: 0, rotate: -45 },
          { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.08, stagger: 0.02, ease: 'back.out(2)' },
          0.7,
        );
      }
    },
  });
  return <span ref={anchor} hidden />;
}
