import { CLIENT_PATHS, type ClientIconName } from './client-paths';

/**
 * Decorative icon for client islands (a 5-glyph subset, see
 * scripts/build-icons.mjs). Server components use `Icon`.
 */
export function Glyph({ name, size = 20, flip = false }: { name: ClientIconName; size?: number; flip?: boolean }) {
  return (
    <svg viewBox="0 -960 960 960" width={size} height={size} aria-hidden="true" focusable="false" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d={CLIENT_PATHS[name]} fill="currentColor" />
    </svg>
  );
}
