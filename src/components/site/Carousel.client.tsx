'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import { fmt } from '@/i18n/format';
import { Glyph } from './icons/Glyph';

type CarouselClientProps = {
  label: string;
  items: ReactNode[];
  itemWidth: string;
  a11y: Pick<Dictionary['a11y'], 'carouselPrev' | 'carouselNext' | 'carouselPosition'>;
};

/**
 * Native scroll-snap carousel (spec §4.3): 44px prev/next buttons, position
 * dots, arrow keys, and `data-active` on each item while ≥60% of it is visible
 * (mockup micro-sequences listen for it). Works as a plain swipe list without JS.
 */
export function CarouselClient({ label, items, itemWidth, a11y }: CarouselClientProps) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const lis = Array.from(el.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const on = e.intersectionRatio >= 0.6;
          (e.target as HTMLElement).toggleAttribute('data-active', on);
          if (on) setActive(lis.indexOf(e.target as HTMLElement));
        }
      },
      { root: el, threshold: [0, 0.6, 1] },
    );
    lis.forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, [items.length]);

  const go = (i: number) => {
    const el = track.current;
    const li = el?.children[Math.max(0, Math.min(items.length - 1, i))] as HTMLElement | undefined;
    if (!el || !li) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: li.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).scrollPaddingInlineStart || '0'), behavior: reduce ? 'auto' : 'smooth' });
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') go(active + 1);
    else if (e.key === 'ArrowLeft') go(active - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div className="carousel" role="region" aria-roledescription="carousel" aria-label={label} data-lenis-prevent-horizontal="" onKeyDown={onKey}>
      <ul ref={track} className="carousel-track" style={{ '--item-w': itemWidth } as CSSProperties} tabIndex={0}>
        {items.map((item, i) => (
          <li key={i} data-active={i === 0 ? '' : undefined} aria-roledescription="slide" aria-label={fmt(a11y.carouselPosition, { current: i + 1, total: items.length })}>
            {item}
          </li>
        ))}
      </ul>
      {items.length > 1 ? (
        <div className="carousel-controls">
          {/* aria-disabled, not disabled: a disabled button drops keyboard focus to <body> at either end */}
          <button
            type="button"
            className="carousel-btn"
            aria-label={a11y.carouselPrev}
            aria-disabled={active === 0}
            onClick={() => active > 0 && go(active - 1)}
          >
            <Glyph name="chevron_right" size={22} flip />
          </button>
          <ul className="carousel-dots">
            {items.map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="carousel-dot"
                  aria-label={fmt(a11y.carouselPosition, { current: i + 1, total: items.length })}
                  aria-current={i === active ? 'true' : undefined}
                  onClick={() => go(i)}
                />
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="carousel-btn"
            aria-label={a11y.carouselNext}
            aria-disabled={active === items.length - 1}
            onClick={() => active < items.length - 1 && go(active + 1)}
          >
            <Glyph name="chevron_right" size={22} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
