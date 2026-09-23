'use client';

import { useEffect, useState } from 'react';

type Props = {
  code: string;
  label: string;
  copyLabel: string;
  copiedLabel: string;
};

export default function InviteCode({ code, label, copyLabel, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const selectCode = () => {
    const node = document.getElementById('invite-code');
    if (!node) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const copy = async () => {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) {
      // Clipboard API unavailable or denied (older WebViews, some in-app browsers):
      // select the code and try the legacy command; the selection stays so the
      // user can copy by hand if even that fails.
      try {
        selectCode();
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
    }
    setCopied(ok);
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md px-6 py-6 text-center">
      <div className="text-sm uppercase tracking-widest text-white/70 mb-3">{label}</div>
      <div
        id="invite-code"
        className="font-mono text-4xl sm:text-5xl font-bold tracking-[0.2em] text-white select-all break-all"
      >
        {code}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className={`mt-5 inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
          copied
            ? 'bg-emerald-500 text-white'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
        }`}
      >
        {copied ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        )}
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
