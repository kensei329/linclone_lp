'use client';

import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useScrollScene } from '@/lib/motion/use-scroll-scene';

/** An element driven by a stage timeline: `el.__fill(progress 0..1)`. */
export type FillTarget = HTMLElement & { __fill?: (progress: number) => void };

type FillAnimatorProps = {
  mode: 'clip' | 'units';
  start: string;
  end: string;
  scrub: number | true;
  driver: 'self' | 'external';
  hasAccent: boolean;
};

const ACCENT_AT = 0.7;

/**
 * Drives one ScrollFillText (spec §4.3). Rendered inside the text element as a
 * hidden anchor; the scope is its parent. Lite mode keeps the (cheap) scrub.
 */
export function FillAnimator({ mode, start, end, scrub, driver, hasAccent }: FillAnimatorProps) {
  const { anchor, scope } = useAnchorScope();
  useScrollScene(scope, ({ gsap, ScrollTrigger, scope: el, belowFold }) => {
    const target = el as FillTarget;
    const setAccent = (p: number) => {
      if (hasAccent) target.toggleAttribute('data-accent-off', p < ACCENT_AT);
    };

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
    if (mode === 'clip') {
      const clip = el.querySelector<HTMLElement>('.fill-clip');
      if (!clip) return;
      tl.fromTo(clip, { '--fill': '0%' }, { '--fill': '100%', duration: 1 });
    } else {
      const units = Array.from(el.querySelectorAll<HTMLElement>('[data-u]'));
      if (!units.length) return;
      const cs = getComputedStyle(el);
      const off = cs.getPropertyValue('--fill-off').trim();
      const on = cs.getPropertyValue('--fill-on').trim();
      const each = 1 / units.length;
      // Every unit starts dim; the staggered `to` never immediate-renders, so
      // units the playhead has not reached keep the dim colour (a fromTo with
      // a refresh-time invalidate could leave them unset, i.e. fully inked).
      gsap.set(units, { color: off });
      tl.to(units, { color: on, duration: each, stagger: each, immediateRender: false });
    }
    tl.eventCallback('onUpdate', () => setAccent(tl.progress()));

    if (driver === 'external') {
      target.__fill = (p: number) => {
        tl.progress(Math.min(1, Math.max(0, p)));
        setAccent(p);
      };
      tl.progress(belowFold ? 0 : 1);
      setAccent(belowFold ? 0 : 1);
      return () => {
        delete target.__fill;
        target.removeAttribute('data-accent-off');
      };
    }

    if (!belowFold) {
      // Already on screen at init: stay filled (never dim what was read).
      tl.progress(1);
      return;
    }
    ScrollTrigger.create({ trigger: el, start, end, scrub, animation: tl });
    return () => target.removeAttribute('data-accent-off');
  });
  return <span ref={anchor} hidden />;
}
