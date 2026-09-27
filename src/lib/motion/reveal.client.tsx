'use client';

import type { ReactNode } from 'react';

// STUB (WP0a): final signature per spec §4.5. WP0b adds the
// ScrollTrigger.batch reveal; children render in their final state.

export function RevealGroup({ selector, stagger, children }: { selector?: string; stagger?: number; children: ReactNode }) {
  void selector;
  void stagger;
  return <>{children}</>;
}
