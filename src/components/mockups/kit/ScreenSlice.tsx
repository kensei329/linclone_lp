import type { CSSProperties, ReactNode } from 'react';

type ScreenSliceProps = {
  label: string;
  width: { mobile: number; desktop?: number };
  crop: { y: number; h: number };
  radius?: number;
  children: ReactNode;
};

/** Cropped window onto a 390×844 screen; keep width.mobile ≥ 292 (spec §4.8). STUB (WP0a). */
export function ScreenSlice({ label, width, crop, radius = 28, children }: ScreenSliceProps) {
  const style = {
    '--sw-m': `${width.mobile}px`,
    '--sw-d': `${width.desktop ?? width.mobile}px`,
    '--crop-y': crop.y,
    '--crop-h': crop.h,
    borderRadius: radius,
    overflow: 'hidden',
  } as CSSProperties;
  return (
    <figure role="img" aria-label={label} className="screen-slice" style={style}>
      <div aria-hidden="true">{children}</div>
    </figure>
  );
}
