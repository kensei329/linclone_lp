type CallGlowProps = { variant: 'avatar' | 'fan'; size?: number; state?: 'off' | 'breathe' };

/** Radial-gradient call glow; transform/opacity only (spec §4.7). STUB (WP0a). */
export function CallGlow({ variant, size, state = 'off' }: CallGlowProps) {
  return (
    <span
      aria-hidden="true"
      data-avatar-glow={variant === 'avatar' ? '' : undefined}
      data-fan-glow={variant === 'fan' ? '' : undefined}
      data-state={state}
      style={size ? { width: size, height: size } : undefined}
    />
  );
}
