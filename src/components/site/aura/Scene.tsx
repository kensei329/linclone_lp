type SceneProps = {
  kind: 'rain-neon' | 'cafe-light' | 'night-sea' | 'stage-light' | 'autumn-leaves' | 'dawn-sky';
  className?: string;
};

/**
 * Token-only CSS composition standing in for AI images and LIVE backgrounds
 * (spec §4.7). No people, no stars motif, no filters. Fills its positioned
 * container (absolute, inset 0).
 */
export function Scene({ kind, className }: SceneProps) {
  return <span aria-hidden="true" data-scene={kind} className={['scene', className].filter(Boolean).join(' ')} />;
}
