'use client';

import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useExpandStage } from '@/lib/motion/use-expand-stage';
import type { FillTarget } from '@/components/site/fill/FillAnimator.client';
import { clock, FREE_SECONDS } from './clock';

const MQ_DESKTOP = '(min-width: 1024px)';

type CallState = 'connecting' | 'listening' | 'thinking' | 'speaking';

/**
 * Beat positions (timeline progress, duration 1). The clip opens over
 * [0.06, 0.30] so the cropped, half-built frame is on screen briefly; every
 * later beat starts from ~0.32 and the demo CTA lands at 0.80 with a hold.
 */
const B = {
  clipDesktop: [0.06, 0.3] as [number, number],
  clipMobile: [0.06, 0.28] as [number, number],
  /** call controls and meter fade in once the clip edge has passed them */
  chrome: [0.28, 0.36] as [number, number],
  /** the fan's turn: light rises from the bottom (listening) */
  fan: 0.32,
  /** thinking: the fan's light drifts up and fades */
  think: 0.445,
  /** the light moves to 推し */
  avatar: 0.475,
  /** 推し speaks: beats, oshi caption fill, meter counts */
  speak: 0.505,
  /** the waveform settles */
  settle: 0.63,
  /** transcript toast and demo CTA arrive (0.80–0.86), then hold */
  demo: 0.8,
} as const;
/** A finished demo resets once its (already faded) card is below the arrival point. */
const REWIND_DONE = B.demo - 0.02;
/** A running demo stops while its root is still half visible, never runs hidden. */
const REWIND_RUNNING = B.demo + 0.03;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const stateAt = (p: number): CallState => (p < B.fan ? 'connecting' : p < B.think ? 'listening' : p < B.speak ? 'thinking' : 'speaking');
/** 1:00 → 0:48 while 推し speaks. */
const meterAt = (p: number) => clock(FREE_SECONDS - Math.round(12 * span(p, B.speak, B.demo)));

/** The external fill target of a `[data-caption]` wrapper (or the element itself). */
function fillTarget(el: Element | null): FillTarget | null {
  if (!el) return null;
  return (el.matches('[data-fill-driver="external"]') ? el : el.querySelector('[data-fill-driver="external"]')) as FillTarget | null;
}

/** The text element of the `1:00` meter (the hook may sit on the value or on its card). */
function meterText(el: Element | null): HTMLElement | null {
  if (!el) return null;
  if (/^\d:\d{2}$/.test(el.textContent?.trim() ?? '') && !el.children.length) return el as HTMLElement;
  return Array.from(el.querySelectorAll<HTMLElement>('*')).find((n) => !n.children.length && /^\d:\d{2}$/.test(n.textContent?.trim() ?? '')) ?? (el as HTMLElement);
}

/**
 * Stage #1 timeline (spec §5.4). `useExpandStage` owns the clip, bezel,
 * background and intro colours; `extend` adds the call beats by progress:
 * hold → handoff (0.05) → expand (0.06–0.30) → controls/meter (0.28–0.36) →
 * fan's turn (0.32) → thinking (0.445) → 推し speaks (0.505) → transcript
 * toast and demo CTA (0.80), see `B`. Discrete state
 * (call state, meter, caption fills) is derived from progress in one onUpdate,
 * so scrubbing backwards always lands on a consistent frame. Lite: the hook's
 * simple reveal, glows by opacity only. Reduced motion: nothing runs.
 */
