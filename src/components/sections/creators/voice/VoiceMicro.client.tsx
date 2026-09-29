'use client';

import { useMicro } from '../_shared/use-micro';
import { EASE_POP, Sequence, belowFold, onEnter, stripAttr } from '../_shared/micro';

const TOGGLE_MS = 2400;

/**
 * #voice card micros (spec §6.8):
 * - homeVoice: the pipeline chips light draft → synth → published, then the
 *   check pops (once, at `top 70%`).
 * - morning: the tone Segmented toggles gentle ↔ casual every 2.4s while in
 *   view (the list follows through CSS :has(), fade .26s); it pauses on hover,
 *   focus and hidden tabs, and returns to "gentle" when it stops.
 * - fillers: the chosen tone card re-selects with a press (its waveform is a
 *   CSS loop, in view only).
 * Reduced motion never runs: the server shows every final state.
 */
export function VoiceMicro() {
  const anchor = useMicro('#voice', (root) => {
    const seqs: Sequence[] = [];
    const offs: (() => void)[] = [];
    const card = (k: string) => root.querySelector<HTMLElement>(`[data-card="${k}"]`);

    const hv = card('homeVoice');
    if (hv && belowFold(hv)) {
      const seq = new Sequence();
      hv.querySelectorAll('[data-m="pipe"]').forEach((chip, i) => {
        const put = stripAttr(seq, chip, 'data-lit');
        seq.at(350 + i * 480, () => {
          put();
          chip.animate([{ transform: 'scale(.88)' }, { transform: 'none' }], { duration: 360, easing: EASE_POP });
        });
      });
      seq.pop(hv.querySelector('[data-m="pipe-check"]'), 350 + 3 * 480, 0.3);
      seqs.push(seq);
      offs.push(onEnter(hv, () => seq.play()));
    }

    const fl = card('fillers');
    const chosen = fl?.querySelector<HTMLElement>('[data-tone-card][data-selected]');
    if (fl && chosen && belowFold(fl)) {
      const seq = new Sequence();
      const put = stripAttr(seq, chosen, 'data-selected');
      seq.at(650, () => {
        put();
        chosen.animate([{ transform: 'scale(.95)' }, { transform: 'none' }], { duration: 380, easing: EASE_POP });
      });
      seqs.push(seq);
      offs.push(onEnter(fl, () => seq.play()));
    }

    // Morning: auto-toggle in view only; pause on hover / focus / hidden tab.
    const mo = card('morning');
    const segs = mo ? Array.from(mo.querySelectorAll<HTMLElement>('[data-m="seg"] .segmented > span')) : [];
    if (mo && segs.length === 2) {
      let active = segs.findIndex((s) => s.hasAttribute('data-selected'));
      let inView = false;
      let held = false;
      let timer: ReturnType<typeof setInterval> | undefined;
      const select = (i: number) => {
        active = i;
        segs.forEach((s, j) => s.toggleAttribute('data-selected', j === i));
      };
      const sync = () => {
        const run = inView && !held && !document.hidden;
        if (run && !timer) timer = setInterval(() => select(active === 0 ? 1 : 0), TOGGLE_MS);
        if (!run && timer) {
          clearInterval(timer);
          timer = undefined;
        }
      };
      const io = new IntersectionObserver(([e]) => {
        inView = e.isIntersecting;
        sync();
      });
      io.observe(mo);
      const hold = () => {
        held = true;
        sync();
      };
      const release = () => {
        held = mo.matches(':hover') || mo.contains(document.activeElement);
        sync();
      };
      mo.addEventListener('pointerenter', hold);
      mo.addEventListener('pointerleave', release);
      mo.addEventListener('focusin', hold);
      mo.addEventListener('focusout', release);
      document.addEventListener('visibilitychange', sync);
      offs.push(() => {
        io.disconnect();
        clearInterval(timer);
        mo.removeEventListener('pointerenter', hold);
        mo.removeEventListener('pointerleave', release);
        mo.removeEventListener('focusin', hold);
        mo.removeEventListener('focusout', release);
        document.removeEventListener('visibilitychange', sync);
        select(0);
      });
    }

    return () => {
      offs.forEach((f) => f());
      seqs.forEach((s) => s.kill());
    };
  });
  return <span ref={anchor} hidden />;
}
