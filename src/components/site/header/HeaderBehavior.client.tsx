'use client';

import { useEffect, useRef } from 'react';

/**
 * Client behaviour for the server-rendered header (spec §4.1):
 * - transparent over the top, glass + hairline after 24px of scroll
 * - `data-theme="dark"` while the section under the header's bottom edge is dark
 * - below 1024px: hides on scroll-down (>8px), shows on scroll-up; CSS keeps it
 *   shown while focus is inside
 * - the decorative 2px page-progress line (a CSS var driving scaleX)
 * - the mobile menu: a modal <dialog> (focus trap, Esc) that stops Lenis
 */
export function HeaderBehavior() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const header = anchor.current?.closest<HTMLElement>('.site-header');
    if (!header) return;
    const progress = header.querySelector<HTMLElement>('.header-progress');
    const dialog = header.querySelector<HTMLDialogElement>('dialog.header-sheet');
    const menuBtn = header.querySelector<HTMLButtonElement>('.header-inner .menu-btn');

    // ── scroll: glass, auto-hide, progress ──
    let lastY = window.scrollY;
    let dirY = lastY;
    let raf = 0;
    const onFrame = () => {
      raf = 0;
      const y = window.scrollY;
      const scrolled = y > 24;
      header.toggleAttribute('data-scrolled', scrolled);
      header.toggleAttribute('data-top', !scrolled);
      if (y > lastY && y - dirY > 8 && y > header.offsetHeight) header.setAttribute('data-hidden', '');
      else if (y < lastY) {
        header.removeAttribute('data-hidden');
        dirY = y;
      }
      if (y <= lastY) dirY = y;
      lastY = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress?.style.setProperty('--progress', max > 0 ? String(Math.min(1, y / max)) : '0');
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(onFrame);
    };
    onFrame();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── surface under the header's bottom edge ──
    let io: IntersectionObserver | undefined;
    const hits = new Set<Element>();
    const surfaces = Array.from(document.querySelectorAll('[data-surface]')).filter((el) => !header.contains(el));
    const applyTheme = () => {
      // The last hit in document order is the innermost/lowest surface.
      const hit = surfaces.filter((el) => hits.has(el)).pop();
      header.setAttribute('data-theme', hit?.getAttribute('data-surface') === 'dark' ? 'dark' : 'light');
    };
    const observe = () => {
      io?.disconnect();
      hits.clear();
      const h = header.offsetHeight;
      const vh = window.innerHeight;
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => (e.isIntersecting ? hits.add(e.target) : hits.delete(e.target)));
          applyTheme();
        },
        { rootMargin: `-${h}px 0px -${Math.max(0, vh - h - 1)}px 0px` },
      );
      surfaces.forEach((el) => io!.observe(el));
    };
    observe();
    let resizeT: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(observe, 150);
    };
    window.addEventListener('resize', onResize);

    // ── mobile menu ──
    const openMenu = (e: Event) => {
      e.preventDefault(); // cancels the native `command` so it does not run twice
      if (!dialog || dialog.open) return;
      dialog.showModal();
      menuBtn?.setAttribute('aria-expanded', 'true');
      window.__lcLenis?.stop();
    };
    const closeMenu = () => {
      window.__lcLenis?.start();
      menuBtn?.setAttribute('aria-expanded', 'false');
      if (dialog?.open) dialog.close();
    };
    const onDialogClick = (e: MouseEvent) => {
      const closer = (e.target as Element).closest('[data-menu-close]');
      if (!closer) return;
      if (closer.tagName === 'BUTTON') e.preventDefault();
      closeMenu(); // links then follow their hash (Lenis is running again)
    };
    menuBtn?.setAttribute('aria-expanded', 'false');
    menuBtn?.addEventListener('click', openMenu);
    dialog?.addEventListener('click', onDialogClick);
    dialog?.addEventListener('close', closeMenu);
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = () => mq.matches && closeMenu();
    mq.addEventListener('change', onMq);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeT);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      io?.disconnect();
      menuBtn?.removeEventListener('click', openMenu);
      dialog?.removeEventListener('click', onDialogClick);
      dialog?.removeEventListener('close', closeMenu);
      mq.removeEventListener('change', onMq);
    };
  }, []);

  return <span ref={anchor} hidden />;
}
