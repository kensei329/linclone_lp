import type { ReactNode } from 'react';

/** 390×844 logical app screen: cream #f7f3ec / night #0f1018, app font and ink (spec §4.8). */
export function Screen({ theme, children }: { theme: 'cream' | 'night'; children: ReactNode }) {
  return (
    <div className="mock-screen" data-theme={theme}>
      {children}
    </div>
  );
}
