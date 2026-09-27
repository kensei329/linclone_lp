import type { CSSProperties, ReactNode } from 'react';
import { SkipLink } from '../SkipLink';

export type ExpandStageProps = {
  id: string;
  labelledBy: string;
  /** svh; mobile ≤ 200 */
  height: { mobile: number; desktop: number };
  direction: 'expand' | 'collapse';
  /** phone-screen rect at rest (start for expand, end for collapse) */
  phone: {
    desktop: { side: 'left' | 'right' | 'center'; width: number /* px, screen width */ };
    mobile: { width: string /* e.g. 'min(76vw, 300px)' */; top: string /* e.g. 'calc(var(--intro-h) + 16px)' */ };
    /** 44 / 36 */
    radius: { desktop: number; mobile: number };
  };
  /** eyebrow + H2 + lead; stays readable (colour scrubs ink→white) */
  intro: ReactNode;
  /** final full-viewport composition (server) */
  media: ReactNode;
  /** optional phone-only content shown inside the bezel before the clip starts */
  bezelScreen?: ReactNode;
  skip: { href: string; label: string };
  /** background under the phone at p=0 */
  surfaceStart: 'cream' | 'night' | 'lavender';
  /** default 'night'; 'studio' keeps the intro ink (creators command centre) */
  surfaceEnd?: 'night' | 'studio';
};

/**
 * Scroll-expand stage shell (spec §4.4). A CSS sticky stage inside a section
 * whose svh height is reserved in CSS: no GSAP pin and no pin-spacer. The
 * server/CSS state is the FINAL state (expand: full-bleed media, bezel hidden;
 * collapse: media clipped to the phone rect in pure CSS). Section animators
 * call `useExpandStage` to scrub from the start state.
 */
export function ExpandStage({ id, labelledBy, height, direction, phone, intro, media, bezelScreen, skip, surfaceStart, surfaceEnd = 'night' }: ExpandStageProps) {
  const mobileH = Math.min(height.mobile, 200);
  const style = {
    '--h-m': `${mobileH}svh`,
    '--h-d': `${height.desktop}svh`,
    '--pw-d': `${phone.desktop.width}px`,
    '--pw-m': phone.mobile.width,
    '--pt-m': phone.mobile.top,
    '--r-d': `${phone.radius.desktop}px`,
    '--r-m': `${phone.radius.mobile}px`,
  } as CSSProperties;
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-stage={direction}
      data-direction={direction}
      data-immersive=""
      data-surface={surfaceEnd === 'studio' ? 'light' : 'dark'}
      data-surface-start={surfaceStart}
      data-surface-end={surfaceEnd}
      data-phone-side={phone.desktop.side}
      style={style}
    >
      <SkipLink href={skip.href} label={skip.label} />
      <div data-stage-sticky="">
        <div data-stage-bg="start" />
        <div data-stage-bg="end" />
        <div data-stage-phone="" />
        <div data-stage-media="">
          <div data-stage-inner="">{media}</div>
        </div>
        <div data-stage-bezel="">{bezelScreen}</div>
        <div data-stage-intro="">{intro}</div>
      </div>
    </section>
  );
}
