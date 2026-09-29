'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useInView } from '@/lib/motion/use-in-view';
import s from './more.module.css';

export type ModeSample = { id: string; label: string; sample: string };

type ModeSamplerProps = {
  /** radiogroup label (`mock.fan.memory.modesHeading`) */
  label: string;
  modes: ModeSample[];
  /** persona display name shown above the bubble */
  name: string;
  /** server-rendered Aura avatar */
  avatar: ReactNode;
  /** server-rendered check glyph for the selected chip */
  check: ReactNode;
};

const CYCLE_MS = 2400;
const TYPE_MS = 400;

/**
 * Relationship-mode sampler (spec §5.9 `more-modes`): six radio chips and a
 * sample bubble. Picking a chip types the mode's sample line into the bubble
 * (.4s). Until the first interaction it auto-cycles every 2.4s while in view,
 * pausing on hover and focus. Reduced motion: no cycling, instant swaps.
 * The bubble's height is reserved by stacking every sample invisibly in one
 * grid cell, so typing never shifts layout. The live region only speaks once
 * the visitor has picked a mode (auto-cycling stays silent).
 */
export function ModeSampler({ label, modes, name, avatar, check }: ModeSamplerProps) {
  const root = useRef<HTMLDivElement>(null);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState<string | null>(null); // null = full text
  const [interacted, setInteracted] = useState(false);
  const [held, setHeld] = useState(false); // hover or focus inside
  const inView = useInView(root, { threshold: 0.35 });
  const activeRef = useRef(0);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  /** Show sample `i`: typed in over .4s, or at once under reduced motion. */
  const select = (i: number) => {
    if (i === activeRef.current) return;
    activeRef.current = i;
    setActive(i);
    cancelAnimationFrame(raf.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(null);
      return;
    }
    const chars = Array.from(modes[i]?.sample ?? '');
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / TYPE_MS);
      setTyped(k >= 1 ? null : chars.slice(0, Math.ceil(chars.length * k)).join(''));
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    setTyped('');
    raf.current = requestAnimationFrame(step);
  };
  const selectRef = useRef(select);
  useEffect(() => {
    selectRef.current = select;
  });

  // Auto-cycle until the first interaction; paused off-screen, on hover/focus and under reduced motion.
  useEffect(() => {
    if (interacted || held || !inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => selectRef.current((activeRef.current + 1) % modes.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [interacted, held, inView, modes.length]);

  const pick = (i: number, focus = false) => {
    setInteracted(true);
    select(i);
    if (focus) chips.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = modes.length;
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (active - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    pick(next, true);
  };

  const current = modes[active];
  const typing = typed !== null;

  return (
    <div
      ref={root}
      className={s.sampler}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      <p className={s.samplerLabel} id="more-modes-label">
        {label}
      </p>
      <div role="radiogroup" aria-labelledby="more-modes-label" className={s.chips} onKeyDown={onKey}>
        {modes.map((m, i) => {
          const on = i === active;
          return (
            <button
              key={m.id}
              ref={(el) => {
                chips.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              className={s.chip}
              data-on={on ? '' : undefined}
              onClick={() => pick(i)}
            >
              <span className={s.chipCheck} aria-hidden="true">
                {check}
              </span>
              {m.label}
            </button>
          );
        })}
      </div>

      <div className={s.thread}>
        <span className={s.threadAvatar} aria-hidden="true">
          {avatar}
        </span>
        <div className={s.threadBody}>
          <p className={s.threadName} aria-hidden="true">
            {name}
          </p>
          <div className={s.bubble} data-typing={typing ? '' : undefined}>
            <span className={s.bubbleStack} aria-hidden="true">
              {modes.map((m) => (
                <span key={m.id} className={s.bubbleGhost}>
                  {m.sample}
                </span>
              ))}
              <span className={s.bubbleText} key={current.id}>
                {typing ? typed : current.sample}
                {typing ? <span className={s.caret} /> : null}
              </span>
            </span>
            <span className={s.srOnly} aria-live={interacted ? 'polite' : 'off'} aria-atomic="true">
              {`${name}: ${current.sample}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
