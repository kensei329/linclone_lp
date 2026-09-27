import 'server-only';
import { Fragment, type ReactNode } from 'react';
import { loadDefaultJapaneseParser } from 'budoux';
import type { Locale } from '@/i18n/config';

// Server-side line-break units (spec §3.8). JA phrases come from BudouX and are
// separated by <wbr>; EN splits on spaces; char mode splits graphemes. Every
// unit is a real text span (`data-u`) so fills and the caption marker can
// address it without SplitText or aria splitting.

type UnitsProps = {
  text: string;
  lang: Locale;
  mode: 'phrase' | 'word' | 'char';
  accent?: string;
  className?: string;
};

let jaParser: ReturnType<typeof loadDefaultJapaneseParser> | null = null;
const parseJa = (s: string): string[] => (jaParser ??= loadDefaultJapaneseParser()).parse(s);

const graphemes = (s: string): string[] =>
  Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s), (g) => g.segment);

/** Units for one line. Whitespace runs are kept as plain text so spacing survives. */
function segment(line: string, lang: Locale, mode: UnitsProps['mode']): { u: string; space: boolean }[] {
  if (!line) return [];
  if (mode === 'char') return graphemes(line).map((g) => ({ u: g, space: /^\s+$/.test(g) }));
  if (lang === 'ja') return parseJa(line).map((u) => ({ u, space: false }));
  return line.split(/(\s+)/).filter(Boolean).map((u) => ({ u, space: /^\s+$/.test(u) }));
}

function renderLine(line: string, lang: Locale, mode: UnitsProps['mode'], keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const units = segment(line, lang, mode);
  units.forEach(({ u, space }, i) => {
    if (space) {
      out.push(u);
      return;
    }
    out.push(
      <span data-u="" key={`${keyBase}-${i}`}>
        {u}
      </span>,
    );
    // Allowed break between JA phrases (EN already breaks at spaces).
    if (lang === 'ja' && mode !== 'char' && i < units.length - 1) out.push(<wbr key={`${keyBase}-w${i}`} />);
  });
  return out;
}

function renderText(text: string, lang: Locale, mode: UnitsProps['mode'], keyBase: string): ReactNode[] {
  return text.split('\n').flatMap((line, li) => [
    ...(li > 0 ? [<br key={`${keyBase}-br${li}`} />] : []),
    ...renderLine(line, lang, mode, `${keyBase}-${li}`),
  ]);
}

export function Units({ text, lang, mode, accent, className }: UnitsProps) {
  const at = accent ? text.indexOf(accent) : -1;
  const children =
    accent && at >= 0 ? (
      <>
        {renderText(text.slice(0, at), lang, mode, 'b')}
        <span className="fill-accent">{renderText(accent, lang, mode, 'a')}</span>
        {renderText(text.slice(at + accent.length), lang, mode, 'e')}
      </>
    ) : (
      <Fragment>{renderText(text, lang, mode, 't')}</Fragment>
    );
  return className ? <span className={className}>{children}</span> : children;
}
