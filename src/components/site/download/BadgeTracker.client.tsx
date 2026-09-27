'use client';

import type { MouseEvent, ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import type { Placement } from '@/lib/site-config';
import { track } from '@/lib/analytics';

type BadgeTrackerProps = { placement: Placement; lang: Locale; size: 'md' | 'lg'; children: ReactNode };

/** The `[data-badges]` wrapper: delegates `cta_click{loc, platform, lang}` for the store links inside (spec §4.2). */
export function BadgeTracker({ placement, lang, size, children }: BadgeTrackerProps) {
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const a = (e.target as Element).closest('a[data-store]');
    if (!a) return;
    track('cta_click', { loc: placement, platform: a.getAttribute('data-store') ?? 'desktop', lang });
  };
  return (
    <div data-badges="" data-size={size} className="store-badges" onClick={onClick}>
      {children}
    </div>
  );
}
