type SceneProps = {
  kind: 'rain-neon' | 'cafe-light' | 'night-sea' | 'stage-light' | 'autumn-leaves' | 'dawn-sky';
  className?: string;
};

/** Token-only background composition (spec §4.7). STUB (WP0a). */
export function Scene({ kind, className }: SceneProps) {
  return <span aria-hidden="true" data-scene={kind} className={className} />;
}
