import type { ReactNode } from 'react';

/** Absolute stack of screens; `[data-screen][data-active]` is visible (spec §4.3). STUB (WP0a). */
export function ScreenStack({ children }: { children: ReactNode[] }) {
  return (
    <div className="screen-stack" style={{ position: 'relative' }}>
      {children.map((child, i) => (
        <div key={i} data-screen={i} data-active={i === 0 ? '' : undefined}>
          {child}
        </div>
      ))}
    </div>
  );
}
