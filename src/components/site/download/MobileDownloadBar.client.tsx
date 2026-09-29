'use client';

import { useEffect, useState } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { track } from '@/lib/analytics';
import { usePlatform } from '@/lib/motion/policy';
import { Glyph } from '../icons/Glyph';

export type MobileDownloadBarClientProps = {
  t: Dictionary['stickyBar'];
  lang: Locale;
  appStoreHref: string;
  playHref: string;
  getHref: string;
};

const DISMISS_KEY = 'lc.stickyDismissed';
const IDLE_MS = 1200;
const THRESHOLDS = Array.from({ length: 11 }, (_, i) => i / 10);

/** Share of the element in view, measured against the smaller of element and viewport. */
function visibleShare(e: IntersectionObserverEntry): number {
  if (!e.isIntersecting) return 0;
  const vh = e.rootBounds?.height ?? window.innerHeight;
  return e.intersectionRect.height / Math.max(1, Math.min(e.boundingClientRect.height, vh));
}

/** Badges actually readable: on screen, not hidden, and not faded out by a stage beat. */
function badgesShowing(stage: Element): boolean {
  const vh = window.innerHeight;
  return Array.from(stage.querySelectorAll<HTMLElement>('[data-badges]')).some((b) => {
    const r = b.getBoundingClientRect();
    if (r.height === 0 || r.bottom <= 0 || r.top >= vh) return false;
    let op = 1;
    for (let el: HTMLElement | null = b; el && el !== stage; el = el.parentElement) {
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') return false;
      op *= parseFloat(cs.opacity);
    }
    return op >= 0.5;
  });
}

/**
 * Sticky mobile download bar (spec §4.1). Shown below 1024px (CSS) only while
 * every rule holds: hero badges out of view, no download block ≥20% in view,
 * no immersive stage ≥50% in view, no demo running, last scroll up or idle
 * >1.2s, not dismissed this session, and (iOS Safari, where the Smart App
 * Banner shows) not before the visitor has scrolled a viewport past the hero
 * badges or past #about. A stage that is itself a download block (#download)
 * hides the bar only while its own store badges are readable. `main` padding
 * is reserved in CSS, so showing or hiding never moves layout.
 */
export function MobileDownloadBarClient({ t, lang, appStoreHref, playHref, getHref }: MobileDownloadBarClientProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const platform = usePlatform();
  const href = platform === 'ios' ? appStoreHref : platform === 'android' ? playHref : getHref;

  useEffect(() => {
    const html = document.documentElement;
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) {
        // Session storage is client-only; the bar starts hidden either way.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDismissed(true);
        return;
      }
    } catch {
      /* storage blocked: the bar stays dismissible for this page view */
    }

    const s = {
      heroOut: false,
      /** scrollY when the hero badges left the top of the viewport (iOS gate) */
      heroOutAt: null as number | null,
      blocks: new Map<Element, boolean>(),
      stages: new Map<Element, boolean>(),
      demo: false,
      upOrIdle: false,
      gateOpen: !html.hasAttribute('data-ios-safari'),
    };
    // Stages that are download blocks: judged by their badges, not their box.
    const stageBlocks = Array.from(document.querySelectorAll('[data-immersive][data-download-block]'));
    const stageActive = new Set<Element>();
    const update = () => {
      const blocked =
        [...s.blocks.values()].some(Boolean) ||
        [...s.stages.values()].some(Boolean) ||
        [...stageActive].some((el) => badgesShowing(el));
      setVisible(s.heroOut && !blocked && !s.demo && s.upOrIdle && s.gateOpen);
    };

    const ios: IntersectionObserver[] = [];
    const watch = (els: Element[], cb: (e: IntersectionObserverEntry) => void, threshold: number | number[] = 0) => {
      if (!els.length) return;
      const io = new IntersectionObserver((entries) => {
        entries.forEach(cb);
        update();
      }, { threshold });
      els.forEach((el) => io.observe(el));
      ios.push(io);
    };

    const heroBadges = document.querySelector('#hero [data-badges]');
    if (heroBadges) {
      watch([heroBadges], (e) => {
        s.heroOut = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (!s.heroOut) s.heroOutAt = null;
        else if (s.heroOutAt === null) s.heroOutAt = window.scrollY;
      });
    } else s.heroOut = true;
    const isStageBlock = (el: Element) => stageBlocks.includes(el);
    watch(
      Array.from(document.querySelectorAll('[data-download-block]')).filter((el) => !isStageBlock(el)),
      (e) => s.blocks.set(e.target, visibleShare(e) >= 0.2),
      THRESHOLDS,
    );
    watch(
      Array.from(document.querySelectorAll('[data-immersive]')).filter((el) => !isStageBlock(el)),
      (e) => s.stages.set(e.target, visibleShare(e) >= 0.5),
      THRESHOLDS,
    );
    watch(stageBlocks, (e) => (e.isIntersecting ? stageActive.add(e.target) : stageActive.delete(e.target)));
    if (!s.gateOpen) {
      // iOS Safari shows the Smart App Banner at the top: the bar waits until
      // the visitor is clearly past the hero, never as far as #chat.
      const about = document.getElementById('about');
      if (about) watch([about], (e) => { if (e.boundingClientRect.bottom < 0) s.gateOpen = true; });
    }

    let lastY = window.scrollY;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      const y = window.scrollY;
      if (!s.gateOpen && s.heroOutAt !== null && y - s.heroOutAt >= window.innerHeight) s.gateOpen = true;
      if (Math.abs(y - lastY) > 2) {
        s.upOrIdle = y < lastY;
        lastY = y;
        update();
      }
      clearTimeout(idle);
      idle = setTimeout(() => {
        s.upOrIdle = true;
        update();
      }, IDLE_MS);
    };
    const onDemo = (e: Event) => {
      s.demo = e.type === 'lc:demo-start';
      update();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('lc:demo-start', onDemo);
    window.addEventListener('lc:demo-end', onDemo);
    return () => {
      ios.forEach((io) => io.disconnect());
      clearTimeout(idle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('lc:demo-start', onDemo);
      window.removeEventListener('lc:demo-end', onDemo);
    };
  }, []);

  const dismiss = () => {
    setDismissed(true);
    track('sticky_dismiss', { lang });
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  if (dismissed) return null;
  const shown = visible;
  return (
    <div className="dl-bar glass-night glass-live" data-visible={shown ? '' : undefined} aria-hidden={!shown} inert={!shown}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 36px app icon */}
      <img src="/brand/appicon-180.png" alt="" width={36} height={36} loading="lazy" decoding="async" fetchPriority="low" />
      <p className="dl-bar-text">
        <span className="dl-bar-title">{t.title}</span>
        <span className="dl-bar-sub">{t.sub}</span>
      </p>
      <a
        href={href}
        className="btn-primary"
        onClick={() => track('cta_click', { loc: 'sticky', platform: platform ?? 'desktop', lang })}
      >
        {t.cta}
      </a>
      <button type="button" className="dl-bar-close" aria-label={t.dismiss} onClick={dismiss}>
        <Glyph name="close" size={22} />
      </button>
    </div>
  );
}
