import type { CSSProperties, ReactNode } from 'react';

type RingProps = { progress?: number; size: number; tone: 'violet' | 'teal'; label?: ReactNode; stroke?: number };

/**
 * Conic progress ring driven by `--p` (0–100; SSR final = 100) (spec §4.7).
 * Animators tween `--p` on the root (`[data-ring]`); the masked track reads it.
 * (The root class is `lc-ring`: a bare `ring` would match Tailwind's `ring` utility.)
 */
export function Ring({ progress = 1, size, tone, label, stroke = 6 }: RingProps) {
  const style = { '--p': Math.round(Math.min(1, Math.max(0, progress)) * 100), '--stroke': `${stroke}px`, width: size, height: size } as CSSProperties;
  return (
    <span className="lc-ring" data-ring="" data-tone={tone} style={style}>
      <span className="ring-track" aria-hidden="true" />
      {label ? <span className="ring-label">{label}</span> : null}
    </span>
  );
}
