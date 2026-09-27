'use client';

import { Fragment, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { gsap as GsapType } from 'gsap';
import type { Locale } from '@/i18n/config';
import { loadMotion } from '@/lib/motion/load';
import { track } from '@/lib/analytics';

export type CallDemoStrings = {
  button: string;
  tag: string;
  startLabel: string;
  captionsLabel: string;
  lineOne: string;
  hint: string;
  lineTwo: string;
  doneTitle: string;
  doneBody: string;
  note: string;
  replay: string;
  paused: string;
  /** 「デモ」 tag shown in the stage while the demo runs (common.demo) */
  live: string;
  /** label of the button while running (it ends the demo) */
  stop: string;
};

export type CallDemoProps = {
  lang: Locale;
  strings: CallDemoStrings;
  /** server-computed line-break phrases (BudouX for JA, words for EN) */
  phrases: Record<'lineOne' | 'hint' | 'lineTwo', string[]>;
  /** server-rendered icons (client islands never import the icon set) */
  icons: { call: ReactNode; end: ReactNode; done: ReactNode; replay: ReactNode };
  /** `<StoreBadges placement="demo" qr />`, rendered on the server */
  badges: ReactNode;
};

type Phase = 'idle' | 'running' | 'done';
type Timeline = ReturnType<typeof GsapType.timeline>;
type Ctx = ReturnType<typeof GsapType.context>;
type LineKey = 'lineOne' | 'hint' | 'lineTwo';

const LINES: { key: LineKey; tone: 'line' | 'hint' }[] = [
  { key: 'lineOne', tone: 'line' },
  { key: 'hint', tone: 'hint' },
  { key: 'lineTwo', tone: 'line' },
];
/** Avatar-glow beat envelope (§5.4): 60ms up, 200ms down. */
const BEATS = [0.82, 1.35, 0.9, 1.5, 1, 1.3, 0.88, 1.2];
const DURATION = 14;

const graphemes = (s: string, lang: Locale) => Array.from(new Intl.Segmenter(lang, { granularity: 'grapheme' }).segment(s), (g) => g.segment);
const noop = () => () => {};
const findRoot = () => document.querySelector<HTMLElement>('#call [data-demo-root]');
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Captions-only tap-to-call demo (spec §5.4). Portals into the stage's
 * `[data-demo-root]` (replacing the server `#download` link), runs a 14s
 * time-based timeline over the stage hooks (state, meter, glows) with the
 * caption strip above the button, then pops the done card with the store
 * badges. No audio. Pauses off-screen, never locks scrolling, can be stopped.
 * Reduced motion: a static transcript and the done card. Lite: captions only.
 */
export function CallDemo({ lang, strings: t, phrases, icons, badges }: CallDemoProps) {
  // The demo root is server-rendered by CallStageMedia and never replaced.
  const host = useSyncExternalStore(noop, findRoot, () => null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [paused, setPaused] = useState(false);
  const [srLine, setSrLine] = useState('');
  const [transcript, setTranscript] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const ring1 = useRef<HTMLSpanElement>(null);
  const ring2 = useRef<HTMLSpanElement>(null);
  const run = useRef<{ tl: Timeline; ctx: Ctx; stop: () => void } | null>(null);

  const units = useMemo(
    () => Object.fromEntries(LINES.map((l) => [l.key, phrases[l.key].map((ph) => graphemes(ph, lang))])) as Record<LineKey, string[][]>,
    [phrases, lang],
  );

  // Take over the demo root: the server link is hidden while this island lives.
  useEffect(() => {
    if (!host) return;
    host.setAttribute('data-demo-enhanced', '');
    return () => {
      host.removeAttribute('data-demo-enhanced');
      run.current?.stop();
    };
  }, [host]);

  // Pause off-screen (threshold .25) and while the tab is hidden; resume on return.
  useEffect(() => {
    if (!host || phase !== 'running') return;
    let visible = true;
    const apply = () => {
      const tl = run.current?.tl;
      if (!tl) return;
      const hold = !visible || document.hidden;
      if (hold) tl.pause();
      else tl.resume();
      setPaused(hold);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        apply();
      },
      { threshold: 0.25 },
    );
    io.observe(host);
    document.addEventListener('visibilitychange', apply);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', apply);
    };
  }, [host, phase]);

  // While the done card shows, the stage captions step back (CSS on
  // [data-demo-done]); scrolling back into the story (lc:call-rewind, from
  // the stage animator) resets the demo to its button.
  useEffect(() => {
    if (phase !== 'done') return;
    const call = document.getElementById('call');
    call?.setAttribute('data-demo-done', '');
    const rewind = () => setPhase('idle');
    window.addEventListener('lc:call-rewind', rewind);
    return () => {
      call?.removeAttribute('data-demo-done');
      window.removeEventListener('lc:call-rewind', rewind);
    };
  }, [phase]);

  // The done card pops in (back.out(1.6) .45s) and takes focus.
  useEffect(() => {
    if (phase !== 'done') return;
    titleRef.current?.focus({ preventScroll: true });
    const card = doneRef.current;
    if (!card || reduceMotion()) return;
    let tween: { kill: () => void } | undefined;
    void loadMotion().then(({ gsap }) => {
      tween = gsap.fromTo(card, { scale: 0.9, autoAlpha: 0, y: 12 }, { scale: 1, autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)', clearProps: 'transform,opacity,visibility' });
    });
    return () => tween?.kill();
  }, [phase]);

  const stage = () => {
    const call = document.getElementById('call');
    const media = call?.querySelector<HTMLElement>('[data-stage-media]') ?? null;
    const one = (sel: string) => media?.querySelector<HTMLElement>(sel) ?? null;
    const meterHook = one('[data-meter]');
    const meter =
      meterHook && !meterHook.children.length
        ? meterHook
        : (Array.from(meterHook?.querySelectorAll<HTMLElement>('*') ?? []).find((n) => !n.children.length && /^\d:\d{2}$/.test(n.textContent?.trim() ?? '')) ?? meterHook);
    return {
      call,
      callRoot: one('[data-mock="CallStageMedia"]') ?? one('[data-call-state]')?.closest<HTMLElement>('[data-state]') ?? null,
      avatarGlow: one('[data-avatar-glow]'),
      fanGlow: one('[data-fan-glow]'),
      wave: one('[data-wave]'),
      meter,
      captions: Array.from(media?.querySelectorAll<HTMLElement>('[data-caption], [data-toast]') ?? []),
    };
  };

  const start = async () => {
    if (phase === 'running') return;
    window.dispatchEvent(new Event('lc:demo-start'));
    track('demo_start', { lang });

    if (reduceMotion()) {
      setTranscript(true);
      setPhase('done');
      window.dispatchEvent(new Event('lc:demo-end'));
      track('demo_complete', { lang });
      return;
    }

    setTranscript(false);
    setPhase('running');
    const { gsap } = await loadMotion();
    // Let React commit the running UI (the strip) before building on it.
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    const s = stage();
    const strip = stripRef.current;
    if (!strip) return;
    const fx = !document.documentElement.hasAttribute('data-lite');
    const prevState = s.callRoot?.dataset.state ?? 'speaking';
    const prevMeter = s.meter?.textContent ?? '0:60';
    const setState = (v: string) => {
      if (s.callRoot) s.callRoot.dataset.state = v;
    };
    const setMeter = (sec: number) => {
      if (s.meter) s.meter.textContent = `0:${String(sec).padStart(2, '0')}`;
    };
    s.call?.setAttribute('data-demo', 'running');

    // A logo burst inside the portrait ring when 推し picks up.
    let burst: HTMLSpanElement | null = null;
    if (fx && s.avatarGlow?.parentElement) {
      burst = document.createElement('span');
      burst.className = 'cd-burst';
      burst.setAttribute('aria-hidden', 'true');
      s.avatarGlow.parentElement.appendChild(burst);
    }

    const ctx = gsap.context(() => {});
    let tl!: Timeline;
    ctx.add(() => {
      const lines = Array.from(strip.querySelectorAll<HTMLElement>('[data-line]'));
      const line = (k: LineKey) => lines.find((l) => l.dataset.line === k);
      const perChar = lang === 'en' ? 0.025 : 0.045;

      gsap.set(lines, { autoAlpha: 0 });
      gsap.set(strip.querySelectorAll('[data-c]'), { opacity: 0 });
      if (s.captions.length) gsap.to(s.captions, { autoAlpha: 0, duration: 0.25 });
      if (s.avatarGlow) gsap.set(s.avatarGlow, { animation: 'none' });

      tl = gsap.timeline({ onComplete: () => finish(true) });

      // 0 · connecting: squeeze, two ripples, the meter resets.
      tl.call(() => {
        setState('connecting');
        setMeter(60);
      }, [], 0);
      if (btnRef.current) tl.fromTo(btnRef.current, { scale: 1 }, { scale: 0.96, duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.out' }, 0);
      if (fx) {
        [ring1.current, ring2.current].forEach((r, i) => {
          if (r) tl.fromTo(r, { scale: 1, opacity: 0.6 }, { scale: 6, opacity: 0, duration: 1.2, ease: 'power2.out' }, i * 0.3);
        });
        if (s.avatarGlow) tl.to(s.avatarGlow, { autoAlpha: 0.3, scale: 0.9, duration: 0.3 }, 0);
        if (s.fanGlow) tl.to(s.fanGlow, { autoAlpha: 0, duration: 0.2 }, 0);
      }
      if (s.wave) tl.to(s.wave, { '--amp': 0.2, duration: 0.3 }, 0);
      for (let i = 1; i <= DURATION; i++) tl.call(setMeter, [60 - i], i);

      const say = (k: LineKey, at: number) => {
        const el = line(k);
        if (!el) return;
        tl.call(() => setSrLine(t[k]), [], at);
        tl.set(el, { autoAlpha: 1 }, at);
        const cs = el.querySelectorAll('[data-c]');
        if (k === 'hint') tl.to(cs, { opacity: 1, duration: 0.3 }, at);
        else tl.to(cs, { opacity: 1, duration: 0.12, stagger: perChar, ease: 'none' }, at);
      };
      const clear = (k: LineKey, at: number) => {
        const el = line(k);
        if (el) tl.to(el, { autoAlpha: 0, duration: 0.2 }, at);
      };
      const beats = (from: number, to: number) => {
        if (!fx || !s.avatarGlow) return;
        tl.to(s.avatarGlow, { autoAlpha: 1, duration: 0.15 }, from);
        let at = from;
        let prev = 1;
        while (at < to) {
          for (const v of BEATS) {
            const d = v > prev ? 0.06 : 0.2;
            if (at + d > to) break;
            tl.to(s.avatarGlow, { scale: v, duration: d, ease: v > prev ? 'power2.out' : 'sine.inOut' }, at);
            at += d;
            prev = v;
          }
          if (at + 0.26 > to) break;
        }
        tl.to(s.avatarGlow, { scale: 1, duration: 0.2 }, Math.max(from, to - 0.2));
      };

      // 1.2 · speaking: burst, beats, line one typed.
      tl.call(setState, ['speaking'], 1.2);
      if (burst) tl.fromTo(burst, { scale: 1, opacity: 0.5 }, { scale: 3, opacity: 0, duration: 0.6, ease: 'power2.out' }, 1.2);
      if (s.wave) tl.to(s.wave, { '--amp': 1.25, duration: 0.3 }, 1.2);
      say('lineOne', 1.2);
      beats(1.3, 5.5);

      // 5.5 · listening: the light comes back to the fan.
      tl.call(setState, ['listening'], 5.5);
      clear('lineOne', 5.4);
      say('hint', 5.6);
      if (s.wave) tl.to(s.wave, { '--amp': 0.35, duration: 0.3 }, 5.5);
      if (fx && s.avatarGlow) tl.to(s.avatarGlow, { autoAlpha: 0, duration: 0.2 }, 5.5);
      if (fx && s.fanGlow) {
        tl.fromTo(s.fanGlow, { yPercent: 40, y: 0, autoAlpha: 0, scale: 0.95 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out' }, 5.5);
        tl.to(s.fanGlow, { scale: 1.1, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 5.95);
        // 8.6 · thinking: it drifts up and fades.
        tl.to(s.fanGlow, { y: -140, autoAlpha: 0, duration: 0.45, ease: 'power3.inOut' }, 8.6);
      }
      tl.call(setState, ['thinking'], 8.6);

      // 9.4 · speaking again: line two.
      clear('hint', 9.2);
      tl.call(setState, ['speaking'], 9.4);
      if (s.wave) tl.to(s.wave, { '--amp': 1.25, duration: 0.3 }, 9.4);
      say('lineTwo', 9.4);
      beats(9.5, 13.4);
      tl.to({}, { duration: 0.01 }, DURATION);
    });

    const finish = (completed: boolean) => {
      if (!run.current) return;
      run.current = null;
      tl.kill();
      ctx.revert();
      burst?.remove();
      setState(prevState);
      if (s.meter) s.meter.textContent = prevMeter;
      s.call?.removeAttribute('data-demo');
      setPaused(false);
      setSrLine('');
      window.dispatchEvent(new Event('lc:demo-end'));
      if (completed) {
        track('demo_complete', { lang });
        setPhase('done');
      } else {
        setPhase('idle');
      }
    };
    run.current = { tl, ctx, stop: () => finish(false) };
  };

  const onButton = () => {
    if (phase === 'running') {
      run.current?.stop();
      btnRef.current?.focus();
    } else void start();
  };

  const replay = () => {
    setPhase('idle');
    void start();
    requestAnimationFrame(() => btnRef.current?.focus({ preventScroll: true }));
  };

  if (!host) return null;
  const running = phase === 'running';

  return createPortal(
    <div className="cd" data-phase={phase}>
      <div role="log" aria-live="polite" aria-label={t.captionsLabel} className="cd-sr">
        {srLine}
      </div>

      {phase === 'done' ? (
        <div ref={doneRef} className="glass-night cd-done">
          <div className="cd-done-head">
            <span className="cd-done-check" aria-hidden="true">
              {icons.done}
            </span>
            <p ref={titleRef} tabIndex={-1} className="t-h3 cd-done-title">
              {t.doneTitle}
            </p>
          </div>
          {transcript ? (
            <ul className="cd-transcript" aria-label={t.captionsLabel}>
              {LINES.map((l) => (
                <li key={l.key} data-tone={l.tone}>
                  {t[l.key]}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="cd-done-body">{t.doneBody}</p>
          <div className="cd-done-dl">{badges}</div>
          <div className="cd-done-foot">
            <p className="t-small cd-done-note">{t.note}</p>
            <button type="button" className="btn-ghost cd-replay" onClick={replay}>
              {icons.replay}
              {t.replay}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div ref={stripRef} className="cd-strip" hidden={!running} aria-hidden="true">
            <span className="cd-strip-tags">
              <span className="cd-live-tag">{t.live}</span>
              {paused ? <span className="cd-paused-tag">{t.paused}</span> : null}
            </span>
            <span className="cd-lines">
              {LINES.map((l) => (
                <p key={l.key} className="cd-line" data-line={l.key} data-tone={l.tone}>
                  {units[l.key].map((ph, i) => (
                    <Fragment key={i}>
                      {i > 0 && lang === 'ja' ? <wbr /> : null}
                      <span className="cd-ph">
                        {ph.map((c, j) => (
                          <span key={j} data-c="">
                            {c}
                          </span>
                        ))}
                      </span>
                    </Fragment>
                  ))}
                </p>
              ))}
            </span>
          </div>
          <span ref={ring1} className="cd-ripple" aria-hidden="true" />
          <span ref={ring2} className="cd-ripple" aria-hidden="true" />
          <button
            ref={btnRef}
            type="button"
            className="btn-night cd-btn"
            data-running={running ? '' : undefined}
            aria-label={running ? t.stop : t.startLabel}
            onClick={onButton}
          >
            <span className="cd-btn-disc" aria-hidden="true">
              {running ? icons.end : icons.call}
            </span>
            <span className="cd-btn-label">{running ? t.stop : t.button}</span>
            <span className="cd-tag">{t.tag}</span>
          </button>
          <p className="t-small cd-note">{t.note}</p>
        </>
      )}
    </div>,
    host,
  );
}
