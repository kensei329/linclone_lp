import type { IconName as MaterialIconName } from './paths';
import type { BrandIconName } from './brand';

/** Material Symbols (generated) plus the hand-drawn `apple` / `google-g` brand glyphs. */
export type IconName = MaterialIconName | BrandIconName;

type IconProps = { name: IconName; filled?: boolean; size?: number; className?: string; label?: string };

/** Sprite symbol id of an icon (see `SiteSprite`). */
export const iconId = (name: IconName, filled = false) => `i-${name}${filled ? '-f' : ''}`;

/**
 * SVG glyph; there is no icon font (spec §4.7). Each glyph is drawn once per
 * page as a `<symbol>` in the layout's `SiteSprite`; this only references it,
 * so repeated icons cost one `<use>` each. Decorative unless `label` is set.
 * (Brand glyphs have no filled variant.)
 */
export function Icon({ name, filled = false, size = 20, className, label }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
    >
      <use href={`#${iconId(name, filled && !(name === 'apple' || name === 'google-g'))}`} />
    </svg>
  );
}
