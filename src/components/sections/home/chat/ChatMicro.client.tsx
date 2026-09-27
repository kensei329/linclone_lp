'use client';

import type { gsap } from 'gsap';
import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useScrollScene } from '@/lib/motion/use-scroll-scene';
import { REVEAL_FROM } from '@/lib/motion/tokens';

type Gsap = typeof gsap;
type Seq = { tl: gsap.core.Timeline; reset: () => void; finish: () => void };
type ChatMicroProps = { nickname: string };

const REVEAL_TO = { y: 0, scale: 1, autoAlpha: 1, duration: 0.42, ease: 'power3.out' } as const;
const POP_FROM = { scale: 0.6, autoAlpha: 0 } as const;
const POP_TO = { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.6)' } as const;

const pick = (root: Element, name: string) => root.querySelector<HTMLElement>(`[data-m="${name}"]`);
const pickAll = (root: Element, name: string) => Array.from(root.querySelectorAll<HTMLElement>(`[data-m="${name}"]`));

/** The deepest element whose own text equals `text` (to retype it in place). */
function textHost(root: Element | null, text: string): HTMLElement | null {
  if (!root) return null;
  const want = text.trim();
  const all = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))] as HTMLElement[];
  for (let i = all.length - 1; i >= 0; i--) {
    const own = Array.from(all[i].childNodes).filter((n) => n.nodeType === Node.TEXT_NODE);
    if (own.some((n) => n.textContent?.trim() === want)) return all[i];
  }
  return null;
}

/** F6 Conversation04: ended → b1 → b2 (+read) → typing 1.2s → b3 → chips. */
function conversation(g: Gsap, root: Element): Seq | null {
  const ended = pick(root, 'ended');
  const b1 = pick(root, 'b1');
  if (!ended && !b1) return null;
  const b2 = pick(root, 'b2');
  const read = pick(root, 'read');
  const typing = pick(root, 'typing');
  const b3 = pick(root, 'b3');
  const chips = pick(root, 'chips');
  const tl = g.timeline({ paused: true });
  if (ended) tl.fromTo(ended, { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: 'back.out(1.6)' }, 0.15);
  if (b1) tl.fromTo(b1, { ...REVEAL_FROM, transformOrigin: '0% 0%' }, REVEAL_TO, 0.65);
  if (b2) tl.fromTo(b2, { ...REVEAL_FROM, transformOrigin: '100% 0%' }, REVEAL_TO, 1.15);
  if (read) tl.fromTo(read, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.26 }, 1.5);
  if (typing) {
    tl.call(() => void (typing.hidden = false), undefined, 1.75);
    tl.fromTo(typing, { ...REVEAL_FROM, transformOrigin: '0% 0%' }, REVEAL_TO, 1.75);
    tl.call(() => void (typing.hidden = true), undefined, 2.95);
  }
  if (b3) tl.fromTo(b3, { ...REVEAL_FROM, transformOrigin: '0% 0%' }, REVEAL_TO, 2.95);
  if (chips) tl.fromTo(chips, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42 }, 3.45);
  const hideTyping = () => {
    if (typing) typing.hidden = true;
  };
  return {
    tl,
    reset: () => {
      tl.progress(0);
      hideTyping();
    },
    finish: () => {
      tl.progress(1);
      hideTyping();
    },
  };
}

