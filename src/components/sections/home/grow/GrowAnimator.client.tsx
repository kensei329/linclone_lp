'use client';

import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useScrollScene } from '@/lib/motion/use-scroll-scene';

type Statuses = { ai: string; community: string; approved: string };
type StatusState = keyof Statuses;

const STEP_GAP = 0.5;

/**
 * #grow (spec §5.8).
 * - Desktop stack: scrubbed from stacked (back cards .96 and 12px down) to the
 *   fanned SSR layout (−42% / −8°, centre −12px, +42% / +8°).
 * - Pipeline, once at 'top 75%': the discs light 0.5s apart while the
 *   connector runs (scaleX; mobile scaleY), ReviewStatus10's `[data-status]`
 *   goes AI審査中 → みんなの審査 → 承認済み, then CreatorProfile08's new row pops.
 * Start states only when below the fold at init; reduced motion: nothing runs.
 */
export function GrowAnimator({ statuses }: { statuses: Statuses }) {
  const { anchor, scope } = useAnchorScope('[data-grow-root]');

  useScrollScene(scope, ({ gsap, ScrollTrigger, scope: root, q, isDesktop }) => {
    const vh = window.innerHeight;

    // ── stack spread (desktop) ──
    const stack = root.querySelector<HTMLElement>('[data-stack]');
    if (isDesktop && stack) {
      const [a, b, c] = q('[data-stack-card]');
      if (a && b && c) {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: stack, start: 'top 80%', end: 'center 50%', scrub: 1, invalidateOnRefresh: true },
        });
        // x: 0 overrides the CSS (SSR) translate, which GSAP would otherwise parse into px.
        tl.fromTo(a, { x: 0, xPercent: 0, rotate: 0, y: 12, scale: 0.96 }, { x: 0, xPercent: -42, rotate: -8, y: 0, scale: 1 }, 0);
        tl.fromTo(b, { x: 0, xPercent: 0, rotate: 0, y: 0 }, { x: 0, xPercent: 0, rotate: 0, y: -12 }, 0);
        tl.fromTo(c, { x: 0, xPercent: 0, rotate: 0, y: 12, scale: 0.96 }, { x: 0, xPercent: 42, rotate: 8, y: 0, scale: 1 }, 0);
      }
    }

    // ── pipeline + review status + new row ──
    const pipeline = root.querySelector<HTMLElement>('[data-pipeline]');
    if (!pipeline) return;
    const ons = q('[data-pipe-on]');
    const line = root.querySelector<HTMLElement>('[data-pipe-line]');
    const pills = q('[data-status]');
    const newRows = q('[data-m="new-row"]');
    const axis = isDesktop ? 'scaleX' : 'scaleY';

    const setStatus = (state: StatusState) => {
      pills.forEach((pill) => {
        const prev = pill.getAttribute('data-state') as StatusState | null;
        pill.setAttribute('data-state', state);
        const from = prev ? statuses[prev] : statuses.approved;
        for (const el of [pill, ...Array.from(pill.querySelectorAll<HTMLElement>('*'))]) {
          for (const n of Array.from(el.childNodes)) {
            const v = n.nodeType === Node.TEXT_NODE ? n.textContent?.trim() : undefined;
            if (v && (v === from || v === statuses.ai || v === statuses.community || v === statuses.approved)) n.textContent = statuses[state];
          }
        }
      });
    };

    if (pipeline.getBoundingClientRect().top <= vh) return; // on screen at init: final

    const tl = gsap.timeline({ paused: true });
    const steps = ons.length;
    ons.forEach((on, i) => {
      tl.fromTo(on, { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.42, ease: 'back.out(1.8)' }, i * STEP_GAP);
    });
    if (line && steps > 1) {
      tl.fromTo(line, { [axis]: 0 }, { [axis]: 1, duration: (steps - 1) * STEP_GAP, ease: 'none' }, 0.1);
    }
    if (pills.length) {
      tl.call(() => setStatus('ai'), undefined, 1 * STEP_GAP);
      tl.call(() => setStatus('community'), undefined, 2 * STEP_GAP);
      tl.call(() => setStatus('approved'), undefined, 3 * STEP_GAP);
      tl.fromTo(pills, { scale: 1 }, { scale: 1.08, duration: 0.14, yoyo: true, repeat: 5, ease: 'power2.out', immediateRender: false }, STEP_GAP);
    }
    if (newRows.length) {
      tl.fromTo(newRows, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.6)' }, 3 * STEP_GAP + 0.4);
    }
    // start state (fromTo tweens rendered their from-values already)
    tl.progress(0);
    if (pills.length) setStatus('ai');

    ScrollTrigger.create({ trigger: pipeline, start: 'top 75%', once: true, onEnter: () => void tl.play() });

    return () => {
      tl.progress(1).kill();
      if (pills.length) setStatus('approved');
    };
  });

  return <span ref={anchor} hidden />;
}
