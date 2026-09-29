'use client';

import { useEffect, useRef, useState } from 'react';
import type { StudioPlacement } from '@/lib/site-config';
import { SITE } from '@/lib/site-config';
import { track } from '@/lib/analytics';
import { Glyph } from '../icons/Glyph';

type CopyEmailProps = {
  label: string;
  copiedLabel: string;
  /** shown when copying failed and the address was selected instead (`common.copySelected`) */
  selectedLabel?: string;
  placement: StudioPlacement;
  variant?: 'text' | 'chip';
};

type Outcome = 'idle' | 'copied' | 'selected';

/**
 * Copies info@linclone.com (spec §4.2): the async Clipboard API first, then a
 * selection + `execCommand('copy')` fallback. The label says "copied" only when
 * a copy really happened; otherwise the address stays selected and the label
 * says so (⌘C / long-press), so a blocked clipboard never reports success.
 */
export function CopyEmail({ label, copiedLabel, selectedLabel, placement, variant = 'text' }: CopyEmailProps) {
  const [outcome, setOutcome] = useState<Outcome>('idle');
  const addr = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const selectAddress = () => {
    const el = addr.current;
    const sel = window.getSelection();
    if (!el || !sel) return false;
    const range = document.createRange();
    range.selectNodeContents(el);
    sel.removeAllRanges();
    sel.addRange(range);
    return true;
  };

  async function onClick() {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(SITE.contactEmail);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok && selectAddress()) {
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
    }
    track('studio_copy_email', { loc: placement });
    const next: Outcome = ok ? 'copied' : 'selected';
    setOutcome(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOutcome('idle'), next === 'copied' ? 1600 : 4000);
  }

  const text = outcome === 'copied' ? copiedLabel : outcome === 'selected' ? (selectedLabel ?? label) : label;
  return (
    <button type="button" className="copy-email" data-variant={variant} data-outcome={outcome === 'idle' ? undefined : outcome} onClick={onClick}>
      <Glyph name={outcome === 'copied' ? 'check' : 'content_copy'} size={18} />
      <span className="copy-email-label" aria-live="polite">
        {text}
      </span>
      <span ref={addr} className="copy-email-addr">
        {SITE.contactEmail}
      </span>
    </button>
  );
}
