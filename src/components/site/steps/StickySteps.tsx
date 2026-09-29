import type { CSSProperties, ReactNode } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import { PhoneFrame } from '@/components/mockups/kit/PhoneFrame';
import { ScreenStack } from '@/components/mockups/kit/ScreenStack';
import { Carousel } from '../Carousel';
import { StickyStepsAnimator } from './StickyStepsAnimator.client';

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
  /** Optional: enables the mobile carousel's prev/next buttons and dots (a11y strings). */
  d?: Dictionary;
};

/**
 * Sticky phone + scrolling steps (spec §4.3). ≥1024: a 6-col step column and a
 * 5-col sticky phone whose ScreenStack follows the active step. <1024: no
 * sticky phone; each step is a card with its own ScreenSlice, in a carousel
 * (or a list). Without JS every step shows and the phone shows screen 1.
 */
export function StickySteps({ id, steps, screens, phoneSize, phoneLabel, side, stepMinHeight = '70svh', transition, mobileLayout = 'carousel', carouselLabel, d }: StickyStepsProps) {
  const ph = Math.round((phoneSize.desktop * 844) / 390);
  const style = { '--ph': `${ph}px`, '--step-min': stepMinHeight } as CSSProperties;
  const cards = steps.map((s) => (
    <article key={s.id} id={s.id} className="ss-step-card glass" data-step={s.id}>
      {s.label ? <p className="t-label ink-2">{s.label}</p> : null}
      <h3 className="t-h3">{s.title}</h3>
      <div className="t-body ink-2">{s.body}</div>
      <div className="ss-slice">{s.mobileSlice}</div>
    </article>
  ));
  const useCarousel = mobileLayout === 'carousel' && d;
  return (
    <div id={id} className="sticky-steps" data-side={side} data-layout={mobileLayout} style={style}>
      {useCarousel ? (
        <div className="ss-steps">
          <Carousel label={carouselLabel ?? phoneLabel} items={cards} d={d} />
        </div>
      ) : (
        <ol className={['ss-steps', mobileLayout === 'list' ? 'ss-list' : 'ss-snap'].join(' ')}>
          {cards.map((c, i) => (
            <li key={steps[i].id}>{c}</li>
          ))}
        </ol>
      )}
      <div className="ss-phone">
        <PhoneFrame size={{ mobile: phoneSize.desktop, desktop: phoneSize.desktop }} label={phoneLabel}>
          <ScreenStack transition={transition}>{screens}</ScreenStack>
        </PhoneFrame>
      </div>
      <StickyStepsAnimator sectionId={id} stepIds={steps.map((s) => s.id)} />
    </div>
  );
}
