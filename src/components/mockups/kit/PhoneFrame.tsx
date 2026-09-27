import type { CSSProperties, ReactNode } from 'react';
import { StatusBar } from './StatusBar';

type PhoneFrameProps = {
  size: { mobile: number; desktop: number };
  label: string;
  theme?: 'cream' | 'night';
  statusTime?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Phone bezel around a 390×844 screen scaled to `--pw` (spec §4.8).
 * STUB (WP0a): structure and scaling vars; WP0b adds the bezel CSS and island.
 */
export function PhoneFrame({ size, label, theme = 'cream', statusTime = '10:42', className, children }: PhoneFrameProps) {
  const style = { '--pw-m': size.mobile, '--pw-d': size.desktop } as CSSProperties;
  return (
    <figure role="img" aria-label={label} className={['phone', className].filter(Boolean).join(' ')} style={style}>
      <div className="screen" aria-hidden="true">
        <StatusBar time={statusTime} theme={theme} />
        {children}
      </div>
    </figure>
  );
}
