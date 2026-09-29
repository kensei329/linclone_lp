'use client';

import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useScrollScene } from '@/lib/motion/use-scroll-scene';

const READY_AT = 0.95;
const DIM_FROM = 0.35;

/**
 * Creators-band ring (spec §5.12): Aoi's clone ring fills (`--p` 0→100) as
 * the band scrolls in, from `top 80%` to `center 45%`; the label crossfades
 * 作成中 → 準備ができました at p ≥ .95, and the aura brightens (a white
 * overlay fades out). No percentage numeral anywhere. Only a band that is
 * below the fold at init gets the start state; reduced motion never runs.
 */
export function BandRing() {
  const { anchor, scope } = useAnchorScope('section');

  useScrollScene(scope, ({ gsap, ScrollTrigger, scope: root }) => {
    const card = root.querySelector<HTMLElement>('[data-band-card]');
    const ring = card?.querySelector<HTMLElement>('[data-ring]');
    const labels = card?.querySelector<HTMLElement>('[data-band-labels]');
    const dim = card?.querySelector<HTMLElement>('[data-band-dim]');
    if (!card || !ring || !labels) return;
    if (card.getBoundingClientRect().top < window.innerHeight * 0.8) return; // already read: stay final

    const render = (p: number) => {
      ring.style.setProperty('--p', String(Math.round(p * 1000) / 10));
      labels.toggleAttribute('data-ready', p >= READY_AT);
      if (dim) dim.style.opacity = String(DIM_FROM * (1 - p));
    };
    render(0);
    const state = { p: 0 };
    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'center 45%',
      onUpdate: (self) => {
        gsap.to(state, { p: self.progress, duration: 0.35, ease: 'power2.out', overwrite: true, onUpdate: () => render(state.p) });
      },
    });
    return () => {
      st.kill();
      gsap.killTweensOf(state);
      ring.style.removeProperty('--p');
      labels.setAttribute('data-ready', '');
      if (dim) dim.style.opacity = '';
    };
  });

  return <span ref={anchor} hidden />;
}