/** F7 StoryFlow04to03b: generate → image + voice → post → push to the viewer. */
function storyFlow(g: Gsap, root: Element): Seq | null {
  const create = root.querySelector<HTMLElement>('[data-sub="create"]');
  const viewer = root.querySelector<HTMLElement>('[data-sub="viewer"]');
  if (!create || !viewer) return null;
  const chip = pick(root, 'chip-image');
  const gen = pick(root, 'gen');
  const scene = pick(root, 'scene');
  const aiTag = pick(root, 'ai-tag');
  const post = pick(root, 'post');
  const progress = pick(root, 'progress');
  const heart = pick(root, 'heart');
  const setPost = (state: 'idle' | 'posted') => post?.setAttribute('data-state', state);
  const setActive = (el: HTMLElement) => {
    create.toggleAttribute('data-active', el === create);
    viewer.toggleAttribute('data-active', el === viewer);
  };

  const tl = g.timeline({ paused: true });
  tl.fromTo(create, { xPercent: 0, autoAlpha: 1 }, { xPercent: -30, autoAlpha: 0.7, duration: 0.5, ease: 'power3.inOut' }, 5.0);
  tl.fromTo(viewer, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power3.inOut' }, 5.0);
  tl.call(() => setActive(viewer), undefined, 5.0);
  if (chip) tl.fromTo(chip, { scale: 1 }, { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }, 0.25);
  if (gen) {
    tl.fromTo(gen, REVEAL_FROM, REVEAL_TO, 0.55);
    if (scene) tl.to(gen, { autoAlpha: 0, duration: 0.2 }, 3.35);
  }
  if (scene) tl.fromTo(scene, { scale: 0.9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.6)' }, 3.4);
  if (aiTag) tl.fromTo(aiTag, POP_FROM, POP_TO, 3.7);
  if (post) {
    tl.fromTo(post, { scale: 1 }, { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }, 4.3);
    tl.call(() => setPost('posted'), undefined, 4.45);
  }
  if (progress) tl.fromTo(progress, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 5, ease: 'none' }, 5.5);
  if (heart) tl.fromTo(heart, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2)' }, 6.4);

  return {
    tl,
    reset: () => {
      tl.progress(0);
      setPost('idle');
      setActive(create);
    },
    finish: () => {
      tl.progress(1);
      setPost('posted');
      setActive(viewer);
    },
  };
}

/** F8 Memory06: nickname types in, the mode pill hops, memories reveal, lock pops. */
function memory(g: Gsap, root: Element, nickname: string): Seq | null {
  const nick = pick(root, 'nick');
  const sel = pick(root, 'mode-sel');
  const mems = pickAll(root, 'mem');
  const lock = pick(root, 'lock-2');
  if (!nick && !sel && !mems.length) return null;
  const nickEl = textHost(nick, nickname);
  const tl = g.timeline({ paused: true });

  if (nickEl) {
    const chars = Array.from(nickname);
    const proxy = { n: chars.length };
    tl.fromTo(
      proxy,
      { n: 0 },
      {
        n: chars.length,
        duration: chars.length * 0.05,
        ease: 'none',
        onUpdate: () => void (nickEl.textContent = chars.slice(0, Math.round(proxy.n)).join('')),
      },
      0.3,
    );
  }

  // The selection pill hops ふつう → 応援団 → やさしい (ending on the SSR state).
  const chipOf = (mode: string) => root.querySelector<HTMLElement>(`[data-mode="${mode}"]`);
  const home = chipOf('gentle');
  const path = ['standard', 'cheerleader', 'gentle'].map(chipOf);
  if (sel && home && path.every(Boolean)) {
    const chips = path as HTMLElement[];
    if (sel.hasAttribute('data-mode')) {
      // The pill IS the selected chip: move the selected state between chips.
      const sets = chips.map((c) => () => {
        root.querySelectorAll('[data-mode]').forEach((el) => el.toggleAttribute('data-selected', el === c));
      });
      sets.forEach((fn, i) => tl.call(fn, undefined, 0.6 + i * 0.9));
    } else {
      // A separate highlight laid over the selected chip: slide it (transform only).
      const at = (c: HTMLElement) => ({ x: c.offsetLeft - home.offsetLeft, y: c.offsetTop - home.offsetTop, scaleX: c.offsetWidth / home.offsetWidth });
      const [a, b] = chips.map(at);
      const selectCell = (c: HTMLElement) => () => root.querySelectorAll('[data-mode]').forEach((el) => el.toggleAttribute('data-selected', el === c));
      tl.fromTo(sel, { ...a, transformOrigin: '0% 50%' }, { ...b, duration: 0.42, ease: 'power3.inOut' }, 1.2);
      tl.call(selectCell(chips[1]), undefined, 1.45);
      tl.to(sel, { x: 0, y: 0, scaleX: 1, duration: 0.42, ease: 'power3.inOut' }, 2.1);
      tl.call(selectCell(chips[2]), undefined, 2.35);
    }
  }
  if (mems.length) tl.fromTo(mems, REVEAL_FROM, { ...REVEAL_TO, stagger: 0.06 }, 0.9);
  if (lock) tl.fromTo(lock, POP_FROM, POP_TO, 2.7);

  const selectOnly = (c: Element | null) => root.querySelectorAll('[data-mode]').forEach((el) => el.toggleAttribute('data-selected', el === c));
  return {
    tl,
    reset: () => {
      tl.progress(0);
      if (nickEl) nickEl.textContent = '';
      if (sel && home) selectOnly(path[0]);
    },
    finish: () => {
      tl.progress(1);
      if (nickEl) nickEl.textContent = nickname;
      if (sel && home) selectOnly(home);
    },
  };
}

/**
 * #chat micro-sequences (spec §5.6). Time-based, not scrubbed.
 * Desktop: `lc:step` from StickySteps restarts the active screen's sequence
 * (the first screen plays when the phone comes into view); inactive steps
 * recede and a rail tracks the step progress.
 * Mobile: each carousel card plays when it is ≥60% visible.
 * Reduced motion: nothing runs (all screens are in their final state).
 */
export function ChatMicro({ nickname }: ChatMicroProps) {
  const { anchor, scope } = useAnchorScope('[data-chat-root]');

  useScrollScene(scope, ({ gsap, ScrollTrigger, scope: root, isDesktop }) => {
    const build = (kind: number, el: Element): Seq | null =>
      kind === 0 ? conversation(gsap, el) : kind === 1 ? storyFlow(gsap, el) : memory(gsap, el, nickname);
    const seqs: Seq[] = [];
    const cleanups: (() => void)[] = [];
    const belowFold = root.getBoundingClientRect().top > window.innerHeight;

    if (isDesktop) {
      const screens = Array.from(root.querySelectorAll<HTMLElement>('.ss-phone [data-screen]'));
      const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
      const stepIds = steps.map((s) => s.dataset.step ?? '');
      const bySeq = screens.map((sc, i) => build(i, sc));
      bySeq.forEach((seq, i) => {
        if (!seq) return;
        seqs.push(seq);
        const active = screens[i].hasAttribute('data-active');
        if (!active || belowFold) seq.reset();
        else seq.finish();
      });

      let current = Math.max(0, screens.findIndex((sc) => sc.hasAttribute('data-active')));
      const mark = (i: number) => steps.forEach((s, j) => s.toggleAttribute('data-current', j === i));
      mark(current);
      root.setAttribute('data-steps-live', '');

      const playAt = (i: number) => {
        const seq = bySeq[i];
        if (!seq) return;
        seq.reset();
        seq.tl.play();
      };
      const onStep = (e: Event) => {
        const { sectionId, stepId } = (e as CustomEvent<{ sectionId: string; stepId: string }>).detail;
        if (sectionId !== 'chat-steps') return;
        const i = stepIds.indexOf(stepId);
        if (i < 0 || i === current) return;
        current = i;
        mark(i);
        playAt(i);
      };
      window.addEventListener('lc:step', onStep);

      // The first screen is active from the start: play it when the phone shows.
      const phone = root.querySelector('.ss-phone');
      let firstPlayed = !belowFold;
      if (phone && !firstPlayed) {
        ScrollTrigger.create({
          trigger: phone,
          start: 'top 65%',
          once: true,
          onEnter: () => {
            if (firstPlayed || current !== 0) return;
            firstPlayed = true;
            bySeq[0]?.tl.play();
          },
        });
      }

      // Progress rail beside the steps (one CSS var).
      const stepsEl = root.querySelector<HTMLElement>('.ss-steps');
      if (stepsEl) {
        ScrollTrigger.create({
          trigger: stepsEl,
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: 0.3,
          onUpdate: (self) => stepsEl.style.setProperty('--rail', self.progress.toFixed(4)),
          onRefresh: (self) => stepsEl.style.setProperty('--rail', self.progress.toFixed(4)),
        });
      }

      cleanups.push(() => {
        window.removeEventListener('lc:step', onStep);
        root.removeAttribute('data-steps-live');
        steps.forEach((s) => s.removeAttribute('data-current'));
        stepsEl?.style.removeProperty('--rail');
      });
    } else {
      const slices = Array.from(root.querySelectorAll<HTMLElement>('[data-chat-slice]'));
      const kinds: Record<string, number> = { chat: 0, stories: 1, memory: 2 };
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const seq = (e.target as HTMLElement & { __seq?: Seq }).__seq;
            const t = e.target as HTMLElement & { __on?: boolean };
            if (!seq) continue;
            const on = e.intersectionRatio >= 0.6;
            if (on && !t.__on) {
              seq.reset();
              seq.tl.play();
            }
            t.__on = on;
          }
        },
        { threshold: [0, 0.6] },
      );
      slices.forEach((sl) => {
        const seq = build(kinds[sl.dataset.chatSlice ?? ''] ?? -1, sl);
        if (!seq) return;
        seqs.push(seq);
        if (belowFold) seq.reset();
        else seq.finish();
        const host = sl as HTMLElement & { __seq?: Seq; __on?: boolean };
        host.__seq = seq;
        host.__on = !belowFold;
        io.observe(sl);
      });
      cleanups.push(() => {
        io.disconnect();
        slices.forEach((sl) => {
          delete (sl as HTMLElement & { __seq?: Seq }).__seq;
          delete (sl as HTMLElement & { __on?: boolean }).__on;
        });
      });
    }

    return () => {
      cleanups.forEach((fn) => fn());
      seqs.forEach((s) => {
        s.finish();
        s.tl.kill();
      });
    };
  });

  return <span ref={anchor} hidden />;
}
