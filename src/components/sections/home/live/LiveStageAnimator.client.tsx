'use client';

import { useEffect, useRef } from 'react';
import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useExpandStage } from '@/lib/motion/use-expand-stage';
import { useScrollScene } from '@/lib/motion/use-scroll-scene';

type FillTarget = HTMLElement & { __fill?: (progress: number) => void };

const FILL: [number, number] = [0.42, 0.7];
const READ_AT = 0.55;

/**
 * #live-stage (spec §5.7): the LIVE feed card in the bezel presses "join",
 * then the clip expands (0.08 → 0.40) into the full-bleed audio player; the
 * fill line reads (0.42 → 0.70), the theme progress runs (0.30 → 0.80) and
 * the Super Chat is marked read on air at 0.55. Also: the bezel screen scale
 * and the intro's giant "LIVE" parallax (desktop, ±12px).
 * Rendered inside the stage's intro slot, so it anchors to `[data-stage]`.
 */
export function LiveStageAnimator() {
  const { anchor, scope } = useAnchorScope('[data-stage]');
  const intro = useRef<HTMLElement | null>(null);

  // Bezel screen: a 390×844 screen scaled to the phone rect (no JS = bezel hidden anyway).
  useEffect(() => {
    const stage = anchor.current?.closest<HTMLElement>('[data-stage]');
    intro.current = stage?.closest('section:not([data-stage])')?.querySelector<HTMLElement>('[data-live-intro]') ?? null;
    const phone = stage?.querySelector<HTMLElement>('[data-stage-phone]');
    if (!stage || !phone) return;
    const set = () => stage.style.setProperty('--bs', String(phone.offsetWidth / 390));
    set();
    const ro = new ResizeObserver(set);
    ro.observe(phone);
    return () => {
      ro.disconnect();
      stage.style.removeProperty('--bs');
    };
  }, [anchor]);

  useExpandStage(scope, {
    direction: 'expand',
    clip: [0.08, 0.4],
    introToNight: false,
    extend: (tl, { gsap, scope: root }) => {
      const one = (sel: string) => root.querySelector<HTMLElement>(sel);
      const join = one('[data-stage-bezel] [data-m="join"]');
      const fill = one('#live-fill') as FillTarget | null;
      const superchat = one('[data-stage-media] [data-m="superchat"]');
      const themeEl = one('[data-stage-media] [data-theme-progress]');
      const theme = themeEl && themeEl.firstElementChild instanceof HTMLElement ? themeEl.firstElementChild : themeEl;

      if (join) {
        tl.fromTo(join, { scale: 1 }, { scale: 0.96, duration: 0.025, ease: 'power2.out' }, 0.03);
        tl.to(join, { scale: 1, duration: 0.025, ease: 'power2.out' }, 0.055);
      }
      if (theme) tl.fromTo(theme, { scaleX: 0.2, transformOrigin: '0% 50%' }, { scaleX: 0.65, duration: 0.5 }, 0.3);

      let lastFill = -1;
      let read: boolean | null = null;
      const onUpdate = () => {
        const p = tl.progress();
        const f = Math.min(1, Math.max(0, (p - FILL[0]) / (FILL[1] - FILL[0])));
        if (f !== lastFill && fill?.__fill) {
          lastFill = f;
          fill.__fill(f);
        }
        const r = p >= READ_AT;
        if (r !== read && superchat) {
          read = r;
          superchat.classList.toggle('is-read', r);
        }
      };
      tl.eventCallback('onUpdate', onUpdate);
      onUpdate();
      // The fill animator may initialise after this timeline: resync shortly after.
      gsap.delayedCall(0.4, () => {
        lastFill = -1;
        onUpdate();
      });
    },
  });

  // Giant outlined "LIVE" behind the intro: slow parallax (desktop scrub),
  // kept within the ±12px parallax limit (spec §9.1).
  useScrollScene(intro, ({ gsap, scope: el, isDesktop, lite }) => {
    if (!isDesktop || lite) return;
    const word = el.querySelector<HTMLElement>('[data-live-word]');
    if (!word) return;
    gsap.fromTo(
      word,
      { y: -12 },
      { y: 12, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });

  return <span ref={anchor} hidden />;
}
