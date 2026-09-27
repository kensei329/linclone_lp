'use client';

import type { ReactNode } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';

// `d` is narrowed to the keys the dock shows so the server shell can pass a
// small object (a full Dictionary is still assignable, but would be serialised
// whole; don't).
type QrDockProps = { d: Pick<Dictionary, 'qrDock'>; children: ReactNode };

// STUB (WP0a): final props per spec §4.1. WP0b implements the dock.
export function QrDock({ d, children }: QrDockProps): null {
  void d;
  void children;
  return null;
}
