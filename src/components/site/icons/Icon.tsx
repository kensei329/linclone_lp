import { PATHS, type IconName } from './paths';

export type { IconName } from './paths';

type IconProps = { name: IconName; filled?: boolean; size?: number; className?: string; label?: string };

/** Material Symbols glyph as inline SVG (no icon font). Decorative unless `label` is set. */
export function Icon({ name, filled = false, size = 20, className, label }: IconProps) {
  return (
    <svg
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      className={className}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
    >
      <path d={PATHS[name][filled ? 'f' : 'o']} fill="currentColor" />
    </svg>
  );
}
