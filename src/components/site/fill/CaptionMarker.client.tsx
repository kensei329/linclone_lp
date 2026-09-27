'use client';

type CaptionMarkerProps = { targetId: string; restOn?: 'last' | number; tone: 'teal' | 'neon' | 'violet' };

// STUB (WP0a): final props per spec §4.3. WP0b implements the hopping marker;
// with no marker the text is unchanged (the no-JS state).
export function CaptionMarker(props: CaptionMarkerProps): null {
  void props;
  return null;
}