export function CallStageAnimator() {
  const { anchor, scope } = useAnchorScope('#call');

  useExpandStage(scope, {
    direction: 'expand',
    // Mobile expands sooner (§5.4); read when the scene is (re)built.
    get clip(): [number, number] {
      return window.matchMedia(MQ_DESKTOP).matches ? B.clipDesktop : B.clipMobile;
    },
    introToNight: [0.06, 0.3],
    scrub: 0.5,
    extend: (tl, { gsap, scope: root, isDesktop, lite }) => {
      const media = root.querySelector<HTMLElement>('[data-stage-media]');
      if (!media) return;
      const one = <T extends Element = HTMLElement>(sel: string) => media.querySelector<T>(sel);
      const callRoot =
        one('[data-mock="CallStageMedia"]') ?? one('[data-call-state]')?.closest<HTMLElement>('[data-state]') ?? null;
      const bezelScreen = root.querySelector<HTMLElement>('[data-call-bezel]');
      const more = root.querySelector<HTMLElement>('[data-call-more]');
      const title = root.querySelector<HTMLElement>('#call-title');
      const intro = root.querySelector<HTMLElement>('[data-stage-intro]');
      const fanGlow = one('[data-fan-glow]');
      const avatarGlow = one('[data-avatar-glow]');
      const wave = one('[data-wave]');
      const toast = one('[data-toast]');
      const demo = one('[data-demo-root]');
      const meterHook = one('[data-meter]');
      const meter = meterText(meterHook);
      const meterCard = meterHook?.closest<HTMLElement>('.fm-meter') ?? meterHook;
      const controls = one('[data-call-controls]') ?? one('.fm-call-controls');
      const fanFill = fillTarget(one('[data-caption="fan"]'));
      const oshiFill = fillTarget(one('[data-caption="oshi"]'));

      // 0.05–0.07: the first-call screen hands off to the media under the clip.
      // (Lite has no clip: the screen then fades out with the bezel, a clean crossfade.)
      if (bezelScreen && !lite) tl.fromTo(bezelScreen, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.02 }, 0.05);

      // Mobile: the long lead is read at the start, then clears the way; the
      // call composition lays out under the H2 only (--intro-h on the media).
      let ro: ResizeObserver | undefined;
      if (!isDesktop && more && title && intro) {
        tl.fromTo(more, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -12, duration: 0.1 }, 0.1);
        const measure = () => media.style.setProperty('--intro-h', `${Math.ceil(intro.offsetTop + title.offsetTop + title.offsetHeight + 8)}px`);
        measure();
        ro = new ResizeObserver(measure);
        ro.observe(title);
      }

      // 0.28–0.36: the call chrome (end/mute/speaker, free meter) fades in
      // after the clip edge has swept past, so it is never seen sliced.
      const chrome = [controls, meterCard].filter((el): el is HTMLElement => Boolean(el));
      if (chrome.length) {
        tl.fromTo(chrome, { autoAlpha: 0 }, { autoAlpha: 1, duration: B.chrome[1] - B.chrome[0], ease: 'power1.out' }, B.chrome[0]);
      }

      // fan's turn: light rises from the bottom.
      if (fanGlow) {
        tl.fromTo(
          fanGlow,
          { yPercent: 40, y: 0, autoAlpha: 0, scale: lite ? 1 : 0.95 },
          { yPercent: 0, autoAlpha: 1, scale: lite ? 1 : 1.1, duration: B.think - B.fan, ease: 'power2.out' },
          B.fan,
        );
        // thinking: it drifts up and fades.
        tl.to(fanGlow, { y: -140, autoAlpha: 0, duration: B.speak - B.think, ease: 'power3.inOut' }, B.think);
      }

      // The light moves to 推し, then beats while they speak.
      if (avatarGlow) {
        gsap.set(avatarGlow, { animation: 'none' });
        tl.fromTo(avatarGlow, { autoAlpha: 0, scale: lite ? 1 : 0.82 }, { autoAlpha: 1, scale: 1, duration: B.speak - B.avatar }, B.avatar);
        if (!lite) tl.to(avatarGlow, { keyframes: { scale: [1, 1.2, 0.9, 1.25, 0.95, 1.15, 1] }, duration: B.demo - B.speak, ease: 'none' }, B.speak);
      }
      if (wave) {
        tl.fromTo(wave, { '--amp': 0.2 }, { '--amp': 1.3, duration: B.settle - B.speak, ease: 'power2.out' }, B.speak);
        tl.to(wave, { '--amp': 1, duration: B.demo - B.settle, ease: 'sine.inOut' }, B.settle);
      }

      // transcript toast and the demo CTA arrive, then hold to the end.
      if (toast) tl.fromTo(toast, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.06, ease: 'power3.out' }, B.demo);
      if (demo) tl.fromTo(demo, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.06, ease: 'power3.out' }, B.demo);

      // (The header surface — light while the stage is still cream — is
      // handled by useExpandStage from data-surface-start.)
      // Discrete beats from progress. While the demo runs it owns these.
      // Scrolling back out of the demo's hold resets it (lc:call-rewind, see
      // CallDemo): a running demo stops before its root fades out, so it
      // never keeps playing (and holding focus) while hidden.
      const sync = () => {
        const p = tl.progress();
        const running = root.getAttribute('data-demo') === 'running';
        if ((running && p < REWIND_RUNNING) || (p < REWIND_DONE && root.hasAttribute('data-demo-done'))) {
          window.dispatchEvent(new Event('lc:call-rewind'));
        }
        if (root.hasAttribute('data-demo')) return;
        const s = stateAt(p);
        if (callRoot && callRoot.dataset.state !== s) callRoot.dataset.state = s;
        if (meter) {
          const m = meterAt(p);
          if (meter.textContent !== m) meter.textContent = m;
        }
        fanFill?.__fill?.(span(p, B.fan, B.think));
        oshiFill?.__fill?.(span(p, B.speak, B.demo));
      };
      tl.eventCallback('onUpdate', sync); // useExpandStage also re-runs it after each refresh
      // The fill animators may initialise after this timeline: sync once they have.
      const late = window.setTimeout(sync, 400);
      sync();

      return () => {
        window.clearTimeout(late);
        tl.eventCallback('onUpdate', null);
        ro?.disconnect();
        media.style.removeProperty('--intro-h');
        if (callRoot) callRoot.dataset.state = 'speaking';
        if (meter) meter.textContent = clock(FREE_SECONDS);
        fanFill?.__fill?.(1);
        oshiFill?.__fill?.(1);
      };
    },
  });

  return <span ref={anchor} hidden />;
}
