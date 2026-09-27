'use client';

import { useEffect, useRef } from 'react';

/**
 * One-shot pop for a small element (spec §5.3: the disclosure-bar icon,
 * `back.out(1.6)` .45s on enter). CSS-driven through `data-pop`; the start
 * state is applied only when the element is below the fold at init, and never
 * under reduced motion, so server HTML and no-JS always show it.
 */
export function PopOnEnter({ selector }: { selector: string }) {
  const anchor = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const host = anchor.current?.parentElement;
    const el = host?.querySelector<HTMLElement | SVGElement>(selector);
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top <= window.innerHeight) return;
    el.setAttribute('data-pop', 'pending');
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.setAttribute('data-pop', 'go');
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeAttribute('data-pop');
    };
  }, [selector]);
  return <span ref={anchor} hidden />;
}
