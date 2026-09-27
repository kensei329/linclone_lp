import type { ReactNode } from 'react';
import { SkipLink } from './SkipLink';

/** Section background recipes (spec §3.2). */
export type SurfaceToken =
  | 'dawn' | 'cream' | 'day' | 'teal-band' | 'night' | 'night-to-dawn'
  | 'lavender' | 'studio' | 'studio-cyan' | 'night-deep';

const DARK: ReadonlySet<SurfaceToken> = new Set(['night', 'night-to-dawn', 'night-deep']);

type SectionProps = {
  id: string;
  surface: SurfaceToken;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
  skipTo?: string;
  skipLabel?: string;
  download?: boolean;
  immersive?: boolean;
};

/** Page section shell (spec §4.3). `.is-inview` is toggled by the global InViewObserver. */
export function Section({ id, surface, labelledBy, className, children, skipTo, skipLabel, download, immersive }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-surface={DARK.has(surface) ? 'dark' : 'light'}
      data-download-block={download ? '' : undefined}
      data-immersive={immersive ? '' : undefined}
      className={[`surface-${surface}`, className].filter(Boolean).join(' ')}
    >
      {skipTo && skipLabel ? <SkipLink href={skipTo} label={skipLabel} /> : null}
      {children}
    </section>
  );
}
