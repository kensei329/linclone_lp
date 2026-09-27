'use client';

import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useScrollScene, type SceneCtx } from '@/lib/motion/use-scroll-scene';

/**
 * Micro-interactions for the #more bento minis (spec §5.9). One lazy island
 * for the whole bento: it drives the F21 minis through their `data-m` hooks.
 *
 * - One-shot tiles (quests, bonus, invite, plans, money, sleep, signin) play
 *   once when they come into view; tiles already on screen at init stay in
 *   their server-rendered final state. On devices with a fine pointer,
 *   hovering (or focusing into) a tile replays it.
 * - Looping tiles (reel, library) cycle only while in view, and pause on
 *   hover and focus (§9.1).
 * - Reduced motion never gets here (useScrollScene); every mini keeps its
 *   SSR final state. Lite mode keeps the cheap one-shots and skips the loops.
 */

type Gsap = SceneCtx['gsap'];
type Seq = { prime: () => void; play: () => unknown };
type Built = { seq?: Seq; loop?: Loop; dispose?: () => void };
type Loop = { start: () => void; stop: () => void };

const REEL_EVERY = 2.2;
const TAB_EVERY = 1.6;

/** Paths inside an SVG check hook, ready for a stroke-dash draw. */
function strokes(root: Element): SVGGeometryElement[] {
  const own = root instanceof SVGGeometryElement ? [root] : [];
  return [...own, ...Array.from(root.querySelectorAll<SVGGeometryElement>('path, polyline, line'))].filter(
    (el) => typeof el.getTotalLength === 'function',
  );
}

function drawSeq(gsap: Gsap, els: SVGGeometryElement[]) {
  const len = (el: SVGGeometryElement) => {
    try {
      return Math.max(1, el.getTotalLength());
    } catch {
      return 40;
    }
  };
  return {
    prime: () => els.forEach((el) => gsap.set(el, { strokeDasharray: len(el), strokeDashoffset: len(el) })),
    to: (tl: ReturnType<Gsap['timeline']>, at: number | string, stagger = 0.06) =>
      els.length
        ? tl.to(els, { strokeDashoffset: 0, duration: 0.36, ease: 'power2.out', stagger, clearProps: 'strokeDasharray,strokeDashoffset' }, at)
        : tl,
  };
}

