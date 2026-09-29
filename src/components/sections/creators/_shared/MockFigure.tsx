import type { ReactNode } from 'react';

/**
 * Accessible wrapper for card-type Studio mockups (spec §7.0): the figure is
 * the image (`role="img"` + the mockup's alt), its UI is decorative.
 */
export function MockFigure({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <figure role="img" aria-label={label} className={['cr-mock', className].filter(Boolean).join(' ')}>
      <div aria-hidden="true" className="cr-mock-inner">
        {children}
      </div>
    </figure>
  );
}
