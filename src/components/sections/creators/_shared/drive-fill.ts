import type { SceneCtx } from '@/lib/motion/use-scroll-scene';
import type { FillTarget } from '@/components/site/fill/FillAnimator.client';

/**
 * Drives an external-driver ScrollFillText (`el.__fill`) from the stage's
 * scroll progress mapped onto `[from, to]`. A dedicated ScrollTrigger (same
 * trigger and range as the stage timeline) is used instead of a tween on the
 * scrubbed timeline: `invalidateOnRefresh` re-renders tweens at their start
 * during refresh, which would leave the fill at 0.
 */
export function driveFill(ctx: SceneCtx, target: FillTarget | null, [from, to]: [number, number]): void {
  if (!target) return;
  const apply = (p: number) => target.__fill?.(Math.min(1, Math.max(0, (p - from) / (to - from))));
  ctx.ScrollTrigger.create({
    trigger: ctx.scope,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => apply(self.progress),
    onRefresh: (self) => apply(self.progress),
  });
}
