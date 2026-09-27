'use client';

import type { gsap } from 'gsap';
import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useScrollScene } from '@/lib/motion/use-scroll-scene';

const GIFT_EVERY = 2.4;
const COMMENTS_LOOP = 12;

/**
 * LIVE player loops (spec §5.7), only while `#live-stage` is on screen and
 * never in lite mode or under reduced motion (the SSR list stays static):
 * - the comment column drifts upward on a seamless 12s linear loop
 *   (the player renders its bubbles twice for this)
 * - every 2.4s one of the six gift glyphs pops, then floats up and fades.
 * Rendered inside the stage's intro slot, so it anchors to `[data-stage]`.
 */
export function LiveLoops() {
  const { anchor, scope } = useAnchorScope('[data-stage]');

  useScrollScene(
    scope,
    ({ gsap, scope: stage }) => {
      const media = stage.querySelector<HTMLElement>('[data-stage-media]');
      if (!media) return;
      const loops: gsap.core.Animation[] = [];

      // ── comments ──
      const col = media.querySelector<HTMLElement>('[data-comments]');
      if (col) {
        // The track is the single wrapper of the duplicated bubbles, or the column itself.
        const track = col.children.length === 1 && col.firstElementChild instanceof HTMLElement ? col.firstElementChild : col;
        const items = Array.from(track.children) as HTMLElement[];
        if (items.length >= 2) {
          loops.push(gsap.fromTo(track, { yPercent: 0 }, { yPercent: -50, duration: COMMENTS_LOOP, ease: 'none', repeat: -1, paused: true }));
        }
      }

      // ── gifts ──
      const gifts = Array.from(media.querySelectorAll<HTMLElement>('[data-gift]'));
      if (gifts.length) {
        const tl = gsap.timeline({ repeat: -1, paused: true });
        gifts.forEach((g, i) => {
          const at = i * GIFT_EVERY;
          tl.fromTo(g, { scale: 0.4, autoAlpha: 0, y: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.6)', immediateRender: false }, at);
          tl.to(g, { y: -80, autoAlpha: 0, duration: 1.2, ease: 'power1.out' }, at + 0.45);
        });
        tl.to({}, { duration: GIFT_EVERY - 1.65 }, (gifts.length - 1) * GIFT_EVERY + 1.65); // even spacing across the repeat
        loops.push(tl);
      }
      if (!loops.length) return;

      let inView = false;
      const sync = () => loops.forEach((l) => (inView && !document.hidden ? l.play() : l.pause()));
      const io = new IntersectionObserver(([e]) => {
        inView = e.isIntersecting;
        sync();
      });
      io.observe(stage);
      const onVis = () => sync();
      document.addEventListener('visibilitychange', onVis);
      return () => {
        io.disconnect();
        document.removeEventListener('visibilitychange', onVis);
      };
    },
    { lite: 'skip' },
  );

  return <span ref={anchor} hidden />;
}
