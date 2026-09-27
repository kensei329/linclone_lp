import type { CSSProperties, ReactNode } from 'react';

type ScreenSliceProps = {
  label: string;
  width: { mobile: number; desktop?: number };
  crop: { y: number; h: number };
  radius?: number;
  children: ReactNode;
};

/**
 * Cropped window onto a 390×844 screen (spec §4.8): `crop.y`/`crop.h` are in
 * screen px, the figure is `width` px wide. Keep the effective scale ≥0.75
 * when the slice carries meaning (so `width.mobile` ≥ 292).
 */
export function ScreenSlice({ label, width, crop, radius = 28, children }: ScreenSliceProps) {
  const style = {
    '--sw-m': width.mobile,
    '--sw-d': width.desktop ?? width.mobile,
    '--crop-y': crop.y,
    '--crop-h': crop.h,
    borderRadius: radius,
  } as CSSProperties;
  return (
    <figure role="img" aria-label={label} className="screen-slice" style={style}>
      <div className="screen-slice-inner" aria-hidden="true">
        {children}
      </div>
    </figure>
  );
}
