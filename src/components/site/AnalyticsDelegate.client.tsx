'use client';

import { useEffect } from 'react';
import { track, type AnalyticsEvent } from '@/lib/analytics';

// One delegated listener for server-rendered links and <details> that carry
// `data-analytics="<event>:<value>"` (spec §9.5), so none of them needs to be
// a client component. Mounted once in the (site) layout.

const EVENTS: ReadonlySet<string> = new Set<AnalyticsEvent>([
  'cta_click', 'qr_open', 'demo_start', 'demo_complete', 'sticky_dismiss',
  'creators_nav', 'studio_mailto', 'studio_copy_email', 'lang_switch', 'faq_open',
]);
/** Which prop the `:<value>` part fills, per event. */
const VALUE_KEY: Partial<Record<AnalyticsEvent, string>> = { creators_nav: 'from', lang_switch: 'to', faq_open: 'id' };

function fire(el: Element) {
  const [event, value] = (el.getAttribute('data-analytics') ?? '').split(':');
  if (!EVENTS.has(event)) return;
  const e = event as AnalyticsEvent;
  const html = document.documentElement;
  const props: Record<string, string> = { lang: html.lang };
  if (value) props[VALUE_KEY[e] ?? 'loc'] = value;
  if (e === 'cta_click') props.platform = el.getAttribute('data-store') ?? html.dataset.platform ?? 'desktop';
  track(e, props);
}

export function AnalyticsDelegate(): null {
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const el = (ev.target as Element | null)?.closest?.('a[data-analytics], button[data-analytics]');
      if (el) fire(el);
    };
    // `toggle` does not bubble; capture catches it on the way down.
    const onToggle = (ev: Event) => {
      const el = ev.target;
      if (el instanceof HTMLDetailsElement && el.open && el.hasAttribute('data-analytics')) fire(el);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('toggle', onToggle, true);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('toggle', onToggle, true);
    };
  }, []);
  return null;
}
