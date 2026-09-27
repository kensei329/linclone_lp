import { PATHS, type IconName as MaterialIconName } from './paths';
import { BRAND_PATHS, type BrandIconName } from './brand';

/** Material Symbols (generated) plus the hand-drawn `apple` / `google-g` brand glyphs. */
export type IconName = MaterialIconName | BrandIconName;

type IconProps = { name: IconName; filled?: boolean; size?: number; className?: string; label?: string };

const isBrand = (name: IconName): name is BrandIconName => name in BRAND_PATHS;

/**
 * Inline SVG glyph; there is no icon font (spec §4.7). Decorative unless
 * `label` is set. Server-only in practice: importing it into a client island
 * would ship every path, so client islands receive icons as rendered children.
 */
export function Icon({ name, filled = false, size = 20, className, label }: IconProps) {
  const brand = isBrand(name) ? BRAND_PATHS[name] : null;
  return (
    <svg
      viewBox={brand ? brand.viewBox : '0 -960 960 960'}
      width={size}
      height={size}
      className={className}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
    >
      <path d={brand ? brand.d : PATHS[name as MaterialIconName][filled ? 'f' : 'o']} fill="currentColor" />
    </svg>
  );
}
