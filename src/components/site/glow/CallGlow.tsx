import type { CSSProperties } from 'react';

type CallGlowProps = { variant: 'avatar' | 'fan'; size?: number; state?: 'off' | 'breathe' };

/**
 * Radial-gradient call light (spec §4.7). `avatar`: centred behind the
 * portrait (default 2.5× its box; `size` in px overrides), `[data-avatar-glow]`.
 * `fan`: a 160vw disc rising from below, `[data-fan-glow]`. Transform and
 * opacity only, never a filter; timelines keep the two from being lit at once.
 * Place inside a positioned container.
 */
export function CallGlow({ variant, size, state = 'off' }: CallGlowProps) {
  const style = size && variant === 'avatar' ? ({ '--glow-size': `${size}px` } as CSSProperties) : undefined;
  return (
    <span
      aria-hidden="true"
      data-avatar-glow={variant === 'avatar' ? '' : undefined}
      data-fan-glow={variant === 'fan' ? '' : undefined}
      data-state={state}
      data-loop={state === 'breathe' ? '' : undefined}
      style={style}
    />
  );
}
