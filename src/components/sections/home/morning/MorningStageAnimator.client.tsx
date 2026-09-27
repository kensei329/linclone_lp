'use client';

import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useScrollScene } from '@/lib/motion/use-scroll-scene';

type FillTarget = HTMLElement & { __fill?: (progress: number) => void };

const fillTo = (el: FillTarget | null, p: number) => el?.__fill?.(p);

/** The dawn layer (500% tall) moves yPercent 0 → -DAWN_SHIFT·100 over progress 0 → DAWN_END. */
const DAWN_END = 0.5;
const DAWN_SHIFT = 0.8;
/**
 * Gradient positions (0–1 down --grad-dawn) where the night colour and the day
 * colour give the same contrast against the sky, so a step there keeps text
 * as readable as the palette allows (≈3.8:1 for white↔ink at the #e14b81 stop).
 * The eyebrow (white 72% at night) swaps earlier, to ink, and only relaxes to
 * ink-2 once the sky has turned.
 */
const CROSSOVER = { fg: 0.5, eyebrow: 0.425 } as const;

type ToneTarget = { el: HTMLElement; g: number; at: number };

/**
 * #morning-call stage (spec §5.5).
 * Desktop: one scrubbed timeline (duration 1 = progress) over the 160svh stage:
 * dawn layer yPercent 0 → -80, stars out, clock 6:58 → 6:59 → 7:00, copy
 * white → ink as a per-element step at the sky's luminance crossover (never a
 * fade through low-contrast mid-tones), the ringing phone rises in, then the
 * caption fills.
 * Mobile: no sticky; the clock rolls once on enter and the caption fill scrubs.
 * Lite: static dawn (final), only the (cheap) caption fill scrubs.
 * Reduced motion: nothing runs (the CSS default is the final state).
 */
export function MorningStageAnimator() {
  const { anchor, scope } = useAnchorScope('[data-morning-stage]');

  useScrollScene(scope, ({ gsap, ScrollTrigger, scope: stage, q, isDesktop, lite }) => {
    const copy = stage.querySelector<HTMLElement>('[data-morning-copy]');
    const caption = stage.querySelector<FillTarget>('#morning-caption');
    const digits = q('[data-clock]');
    const belowFold = stage.getBoundingClientRect().top > window.innerHeight;

    if (!isDesktop) {
      // ── mobile: clock rolls once on enter; caption fill scrubs ──
      const clock = digits[0]?.parentElement;
      if (clock && digits.length) {
        const clockBelow = clock.getBoundingClientRect().top > window.innerHeight * 0.85;
        if (clockBelow && !lite) {
          gsap.set(digits, { y: 0, yPercent: 0 });
          ScrollTrigger.create({
            trigger: clock,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap
                .timeline({ delay: 0.15 })
                .to(digits, { yPercent: -100, duration: 0.35, ease: 'power2.inOut' })
                .to(digits, { yPercent: -200, duration: 0.35, ease: 'power2.inOut' }, '+=0.25');
            },
          });
        }
      }
      if (caption) {
        const captionBelow = caption.getBoundingClientRect().top > window.innerHeight;
        if (captionBelow) {
          const st = ScrollTrigger.create({
            trigger: caption,
            start: 'top 75%',
            end: 'center 45%',
            scrub: true,
            onUpdate: (self) => fillTo(caption, self.progress),
          });
          // The fill animator may initialise after us: sync once it exists.
          const sync = () => fillTo(caption, st.progress);
          const id = window.setTimeout(sync, 400);
          return () => window.clearTimeout(id);
        }
      }
      return;
    }

    // ── desktop ──
    const dawn = stage.querySelector<HTMLElement>('[data-dawn]');
    const stars = stage.querySelector<HTMLElement>('[data-stars]');
    const phone = stage.querySelector<HTMLElement>('[data-ring-phone]');

    // Copy colour: a near-step per element at its own luminance crossover
    // (a CSS colour transition makes it read as a quick swap, not a fade
    // through the unreadable mid-tones). Thresholds follow the layout.
    const sticky = stage.querySelector<HTMLElement>('[data-morning-sticky]');
    const tones: ToneTarget[] = lite || !copy || !dawn
      ? []
      : q('[data-morning-copy] > [data-m-tone]').map((el) => ({
          el,
          g: el.dataset.mTone === 'eyebrow' ? CROSSOVER.eyebrow : CROSSOVER.fg,
          at: 0,
        }));
    const measureTones = () => {
      const box = (sticky ?? copy)?.getBoundingClientRect();
      const layerH = dawn?.offsetHeight ?? 0;
      if (!box || !box.height || !layerH) return;
      for (const t of tones) {
        const r = t.el.getBoundingClientRect();
        const y = r.top + r.height / 2 - box.top; // px from the top of the sticky viewport
        t.at = ((t.g - y / layerH) * DAWN_END) / DAWN_SHIFT;
      }
    };
    let toneKey = '';
    const applyTones = (p: number) => {
      const settled = p >= DAWN_END;
      const key = tones.map((t) => (settled ? 's' : p < t.at ? 'n' : 'd')).join('');
      if (key === toneKey) return;
      toneKey = key;
      tones.forEach((t, i) => {
        if (key[i] === 's') t.el.removeAttribute('data-tone-state');
        else t.el.setAttribute('data-tone-state', key[i] === 'n' ? 'night' : 'day');
      });
    };

    let fillP = 1;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
        // May fire while the timeline is being built, so read the progress off the trigger.
        onRefresh: (self) => {
          if (!tones.length) return;
          measureTones();
          toneKey = '';
          applyTones(self.animation?.progress() ?? self.progress);
        },
      },
      onUpdate: () => {
        const p = tl.progress();
        if (tones.length) applyTones(p);
        const f = Math.min(1, Math.max(0, (p - 0.45) / 0.3));
        if (f !== fillP) {
          fillP = f;
          fillTo(caption, f);
        }
      },
    });
    tl.to({}, { duration: 1 }, 0); // fixes the timeline length at 1 (positions = progress)

    if (!lite) {
      // y: 0 overrides the CSS (final-state) translate, which GSAP would otherwise parse into px.
      if (dawn) tl.fromTo(dawn, { y: 0, yPercent: 0 }, { y: 0, yPercent: -DAWN_SHIFT * 100, duration: DAWN_END }, 0);
      if (stars) tl.fromTo(stars, { autoAlpha: 0.7 }, { autoAlpha: 0, duration: 0.3 }, 0);
      if (digits.length) {
        tl.fromTo(digits, { y: 0, yPercent: 0 }, { y: 0, yPercent: -100, duration: 0.04, ease: 'power2.inOut' }, 0.12);
        tl.to(digits, { yPercent: -200, duration: 0.04, ease: 'power2.inOut' }, 0.28);
      }
      if (phone) tl.fromTo(phone, { y: () => window.innerHeight * 0.6, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.15, ease: 'power2.out' }, 0.3);
    }

    if (tones.length) {
      measureTones();
      applyTones(tl.progress());
    }

    // The fill animator may initialise after this timeline: sync to the current progress.
    const id = window.setTimeout(() => {
      fillP = -1;
      tl.eventCallback('onUpdate')?.();
    }, 400);
    if (!belowFold && tl.scrollTrigger && tl.scrollTrigger.progress >= 1) fillTo(caption, 1);

    return () => {
      window.clearTimeout(id);
      tones.forEach((t) => t.el.removeAttribute('data-tone-state'));
    };
  });

  return <span ref={anchor} hidden />;
}
