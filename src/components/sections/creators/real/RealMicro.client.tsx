'use client';

import { useMicro } from '../_shared/use-micro';
import { EASE_OUT, Sequence, belowFold, isRendered, onEnter, stripAttr } from '../_shared/micro';

/** The copy of a mock box that is laid out at this breakpoint (phone ≥1024, slice below). */
const visibleIn = (box: HTMLElement): HTMLElement | null =>
  Array.from(box.querySelectorAll<HTMLElement>(':scope > .cr-only-desk, :scope > .cr-only-mob')).find(isRendered) ?? null;

/**
 * #real micro-sequences (spec §6.7), once each at `top 70%`:
 * - thread: follower → AI → follower bubbles rise, the per-chat switch flips
 *   to paused (clone replies off), then the solid official reply lands and
 *   its verified check draws (stroke-dashoffset 1 → 0).
 * - LIVE: the settings switches come on one by one and the archive DL chip
 *   pops (the LIVE中 dot is a CSS loop, in view only).
 * Server HTML is the final state; reduced motion never runs.
 */
export function RealMicro() {
  const anchor = useMicro('#real', (root) => {
    const seqs: Sequence[] = [];
    const offs: (() => void)[] = [];
    const arm = (box: HTMLElement | null, build: (el: HTMLElement, seq: Sequence) => void) => {
      const el = box && visibleIn(box);
      if (!el || !belowFold(el)) return;
      const seq = new Sequence();
      build(el, seq);
      seqs.push(seq);
      offs.push(onEnter(el, () => seq.play()));
    };

    arm(root.querySelector('[data-mock-box="thread"]'), (el, seq) => {
      el.querySelectorAll('[data-m="msg"]').forEach((m, i) => seq.rise(m, 150 + i * 380, 14));
      const pause = el.querySelector('[data-toggle="pause"]');
      if (pause) {
        seq.set(
          () => pause.setAttribute('data-on', ''),
          () => pause.removeAttribute('data-on'),
        );
        seq.at(1500, () => pause.removeAttribute('data-on'));
      }
      seq.rise(el.querySelector('[data-m="official"]'), 2000, 18);
      seq.anim(el.querySelector('[data-m="verified"] [data-draw]'), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: 520,
        delay: 2350,
        easing: EASE_OUT,
      });
    });

    arm(root.querySelector('[data-mock-box="live"]'), (el, seq) => {
      el.querySelectorAll('[data-toggle]').forEach((t, i) => {
        const put = stripAttr(seq, t, 'data-on');
        seq.at(350 + i * 260, put);
      });
      seq.pop(el.querySelector('[data-m="dl"]'), 1300, 0.5);
    });

    return () => {
      offs.forEach((f) => f());
      seqs.forEach((s) => s.kill());
    };
  });
  return <span ref={anchor} hidden />;
}
