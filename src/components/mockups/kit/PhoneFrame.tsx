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
 * Phone bezel around a 390×844 logical screen scaled to `--pw` px wide
 * (spec §4.8). The figure carries the accessible label; the screen content is
 * decorative (`aria-hidden`) and kept out of search snippets (`data-nosnippet`).
 * Status bar and dynamic island sit on top.
 */
export function PhoneFrame({ size, label, theme = 'cream', statusTime = '10:42', className, children }: PhoneFrameProps) {
  const style = { '--pw-m': size.mobile, '--pw-d': size.desktop } as CSSProperties;
  return (
    <figure role="img" aria-label={label} className={['phone', className].filter(Boolean).join(' ')} data-theme={theme} style={style} data-nosnippet="">
      <div className="screen" aria-hidden="true">
        {children}
        <StatusBar time={statusTime} theme={theme} />
        <span className="phone-island" />
      </div>
    </figure>
  );
}
