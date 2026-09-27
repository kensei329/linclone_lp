import type { ReactNode } from 'react';
import { StatusBar } from '@/components/mockups/kit';

/**
 * A 390×844 mockup screen scaled to an `ExpandStage` bezel. The bezel width is
 * the stage's `--pw` (a length: `300px` on desktop, `min(74vw, 290px)` on
 * mobile), so the unitless scale is `tan(atan2(--pw, 390px))`, pure CSS.
 * The bezel is hidden in the server/final state, so this only shows once a
 * stage animator primes the start state.
 */
export function BezelScreen({ children, time = '10:42' }: { children: ReactNode; time?: string }) {
  return (
    <div className="cr-bezel-screen" aria-hidden="true">
      {children}
      <StatusBar time={time} theme="cream" />
    </div>
  );
}
