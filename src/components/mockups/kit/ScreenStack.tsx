import type { ReactNode } from 'react';

/**
 * Absolute stack of 390×844 screens (spec §4.3). `[data-screen][data-active]`
 * is visible; transitions are CSS: fade (default) or push, per screen, in the
 * app's TabBar/stack grammar. The first screen is active in the server HTML.
 */
export function ScreenStack({ children, transition }: { children: ReactNode[]; transition?: ('fade' | 'push')[] }) {
  return (
    <div className="screen-stack">
      {children.map((child, i) => (
        <div key={i} data-screen={i} data-transition={transition?.[i] ?? 'fade'} data-active={i === 0 ? '' : undefined}>
          {child}
        </div>
      ))}
    </div>
  );
}