function build(tile: HTMLElement, gsap: Gsap, lite: boolean): Built {
  const q = <T extends Element = HTMLElement>(sel: string) => Array.from(tile.querySelectorAll<T & Element>(sel)) as T[];
  const one = <T extends Element = HTMLElement>(sel: string) => tile.querySelector<T & Element>(sel) as T | null;

  switch (tile.dataset.tile) {
    case 'reel': {
      const track = one<HTMLElement>('[data-m="reel-track"]');
      if (!track || lite) return {};
      const follows = q<HTMLElement>('[data-m="follow"]');
      let i = 0;
      let tl: ReturnType<Gsap['timeline']> | null = null;
      const setFollow = (on: boolean, idx: number) => {
        const pill = follows[follows.length > 1 ? idx : 0];
        if (!pill) return;
        pill.dataset.state = on ? 'following' : 'follow';
        pill.toggleAttribute('data-following', on);
      };
      const step = () => {
        const slides = Array.from(track.children) as HTMLElement[];
        const n = Math.max(1, slides.length);
        const h = slides[0]?.offsetHeight || track.offsetHeight / n;
        const next = (i + 1) % n;
        setFollow(false, next);
        tl = gsap
          .timeline()
          .to(track, { y: -next * h, duration: 0.6, ease: 'power3.inOut' })
          .add(() => setFollow(true, next), '+=0.55');
        const pill = follows[follows.length > 1 ? next : 0];
        if (pill) tl.fromTo(pill, { scale: 0.9 }, { scale: 1, duration: 0.42, ease: 'back.out(2)', clearProps: 'transform' }, '<');
        i = next;
      };
      const call = gsap.delayedCall(REEL_EVERY, function again() {
        step();
        call.restart(true);
      });
      call.pause();
      return {
        loop: {
          start: () => call.paused() && call.restart(true),
          stop: () => {
            call.pause();
            tl?.progress(1);
          },
        },
      };
    }

    case 'library': {
      const tabs = q<HTMLElement>('[data-m="tab"]');
      const bar = one<HTMLElement>('[data-m="underline"]');
      if (tabs.length < 2 || !bar || lite) return {};
      let i = 0;
      const go = (to: number) => {
        const t0 = tabs[0];
        const t = tabs[to];
        tabs.forEach((el, k) => el.toggleAttribute('data-active', k === to));
        gsap.to(bar, { x: t.offsetLeft - t0.offsetLeft, width: t.offsetWidth, duration: 0.42, ease: 'power3.inOut' });
      };
      const call = gsap.delayedCall(TAB_EVERY, function again() {
        i = (i + 1) % tabs.length;
        go(i);
        call.restart(true);
      });
      call.pause();
      return { loop: { start: () => call.paused() && call.restart(true), stop: () => call.pause() } };
    }

    case 'quests': {
      const checks = drawSeq(gsap, q('[data-m="check"]').flatMap(strokes));
      const reward = one('[data-m="reward"]');
      return {
        seq: {
          prime: () => {
            checks.prime();
            if (reward) gsap.set(reward, { autoAlpha: 0, scale: 0.86, y: 8 });
          },
          play: () => {
            const tl = gsap.timeline();
            checks.to(tl, 0.1);
            if (reward) tl.to(reward, { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)', clearProps: 'transform' }, '>-0.05');
            return tl;
          },
        },
      };
    }

    case 'bonus': {
      const days = q('[data-m="day"]');
      if (!days.length) return {};
      const today = days[days.length - 1];
      return {
        seq: {
          prime: () => {
            gsap.set(days, { opacity: 0.3, scale: 0.9 });
            gsap.set(today, { boxShadow: '0 0 0px rgba(0,175,196,0)' });
          },
          play: () =>
            gsap
              .timeline()
              .to(days, { opacity: 1, scale: 1, duration: 0.32, ease: 'back.out(1.8)', stagger: 0.08, clearProps: 'opacity,transform' })
              .to(today, { boxShadow: '0 0 14px rgba(0,175,196,.35)', duration: 0.4, clearProps: 'boxShadow' }, '>-0.1'),
        },
      };
    }

    case 'invite': {
      const btn = one('[data-m="copy"]');
      if (!btn) return {};
      let timer: ReturnType<typeof setTimeout> | undefined;
      const copied = () => {
        clearTimeout(timer);
        btn.dataset.state = 'copied';
        btn.toggleAttribute('data-copied', true);
        gsap.fromTo(btn, { scale: 0.92 }, { scale: 1, duration: 0.42, ease: 'back.out(2)', clearProps: 'transform' });
        timer = setTimeout(() => {
          btn.dataset.state = 'copy';
          btn.removeAttribute('data-copied');
        }, 1600);
      };
      // Visual only: no clipboard write (spec §5.9). Pointer only, because
      // the mini is decorative (aria-hidden, no focusable controls).
      tile.addEventListener('click', copied);
      return {
        seq: { prime: () => {}, play: () => gsap.delayedCall(0.5, copied) },
        dispose: () => {
          tile.removeEventListener('click', copied);
          clearTimeout(timer);
        },
      };
    }

    case 'plans': {
      const cards = q('[data-m="plan"]');
      if (!cards.length) return {};
      const tilt = [-6, -2, 2, 6];
      return {
        seq: {
          prime: () => cards.forEach((c, k) => gsap.set(c, { rotation: tilt[k % 4], y: 20, autoAlpha: 0 })),
          play: () => gsap.to(cards, { rotation: 0, y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06, clearProps: 'transform' }),
        },
      };
    }

    case 'money': {
      const sheet = one('[data-m="sheet"]');
      const refund = drawSeq(gsap, q('[data-m="refund"]').flatMap(strokes));
      const ticks = q('[data-point-icon]');
      return {
        seq: {
          prime: () => {
            if (sheet) gsap.set(sheet, { yPercent: 100 });
            refund.prime();
            if (ticks.length) gsap.set(ticks, { scale: 0, opacity: 0 });
          },
          play: () => {
            const tl = gsap.timeline();
            if (ticks.length)
              tl.to(ticks, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)', stagger: 0.06, clearProps: 'transform,opacity' }, 0);
            if (sheet) tl.to(sheet, { yPercent: 0, duration: 0.42, ease: 'power3.out', clearProps: 'transform' }, 0.1);
            refund.to(tl, '>');
            return tl;
          },
        },
      };
    }

    case 'sleep': {
      const toggle = one('[data-toggle]');
      const moon = one('[data-m="moon"]');
      const sticker = one('[data-m="sticker"]');
      return {
        seq: {
          prime: () => {
            toggle?.removeAttribute('data-on');
            if (moon) gsap.set(moon, { autoAlpha: 0, scale: 0.7 });
            if (sticker) gsap.set(sticker, { autoAlpha: 0, scale: 0.6, rotation: -10 });
          },
          play: () => {
            const tl = gsap.timeline();
            tl.add(() => toggle?.setAttribute('data-on', ''), 0.25);
            if (moon) tl.to(moon, { autoAlpha: 1, scale: 1, duration: 0.42, ease: 'power3.out', clearProps: 'transform' }, 0.4);
            if (sticker) tl.to(sticker, { autoAlpha: 1, scale: 1, rotation: 4, duration: 0.45, ease: 'back.out(1.6)' }, 0.7);
            return tl;
          },
        },
      };
    }

    case 'signin': {
      const chip = one('[data-m="nopw"]');
      if (!chip) return {};
      return {
        seq: {
          prime: () => {},
          play: () =>
            gsap
              .timeline()
              .to(chip, { scale: 1.08, duration: 0.22, ease: 'power2.out' })
              .to(chip, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.45)', clearProps: 'transform' }),
        },
      };
    }

    default:
      return {};
  }
}

export function BentoMicro() {
  const { anchor, scope } = useAnchorScope('section');

  useScrollScene(scope, ({ gsap, scope: root, lite }) => {
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-tile]'));
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cleanups: (() => void)[] = [];
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Pointer-tracked sheen on the glass (fine pointers only, never in lite mode).
    if (fine && !lite) {
      for (const tile of tiles) {
        const move = (e: PointerEvent) => {
          const b = tile.getBoundingClientRect();
          tile.style.setProperty('--mx', `${Math.round(e.clientX - b.left)}px`);
          tile.style.setProperty('--my', `${Math.round(e.clientY - b.top)}px`);
        };
        tile.addEventListener('pointermove', move, { passive: true });
        cleanups.push(() => tile.removeEventListener('pointermove', move));
      }
    }

    for (const tile of tiles) {
      const { seq, loop, dispose } = build(tile, gsap, lite);
      if (!seq && !loop) continue;
      const r = tile.getBoundingClientRect();
      const onScreen = r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
      let played = onScreen;
      let playing: { kill?: () => void; progress?: (p: number) => unknown } | null = null;
      let held = false;

      if (seq && !onScreen) seq.prime();

      let lastRun = 0;
      const run = () => {
        if (!seq) return;
        lastRun = performance.now();
        const anim = seq.play() as typeof playing;
        playing = anim && typeof anim === 'object' ? anim : null;
      };

      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            if (!played) {
              played = true;
              run();
            }
            if (!held) loop?.start();
          } else {
            loop?.stop();
          }
        },
        { threshold: 0.45 },
      );
      io.observe(tile);

      const hold = () => {
        held = true;
        loop?.stop();
        if (fine && seq && played && performance.now() - lastRun > 1600) {
          playing?.progress?.(1);
          seq.prime();
          run();
        }
      };
      const release = () => {
        held = false;
        const b = tile.getBoundingClientRect();
        if (b.bottom > 0 && b.top < window.innerHeight) loop?.start();
      };
      const onFocusOut = (e: FocusEvent) => {
        if (!tile.contains(e.relatedTarget as Node | null)) release();
      };
      tile.addEventListener('pointerenter', hold);
      tile.addEventListener('pointerleave', release);
      tile.addEventListener('focusin', hold);
      tile.addEventListener('focusout', onFocusOut);

      cleanups.push(() => {
        io.disconnect();
        dispose?.();
        loop?.stop();
        playing?.progress?.(1);
        tile.removeEventListener('pointerenter', hold);
        tile.removeEventListener('pointerleave', release);
        tile.removeEventListener('focusin', hold);
        tile.removeEventListener('focusout', onFocusOut);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  });

  return <span ref={anchor} hidden />;
}
