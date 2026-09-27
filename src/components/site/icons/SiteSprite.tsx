import { PATHS, type IconName as MaterialIconName } from './paths';
import { BRAND_PATHS, type BrandIconName } from './brand';
import { iconId } from './Icon';
import { AuraDefs } from '../aura/Aura';

const MATERIAL = Object.keys(PATHS) as MaterialIconName[];
const BRAND = Object.keys(BRAND_PATHS) as BrandIconName[];

/**
 * One hidden SVG per page (rendered once by the (site) layout) holding every
 * icon as a `<symbol>` (outlined and filled) and the shared Aura gradients.
 * `Icon` and `Aura` reference these by id, so the page carries each path and
 * gradient once instead of per use. Not `display:none`: gradients inside a
 * non-rendered SVG do not paint in every engine.
 */
export function SiteSprite() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        {MATERIAL.map((n) => (
          <symbol key={n} id={iconId(n)} viewBox="0 -960 960 960">
            <path d={PATHS[n].o} fill="currentColor" />
          </symbol>
        ))}
        {MATERIAL.map((n) => (
          <symbol key={`${n}-f`} id={iconId(n, true)} viewBox="0 -960 960 960">
            {/* glyphs whose filled form is identical reuse the outlined path */}
            {PATHS[n].f === PATHS[n].o ? (
              <use href={`#${iconId(n)}`} y={-960} width={960} height={960} />
            ) : (
              <path d={PATHS[n].f} fill="currentColor" />
            )}
          </symbol>
        ))}
        {BRAND.map((n) => (
          <symbol key={n} id={iconId(n)} viewBox={BRAND_PATHS[n].viewBox}>
            <path d={BRAND_PATHS[n].d} fill="currentColor" />
          </symbol>
        ))}
        <AuraDefs />
      </defs>
    </svg>
  );
}
