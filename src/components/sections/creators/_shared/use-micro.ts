'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { reducedMotion } from './micro';

/**
 * Mounts a micro-sequence island inside a server section: render
 * `<span hidden ref={anchor} />`, and `setup(root)` runs once on mount with the
 * closest `selector` ancestor. Never runs under prefers-reduced-motion (the
 * server HTML is already the final state). `setup` returns its cleanup.
 */
export function useMicro(selector: string, setup: (root: HTMLElement) => void | (() => void)): RefObject<HTMLSpanElement | null> {
  const anchor = useRef<HTMLSpanElement>(null);
  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  });
  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>(selector);
    if (!root || reducedMotion() || typeof IntersectionObserver === 'undefined') return;
    return setupRef.current(root) ?? undefined;
  }, [selector]);
  return anchor;
}
