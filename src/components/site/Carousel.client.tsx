'use client';

import type { ReactNode } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';

type CarouselClientProps = { label: string; items: ReactNode[]; itemWidth: string; a11y: Dictionary['a11y'] };

// STUB (WP0a): the scroller and items; WP0b adds dots, prev/next buttons
// (a11y.carouselPrev/Next/Position) and `data-active` tracking.
export function CarouselClient({ label, items, itemWidth, a11y }: CarouselClientProps) {
  void a11y;
  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} data-lenis-prevent="">
      <ul style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: itemWidth, overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
        {items.map((item, i) => (
          <li key={i} style={{ scrollSnapAlign: 'start' }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
