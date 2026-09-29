import type { Locale } from '@/i18n/config';
import { Units } from '@/lib/units';
import { FillAnimator } from './FillAnimator.client';

export type ScrollFillTextProps = {
  as: 'h1' | 'h2' | 'h3' | 'p';
  id?: string;
  text: string;
  lang: Locale;
  mode: 'clip' | 'units';
  unit?: 'phrase' | 'word' | 'char';
  tone: 'ink' | 'white' | 'purple' | 'studio' | 'white-on-night';
  accent?: string;
  start?: string;
  end?: string;
  scrub?: number | true;
  className?: string;
  driver?: 'self' | 'external';
};

/**
 * Scroll-driven text fill (spec §4.3). The server HTML is the filled final
 * state (real text, no aria splitting); the animator only dims content that is
 * below the fold at init, and never runs under reduced motion.
 * - clip: one background-clip:text run driven by `--fill` (0%→100%)
 * - units: each `[data-u]` tweens from --fill-off to --fill-on, staggered
 * `driver="external"` exposes `el.__fill(progress)` for a stage timeline.
 */
export function ScrollFillText({ as: Tag, id, text, lang, mode, unit, tone, accent, start = 'top 80%', end = 'bottom 45%', scrub = true, className, driver = 'self' }: ScrollFillTextProps) {
  const u = unit ?? (mode === 'units' && lang === 'en' ? 'word' : 'phrase');
  return (
    <Tag id={id} className={className} data-fill-tone={tone} data-fill-mode={mode} data-fill-driver={driver} data-fill-id={driver === 'external' ? (id ?? '') : undefined}>
      {mode === 'clip' ? (
        <span className="fill-clip">
          <Units text={text} lang={lang} mode="phrase" accent={accent} />
        </span>
      ) : (
        <Units text={text} lang={lang} mode={u} accent={accent} />
      )}
      <FillAnimator mode={mode} start={start} end={end} scrub={scrub} driver={driver} hasAccent={Boolean(accent)} />
    </Tag>
  );
}
