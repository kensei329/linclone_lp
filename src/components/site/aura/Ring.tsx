import type { CSSProperties, ReactNode } from 'react';

type RingProps = { progress?: number; size: number; tone: 'violet' | 'teal'; label?: ReactNode; stroke?: number };

/** Progress ring driven by `--p` (0–100, SSR final = 100) (spec §4.7). STUB (WP0a). */
export function Ring({ progress = 1, size, tone, label, stroke = 6 }: RingProps) {
  const style = { '--p': Math.round(progress * 100), width: size, height: size, '--stroke': `${stroke}px` } as CSSProperties;
  return (
    <span className="ring" data-tone={tone} style={style}>
      {label}
    </span>
  );
}
