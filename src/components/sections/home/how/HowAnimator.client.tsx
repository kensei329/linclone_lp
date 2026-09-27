'use client';

import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useScrollScene } from '@/lib/motion/use-scroll-scene';

const clock = (sec: number) => `0:${String(Math.max(0, Math.min(60, Math.round(sec)))).padStart(2, '0')}`;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** power2.inOut */
const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);
const win = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/**
 * #how-it-works animator (spec §5.10). Lazy; never runs under reduced motion.
 *
 * Desktop: step toggles drive the sticky phone's ScreenStack (CSS crossfade),
 * the step dots and the connector line; the 60-second ring shows on the call
 * step and counts 0:60 → 0:00 with the scroll; then, as #how-cta enters, the
 * phone morphs into the app icon sitting in its pad beside the badges
 * (translate + scale measured every frame, phone fades, icon fades in).
 * Mobile: line + dots, and the mini ring counts down once when it enters.
 * The sunrise glow rises across the section on both.
 */
export function HowAnimator() {
  const { anchor, scope } = useAnchorScope('section');

  useScrollScene(scope, ({ gsap, ScrollTrigger, scope: root, isDesktop, belowFold }) => {
    const q = <T extends HTMLElement = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
    const one = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel);
    const steps = q('[data-step]');
    const stepsWrap = one('[data-steps]');
    const lineFill = one('[data-line-fill]');
    const sunGlow = one('[data-sunrise] [data-fan-glow]');
    const vh = window.innerHeight;
    const cleanups: (() => void)[] = [];

    // Sunrise: rises across the section.
    if (sunGlow) {
      gsap.fromTo(
        sunGlow,
        { yPercent: 30 },
        { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom bottom', scrub: true } },
      );
    }

    // Dots + connector line (both breakpoints). Steps below the fold at init start "not done".
    const mark = isDesktop ? 'top 55%' : 'top 70%';
    steps.forEach((li) => {
      if (li.getBoundingClientRect().top > vh * (isDesktop ? 0.55 : 0.7)) li.removeAttribute('data-done');
      ScrollTrigger.create({
        trigger: li,
        start: mark,
        onEnter: () => li.setAttribute('data-done', ''),
        onLeaveBack: () => li.removeAttribute('data-done'),
      });
    });
    if (lineFill && stepsWrap) {
      gsap.fromTo(
        lineFill,
        { scaleY: belowFold ? 0 : 1 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: stepsWrap, start: mark, end: `bottom ${isDesktop ? '55%' : '70%'}`, scrub: true } },
      );
    }

    if (!isDesktop) {
      // Mini ring: counts down once on enter, then refills to the free 0:60.
      const mini = one('[data-ring-mini]');
      const ring = mini?.querySelector<HTMLElement>('[data-ring]');
      const time = mini?.querySelector<HTMLElement>('[data-ring-time]');
      if (mini && ring && time) {
        const state = { p: 100 };
        const render = () => {
          ring.style.setProperty('--p', String(state.p));
          time.textContent = clock((state.p / 100) * 60);
        };
        ScrollTrigger.create({
          trigger: mini,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap
              .timeline({ onUpdate: render })
              .to(state, { p: 0, duration: 1.6, ease: 'none' })
              .to(state, { p: 100, duration: 0.5, ease: 'power3.out' }, '+=0.6');
          },
        });
      }
      return () => cleanups.forEach((fn) => fn());
    }

    // ── desktop ──
    root.setAttribute('data-how-live', '');
    cleanups.push(() => root.removeAttribute('data-how-live'));

    const morph = one('[data-morph]');
    const scaleWrap = one('[data-phone-scale]');
    const phone = morph?.querySelector<HTMLElement>('.phone, figure') ?? null;
    const screens = q('[data-morph] [data-screen]');
    const icon = one('[data-app-icon]');
    const pad = one('[data-icon-pad]');
    const ring = one('[data-ring60] [data-ring]');
    const ringTime = one('[data-ring-chip] [data-ring-time]');
    const meter = screens[2]?.querySelector<HTMLElement>('[data-meter]') ?? null;

    // Screen toggles (ScreenStack CSS does the crossfade).
    let current = 0;
    const show = (i: number) => {
      if (i === current || !screens[i]) return;
      const prev = screens[current];
      prev?.removeAttribute('data-active');
      prev?.setAttribute('data-leaving', '');
      window.setTimeout(() => prev?.removeAttribute('data-leaving'), 280);
      screens[i].setAttribute('data-active', '');
      current = i;
      morph?.toggleAttribute('data-ring-on', i === 2);
    };
    screens.forEach((el, i) => el.toggleAttribute('data-active', i === 0));
    steps.forEach((li, i) => {
      ScrollTrigger.create({
        trigger: li,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (self.isActive) show(i);
        },
      });
    });
    cleanups.push(() => {
      // back to the server state (first screen active)
      screens.forEach((el, i) => {
        el.toggleAttribute('data-active', i === 0);
        el.removeAttribute('data-leaving');
      });
      morph?.removeAttribute('data-ring-on');
    });

    // Ring-60 countdown across the call step.
    const callStep = one('#how-step-call');
    if (callStep && ring) {
      ScrollTrigger.create({
        trigger: callStep,
        start: 'top 55%',
        end: 'bottom 55%',
        onUpdate: (self) => {
          const left = (1 - self.progress) * 60;
          ring.style.setProperty('--p', String(Math.round((1 - self.progress) * 1000) / 10));
          const txt = clock(left);
          if (ringTime) ringTime.textContent = txt;
          if (meter) meter.textContent = txt;
        },
      });
      cleanups.push(() => {
        ring.style.removeProperty('--p');
        if (ringTime) ringTime.textContent = '0:60';
        if (meter) meter.textContent = '0:60';
      });
    }

    // Phone → app icon morph as the CTA block enters.
    const cta = one('#how-cta');
    if (cta && morph && scaleWrap && pad && phone) {
      const apply = (p: number) => {
        const e = ease(p);
        if (e <= 0) {
          morph.style.transform = '';
          phone.style.opacity = '';
          if (icon) icon.style.opacity = '';
          pad.removeAttribute('data-landed');
          return;
        }
        const w = scaleWrap.getBoundingClientRect();
        const k = w.width / (scaleWrap.offsetWidth || 1) || 1;
        const pr = pad.getBoundingClientRect();
        const cx = w.left + w.width / 2;
        const cy = w.top + w.height / 2;
        const dx = (pr.left + pr.width / 2 - cx) / k;
        const dy = (pr.top + pr.height / 2 - cy) / k;
        const target = pr.width / ((icon?.offsetWidth || 330) * k);
        const sc = 1 + (target - 1) * e;
        morph.style.transform = `translate3d(${dx * e}px, ${dy * e}px, 0) scale(${sc})`;
        phone.style.opacity = String(1 - win(e, 0.35, 0.9));
        if (icon) icon.style.opacity = String(win(e, 0, 0.6));
        pad.toggleAttribute('data-landed', e > 0.985);
        morph.toggleAttribute('data-ring-on', false);
      };
      const state = { p: 0 };
      const st = ScrollTrigger.create({
        trigger: cta,
        start: 'top 85%',
        end: 'top 45%',
        onUpdate: (self) => {
          gsap.to(state, { p: self.progress, duration: 0.5, ease: 'power2.out', overwrite: true, onUpdate: () => apply(state.p) });
        },
        onRefresh: (self) => {
          state.p = self.progress;
          apply(state.p);
        },
      });
      // While sticky, the phone moves relative to the pad on every scroll: re-measure.
      const onScroll = () => {
        if (state.p > 0 && state.p < 1) apply(state.p);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener('scroll', onScroll);
        gsap.killTweensOf(state);
        st.kill();
        morph.style.transform = '';
        phone.style.opacity = '';
        if (icon) icon.style.opacity = '';
        pad.removeAttribute('data-landed');
      });
    }

    return () => cleanups.forEach((fn) => fn());
  });

  return <span ref={anchor} hidden />;
}
