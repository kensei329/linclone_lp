'use client';

import { useMicro } from '../_shared/use-micro';
import { EASE_OUT, Sequence, belowFold, onEnter, stripAttr } from '../_shared/micro';

/** Primes one #control card's micro (spec §6.6); `d` staggers cards that enter together. */
function build(key: string, card: HTMLElement, seq: Sequence, d: number): void {
  const one = (sel: string) => card.querySelector<HTMLElement>(sel);
  switch (key) {
    case 'grow': {
      // 承認 presses (.96), then the card morphs to approved (teal wash, text swap).
      const gc = one('[data-m="grow-card"]');
      if (!gc) return;
      seq.set(
        () => gc.setAttribute('data-state', 'pending'),
        () => gc.setAttribute('data-state', 'approved'),
      );
      seq.at(d + 700, () => one('[data-m="approve"]')?.animate([{ scale: '1' }, { scale: '.96' }, { scale: '1' }], { duration: 320, easing: EASE_OUT }));
      seq.at(d + 960, () => gc.setAttribute('data-state', 'approved'));
      break;
    }
    case 'ng':
      // Two switches flip pink (the row styling follows the switch).
      Array.from(card.querySelectorAll('[data-m="ng-row"]'))
        .slice(0, 2)
        .forEach((row, i) => {
          const put = stripAttr(seq, row.querySelector('[data-toggle]'), 'data-on');
          seq.at(d + 450 + i * 320, put);
        });
      break;
    case 'profile': {
      // The AI-images switch flips off once; its sub line highlights (CSS :has()).
      const t = one('[data-toggle="ai-images"]');
      if (!t) return;
      seq.set(
        () => undefined,
        () => t.setAttribute('data-on', ''),
      );
      seq.at(d + 800, () => t.removeAttribute('data-on'));
      break;
    }
    case 'labels':
      // The AI-label chip pops and the label ribbon slides over the first image.
      seq.anim(one('[data-m="ribbon"]'), [{ transform: 'translateX(-104%)' }, { transform: 'none' }], { duration: 520, delay: d + 300, easing: EASE_OUT });
      seq.pop(one('[data-m="label-chip"]'), d + 700, 0.5);
      break;
  }
}

/**
 * #control card micro-interactions (spec §6 motion table): each card plays
 * once when its top passes 70% of the viewport; cards entering together are
 * 0.3s apart. Primed only below the fold; reduced motion never runs.
 */
export function ControlMicro() {
  const anchor = useMicro('#control', (root) => {
    const seqs: Sequence[] = [];
    const offs: (() => void)[] = [];
    Array.from(root.querySelectorAll<HTMLElement>('.cr-bento-item[data-card]')).forEach((card, i) => {
      if (!belowFold(card)) return;
      const seq = new Sequence();
      build(card.dataset.card ?? '', card, seq, (i % 2) * 300);
      seqs.push(seq);
      offs.push(onEnter(card, () => seq.play()));
    });
    return () => {
      offs.forEach((f) => f());
      seqs.forEach((s) => s.kill());
    };
  });
  return <span ref={anchor} hidden />;
}
