import type { ReactNode } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import { Icon } from '@/components/site/icons/Icon';
import s from './studio.module.css';

/**
 * Shared building blocks for the LC Studio mockups (WP5, spec §7.2).
 * Server-only markup; every piece is decorative (the wrapping figure carries
 * the label) except inside `D01Bento`, which composes its own links.
 */

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/** 40px glass back button, as in every Studio sub-screen header. */
export function BackButton({ night = false }: { night?: boolean }) {
  return (
    <span className={cx(s.back, night && s.backNight)}>
      <Icon name="arrow_back" size={19} />
    </span>
  );
}

/** Sub-screen header: back · title (PJS 800 19) · optional sub and trailing slot. */
export function ScreenHeader({ title, sub, trailing }: { title: string; sub?: string; trailing?: ReactNode }) {
  return (
    <div className={s.hdr}>
      <BackButton />
      <div className={s.hdrText}>
        <span className={s.hdrTitle}>{title}</span>
        {sub ? <span className={s.hdrSub}>{sub}</span> : null}
      </div>
      {trailing ? <div className={s.hdrTrail}>{trailing}</div> : null}
    </div>
  );
}

/**
 * Setup eyebrow: `mock.studio.common.step` plus six step dots (the design's
 * "1 / 6" becomes dots, Appendix A). `active` is 0-based.
 */
export function StepHead({ d, active, title, sub }: { d: Dictionary; active: number; title: string; sub?: string }) {
  return (
    <div className={s.stepHead}>
      <div className={s.stepEyebrow}>
        <span className={s.stepLabel}>{d.mock.studio.common.step}</span>
        <span className={s.stepDots}>
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} data-on={i <= active ? '' : undefined} data-current={i === active ? '' : undefined} />
          ))}
        </span>
      </div>
      <span className={s.stepTitle}>{title}</span>
      {sub ? <span className={s.stepSub}>{sub}</span> : null}
    </div>
  );
}

/** Setup footer: glass back + cyan next (48px pills). */
export function SetupFooter({ d }: { d: Dictionary }) {
  const c = d.mock.studio.common;
  return (
    <div className={s.setupFoot}>
      <span className={s.footBack}>{c.back}</span>
      <span className={s.footNext}>
        {c.next}
        <Icon name="arrow_forward" size={17} />
      </span>
    </div>
  );
}

/**
 * Figure-free sparkline (64×18, `#00B0C2` at 45%): the shape of a trend with
 * no values or axes (spec §7.0 truth rules).
 */
const SPARKS = [
  '0,14 9,12 18,13 27,9 36,10 45,6 54,7 64,3',
  '0,12 9,13 18,10 27,11 36,7 45,9 54,5 64,4',
  '0,15 9,11 18,12 27,8 36,9 45,8 54,4 64,5',
  '0,13 9,14 18,11 27,12 36,8 45,6 54,6 64,2',
];
export function Sparkline({ seed = 0, tone = 'teal' }: { seed?: number; tone?: 'teal' | 'violet' | 'neon' }) {
  return (
    <svg className={s.spark} data-tone={tone} width="64" height="18" viewBox="0 0 64 18" fill="none" aria-hidden="true">
      <polyline points={SPARKS[seed % SPARKS.length]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Neutral placeholder where a figure would be (rounded `rgba(40,39,59,.08)`). */
export function FigureBlank({ w = 56, h = 14 }: { w?: number; h?: number }) {
  return <span className={s.blank} style={{ width: w, height: h }} />;
}

/**
 * The kit `Toggle` markup (same `.mock-toggle` styles) with a named
 * `data-toggle` hook, for the switches §7.2 addresses by name
 * (`[data-toggle="pause"]`, `[data-toggle="ai-images"]`). Flipping = toggling
 * `data-on`; row styles follow through `:has()`.
 */
export function NamedToggle({ hook, on, tone = 'teal' }: { hook: string; on: boolean; tone?: 'teal' | 'pink' | 'cyan' }) {
  return <span className="mock-toggle" data-toggle={hook} data-on={on ? '' : undefined} data-tone={tone} />;
}

/** 12px ring spinner (CSS, loops only in view). */
export function Spinner() {
  return <span className={s.spinner} data-loop="" />;
}

/**
 * Verified badge whose check can be drawn by an animator (`stroke-dashoffset`
 * 1 → 0 on `[data-draw]`, `pathLength=1`). SSR: fully drawn.
 */
export function DrawnVerified({ size = 14 }: { size?: number }) {
  return (
    <svg className={s.drawnVerified} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" data-m="verified">
      <path
        d="M12 1.6l2.5 1.9 3.1-.2 1 3 2.6 1.7-.7 3 1.4 2.8-2.3 2.1-.3 3.1-3 .8-1.8 2.6-3-.9-2.9 1.2-2-2.4-3.1-.5-.2-3.1L1.6 14l1.3-2.8-.8-3 2.5-1.8.9-3 3.1.1z"
        fill="currentColor"
      />
      <path data-draw="" d="M7.6 12.3l3 3 5.9-6.2" pathLength={1} fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset="0" />
    </svg>
  );
}
