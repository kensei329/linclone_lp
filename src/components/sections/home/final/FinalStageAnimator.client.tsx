'use client';

import { useEffect } from 'react';
import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useExpandStage } from '@/lib/motion/use-expand-stage';
import type { FillTarget } from '@/components/site/fill/FillAnimator.client';

/**
 * #download stage #3 (spec §5.13): the reverse collapse. `useExpandStage`
 * clips the full-bleed call back into the phone rect over p 0→.40; this adds
 * the section beats (timeline duration 1, so positions are progress):
 *
 * | p         | beat |
 * |-----------|------|
 * | .30–.70   | H2 fill (external driver) |
 * | .60–.80   | logo burst behind the phone: scale 0→2.2, opacity .5→.12 (never above .5) |
 * | .70–.90   | sub, badges + QR, disclosure: y 16→0, autoAlpha 0→1 (only when below the fold at init) |
 * | .80–1.00  | sunrise: yPercent 30→0, opacity 0→1 |
 *
 * It also keeps two layout measurements current on every device (motion or
 * not): the intro height and the download-block height, which place the
 * mobile phone between them (CSS vars on the section).
 */
export function FinalStageAnimator() {
  const { anchor, scope } = useAnchorScope<HTMLElement>('section');

  useEffect(() => {
    const root = scope.current;
    const intro = root?.querySelector<HTMLElement>('[data-stage-intro]');
    const dl = root?.querySelector<HTMLElement>('[data-final-dl]');
    if (!root || !intro || !dl || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      root.style.setProperty('--final-intro-h', `${Math.ceil(intro.offsetTop + intro.offsetHeight)}px`);
      root.style.setProperty('--dl-h', `${Math.ceil(dl.offsetHeight)}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(intro);
    ro.observe(dl);
    return () => {
      ro.disconnect();
      root.style.removeProperty('--final-intro-h');
      root.style.removeProperty('--dl-h');
    };
  }, [scope]);

  useExpandStage(scope, {
    direction: 'collapse',
    clip: [0, 0.4],
    introToNight: false,
    extend: (tl, { gsap, ScrollTrigger, scope: root, lite, belowFold }) => {
      const one = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel);
      const media = one('[data-stage-media]');
      const title = one<FillTarget>('#download-title');
      const burst = one('[data-burst]');
      const sunrise = one('[data-sunrise]');
      const glow = sunrise?.querySelector<HTMLElement>('[data-fan-glow]');
      const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-final-reveal]'));

      // Lite: no clip-path scrub and no fade-out of the call (the hook's lite
      // collapse would leave an empty bezel): the phone rests collapsed (the
      // CSS final state) and only the copy and glow beats run.
      if (lite && media) {
        tl.getTweensOf(media).forEach((tw) => tw.kill());
        gsap.set(media, { clearProps: 'clipPath,opacity,visibility' });
      }

      if (title) {
        // H2 fill over p .30–.70. Driven by its own ScrollTrigger on the same
        // range rather than a proxy tween's onUpdate: ScrollTrigger.refresh()
        // re-renders scrubbed timelines with callbacks suppressed, which can
        // leave the fill stuck at 0. The FillAnimator may also initialise
        // after this, so sync once its `__fill` appears.
        const at = (p: number) => Math.min(1, Math.max(0, (p - 0.3) / 0.4));
        const st = ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => title.__fill?.(at(self.progress)),
          onRefresh: (self) => title.__fill?.(at(self.progress)),
        });
        let tries = 0;
        const sync = () => {
          if (title.__fill) title.__fill(at(st.progress));
          else if (tries++ < 300 && root.isConnected) requestAnimationFrame(sync);
        };
        requestAnimationFrame(sync);
      }

      // GSAP takes over the CSS `translate: -50% -50%` (sets it to none): centre with x/yPercent.
      if (burst) tl.fromTo(burst, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0.5 }, { xPercent: -50, yPercent: -50, scale: 2.2, opacity: 0.12, duration: 0.2 }, 0.6);

      if (belowFold && reveals.length) {
        // explicit start state: a staggered fromTo only primes its first target
        gsap.set(reveals, { y: 16, autoAlpha: 0 });
        tl.to(reveals, { y: 0, autoAlpha: 1, duration: 0.14, stagger: 0.03 }, 0.7);
      }

      if (sunrise) tl.fromTo(sunrise, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.8);
      if (glow) tl.fromTo(glow, { yPercent: 30 }, { yPercent: 0, duration: 0.2 }, 0.8);
    },
  });

  return <span ref={anchor} hidden />;
}
