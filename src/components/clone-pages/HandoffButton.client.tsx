'use client';

import { useRef } from 'react';
import type { HandoffTargets } from '@/lib/clone-links';

// The copy-then-store button of the DONE-C pages (contract §2.1 steps 5–6,
// §2.3 step 3). On the tap — a user gesture, so the clipboard write is
// allowed without a prompt — the page URL is copied (the iPhone app offers
// it back through Apple's paste control on first launch), then:
//   · LINE / Instagram / X in-app browsers (html[data-inapp], set by the
//     layout's head script): the app's scheme link first (Universal / App
//     Links often do not fire there); if the page is still showing after a
//     moment, the store.
//   · everywhere else: the store (App Store on iOS/iPadOS; Google Play with
//     the URL in the Install Referrer on Android).
// No device fingerprinting: nothing about the visitor is sent anywhere.

const COPY_WAIT_MS = 700;
const APP_FALLBACK_MS = 1600;

function legacyCopy(text: string): void {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    document.execCommand('copy');
    ta.remove();
  } catch {
    /* nothing else to try; the store still opens */
  }
}

/** Starts the write inside the gesture; resolves when it settles or after a short wait. */
function copyText(text: string): Promise<void> {
  const clip = typeof navigator !== 'undefined' ? navigator.clipboard : undefined;
  if (!clip?.writeText) {
    legacyCopy(text);
    return Promise.resolve();
  }
  let write: Promise<void>;
  try {
    write = clip.writeText(text).catch(() => legacyCopy(text));
  } catch {
    legacyCopy(text);
    return Promise.resolve();
  }
  return Promise.race([write, new Promise<void>((r) => setTimeout(r, COPY_WAIT_MS))]);
}

export function HandoffButton({
  targets,
  label,
  describedBy,
  loc,
}: {
  targets: HandoffTargets;
  label: string;
  describedBy?: string;
  /** analytics `cta_click{loc}` (no slug, no code: never personal data). */
  loc: 'clone_page' | 'studio_invite';
}) {
  const busy = useRef(false);

  const onClick = () => {
    if (busy.current) return;
    busy.current = true;
    setTimeout(() => (busy.current = false), 2500);

    const ds = document.documentElement.dataset;
    const store = ds.platform === 'android' ? targets.play : targets.appStore;
    const inApp = ds.inapp !== undefined;

    void copyText(targets.copyUrl).then(() => {
      if (!inApp) {
        window.location.href = store;
        return;
      }
      const timer = setTimeout(() => {
        if (document.visibilityState === 'visible') window.location.href = store;
      }, APP_FALLBACK_MS);
      const onHide = () => {
        if (document.visibilityState === 'hidden') clearTimeout(timer);
      };
      document.addEventListener('visibilitychange', onHide, { once: true });
      window.addEventListener('pagehide', () => clearTimeout(timer), { once: true });
      window.location.href = targets.appLink;
    });
  };

  return (
    <button type="button" className="btn-primary btn-lg cp-cta" onClick={onClick} aria-describedby={describedBy} data-analytics={`cta_click:${loc}`}>
      {label}
    </button>
  );
}
