'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * For animator islands rendered inside a server component: render
 * `<span hidden ref={anchor} />` and get a ref to the element it belongs to
 * (`closest(selector)`, or the parent when no selector is given). Declare this
 * before `useScrollScene` so the scope is set when the scene's effect runs.
 */
export function useAnchorScope<T extends HTMLElement = HTMLElement>(
  selector?: string,
): { anchor: RefObject<HTMLSpanElement | null>; scope: RefObject<T | null> } {
  const anchor = useRef<HTMLSpanElement>(null);
  const scope = useRef<T>(null);
  useEffect(() => {
    const a = anchor.current;
    scope.current = (selector ? a?.closest<T>(selector) : (a?.parentElement as T | null)) ?? null;
  }, [selector]);
  return { anchor, scope };
}
