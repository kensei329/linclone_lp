'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { CallDemoProps } from './CallDemo.client';

const CallDemo = lazy(() => import('./CallDemo.client').then((m) => ({ default: m.CallDemo })));

/**
 * Loads the tap-to-call demo only when #call is within one viewport (spec
 * §5.4), so its chunk is not in the initial JS. Until then (and without JS)
 * the server-rendered `#download` link in `[data-demo-root]` stands in.
 */
export function CallDemoLoader(props: CallDemoProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const section = anchor.current?.closest('#call');
    if (!section || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setLoad(true);
      },
      { rootMargin: '100% 0px' },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);
  return (
    <>
      <span ref={anchor} hidden />
      {load ? (
        <Suspense fallback={null}>
          <CallDemo {...props} />
        </Suspense>
      ) : null}
    </>
  );
}
