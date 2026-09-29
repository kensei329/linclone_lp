'use client';

import type { gsap } from 'gsap';
import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useScrollScene } from '@/lib/motion/use-scroll-scene';
import { REVEAL_FROM } from '@/lib/motion/tokens';

const visible = (el: Element) => el.getClientRects().length > 0;

/** The deepest element whose own text equals `text`. */
function textHost(root: Element, text: string): HTMLElement | null {
  const want = text.trim();
  const all = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))] as HTMLElement[];
  for (let i = all.length - 1; i >= 0; i--) {
    if (Array.from(all[i].childNodes).some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim() === want)) return all[i];
  }
  return null;
}

/**
 * #live-request micro-sequences (spec §5.7), once when each mockup is ≥50%
 * visible (the desktop row, or the active carousel card on mobile):
 * LiveSetup13 types the theme (60ms/char); ShowPreview14 reveals its rundown
 * rows (stagger .12) and pops the flow rows. Desktop also draws the connector
 * between the three columns (scrub). Start states only for content below the
 * fold at init; reduced motion: nothing runs.
 */
export function LiveRequestMicro({ topicValue }: { topicValue: string }) {
  const { anchor, scope } = useAnchorScope('[data-live-request]');

  useScrollScene(scope, ({ gsap, scope: row, q, isDesktop }) => {
    const belowFold = row.getBoundingClientRect().top > window.innerHeight;
    const cleanups: (() => void)[] = [];
    const tls: gsap.core.Timeline[] = [];

    const roots = q('[data-req-root]').filter(visible);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio < 0.5) continue;
          const t = e.target as HTMLElement & { __tl?: gsap.core.Timeline };
          t.__tl?.play();
          io.unobserve(e.target);
        }
      },
      { threshold: [0, 0.5] },
    );

    roots.forEach((root) => {
      const kind = root.dataset.reqRoot;
      const tl = gsap.timeline({ paused: true });
      if (kind === 'setup') {
        const topic = root.querySelector<HTMLElement>('[data-m="topic"]');
        const host = topic ? textHost(topic, topicValue) : null;
        if (host) {
          const chars = Array.from(topicValue);
          const proxy = { n: chars.length };
          tl.to(proxy, {
            n: chars.length,
            startAt: { n: 0 },
            duration: chars.length * 0.06,
            ease: 'none',
            immediateRender: false,
            onUpdate: () => void (host.textContent = chars.slice(0, Math.round(proxy.n)).join('')),
          }, 0.25);
          cleanups.push(() => void (host.textContent = topicValue));
          if (belowFold) host.textContent = '';
        }
      } else if (kind === 'preview') {
        const segs = Array.from(root.querySelectorAll<HTMLElement>('[data-m="seg"]'));
        const flows = Array.from(root.querySelectorAll<HTMLElement>('[data-m="flow"]'));
        if (segs.length) tl.fromTo(segs, { ...REVEAL_FROM, y: 12 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.42, stagger: 0.12, immediateRender: false }, 0.2);
        if (flows.length) tl.fromTo(flows, { scale: 0.9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.6)', stagger: 0.1, immediateRender: false }, 0.2 + segs.length * 0.12 + 0.2);
        if (belowFold) {
          if (segs.length) gsap.set(segs, { ...REVEAL_FROM, y: 12 });
          if (flows.length) gsap.set(flows, { scale: 0.9, autoAlpha: 0 });
        }
      }
      if (!tl.getChildren().length) {
        tl.kill();
        return;
      }
      tls.push(tl);
      if (!belowFold) return; // already on screen at init: keep the final state
      (root as HTMLElement & { __tl?: gsap.core.Timeline }).__tl = tl;
      io.observe(root);
    });

    // Desktop connector: drawn by scroll across the three columns; nodes light as it arrives.
    const line = row.querySelector<SVGPathElement>('[data-connector]');
    const nodes = q('[data-node]');
    if (isDesktop && line) {
      const draw = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: line.closest('svg') ?? line, start: 'top 75%', end: 'top 35%', scrub: 0.6 },
      });
      draw.fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1 }, 0);
      nodes.forEach((n, i) => {
        draw.fromTo(n, { scale: 0.5, autoAlpha: 0.35 }, { scale: 1, autoAlpha: 1, duration: 0.12, ease: 'back.out(2)' }, Math.max(0, (i / Math.max(1, nodes.length - 1)) - 0.06));
      });
    }

    return () => {
      io.disconnect();
      tls.forEach((tl) => tl.progress(1).kill());
      cleanups.forEach((fn) => fn());
      roots.forEach((r) => delete (r as HTMLElement & { __tl?: unknown }).__tl);
    };
  });

  return <span ref={anchor} hidden />;
}
