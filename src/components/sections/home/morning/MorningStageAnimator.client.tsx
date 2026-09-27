'use client';

import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useScrollScene } from '@/lib/motion/use-scroll-scene';

type FillTarget = HTMLElement & { __fill?: (progress: number) => void };

const fillTo = (el: FillTarget | null, p: number) => el?.__fill?.(p);

/**
 * #morning-call stage (spec §5.5).
 * Desktop: one scrubbed timeline (duration 1 = progress) over the 160svh stage:
 * dawn layer yPercent 0 → -80, stars out, clock 6:58 → 6:59 → 7:00, copy
 * white → ink, the ringing phone rises in, then the caption fills.
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

    let fillP = 1;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
      onUpdate: () => {
        const p = tl.progress();
        const f = Math.min(1, Math.max(0, (p - 0.45) / 0.3));
        if (f !== fillP) {
          fillP = f;
          fillTo(caption, f);
        }
      },
    });
    tl.to({}, { duration: 1 }, 0); // fixes the timeline length at 1 (positions = progress)

    if (!lite) {
      const cs = getComputedStyle(document.documentElement);
      const ink = cs.getPropertyValue('--color-ink').trim() || '#28273b';
      const ink2 = cs.getPropertyValue('--color-ink-2').trim() || '#5b5970';
      // y: 0 overrides the CSS (final-state) translate, which GSAP would otherwise parse into px.
      if (dawn) tl.fromTo(dawn, { y: 0, yPercent: 0 }, { y: 0, yPercent: -80, duration: 0.5 }, 0);
      if (stars) tl.fromTo(stars, { autoAlpha: 0.7 }, { autoAlpha: 0, duration: 0.3 }, 0);
      if (digits.length) {
        tl.fromTo(digits, { y: 0, yPercent: 0 }, { y: 0, yPercent: -100, duration: 0.04, ease: 'power2.inOut' }, 0.12);
        tl.to(digits, { yPercent: -200, duration: 0.04, ease: 'power2.inOut' }, 0.28);
      }
      if (copy) {
        tl.fromTo(
          copy,
          { '--m-fg': '#ffffff', '--m-fg2': 'rgba(255,255,255,0.72)' },
          { '--m-fg': ink, '--m-fg2': ink2, duration: 0.2 },
          0.25,
        );
      }
      if (phone) tl.fromTo(phone, { y: () => window.innerHeight * 0.6, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.15, ease: 'power2.out' }, 0.3);
    }

    // The fill animator may initialise after this timeline: sync to the current progress.
    const id = window.setTimeout(() => {
      fillP = -1;
      tl.eventCallback('onUpdate')?.();
    }, 400);
    if (!belowFold && tl.scrollTrigger && tl.scrollTrigger.progress >= 1) fillTo(caption, 1);

    return () => window.clearTimeout(id);
  });

  return <span ref={anchor} hidden />;
}
