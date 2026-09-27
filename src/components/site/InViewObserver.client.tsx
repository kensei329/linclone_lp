'use client';

import { useEffect } from 'react';

/**
 * Toggles `.is-inview` on every `main section` with one IntersectionObserver
 * (spec §4.3) so CSS loops only run on screen; pauses all loops while the tab
 * is hidden. Mounted once in the (site) layout.
 */
export function InViewObserver(): null {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section'));
    if (!sections.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle('is-inview', e.isIntersecting);
      },
      { rootMargin: '20% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    const onVisibility = () => document.documentElement.toggleAttribute('data-hidden', document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  return null;
}
