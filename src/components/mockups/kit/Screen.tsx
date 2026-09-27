import type { ReactNode } from 'react';

/** 390×844 logical app screen (spec §4.8). */
export function Screen({ theme, children }: { theme: 'cream' | 'night'; children: ReactNode }) {
  return (
    <div
      data-theme={theme}
      style={{
        position: 'relative',
        width: 390,
        height: 844,
        overflow: 'hidden',
        background: theme === 'night' ? '#0f1018' : '#f7f3ec',
        color: theme === 'night' ? '#fff' : '#28273b',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {children}
    </div>
  );
}
