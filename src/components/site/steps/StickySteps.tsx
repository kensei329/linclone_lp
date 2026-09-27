import type { ReactNode } from 'react';

export type StickyStep = {
  id: string;
  label?: string;
  title: string;
  body: ReactNode;
  /** ScreenSlice for <1024 */
  mobileSlice: ReactNode;
};

export type StickyStepsProps = {
  id: string;
  steps: StickyStep[];
  /** one per step, rendered inside PhoneFrame + ScreenStack */
  screens: ReactNode[];
  phoneSize: { desktop: number };
  phoneLabel: string;
  side: 'left' | 'right';
  /** default '70svh' */
  stepMinHeight?: string;
  transition?: ('fade' | 'push')[];
  /** default 'carousel' */
  mobileLayout?: 'carousel' | 'list';
  carouselLabel?: string;
};

/**
 * Sticky phone + scrolling steps (spec §4.3). STUB (WP0a): renders every step
 * as a list (the no-JS content); WP0b adds the sticky phone, ScreenStack and
 * the mobile carousel.
 */
export function StickySteps({ id, steps }: StickyStepsProps) {
  return (
    <ol id={id} className="sticky-steps">
      {steps.map((s) => (
        <li key={s.id} id={s.id}>
          {s.label ? <p className="t-label">{s.label}</p> : null}
          <h3 className="t-h3">{s.title}</h3>
          <div className="t-body">{s.body}</div>
        </li>
      ))}
    </ol>
  );
}
