import type { Locale } from '@/i18n/config';
import { Units } from '@/lib/units';

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
 * Scroll-driven text fill (spec §4.3). Server HTML is the filled final state.
 * STUB (WP0a): renders the text/units; WP0b adds the fill CSS and FillAnimator.
 */
export function ScrollFillText({ as: Tag, id, text, lang, mode, unit = 'phrase', tone, accent, className, driver = 'self' }: ScrollFillTextProps) {
  return (
    <Tag id={id} className={className} data-fill-tone={tone} data-fill-mode={mode} data-fill-driver={driver} data-fill-id={driver === 'external' ? id : undefined}>
      {mode === 'clip' ? (
        <span className="fill-clip">
          <Units text={text} lang={lang} mode="phrase" accent={accent} />
        </span>
      ) : (
        <Units text={text} lang={lang} mode={unit} accent={accent} />
      )}
    </Tag>
  );
}
