'use client';

import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useScrollScene } from '@/lib/motion/use-scroll-scene';

const visible = (el: Element) => el.getClientRects().length > 0;

/**
 * #morning-call grid micro-sequences (spec §5.5), once when the mockup reaches
 * 'top 70%':
 * - MorningSetup06b: the `[data-m=sel]` highlight slides from 1回のみ to 毎日,
 *   then the ring card pops.
 * - HomeCards01: play crossfades to pause, the waveform starts, the NEW badge
 *   pops and settles to 40% after 2.4s.
 * Start states are applied only to mockups below the fold at init.
 */
export function MorningMicro() {
  const { anchor, scope } = useAnchorScope('[data-morning-grid]');

  useScrollScene(scope, ({ gsap, ScrollTrigger, q }) => {
    const cleanups: (() => void)[] = [];
    const vh = window.innerHeight;

    // ── MorningSetup06b ──
    q('[data-setup-root]')
      .filter(visible)
      .forEach((root) => {
        if (root.getBoundingClientRect().top <= vh) return; // on screen at init: stay final
        const sel = root.querySelector<HTMLElement>('[data-m="sel"]');
        const card = root.querySelector<HTMLElement>('[data-m="ring-card"]');
        const tl = gsap.timeline({ paused: true });
        if (sel) {
          // 1回のみ sits left of 毎日 in the 2×2 grid (gap 10 in screen px).
          tl.fromTo(sel, { x: () => -(sel.offsetWidth + 10) }, { x: 0, duration: 0.42, ease: 'power3.inOut' }, 0.2);
        }
        if (card) {
          tl.fromTo(
            card,
            { scale: 0.9, autoAlpha: 0, transformOrigin: '50% 60%' },
            { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.6)' },
            0.75,
          );
        }
        tl.progress(0);
        ScrollTrigger.create({ trigger: root, start: 'top 70%', once: true, onEnter: () => void tl.play() });
        cleanups.push(() => tl.progress(1).kill());
      });

    // ── HomeCards01: play → pause (the mockup crossfades on data-state), wave starts, NEW pops ──
    q('[data-home-root]')
      .filter(visible)
      .forEach((root) => {
        if (root.getBoundingClientRect().top <= vh) return; // on screen at init: stay final
        const play = root.querySelector<HTMLElement>('[data-m="play"]');
        const wave = root.querySelector<HTMLElement>('[data-m="wave"] .waveform, .waveform[data-m="wave"]');
        const badge = root.querySelector<HTMLElement>('[data-m="new"]');
        const setPlaying = (on: boolean) => {
          play?.setAttribute('data-state', on ? 'playing' : 'paused');
          if (wave) {
            wave.toggleAttribute('data-playing', on);
            wave.toggleAttribute('data-loop', on);
          }
        };

        const tl = gsap.timeline({ paused: true });
        if (play) tl.fromTo(play, { scale: 1 }, { scale: 0.88, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }, 0);
        tl.call(() => setPlaying(true), undefined, 0.12);
        if (badge) {
          tl.fromTo(badge, { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.6)' }, 0.35);
          tl.to(badge, { autoAlpha: 0.4, duration: 0.42 }, 0.35 + 2.4);
        }
        tl.progress(0);
        setPlaying(false);
        ScrollTrigger.create({ trigger: root, start: 'top 70%', once: true, onEnter: () => void tl.play() });

        cleanups.push(() => {
          tl.progress(1).kill();
          setPlaying(true);
          if (badge) gsap.set(badge, { clearProps: 'opacity,visibility,transform' });
        });
      });

    return () => cleanups.forEach((fn) => fn());
  });

  return <span ref={anchor} hidden />;
}
