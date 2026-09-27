'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { Glyph } from '../icons/Glyph';

type LangAvailableChipProps = { lang: Locale; href: string; label: string; dismissLabel: string };

const KEY = 'lc.langPill';

/**
 * Dismissible "English available" / 「日本語で見る」 chip under the header
 * (spec §4.1). On `/` it shows when no browser language starts with `ja`; on
 * `/en` when the first one does. It never redirects.
 */
export function LangAvailableChip({ lang, href, label, dismissLabel }: LangAvailableChipProps) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {
      /* storage blocked: still decide from the languages */
    }
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    const wantsOther = lang === 'ja' ? !langs.some((l) => l.toLowerCase().startsWith('ja')) : (langs[0] ?? '').toLowerCase().startsWith('ja');
    // navigator.languages is client-only.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (wantsOther) setShow(true);
  }, [lang]);

  if (!show) return null;
  const other: Locale = lang === 'ja' ? 'en' : 'ja';
  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(KEY, 'dismissed');
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="lang-chip glass-live" lang={other}>
      <a href={href} hrefLang={other} data-analytics={`lang_switch:${other}`}>
        {label}
      </a>
      <button type="button" aria-label={dismissLabel} lang={lang} onClick={dismiss}>
        <Glyph name="close" size={18} />
      </button>
    </div>
  );
}
