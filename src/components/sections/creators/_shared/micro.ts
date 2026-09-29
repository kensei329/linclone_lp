// Tiny, dependency-free micro-sequence engine for the /creators mockups
// (spec §6 table "Motion triggers"). Server HTML is always the FINAL state;
// these helpers only ever *prime* a start state on content the reader cannot
// see yet, then play it back to that same final state. Everything is
// transform / opacity / attribute toggles, via the Web Animations API, so no
// GSAP is needed for one-shot micro-interactions.

export const EASE_POP = 'cubic-bezier(.34,1.56,.64,1)';
export const EASE_OUT = 'cubic-bezier(.215,.61,.355,1)';
export const EASE_INOUT = 'cubic-bezier(.645,.045,.355,1)';

export const reducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isDesktop = (): boolean => window.matchMedia('(min-width: 1024px)').matches;

/** True when `el` sits entirely below the viewport (safe to prime a start state). */
export const belowFold = (el: Element): boolean => el.getBoundingClientRect().top > window.innerHeight;

/** Hidden by layout (display:none ancestor, e.g. the other breakpoint's copy). */
export const isRendered = (el: HTMLElement): boolean => el.getClientRects().length > 0;

/** Runs `cb` once when `el` crosses the given band (default: its top passes 70% of the viewport). */
export function onEnter(el: Element, cb: () => void, rootMargin = '0px 0px -30% 0px'): () => void {
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      cb();
    },
    { rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}

/**
 * A sequence of timed steps plus primed WAAPI animations. `prime()` puts every
 * animation at its first keyframe (paused), `play()` runs them and the timed
 * steps, `kill()` restores the server state.
 */
export class Sequence {
  private anims: Animation[] = [];
  private timers: ReturnType<typeof setTimeout>[] = [];
  private steps: { at: number; run: () => void }[] = [];
  private restores: (() => void)[] = [];
  played = false;

  /** A primed (paused at t=0, fill both) animation that starts at `delay` ms after play(). */
  anim(el: Element | null | undefined, keyframes: Keyframe[], opts: { duration: number; delay?: number; easing?: string }): this {
    if (!el) return this;
    const a = el.animate(keyframes, { duration: opts.duration, delay: opts.delay ?? 0, easing: opts.easing ?? EASE_OUT, fill: 'both' });
    a.pause();
    a.currentTime = 0;
    a.onfinish = () => a.cancel();
    this.anims.push(a);
    return this;
  }

  pop(el: Element | null | undefined, delay = 0, from = 0.6): this {
    return this.anim(el, [{ transform: `scale(${from})`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 440, delay, easing: EASE_POP });
  }

  rise(el: Element | null | undefined, delay = 0, y = 12): this {
    return this.anim(el, [{ transform: `translateY(${y}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, delay, easing: EASE_OUT });
  }

  /** Runs `run` at `at` ms after play(). */
  at(at: number, run: () => void): this {
    this.steps.push({ at, run });
    return this;
  }

  /** Sets a start state now and registers how to restore the server state on kill(). */
  set(apply: () => void, restore: () => void): this {
    apply();
    this.restores.push(restore);
    return this;
  }

  play(): void {
    if (this.played) return;
    this.played = true;
    this.anims.forEach((a) => a.play());
    this.steps.forEach((s) => this.timers.push(setTimeout(s.run, s.at)));
  }

  kill(): void {
    this.timers.forEach(clearTimeout);
    this.anims.forEach((a) => a.cancel());
    this.restores.forEach((r) => r());
    this.timers = [];
    this.anims = [];
    this.restores = [];
  }
}

/** Removes a boolean attribute now (start state) and puts it back on restore. */
export function stripAttr(seq: Sequence, el: Element | null | undefined, attr: string): (() => void) {
  if (!el || !el.hasAttribute(attr)) return () => {};
  const value = el.getAttribute(attr) ?? '';
  const put = () => el.setAttribute(attr, value);
  seq.set(() => el.removeAttribute(attr), put);
  return put;
}

/** Same for a class name. */
export function stripClass(seq: Sequence, el: Element | null | undefined, cls: string): (() => void) {
  if (!el || !el.classList.contains(cls)) return () => {};
  const put = () => el.classList.add(cls);
  seq.set(() => el.classList.remove(cls), put);
  return put;
}

/** Types `el`'s text from empty back to the server text (capped duration). */
export function typeText(seq: Sequence, el: Element | null | undefined, start: number, perChar = 30, cap = 2400): number {
  if (!el) return start;
  const full = el.textContent ?? '';
  const chars = Array.from(full);
  const step = Math.min(perChar, cap / Math.max(chars.length, 1));
  seq.set(
    () => {
      el.textContent = '';
    },
    () => {
      el.textContent = full;
    },
  );
  chars.forEach((_, i) => seq.at(start + i * step, () => (el.textContent = chars.slice(0, i + 1).join(''))));
  return start + chars.length * step;
}

/** Counts an `m:ss` timer text from 0:00 up to the server value. */
export function countClock(seq: Sequence, el: Element | null | undefined, start: number, duration: number): void {
  if (!el) return;
  const full = el.textContent ?? '';
  const m = full.match(/(\d+):(\d{2})/);
  if (!m) return;
  const total = Number(m[1]) * 60 + Number(m[2]);
  const fmt = (s: number) => full.replace(m[0], `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`);
  seq.set(
    () => {
      el.textContent = fmt(0);
    },
    () => {
      el.textContent = full;
    },
  );
  for (let s = 1; s <= total; s++) seq.at(start + (duration * s) / total, () => (el.textContent = fmt(s)));
}
