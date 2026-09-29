'use client';

import { useMicro } from '../_shared/use-micro';
import { EASE_OUT, Sequence, belowFold, isRendered, onEnter } from '../_shared/micro';

/**
 * #insights micro (spec §6.9): the D09 bars grow `scaleY 0 → 1` (origin
 * bottom) over .5s, .05s apart, once at `top 70%`. No values or axes. The D10
 * hourglass turn and skeleton shimmer are CSS loops owned by the mockup.
 */
export function InsightsMicro() {
  const anchor = useMicro('#insights', (root) => {
    const box = root.querySelector<HTMLElement>('[data-mock-box="analytics"]');
    const el = box && Array.from(box.querySelectorAll<HTMLElement>(':scope > .cr-only-desk, :scope > .cr-only-mob')).find(isRendered);
    if (!el || !belowFold(el)) return;
    const seq = new Sequence();
    el.querySelectorAll('[data-bar]').forEach((bar, i) =>
      seq.anim(bar, [{ transform: 'scaleY(0)' }, { transform: 'none' }], { duration: 500, delay: 200 + i * 50, easing: EASE_OUT }),
    );
    const off = onEnter(el.querySelector('[data-bar]') ?? el, () => seq.play(), '0px 0px -20% 0px');
    return () => {
      off();
      seq.kill();
    };
  });
  return <span ref={anchor} hidden />;
}
