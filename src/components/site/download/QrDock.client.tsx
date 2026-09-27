'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import { track } from '@/lib/analytics';
import { Glyph } from '../icons/Glyph';

// `d` is narrowed to the keys the dock shows so the server shell can pass a
// small object (a full Dictionary is assignable, but would be serialised whole).
type QrDockProps = { d: Pick<Dictionary, 'qrDock'>; children: ReactNode };

const KEY = 'lc.qrDock';

/**
 * Desktop QR dock (spec §4.1): ≥1024 and home only (CSS). Appears once #hero
 * has left the viewport and hides while any [data-download-block] is in view.
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
    try {
      setCollapsed(sessionStorage.getItem(KEY) === 'collapsed');
    } catch {
      /* storage blocked */
    }
    let heroOut = false;
    const blocks = new Set<Element>();
    const update = () => setVisible(heroOut && blocks.size === 0);
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
    update();
    return () => {
      heroIo.disconnect();
      blockIo.disconnect();
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
          {t.title}
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
