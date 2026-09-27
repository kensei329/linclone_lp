'use client';

import { useEffect, useRef, useState } from 'react';
import type { StudioPlacement } from '@/lib/site-config';
import { SITE } from '@/lib/site-config';
import { track } from '@/lib/analytics';

type CopyEmailProps = { label: string; copiedLabel: string; placement: StudioPlacement; variant?: 'text' | 'chip' };

/** Copies info@linclone.com; falls back to selecting the visible address (spec §4.2). */
export function CopyEmail({ label, copiedLabel, placement, variant = 'text' }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);
  const addr = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function onClick() {
    try {
      await navigator.clipboard.writeText(SITE.contactEmail);
    } catch {
      const el = addr.current;
      const sel = window.getSelection();
      if (el && sel) {
        const range = document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    track('studio_copy_email', { loc: placement });
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button type="button" className="copy-email" data-variant={variant} onClick={onClick}>
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
      <span ref={addr} className="sr-only">
        {SITE.contactEmail}
      </span>
    </button>
  );
}
