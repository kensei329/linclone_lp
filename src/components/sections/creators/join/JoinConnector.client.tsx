'use client';

import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useScrollScene } from '@/lib/motion/use-scroll-scene';

/**
 * #join connector (spec §6.10). Each step owns the segment to the next node
 * (CSS pseudo-elements scaled by `--seg`, 0–1); one scrubbed progress
 * (`top 75%` → `center 50%`) spreads across the segments, so the line draws
 * node to node (horizontal ≥1024, vertical below) and each node lights as the
 * line reaches it. Primed only when the track is below the fold at init;
 * reduced motion never runs (server: segments full, all steps lit).
 */
export function JoinConnector() {
  const { anchor, scope } = useAnchorScope('.cr-track');
  useScrollScene(scope, ({ gsap, scope: track, belowFold }) => {
    if (!belowFold) return;
    const steps = Array.from(track.querySelectorAll<HTMLElement>('.cr-track-step'));
    if (steps.length < 2) return;
    const segs = steps.length - 1;
    const render = (p: number) => {
      const x = p * segs;
      steps.forEach((s, i) => {
        s.style.setProperty('--seg', String(Math.min(1, Math.max(0, x - i))));
        s.toggleAttribute('data-lit', x >= i - 0.04);
      });
    };
    track.setAttribute('data-live', '');
    render(0);
    const proxy = { p: 0 };
    gsap.to(proxy, {
      p: 1,
      ease: 'none',
      onUpdate: () => render(proxy.p),
      scrollTrigger: { trigger: track, start: 'top 75%', end: 'center 50%', scrub: 0.4, invalidateOnRefresh: true },
    });
    return () => {
      track.removeAttribute('data-live');
      steps.forEach((s) => {
        s.removeAttribute('data-lit');
        s.style.removeProperty('--seg');
      });
    };
  });
  return <span ref={anchor} hidden />;
}
