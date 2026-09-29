'use client';

import { useId, useRef, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from 'react';
import { Glyph } from '@/components/site/icons/Glyph';
import s from './about.module.css';

export type OshiOption = { key: 'rose' | 'teal' | 'lavender' | 'amber' | 'sky' | 'mint'; hex: string; name: string };

type OshiColorPickerProps = { label: string; hint: string; options: OshiOption[] };

const STORAGE_KEY = 'lc.oshi';
const EVENT = 'lc:oshi';

// The current 推し色 lives on <html style="--oshi"> (the head script restores
// it before paint), so it is read as an external store: no state to sync.
const subscribe = (fn: () => void) => {
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
};
const readOshi = () => document.documentElement.style.getPropertyValue('--oshi').trim().toLowerCase();

/**
 * 推し色 picker (spec §5.3): six persona-accent swatches in a radiogroup
 * (roving tabindex, arrow keys). Choosing one writes `--oshi` on <html> and
 * `localStorage['lc.oshi']`; every `oshi` aura re-tints. It never touches the
 * CTA teal. Without JS the swatches render but do nothing.
 */
export function OshiColorPicker({ label, hint, options }: OshiColorPickerProps) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const hintId = `${uid}-hint`;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = useSyncExternalStore(subscribe, readOshi, () => '');
  const found = options.findIndex((o) => o.hex === current);
  const selected = found >= 0 ? found : 0;

  const choose = (i: number, focus = false) => {
    const o = options[(i + options.length) % options.length];
    document.documentElement.style.setProperty('--oshi', o.hex);
    try {
      localStorage.setItem(STORAGE_KEY, o.hex);
    } catch {
      // private mode / blocked storage: the colour still applies for this visit
    }
    window.dispatchEvent(new Event(EVENT));
    if (focus) refs.current[options.indexOf(o)]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in keys) choose(selected + keys[e.key], true);
    else if (e.key === 'Home') choose(0, true);
    else if (e.key === 'End') choose(options.length - 1, true);
    else return;
    e.preventDefault();
  };

  return (
    <div className={s.picker}>
      <p id={labelId} className={s.pickerLabel}>
        {label}
      </p>
      <div role="radiogroup" aria-labelledby={labelId} aria-describedby={hintId} className={s.swatches} onKeyDown={onKeyDown}>
        {options.map((o, i) => (
          <button
            key={o.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={i === selected}
            aria-label={o.name}
            tabIndex={i === selected ? 0 : -1}
            className={s.swatch}
            style={{ '--sw': o.hex } as CSSProperties}
            onClick={() => choose(i)}
          >
            <span className={s.swatchDot}>
              <Glyph name="check" size={14} />
            </span>
          </button>
        ))}
      </div>
      <p id={hintId} className={`t-small ${s.pickerHint}`}>
        {hint}
      </p>
    </div>
  );
}
