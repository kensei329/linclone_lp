'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from '@/lib/motion/smooth-scroll';

/**
 * Maps Lenis scroll velocity to `--skew` on the marquee (clamped ±6°), eased
 * back to 0 when scrolling stops (spec §4.7). Off in lite mode and under
 * reduced motion (Lenis is never created then).
 */
export function MarqueeVelocity() {
  const anchor = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();
  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>('.marquee');
    if (!root || !lenis || document.documentElement.hasAttribute('data-lite')) return;
    let skew = 0;
    let target = 0;
    let raf = 0;
    const step = () => {
      skew += (target - skew) * 0.15;
      target *= 0.9;
      root.style.setProperty('--skew', `${skew.toFixed(2)}deg`);
      raf = Math.abs(skew) > 0.02 || Math.abs(target) > 0.02 ? requestAnimationFrame(step) : 0;
      if (!raf) root.style.setProperty('--skew', '0deg');
    };
    const onScroll = () => {
      if (!root.closest('.is-inview')) return;
      target = Math.max(-6, Math.min(6, lenis.velocity * 0.15));
      if (!raf) raf = requestAnimationFrame(step);
    };
    lenis.on('scroll', onScroll);
    return () => {
      lenis.off('scroll', onScroll);
      cancelAnimationFrame(raf);
      root.style.removeProperty('--skew');
    };
  }, [lenis]);
  return <span ref={anchor} hidden />;
}
