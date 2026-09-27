'use client';

import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useExpandStage } from '@/lib/motion/use-expand-stage';
import type { FillTarget } from '@/components/site/fill/FillAnimator.client';

const MQ_DESKTOP = '(min-width: 1024px)';

type CallState = 'connecting' | 'listening' | 'thinking' | 'speaking';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const stateAt = (p: number): CallState => (p < 0.4 ? 'connecting' : p < 0.52 ? 'listening' : p < 0.58 ? 'thinking' : 'speaking');
const meterAt = (p: number) => `0:${String(60 - Math.round(12 * span(p, 0.58, 0.86))).padStart(2, '0')}`;

/** The external fill target of a `[data-caption]` wrapper (or the element itself). */
function fillTarget(el: Element | null): FillTarget | null {
  if (!el) return null;
  return (el.matches('[data-fill-driver="external"]') ? el : el.querySelector('[data-fill-driver="external"]')) as FillTarget | null;
}

/** The text element of the `0:60` meter (the hook may sit on the value or on its card). */
function meterText(el: Element | null): HTMLElement | null {
  if (!el) return null;
  if (/^\d:\d{2}$/.test(el.textContent?.trim() ?? '') && !el.children.length) return el as HTMLElement;
  return Array.from(el.querySelectorAll<HTMLElement>('*')).find((n) => !n.children.length && /^\d:\d{2}$/.test(n.textContent?.trim() ?? '')) ?? (el as HTMLElement);
}

/**
 * Stage #1 timeline (spec §5.4). `useExpandStage` owns the clip, bezel,
 * background and intro colours; `extend` adds the call beats by progress:
 * hold → handoff (0.05) → expand → fan's turn (0.40) → thinking (0.52) →
 * 推し speaks (0.58) → transcript toast and demo CTA (0.86). Discrete state
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
      return window.matchMedia(MQ_DESKTOP).matches ? [0.06, 0.4] : [0.06, 0.34];
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
      const meter = meterText(one('[data-meter]'));
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

      // 0.40–0.52 the fan's turn: light rises from the bottom.
      if (fanGlow) {
        tl.fromTo(
          fanGlow,
          { yPercent: 40, y: 0, autoAlpha: 0, scale: lite ? 1 : 0.95 },
          { yPercent: 0, autoAlpha: 1, scale: lite ? 1 : 1.1, duration: 0.12, ease: 'power2.out' },
          0.4,
        );
        // 0.52–0.58 thinking: it drifts up and fades.
        tl.to(fanGlow, { y: -140, autoAlpha: 0, duration: 0.06, ease: 'power3.inOut' }, 0.52);
      }

      // 0.55 the light moves to 推し; 0.58–0.86 it beats while they speak.
      if (avatarGlow) {
        gsap.set(avatarGlow, { animation: 'none' });
        tl.fromTo(avatarGlow, { autoAlpha: 0, scale: lite ? 1 : 0.82 }, { autoAlpha: 1, scale: 1, duration: 0.03 }, 0.55);
        if (!lite) tl.to(avatarGlow, { keyframes: { scale: [1, 1.2, 0.9, 1.25, 0.95, 1.15, 1] }, duration: 0.28, ease: 'none' }, 0.58);
      }
      if (wave) {
        tl.fromTo(wave, { '--amp': 0.2 }, { '--amp': 1.3, duration: 0.12, ease: 'power2.out' }, 0.58);
        tl.to(wave, { '--amp': 1, duration: 0.16, ease: 'sine.inOut' }, 0.7);
      }

      // 0.86–0.92 transcript toast; 0.86–1 the demo CTA arrives and holds.
      if (toast) tl.fromTo(toast, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.06, ease: 'power3.out' }, 0.86);
      if (demo) tl.fromTo(demo, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.06, ease: 'power3.out' }, 0.86);

      // (The header surface — light while the stage is still cream — is
      // handled by useExpandStage from data-surface-start.)
      // Discrete beats from progress. While the demo runs it owns these.
      let last: CallState | null = null;
      const sync = () => {
        if (tl.progress() < 0.84 && root.hasAttribute('data-demo-done')) window.dispatchEvent(new Event('lc:call-rewind'));
        if (root.hasAttribute('data-demo')) return;
        const p = tl.progress();
        const s = stateAt(p);
        if (callRoot && s !== last) callRoot.dataset.state = s;
        last = s;
        if (meter) {
          const m = meterAt(p);
          if (meter.textContent !== m) meter.textContent = m;
        }
        fanFill?.__fill?.(span(p, 0.4, 0.52));
        oshiFill?.__fill?.(span(p, 0.58, 0.86));
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
        if (meter) meter.textContent = '0:60';
        fanFill?.__fill?.(1);
        oshiFill?.__fill?.(1);
      };
    },
  });

  return <span ref={anchor} hidden />;
}
