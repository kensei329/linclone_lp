'use client';

import { useMicro } from '../_shared/use-micro';
import { EASE_POP, Sequence, belowFold, countClock, isDesktop, onEnter, stripAttr, stripClass, typeText } from '../_shared/micro';

type Key = 'picks' | 'words' | 'photos' | 'modes' | 'ng' | 'voice';
const KEYS: Key[] = ['picks', 'words', 'photos', 'modes', 'ng', 'voice'];

const press = (el: Element) => el.animate([{ transform: 'scale(.9)' }, { transform: 'none' }], { duration: 300, easing: EASE_POP });

/** Primes one setup screen's micro-sequence (spec §6.4) inside `box`; play() runs it. */
function build(key: Key, box: Element, seq: Sequence): void {
  const all = (sel: string) => Array.from(box.querySelectorAll<HTMLElement>(sel));
  switch (key) {
    case 'picks':
      // Chips tap themselves in sequence, .3s apart: 私 → 標準語 → 音楽 → 料理.
      all('[data-m="pick"]').forEach((chip, i) => {
        const put = stripClass(seq, chip, 'is-selected');
        seq.at(300 + i * 300, () => {
          put();
          press(chip);
        });
      });
      break;
    case 'words': {
      // The sample types itself (30ms/char, ≤2.4s); links go analyzing → analyzed ✓ after 2.2s.
      typeText(seq, box.querySelector('[data-m="text"]'), 200, 30, 2400);
      all('[data-m="link-wiki"], [data-m="link-yt"]').forEach((row, i) => {
        seq.set(
          () => row.setAttribute('data-state', 'analyzing'),
          () => row.setAttribute('data-state', 'analyzed'),
        );
        seq.at(2200 + i * 360, () => row.setAttribute('data-state', 'analyzed'));
      });
      break;
    }
    case 'photos':
      // Three aura photos pop, then the メイン badge pops on the first.
      all('[data-m="photo"]').forEach((ph, i) => seq.pop(ph, 120 + i * 130, 0.82));
      seq.pop(box.querySelector('[data-m="main"]'), 120 + 3 * 130 + 160, 0.4);
      break;
    case 'modes':
      // The six free modes light up, one after another.
      all('[data-m="mode"]').forEach((row, i) => {
        const put = stripAttr(seq, row.querySelector('[data-toggle]'), 'data-on');
        seq.at(260 + i * 90, put);
      });
      break;
    case 'ng':
      // Switches flip one by one (.3s): the row turns pink and the NG badge shows; then the custom chip pops.
      all('[data-m="ng-row"]').forEach((row, i) => {
        const put = stripAttr(seq, row.querySelector('[data-toggle]'), 'data-on');
        seq.at(300 + i * 300, put);
      });
      seq.pop(box.querySelector('[data-m="custom"]'), 300 + 5 * 300 + 120, 0.5);
      break;
    case 'voice':
      // The timer counts 0:00 → 0:24 while the meter fills to .6 (no labels, a timer only).
      countClock(seq, box.querySelector('[data-m="clock"]'), 200, 2400);
      seq.anim(box.querySelector('[data-m="meter"]'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(.6)' }], { duration: 2400, delay: 200, easing: 'linear' });
      break;
  }
}

/**
 * #setup micro-sequences (spec §6 motion table, §6.4). Desktop: the step whose
 * block crosses 55% of the viewport becomes current (the rail dot lights,
 * others dim) and its phone screen plays once; screens are primed while they
 * are still hidden in the ScreenStack. Mobile: each card's slice plays once on
 * enter. The ready card's ring fills. Reduced motion: never runs (server
 * HTML is every screen's final state). Crossing the breakpoint restores the
 * final state.
 */
export function SetupMicro() {
  const anchor = useMicro('#setup', (root) => {
    const seqs: Sequence[] = [];
    const offs: (() => void)[] = [];
    const cards = KEYS.map((k) => root.querySelector<HTMLElement>(`.ss-step-card[data-step="setup-${k}"]`));

    if (isDesktop()) {
      const screens = Array.from(root.querySelectorAll<HTMLElement>('.ss-phone [data-screen]'));
      const byIndex: (Sequence | null)[] = KEYS.map((k, i) => {
        const scr = screens[i];
        // Screen 0 is visible from the start: prime it only while the section is below the fold.
        if (!scr || (i === 0 && !belowFold(root.querySelector('.sticky-steps') ?? root))) return null;
        const seq = new Sequence();
        build(k, scr, seq);
        seqs.push(seq);
        return seq;
      });
      const setCurrent = (i: number) => {
        cards.forEach((c, j) => c?.toggleAttribute('data-current', j === i));
        byIndex[i]?.play();
      };
      root.setAttribute('data-steps-live', '');
      setCurrent(0);
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const i = cards.indexOf(e.target as HTMLElement);
            if (i >= 0) setCurrent(i);
          }
        },
        { rootMargin: '-54% 0px -45% 0px' },
      );
      cards.forEach((c) => c && io.observe(c));
      offs.push(() => {
        io.disconnect();
        root.removeAttribute('data-steps-live');
        cards.forEach((c) => c?.removeAttribute('data-current'));
      });
    } else {
      cards.forEach((card, i) => {
        const slice = card?.querySelector('.ss-slice');
        if (!card || !slice || !belowFold(card)) return;
        const seq = new Sequence();
        build(KEYS[i], slice, seq);
        seqs.push(seq);
        offs.push(onEnter(slice, () => seq.play(), '0px 0px -25% 0px'));
      });
    }

    // Ready card: the ring fills to full and the check pops.
    const ready = root.querySelector<HTMLElement>('.cr-ready');
    if (ready && belowFold(ready)) {
      const seq = new Sequence()
        .anim(ready.querySelector('[data-ring]'), [{ '--p': 0 }, { '--p': 100 }], { duration: 1400, delay: 150 })
        .pop(ready.querySelector('.cr-ready-check'), 1350, 0.3);
      seqs.push(seq);
      offs.push(onEnter(ready, () => seq.play(), '0px 0px -20% 0px'));
    }

    const mq = window.matchMedia('(min-width: 1024px)');
    const restore = () => {
      offs.forEach((f) => f());
      seqs.forEach((s) => s.kill());
    };
    mq.addEventListener('change', restore, { once: true });
    return () => {
      mq.removeEventListener('change', restore);
      restore();
    };
  });
  return <span ref={anchor} hidden />;
}
