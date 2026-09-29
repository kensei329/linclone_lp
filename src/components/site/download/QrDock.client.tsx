'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import { track } from '@/lib/analytics';
import { Glyph } from '../icons/Glyph';

// `d` is narrowed to the keys the dock shows so the server shell can pass a
// small object (a full Dictionary is assignable, but would be serialised whole).
type QrDockProps = { d: Pick<Dictionary, 'qrDock'>; children: ReactNode };

const KEY = 'lc.qrDock';
const ROOMY = '(min-width: 1760px)';

/**
 * Desktop QR dock (spec §4.1): ≥1424 and home only (CSS); below 1760px the
 * collapsed dock is a 44px icon button in the page's right margin, so it never
 * sits on the content column. Appears once #hero
 * has left the viewport and hides while any [data-download-block] is in view,
 * while an immersive stage spans the viewport middle, and during the call demo.
 * The collapsed state is remembered for the session. Not rendered without JS.
 */
export function QrDock({ d, children }: QrDockProps) {
  const t = d.qrDock;
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Client-only state (session storage, observers): render nothing on the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // The 200px card only fits beside the 1312px container from ~1760px up;
    // narrower desktops start with the 44px chip unless the visitor opened it.
    const roomy = window.matchMedia(ROOMY);
    let stored: string | null = null;
    try {
      stored = sessionStorage.getItem(KEY);
    } catch {
      /* storage blocked */
    }
    setCollapsed(stored ? stored === 'collapsed' : !roomy.matches);
    const onRoomy = () => {
      let pref: string | null = null;
      try {
        pref = sessionStorage.getItem(KEY);
      } catch {
        /* ignore */
      }
      if (!pref) setCollapsed(!roomy.matches);
    };
    roomy.addEventListener('change', onRoomy);
    let heroOut = false;
    let demo = false;
    const blocks = new Set<Element>();
    const stages = new Set<Element>();
    const update = () => setVisible(heroOut && !demo && blocks.size === 0 && stages.size === 0);
    const hero = document.getElementById('hero');
    const heroIo = new IntersectionObserver(([e]) => {
      heroOut = !e.isIntersecting && e.boundingClientRect.top < 0;
      update();
    });
    if (hero) heroIo.observe(hero);
    else heroOut = true;
    const blockIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? blocks.add(e.target) : blocks.delete(e.target)));
      update();
    });
    document.querySelectorAll('[data-download-block]').forEach((el) => blockIo.observe(el));
    // Immersive stages: hidden while one spans the middle of the viewport.
    const stageIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? stages.add(e.target) : stages.delete(e.target)));
        update();
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    document.querySelectorAll('[data-immersive]').forEach((el) => stageIo.observe(el));
    const onDemo = (e: Event) => {
      demo = e.type === 'lc:demo-start';
      update();
    };
    window.addEventListener('lc:demo-start', onDemo);
    window.addEventListener('lc:demo-end', onDemo);
    update();
    return () => {
      roomy.removeEventListener('change', onRoomy);
      heroIo.disconnect();
      blockIo.disconnect();
      stageIo.disconnect();
      window.removeEventListener('lc:demo-start', onDemo);
      window.removeEventListener('lc:demo-end', onDemo);
    };
  }, []);

  const set = (next: boolean) => {
    setCollapsed(next);
    if (!next) track('qr_open', { loc: 'dock', lang: document.documentElement.lang });
    try {
      sessionStorage.setItem(KEY, next ? 'collapsed' : 'open');
    } catch {
      /* ignore */
    }
  };

  if (!mounted) return null;
  return (
    <aside className="qr-dock" aria-label={t.title} data-visible={visible ? '' : undefined} inert={!visible}>
      {collapsed ? (
        <button type="button" className="qr-dock-chip glass-live" aria-label={t.expand} onClick={() => set(false)}>
          <Glyph name="qr_code_2" size={20} />
          <span className="qr-dock-chip-label">{t.title}</span>
        </button>
      ) : (
        <div className="qr-dock-card glass-live">
          <p className="qr-dock-title">{t.title}</p>
          {children}
          <button type="button" className="qr-dock-collapse" onClick={() => set(true)}>
            {t.collapse}
          </button>
        </div>
      )}
    </aside>
  );
}
