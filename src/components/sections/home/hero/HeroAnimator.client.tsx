'use client';

import { useEffect, useState } from 'react';
import { CaptionMarker } from '@/components/site/fill/CaptionMarker.client';
import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useScrollScene } from '@/lib/motion/use-scroll-scene';

/** Parallax travel per unit of sticker depth (§5.1: ±12px × depth 0.6–1.2). */
const PARALLAX_PX = 12;

/**
 * Hero island (spec §5.1). No GSAP above the fold at load: the caption marker
 * starts on idle (it loads motion itself), and the desktop scene below mounts
 * only after the browser is idle. Everything here is transform-only; reduced
 * motion is handled by `useScrollScene` (never runs) and by CaptionMarker.
 */
export function HeroAnimator() {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const go = () => setIdle(true);
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(go, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(go, 600);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <>
      <CaptionMarker targetId="hero-title" restOn="last" tone="teal" />
      {idle ? <HeroScene /> : null}
    </>
  );
}

function HeroScene() {
  const { anchor, scope } = useAnchorScope('#hero');
  useScrollScene(
    scope,
    ({ gsap, scope: hero, q, isDesktop, lite }) => {
      if (!isDesktop) return;
      const phone = q('[data-hero-phone]')[0];
      const orb = q('[data-hero-orb]')[0];
      const stickers = q('[data-depth]');
      const depth = (el: HTMLElement) => parseFloat(el.dataset.depth ?? '1') || 1;

      // Scroll-away (scrub): the phone lifts, the dawn orb swells, stickers drift by depth.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      });
      if (phone) tl.fromTo(phone, { y: 0 }, { y: -60, duration: 1 }, 0);
      if (orb) tl.fromTo(orb, { scale: 1 }, { scale: 1.15, duration: 1 }, 0);
      stickers.forEach((el) => {
        const travel = Math.max(20, Math.min(80, Math.round(20 + (depth(el) - 0.6) * 100)));
        tl.fromTo(el, { y: 0 }, { y: -travel, duration: 1 }, 0);
      });

      if (lite || !stickers.length) return;

      // Cursor parallax on the stickers only (x), while the hero is on screen.
      const setters = stickers.map((el) => ({ x: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' }), k: depth(el) }));
      let raf = 0;
      let mx = 0;
      const apply = () => {
        raf = 0;
        setters.forEach((s) => s.x(mx * PARALLAX_PX * s.k));
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        if (hero.getBoundingClientRect().bottom < 0) return;
        mx = (e.clientX / window.innerWidth) * 2 - 1;
        if (!raf) raf = requestAnimationFrame(apply);
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      return () => {
        window.removeEventListener('pointermove', onMove);
        cancelAnimationFrame(raf);
      };
    },
    { rootMargin: '0px' },
  );
  return <span ref={anchor} hidden />;
}
